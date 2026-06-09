import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';

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

export default function Dashboard({ profile, primaryRole, roles = [], requests }) {
    const user = usePage().props.auth.user;
    const displayRole = formatRole(primaryRole ?? roles[0]);
    const location = [user.city, user.country].filter(Boolean).join(', ');

    // Normalize requests prop safely to prevent reading properties of undefined
    const safeRequestsData = requests?.data ?? [];
    const safeRequestsLinks = requests?.links ?? [];

    // For deleting items directly from the list inside the dashboard
    const destroyRequest = (id) => {
        if (confirm('Are you sure you want to delete this request?')) {
            router.delete(route('client-requests.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-slate-100 text-slate-700 border-slate-200',
            published: 'bg-sky-50 text-sky-700 border-sky-200',
            in_review: 'bg-cyan-50 text-cyan-700 border-cyan-200',
            accepted: 'bg-blue-50 text-blue-700 border-blue-200',
            rejected: 'bg-rose-50 text-rose-700 border-rose-200',
            closed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

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

           
        </AuthenticatedLayout>
    );
}
