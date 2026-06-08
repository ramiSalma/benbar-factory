import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors, reset } = useForm({
        // STEP 1
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'client',

        // STEP 2 - CLIENT
        company_name: '',
        industry: '',
        phone: '',
        website: '',
        bio: '',

        // STEP 2 - FREELANCER
        title: '',
        speciality: '',
        hourly_rate: '',
        experience_years: '',
        portfolio_url: '',
        headline: '',
    });

    const submitStep1 = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const submitFinal = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* ================= STEP 1 ================= */}
            {step === 1 && (
                <form onSubmit={submitStep1}>
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel value="Account Type" />
                        <select
                            className="mt-1 block w-full border rounded p-2"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                        >
                            <option value="client">Client</option>
                            <option value="freelancer">Freelancer</option>
                        </select>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <PrimaryButton disabled={processing}>
                            Next
                        </PrimaryButton>
                    </div>
                </form>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
                <form onSubmit={submitFinal}>
                    {/* CLIENT FIELDS */}
                    {data.role === 'client' && (
                        <>
                            <div>
                                <InputLabel value="Company Name" />
                                <TextInput
                                    value={data.company_name}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('company_name', e.target.value)
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel value="Industry" />
                                <TextInput
                                    value={data.industry}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('industry', e.target.value)
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel value="Phone" />
                                <TextInput
                                    value={data.phone}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel value="Website" />
                                <TextInput
                                    value={data.website}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('website', e.target.value)
                                    }
                                />
                            </div>
                        </>
                    )}

                    {/* FREELANCER FIELDS */}
                    {data.role === 'freelancer' && (
                        <>
                            <div>
                                <InputLabel value="Title" />
                                <TextInput
                                    value={data.title}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel value="Speciality" />
                                <TextInput
                                    value={data.speciality}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('speciality', e.target.value)
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel value="Hourly Rate" />
                                <TextInput
                                    type="number"
                                    value={data.hourly_rate}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('hourly_rate', e.target.value)
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel value="Experience Years" />
                                <TextInput
                                    type="number"
                                    value={data.experience_years}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('experience_years', e.target.value)
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel value="Portfolio URL" />
                                <TextInput
                                    value={data.portfolio_url}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('portfolio_url', e.target.value)
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel value="Headline" />
                                <TextInput
                                    value={data.headline}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('headline', e.target.value)
                                    }
                                />
                            </div>
                        </>
                    )}

                    {/* NAVIGATION */}
                    <div className="mt-6 flex justify-between">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm text-gray-600 underline"
                        >
                            Back
                        </button>

                        <PrimaryButton disabled={processing}>
                            Finish Registration
                        </PrimaryButton>
                    </div>
                </form>
            )}
        </GuestLayout>
    );
}