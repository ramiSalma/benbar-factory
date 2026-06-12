import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ sessions = [] }) {
    const createSession = () => {
        router.post(route("ai.new"));
    };

    return (
        <>
            <Head title="AI Assistant" />

            <div className="min-h-[calc(100vh-65px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-4xl mx-auto">

                    {/* Top Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-slate-200/60 pb-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-sky-400 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-200">
                                    <i className="ti ti-brain text-xl block" aria-hidden="true" />
                                </div>
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    AI Architect Hub
                                </h1>
                            </div>
                            <p className="text-slate-500 mt-2 text-sm sm:text-base">
                                Brainstorm project features, get precise architecture options, or calculate dynamic cost estimates.
                            </p>
                        </div>

                        <button
                            onClick={createSession}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95 text-sm"
                        >
                            <i className="ti ti-plus text-xs" aria-hidden="true" />
                            New Conversation
                        </button>
                    </div>

                    {/* Conversations Engine Container */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                        {sessions.length === 0 ? (
                            /* Empty State Illustration view */
                            <div className="p-12 sm:p-16 text-center max-w-md mx-auto flex flex-col items-center">
                                <div className="bg-gradient-to-tr from-sky-50 to-indigo-50 p-5 rounded-2xl text-indigo-500 mb-5 border border-indigo-100/50">
                                    <i className="ti ti-messages text-4xl block" aria-hidden="true" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    No conversations yet
                                </h2>
                                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                    Initialize your first context session with the AI model to start blueprinting your functional modules.
                                </p>
                                <button
                                    onClick={createSession}
                                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-500/10 transition-all text-sm"
                                >
                                    <i className="ti ti-message-2 text-sm" aria-hidden="true" />
                                    Launch AI Chat
                                </button>
                            </div>
                        ) : (
                            /* List Matrix view */
                            <div className="divide-y divide-slate-100">
                                {sessions.map((session) => (
                                    <Link
                                        key={session.id}
                                        href={route("ai.show", session.id)}
                                        className="group block p-5 hover:bg-slate-50/70 transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-start gap-4 min-w-0">
                                                <div className="bg-slate-100 group-hover:bg-sky-50 p-2.5 rounded-xl text-slate-500 group-hover:text-sky-600 transition-colors flex-shrink-0 mt-0.5">
                                                    <i className="ti ti-message-code text-lg block" aria-hidden="true" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate text-base">
                                                        {session.title || `Conversation #${session.id}`}
                                                    </h3>
                                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                        <i className="ti ti-calendar-event" aria-hidden="true" />
                                                        Created {new Date(session.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 bg-slate-50 group-hover:bg-indigo-600 border border-slate-200/60 group-hover:border-transparent p-1.5 rounded-lg text-slate-400 group-hover:text-white shadow-sm transition-all transform group-hover:translate-x-0.5">
                                                <i className="ti ti-chevron-right text-xs font-bold block" aria-hidden="true" />
                                            </div>
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

Index.layout = (page) => (
    <AuthenticatedLayout>
        {page}
    </AuthenticatedLayout>
);