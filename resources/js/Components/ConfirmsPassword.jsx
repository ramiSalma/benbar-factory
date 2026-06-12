import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { cloneElement, useRef, useState } from 'react';

export default function ConfirmsPassword({ children, onConfirm }) {
    const [confirmingPassword, setConfirmingPassword] = useState(false);
    const passwordInput = useRef();

    const form = useForm({
        password: '',
    });

    const startConfirmingPassword = () => {
        fetch(route('password.confirmation'), {
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => response.json())
            .then((payload) => {
                if (payload.confirmed) {
                    onConfirm();
                    return;
                }

                setConfirmingPassword(true);
                setTimeout(() => passwordInput.current?.focus(), 250);
            })
            .catch(() => {
                setConfirmingPassword(true);
                setTimeout(() => passwordInput.current?.focus(), 250);
            });
    };

    const confirmPassword = (event) => {
        event.preventDefault();

        form.post(route('password.confirm.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                onConfirm();
            },
            onError: () => passwordInput.current?.focus(),
            onFinish: () => form.reset(),
        });
    };

    const closeModal = () => {
        setConfirmingPassword(false);
        form.clearErrors();
        form.reset();
    };

    return (
        <>
            {cloneElement(children, {
                onClick: startConfirmingPassword,
            })}

            <Modal show={confirmingPassword} onClose={closeModal}>
                <form onSubmit={confirmPassword} className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Confirm Password
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        For your security, please confirm your password before continuing.
                    </p>

                    <div className="mt-5">
                        <InputLabel htmlFor="confirm_password" value="Password" className="sr-only" />
                        <TextInput
                            id="confirm_password"
                            ref={passwordInput}
                            type="password"
                            value={form.data.password}
                            onChange={(event) => form.setData('password', event.target.value)}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            isFocused
                        />
                        <InputError message={form.errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Cancel
                        </SecondaryButton>

                        <PrimaryButton className="ms-3" disabled={form.processing}>
                            Confirm
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}
