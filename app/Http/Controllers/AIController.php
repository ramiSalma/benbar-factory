<?php

namespace App\Http\Controllers;

use App\Models\AiMessage;
use App\Models\AiSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OpenAI;

class AIController extends Controller
{
    public function index()
    {
        $sessions = AiSession::query()
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('AI/Index', [
            'sessions' => $sessions,
        ]);
    }

    // ---------------------------------------
    // Create new chat session
    // ---------------------------------------
    public function storeSession()
    {
        $session = AiSession::create([
            'user_id' => auth()->id(),
            'title' => 'New Conversation',
        ]);

        return redirect()->route('ai.show', $session);
    }

    // ---------------------------------------
    // Show chat UI
    // ---------------------------------------
    public function show(AiSession $session)
    {
        $this->authorizeSession($session);

        return Inertia::render('AI/Show', [
            'session' => $session->load('messages'),
        ]);
    }

    // ---------------------------------------
    // SEND MESSAGE (MAIN LOGIC 🔥)
    // ---------------------------------------
    public function sendMessage(Request $request, AiSession $session)
    {
        $this->authorizeSession($session);

        $request->validate([
            'message' => ['required', 'string'],
        ]);

        // 1. Save user message
        AiMessage::create([
            'ai_session_id' => $session->id,
            'role' => 'user',
            'content' => $request->message,
        ]);

        // 2. Build conversation history
        $messages = $session->messages()
            ->orderBy('id')
            ->get()
            ->map(fn ($m) => [
                'role' => $m->role,
                'content' => $m->content,
            ])
            ->toArray();

        // 3. Add system prompt (IMPORTANT 🧠)
        array_unshift($messages, [
            'role' => 'system',
            'content' => 'You are Benbar Factory AI assistant. You help users define software projects, estimate cost, and suggest features.',
        ]);

        // 4. Call OpenAI
        $response = OpenAI::chat()->create([
            'model' => 'gpt-4o-mini',
            'messages' => $messages,
        ]);

        $answer = $response->choices[0]->message->content;

        // 5. Save assistant reply
        AiMessage::create([
            'ai_session_id' => $session->id,
            'role' => 'assistant',
            'content' => $answer,
        ]);

        // 6. Return updated messages
        return back()->with([
            'messages' => $session->messages()->latest()->get(),
        ]);
    }

    // ---------------------------------------
    // Security check
    // ---------------------------------------
    private function authorizeSession(AiSession $session)
    {
        abort_if(
            $session->user_id !== auth()->id(),
            403
        );
    }
}
