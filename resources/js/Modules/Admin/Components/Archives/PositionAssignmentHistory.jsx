// resources/js/Modules/Admin/Components/ActivityLogs/PositionAssignmentHistory.jsx

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
            {[160, 130, 60, 130, 90].map((w, i) => (
                <td key={i} className="px-4 py-2.5">
                    <div className="h-2.5 bg-gray-100 rounded-full" style={{ maxWidth: w }} />
                </td>
            ))}
        </tr>
    );
}

function SkeletonCard() {
    return (
        <div className="px-4 py-3 bg-white border-b border-gray-100 animate-pulse">
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                <div className="h-4 w-16 bg-gray-100 rounded-full" />
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full w-1/2 mb-1" />
            <div className="h-2.5 bg-gray-100 rounded-full w-1/3" />
        </div>
    );
}

// ── Pagination ────────────────────────────────────────────────────────

function Pagination({ currentPage, lastPage, total, perPage, onPageChange, isLoading }) {
    if (lastPage <= 1) return null;

    const from = (currentPage - 1) * perPage + 1;
    const to   = Math.min(currentPage * perPage, total);

    const pages = [];
    for (let i = 1; i <= lastPage; i++) {
        if (i === 1 || i === lastPage || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pages.push(i);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
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
                        <span key={`ellipsis-${i}`}
                            className="w-6 h-6 flex items-center justify-center text-[10px] text-gray-300">
                            …
                        </span>
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

// ── Event Badge ───────────────────────────────────────────────────────

function EventBadge({ event }) {
    const isAssigned = event === 'assigned';
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
            text-[10px] font-semibold whitespace-nowrap
            ${isAssigned
                ? 'bg-blue-50 border border-blue-100 text-blue-600'
                : 'bg-orange-50 border border-orange-100 text-orange-500'}`}>
            <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3"/>
            </svg>
            {isAssigned ? 'Assigned' : 'Unassigned'}
        </span>
    );
}

// ── Empty State ───────────────────────────────────────────────────────

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0
                           00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2
                           2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
            </div>
            <p className="text-sm font-semibold text-gray-300">No assignment history</p>
            <p className="text-[11px] text-gray-200 mt-0.5">
                Position assignments and removals will appear here.
            </p>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────

export default function PositionAssignmentHistory({ pagination, isLoading, onPageChange }) {
    const records     = pagination?.data         ?? [];
    const currentPage = pagination?.current_page ?? 1;
    const lastPage    = pagination?.last_page     ?? 1;
    const total       = pagination?.total         ?? 0;
    const perPage     = pagination?.per_page      ?? 20;

    if (isLoading) {
        return (
            <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="hidden md:block">
                    <table className="w-full text-xs border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {[...Array(5)].map((_, i) => (
                                    <th key={i} className="px-4 py-2.5">
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
                        className="px-4 py-3 bg-white hover:bg-gray-50/60 transition-colors duration-150">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="font-semibold text-gray-700 text-[13px] leading-snug pr-1 truncate">
                                {row.position_title}
                            </p>
                            <EventBadge event={row.event} />
                        </div>
                        <p className="text-[11px] text-gray-600 font-medium mb-0.5">
                            {row.user_name}
                        </p>
                        {row.employee_id && (
                            <p className="font-mono text-[10px] text-gray-400 mb-0.5">
                                {row.employee_id}
                            </p>
                        )}
                        {row.position_tier && (
                            <p className="text-[10px] text-gray-400 mb-1">{row.position_tier}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-medium text-gray-500">
                                {formatDateOnly(row.created_at)}
                            </span>
                            <span className="text-[10px] text-gray-400 tabular-nums">
                                {formatTimeOnly(row.created_at)}
                            </span>
                            <span className="text-[10px] text-gray-300">·</span>
                            <span className="text-[10px] text-gray-400">{timeAgo(row.created_at)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Desktop table ── */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400
                                uppercase tracking-wider">
                                Position Title
                            </th>
                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400
                                uppercase tracking-wider">
                                Employee
                            </th>
                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400
                                uppercase tracking-wider w-28">
                                Event
                            </th>
                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400
                                uppercase tracking-wider">
                                Tier
                            </th>
                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400
                                uppercase tracking-wider w-40">
                                Date & Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(row => (
                            <tr key={row.id}
                                className="border-b border-gray-50 last:border-0
                                    hover:bg-gray-50/60 transition-colors duration-150 align-top">
                                <td className="px-4 py-2.5">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-semibold text-gray-700">
                                            {row.position_title}
                                        </span>
                                        {row.position_tier && (
                                            <span className="text-[10px] text-gray-400">
                                                {row.position_tier}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-2.5">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium text-gray-700">
                                            {row.user_name}
                                        </span>
                                        {row.employee_id && (
                                            <span className="font-mono text-[10px] text-gray-400">
                                                {row.employee_id}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-2.5">
                                    <EventBadge event={row.event} />
                                </td>
                                <td className="px-4 py-2.5 text-gray-500 max-w-[180px]">
                                    {/* position_tier used as proxy for dept in logs — adjust if dept is added later */}
                                    <span className="truncate block text-[11px]">
                                        {row.position_tier ?? '—'}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-medium text-gray-600">
                                                {formatDateOnly(row.created_at)}
                                            </span>
                                            <span className="text-[10px] text-gray-400 tabular-nums">
                                                {formatTimeOnly(row.created_at)}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-gray-300">
                                            {timeAgo(row.created_at)}
                                        </span>
                                    </div>
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
