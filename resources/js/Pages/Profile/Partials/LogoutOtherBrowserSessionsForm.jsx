import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function LogoutOtherBrowserSessionsForm({ sessions = [], className = '' }) {
    const [confirmingLogout, setConfirmingLogout] = useState(false);
    const passwordInput = useRef();

    const form = useForm({
        password: '',
    });

    const confirmLogout = () => {
        setConfirmingLogout(true);
        setTimeout(() => passwordInput.current?.focus(), 250);
    };

    const logoutOtherBrowserSessions = (event) => {
        event.preventDefault();

        form.delete(route('other-browser-sessions.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => form.reset(),
        });
    };

    const closeModal = () => {
        setConfirmingLogout(false);
        form.clearErrors();
        form.reset();
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Browser Sessions
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Manage and log out active sessions on other browsers and devices.
                </p>
            </header>

            <div className="mt-5 space-y-4">
                {sessions.length > 0 ? (
                    sessions.map((session, index) => (
                        <div key={`${session.ip_address}-${index}`} className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                                {session.agent.is_desktop ? 'PC' : 'MO'}
                            </div>

                            <div className="ms-3">
                                <div className="text-sm font-medium text-gray-700">
                                    {session.agent.platform || 'Unknown'} - {session.agent.browser || 'Unknown'}
                                </div>

                                <div className="text-xs text-gray-500">
                                    {session.ip_address},{' '}
                                    {session.is_current_device ? (
                                        <span className="font-semibold text-emerald-600">This device</span>
                                    ) : (
                                        <span>Last active {session.last_active}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                        Browser session details are available when the session driver is set to database.
                    </p>
                )}
            </div>

            <div className="mt-5">
                <PrimaryButton type="button" onClick={confirmLogout}>
                    Log Out Other Browser Sessions
                </PrimaryButton>
            </div>

            <Modal show={confirmingLogout} onClose={closeModal}>
                <form onSubmit={logoutOtherBrowserSessions} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Log Out Other Browser Sessions
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        Enter your password to confirm you want to log out from all other devices.
                    </p>

                    <div className="mt-5">
                        <TextInput
                            ref={passwordInput}
                            value={form.data.password}
                            onChange={(event) => form.setData('password', event.target.value)}
                            type="password"
                            className="mt-1 block w-full"
                            placeholder="Password"
                            autoComplete="current-password"
                        />
                        <InputError message={form.errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Cancel
                        </SecondaryButton>

                        <PrimaryButton className="ms-3" disabled={form.processing}>
                            Log Out Other Sessions
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
