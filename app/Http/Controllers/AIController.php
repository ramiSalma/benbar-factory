<?php

namespace App\Http\Controllers;

use App\Models\AiSession;

class AIController extends Controller
{
    public function storeSession()
    {
        $session = AiSession::create([
            'user_id' => auth()->id(),
            'title' => 'New Conversation',
        ]);

        return redirect()->route(
            'ai.show',
            $session
        );
    }

    public function show(AiSession $session)
    {
        return Inertia::render(
            'AI/Show',
            [
                'session' => $session,
                'messages' => $session->messages,
            ]
        );
    }
}
