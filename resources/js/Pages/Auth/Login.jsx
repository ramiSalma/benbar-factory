import Checkbox from '@/Components/Checkbox';
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

            {/* Split Screen Container */}
            <div className="fixed inset-0 flex bg-slate-950 overflow-hidden">
                
                {/* LEFT SIDE: Vibrant Indigo/Blue Branding Panel */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-b from-indigo-800 via-blue-700 to-indigo-950 relative">
                    {/* Ambient Glow Effect Overlay (No White) */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
                    
                    {/* Top Branding Logo */}
                    <div className="z-10">
                        <span className="text-2xl font-bold text-white tracking-wider">BENBAR</span>
                    </div>

                    {/* Middle Inspirational/Marketing Text */}
                    <div className="z-10 max-w-md space-y-4">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                            Manage your missions with ease.
                        </h1>
                        <p className="text-lg text-indigo-100/70">
                            A powerful workspace built for admins, managers, clients, and freelancers alike.
                        </p>
                    </div>

                    {/* Bottom Footer Meta */}
                    <div className="z-10 text-xs text-indigo-200/50">
                        &copy; 2026 BENBAR. All rights reserved.
                    </div>
                </div>

                {/* RIGHT SIDE: The Sleek Dark Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-950 border-l border-slate-900 overflow-y-auto">
                    <div className="w-full max-w-md space-y-8">
                        
                        {/* Header Title */}
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-wide">Welcome back</h2>
                            <p className="text-sm text-slate-400 mt-2">
                                Don't have an account?{' '}
                                <Link href={route('register')} className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                                    Register here
                                </Link>
                            </p>
                        </div>

                        {status && (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-400">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Input Field */}
                            <div>
                                <InputLabel 
                                    htmlFor="email" 
                                    value="Email Address" 
                                    className="text-slate-300 font-medium text-sm" 
                                />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1.5 block w-full bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-lg shadow-inner"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                />

                                <InputError message={errors.email} className="mt-1.5 text-red-400 text-xs" />
                            </div>

                            {/* Password Input Field */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <InputLabel 
                                        htmlFor="password" 
                                        value="Password" 
                                        className="text-slate-300 font-medium text-sm" 
                                    />
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-4"
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
                                    className="mt-1.5 block w-full bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-lg shadow-inner"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />

                                <InputError message={errors.password} className="mt-1.5 text-red-400 text-xs" />
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center pt-1">
                                <label className="flex items-center cursor-pointer group">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500/50 rounded"
                                    />
                                    <span className="ms-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                                        Keep me logged in
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <PrimaryButton 
                                    className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all duration-150 disabled:opacity-50" 
                                    disabled={processing}
                                >
                                    Log in to Dashboard
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}