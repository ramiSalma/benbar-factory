import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { 
    ChevronRightIcon, 
    CpuChipIcon, 
    UserGroupIcon, 
    BriefcaseIcon, 
    DocumentTextIcon, 
    ChartBarIcon, 
    CheckBadgeIcon,
    RocketLaunchIcon,
    ShieldCheckIcon,
    ChatBubbleLeftRightIcon,
    PresentationChartLineIcon,
    BeakerIcon,
    ClockIcon,
    ArrowRightIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

export default function Welcome({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const stats = [
        { label: "Projets gérés", value: "+500" },
        { label: "Freelancers qualifiés", value: "+300" },
        { label: "Clients actifs", value: "+150" },
        { label: "Satisfaction client", value: "95%" },
    ];

    const mainFeatures = [
        {
            title: "Gestion des demandes",
            desc: "Les clients soumettent leurs besoins via un formulaire intelligent et intuitif.",
            icon: DocumentTextIcon,
        },
        {
            title: "Cahier des charges IA",
            desc: "L'intelligence artificielle génère automatiquement un cahier des charges technique détaillé.",
            icon: CpuChipIcon,
        },
        {
            title: "Estimation du budget",
            desc: "Calcul automatique et précis des coûts et des délais prévisionnels du projet.",
            icon: ChartBarIcon,
        },
        {
            title: "Gestion des missions",
            desc: "Organisation agile des tâches et suivi rigoureux des livrables par étapes.",
            icon: BriefcaseIcon,
        },
        {
            title: "Collaboration Experts",
            desc: "Attribution intelligente des missions aux talents les plus adaptés du réseau.",
            icon: UserGroupIcon,
        },
        {
            title: "Dashboard Temps Réel",
            desc: "Suivi complet et transparent de l'avancement pour toutes les parties prenantes.",
            icon: PresentationChartLineIcon,
        },
    ];

    const steps = [
        { id: 1, text: "Le client soumet sa demande via l'interface dédiée." },
        { id: 2, text: "Validation stratégique par l'administrateur Benbar." },
        { id: 3, text: "Création automatique du projet et de l'espace de travail." },
        { id: 4, text: "Génération du cahier des charges assistée par IA." },
        { id: 5, text: "Affectation ciblée des missions aux meilleurs freelances." },
        { id: 6, text: "Suivi collaboratif jusqu'à la livraison finale certifiée." },
    ];

    return (
        <>
            <Head title="Benbar Factory - Plateforme Intelligente de Projets Digitaux" />

            <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-600 selection:text-white">
                
                {/* NAVIGATION */}
                <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-100 py-3" : "bg-transparent py-5"}`}>
                    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                        <Link href="/" className="group flex items-center gap-2">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                <RocketLaunchIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-indigo-600">
                                Benbar Factory
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-10">
                            {["Fonctionnalités", "IA", "Processus", "Rôles"].map((item) => (
                                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider">
                                    {item}
                                </a>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                            {auth?.user ? (
                                <Link href="/dashboard" className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-md">
                                    Mon Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-indigo-600 transition">
                                        Connexion
                                    </Link>
                                    <Link href="/register" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
                                        Démarrer un projet
                                    </Link>
                                </>
                            )}
                        </div>

                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* HERO SECTION */}
                <section className="pt-36 pb-20 lg:pt-40 lg:pb-32 bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold">
                                <SparklesIcon className="w-4 h-4 animate-pulse" />
                                L'IA au service de votre croissance
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                Transformez vos idées en <span className="text-indigo-600">projets digitaux</span> performants.
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl">
                                Benbar Factory accompagne vos projets de la demande client jusqu'à la livraison finale grâce à une gestion intelligente, un suivi automatisé et un réseau de talents qualifiés.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/register" className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                                    Créer un projet
                                </Link>
                                <a href="#fonctionnalités" className="px-8 py-4 bg-slate-50 border border-slate-200 text-slate-700 font-black rounded-2xl hover:bg-slate-100 transition-all">
                                    Découvrir la plateforme
                                </a>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative w-full h-full">
                                <img 
                                    src="https://www.poynter.org/wp-content/uploads/2022/01/shutterstock_1751135816-2048x1256.png" 
                                    alt="Collaboration Benbar Factory"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* STATS SECTION */}
                <section className="py-16 bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center space-y-2 border-r border-slate-100 last:border-none">
                                    <div className="text-4xl font-black text-indigo-600">{stat.value}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section id="fonctionnalités" className="py-24 lg:py-32 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
                                Une plateforme complète pour gérer vos projets
                            </h2>
                            <p className="text-lg text-slate-600 font-medium">
                                Nous avons centralisé tous les outils nécessaires pour passer du concept à la réalité en un temps record.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {mainFeatures.map((f, i) => (
                                <div key={i} className="group p-8 bg-white border border-slate-200/60 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                                        <f.icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium text-sm">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* AI PREMIUM SECTION */}
                <section id="ia" className="py-24 bg-indigo-800 relative">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold">
                                    <CpuChipIcon className="w-5 h-5" />
                                    Technologie propriétaire
                                </div>
                                <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                                    L'intelligence artificielle au cœur de Benbar Factory
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                                    {[
                                        "Génération automatique du cahier des charges",
                                        "Analyse intelligente des besoins",
                                        "Estimation prédictive des coûts",
                                        "Suggestions de modules techniques",
                                        "Création automatique des tâches",
                                        "Suivi intelligent des projets",
                                        "Assistant conversationnel intégré",
                                        "Rapports automatiques IA"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-slate-300">
                                            <CheckBadgeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                            <span className="text-sm font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="relative bg-slate-800 border border-slate-700/60 rounded-[2rem] p-4 shadow-2xl">
                                    <img 
                                        src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" 
                                        alt="IA Visualisation"
                                        className="rounded-2xl object-cover w-full h-auto grayscale opacity-85"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PROCESS SECTION */}
                <section id="processus" className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <h2 className="text-4xl font-black text-slate-900 mb-4">Comment fonctionne Benbar Factory ?</h2>
                            <p className="text-lg text-slate-600 font-medium">Un flux de travail optimisé pour éliminer la friction administrative.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {steps.map((step) => (
                                <div key={step.id} className="relative p-10 bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60">
                                    <div className="absolute -top-6 left-10 w-12 h-12 bg-indigo-600 text-white flex items-center justify-center text-xl font-black rounded-2xl shadow-md">
                                        {step.id}
                                    </div>
                                    <p className="text-base font-bold text-slate-700 leading-relaxed pt-2">
                                        {step.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ROLES SECTION */}
                <section id="rôles" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-black text-slate-900 mb-4">Une synergie parfaite entre les rôles</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { role: "Client", bg: "bg-blue-50", text: "text-blue-600", bullet: "bg-blue-600", border: "border-blue-100", items: ["Créer des demandes", "Suivre les projets", "Valider les livrables"] },
                                { role: "Administrateur", bg: "bg-indigo-50", text: "text-indigo-600", bullet: "bg-indigo-600", border: "border-indigo-100", items: ["Valider les projets", "Gérer les utilisateurs", "Superviser la plateforme"] },
                                { role: "Chef de projet", bg: "bg-indigo-950", text: "text-white", bullet: "bg-blue-400", border: "border-indigo-900", items: ["Planifier les missions", "Suivre l'avancement", "Coordonner les équipes"] },
                                { role: "Freelancer", bg: "bg-blue-900", text: "text-white", bullet: "bg-indigo-400", border: "border-blue-800", items: ["Recevoir des missions", "Déposer des livrables", "Communiquer avec l'équipe"] },
                            ].map((r, i) => (
                                <div key={i} className={`${r.bg} ${r.border} p-8 rounded-[2rem] border shadow-sm transition-all`}>
                                    <h3 className={`text-2xl font-black ${r.text} mb-6`}>{r.role}</h3>
                                    <ul className="space-y-4">
                                        {r.items.map((item, j) => (
                                            <li key={j} className="flex items-center gap-3 font-bold text-sm opacity-90">
                                                <div className={`w-2 h-2 rounded-full ${r.bullet} flex-shrink-0`}></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* MODULES GRID */}
                <section className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Écosystème de Modules</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {[
                                "Gestion des utilisateurs", "Gestion des projets", "Gestion des missions", "Gestion des livrables", "Messagerie interne",
                                "Notifications", "Paiements", "Rapports", "Tableaux de bord", "Intelligence artificielle"
                            ].map((mod, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 text-center font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all cursor-default shadow-sm">
                                    {mod}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {[
                                { name: "Marc Lefebvre", role: "CTO, TechCorp", content: "Benbar Factory a réduit nos délais de cadrage projet de 60%. L'IA est impressionnante pour générer des cahiers des charges cohérents." },
                                { name: "Sophie Durant", role: "Freelance Senior UX", content: "La meilleure plateforme sur laquelle j'ai travaillé. Les missions sont claires, les livrables bien définis et le paiement automatisé." },
                                { name: "Antoine Morel", role: "CEO, Startup Now", content: "Centraliser mes développements avec un chef de projet dédié et l'IA Benbar nous a permis de scaler sans recruter en interne." },
                            ].map((t, i) => (
                                <div key={i} className="p-8 bg-slate-50 border border-slate-200/60 rounded-[2rem] shadow-sm italic text-slate-600 relative">
                                    <ChatBubbleLeftRightIcon className="w-10 h-10 text-indigo-100 absolute top-6 right-8" />
                                    <p className="mb-6 relative z-10 leading-relaxed text-sm">"{t.content}"</p>
                                    <div className="font-bold text-slate-900 not-italic">{t.name}</div>
                                    <div className="text-xs text-indigo-600 not-italic font-bold tracking-wide uppercase mt-1">{t.role}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA FINAL */}
                <section className="max-w-7xl mx-auto px-6 mb-24">
                    <div className="relative rounded-[3rem] bg-indigo-600 p-12 lg:p-20 overflow-hidden shadow-xl shadow-indigo-100">
                        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
                            <h2 className="text-4xl lg:text-6xl font-black text-white">Prêt à lancer votre prochain projet ?</h2>
                            <p className="text-xl text-indigo-100 font-medium">
                                Centralisez la gestion de vos projets, automatisez vos processus et collaborez efficacement avec Benbar Factory.
                            </p>
                            <Link href="/register" className="inline-block px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl shadow-lg hover:bg-slate-50 transition-all hover:scale-105">
                                Commencer maintenant
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-white border-t border-slate-200/60 pt-20 pb-10 font-medium">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2 space-y-6">
                            <Link href="/" className="text-2xl font-black tracking-tight text-indigo-600">Benbar Factory</Link>
                            <p className="max-w-sm text-slate-500 text-sm leading-relaxed">L'écosystème intelligent pour transformer vos idées en succès technologiques, propulsé par l'IA.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Plateforme</h4>
                            <div className="flex flex-col gap-3 text-sm">
                                <a href="#" className="text-slate-500 hover:text-indigo-600">Accueil</a>
                                <a href="#fonctionnalités" className="text-slate-500 hover:text-indigo-600">Fonctionnalités</a>
                                <a href="#" className="text-slate-500 hover:text-indigo-600">Projets</a>
                                <a href="#" className="text-slate-500 hover:text-indigo-600">Contact</a>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Légal</h4>
                            <div className="flex flex-col gap-3 text-sm">
                                <a href="#" className="text-slate-500 hover:text-indigo-600">Mentions légales</a>
                                <a href="#" className="text-slate-500 hover:text-indigo-600">Confidentialité</a>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
                        © 2026 Benbar Factory - Tous droits réservés.
                    </div>
                </footer>

            </div>
        </>
    );
}