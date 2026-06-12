<?php

namespace App\Http\Controllers;

use App\Models\ClientRequest;
use App\Services\ClientRequestProjectGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ClientRequestController extends Controller
{
    /**
     * Display a listing of the user's requests.
     */
    public function index(): Response
    {
        $requests = ClientRequest::query()
            ->with(['client:id,name,email'])
            ->when(! Auth::user()->hasRole('admin'), fn ($query) => $query->where('client_user_id', Auth::id()))
            ->latest()
            ->paginate(10);

        return Inertia::render('ClientRequests/Index', [
            'requests' => $requests,
            'isAdmin' => Auth::user()->hasRole('admin'),
        ]);
    }

    public function adminIndex(): Response
    {
        abort_unless(Auth::user()->hasRole('admin'), 403);

        $requests = ClientRequest::query()
            ->with(['client:id,name,email', 'reviewer:id,name'])
            ->withCount('projects')
            ->latest()
            ->paginate(12);

        return Inertia::render('Admin/ClientRequests/Index', [
            'requests' => $requests,
        ]);
    }

    /**
     * Show create form.
     */
    public function create(): Response
    {
        
        return Inertia::render('ClientRequests/Create', [
            'statuses' => [
                'draft',
                'published',
                'in_review',
                'accepted',
                'rejected',
                'closed',
            ],

            'projectTypes' => [
                'fixed',
                'hourly',
                'milestone',
            ],

            'experienceLevels' => [
                'junior',
                'mid',
                'senior',
                'expert',
            ],
        ]);
    }

    /**
     * Store a newly created request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'budget_min' => ['nullable', 'numeric'],
            'budget_max' => ['nullable', 'numeric'],
            'currency' => ['nullable', 'string', 'max:3'],
            'deadline' => ['nullable', 'date'],
            'required_skills' => ['nullable', 'array'],
            'project_type' => ['required', 'in:fixed,hourly,milestone'],
            'experience_level' => ['nullable', 'in:junior,mid,senior,expert'],
            'estimated_duration_weeks' => ['nullable', 'integer', 'min:1'],
        ]);

        ClientRequest::create([
            ...$validated,
            'client_user_id' => Auth::user()->id,
            'status' => 'draft',
        ]);

        return redirect()
            ->route('client-requests.index')
            ->with('success', 'Request created successfully.');
    }

    /**
     * Display a request.
     */
    public function show(ClientRequest $clientRequest): Response
    {
        $this->authorizeAccess($clientRequest);

        $clientRequest->incrementViews();

        return Inertia::render('ClientRequests/Show', [
            'request' => $clientRequest->load([
                'client:id,name,email',
                'reviewer:id,name',
                'projects:id,name,client_request_id,status,cahier_de_charge,cahier_de_charge_pdf_path',
                'projects.missions:id,project_id,title,status,budget,priority,estimated_hours',
            ]),
            'isAdmin' => Auth::user()->hasRole('admin'),
        ]);
    }

    public function adminShow(ClientRequest $clientRequest): Response
    {
        abort_unless(Auth::user()->hasRole('admin'), 403);

        return Inertia::render('Admin/ClientRequests/Show', [
            'request' => $clientRequest->load([
                'client:id,name,email',
                'client.clientProfile:user_id,company_name,industry,client_type',
                'reviewer:id,name',
                'projects:id,name,client_request_id,status,cahier_de_charge,cahier_de_charge_pdf_path,budget,currency,end_date',
                'projects.missions:id,project_id,title,status,budget,priority,estimated_hours',
            ]),
        ]);
    }

    /**
     * Show edit form.
     */
    public function edit(ClientRequest $clientRequest): Response
    {
        $this->authorizeAccess($clientRequest);

        return Inertia::render('ClientRequests/Edit', [
            'request' => $clientRequest,

            'statuses' => [
                'draft',
                'published',
                'in_review',
                'accepted',
                'rejected',
                'closed',
            ],

            'projectTypes' => [
                'fixed',
                'hourly',
                'milestone',
            ],

            'experienceLevels' => [
                'junior',
                'mid',
                'senior',
                'expert',
            ],
        ]);
    }

    /**
     * Update request.
     */
    public function update(
        Request $request,
        ClientRequest $clientRequest,
        ClientRequestProjectGenerator $generator,
    )
    {
        $this->authorizeAccess($clientRequest);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'budget_min' => ['nullable', 'numeric'],
            'budget_max' => ['nullable', 'numeric'],
            'currency' => ['nullable', 'string', 'max:3'],
            'deadline' => ['nullable', 'date'],
            'required_skills' => ['nullable', 'array'],
            'project_type' => ['required', 'in:fixed,hourly,milestone'],
            'experience_level' => ['nullable', 'in:junior,mid,senior,expert'],
            'estimated_duration_weeks' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', 'in:draft,published,in_review,accepted,rejected,closed'],
        ]);

        abort_if(
            ! Auth::user()->hasRole('admin') && in_array($validated['status'], ['accepted', 'rejected', 'closed'], true),
            403,
            'Only admins can review client requests.'
        );

        $wasAccepted = $clientRequest->status === 'accepted';

        if (Auth::user()->hasRole('admin') && in_array($validated['status'], ['accepted', 'rejected'], true)) {
            $validated['reviewed_by'] = Auth::id();
            $validated['reviewed_at'] = now();
        }

        $clientRequest->update($validated);

        if (Auth::user()->hasRole('admin') && ! $wasAccepted && $clientRequest->status === 'accepted') {
            $generator->accept($clientRequest->fresh(), Auth::user());
        }

        return redirect()
            ->route('client-requests.show', $clientRequest)
            ->with('success', 'Request updated successfully.');
    }

    public function accept(
        ClientRequest $clientRequest,
        ClientRequestProjectGenerator $generator,
    ) {
        abort_unless(Auth::user()->hasRole('admin'), 403);

        $project = $generator->accept($clientRequest, Auth::user());

        if (request()->routeIs('admin.*')) {
            return redirect()
                ->route('admin.client-requests.show', $clientRequest)
                ->with('success', 'Request accepted. Project '.$project->name.' was created with a cahier de charge and missions.');
        }

        return redirect()
            ->route('client-requests.show', $clientRequest)
            ->with('success', 'Request accepted. Project '.$project->name.' was created with a cahier de charge and missions.');
    }

    /**
     * Delete request.
     */
    public function destroy(ClientRequest $clientRequest)
    {
        $this->authorizeAccess($clientRequest);

        ClientRequest::destroy($clientRequest->id);

        return redirect()->route('client-requests.index')
            ->with('success', 'Request deleted successfully.');
    }

    private function authorizeAccess(ClientRequest $clientRequest): void
    {
        abort_if(
            ! Auth::user()->hasRole('admin') && $clientRequest->client_user_id !== Auth::id(),
            403,
            'Unauthorized'
        );
    }
}
