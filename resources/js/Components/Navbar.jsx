import React from "react";


import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import Sidebar from "@/Components/Sidebar";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";


export const Navbar = ({header}) => {

    const user = usePage().props.auth.user;
    // Sidebar closed by default for a pristine workspace experience
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    return (
        <div>
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md h-16 border-b border-gray-100 flex items-center shadow-sm">
                <div className="w-full px-4 sm:px-8 flex items-center justify-between">
                    {/* Left Side: Page Title Context */}
                    <div className="flex items-center gap-4">
                        <div className="sm:hidden flex items-center">
                            <span className="text-md font-black tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                CORE
                                <span className="text-cyan-500 font-light">
                                    DASH
                                </span>
                            </span>
                        </div>

                        {header && (
                            <div className="text-base font-semibold text-gray-900 hidden sm:block tracking-tight">
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
                                    className="inline-flex items-center gap-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 p-1.5 pr-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:text-indigo-600 border border-gray-100/80 focus:outline-none group shadow-sm"
                                >
                                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-inner">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs font-bold uppercase">
                                                {user.name.substring(0, 2)}
                                            </span>
                                        )}
                                        <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                                    </div>

                                    <span className="max-w-[140px] truncate text-gray-700 group-hover:text-gray-900">
                                        {user.name}
                                    </span>

                                    <svg
                                        className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:translate-y-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content
                                align="right"
                                width="48"
                                className="rounded-2xl border border-gray-100 shadow-xl mt-1"
                            >
                                <Dropdown.Link
                                    href="#"
                                    className="rounded-t-xl hover:bg-gray-50 text-gray-700"
                                >
                                    Profile Settings
                                </Dropdown.Link>
                                <div className="border-t border-gray-100" />
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="rounded-b-xl text-red-600 hover:bg-red-50/60 flex items-center gap-2 font-medium"
                                >
                                    Sign Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                    {/* Mobile Toggle Trigger */}
                    <div className="-me-2 flex items-center sm:hidden">
                        <button
                            onClick={() =>
                                setShowingNavigationDropdown((prev) => !prev)
                            }
                            className="inline-flex items-center justify-center rounded-xl p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    className={
                                        !showingNavigationDropdown
                                            ? "inline-flex"
                                            : "hidden"
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={
                                        showingNavigationDropdown
                                            ? "inline-flex"
                                            : "hidden"
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

