import React from "react";
import { Head, Link, router } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ requests }) {
    const destroy = (id) => {
        if (!confirm("Are you sure you want to delete this request?")) {
            return;
        }

        router.delete(route("client-requests.destroy", id), {
            preserveScroll: true,
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: "bg-slate-100 text-slate-700 border-slate-200",
            published: "bg-sky-50 text-sky-700 border-sky-200",
            in_review: "bg-cyan-50 text-cyan-700 border-cyan-200",
            accepted: "bg-blue-50 text-blue-700 border-blue-200",
            rejected: "bg-rose-50 text-rose-700 border-rose-200",
            closed: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="My Client Requests" />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Project Requests
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Manage and track your submitted project proposals.
                        </p>
                    </div>
                    <Link
                        href={route("client-requests.create")}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-sm shadow-blue-200 transition-all duration-200 text-sm"
                    >
                        Create New Request
                    </Link>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100">
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Budget
                                    </th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {requests.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="p-8 text-center text-slate-400 text-sm"
                                        >
                                            No requests found. Create your first
                                            one above!
                                        </td>
                                    </tr>
                                ) : (
                                    requests.data.map((req) => (
                                        <tr
                                            key={req.id}
                                            className="hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="p-4">
                                                <Link
                                                    href={route(
                                                        "client-requests.show",
                                                        req.id,
                                                    )}
                                                    className="font-medium text-slate-900 hover:text-blue-600 block transition-colors"
                                                >
                                                    {req.title}
                                                </Link>
                                                {req.deadline && (
                                                    <span className="text-xs text-slate-400 block mt-0.5">
                                                        Due: {req.deadline}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-slate-600 capitalize">
                                                {req.project_type}
                                            </td>
                                            <td className="p-4 text-sm text-slate-700 font-medium">
                                                {req.budget_min ||
                                                req.budget_max ? (
                                                    <>
                                                        {req.currency || "$"}
                                                        {req.budget_min ||
                                                            "0"}{" "}
                                                        -{" "}
                                                        {req.budget_max
                                                            ? `${req.currency || "$"}${req.budget_max}`
                                                            : "∞"}
                                                    </>
                                                ) : (
                                                    <span className="text-slate-400">
                                                        Not Specified
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)} capitalize`}
                                                >
                                                    {req.status.replace(
                                                        "_",
                                                        " ",
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-sm font-medium space-x-3">
                                                <Link
                                                    href={route(
                                                        "client-requests.show",
                                                        req.id,
                                                    )}
                                                    className="text-cyan-600 hover:text-cyan-700"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "client-requests.edit",
                                                        req.id,
                                                    )}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        destroy(req.id)
                                                    }
                                                    className="text-rose-600 hover:text-rose-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {requests.links.length > 3 && (
                        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center gap-1">
                            {requests.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || "#"}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                        link.active
                                            ? "bg-blue-600 text-white"
                                            : !link.url
                                              ? "text-slate-300 cursor-not-allowed"
                                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    }`}
                                    preserveScroll
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Index.layout = (page) => (
    <AuthenticatedLayout>
        {page}
    </AuthenticatedLayout>
);
