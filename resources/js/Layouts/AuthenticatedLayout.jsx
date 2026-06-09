import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import Sidebar from "@/Components/Sidebar";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    // Sidebar closed by default for a pristine workspace experience
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

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
                    isSidebarOpen ? 'sm:pl-64' : 'sm:pl-20'
                }`}
            >
                {/* GLOBAL TOP NAVBAR */}
                <nav className="sticky top-0 z-40 bg-[#efefef] h-16 border-b border-gray-200/40 flex items-center">
                    <div className="w-full px-4 sm:px-8 flex items-center justify-between">
                        
                        {/* Left Side: Page Title Context */}
                        <div className="flex items-center gap-4">
                            <div className="sm:hidden flex items-center">
                                <span className="text-md font-black tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                    CORE<span className="text-cyan-500 font-light">DASH</span>
                                </span>
                            </div>

                            {header && (
                                <div className="text-sm sm:text-base font-bold text-gray-700 hidden sm:block">
                                    {header}
                                </div>
                            )}
                        </div>

                        {/* Right Side: Account Dropdown */}
                        <div className="hidden sm:flex sm:items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2.5 rounded-xl bg-transparent px-2 py-1.5 text-sm font-semibold text-gray-600 transition-all duration-200 hover:text-indigo-600 focus:outline-none group"
                                    >
                                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-bold uppercase">{user.name.substring(0, 2)}</span>
                                            )}
                                            <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#efefef]" />
                                        </div>

                                        <span className="max-w-[140px] truncate">{user.name}</span>

                                        <svg className="-me-0.5 h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:translate-y-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48">
                                    <Dropdown.Link href="#">Profile Settings</Dropdown.Link>
                                    <div className="border-t border-gray-100 my-1" />
                                    <Dropdown.Link href={route("logout")} method="post" as="button" className="text-red-500 hover:bg-red-50/40 flex items-center gap-2">
                                        Sign Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile Toggle Trigger */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-xl p-2 text-gray-400 transition-all duration-200 hover:bg-gray-200/40 hover:text-indigo-600 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Dropdown Panel */}
                <div className={`sm:hidden fixed inset-x-0 top-16 bg-[#efefef] z-30 border-b border-gray-200 ${showingNavigationDropdown ? 'block' : 'hidden'}`}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                        <ResponsiveNavLink href="#" active={false}>Analytics</ResponsiveNavLink>
                        <ResponsiveNavLink href="#" active={false}>Missions</ResponsiveNavLink>
                        <ResponsiveNavLink href="#" active={false}>Settings</ResponsiveNavLink>
                    </div>
                    <div className="border-t border-gray-200/60 pb-1 pt-4 px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                                {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" /> : <span className="text-xs font-bold uppercase">{user.name.substring(0, 2)}</span>}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-700">{user.name}</div>
                                <div className="text-xs font-medium text-gray-400">{user.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href="#">Profile Settings</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-red-500">Sign Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>

                {/* Mobile Page Header */}
                {header && (
                    <div className="p-4 pt-6 block sm:hidden">
                        {header}
                    </div>
                )}

                {/* Primary Content Viewport */}
                <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12">
                    {children}
                </main>
            </div>

        </div>
    );
}