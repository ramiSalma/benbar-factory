import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Welcome({ auth }) {
    // Mobile menu state for responsiveness
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Benbar Factory - AI-Powered Freelance Marketplace" />

            <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
                
                {/* Navbar */}
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                        <Link href="/" className="text-2xl font-black tracking-tight bg-gradient-to-r center from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                            Benbar Factory
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#services" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Services</a>
                            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">How It Works</a>
                            <a href="#ai-features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">AI Assistant</a>
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm shadow-indigo-200 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                                    >
                                        Sign In
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm shadow-indigo-200 transition"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600 hover:text-slate-950 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Dropdown */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 flex flex-col gap-4 shadow-inner">
                            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium">Services</a>
                            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium">How It Works</a>
                            <a href="#ai-features" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium">AI Assistant</a>
                            <hr className="border-slate-100" />
                            {auth?.user ? (
                                <Link href="/dashboard" className="w-full text-center py-2.5 bg-indigo-600 text-white font-medium rounded-xl">Dashboard</Link>
                            ) : (
                                <>
                                    <Link href="/login" className="w-full text-center py-2.5 text-slate-600 font-medium">Sign In</Link>
                                    <Link href="/register" className="w-full text-center py-2.5 bg-indigo-600 text-white font-medium rounded-xl">Get Started</Link>
                                </>
                            )}
                        </div>
                    )}
                </nav>

                {/* Hero */}
                <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 tracking-wide uppercase">
                                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                Next-Gen Freelancing
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                Build projects with top freelancers,{" "}
                                <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                                    driven by AI.
                                </span>
                            </h1>

                            <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-8">
                                Benbar Factory eliminates friction. Connect with pre-vetted talent and manage entire project lifecycles effortlessly using intelligent automation tools.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/register"
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-center font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    Hire Elite Talent
                                </Link>

                                <a
                                    href="#services"
                                    className="px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-center font-medium rounded-xl transition-all duration-200 hover:bg-slate-50"
                                >
                                    Explore Services
                                </a>
                            </div>
                        </div>

                        {/* Interactive-feeling Visual Grid */}
                        <div className="lg:col-span-5 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400 to-violet-400 opacity-20 blur-3xl rounded-full transform translate-x-12 -translate-y-8"></div>
                            <div className="relative border-4 border-white shadow-2xl rounded-2xl overflow-hidden aspect-[4/3] bg-slate-200">
                                <img
                                    src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80"
                                    alt="Team collaborating on software architecture"
                                    className="object-cover w-full h-full transform hover:scale-105 transition duration-700 ease-out"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="bg-white border-y border-slate-100 py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                            {[
                                ["500+", "Successful Projects"],
                                ["250+", "Vetted Freelancers"],
                                ["120+", "Global Clients"],
                                ["98%", "Satisfaction Rate"],
                            ].map(([value, label]) => (
                                <div key={label} className="text-center md:border-r last:border-0 border-slate-100 px-4">
                                    <div className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                                        {value}
                                    </div>
                                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section id="services" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                            End-to-End Professional Solutions
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Get matched with experts equipped to handle modern digital scale.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Web Development", desc: "Fast, accessible web ecosystems leveraging Next.js, Laravel, and modern cloud stacks." },
                            { title: "Mobile Apps", desc: "Native iOS and Android applications prioritizing performance and seamless user patterns." },
                            { title: "UI/UX Design", desc: "High-fidelity modern designs focused on conversion architectures and intuitive user flows." },
                            { title: "Digital Marketing", desc: "Data-driven advertising campaigns and organic performance strategies that scaling businesses need." },
                            { title: "Project Management", desc: "Scrum-backed management handling milestones, deployment syncs, and clear pipelines." },
                            { title: "AI Integration", desc: "Embed LLM APIs, fine-tuned foundational models, and specialized automations into your products." },
                        ].map((service) => (
                            <div
                                key={service.title}
                                className="group bg-white p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="w-10 h-10 mb-5 bg-indigo-50 group-hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-colors duration-200">
                                    <svg className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>

                                <h3 className="font-bold text-xl text-slate-900 mb-2">
                                    {service.title}
                                </h3>

                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {service.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="bg-white border-y border-slate-100 py-24 scroll-mt-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                                Zero Friction, Maximum Output
                            </h2>
                            <p className="text-slate-600 text-lg">
                                Our streamlined pipeline takes you from an idea to production in 4 simple moves.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                            {[
                                { step: "Create Account", desc: "Set up your secure business portal in minutes." },
                                { step: "Publish Blueprint", desc: "Describe goals manually or use our intuitive guided AI assistant prompt." },
                                { step: "Match & Deploy", desc: "Get curated matches from top-tier, certified freelancers." },
                                { step: "Continuous Delivery", desc: "Track progress seamlessly with automated, iteration-by-iteration check-ins." },
                            ].map((item, index) => (
                                <div key={item.step} className="text-center relative">
                                    <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center shadow-md shadow-indigo-100">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-900 mb-2">
                                        {item.step}
                                    </h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* AI & Features Grid Split */}
                <section id="ai-features" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
                    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl text-white p-8 md:p-16 relative overflow-hidden shadow-2xl">
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none hidden lg:block">
                            <svg width="100%" height="100%" fill="none" viewBox="0 0 400 400">
                                <defs>
                                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                        </div>

                        <div className="max-w-2xl relative z-10">
                            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                Intelligence Core
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-4 mb-6">
                                Next-gen project management powered by AI.
                            </h2>

                            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                Avoid project miscommunication forever. Generate scoped execution roadmaps, precise financial estimates, technical wireframe structures, and automated code review summaries in seconds.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                {[
                                    "Automated Scope Generators",
                                    "Intelligent Freelancer Matcher",
                                    "AI Sprint Tracking Summaries",
                                    "Smart Milestones Estimates"
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-3 text-slate-200">
                                        <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/register"
                                className="inline-block px-6 py-3.5 bg-white hover:bg-slate-50 text-indigo-900 font-bold rounded-xl shadow transition"
                            >
                                Experience the Demo
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Final Call to Action */}
                <section className="text-center py-24 bg-slate-900 text-white relative">
                    <div className="max-w-4xl mx-auto px-6 relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                            Ready to transform your delivery lifecycle?
                        </h2>

                        <p className="mb-10 text-slate-400 text-lg max-w-xl mx-auto">
                            Join Benbar Factory today to source pre-vetted engineers, match instantly, and ship software reliably.
                        </p>

                        <Link
                            href="/register"
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:-translate-y-0.5"
                        >
                            Create Your Free Account
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <div>
                            © 2026 Benbar Factory. All rights reserved.
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
                            <a href="#" className="hover:text-slate-300 transition">Contact Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}