<?php

namespace App\Http\Controllers;

use App\Models\AiMessage;
use App\Models\AiSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OpenAI\Exceptions\RateLimitException;
use OpenAI\Laravel\Facades\OpenAI;

class AIController extends Controller
{
    // List all sessions for sidebar
    public function index()
    {
        $sessions = AiSession::query()
            ->where('user_id', auth()->id())
            ->latest()
            ->get(['id', 'title', 'created_at']);

        // Redirect to latest session, or show empty state
        $latest = $sessions->first();

        return Inertia::render('AI/Index', [
            'sessions' => $sessions,
            'latestSessionId' => $latest?->id,
        ]);
    }

    // POST: create new session and redirect to it
    public function storeSession()
    {
        $session = AiSession::create([
            'user_id' => auth()->id(),
            'title' => 'New Conversation',
        ]);

        return redirect()->route('ai.show', $session);
    }

    // Show a specific session with its messages
    public function show(AiSession $session)
    {
        $this->authorizeSession($session);

        $sessions = AiSession::query()
            ->where('user_id', auth()->id())
            ->latest()
            ->get(['id', 'title', 'created_at']);

        return Inertia::render('AI/Show', [
            'session' => $session->only('id', 'title', 'created_at'),
            'messages' => $session->messages()->get(['id', 'role', 'content', 'created_at']),
            'sessions' => $sessions,
        ]);
    }

    // POST: send message and stream back reply
    public function sendMessage(Request $request, AiSession $session)
    {
        $this->authorizeSession($session);

        $request->validate([
            'message' => ['required', 'string', 'max:4000'],
        ]);

        // 1. Save user message
        AiMessage::create([
            'ai_session_id' => $session->id,
            'role' => 'user',
            'content' => $request->message,
        ]);

        // 2. Build full conversation history (ordered)
        $history = $session->messages()
            ->orderBy('id')
            ->get()
            ->map(fn ($m) => [
                'role' => $m->role,
                'content' => $m->content,
            ])
            ->toArray();

        // 3. Prepend system prompt
        $messages = array_merge([[
            'role' => 'system',
            'content' => 'You are Benbar Factory AI assistant. You help users define software projects, estimate costs, and suggest features. Be concise and practical.',
        ]], $history);

        // 4. Call OpenAI
        try {
            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => $messages,
            ]);

        }catch (RateLimitException $e) {
            sleep(2);
            throw $e;
        }

        $answer = $response->choices[0]->message->content;
        $tokensUsed = $response->usage->totalTokens ?? null;

        // 5. Save assistant reply
        AiMessage::create([
            'ai_session_id' => $session->id,
            'role' => 'assistant',
            'content' => $answer,
            'tokens_used' => $tokensUsed,
            'model' => 'gpt-4o-mini',
        ]);

        // 6. Auto-title session on first exchange
        if ($session->title === 'New Conversation') {
            $session->update([
                'title' => mb_strimwidth($request->message, 0, 50, '...'),
            ]);
        }

        // 7. Return all messages for Inertia to re-render
        return back()->with('messages',
            $session->messages()->get(['id', 'role', 'content', 'created_at'])
        );
    }

    // DELETE: remove a session
    public function destroySession(AiSession $session)
    {
        $this->authorizeSession($session);
        $session->delete();

        return redirect()->route('ai.index');
    }

    private function authorizeSession(AiSession $session): void
    {
        abort_if($session->user_id !== auth()->id(), 403, 'Unauthorized');
    }
}
