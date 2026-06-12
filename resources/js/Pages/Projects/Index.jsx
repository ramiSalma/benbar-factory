import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

const statusClasses = {
    draft: "bg-slate-100 text-slate-700 border-slate-200",
    open: "bg-sky-50 text-sky-700 border-sky-200",
    in_progress: "bg-indigo-50 text-indigo-700 border-indigo-200",
    review: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    disputed: "bg-red-50 text-red-700 border-red-200",
};

export default function Index({ projects, isAdmin }) {
    return (
        <>
            <Head title="Projects" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
                        {isAdmin ? "Admin" : "Client"}
                    </p>
                    <h1 className="text-3xl font-black text-slate-950">Projects</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Track generated projects, missions, budgets, and delivery status.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {projects.data.length === 0 ? (
                        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">
                            No projects found yet. Accepted client requests will appear here.
                        </div>
                    ) : (
                        projects.data.map((project) => (
                            <Link
                                key={project.id}
                                href={route("projects.show", project.id)}
                                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <h2 className="truncate text-lg font-black text-slate-950">
                                            {project.name}
                                        </h2>
                                        <p className="mt-1 text-xs font-semibold text-slate-500">
                                            {project.client?.name || "Unknown client"}
                                        </p>
                                    </div>
                                    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusClasses[project.status] || statusClasses.draft}`}>
                                        {project.status.replace("_", " ")}
                                    </span>
                                </div>

                                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                                    {project.description}
                                </p>

                                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-sm">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-slate-400">Budget</p>
                                        <p className="mt-1 font-bold text-slate-800">{project.currency} {project.budget}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-slate-400">Lots</p>
                                        <p className="mt-1 font-bold text-slate-800">{project.lots_count}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-slate-400">Missions</p>
                                        <p className="mt-1 font-bold text-slate-800">{project.missions_count}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {projects.links.length > 3 && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {projects.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                preserveScroll
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-md px-3 py-1.5 text-xs font-bold ${
                                    link.active
                                        ? "bg-indigo-600 text-white"
                                        : link.url
                                          ? "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                                          : "text-slate-300"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;
