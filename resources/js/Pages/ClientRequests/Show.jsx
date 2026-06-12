import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Dashboard from '../Dashboard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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

export default function Show({ request, isAdmin }) {
    const destroy = () => {
        if (confirm('Are you sure you want to delete this request?')) {
            router.delete(route('client-requests.destroy', request.id));
        }
    };

    const accept = () => {
        if (confirm('Accept this request and create the project, cahier de charge, and missions?')) {
            router.post(route('client-requests.accept', request.id), {}, {
                preserveScroll: true,
            });
        }
    };

    const project = request.projects?.[0];
    const cahier = parseCahier(project?.cahier_de_charge);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title={`Request: ${request.title}`} />

            <div className="max-w-4xl mx-auto">
                {/* Navigation and Top Bar */}
                <div className="flex justify-between items-center mb-6">
                    <Link href={route('client-requests.index')} className="text-sm font-medium text-blue-600 hover:text-indigo-600 transition-colors">
                        &larr; Back to Listings
                    </Link>
                    <div className="flex gap-2">
                        {isAdmin && request.status !== 'accepted' && (
                            <button
                                onClick={accept}
                                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                            >
                                Accept and Generate
                            </button>
                        )}
                        <Link
                            href={route('client-requests.edit', request.id)}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={destroy}
                            className="px-4 py-2 bg-rose-50 text-rose-600 text-sm font-medium rounded-xl hover:bg-rose-100 border border-rose-200 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {project && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                    Generated project
                                </p>
                                <h2 className="text-lg font-bold text-emerald-950">
                                    {project.name}
                                </h2>
                            </div>
                            <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-emerald-700 border border-emerald-200">
                                {project.status}
                            </span>
                        </div>
                        {cahier && (
                            <div className="mt-4 rounded-xl bg-white/80 border border-emerald-100 p-4">
                                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Cahier de charge
                                    </h3>
                                    {(cahier.pdf_url || project.cahier_de_charge_pdf_path) && (
                                        <a
                                            href={cahier.pdf_url || `/storage/${project.cahier_de_charge_pdf_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex w-fit items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                                        >
                                            Open PDF
                                        </a>
                                    )}
                                </div>
                                <p className="text-sm leading-6 text-slate-700 whitespace-pre-line max-h-72 overflow-y-auto">
                                    {cahier.full_cahier_des_charges || cahier.project_summary || project.cahier_de_charge}
                                </p>
                            </div>
                        )}
                        {project.missions?.length > 0 && (
                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                {project.missions.map((mission) => (
                                    <div
                                        key={mission.id}
                                        className="rounded-xl bg-white border border-emerald-100 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <h4 className="text-sm font-bold text-slate-900">
                                                {mission.title}
                                            </h4>
                                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold capitalize text-slate-600">
                                                {mission.priority}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                                            <span>{mission.status}</span>
                                            <span>{mission.estimated_hours ?? 0}h</span>
                                            <span>{mission.budget}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Main Dashboard Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Highlight Header banner */}
                    <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 p-6 sm:p-8 border-b border-slate-100">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
                                {request.project_type}
                            </span>
                            <span className="bg-white border border-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md capitalize">
                                Status: <strong className="text-indigo-600">{request.status.replace('_', ' ')}</strong>
                            </span>
                            <span className="text-xs text-slate-500 ml-auto bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
                                👁️ {request.views_count ?? 0} Views
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{request.title}</h1>
                    </div>

                    {/* Body contents */}
                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Description */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Scope & Details</h3>
                            <p className="text-slate-700 whitespace-pre-line leading-relaxed text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                {request.description}
                            </p>
                        </div>

                        {/* Grid metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase">Budget Bracket</h4>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                    {request.budget_min || request.budget_max ? (
                                        `${request.currency || '$'}${request.budget_min || 0} - ${request.budget_max ? `${request.currency || '$'}${request.budget_max}` : '∞'}`
                                    ) : 'Open/Negotiable'}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase">Experience Target</h4>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5 capitalize">{request.experience_level || 'Not Specified'}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase">Duration Expectation</h4>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                    {request.estimated_duration_weeks ? `${request.estimated_duration_weeks} Weeks` : 'Flexible'}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase">Application Deadline</h4>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">{request.deadline || 'No Deadline'}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase">Created By</h4>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">{request.client?.name || 'Unknown'}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase">Assigned Reviewer</h4>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">{request.reviewer?.name || 'Awaiting Allocation'}</p>
                            </div>
                        </div>

                        {/* Required skills layout */}
                        {request.required_skills && request.required_skills.length > 0 && (
                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Core Capabilities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {request.required_skills.map((skill, index) => (
                                        <span key={index} className="bg-sky-50 text-sky-700 text-xs font-medium px-3 py-1 rounded-lg border border-sky-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


Show.layout = (page) => (
    <AuthenticatedLayout>
        {page}
    </AuthenticatedLayout>
);
