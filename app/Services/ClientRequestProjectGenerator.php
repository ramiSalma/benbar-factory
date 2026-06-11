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

class ClientRequestProjectGenerator
{
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
                'cahier_de_charge' => $generation['cahier_de_charge'],
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
                'admin_notes' => 'Created automatically after admin accepted client request #'.$clientRequest->id.'.',
            ]);

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
                ],
            ]);

            AiMessage::create([
                'ai_session_id' => $session->id,
                'role' => 'assistant',
                'content' => $generation['cahier_de_charge'],
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
                'model' => 'gpt-4o-mini',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You generate software cahiers de charge and split them into executable freelance missions. Return only valid JSON.',
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

            if (! isset($decoded['cahier_de_charge'], $decoded['missions']) || ! is_array($decoded['missions'])) {
                return $fallback;
            }

            return [
                'cahier_de_charge' => $decoded['cahier_de_charge'],
                'missions' => $this->normalizeMissions($decoded['missions'], $clientRequest),
                'model' => 'gpt-4o-mini',
                'source' => 'openai',
            ];
        } catch (\Throwable) {
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
            'cahier_de_charge' => $this->formatCahierDeCharge($clientRequest, $formattedMissions),
            'missions' => $formattedMissions,
            'model' => 'local-cahier-generator',
            'source' => 'fallback',
        ];
    }

    private function buildPrompt(ClientRequest $clientRequest): string
    {
        return json_encode([
            'task' => 'Generate a cahier_de_charge and divide it into missions.',
            'output_schema' => [
                'cahier_de_charge' => 'markdown string',
                'missions' => [[
                    'title' => 'string',
                    'description' => 'string',
                    'budget' => 'number',
                    'deadline' => 'YYYY-MM-DD or null',
                    'estimated_hours' => 'integer',
                    'required_skills' => ['string'],
                    'priority' => 'low|medium|high|critical',
                ]],
            ],
            'request' => [
                'title' => $clientRequest->title,
                'description' => $clientRequest->description,
                'budget_min' => $clientRequest->budget_min,
                'budget_max' => $clientRequest->budget_max,
                'currency' => $clientRequest->currency,
                'deadline' => $clientRequest->deadline?->toDateString(),
                'required_skills' => $clientRequest->required_skills,
                'project_type' => $clientRequest->project_type,
                'experience_level' => $clientRequest->experience_level,
                'estimated_duration_weeks' => $clientRequest->estimated_duration_weeks,
            ],
        ], JSON_PRETTY_PRINT);
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

    private function formatCahierDeCharge(ClientRequest $clientRequest, array $missions): string
    {
        $skills = implode(', ', $clientRequest->required_skills ?: ['To be confirmed']);
        $budget = $clientRequest->budget_min || $clientRequest->budget_max
            ? sprintf('%s %s - %s', $clientRequest->currency ?? 'USD', $clientRequest->budget_min ?? 0, $clientRequest->budget_max ?? 'open')
            : 'To be confirmed';

        $missionLines = collect($missions)
            ->map(fn (array $mission, int $index) => ($index + 1).'. '.$mission['title'].' - '.$mission['description'])
            ->implode("\n");

        return <<<MARKDOWN
# Cahier de charge: {$clientRequest->title}

## Context
{$clientRequest->description}

## Objectives
- Transform the accepted client request into a deliverable software project.
- Define a clear execution plan with measurable missions.
- Keep budget, deadline, skills, and quality expectations visible for the project team.

## Project constraints
- Project type: {$clientRequest->project_type}
- Experience level: {$clientRequest->experience_level}
- Estimated duration: {$clientRequest->estimated_duration_weeks} weeks
- Deadline: {$clientRequest->deadline?->toDateString()}
- Budget: {$budget}
- Required skills: {$skills}

## Functional scope
- Confirm user roles, screens, workflows, and validation rules.
- Implement the required backend data model and business rules.
- Build the client-facing and admin-facing interfaces needed for delivery.
- Prepare QA checks, deployment notes, and handover documentation.

## Generated missions
{$missionLines}

## Acceptance criteria
- Every mission has a clear deliverable and can be reviewed independently.
- The final product satisfies the original client request.
- QA verifies core workflows, permissions, and data integrity before delivery.
MARKDOWN;
    }

    private function estimateBudgetFromMissions(array $missions): float
    {
        return collect($missions)->sum(fn (array $mission) => (float) ($mission['budget'] ?? 0)) ?: 4000;
    }
}
