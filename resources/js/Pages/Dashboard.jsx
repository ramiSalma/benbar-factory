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

export default function Dashboard({ profile, primaryRole, roles = [] }) {
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

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                        <section className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <div className="flex items-center gap-4">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="h-16 w-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">
                                        {initials(user.name)}
                                    </div>
                                )}
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {user.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Role
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {(roles.length ? roles : [primaryRole])
                                            .filter(Boolean)
                                            .map((role) => (
                                                <span
                                                    key={role}
                                                    className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
                                                >
                                                    {formatRole(role)}
                                                </span>
                                            ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Status
                                    </p>
                                    <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                                        {user.status?.replace('_', ' ') ??
                                            'Active'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Location
                                    </p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {location || 'Not added yet'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <div className="flex flex-col gap-2 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {displayRole} profile
                                    </p>
                                    <h3 className="text-2xl font-semibold text-gray-900">
                                        Account overview
                                    </h3>
                                </div>
                                {profile?.profile_verified !== undefined && (
                                    <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                        {profile.profile_verified
                                            ? 'Verified'
                                            : 'Pending verification'}
                                    </span>
                                )}
                            </div>

                            <dl className="mt-6 grid gap-5 md:grid-cols-2">
                                {profileFields.map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="border-b border-gray-100 pb-4"
                                    >
                                        <dt className="text-sm font-medium text-gray-500">
                                            {label}
                                        </dt>
                                        <dd className="mt-1 break-words text-sm text-gray-900">
                                            {value || 'Not added yet'}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            {profile?.bio && (
                                <div className="mt-6">
                                    <p className="text-sm font-medium text-gray-500">
                                        Bio
                                    </p>
                                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-900">
                                        {profile.bio}
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
