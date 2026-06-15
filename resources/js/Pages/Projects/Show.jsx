import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

function parseCahier(value) {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch {
        return { full_cahier_des_charges: value };
    }
}

// Premium color maps for a luxury sapphire light dashboard
const statusThemes = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    in_progress: "bg-blue-50 text-blue-700 border-blue-200/60",
    pending: "bg-amber-50 text-amber-700 border-amber-200/60",
    default: "bg-slate-50 text-slate-700 border-slate-200"
};

const priorityThemes = {
    high: "bg-rose-50 text-rose-700 border-rose-200/60",
    medium: "bg-sky-50 text-sky-700 border-sky-200/60",
    low: "bg-slate-100 text-slate-600 border-transparent"
};

export default function Show({ project }) {
    const cahier = parseCahier(project.cahier_de_charge);
    const projectStatusKey = project.status?.toLowerCase() || 'default';

    return (
        <>
            <Head title={`Project: ${project.name}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50/20 via-white to-white text-slate-800 font-sans antialiased">
                <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Top Stats Overview Header */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-blue-100/70">
                        <div>
                            <Link 
                                href={route("projects.index")} 
                                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                                Workspace Matrix
                            </Link>
                            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                                {project.name}
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                <span className="font-semibold text-slate-700">{project.client?.name || "Anonymous Client"}</span>
                                <span className="mx-2 text-slate-300">•</span>
                                <span className="capitalize">{project.project_type || "General Project"}</span>
                            </p>
                        </div>

                        {/* Top Horizon Badges */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="bg-white border border-blue-100 p-2 px-4 rounded-xl shadow-sm shadow-blue-900/[0.01] text-xs font-medium">
                                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Budget Pool</span>
                                <span className="text-slate-950 font-bold text-sm">{project.currency} {Number(project.budget).toLocaleString()}</span>
                            </div>
                            <div className="bg-white border border-blue-100 p-2 px-4 rounded-xl shadow-sm shadow-blue-900/[0.01] text-xs font-medium">
                                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Velocity Balance</span>
                                <span className="text-blue-600 font-extrabold text-sm flex items-center gap-2">
                                    {project.completion_percentage || 0}%
                                    <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${project.completion_percentage || 0}%` }} />
                                    </div>
                                </span>
                            </div>
                            <span className={`inline-flex items-center rounded-xl border px-3.5 py-2 text-xs font-bold tracking-wide capitalize shadow-sm h-fit ${statusThemes[projectStatusKey] || statusThemes.default}`}>
                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                                {project.status.replace("_", " ")}
                            </span>
                            {project.client_request && (
                                <Link
                                    href={route("client-requests.show", project.client_request.id)}
                                    className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 shadow-sm transition-all"
                                >
                                    Source Code
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Secondary Global Panel Header */}
                    {project.description && (
                        <div className="bg-white/60 backdrop-blur-sm border border-blue-100/50 rounded-2xl p-4 text-xs leading-6 text-slate-600 max-w-4xl">
                            <span className="font-bold text-slate-400 uppercase tracking-widest block text-[9px] mb-1">Blueprint Outline</span>
                            {project.description}
                        </div>
                    )}

                    {/* Master Workspace Split Architecture */}
                    <div className="grid gap-6 lg:grid-cols-4 items-start">
                        
                        {/* KANBAN BOARD SYSTEM (Left 3 Columns) */}
                        <div className="lg:col-span-3">
                            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-100 scrollbar-track-transparent snap-x">
                                {project.lots?.length > 0 ? (
                                    project.lots.map((lot) => {
                                        // Calculations for column insights
                                        const missionCount = lot.missions?.length || 0;
                                        const totalHours = lot.missions?.reduce((acc, m) => acc + (m.estimated_hours || 0), 0) || 0;

                                        return (
                                            <div 
                                                key={lot.id} 
                                                className="w-full min-w-[320px] max-w-[360px] bg-slate-50/70 border border-blue-100/40 rounded-2xl p-4 flex flex-col snap-bleed shrink-0"
                                            >
                                                {/* Kanban Column Title Header */}
                                                <div className="flex items-start justify-between pb-3 border-b border-blue-100/40 mb-4">
                                                    <div className="space-y-0.5">
                                                        <h3 className="text-sm font-bold text-slate-900 tracking-tight line-clamp-1">{lot.name}</h3>
                                                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                                                            <span>{missionCount} tasks</span>
                                                            <span>•</span>
                                                            <span>{totalHours} hrs</span>
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold capitalize bg-white shadow-2xs ${statusThemes[lot.status?.toLowerCase()] || statusThemes.default}`}>
                                                        {lot.status?.replace("_", " ")}
                                                    </span>
                                                </div>

                                                {/* Kanban Task Container Cards Stack */}
                                                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 scrollbar-none">
                                                    {lot.missions?.map((mission) => (
                                                        <div 
                                                            key={mission.id} 
                                                            className="group bg-white rounded-xl p-4 border border-blue-100/70 shadow-xs shadow-blue-900/[0.015] hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <h4 className="font-bold text-slate-900 text-xs tracking-tight leading-medium group-hover:text-blue-600 transition-colors">
                                                                    {mission.title}
                                                                </h4>
                                                                <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded border shrink-0 ${priorityThemes[mission.priority?.toLowerCase()] || priorityThemes.low}`}>
                                                                    {mission.priority}
                                                                </span>
                                                            </div>

                                                            {mission.description && (
                                                                <p className="mt-2 line-clamp-3 text-[11px] text-slate-400 leading-relaxed">
                                                                    {mission.description}
                                                                </p>
                                                            )}

                                                            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] font-semibold">
                                                                <span className="bg-slate-50 border border-slate-200/50 px-1.5 py-0.5 rounded text-slate-600 capitalize text-[10px]">
                                                                    {mission.status?.replace("_", " ")}
                                                                </span>
                                                                <div className="flex gap-2 items-center text-slate-400 text-[10px]">
                                                                    <span>{mission.estimated_hours || 0}h</span>
                                                                    <span className="text-slate-200">•</span>
                                                                    <span className="text-slate-950 font-bold">{mission.budget}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {missionCount === 0 && (
                                                        <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-white/40">
                                                            <p className="text-[11px] text-slate-400 font-medium">Empty Lane Column</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="w-full text-center py-12 border-2 border-dashed border-blue-100 rounded-2xl bg-white/50">
                                        <p className="text-xs text-slate-400 font-medium">No system lanes found or configured for this project structure.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* HIGH-END SPECIFICATIONS INSPECTOR PANEL (Right 1 Column) */}
                        {cahier && (
                            <div className="lg:col-span-1">
                                <section className="rounded-2xl border border-blue-100/60 bg-white p-5 shadow-xl shadow-blue-900/[0.015] space-y-4 lg:sticky lg:top-4">
                                    <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 border-b border-blue-50 pb-2">Technical Dossier</h2>
                                    
                                    {(cahier.pdf_url || project.cahier_de_charge_pdf_path) && (
                                        <a
                                            href={cahier.pdf_url || `/storage/${project.cahier_de_charge_pdf_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex w-full items-center gap-2 justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/10 hover:bg-blue-700 transition-all transform active:scale-98"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                            Extract Spec Sheet PDF
                                        </a>
                                    )}
                                    
                                    {cahier.project_summary && (
                                        <div className="pt-1">
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Core Directive</h3>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-600">{cahier.project_summary}</p>
                                        </div>
                                    )}
                                    
                                    {cahier.full_cahier_des_charges && (
                                        <div className="pt-1">
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2">Payload Specifications</h3>
                                            <div className="max-h-[30vh] overflow-auto whitespace-pre-line rounded-xl bg-blue-50/40 p-3.5 text-[11px] leading-6 text-slate-600 border border-blue-100/40 scrollbar-none">
                                                {cahier.full_cahier_des_charges}
                                            </div>
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;