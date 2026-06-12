import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ClientRegisterForm from './Partials/ClientRegisterForm';
import FreelancerRegisterForm from './Partials/FreelancerRegisterForm';

const COUNTRIES_API_URL = 'https://restcountries.com/v3.1/all?fields=name,cca2,flag';
const CITIES_API_URL = 'https://countriesnow.space/api/v0.1/countries/cities';

const steps = ['Account', 'Profile', 'Verify', 'Submit'];
const inputClass = 'mt-1 block w-full bg-white/50 border-white/60 text-slate-900 rounded-xl placeholder-slate-400 focus:bg-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner';
const labelClass = 'text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5';
const errorClass = 'mt-1.5 text-xs font-semibold text-red-600';

async function fetchCountries(signal) {
    const response = await fetch(COUNTRIES_API_URL, { signal });

    if (!response.ok) {
        throw new Error('Unable to load countries.');
    }

    const countries = await response.json();

    if (!Array.isArray(countries)) {
        throw new Error('Invalid countries response.');
    }

    return countries
        .map((country) => ({
            name: country.name?.common,
            code: country.cca2,
            flag: country.flag,
        }))
        .filter((country) => country.name && country.code)
        .sort((a, b) => a.name.localeCompare(b.name));
}

async function fetchCities(country, signal) {
    const response = await fetch(CITIES_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country }),
        signal,
    });

    if (!response.ok) {
        throw new Error('Unable to load cities.');
    }

    const payload = await response.json();

    if (!Array.isArray(payload.data)) {
        return [];
    }

    return payload.data
        .filter((city) => typeof city === 'string' && city.trim())
        .sort((a, b) => a.localeCompare(b));
}

function csrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

function firstErrorMessage(payload, fallbackMessage) {
    const errors = payload?.errors;

    if (errors && typeof errors === 'object') {
        const firstError = Object.values(errors).flat()[0];

        if (firstError) {
            return firstError;
        }
    }

    return payload?.message ?? fallbackMessage;
}

async function postJson(url, payload) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken(),
        },
        body: JSON.stringify(payload),
    });

    const responsePayload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(firstErrorMessage(responsePayload, 'The request could not be completed.'));
    }

    return responsePayload;
}

export default function Register() {
    const [step, setStep] = useState(1);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [countriesError, setCountriesError] = useState('');
    const [citiesError, setCitiesError] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [otpMessage, setOtpMessage] = useState('');
    const [otpError, setOtpError] = useState('');
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const otpInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        country: '',
        city: '',
        phone: '',
        phone_otp_verified: false,
        client_type: 'particulier',
        contact_name: '',
        company_name: '',
        industry: '',
        website: '',
        company_size: '',
        vat_number: '',
        registration_number: '',
        department: '',
        study_office_speciality: '',
        billing_address: '',
        bio: '',
        title: '',
        speciality: '',
        hourly_rate: '',
        experience_years: '',
        portfolio_url: '',
        headline: '',
    });

    const selectedCountry = useMemo(
        () => countries.find((country) => country.name === data.country),
        [countries, data.country],
    );

    const loadCountries = useCallback(async (signal) => {
        setLoadingCountries(true);
        setCountriesError('');

        try {
            const nextCountries = await fetchCountries(signal);
            setCountries(nextCountries);
        } catch (error) {
            if (error.name !== 'AbortError') {
                setCountries([]);
                setCountriesError('Countries are unavailable right now. Please try again.');
            }
        } finally {
            if (!signal.aborted) {
                setLoadingCountries(false);
            }
        }
    }, []);

    const loadCities = useCallback(async (countryName, signal) => {
        if (!countryName) {
            setCities([]);
            return;
        }

        setLoadingCities(true);
        setCities([]);
        setCitiesError('');
        setData('city', '');

        try {
            const nextCities = await fetchCities(countryName, signal);
            setCities(nextCities);

            if (nextCities.length === 0) {
                setCitiesError('No cities found for the selected country.');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                setCities([]);
                setCitiesError('Cities are unavailable right now. Please try again.');
            }
        } finally {
            if (!signal.aborted) {
                setLoadingCities(false);
            }
        }
    }, [setData]);

    useEffect(() => {
        const controller = new AbortController();

        loadCountries(controller.signal);

        return () => controller.abort();
    }, [loadCountries]);

    useEffect(() => {
        const controller = new AbortController();

        loadCities(data.country, controller.signal);

        return () => controller.abort();
    }, [data.country, loadCities]);

    useEffect(() => {
        if (cooldown <= 0) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setCooldown((seconds) => Math.max(0, seconds - 1));
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [cooldown]);

    const progressWidth = `${((step - 1) / (steps.length - 1)) * 100}%`;
    const hasSelectedRole = Boolean(data.role);

    const canContinueAccount =
        data.name &&
        data.email &&
        data.password &&
        data.password_confirmation &&
        data.password === data.password_confirmation &&
        data.country &&
        data.city;

    const sendOtp = async () => {
        if (!data.phone.trim()) {
            setOtpError('Enter your phone number before requesting a code.');
            return;
        }

        setSendingOtp(true);
        setOtpError('');
        setOtpMessage('');
        setPhoneVerified(false);
        setData('phone_otp_verified', false);

        try {
            const payload = await postJson(route('otp.send'), {
                phone: data.phone,
            });

            setOtpSent(true);
            setOtpInput('');
            setCooldown(payload.retry_after ?? 60);
            setOtpMessage(payload.message ?? 'Verification code sent.');
            window.setTimeout(() => otpInputRef.current?.focus(), 0);
        } catch (error) {
            setOtpError(error.message);
        } finally {
            setSendingOtp(false);
        }
    };

    const verifyOtp = async () => {
        if (!otpInput.trim()) {
            setOtpError('Enter the verification code.');
            return;
        }

        setVerifyingOtp(true);
        setOtpError('');
        setOtpMessage('');

        try {
            const payload = await postJson(route('otp.verify'), {
                phone: data.phone,
                code: otpInput,
            });

            setPhoneVerified(true);
            setData('phone_otp_verified', true);
            setOtpMessage(payload.message ?? 'Phone number verified.');
        } catch (error) {
            setPhoneVerified(false);
            setData('phone_otp_verified', false);
            setOtpError(error.message);
        } finally {
            setVerifyingOtp(false);
        }
    };

    const updatePhone = (value) => {
        setData('phone', value);
        setData('phone_otp_verified', false);
        setPhoneVerified(false);
        setOtpSent(false);
        setOtpInput('');
        setOtpMessage('');
        setOtpError('');
        setCooldown(0);
    };

    const changeCountry = (countryName) => {
        setData('country', countryName);
        setData('city', '');
    };

    const changeRole = () => {
        setData('role', '');
        setStep(1);
    };

    const submitFinal = (e) => {
        e.preventDefault();

        if (!phoneVerified) {
            return;
        }

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-[#efefef]">
                <div className="hidden md:flex relative flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 overflow-hidden select-none">
                    <div className="absolute bottom-10 right-[-10%] w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10 my-auto max-w-md space-y-4">
                        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-200 bg-cyan-950/30 rounded-full backdrop-blur-sm border border-cyan-500/20">
                            Benbar Factory
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                            Choose your workspace and verify your identity
                        </h1>
                        <p className="text-blue-100/80 text-base font-medium leading-relaxed">
                            Start as a client or freelancer, complete the matching profile, then verify your phone.
                        </p>
                    </div>
                </div>

                <div className="relative min-h-screen flex items-center justify-center md:p-12 overflow-y-auto">
                    <div className="absolute top-1/4 right-12 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 left-12 w-60 h-60 bg-indigo-300/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10 w-full p-6 md:p-8 transition-all duration-300">
                        <div className="relative z-10 mb-6 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                                Create <span className="text-blue-600">Account</span>
                            </h2>
                            <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">
                                {hasSelectedRole ? `Step ${step} of ${steps.length}: ${steps[step - 1]}` : 'Select the account type you want to create'}
                            </p>
                        </div>

                        {hasSelectedRole && (
                            <div className="relative z-10 mb-8 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur-sm">
                                <div className="relative h-2 rounded-full bg-slate-200">
                                    <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300" style={{ width: progressWidth }}></div>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    {steps.map((label, index) => {
                                        const stepNumber = index + 1;
                                        const isActive = stepNumber === step;
                                        const isDone = stepNumber < step;

                                        return (
                                            <button
                                                type="button"
                                                key={label}
                                                onClick={() => isDone && setStep(stepNumber)}
                                                className={`flex items-center gap-2 rounded-xl px-2 py-2 text-left transition ${
                                                    isActive
                                                        ? 'bg-indigo-50 text-indigo-700'
                                                        : isDone
                                                          ? 'text-slate-800 hover:bg-white/80'
                                                          : 'text-slate-400'
                                                }`}
                                            >
                                                <span
                                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                                        isDone
                                                            ? 'bg-emerald-500 text-white'
                                                            : isActive
                                                              ? 'bg-indigo-600 text-white'
                                                              : 'bg-slate-200 text-slate-500'
                                                    }`}
                                                >
                                                    {isDone ? 'OK' : stepNumber}
                                                </span>
                                                <span className="text-xs font-black uppercase tracking-wide">{label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {!hasSelectedRole && (
                            <div className="relative z-10 space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {[
                                        ['client', 'Client', 'I need talent for projects'],
                                        ['freelancer', 'Freelancer', 'I want to work on missions'],
                                    ].map(([role, label, helper]) => (
                                        <button
                                            type="button"
                                            key={role}
                                            onClick={() => {
                                                setData('role', role);
                                                setStep(1);
                                            }}
                                            className="min-h-36 rounded-lg border border-white/60 bg-white/50 p-5 text-left text-slate-700 transition hover:border-indigo-400 hover:bg-white hover:text-indigo-800 hover:shadow-sm"
                                        >
                                            <span className="block text-lg font-black">{label}</span>
                                            <span className="mt-2 block text-sm font-medium text-slate-500">{helper}</span>
                                        </button>
                                    ))}
                                </div>
                                <InputError message={errors.role} className={errorClass} />
                            </div>
                        )}

                        {hasSelectedRole && step === 1 && (
                            <form onSubmit={(e) => { e.preventDefault(); canContinueAccount && setStep(2); }} className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between rounded-xl border border-white/70 bg-white/45 px-4 py-3 text-sm font-bold text-slate-700">
                                    <span>Account type: {data.role === 'client' ? 'Client' : 'Freelancer'}</span>
                                    <button type="button" onClick={changeRole} className="text-xs uppercase tracking-wide text-indigo-700 hover:text-indigo-900">
                                        Change
                                    </button>
                                </div>

                                <div>
                                    <InputLabel value="Name" className={labelClass} />
                                    <TextInput value={data.name} className={inputClass} onChange={(e) => setData('name', e.target.value)} placeholder="John Doe" required />
                                    <InputError message={errors.name} className={errorClass} />
                                </div>

                                <div>
                                    <InputLabel value="Email Address" className={labelClass} />
                                    <TextInput type="email" value={data.email} className={inputClass} onChange={(e) => setData('email', e.target.value)} placeholder="john@example.com" required />
                                    <InputError message={errors.email} className={errorClass} />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel value="Country" className={labelClass} />
                                        <select
                                            className="mt-1 block w-full rounded-xl border-white/60 bg-white/50 p-2.5 text-slate-900 shadow-inner focus:bg-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 outline-none text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
                                            value={data.country}
                                            onChange={(e) => changeCountry(e.target.value)}
                                            disabled={loadingCountries || countries.length === 0}
                                        >
                                            <option value="">
                                                {loadingCountries ? 'Loading countries...' : 'Select a country'}
                                            </option>
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.name}>
                                                    {country.flag} {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className={`mt-1 text-[11px] font-semibold ${countriesError ? 'text-red-600' : 'text-slate-500'}`}>
                                            {countriesError || (loadingCountries ? 'Loading from countries API...' : 'Countries are loaded dynamically with flags.')}
                                        </p>
                                        <InputError message={errors.country} className={errorClass} />
                                    </div>

                                    <div>
                                        <InputLabel value="City" className={labelClass} />
                                        <select
                                            className="mt-1 block w-full rounded-xl border-white/60 bg-white/50 p-2.5 text-slate-900 shadow-inner focus:bg-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 outline-none text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            disabled={!data.country || loadingCities || cities.length === 0}
                                        >
                                            <option value="">
                                                {loadingCities ? 'Loading cities...' : 'Select a city'}
                                            </option>
                                            {cities.map((city) => (
                                                <option key={city} value={city}>
                                                    {selectedCountry?.flag} {city}
                                                </option>
                                            ))}
                                        </select>
                                        <p className={`mt-1 text-[11px] font-semibold ${citiesError ? 'text-red-600' : 'text-slate-500'}`}>
                                            {citiesError || (loadingCities ? 'Loading from cities API...' : 'Cities update when the country changes.')}
                                        </p>
                                        <InputError message={errors.city} className={errorClass} />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel value="Password" className={labelClass} />
                                        <TextInput type="password" value={data.password} className={inputClass} onChange={(e) => setData('password', e.target.value)} placeholder="********" required />
                                        <InputError message={errors.password} className={errorClass} />
                                    </div>

                                    <div>
                                        <InputLabel value="Confirm Password" className={labelClass} />
                                        <TextInput type="password" value={data.password_confirmation} className={inputClass} onChange={(e) => setData('password_confirmation', e.target.value)} placeholder="********" required />
                                        <InputError message={errors.password_confirmation} className={errorClass} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end pt-3">
                                    <button disabled={!canContinueAccount} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                                        Continue
                                    </button>
                                </div>
                            </form>
                        )}

                        {hasSelectedRole && step === 2 && (
                            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="relative z-10 space-y-4">
                                {data.role === 'client' ? (
                                    <ClientRegisterForm data={data} setData={setData} errors={errors} />
                                ) : (
                                    <FreelancerRegisterForm data={data} setData={setData} errors={errors} />
                                )}

                                <div className="flex items-center justify-between pt-3">
                                    <button type="button" onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-slate-800">
                                        Back
                                    </button>
                                    <button className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-500">
                                        Continue to verification
                                    </button>
                                </div>
                            </form>
                        )}

                        {hasSelectedRole && step === 3 && (
                            <form onSubmit={(e) => { e.preventDefault(); phoneVerified && setStep(4); }} className="relative z-10 space-y-4">
                                <div>
                                    <InputLabel value="Phone Verification" className={labelClass} />
                                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                                        <TextInput value={data.phone} className={inputClass} onChange={(e) => updatePhone(e.target.value)} placeholder="+212 600 000 000" required />
                                        <button
                                            type="button"
                                            onClick={sendOtp}
                                            disabled={sendingOtp || cooldown > 0 || phoneVerified}
                                            className="mt-1 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {sendingOtp ? 'Sending...' : otpSent ? (cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code') : 'Send code'}
                                        </button>
                                    </div>
                                    <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                                        <TextInput
                                            ref={otpInputRef}
                                            value={otpInput}
                                            className={inputClass}
                                            onChange={(e) => setOtpInput(e.target.value)}
                                            placeholder="6-digit code"
                                            inputMode="numeric"
                                            disabled={!otpSent || phoneVerified}
                                        />
                                        <button
                                            type="button"
                                            onClick={verifyOtp}
                                            disabled={!otpSent || verifyingOtp || phoneVerified}
                                            className="mt-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {verifyingOtp ? 'Verifying...' : phoneVerified ? 'Verified' : 'Verify'}
                                        </button>
                                    </div>
                                    {otpMessage && (
                                        <p className={`mt-2 text-xs font-semibold ${phoneVerified ? 'text-emerald-600' : 'text-slate-600'}`}>
                                            {otpMessage}
                                        </p>
                                    )}
                                    {otpError && (
                                        <p className="mt-2 text-xs font-semibold text-red-600">
                                            {otpError}
                                        </p>
                                    )}
                                    <InputError message={errors.phone} className={errorClass} />
                                    <InputError message={errors.phone_otp_verified} className={errorClass} />
                                </div>

                                <div className="flex items-center justify-between pt-3">
                                    <button type="button" onClick={() => setStep(2)} className="text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-slate-800">
                                        Back
                                    </button>
                                    <button disabled={!phoneVerified} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                                        Continue
                                    </button>
                                </div>
                            </form>
                        )}

                        {hasSelectedRole && step === 4 && (
                            <form onSubmit={submitFinal} className="relative z-10 space-y-4">
                                <div className="rounded-xl border border-white/70 bg-white/45 px-4 py-4 text-sm font-semibold text-slate-700">
                                    <p className="text-xs font-black uppercase tracking-wide text-emerald-600">Phone verified</p>
                                    <p className="mt-1">{data.phone}</p>
                                </div>

                                <div className="flex items-center justify-between pt-3">
                                    <button type="button" onClick={() => setStep(3)} className="text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-slate-800">
                                        Back
                                    </button>
                                    <button disabled={processing || !phoneVerified} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                                        {processing ? 'Creating...' : 'Create account'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
