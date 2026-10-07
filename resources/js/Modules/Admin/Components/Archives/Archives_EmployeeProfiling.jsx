// resources/js/Modules/Admin/Components/ActivityLogs/EmployeeProfiling.jsx

import { useState } from 'react';
import { router } from '@inertiajs/react';

// ── Helpers ───────────────────────────────────────────────────────────

function formatDateOnly(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-PH', {
        year: 'numeric', month: 'short', day: 'numeric',
    });
}

function formatTimeOnly(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-PH', {
        hour: '2-digit', minute: '2-digit',
    });
}

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60)    return `${diff}s ago`;
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// ── Skeleton ──────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <tr className="border-b border-gray-50 last:border-0 animate-pulse">
            {[80, 140, 120, 100, 60].map((w, i) => (
                <td key={i} className="px-4 py-2.5">
                    <div className={`h-2.5 bg-gray-100 rounded-full`} style={{ maxWidth: w }} />
                </td>
            ))}
        </tr>
    );
}

function SkeletonCard() {
    return (
        <div className="px-4 py-3 bg-white border-b border-gray-100 animate-pulse">
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                    <div className="h-2.5 bg-gray-100 rounded-full w-1/3" />
                </div>
                <div className="h-4 w-14 bg-gray-100 rounded-full" />
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full w-1/2 mb-3" />
            <div className="h-6 w-16 bg-gray-100 rounded-lg" />
        </div>
    );
}

// ── Pagination ────────────────────────────────────────────────────────

function Pagination({ currentPage, lastPage, total, perPage, onPageChange, isLoading }) {
    if (lastPage <= 1) return null;

    const from = (currentPage - 1) * perPage + 1;
    const to   = Math.min(currentPage * perPage, total);

    // Build visible page numbers with ellipsis
    const pages = [];
    for (let i = 1; i <= lastPage; i++) {
        if (
            i === 1 || i === lastPage ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(i);
        } else if (
            i === currentPage - 2 || i === currentPage + 2
        ) {
            pages.push('...');
        }
    }
    const deduped = pages.filter((p, i) => p !== pages[i - 1]);

    return (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
            <span className="text-[10px] text-gray-400 tabular-nums">
                {from}–{to} of {total}
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400
                        hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30
                        disabled:cursor-not-allowed transition-all duration-150"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>

                {deduped.map((p, i) =>
                    p === '...' ? (
                        <span key={`ellipsis-${i}`} className="w-6 h-6 flex items-center justify-center
                            text-[10px] text-gray-300">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            disabled={isLoading}
                            className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px]
                                font-semibold transition-all duration-150 disabled:cursor-not-allowed
                                ${p === currentPage
                                    ? 'bg-[#1a5c3a] text-white shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === lastPage || isLoading}
                    className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400
                        hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30
                        disabled:cursor-not-allowed transition-all duration-150"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

// ── Badges ────────────────────────────────────────────────────────────

function DeletedBadge({ date }) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
            bg-red-50 border border-red-100 text-[10px] font-semibold text-red-500 whitespace-nowrap">
            <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3"/>
            </svg>
            Deleted {timeAgo(date)}
        </span>
    );
}

// ── Restore Button ────────────────────────────────────────────────────

function RestoreButton({ onClick, restoring }) {
    return (
        <button
            onClick={onClick}
            disabled={restoring}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold
                text-[#1a5c3a] border border-[#1a5c3a]/30 rounded-lg
                hover:bg-[#1a5c3a] hover:text-white hover:border-[#1a5c3a]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 flex-shrink-0 active:scale-95"
        >
            {restoring ? (
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
            ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0
                           0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
            )}
            Restore
        </button>
    );
}

// ── Empty State ───────────────────────────────────────────────────────

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                           M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                           m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            </div>
            <p className="text-sm font-semibold text-gray-300">No archived employees</p>
            <p className="text-[11px] text-gray-200 mt-0.5">Deleted records will appear here.</p>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────

export default function EmployeeProfiling({ pagination, isLoading, onPageChange }) {
    const [restoringId, setRestoringId] = useState(null);

    const records      = pagination?.data         ?? [];
    const currentPage  = pagination?.current_page ?? 1;
    const lastPage     = pagination?.last_page     ?? 1;
    const total        = pagination?.total         ?? 0;
    const perPage      = pagination?.per_page      ?? 20;

    function handleRestore(id) {
        setRestoringId(id);
        router.post(route('admin.users.restore', { user: id }), {}, {
            preserveScroll: true,
            preserveState: true,
            only: ['archivedUsers', 'archivedPositions', 'positionAssignmentLogs', 'stats'],
            onFinish: () => setRestoringId(null),
        });
    }

    if (isLoading) {
        return (
            <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="hidden md:block">
                    <table className="w-full text-xs border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {['Employee ID', 'Name', 'Department', 'Status', ''].map((h, i) => (
                                    <th key={i} className="text-left px-4 py-2.5">
                                        <div className="h-2 bg-gray-100 rounded-full w-12 animate-pulse" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                        </tbody>
                    </table>
                </div>
                <div className="md:hidden divide-y divide-gray-100">
                    {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    if (!records.length) return <EmptyState />;

    return (
        <div className="rounded-xl border border-gray-100 overflow-hidden">

            {/* ── Mobile cards ── */}
            <div className="md:hidden divide-y divide-gray-100">
                {records.map(row => (
                    <div key={row.id}
                        className="px-4 py-3 bg-white hover:bg-gray-50/60
                            transition-colors duration-150">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-700 text-[13px] truncate leading-snug">
                                    {row.name}
                                </p>
                                <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                                    {row.employee_id}
                                </p>
                            </div>
                            <DeletedBadge date={row.deleted_at} />
                        </div>
                        <p className="text-[11px] text-gray-500 mb-1">{row.department}</p>
                        <div className="flex items-center gap-2 mb-2.5">
                            <span className="text-[10px] font-medium text-gray-600">
                                {formatDateOnly(row.deleted_at)}
                            </span>
                            <span className="text-[10px] text-gray-400 tabular-nums">
                                {formatTimeOnly(row.deleted_at)}
                            </span>
                        </div>
                        <RestoreButton
                            onClick={() => handleRestore(row.id)}
                            restoring={restoringId === row.id}
                        />
                    </div>
                ))}
            </div>

            {/* ── Desktop table ── */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400
                                uppercase tracking-wider w-32">
                                Employee ID
                            </th>
                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400
                                uppercase tracking-wider">
                                Name
                            </th>
                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400
                                uppercase tracking-wider">
                                Department
                            </th>
                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400
                                uppercase tracking-wider w-52">
                                Deleted
                            </th>
                            <th className="px-4 py-2.5 w-20" />
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(row => (
                            <tr key={row.id}
                                className="border-b border-gray-50 last:border-0
                                    hover:bg-gray-50/60 transition-colors duration-150">
                                <td className="px-4 py-2.5">
                                    <span className="font-mono text-gray-500 text-[11px]">
                                        {row.employee_id}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5">
                                    <span className="font-semibold text-gray-700">{row.name}</span>
                                </td>
                                <td className="px-4 py-2.5 text-gray-500">{row.department}</td>
                                <td className="px-4 py-2.5">
                                    <div className="flex flex-col gap-1">
                                        <DeletedBadge date={row.deleted_at} />
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-medium text-gray-600">
                                                {formatDateOnly(row.deleted_at)}
                                            </span>
                                            <span className="text-[10px] text-gray-400 tabular-nums">
                                                {formatTimeOnly(row.deleted_at)}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                    <RestoreButton
                                        onClick={() => handleRestore(row.id)}
                                        restoring={restoringId === row.id}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ── */}
            <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                total={total}
                perPage={perPage}
                onPageChange={onPageChange}
                isLoading={isLoading}
            />
        </div>
    );
}
