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
    high: "bg-rose-50 text-rose-700 border-rose-200/50",
    medium: "bg-sky-50 text-sky-700 border-sky-200/50",
    low: "bg-slate-100 text-slate-600 border-transparent"
};

export default function Show({ project }) {
    const cahier = parseCahier(project.cahier_de_charge);
    const projectStatusKey = project.status?.toLowerCase() || 'default';

    return (
        <>
            <Head title={`Project: ${project.name}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-white text-slate-800 font-sans antialiased">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Premium Breadcrumb & Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-blue-100/70">
                        <div>
                            <Link 
                                href={route("projects.index")} 
                                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                                Projects Matrix
                            </Link>
                            <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                                {project.name}
                            </h1>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                                <span className="font-semibold text-slate-600">{project.client?.name || "Anonymous Client"}</span>
                                <span className="h-3 w-px bg-slate-200" />
                                <span className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold tracking-wide capitalize shadow-sm ${statusThemes[projectStatusKey] || statusThemes.default}`}>
                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                                    {project.status.replace("_", " ")}
                                </span>
                            </div>
                        </div>
                        
                        {project.client_request && (
                            <Link
                                href={route("client-requests.show", project.client_request.id)}
                                className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 shadow-sm shadow-blue-100/50 transition-all duration-200"
                            >
                                Source Request
                            </Link>
                        )}
                    </div>

                    {/* Premium Grid Metrics Panel */}
                    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="relative overflow-hidden rounded-2xl border border-blue-100/80 bg-white p-6 shadow-xl shadow-blue-900/[0.02] transition-all hover:shadow-md hover:border-blue-300 group">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-50 blur-xl group-hover:bg-blue-100/60 transition-all" />
                            <p className="text-xs font-bold tracking-widest uppercase text-blue-500">Allocated Budget</p>
                            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                                <span className="text-base font-medium text-blue-400 mr-1">{project.currency}</span>
                                {Number(project.budget).toLocaleString() || "0"}
                            </p>
                        </div>
                        
                        <div className="relative overflow-hidden rounded-2xl border border-blue-100/80 bg-white p-6 shadow-xl shadow-blue-900/[0.02] transition-all hover:shadow-md hover:border-blue-300">
                            <p className="text-xs font-bold tracking-widest uppercase text-blue-500">Classification</p>
                            <p className="mt-3 text-2xl font-bold capitalize text-slate-900 tracking-tight">{project.project_type || "—"}</p>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-blue-100/80 bg-white p-6 shadow-xl shadow-blue-900/[0.02] transition-all hover:shadow-md hover:border-blue-300">
                            <p className="text-xs font-bold tracking-widest uppercase text-blue-500">Target Timeline</p>
                            <p className="mt-3 text-2xl font-bold text-slate-900 tracking-tight">{project.end_date || "Continuous Dev"}</p>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-blue-100/80 bg-white p-6 shadow-xl shadow-blue-900/[0.02] transition-all hover:shadow-md hover:border-blue-300">
                            <p className="text-xs font-bold tracking-widest uppercase text-blue-500">Completion Velocity</p>
                            <div className="mt-3 flex items-center justify-between gap-4">
                                <p className="text-3xl font-black text-blue-600 tracking-tight">{project.completion_percentage || 0}%</p>
                                <div className="w-24 bg-blue-50 rounded-full h-2 overflow-hidden border border-blue-100/30">
                                    <div 
                                        className="bg-gradient-to-r from-blue-600 to-sky-400 h-2 rounded-full transition-all duration-500 shadow-sm shadow-blue-500/50" 
                                        style={{ width: `${project.completion_percentage || 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Dashboard Split Architecture */}
                    <div className="grid gap-8 lg:grid-cols-3 items-start">
                        
                        {/* Primary Functional Content (Left 2 Columns) */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Project Overview */}
                            <section className="rounded-2xl border border-blue-100/60 bg-white p-6 shadow-xl shadow-blue-900/[0.015]">
                                <h2 className="text-sm font-bold tracking-wider uppercase text-slate-400 border-b border-blue-50/80 pb-3">Project Scope Overview</h2>
                                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 font-normal">{project.description}</p>
                            </section>

                            {/* Advanced Lots & Missions Breakdown */}
                            <section className="rounded-2xl border border-blue-100/60 bg-white p-6 shadow-xl shadow-blue-900/[0.015]">
                                <h2 className="text-sm font-bold tracking-wider uppercase text-slate-400 mb-6">Execution Lots & Missions</h2>
                                <div className="space-y-8">
                                    {project.lots?.length > 0 ? (
                                        project.lots.map((lot) => (
                                            <div key={lot.id} className="relative border-l-4 border-blue-600 bg-blue-50/30 rounded-r-2xl p-5 space-y-4">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <h3 className="text-base font-black text-slate-950 tracking-tight">{lot.name}</h3>
                                                        <p className="text-sm text-slate-500 mt-0.5">{lot.description}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold capitalize shadow-sm ${statusThemes[lot.status?.toLowerCase()] || statusThemes.default}`}>
                                                        {lot.status?.replace("_", " ")}
                                                    </span>
                                                </div>
                                                
                                                {/* Internal Metric Cards */}
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    {lot.missions?.map((mission) => (
                                                        <div key={mission.id} className="flex flex-col justify-between rounded-xl bg-white p-4 shadow-sm border border-blue-100/80 hover:border-blue-300 hover:shadow transition-all duration-200">
                                                            <div>
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <h4 className="font-bold text-slate-900 text-sm tracking-tight">{mission.title}</h4>
                                                                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${priorityThemes[mission.priority?.toLowerCase()] || priorityThemes.low}`}>
                                                                        {mission.priority}
                                                                    </span>
                                                                </div>
                                                                <p className="mt-2 line-clamp-2 text-xs text-slate-500 leading-relaxed">{mission.description}</p>
                                                            </div>
                                                            <div className="mt-4 pt-3 border-t border-blue-50/50 flex items-center justify-between text-xs font-semibold">
                                                                <span className="bg-blue-50/60 border border-blue-100 px-2 py-0.5 rounded text-blue-700 capitalize text-[11px]">
                                                                    {mission.status?.replace("_", " ")}
                                                                </span>
                                                                <div className="flex gap-2 items-center text-slate-400">
                                                                    <span>{mission.estimated_hours || 0}h</span>
                                                                    <span className="text-slate-200">•</span>
                                                                    <span className="text-blue-600 font-bold">{mission.budget}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    )) : (
                                        <div className="text-center py-12 border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/20">
                                            <p className="text-sm text-slate-400 font-medium">No execution structures assigned to this blueprint layout.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Interactive Inspector Sidebar Panel (Right Column) */}
                        {cahier && (
                            <div className="lg:col-span-1">
                                <section className="rounded-2xl border border-blue-100/60 bg-white p-6 shadow-xl shadow-blue-900/[0.015] space-y-5 lg:sticky lg:top-6">
                                    <h2 className="text-sm font-bold tracking-wider uppercase text-slate-400">Technical Specs</h2>
                                    
                                    {(cahier.pdf_url || project.cahier_de_charge_pdf_path) && (
                                        <a
                                            href={cahier.pdf_url || `/storage/${project.cahier_de_charge_pdf_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex w-full items-center gap-2 justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all duration-200 transform active:scale-98"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                            View Dossier PDF
                                        </a>
                                    )}
                                    
                                    {cahier.project_summary && (
                                        <div className="pt-2">
                                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-blue-500">Core Directive</h3>
                                            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{cahier.project_summary}</p>
                                        </div>
                                    )}
                                    
                                    {cahier.full_cahier_des_charges && (
                                        <div className="pt-2">
                                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-2">Manifest Payload</h3>
                                            <div className="max-h-[22rem] overflow-auto whitespace-pre-line rounded-xl bg-blue-50/40 p-4 text-xs leading-6 text-slate-600 border border-blue-100/50 scrollbar-thin">
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