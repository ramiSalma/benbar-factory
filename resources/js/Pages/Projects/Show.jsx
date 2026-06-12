import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

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

export default function Show({ project }) {
    const cahier = parseCahier(project.cahier_de_charge);

    return (
        <>
            <Head title={`Project: ${project.name}`} />

            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link href={route("projects.index")} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                            Back to projects
                        </Link>
                        <h1 className="mt-2 text-3xl font-black text-slate-950">{project.name}</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {project.client?.name || "Unknown client"} · {project.status.replace("_", " ")}
                        </p>
                    </div>
                    {project.client_request && (
                        <Link
                            href={route("client-requests.show", project.client_request.id)}
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            Source request
                        </Link>
                    )}
                </div>

                <section className="grid gap-4 lg:grid-cols-4">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase text-slate-400">Budget</p>
                        <p className="mt-2 text-xl font-black text-slate-950">{project.currency} {project.budget}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase text-slate-400">Type</p>
                        <p className="mt-2 text-xl font-black capitalize text-slate-950">{project.project_type}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase text-slate-400">Delivery</p>
                        <p className="mt-2 text-xl font-black text-slate-950">{project.end_date || "Open"}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase text-slate-400">Progress</p>
                        <p className="mt-2 text-xl font-black text-slate-950">{project.completion_percentage || 0}%</p>
                    </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-black text-slate-950">Description</h2>
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{project.description}</p>
                </section>

                {cahier && (
                    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-black text-slate-950">Cahier de charge</h2>
                        {cahier.project_summary && (
                            <p className="mt-3 text-sm leading-6 text-slate-700">{cahier.project_summary}</p>
                        )}
                        {cahier.full_cahier_des_charges && (
                            <div className="mt-4 max-h-[32rem] overflow-auto whitespace-pre-line rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-100">
                                {cahier.full_cahier_des_charges}
                            </div>
                        )}
                    </section>
                )}

                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-black text-slate-950">Lots and missions</h2>
                    <div className="mt-4 space-y-4">
                        {project.lots?.length > 0 ? (
                            project.lots.map((lot) => (
                                <div key={lot.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className="font-black text-slate-950">{lot.name}</h3>
                                            <p className="text-sm text-slate-500">{lot.description}</p>
                                        </div>
                                        <span className="w-fit rounded-full bg-white px-2.5 py-1 text-xs font-bold capitalize text-slate-600 ring-1 ring-slate-200">
                                            {lot.status}
                                        </span>
                                    </div>
                                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                                        {lot.missions?.map((mission) => (
                                            <div key={mission.id} className="rounded-md bg-white p-4 ring-1 ring-slate-100">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h4 className="font-bold text-slate-950">{mission.title}</h4>
                                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold capitalize text-slate-600">
                                                        {mission.priority}
                                                    </span>
                                                </div>
                                                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{mission.description}</p>
                                                <p className="mt-3 text-xs font-bold text-slate-500">
                                                    {mission.status} · {mission.estimated_hours || 0}h · {mission.budget}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">No lots or missions have been created yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

Show.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;
