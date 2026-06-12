import ConfirmsPassword from '@/Components/ConfirmsPassword';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function csrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

async function getJson(url) {
    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrfToken(),
        },
    });

    if (!response.ok) {
        throw new Error('The security request could not be completed.');
    }

    return response.json();
}

async function postJson(url) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrfToken(),
        },
    });

    if (!response.ok) {
        throw new Error('The security request could not be completed.');
    }

    return response.json().catch(() => ({}));
}

export default function TwoFactorAuthenticationForm({ requiresConfirmation = true, className = '' }) {
    const user = usePage().props.auth.user;
    const [enabling, setEnabling] = useState(false);
    const [disabling, setDisabling] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [setupKey, setSetupKey] = useState(null);
    const [recoveryCodes, setRecoveryCodes] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [requestError, setRequestError] = useState('');

    const confirmationForm = useForm({
        code: '',
    });

    const twoFactorEnabled = !enabling && user?.two_factor_enabled;

    useEffect(() => {
        if (!twoFactorEnabled) {
            confirmationForm.reset();
            confirmationForm.clearErrors();
        }
    }, [twoFactorEnabled]);

    const loadTwoFactorArtifacts = async () => {
        const [qr, secret, codes] = await Promise.all([
            getJson(route('two-factor.qr-code')),
            getJson(route('two-factor.secret-key')),
            getJson(route('two-factor.recovery-codes')),
        ]);

        setQrCode(qr.svg);
        setSetupKey(secret.secretKey);
        setRecoveryCodes(codes);
    };

    const enableTwoFactorAuthentication = () => {
        setEnabling(true);
        setRequestError('');
        setStatusMessage('');

        router.post(route('two-factor.enable'), {}, {
            preserveScroll: true,
            onSuccess: async () => {
                try {
                    await loadTwoFactorArtifacts();
                    setConfirming(requiresConfirmation);
                    setStatusMessage(requiresConfirmation ? 'Scan the QR code, then enter a code from your authenticator app to finish setup.' : 'Two-factor authentication is enabled.');
                } catch (error) {
                    setRequestError(error.message);
                }
            },
            onError: () => setRequestError('Two-factor authentication could not be enabled.'),
            onFinish: () => setEnabling(false),
        });
    };

    const confirmTwoFactorAuthentication = () => {
        confirmationForm.post(route('two-factor.confirm'), {
            errorBag: 'confirmTwoFactorAuthentication',
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setConfirming(false);
                setQrCode(null);
                setSetupKey(null);
                setStatusMessage('Two-factor authentication is now active.');
                router.reload({ only: ['auth'] });
            },
        });
    };

    const showRecoveryCodes = async () => {
        setRequestError('');

        try {
            setRecoveryCodes(await getJson(route('two-factor.recovery-codes')));
        } catch (error) {
            setRequestError(error.message);
        }
    };

    const regenerateRecoveryCodes = async () => {
        setRequestError('');

        try {
            await postJson(route('two-factor.regenerate-recovery-codes'));
            await showRecoveryCodes();
            setStatusMessage('Recovery codes regenerated.');
        } catch (error) {
            setRequestError(error.message);
        }
    };

    const disableTwoFactorAuthentication = () => {
        setDisabling(true);
        setRequestError('');

        router.delete(route('two-factor.disable'), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirming(false);
                setQrCode(null);
                setSetupKey(null);
                setRecoveryCodes([]);
                setStatusMessage('Two-factor authentication has been disabled.');
                router.reload({ only: ['auth'] });
            },
            onError: () => setRequestError('Two-factor authentication could not be disabled.'),
            onFinish: () => setDisabling(false),
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Two-Factor Authentication
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Add a time-based one-time password challenge to your account.
                </p>
            </header>

            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
                <h3 className="text-base font-semibold text-gray-900">
                    {twoFactorEnabled
                        ? confirming
                            ? 'Finish enabling two-factor authentication'
                            : 'Two-factor authentication is enabled'
                        : 'Two-factor authentication is not enabled'}
                </h3>

                <p className="mt-2 max-w-2xl text-sm text-gray-600">
                    Use an authenticator app such as 1Password, Google Authenticator, Microsoft Authenticator, or Authy. During login, Fortify will require a valid six-digit code or one unused recovery code.
                </p>

                {statusMessage && (
                    <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                        {statusMessage}
                    </p>
                )}

                {requestError && (
                    <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                        {requestError}
                    </p>
                )}

                {twoFactorEnabled && qrCode && (
                    <div className="mt-5">
                        <p className="max-w-2xl text-sm font-semibold text-gray-700">
                            Scan this QR code or enter the setup key manually, then confirm the code generated by your authenticator app.
                        </p>

                        <div className="mt-4 inline-block rounded-lg border border-gray-200 bg-white p-3" dangerouslySetInnerHTML={{ __html: qrCode }} />

                        {setupKey && (
                            <p className="mt-3 break-all rounded-md bg-gray-50 px-3 py-2 font-mono text-sm text-gray-700">
                                {setupKey}
                            </p>
                        )}

                        {confirming && (
                            <div className="mt-4 max-w-sm">
                                <InputLabel htmlFor="code" value="Authentication code" />
                                <TextInput
                                    id="code"
                                    value={confirmationForm.data.code}
                                    onChange={(event) => confirmationForm.setData('code', event.target.value)}
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    className="mt-1 block w-full"
                                    isFocused
                                />
                                <InputError message={confirmationForm.errors.code} className="mt-2" />
                            </div>
                        )}
                    </div>
                )}

                {recoveryCodes.length > 0 && !confirming && (
                    <div className="mt-5">
                        <p className="max-w-2xl text-sm font-semibold text-gray-700">
                            Store these recovery codes securely. Each code can be used once if you lose access to your authenticator device.
                        </p>

                        <div className="mt-3 grid max-w-xl gap-1 rounded-lg bg-gray-100 px-4 py-4 font-mono text-sm text-gray-800">
                            {recoveryCodes.map((code) => (
                                <div key={code}>{code}</div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                    {!twoFactorEnabled && (
                        <ConfirmsPassword onConfirm={enableTwoFactorAuthentication}>
                            <PrimaryButton type="button" disabled={enabling}>
                                Enable
                            </PrimaryButton>
                        </ConfirmsPassword>
                    )}

                    {twoFactorEnabled && confirming && (
                        <>
                            <ConfirmsPassword onConfirm={confirmTwoFactorAuthentication}>
                                <PrimaryButton type="button" disabled={confirmationForm.processing}>
                                    Confirm
                                </PrimaryButton>
                            </ConfirmsPassword>

                            <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                                <SecondaryButton type="button" disabled={disabling}>
                                    Cancel
                                </SecondaryButton>
                            </ConfirmsPassword>
                        </>
                    )}

                    {twoFactorEnabled && !confirming && (
                        <>
                            {recoveryCodes.length > 0 ? (
                                <ConfirmsPassword onConfirm={regenerateRecoveryCodes}>
                                    <SecondaryButton type="button">
                                        Regenerate Recovery Codes
                                    </SecondaryButton>
                                </ConfirmsPassword>
                            ) : (
                                <ConfirmsPassword onConfirm={showRecoveryCodes}>
                                    <SecondaryButton type="button">
                                        Show Recovery Codes
                                    </SecondaryButton>
                                </ConfirmsPassword>
                            )}

                            <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                                <DangerButton type="button" disabled={disabling}>
                                    Disable
                                </DangerButton>
                            </ConfirmsPassword>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
