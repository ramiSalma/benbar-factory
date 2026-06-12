import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

function parseCahier(value) {
    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch {
        return { full_cahier_des_charges: value };
    }
}

function formatBudget(request) {
    if (!request.budget_min && !request.budget_max) {
        return "Open";
    }

    return `${request.currency || "USD"} ${request.budget_min || 0} - ${request.budget_max || "open"}`;
}

export default function Show({ request }) {
    const project = request.projects?.[0];
    const cahier = parseCahier(project?.cahier_de_charge);

    const accept = () => {
        if (!confirm("Accept this request and create the project with a cahier de charge?")) {
            return;
        }

        router.post(route("admin.client-requests.accept", request.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Admin Request: ${request.title}`} />

            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href={route("admin.client-requests.index")}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                        >
                            Back to admin requests
                        </Link>
                        <h1 className="mt-2 text-3xl font-black text-slate-950">
                            {request.title}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {request.client?.name || "Unknown client"} · {request.status.replace("_", " ")}
                        </p>
                    </div>
                    {request.status !== "accepted" && (
                        <button
                            type="button"
                            onClick={accept}
                            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
                        >
                            Accept and generate project
                        </button>
                    )}
                </div>

                <section className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                        <h2 className="text-lg font-black text-slate-950">Request demand</h2>
                        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">
                            {request.description}
                        </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-black text-slate-950">Review data</h2>
                        <dl className="mt-4 space-y-3 text-sm">
                            <div>
                                <dt className="font-bold text-slate-500">Client</dt>
                                <dd className="text-slate-900">{request.client?.name || "Unknown"}</dd>
                            </div>
                            <div>
                                <dt className="font-bold text-slate-500">Industry</dt>
                                <dd className="text-slate-900">{request.client?.client_profile?.industry || "Not provided"}</dd>
                            </div>
                            <div>
                                <dt className="font-bold text-slate-500">Budget</dt>
                                <dd className="text-slate-900">{formatBudget(request)}</dd>
                            </div>
                            <div>
                                <dt className="font-bold text-slate-500">Delivery date</dt>
                                <dd className="text-slate-900">{request.deadline || "Not provided"}</dd>
                            </div>
                        </dl>
                    </div>
                </section>

                {project && (
                    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                                    Generated project
                                </p>
                                <Link
                                    href={route("projects.show", project.id)}
                                    className="text-xl font-black text-emerald-950 hover:text-emerald-700"
                                >
                                    {project.name}
                                </Link>
                            </div>
                            <span className="w-fit rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-bold capitalize text-emerald-700">
                                {project.status}
                            </span>
                        </div>

                        {cahier && (
                            <div className="mt-5 rounded-lg border border-emerald-100 bg-white p-4">
                                <h3 className="font-black text-slate-950">Cahier de charge</h3>
                                {cahier.project_summary && (
                                    <p className="mt-2 text-sm leading-6 text-slate-700">{cahier.project_summary}</p>
                                )}
                                <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                                    {JSON.stringify(cahier, null, 2)}
                                </pre>
                            </div>
                        )}

                        {project.missions?.length > 0 && (
                            <div className="mt-5 grid gap-3 md:grid-cols-2">
                                {project.missions.map((mission) => (
                                    <div key={mission.id} className="rounded-lg border border-emerald-100 bg-white p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <h4 className="font-bold text-slate-950">{mission.title}</h4>
                                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold capitalize text-slate-600">
                                                {mission.priority}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs font-semibold text-slate-500">
                                            {mission.status} · {mission.estimated_hours || 0}h · {mission.budget}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </>
    );
}

Show.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;
