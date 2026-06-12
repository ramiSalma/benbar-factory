<?php

namespace App\Services;

use App\Models\AiMessage;
use App\Models\AiSession;
use App\Models\ClientRequest;
use App\Models\Lot;
use App\Models\Mission;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ClientRequestProjectGenerator
{
    private const CAHIER_KEYS = [
        'project_summary',
        'objectives',
        'users',
        'modules',
        'functional_requirements',
        'non_functional_requirements',
        'constraints',
        'deliverables',
        'timeline',
        'risks',
        'recommendations',
        'full_cahier_des_charges',
    ];

    private const MODEL = 'gpt-4o-mini';

    public function accept(ClientRequest $clientRequest, User $admin): Project
    {
        $existingProject = $clientRequest->projects()->with('missions')->first();

        if ($existingProject) {
            $clientRequest->update([
                'status' => 'accepted',
                'reviewed_by' => $admin->id,
                'reviewed_at' => $clientRequest->reviewed_at ?? now(),
            ]);

            return $existingProject;
        }

        $generation = $this->generateCahierDeCharge($clientRequest);

        return DB::transaction(function () use ($clientRequest, $admin, $generation): Project {
            $budget = $clientRequest->budget_max
                ?? $clientRequest->budget_min
                ?? $this->estimateBudgetFromMissions($generation['missions']);

            $project = Project::create([
                'name' => $clientRequest->title,
                'description' => $clientRequest->description,
                'cahier_de_charge' => $this->encodeCahier($generation['cahier_de_charge']),
                'budget' => $budget,
                'status' => 'open',
                'start_date' => now()->toDateString(),
                'end_date' => $clientRequest->deadline,
                'client_user_id' => $clientRequest->client_user_id,
                'client_request_id' => $clientRequest->id,
                'project_type' => $clientRequest->project_type,
                'currency' => $clientRequest->currency ?? 'USD',
                'tech_stack' => $clientRequest->required_skills ?? [],
                'tags' => $clientRequest->required_skills ?? [],
                'created_by_admin' => $admin->id,
                'admin_notes' => 'Created automatically after admin accepted client request #'.$clientRequest->id.'. AI source: '.$generation['source'].'.',
            ]);

            $pdfPath = $this->storeCahierPdf($project, $clientRequest, $generation['cahier_de_charge']);
            $cahier = [
                ...$generation['cahier_de_charge'],
                'pdf_path' => $pdfPath,
                'pdf_url' => Storage::disk('public')->url($pdfPath),
            ];

            $project->forceFill([
                'cahier_de_charge' => $this->encodeCahier($cahier),
                'cahier_de_charge_pdf_path' => $pdfPath,
            ])->save();

            $lot = Lot::create([
                'project_id' => $project->id,
                'name' => 'Lot 1 - Delivery plan',
                'description' => 'Automatically generated from the accepted client request and cahier de charge.',
                'status' => 'pending',
                'order' => 1,
                'start_date' => now()->toDateString(),
                'end_date' => $clientRequest->deadline,
                'budget' => $budget,
            ]);

            foreach ($generation['missions'] as $index => $mission) {
                Mission::create([
                    'lot_id' => $lot->id,
                    'project_id' => $project->id,
                    'title' => $mission['title'],
                    'description' => $mission['description'],
                    'budget' => $mission['budget'],
                    'deadline' => $mission['deadline'] ?? $clientRequest->deadline,
                    'status' => 'open',
                    'order' => $index + 1,
                    'estimated_hours' => $mission['estimated_hours'],
                    'required_skills' => $mission['required_skills'],
                    'priority' => $mission['priority'],
                ]);
            }

            $clientRequest->update([
                'status' => 'accepted',
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ]);

            $session = AiSession::create([
                'user_id' => $admin->id,
                'project_id' => $project->id,
                'title' => 'Cahier de charge - '.$project->name,
                'model' => $generation['model'],
                'purpose' => 'project_brief',
                'metadata' => [
                    'client_request_id' => $clientRequest->id,
                    'generated_missions' => count($generation['missions']),
                    'source' => $generation['source'],
                    'pdf_path' => $pdfPath,
                ],
            ]);

            AiMessage::create([
                'ai_session_id' => $session->id,
                'role' => 'assistant',
                'content' => $this->encodeCahier($cahier),
                'model' => $generation['model'],
            ]);

            return $project->load('missions', 'lots');
        });
    }

    private function generateCahierDeCharge(ClientRequest $clientRequest): array
    {
        $fallback = $this->fallbackGeneration($clientRequest);

        if (! config('openai.api_key') || ! class_exists(\OpenAI\Laravel\Facades\OpenAI::class)) {
            return $fallback;
        }

        try {
            $response = \OpenAI\Laravel\Facades\OpenAI::chat()->create([
                'model' => self::MODEL,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Tu es un chef de projet IT senior. Tu rediges un cahier des charges professionnel en francais et tu decoupes le projet en missions de developpement exploitables. Retourne uniquement un JSON valide, sans markdown.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $this->buildPrompt($clientRequest),
                    ],
                ],
                'response_format' => ['type' => 'json_object'],
            ]);

            $content = $response->choices[0]->message->content ?? '';
            $decoded = json_decode($content, true, flags: JSON_THROW_ON_ERROR);

            $cahier = $this->normalizeCahier($decoded, $clientRequest);
            $missions = $this->normalizeMissions($decoded['missions'] ?? [], $clientRequest);

            if ($cahier === null) {
                return $fallback;
            }

            return [
                'cahier_de_charge' => $cahier,
                'missions' => $missions !== [] ? $missions : $this->missionsFromCahier($cahier, $clientRequest),
                'model' => self::MODEL,
                'source' => 'openai',
            ];
        } catch (\Throwable $exception) {
            Log::warning('AI cahier de charge generation failed; using fallback.', [
                'client_request_id' => $clientRequest->id,
                'error' => $exception->getMessage(),
            ]);

            return $fallback;
        }
    }

    private function fallbackGeneration(ClientRequest $clientRequest): array
    {
        $skills = $clientRequest->required_skills ?: ['Product', 'Backend', 'Frontend', 'QA'];
        $budget = (float) ($clientRequest->budget_max ?? $clientRequest->budget_min ?? 4000);
        $missionBudget = round($budget / 4, 2);
        $deadline = $clientRequest->deadline?->toDateString();

        $missions = [
            [
                'title' => 'Discovery and functional specification',
                'description' => 'Clarify scope, user roles, workflows, acceptance criteria, data model, and delivery risks.',
                'estimated_hours' => 12,
                'priority' => 'high',
            ],
            [
                'title' => 'Backend architecture and API implementation',
                'description' => 'Create database structure, domain models, authorization, APIs, and server-side business rules.',
                'estimated_hours' => 32,
                'priority' => 'critical',
            ],
            [
                'title' => 'Frontend interface and user workflows',
                'description' => 'Build the client-facing screens, admin review screens, forms, validation, and responsive interactions.',
                'estimated_hours' => 28,
                'priority' => 'high',
            ],
            [
                'title' => 'QA, deployment preparation, and handover',
                'description' => 'Test key flows, fix defects, prepare deployment notes, and document handover requirements.',
                'estimated_hours' => 16,
                'priority' => 'medium',
            ],
        ];

        $formattedMissions = collect($missions)->map(fn (array $mission) => [
            ...$mission,
            'budget' => $missionBudget,
            'deadline' => $deadline,
            'required_skills' => $skills,
        ])->all();

        return [
            'cahier_de_charge' => $this->buildFallbackCahier($clientRequest, $formattedMissions),
            'missions' => $formattedMissions,
            'model' => 'local-cahier-generator',
            'source' => 'fallback',
        ];
    }

    private function buildPrompt(ClientRequest $clientRequest): string
    {
        return json_encode([
            'role' => 'Tu es un chef de projet IT expert en redaction de cahiers des charges.',
            'task' => 'Lorsqu une demande client est acceptee, analyse les informations fournies et genere automatiquement un cahier des charges professionnel en francais.',
            'output_schema' => [
                'project_summary' => 'string',
                'objectives' => ['string'],
                'users' => [[
                    'profile_name' => 'string',
                    'description' => 'string',
                    'responsibilities' => ['string'],
                    'main_permissions' => ['string'],
                ]],
                'modules' => [[
                    'name' => 'string',
                    'description' => 'string',
                    'main_features' => ['string'],
                    'priority' => 'Critique|Haute|Moyenne|Faible',
                ]],
                'functional_requirements' => ['string'],
                'non_functional_requirements' => ['string'],
                'constraints' => ['string'],
                'deliverables' => ['string'],
                'timeline' => [[
                    'phase' => 'string',
                    'description' => 'string',
                    'estimated_duration' => 'string',
                ]],
                'risks' => [[
                    'risk' => 'string',
                    'impact' => 'string',
                    'proposed_solution' => 'string',
                ]],
                'recommendations' => ['string'],
                'full_cahier_des_charges' => 'string',
            ],
            'mission_output_schema' => [[
                'title' => 'string, max 255 characters',
                'description' => 'string, detailed mission scope and acceptance criteria',
                'budget' => 'number',
                'deadline' => 'YYYY-MM-DD|null',
                'estimated_hours' => 'integer',
                'required_skills' => ['string'],
                'priority' => 'low|medium|high|critical',
            ]],
            'output_contract' => [
                'Return a root JSON object containing all cahier keys plus a missions array.',
                'The missions array must contain 3 to 10 concrete development missions.',
                'Mission budgets should sum close to the client budget when a budget exists.',
                'Mission priorities must use low, medium, high, or critical.',
            ],
            'request' => [
                'project_name' => $clientRequest->title,
                'client_name' => $clientRequest->client?->name,
                'industry' => $clientRequest->client?->clientProfile?->industry,
                'request_description' => $clientRequest->description,
                'client_requirements' => $clientRequest->required_skills,
                'budget' => $this->formatBudget($clientRequest),
                'currency' => $clientRequest->currency,
                'delivery_date' => $clientRequest->deadline?->toDateString(),
                'project_type' => $clientRequest->project_type,
                'experience_level' => $clientRequest->experience_level,
                'estimated_duration_weeks' => $clientRequest->estimated_duration_weeks,
            ],
            'required_sections' => [
                '1. Presentation du Projet: contexte, problematique, vision generale',
                '2. Objectifs du Projet: objectif principal, objectifs secondaires, valeur ajoutee attendue',
                '3. Utilisateurs Cibles: profil, description, responsabilites, permissions principales',
                '4. Modules Fonctionnels: modules detailles avec priorite',
                '5. Exigences Fonctionnelles: liste numerotee',
                '6. Exigences Non Fonctionnelles: performance, securite, disponibilite, scalabilite, compatibilite',
                '7. Contraintes du Projet: techniques, metier, reglementaires, budgetaires',
                '8. Architecture Recommandee: frontend, backend, base de donnees, services externes, hebergement',
                '9. Livrables Attendus: analyse fonctionnelle, maquettes, developpement, tests, documentation, formation, deploiement',
                '10. Planning Previsionnel: analyse, conception, developpement, tests, deploiement avec duree estimee',
                '11. Risques Potentiels: risque, impact, solution proposee',
                '12. Recommandations du Chef de Projet IA',
            ],
        ], JSON_PRETTY_PRINT);
    }

    private function normalizeCahier(array $decoded, ClientRequest $clientRequest): ?array
    {
        foreach (self::CAHIER_KEYS as $key) {
            if (! array_key_exists($key, $decoded)) {
                return null;
            }
        }

        return [
            'project_summary' => (string) $decoded['project_summary'],
            'objectives' => $this->stringList($decoded['objectives']),
            'users' => $this->normalizeUsers($decoded['users']),
            'modules' => $this->normalizeModules($decoded['modules']),
            'functional_requirements' => $this->stringList($decoded['functional_requirements']),
            'non_functional_requirements' => $this->stringList($decoded['non_functional_requirements']),
            'constraints' => $this->stringList($decoded['constraints']),
            'deliverables' => $this->stringList($decoded['deliverables']),
            'timeline' => $this->normalizeTimeline($decoded['timeline']),
            'risks' => $this->normalizeRisks($decoded['risks']),
            'recommendations' => $this->stringList($decoded['recommendations']),
            'full_cahier_des_charges' => (string) ($decoded['full_cahier_des_charges'] ?: $this->formatCahierText($clientRequest, [])),
        ];
    }

    private function buildFallbackCahier(ClientRequest $clientRequest, array $missions): array
    {
        $skills = $clientRequest->required_skills ?: ['Product', 'Backend', 'Frontend', 'QA'];
        $deadline = $clientRequest->deadline?->toDateString() ?? 'A confirmer';

        $modules = collect($missions)->map(fn (array $mission) => [
            'name' => $mission['title'],
            'description' => $mission['description'],
            'main_features' => [
                'Analyse detaillee du perimetre',
                'Implementation des fonctionnalites attendues',
                'Validation par criteres d acceptation',
            ],
            'priority' => $this->priorityLabel($mission['priority'] ?? 'medium'),
        ])->values()->all();

        $cahier = [
            'project_summary' => "Le projet {$clientRequest->title} vise a transformer la demande client en solution numerique structuree, livrable et maintenable.",
            'objectives' => [
                'Objectif principal: concevoir et livrer une solution conforme a la demande initiale.',
                'Objectifs secondaires: securiser les parcours, clarifier les responsabilites et faciliter la maintenance.',
                'Valeur ajoutee attendue: gain de temps, meilleure tracabilite et experience utilisateur professionnelle.',
            ],
            'users' => [
                [
                    'profile_name' => 'Client',
                    'description' => 'Porteur du besoin et validateur metier du projet.',
                    'responsibilities' => ['Exprimer les besoins', 'Valider les livrables', 'Suivre l avancement'],
                    'main_permissions' => ['Consulter le projet', 'Commenter les livrables', 'Valider les etapes'],
                ],
                [
                    'profile_name' => 'Administrateur',
                    'description' => 'Responsable de la gouvernance, du suivi et de la qualite de livraison.',
                    'responsibilities' => ['Piloter le projet', 'Affecter les intervenants', 'Controler la qualite'],
                    'main_permissions' => ['Gerer le projet', 'Modifier les statuts', 'Acceder aux rapports'],
                ],
            ],
            'modules' => $modules,
            'functional_requirements' => [
                '1. Permettre la gestion complete du cycle de vie du projet.',
                '2. Centraliser les informations, documents et validations.',
                '3. Gerer les utilisateurs, roles et permissions principales.',
                '4. Assurer le suivi des taches, livrables et retours client.',
            ],
            'non_functional_requirements' => [
                'Performance: temps de reponse cible inferieur a 2 secondes sur les actions courantes.',
                'Securite: authentification, autorisation par role et protection des donnees sensibles.',
                'Disponibilite: service accessible pendant les heures d exploitation prevues.',
                'Scalabilite: architecture extensible pour ajouter de nouveaux modules.',
                'Compatibilite: interface responsive compatible navigateurs modernes.',
            ],
            'constraints' => [
                "Contrainte technique: stack a confirmer selon les competences requises: ".implode(', ', $skills).'.',
                'Contrainte metier: validation progressive avec le client.',
                'Contrainte reglementaire: respect des obligations de confidentialite et de protection des donnees.',
                'Contrainte budgetaire: enveloppe estimee '.$this->formatBudget($clientRequest).'.',
            ],
            'deliverables' => [
                'Analyse fonctionnelle',
                'Maquettes',
                'Developpement',
                'Tests',
                'Documentation',
                'Formation',
                'Deploiement',
            ],
            'timeline' => [
                ['phase' => 'Analyse', 'description' => 'Cadrage du besoin, ateliers et validation du perimetre.', 'estimated_duration' => '1 semaine'],
                ['phase' => 'Conception', 'description' => 'Architecture, modelisation des donnees et maquettes.', 'estimated_duration' => '1 a 2 semaines'],
                ['phase' => 'Developpement', 'description' => 'Implementation iterative des modules prioritaires.', 'estimated_duration' => max(1, (int) $clientRequest->estimated_duration_weeks - 3).' semaines'],
                ['phase' => 'Tests', 'description' => 'Tests fonctionnels, corrections et validation recette.', 'estimated_duration' => '1 semaine'],
                ['phase' => 'Deploiement', 'description' => "Mise en production, documentation et transfert de competence avant {$deadline}.", 'estimated_duration' => '2 a 3 jours'],
            ],
            'risks' => [
                ['risk' => 'Perimetre incomplet ou evolutif', 'impact' => 'Retards et depassement budgetaire', 'proposed_solution' => 'Organiser une phase de cadrage et valider les priorites.'],
                ['risk' => 'Dependances techniques externes', 'impact' => 'Blocage de certaines integrations', 'proposed_solution' => 'Identifier les API et acces necessaires des le lancement.'],
            ],
            'recommendations' => [
                'Prevoir une recette client par module pour reduire les risques de rework.',
                'Mettre en place une documentation vivante des decisions produit et techniques.',
                'Prioriser un MVP puis enrichir la solution par lots successifs.',
            ],
            'full_cahier_des_charges' => '',
        ];

        $cahier['full_cahier_des_charges'] = $this->formatCahierText($clientRequest, $cahier);

        return $cahier;
    }

    private function missionsFromCahier(array $cahier, ClientRequest $clientRequest): array
    {
        $modules = $cahier['modules'] ?: [];

        if ($modules === []) {
            return $this->fallbackGeneration($clientRequest)['missions'];
        }

        $defaultBudget = (float) (($clientRequest->budget_max ?? $clientRequest->budget_min ?? 4000) / max(count($modules), 1));

        return collect($modules)
            ->take(12)
            ->map(function (array $module, int $index) use ($clientRequest, $defaultBudget) {
                return [
                    'title' => mb_substr($module['name'] ?? 'Module projet '.($index + 1), 0, 255),
                    'description' => $module['description'] ?? 'Mission derivee du cahier des charges.',
                    'budget' => $defaultBudget,
                    'deadline' => $clientRequest->deadline?->toDateString(),
                    'estimated_hours' => $this->estimatedHoursForPriority($module['priority'] ?? 'Moyenne'),
                    'required_skills' => $clientRequest->required_skills ?? [],
                    'priority' => $this->priorityValue($module['priority'] ?? 'Moyenne'),
                ];
            })
            ->values()
            ->all();
    }

    private function normalizeMissions(array $missions, ClientRequest $clientRequest): array
    {
        $fallback = $this->fallbackGeneration($clientRequest);
        $defaultBudget = (float) (($clientRequest->budget_max ?? $clientRequest->budget_min ?? 4000) / max(count($missions), 1));

        return collect($missions)
            ->take(12)
            ->map(function (array $mission) use ($clientRequest, $defaultBudget) {
                return [
                    'title' => mb_substr($mission['title'] ?? 'Generated mission', 0, 255),
                    'description' => $mission['description'] ?? 'Generated from the cahier de charge.',
                    'budget' => (float) ($mission['budget'] ?? $defaultBudget),
                    'deadline' => $mission['deadline'] ?? $clientRequest->deadline?->toDateString(),
                    'estimated_hours' => max(1, (int) ($mission['estimated_hours'] ?? 8)),
                    'required_skills' => $mission['required_skills'] ?? $clientRequest->required_skills ?? [],
                    'priority' => in_array($mission['priority'] ?? 'medium', ['low', 'medium', 'high', 'critical'], true)
                        ? $mission['priority']
                        : 'medium',
                ];
            })
            ->filter(fn (array $mission) => filled($mission['title']))
            ->values()
            ->all() ?: $fallback['missions'];
    }

    private function storeCahierPdf(Project $project, ClientRequest $clientRequest, array $cahier): string
    {
        $title = 'Cahier des charges - '.$project->name;
        $text = $cahier['full_cahier_des_charges'] ?? $this->formatCahierText($clientRequest, $cahier);
        $lines = $this->pdfLines($title."\n\n".$text);
        $pdf = $this->buildSimplePdf($lines);
        $path = sprintf(
            'cahiers-de-charge/project-%d-%s.pdf',
            $project->id,
            Str::slug($project->name) ?: 'cahier'
        );

        Storage::disk('public')->put($path, $pdf);

        return $path;
    }

    private function pdfLines(string $text): array
    {
        return collect(preg_split('/\R/u', $text) ?: [])
            ->flatMap(function (string $line) {
                $line = trim(Str::ascii($line));

                if ($line === '') {
                    return [''];
                }

                return explode("\n", wordwrap($line, 95, "\n", true));
            })
            ->values()
            ->all();
    }

    private function buildSimplePdf(array $lines): string
    {
        $pages = array_chunk($lines, 48);
        $objects = [
            1 => '<< /Type /Catalog /Pages 2 0 R >>',
            3 => '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        ];
        $pageIds = [];
        $nextObjectId = 4;

        foreach ($pages as $pageLines) {
            $contentId = $nextObjectId++;
            $pageId = $nextObjectId++;
            $pageIds[] = $pageId;
            $content = $this->pdfContentStream($pageLines);

            $objects[$contentId] = "<< /Length ".strlen($content)." >>\nstream\n{$content}\nendstream";
            $objects[$pageId] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents {$contentId} 0 R >>";
        }

        $objects[2] = '<< /Type /Pages /Kids ['.implode(' ', array_map(fn (int $id) => "{$id} 0 R", $pageIds)).'] /Count '.count($pageIds).' >>';
        ksort($objects);

        $pdf = "%PDF-1.4\n";
        $offsets = [0 => 0];

        foreach ($objects as $id => $object) {
            $offsets[$id] = strlen($pdf);
            $pdf .= "{$id} 0 obj\n{$object}\nendobj\n";
        }

        $xrefOffset = strlen($pdf);
        $pdf .= "xref\n0 ".(count($objects) + 1)."\n";
        $pdf .= "0000000000 65535 f \n";

        for ($id = 1; $id <= count($objects); $id++) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$id]);
        }

        $pdf .= "trailer\n<< /Size ".(count($objects) + 1)." /Root 1 0 R >>\n";
        $pdf .= "startxref\n{$xrefOffset}\n%%EOF";

        return $pdf;
    }

    private function pdfContentStream(array $lines): string
    {
        $content = "BT\n/F1 10 Tf\n50 790 Td\n14 TL\n";

        foreach ($lines as $line) {
            $content .= '('.$this->escapePdfText($line).") Tj\nT*\n";
        }

        return $content."ET";
    }

    private function escapePdfText(string $text): string
    {
        return str_replace(
            ['\\', '(', ')'],
            ['\\\\', '\\(', '\\)'],
            $text
        );
    }

    private function formatCahierText(ClientRequest $clientRequest, array $cahier): string
    {
        $skills = implode(', ', $clientRequest->required_skills ?: ['To be confirmed']);
        $budget = $this->formatBudget($clientRequest);
        $clientName = $clientRequest->client?->name ?? 'Client a confirmer';
        $industry = $clientRequest->client?->clientProfile?->industry ?? 'Secteur a confirmer';
        $modules = collect($cahier['modules'] ?? [])
            ->map(fn (array $module) => '- '.$module['name'].' (Priorite: '.$module['priority'].') : '.$module['description'])
            ->implode("\n");
        $timeline = collect($cahier['timeline'] ?? [])
            ->map(fn (array $phase) => '- '.$phase['phase'].' : '.$phase['description'].' Duree estimee: '.$phase['estimated_duration'])
            ->implode("\n");

        $modules = $modules ?: '- Modules a confirmer pendant la phase d analyse.';
        $timeline = $timeline ?: '- Planning a confirmer pendant la phase d analyse.';

        return <<<MARKDOWN
# Cahier des charges initial: {$clientRequest->title}

## Informations du projet
- Nom du projet: {$clientRequest->title}
- Client: {$clientName}
- Secteur d activite: {$industry}
- Budget estimatif: {$budget}
- Date souhaitee de livraison: {$clientRequest->deadline?->toDateString()}
- Competences ou besoins exprimes: {$skills}

## 1. Presentation du Projet
{$clientRequest->description}

## 2. Objectifs du Projet
{$this->lines($cahier['objectives'] ?? [])}

## 3. Utilisateurs Cibles
{$this->userLines($cahier['users'] ?? [])}

## 4. Modules Fonctionnels
{$modules}

## 5. Exigences Fonctionnelles
{$this->lines($cahier['functional_requirements'] ?? [])}

## 6. Exigences Non Fonctionnelles
{$this->lines($cahier['non_functional_requirements'] ?? [])}

## 7. Contraintes du Projet
{$this->lines($cahier['constraints'] ?? [])}

## 8. Architecture Recommandee
- Frontend: application web responsive adaptee aux parcours utilisateurs.
- Backend: API securisee avec logique metier centralisee.
- Base de donnees: modele relationnel structure autour des projets, utilisateurs et livrables.
- Services externes: integrations a confirmer selon le perimetre.
- Hebergement: environnement cloud ou serveur manage avec sauvegardes.

## 9. Livrables Attendus
{$this->lines($cahier['deliverables'] ?? [])}

## 10. Planning Previsionnel
{$timeline}

## 11. Risques Potentiels
{$this->riskLines($cahier['risks'] ?? [])}

## 12. Recommandations du Chef de Projet IA
{$this->lines($cahier['recommendations'] ?? [])}
MARKDOWN;
    }

    private function encodeCahier(array $cahier): string
    {
        return json_encode($cahier, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    private function stringList(mixed $items): array
    {
        return collect(is_array($items) ? $items : [])
            ->map(fn ($item) => is_scalar($item) ? trim((string) $item) : null)
            ->filter()
            ->values()
            ->all();
    }

    private function normalizeUsers(mixed $users): array
    {
        return collect(is_array($users) ? $users : [])
            ->map(fn (array $user) => [
                'profile_name' => (string) ($user['profile_name'] ?? $user['name'] ?? 'Utilisateur'),
                'description' => (string) ($user['description'] ?? ''),
                'responsibilities' => $this->stringList($user['responsibilities'] ?? []),
                'main_permissions' => $this->stringList($user['main_permissions'] ?? $user['permissions'] ?? []),
            ])
            ->values()
            ->all();
    }

    private function normalizeModules(mixed $modules): array
    {
        return collect(is_array($modules) ? $modules : [])
            ->map(fn (array $module) => [
                'name' => (string) ($module['name'] ?? 'Module'),
                'description' => (string) ($module['description'] ?? ''),
                'main_features' => $this->stringList($module['main_features'] ?? $module['features'] ?? []),
                'priority' => in_array($module['priority'] ?? '', ['Critique', 'Haute', 'Moyenne', 'Faible'], true)
                    ? $module['priority']
                    : 'Moyenne',
            ])
            ->values()
            ->all();
    }

    private function normalizeTimeline(mixed $timeline): array
    {
        return collect(is_array($timeline) ? $timeline : [])
            ->map(fn (array $phase) => [
                'phase' => (string) ($phase['phase'] ?? $phase['name'] ?? 'Phase'),
                'description' => (string) ($phase['description'] ?? ''),
                'estimated_duration' => (string) ($phase['estimated_duration'] ?? $phase['duration'] ?? 'A confirmer'),
            ])
            ->values()
            ->all();
    }

    private function normalizeRisks(mixed $risks): array
    {
        return collect(is_array($risks) ? $risks : [])
            ->map(fn (array $risk) => [
                'risk' => (string) ($risk['risk'] ?? ''),
                'impact' => (string) ($risk['impact'] ?? ''),
                'proposed_solution' => (string) ($risk['proposed_solution'] ?? $risk['solution'] ?? ''),
            ])
            ->values()
            ->all();
    }

    private function formatBudget(ClientRequest $clientRequest): string
    {
        if ($clientRequest->budget_min || $clientRequest->budget_max) {
            return sprintf(
                '%s %s - %s',
                $clientRequest->currency ?? 'USD',
                $clientRequest->budget_min ?? 0,
                $clientRequest->budget_max ?? 'ouvert'
            );
        }

        return 'A confirmer';
    }

    private function priorityLabel(string $priority): string
    {
        return match ($priority) {
            'critical' => 'Critique',
            'high' => 'Haute',
            'low' => 'Faible',
            default => 'Moyenne',
        };
    }

    private function priorityValue(string $priority): string
    {
        return match ($priority) {
            'Critique' => 'critical',
            'Haute' => 'high',
            'Faible' => 'low',
            default => 'medium',
        };
    }

    private function estimatedHoursForPriority(string $priority): int
    {
        return match ($priority) {
            'Critique' => 40,
            'Haute' => 28,
            'Faible' => 8,
            default => 16,
        };
    }

    private function lines(array $items): string
    {
        return collect($items)->map(fn (string $item) => '- '.$item)->implode("\n") ?: '- A confirmer.';
    }

    private function userLines(array $users): string
    {
        return collect($users)->map(function (array $user) {
            return '- '.$user['profile_name'].' : '.$user['description']
                .' Responsabilites: '.implode(', ', $user['responsibilities'])
                .'. Permissions: '.implode(', ', $user['main_permissions']).'.';
        })->implode("\n") ?: '- Utilisateurs a confirmer.';
    }

    private function riskLines(array $risks): string
    {
        return collect($risks)->map(fn (array $risk) => '- '.$risk['risk'].' Impact: '.$risk['impact'].' Solution proposee: '.$risk['proposed_solution'])->implode("\n") ?: '- Risques a confirmer.';
    }

    private function estimateBudgetFromMissions(array $missions): float
    {
        return collect($missions)->sum(fn (array $mission) => (float) ($mission['budget'] ?? 0)) ?: 4000;
    }
}
