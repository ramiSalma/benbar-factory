import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

const statusClasses = {
    draft: "bg-slate-100 text-slate-700 border-slate-200",
    published: "bg-sky-50 text-sky-700 border-sky-200",
    in_review: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    closed: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

function formatBudget(request) {
    if (!request.budget_min && !request.budget_max) {
        return "Open";
    }

    return `${request.currency || "USD"} ${request.budget_min || 0} - ${request.budget_max || "open"}`;
}

export default function Index({ requests }) {
    const accept = (id) => {
        if (!confirm("Accept this client request and generate the project cahier de charge?")) {
            return;
        }

        router.post(route("admin.client-requests.accept", id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Admin Requests" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
                            Admin
                        </p>
                        <h1 className="text-3xl font-black text-slate-950">
                            Client requests
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Review requests, accept valid demand, and generate projects.
                        </p>
                    </div>
                    <Link
                        href={route("client-requests.create")}
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
                    >
                        New request
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Request</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Client</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Budget</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {requests.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-500">
                                            No client requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.data.map((request) => (
                                        <tr key={request.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-4">
                                                <Link
                                                    href={route("admin.client-requests.show", request.id)}
                                                    className="font-bold text-slate-950 hover:text-indigo-600"
                                                >
                                                    {request.title}
                                                </Link>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {request.project_type} · {request.deadline || "No deadline"} · {request.projects_count} project(s)
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-700">
                                                <div className="font-semibold">{request.client?.name || "Unknown"}</div>
                                                <div className="text-xs text-slate-500">{request.client?.email}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                                                {formatBudget(request)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusClasses[request.status] || statusClasses.draft}`}>
                                                    {request.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex justify-end gap-3 text-sm font-bold">
                                                    <Link
                                                        href={route("admin.client-requests.show", request.id)}
                                                        className="text-slate-600 hover:text-indigo-600"
                                                    >
                                                        Review
                                                    </Link>
                                                    {request.status !== "accepted" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => accept(request.id)}
                                                            className="text-emerald-600 hover:text-emerald-700"
                                                        >
                                                            Accept
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {requests.links.length > 3 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3">
                            {requests.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || "#"}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-md px-3 py-1.5 text-xs font-bold ${
                                        link.active
                                            ? "bg-indigo-600 text-white"
                                            : link.url
                                              ? "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                                              : "text-slate-300"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;
