<?php

namespace App\Http\Controllers;

use App\Models\ClientRequest;
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
            ->where('client_user_id', Auth::user()->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('ClientRequests/Index', [
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
    public function update(Request $request, ClientRequest $clientRequest)
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
            'status' => ['required'],
        ]);

        $clientRequest->update($validated);

        return redirect()
            ->route('client-requests.show', $clientRequest)
            ->with('success', 'Request updated successfully.');
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
            $clientRequest->client_user_id !== Auth::id(),
            403,
            'Unauthorized'
        );
    }
}
