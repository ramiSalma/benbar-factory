import { Head, Link, router } from "@inertiajs/react";

export default function Index({ sessions }) {
    const createSession = () => {
        router.post(route("ai.sessions.store"));
    };

    return (
        <>
            <Head title="AI Assistant" />

            <div className="min-h-screen bg-gray-100">
                <div className="max-w-5xl mx-auto p-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">
                                AI Assistant
                            </h1>

                            <p className="text-gray-600 mt-1">
                                Start a new conversation or continue an existing one.
                            </p>
                        </div>

                        <button
                            onClick={createSession}
                            className="px-4 py-2 rounded-lg bg-black text-white"
                        >
                            New Chat
                        </button>
                    </div>

                    {/* Sessions */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                        {sessions.length === 0 ? (
                            <div className="p-10 text-center">
                                <h2 className="text-lg font-medium">
                                    No conversations yet
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Create your first AI conversation.
                                </p>

                                <button
                                    onClick={createSession}
                                    className="mt-4 px-4 py-2 rounded-lg bg-black text-white"
                                >
                                    Start Chat
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {sessions.map((session) => (
                                    <Link
                                        key={session.id}
                                        href={route("ai.show", session.id)}
                                        className="block p-4 hover:bg-gray-50 transition"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">
                                                    {session.title || `Conversation #${session.id}`}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    Created {new Date(session.created_at).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <span className="text-gray-400">
                                                →
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
