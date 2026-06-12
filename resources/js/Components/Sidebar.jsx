import { Link, usePage } from "@inertiajs/react";

export default function BenbarSidebar({ isOpen, setIsOpen }) {
    const { auth, url } = usePage().props;
    const user = auth?.user;
    const roles = user?.roles || [];

    const can = (allowed) => allowed.some((role) => roles.includes(role));

    const menu = [
        {
            label: "Dashboard",
            href: route("dashboard"),
            icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V9h-8v12zm0-18v6h8V3h-8z",
            show: true,
        },
        // ADMIN / MANAGER
        {
            label: "Missions",
            href: "#",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            show: can(["admin", "manager"]),
        },
        {
            label: "Users",
            href: "#",
            icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
            show: can(["admin"]),
        },
        {
            label: "Contracts",
            href: "#",
            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            show: can(["admin", "manager"]),
        },
        {
            label: "Payments",
            href: "#",
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            show: can(["admin", "manager"]),
        },
        // CLIENT
        {
            label: "My Missions",
            href: "#",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            show: can(["client"]),
        },
        {
            label: "Create Mission",
            href: "#",
            icon: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
            show: can(["client"]),
        },
        {
            label: "My Requests",
            // This dynamically generates the URL: /client-requests
            href: route("client-requests.index"),
            icon: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
            show: can(["client"]),
        },
        // FREELANCER
        {
            label: "Available Missions",
            href: "#",
            icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            show: can(["freelancer"]),
        },
        {
            label: "My Work",
            href: "#",
            icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
            show: can(["freelancer"]),
        },
        // COMMON
        {
            label: "Profile",
            href: route("profile.edit"),
            icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
            show: true,
        },
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-indigo-500 to-indigo-500 text-indigo-200 border-r border-indigo-950/40 transition-all duration-300 ease-in-out hidden sm:flex ${
                isOpen ? "w-64" : "w-20"
            }`}
        >
            {/* Header / Logo Space */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800 overflow-hidden shrink-0">
                <span className="text-xl font-bold text-white tracking-wider whitespace-nowrap">
                    {isOpen ? "BENBAR" : "BB"}
                </span>
            </div>

            {/* Toggle Arrow Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-md flex items-center justify-center transition-transform duration-300"
                style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
                aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            {/* Menu Items */}
            <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
                {menu
                    .filter((item) => item.show)
                    .map((item) => {
                        // Safe fallback fallback if href remains '#'
                        //  Safe fallback
                        const isActive = item.href ? window.location.pathname.startsWith(item.href) : false;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-4 py-3 text-white rounded-lg text-sm font-medium transition-all group relative ${
                                    isOpen ? "px-4" : "px-0 justify-center"
                                } `}
                            >
                                <svg
                                    className={`w-5 h-5 shrink-0 text-white`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d={item.icon}
                                    />
                                </svg>

                                {isOpen ? (
                                    <span className="truncate">
                                        {item.label}
                                    </span>
                                ) : (
                                    /* Hover Tooltip when sidebar is collapsed */
                                    <span className="absolute left-16 scale-0 rounded bg-slate-950 p-2 text-xs text-white group-hover:scale-100 transition-all z-50 shadow-lg pointer-events-none whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
            </nav>
        </aside>
    );
}
