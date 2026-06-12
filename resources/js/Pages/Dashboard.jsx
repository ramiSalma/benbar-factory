import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

const roleLabels = {
    admin: 'Admin',
    client: 'Client',
    freelancer: 'Freelancer',
    qa: 'QA',
};

function formatRole(role) {
    return roleLabels[role] ?? 'Member';
}

function initials(name) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
}

const statLabels = {
    users: 'Users',
    clients: 'Clients',
    freelancers: 'Freelancers',
    projects: 'Projects',
    clientRequests: 'Client requests',
};

export default function Dashboard({ profile, primaryRole, roles = [], adminStats }) {
    const user = usePage().props.auth.user;
    const displayRole = formatRole(primaryRole ?? roles[0]);
    const location = [user.city, user.country].filter(Boolean).join(', ');

    const profileFields =
        primaryRole === 'freelancer'
            ? [
                  ['Title', profile?.title],
                  ['Headline', profile?.headline],
                  ['Speciality', profile?.speciality],
                  [
                      'Hourly rate',
                      profile?.hourly_rate
                          ? `${profile.hourly_rate} ${profile.currency ?? 'USD'}`
                          : null,
                  ],
                  [
                      'Experience',
                      profile?.experience_years !== undefined
                          ? `${profile.experience_years} years`
                          : null,
                  ],
                  ['Portfolio', profile?.portfolio_url],
              ]
            : [
                  ['Client type', profile?.client_type?.replace('_', ' ')],
                  ['Company', profile?.company_name],
                  ['Industry', profile?.industry],
                  ['Phone', profile?.phone],
                  ['Website', profile?.website],
                  ['Company size', profile?.company_size],
                  ['Billing country', profile?.billing_country],
              ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                                {displayRole}
                            </p>
                            <h1 className="mt-1 text-2xl font-black text-slate-900">
                                Welcome back, {user.name}
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                {location || user.email}
                            </p>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-600 text-lg font-black text-white">
                            {initials(user.name)}
                        </div>
                    </div>
                </section>

                {primaryRole === 'admin' && adminStats && (
                    <section>
                        <div className="mb-3">
                            <h2 className="text-lg font-bold text-slate-900">Admin dashboard</h2>
                            <p className="text-sm text-slate-500">
                                Platform activity overview.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                            {Object.entries(adminStats).map(([key, value]) => (
                                <div key={key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                        {statLabels[key] ?? key}
                                    </p>
                                    <p className="mt-3 text-3xl font-black text-slate-900">
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {primaryRole !== 'admin' && (
                    <section>
                        <div className="mb-3">
                            <h2 className="text-lg font-bold text-slate-900">Profile summary</h2>
                            <p className="text-sm text-slate-500">
                                Your registration details.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {profileFields.map(([label, value]) => (
                                <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                        {label}
                                    </p>
                                    <p className="mt-2 text-sm font-semibold capitalize text-slate-900">
                                        {value || 'Not provided'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
