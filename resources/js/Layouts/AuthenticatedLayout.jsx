import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Navbar } from "@/Components/Navbar";

import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import Sidebar from "@/Components/Sidebar";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    // Sidebar closed by default for a pristine workspace experience
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-[#efefef] font-sans antialiased text-gray-800 flex">
            {/* ========================================================= */}
            {/* 1. MINIMALIST SIDEBAR PANEL (Desktop Only)               */}
            {/* ========================================================= */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* ========================================================= */}
            {/* 2. MAIN VIEW WRAPPER                                      */}
            {/* ========================================================= */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
                    isSidebarOpen ? "sm:pl-64" : "sm:pl-20"
                }`}
            >
                {/* GLOBAL TOP NAVBAR */}
                <Navbar header={header} />

                {/* Mobile Dropdown Panel */}
                <div
                    className={`sm:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-md z-30 border-b border-gray-200 shadow-xl transition-all duration-200 ${showingNavigationDropdown ? "block opacity-100" : "hidden opacity-0"}`}
                >
                    <div className="space-y-1 pb-3 pt-2 px-3">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("projects.index")}
                            active={route().current("projects.*")}
                        >
                            Projects
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("client-requests.index")}
                            active={route().current("client-requests.*")}
                        >
                            Requests
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("ai.index")}
                            active={route().current("ai.*")}
                        >
                            AI
                        </ResponsiveNavLink>
                    </div>
                    <div className="border-t border-gray-100 pb-4 pt-4 px-6 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                ) : (
                                    <span className="text-xs font-bold uppercase">
                                        {user.name.substring(0, 2)}
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-900">
                                    {user.name}
                                </div>
                                <div className="text-xs font-medium text-gray-500">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <ResponsiveNavLink href={route("profile.show")}>
                                Profile Settings
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("security.show")}>
                                Security Settings
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                                className="text-red-600 font-medium hover:bg-red-50"
                            >
                                Sign Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>

                {/* Mobile Page Header */}
                {header && (
                    <div className="p-4 pt-6 block sm:hidden text-lg font-bold text-gray-900 tracking-tight">
                        {header}
                    </div>
                )}

                {/* Primary Content Viewport */}
                <main className="flex-1 px-1 py-8 sm:px-8 lg:px-12 bg-gray-50/50">
                    {children}
                </main>
            </div>
        </div>
    );
}
