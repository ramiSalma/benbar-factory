import SectionBorder from '@/Components/SectionBorder';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LogoutOtherBrowserSessionsForm from '@/Pages/Profile/Partials/LogoutOtherBrowserSessionsForm';
import TwoFactorAuthenticationForm from '@/Pages/Profile/Partials/TwoFactorAuthenticationForm';
import { Head, Link } from '@inertiajs/react';

export default function Security({ confirmsTwoFactorAuthentication, sessions }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Security Settings
                </h2>
            }
        >
            <Head title="Security Settings" />

            <div className="mx-auto max-w-5xl py-8">
                <div className="mb-6 flex flex-wrap gap-3">
                    <Link href={route('profile.show')} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200">
                        Profile
                    </Link>
                    <Link href={route('security.show')} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                        Security
                    </Link>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <TwoFactorAuthenticationForm requiresConfirmation={confirmsTwoFactorAuthentication} />
                    <SectionBorder />
                    <LogoutOtherBrowserSessionsForm sessions={sessions} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
