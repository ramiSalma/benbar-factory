import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        // STEP 1
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'client',

        // user metadata
        country: '',
        city: '',
        preferred_language: 'en',

        // STEP 2 CLIENT
        company_name: '',
        industry: '',
        phone: '',
        website: '',
        company_size: '',
        bio: '',

        // STEP 2 FREELANCER
        title: '',
        speciality: '',
        hourly_rate: '',
        experience_years: '',
        portfolio_url: '',
        headline: '',
    });

    // ---------------- STEP 1 VALIDATION ----------------
    const submitStep1 = (e) => {
        e.preventDefault();

        if (
            !data.name ||
            !data.email ||
            !data.password ||
            !data.password_confirmation
        ) {
            return;
        }

        if (data.password !== data.password_confirmation) {
            return;
        }

        setStep(2);
    };

    // ---------------- FINAL SUBMIT ----------------
    const submitFinal = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Viewport Wrapper with a dynamic soft canvas background */}
            <div className="relative min-h-screen w-full py-12 flex items-center justify-center overflow-hidden bg-gradient-to-tr from-slate-50 via-slate-100 to-blue-50">
                
                {/* --- FLOATING BACKGROUND BUBBLES --- */}
                {/* Large fluid bubble top left */}
                <div className="absolute top-10 left-12 md:left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-300/50 to-cyan-300/40 rounded-full blur-2xl animate-pulse mix-blend-multiply" style={{ animationDuration: '9s' }}></div>
                {/* Vibrant interactive bubble directly behind right side of the card */}
                <div className="absolute top-1/3 right-10 md:right-1/3 w-96 h-96 bg-gradient-to-br from-purple-300/40 via-indigo-200/50 to-pink-200/40 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '15s' }}></div>
                {/* Bottom bubble deep layout */}
                <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gradient-to-tr from-teal-200/50 to-emerald-200/40 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '7s' }}></div>
                {/* Small sharp accent bubble */}
                <div className="absolute top-2/3 left-10 w-40 h-40 bg-indigo-300/30 rounded-full blur-xl animate-bounce" style={{ animationDuration: '12s' }}></div>

                {/* --- TRANSPARENT GLASSMORPHIC FORM CARD --- */}
                <div className="relative z-10 w-full max-w-2xl mx-auto bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] rounded-3xl p-8 md:p-10 transition-all duration-300">
                    
                    {/* Header Title Section */}
                    <div className="relative z-10 mb-8 text-center">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                            Create <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">Account</span>
                        </h2>
                        <p className="text-slate-600 text-sm font-medium mt-2">Join our premium creator and client ecosystem</p>
                    </div>

                    {/* Step Navigation Progress Matrix */}
                    <div className="relative z-10 grid grid-cols-2 gap-4 mb-8">
                        <div 
                            onClick={() => step === 2 && setStep(1)}
                            className={`p-3.5 rounded-2xl border transition-all duration-300 text-center backdrop-blur-sm ${
                                step === 1 
                                    ? 'bg-white/60 border-blue-400 text-blue-700 shadow-sm font-bold' 
                                    : 'bg-white/30 border-white/20 text-slate-500 cursor-pointer hover:bg-white/50'
                            }`}
                        >
                            <div className="text-xs uppercase tracking-widest font-black opacity-80">01</div>
                            <div className="text-xs mt-0.5">Credentials</div>
                        </div>
                        <div 
                            className={`p-3.5 rounded-2xl border transition-all duration-300 text-center backdrop-blur-sm ${
                                step === 2 
                                    ? 'bg-white/60 border-blue-400 text-blue-700 shadow-sm font-bold' 
                                    : 'bg-white/30 border-white/20 text-slate-500'
                            }`}
                        >
                            <div className="text-xs uppercase tracking-widest font-black opacity-80">02</div>
                            <div className="text-xs mt-0.5">
                                {data.role === 'client' ? 'Client Profile' : 'Freelancer Profile'}
                            </div>
                        </div>
                    </div>

                    {/* ================= STEP 1 ================= */}
                    {step === 1 && (
                        <form onSubmit={submitStep1} className="relative z-10 space-y-5">
                            <div>
                                <InputLabel value="Name" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                <TextInput
                                    value={data.name}
                                    className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1.5 text-xs font-semibold text-red-600" />
                            </div>

                            <div>
                                <InputLabel value="Email Address" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                <TextInput
                                    type="email"
                                    value={data.email}
                                    className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="john@example.com"
                                    required
                                />
                                <InputError message={errors.email} className="mt-1.5 text-xs font-semibold text-red-600" />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <InputLabel value="Country" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                    <TextInput
                                        value={data.country}
                                        className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                        onChange={(e) => setData('country', e.target.value)}
                                        placeholder="United States"
                                    />
                                    <InputError message={errors.country} className="mt-1.5 text-xs font-semibold text-red-600" />
                                </div>

                                <div>
                                    <InputLabel value="City" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                    <TextInput
                                        value={data.city}
                                        className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="New York"
                                    />
                                    <InputError message={errors.city} className="mt-1.5 text-xs font-semibold text-red-600" />
                                </div>
                            </div>

                            <div>
                                <InputLabel value="Preferred Language" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                <select
                                    className="mt-1 block w-full rounded-xl border-white/50 bg-white/40 p-2.5 text-slate-900 shadow-inner focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 outline-none text-sm font-medium"
                                    value={data.preferred_language}
                                    onChange={(e) => setData('preferred_language', e.target.value)}
                                >
                                    <option value="en">English</option>
                                    <option value="fr">French</option>
                                    <option value="es">Spanish</option>
                                    <option value="de">German</option>
                                </select>
                                <InputError message={errors.preferred_language} className="mt-1.5 text-xs font-semibold text-red-600" />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <InputLabel value="Password" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                    <TextInput
                                        type="password"
                                        value={data.password}
                                        className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-1.5 text-xs font-semibold text-red-600" />
                                </div>

                                <div>
                                    <InputLabel value="Confirm Password" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                    <TextInput
                                        type="password"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-1.5 text-xs font-semibold text-red-600" />
                                </div>
                            </div>

                            {/* Account Selector Frame */}
                            <div>
                                <InputLabel value="Account Assignment" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-2" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div 
                                        onClick={() => setData('role', 'client')}
                                        className={`p-4 rounded-xl border cursor-pointer text-center transition-all backdrop-blur-sm ${
                                            data.role === 'client' 
                                                ? 'bg-white/70 border-blue-500 text-blue-800 shadow-sm font-bold' 
                                                : 'bg-white/30 border-white/40 text-slate-600 hover:bg-white/50'
                                        }`}
                                    >
                                        <span className="block text-sm">Client Account</span>
                                        <span className="block text-[11px] text-slate-500 mt-0.5 font-normal">I want to hire talent</span>
                                    </div>
                                    <div 
                                        onClick={() => setData('role', 'freelancer')}
                                        className={`p-4 rounded-xl border cursor-pointer text-center transition-all backdrop-blur-sm ${
                                            data.role === 'freelancer' 
                                                ? 'bg-white/70 border-blue-500 text-blue-800 shadow-sm font-bold' 
                                                : 'bg-white/30 border-white/40 text-slate-600 hover:bg-white/50'
                                        }`}
                                    >
                                        <span className="block text-sm">Freelancer Account</span>
                                        <span className="block text-[11px] text-slate-500 mt-0.5 font-normal">I want to apply for jobs</span>
                                    </div>
                                </div>
                                <InputError message={errors.role} className="mt-1.5 text-xs font-semibold text-red-600" />
                            </div>

                            <div className="pt-4">
                                <PrimaryButton className="w-full justify-center py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl tracking-wide shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all">
                                    Continue Setup →
                                </PrimaryButton>
                            </div>
                        </form>
                    )}

                    {/* ================= STEP 2 ================= */}
                    {step === 2 && (
                        <form onSubmit={submitFinal} className="relative z-10 space-y-5">
                            {/* CLIENT FIELDS */}
                            {data.role === 'client' && (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <InputLabel value="Company Name" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                            <TextInput
                                                value={data.company_name}
                                                onChange={(e) => setData('company_name', e.target.value)}
                                                className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                                placeholder="Acme Corp"
                                            />
                                            <InputError message={errors.company_name} className="mt-1.5 text-xs font-semibold text-red-600" />
                                        </div>

                                        <div>
                                            <InputLabel value="Industry" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                            <TextInput
                                                value={data.industry}
                                                onChange={(e) => setData('industry', e.target.value)}
                                                className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                                placeholder="Technology, Finance..."
                                            />
                                            <InputError message={errors.industry} className="mt-1.5 text-xs font-semibold text-red-600" />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <InputLabel value="Phone" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                            <TextInput
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                            <InputError message={errors.phone} className="mt-1.5 text-xs font-semibold text-red-600" />
                                        </div>

                                        <div>
                                            <InputLabel value="Website" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                            <TextInput
                                                type="url"
                                                value={data.website}
                                                onChange={(e) => setData('website', e.target.value)}
                                                className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                                placeholder="https://example.com"
                                            />
                                            <InputError message={errors.website} className="mt-1.5 text-xs font-semibold text-red-600" />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel value="Company Size" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                        <TextInput
                                            value={data.company_size}
                                            onChange={(e) => setData('company_size', e.target.value)}
                                            className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                            placeholder="1-10, 11-50, 50+"
                                        />
                                        <InputError message={errors.company_size} className="mt-1.5 text-xs font-semibold text-red-600" />
                                    </div>

                                    <div>
                                        <InputLabel value="Company Biography" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                        <textarea
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            className="mt-1 block w-full bg-white/40 border border-white/40 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner p-3 text-sm outline-none"
                                            rows="4"
                                            placeholder="Tell us about your team and vision..."
                                        />
                                        <InputError message={errors.bio} className="mt-1.5 text-xs font-semibold text-red-600" />
                                    </div>
                                </>
                            )}

                            {/* FREELANCER FIELDS */}
                            {data.role === 'freelancer' && (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <InputLabel value="Professional Title" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                            <TextInput
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                                placeholder="Full Stack Engineer"
                                            />
                                            <InputError message={errors.title} className="mt-1.5 text-xs font-semibold text-red-600" />
                                        </div>

                                        <div>
                                            <InputLabel value="Headline" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                            <TextInput
                                                value={data.headline}
                                                onChange={(e) => setData('headline', e.target.value)}
                                                className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                                placeholder="Building digital architectures"
                                            />
                                            <InputError message={errors.headline} className="mt-1.5 text-xs font-semibold text-red-600" />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel value="Specialities / Tech Stack" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                        <TextInput
                                            value={data.speciality}
                                            onChange={(e) => setData('speciality', e.target.value)}
                                            className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                            placeholder="React, AWS, Node.js, Figma"
                                        />
                                        <InputError message={errors.speciality} className="mt-1.5 text-xs font-semibold text-red-600" />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <InputLabel value="Hourly Rate ($)" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                            <TextInput
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.hourly_rate}
                                                onChange={(e) => setData('hourly_rate', e.target.value)}
                                                className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                                placeholder="50.00"
                                            />
                                            <InputError message={errors.hourly_rate} className="mt-1.5 text-xs font-semibold text-red-600" />
                                        </div>

                                        <div>
                                            <InputLabel value="Years of Experience" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                            <TextInput
                                                type="number"
                                                min="0"
                                                value={data.experience_years}
                                                onChange={(e) => setData('experience_years', e.target.value)}
                                                className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                                placeholder="5"
                                            />
                                            <InputError message={errors.experience_years} className="mt-1.5 text-xs font-semibold text-red-600" />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel value="Portfolio URL" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                        <TextInput
                                            type="url"
                                            value={data.portfolio_url}
                                            onChange={(e) => setData('portfolio_url', e.target.value)}
                                            className="mt-1 block w-full bg-white/40 border-white/50 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                            placeholder="https://portfolio.dev"
                                        />
                                        <InputError message={errors.portfolio_url} className="mt-1.5 text-xs font-semibold text-red-600" />
                                    </div>

                                    <div>
                                        <InputLabel value="Professional Bio" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                        <textarea
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            className="mt-1 block w-full bg-white/40 border border-white/40 text-slate-900 rounded-xl placeholder-slate-500 focus:bg-white/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner p-3 text-sm outline-none"
                                            rows="4"
                                            placeholder="Share your experience, past products, or design ethics..."
                                        />
                                        <InputError message={errors.bio} className="mt-1.5 text-xs font-semibold text-red-600" />
                                    </div>
                                </>
                            )}

                            {/* NAVIGATION STEP FOOTER */}
                            <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-200/50">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-xs tracking-wider font-bold uppercase text-slate-500 hover:text-slate-800 transition duration-150 flex items-center gap-1.5"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>

                                <PrimaryButton 
                                    disabled={processing} 
                                    className={`justify-center py-3.5 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl tracking-wide shadow-md shadow-blue-500/10 transition-all ${
                                        processing ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'
                                    }`}
                                >
                                    Complete System Onboarding
                                </PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}