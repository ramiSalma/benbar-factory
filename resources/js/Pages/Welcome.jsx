import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Benbar Factory" />

            <div className="min-h-screen bg-white">
                {/* Navbar */}
                <header className="border-b bg-white shadow-sm">
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
                                    className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="rounded-lg border border-blue-600 px-5 py-2 text-blue-600 transition hover:bg-blue-50"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href={route("register")}
                                        className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>


               

                {/* CTA */}
                <section className="bg-blue-50 py-20">
                    <div className="mx-auto max-w-4xl px-6 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-blue-700">
                            Ready to Start?
                        </h2>

                        <p className="mb-8 text-gray-600">
                            Join Benbar Factory today and connect with clients,
                            freelancers, and opportunities.
                        </p>

                        <Link
                            href={route("register")}
                            className="rounded-lg bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700"
                        >
                            Create Account
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t bg-white py-6 text-center text-gray-500">
                    © {new Date().getFullYear()} Benbar Factory. All rights
                    reserved.
                </footer>
            </div>
        </>
    );
}