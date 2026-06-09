import { Head, Link } from "@inertiajs/react";
import Iridescence from "../Components/Iridescence";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Benbar Factory" />

            <div className="relative min-h-screen overflow-hidden">

                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <Iridescence
                        color={[0.5, 0.6, 0.8]}
                        mouseReact={true}
                        amplitude={0.1}
                        speed={1}
                    />
                </div>

                {/* Foreground (ALL content here) */}
                <div className="relative z-10 min-h-screen flex flex-col">

                    {/* Navbar */}
                    <header className="border-b bg-white/80 backdrop-blur shadow-sm">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold text-white">
                                    B
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-blue-700">
                                        Benbar Factory
                                    </h1>
                                    <p className="text-xs text-gray-500">
                                        Freelance & Industrial Services Platform
                                    </p>
                                </div>
                            </div>

                            <nav className="flex gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="rounded-lg border border-indigo-600 px-5 py-2 text-blue-600 hover:bg-blue-50"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            href={route("register")}
                                            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </header>

                    {/* Hero / CTA */}
                    <main className="flex-1 flex items-center justify-center">
                        <section className="text-center px-6 py-20">
                            <h2 className="mb-4 text-4xl font-bold text-white">
                                Ready to Start?
                            </h2>

                            <p className="mb-8 text-white max-w-xl mx-auto">
                                Join Benbar Factory and connect with clients, freelancers,
                                and industrial opportunities.
                            </p>

                            <Link
                                href={route("register")}
                                className="rounded-lg bg-indigo-800 px-8 py-3 text-white hover:bg-blue-700"
                            >
                                Create Account
                            </Link>
                        </section>
                    </main>

                   

                </div>
            </div>
        </>
    );
}