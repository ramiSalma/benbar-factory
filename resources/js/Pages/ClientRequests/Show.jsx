import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Dashboard from '../Dashboard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ request }) {
    const destroy = () => {
        if (confirm('Are you sure you want to delete this request?')) {
            router.delete(route('client-requests.destroy', request.id));
        }
    };

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
