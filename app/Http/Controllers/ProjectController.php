<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $projects = Project::query()
            ->with(['client:id,name,email', 'clientRequest:id,title,status'])
            ->withCount(['missions', 'lots'])
            ->when(! $user->hasRole('admin'), function ($query) use ($user) {
                $query->where(function ($query) use ($user) {
                    $query->where('client_user_id', $user->id)
                        ->orWhere('assigned_freelancer_id', $user->id)
                        ->orWhere('qa_reviewer_id', $user->id);
                });
            })
            ->latest()
            ->paginate(12);

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'isAdmin' => $user->hasRole('admin'),
        ]);
    }

    public function show(Project $project): Response
    {
        $this->authorizeAccess($project);

        return Inertia::render('Projects/Show', [
            'project' => $project->load([
                'client:id,name,email',
                'clientRequest:id,title,status',
                'lots:id,project_id,name,description,status,order,start_date,end_date,budget',
                'lots.missions:id,lot_id,project_id,title,description,status,budget,deadline,priority,estimated_hours,order',
                'missions:id,project_id,title,description,status,budget,deadline,priority,estimated_hours,order',
                'aiSessions:id,project_id,title,created_at',
            ]),
        ]);
    }

    private function authorizeAccess(Project $project): void
    {
        $user = Auth::user();

        abort_unless(
            $user->hasRole('admin')
                || $project->client_user_id === $user->id
                || $project->assigned_freelancer_id === $user->id
                || $project->qa_reviewer_id === $user->id,
            403
        );
    }
}
