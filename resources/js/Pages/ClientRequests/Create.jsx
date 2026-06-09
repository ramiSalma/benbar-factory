import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Dashboard from '../Dashboard';

export default function Create({ projectTypes, experienceLevels }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        budget_min: '',
        budget_max: '',
        currency: 'USD',
        deadline: '',
        required_skills: [],
        project_type: 'fixed',
        experience_level: 'mid',
        estimated_duration_weeks: '',
    });

    const [skillInput, setSkillInput] = useState('');

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!data.required_skills.includes(skillInput.trim())) {
                setData('required_skills', [...data.required_skills, skillInput.trim()]);
            }
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (indexToRemove) => {
        setData('required_skills', data.required_skills.filter((_, i) => i !== indexToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('client-requests.store'));
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Create Project Request" />

            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link href={route('client-requests.index')} className="text-sm font-medium text-blue-600 hover:text-indigo-600 transition-colors">
                        &larr; Back to Requests
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-2">Create Request</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Project Title *</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full rounded-xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                            placeholder="e.g. Build a Laravel SaaS Dashboard"
                        />
                        {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
                        <textarea
                            rows={5}
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full rounded-xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                            placeholder="Detail your requirements, project scope, and expectations..."
                        />
                        {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Meta Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Project Type *</label>
                            <select
                                value={data.project_type}
                                onChange={e => setData('project_type', e.target.value)}
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm capitalize"
                            >
                                {projectTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.project_type && <p className="text-rose-500 text-xs mt-1">{errors.project_type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Experience Level</label>
                            <select
                                value={data.experience_level}
                                onChange={e => setData('experience_level', e.target.value)}
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm capitalize"
                            >
                                {experienceLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                            {errors.experience_level && <p className="text-rose-500 text-xs mt-1">{errors.experience_level}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (Weeks)</label>
                            <input
                                type="number"
                                min="1"
                                value={data.estimated_duration_weeks}
                                onChange={e => setData('estimated_duration_weeks', e.target.value)}
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                            />
                            {errors.estimated_duration_weeks && <p className="text-rose-500 text-xs mt-1">{errors.estimated_duration_weeks}</p>}
                        </div>
                    </div>

                    {/* Financials Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Currency</label>
                            <input
                                type="text"
                                maxLength={3}
                                value={data.currency}
                                onChange={e => setData('currency', e.target.value.toUpperCase())}
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                            />
                            {errors.currency && <p className="text-rose-500 text-xs mt-1">{errors.currency}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Min Budget</label>
                            <input
                                type="number"
                                value={data.budget_min}
                                onChange={e => setData('budget_min', e.target.value)}
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                            />
                            {errors.budget_min && <p className="text-rose-500 text-xs mt-1">{errors.budget_min}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Max Budget</label>
                            <input
                                type="number"
                                value={data.budget_max}
                                onChange={e => setData('budget_max', e.target.value)}
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                            />
                            {errors.budget_max && <p className="text-rose-500 text-xs mt-1">{errors.budget_max}</p>}
                        </div>
                    </div>

                    {/* Deadline & Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Deadline</label>
                            <input
                                type="date"
                                value={data.deadline}
                                onChange={e => setData('deadline', e.target.value)}
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                            />
                            {errors.deadline && <p className="text-rose-500 text-xs mt-1">{errors.deadline}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Required Skills (Press Enter)</label>
                            <input
                                type="text"
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={handleAddSkill}
                                placeholder="Add a skill..."
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                            />
                            {errors.required_skills && <p className="text-rose-500 text-xs mt-1">{errors.required_skills}</p>}

                            {/* Skills Badges */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {data.required_skills.map((skill, index) => (
                                    <span key={index} className="inline-flex items-center gap-1 bg-cyan-50 border border-cyan-200 text-cyan-700 px-2.5 py-0.5 rounded-md text-xs font-medium">
                                        {skill}
                                        <button type="button" onClick={() => handleRemoveSkill(index)} className="hover:text-rose-600 font-bold">&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <Link
                            href={route('client-requests.index')}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-sm shadow-blue-200 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Saving...' : 'Create Draft'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Create.layout = (page) => <Dashboard children={page} />;
