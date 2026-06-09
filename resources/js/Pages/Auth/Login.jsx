import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Main Screen Wrapper splits into decorative left panel and right form canvas */}
            <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-[#efefef]">
                
                {/* --- LEFT SECTION: BLUE DECORATIVE SIDEBAR (Hidden on mobile, takes full height on md+) --- */}
                <div className="hidden md:flex relative flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 overflow-hidden select-none">
                    {/* Abstract Backdrop Geometrics */}
                    <div className="absolute bottom-10 right-[-10%] w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl"></div>

                    {/* Value Statement / Welcome Copy */}
                    <div className="relative z-10 my-auto max-w-md space-y-4">
                        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-200 bg-cyan-950/30 rounded-full backdrop-blur-sm border border-cyan-500/20">
                            Welcome Back
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                            Access your mission workspace.
                        </h1>
                        <p className="text-blue-100/80 text-base font-medium leading-relaxed">
                            Connect with top-tier talent, manage assignments seamlessly, and track progress all from your central dashboard workspace.
                        </p>
                    </div>
                </div>

                {/* --- RIGHT SECTION: FORM WORKSPACE SCREEN --- */}
                <div className="relative min-h-screen flex items-center justify-center md:p-12 overflow-y-auto">
                    
                    {/* Soft Canvas Floating Accent Bubbles (Behind Right Side Card) */}
                    <div className="absolute top-1/4 right-12 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 left-12 w-60 h-60 bg-indigo-300/20 rounded-full blur-2xl"></div>

                    {/* --- TRANSPARENT FORM CARD --- */}
                    <div className="relative z-10 w-full p-6 md:p-8 transition-all duration-300">
                        
                        {/* Header Title Section */}
                        <div className="relative z-10 mb-6 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                                Sign In to <span className="text-blue-600">Account</span>
                            </h2>
                            <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">
                                Welcome back! Securely enter your credentials below.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 text-sm font-semibold text-green-600 p-3 bg-green-50 rounded-xl border border-green-200">
                                {status}
                            </div>
                        )}

                        {/* Login Form Fields */}
                        <form onSubmit={submit} className="relative z-10 space-y-5">
                            
                            {/* Email Address Field */}
                            <div>
                                <InputLabel value="Email Address" className="text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full bg-white/50 border-white/60 text-slate-900 rounded-xl placeholder-slate-400 focus:bg-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="john@example.com"
                                    required
                                />
                                <InputError message={errors.email} className="mt-1.5 text-xs font-semibold text-red-600" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <InputLabel value="Password" className="text-slate-700 font-bold tracking-wide text-xs uppercase" />
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs font-bold text-blue-600 hover:text-indigo-600 transition duration-150"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full bg-white/50 border-white/60 text-slate-900 rounded-xl placeholder-slate-400 focus:bg-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <InputError message={errors.password} className="mt-1.5 text-xs font-semibold text-red-600" />
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 shadow-sm focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
                                    />
                                    <span className="ms-2 text-xs font-bold text-slate-600 uppercase tracking-wide">
                                        Keep me logged in
                                    </span>
                                </label>

                                <Link
                                    href={route('register')}
                                    className="text-xs font-bold text-slate-500 hover:text-blue-600 transition duration-150"
                                >
                                    Create account
                                </Link>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2">
                                <PrimaryButton 
                                    className="w-full flex justify-center items-center py-3 bg-cyan-500 font-bold rounded-xl tracking-wide transition-all duration-300 ease-in-out text-white disabled:opacity-50" 
                                    disabled={processing}
                                >
                                    Sign In →
                                </PrimaryButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}