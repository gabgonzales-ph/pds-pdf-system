// resources/js/Modules/Admin/Components/Positions.jsx

import { useState } from 'react';
import { router } from '@inertiajs/react';
import PositionsSearchAndFilter from './PositionsSearchAndFilter';
import PDFViewerModal from '../Positions/PDFViewerModal';

// ── Icons ─────────────────────────────────────────────────────────────

function IconEdit() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                   m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );
}

function IconTrash() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7
                   m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

function IconEmpty() {
    return (
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745
                   M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01
                   M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

function IconChevronRight() {
    return (
        <svg className="w-4 h-4 text-gray-300 group-hover:text-[#1a5c3a] transition-colors duration-200"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );
}

function IconArchive() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10
                   a2 2 0 002-2V8m-9 4h4" />
        </svg>
    );
}

// ── Status Badge ──────────────────────────────────────────────────────

function StatusBadge({ status }) {
    if (status === 'published') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Published
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
            text-[11px] font-semibold bg-slate-50 text-slate-500 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
            Draft
        </span>
    );
}

// ── Remove Confirmation Modal ─────────────────────────────────────────

function RemoveConfirmModal({ position, onConfirm, onCancel, isRemoving }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50
            animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100
                w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">

                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4
                               c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h3 className="text-base font-bold text-gray-800 text-center mb-1">Remove Position</h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Are you sure you want to permanently remove{' '}
                    <span className="font-semibold text-gray-700">
                        {position.position_title || 'this position'}
                    </span>? This cannot be undone.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isRemoving}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700
                            bg-white border border-gray-200 rounded-xl
                            hover:bg-gray-50 active:scale-95 transition-all duration-150 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isRemoving}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl
                            hover:bg-red-600 active:scale-95 transition-all duration-150
                            disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isRemoving ? 'Removing…' : 'Yes, Remove'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Pagination ────────────────────────────────────────────────────────

function Pagination({ prevUrl, nextUrl, total, from, to, pageLinks, lastPage }) {
    if (lastPage <= 1) return null;

    function goTo(url) {
        if (!url) return;
        router.get(url, {}, {
            preserveState: true,
            preserveScroll: false,
            only: ['positions', 'posFilters'],
        });
    }

    const pages = pageLinks.slice(1, -1);

    return (
        <div className="flex items-center justify-between px-1 mt-4">
            <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{from}</span>–
                <span className="font-medium text-gray-600">{to}</span> of{' '}
                <span className="font-medium text-gray-600">{total}</span> positions
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => goTo(prevUrl)}
                    disabled={!prevUrl}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200
                        rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all duration-150"
                >
                    Previous
                </button>
                <div className="hidden sm:flex items-center gap-1">
                    {pages.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(link.url)}
                            disabled={!link.url}
                            className={`w-8 h-8 text-xs font-medium rounded-lg transition-all duration-150
                                ${link.active
                                    ? 'bg-[#1a5c3a] text-white border border-[#1a5c3a]'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}
                                disabled:opacity-40`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
                <button
                    onClick={() => goTo(nextUrl)}
                    disabled={!nextUrl}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200
                        rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all duration-150"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

// ── Row animation ─────────────────────────────────────────────────────

const rowAnimation = `
@keyframes posRowIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('positions-anim')) {
    const style = document.createElement('style');
    style.id = 'positions-anim';
    style.textContent = rowAnimation;
    document.head.appendChild(style);
}

// ── Main Positions Component ──────────────────────────────────────────

export default function Positions({ positions = {}, posFilters = {}, onNavigate }) {
    const [viewingPosition,  setViewingPosition]  = useState(null);
    const [removingPosition, setRemovingPosition] = useState(null);
    const [isRemoving,       setIsRemoving]       = useState(false);

    const rows      = positions.data          ?? [];
    const prevUrl   = positions.prev_page_url ?? null;
    const nextUrl   = positions.next_page_url ?? null;
    const total     = positions.total         ?? 0;
    const from      = positions.from          ?? 0;
    const to        = positions.to            ?? 0;
    const pageLinks = positions.links         ?? [];
    const lastPage  = positions.last_page     ?? 1;

    function handleRemoveConfirm() {
        if (!removingPosition) return;
        setIsRemoving(true);
        router.delete(route('admin.positions.destroy', { position: removingPosition.id }), {
            preserveState: true,
            only: ['positions', 'stats', 'posFilters', 'archivedPositions'],
            onSuccess: () => {
                setRemovingPosition(null);
                setIsRemoving(false);
                // Close PDF modal if the position being viewed is removed
                if (viewingPosition?.id === removingPosition.id) setViewingPosition(null);
            },
            onError: () => setIsRemoving(false),
        });
    }

    function handleEdit(position) {
        router.visit(route('admin.positions.edit', { position: position.id }));
    }

    function handleRowClick(pos, e) {
        if (e.target.closest('button')) return;
        setViewingPosition(pos);
    }

    return (
        <div>
            {/* ── Search & Filter ── */}
            <PositionsSearchAndFilter filters={posFilters} />

            {/* ── Table card ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* ── Table header bar with Position Archives button ── */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/40">
                    <p className="text-xs font-semibold text-gray-500">
                        {total > 0 ? `${total} position${total !== 1 ? 's' : ''} available` : 'No positions'}
                    </p>
                    <button
                        onClick={() => onNavigate?.('archives')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                            text-gray-500 border border-gray-200 rounded-lg bg-white
                            hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300
                            active:scale-95 transition-all duration-150"
                    >
                        <IconArchive />
                        Position Archives
                    </button>
                </div>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                {[
                                    'Position Title',
                                    'Department / Agency',
                                    'Salary Grade',
                                    'Status',
                                    'Date Added',
                                ].map(label => (
                                    <th key={label} className="text-left text-[11px] font-bold text-gray-400
                                        uppercase tracking-wider px-5 py-3.5">
                                        {label}
                                    </th>
                                ))}
                                {/* Chevron column */}
                                <th className="px-4 py-3.5 w-8" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <IconEmpty />
                                            <p className="text-sm text-gray-400 font-medium">No positions found</p>
                                            <p className="text-xs text-gray-300">Add a position to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : rows.map((pos, i) => (
                                <tr
                                    key={pos.id}
                                    onClick={(e) => handleRowClick(pos, e)}
                                    className={`group cursor-pointer transition-all duration-150
                                        ${viewingPosition?.id === pos.id
                                            ? 'bg-[#1a5c3a]/[0.06] border-l-[3px] border-l-[#1a5c3a]'
                                            : 'hover:bg-[#1a5c3a]/[0.03] hover:border-l-[3px] hover:border-l-[#1a5c3a]/40 border-l-[3px] border-l-transparent'
                                        }`}
                                    style={{ animation: `posRowIn 300ms ease-out ${i * 40}ms both` }}
                                >
                                    <td className="px-5 py-3.5">
                                        <span className={`font-medium transition-colors duration-150
                                            ${viewingPosition?.id === pos.id ? 'text-[#1a5c3a]' : 'text-gray-800'}`}>
                                            {pos.position_title || '—'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-gray-500 text-xs">{pos.department_agency || '—'}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="font-mono text-xs font-semibold text-[#1a7a52]">
                                            {pos.salary_grade ? `SG-${pos.salary_grade}` : '—'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <StatusBadge status={pos.status} />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-gray-500 text-xs">{pos.date_added}</span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <IconChevronRight />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-gray-100">
                    {rows.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3">
                            <IconEmpty />
                            <p className="text-sm text-gray-400 font-medium">No positions found</p>
                        </div>
                    ) : rows.map((pos, i) => (
                        <div
                            key={pos.id}
                            onClick={(e) => handleRowClick(pos, e)}
                            className={`px-4 py-4 cursor-pointer transition-all duration-150
                                ${viewingPosition?.id === pos.id
                                    ? 'bg-[#1a5c3a]/[0.06] border-l-[3px] border-l-[#1a5c3a]'
                                    : 'hover:bg-[#1a5c3a]/[0.03] active:bg-[#1a5c3a]/[0.06] border-l-[3px] border-l-transparent hover:border-l-[#1a5c3a]/40'
                                }`}
                            style={{ animation: `posRowIn 300ms ease-out ${i * 40}ms both` }}
                        >
                            <div className="flex items-start justify-between mb-1">
                                <p className={`font-medium text-sm pr-3 transition-colors duration-150
                                    ${viewingPosition?.id === pos.id ? 'text-[#1a5c3a]' : 'text-gray-800'}`}>
                                    {pos.position_title || '—'}
                                </p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <StatusBadge status={pos.status} />
                                    <IconChevronRight />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mb-0.5">{pos.department_agency || '—'}</p>
                            <p className="font-mono text-xs font-semibold text-[#1a7a52]">
                                {pos.salary_grade ? `SG-${pos.salary_grade}` : '—'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{pos.date_added}</p>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {rows.length > 0 && (
                    <div className="px-5 py-4 border-t border-gray-100">
                        <Pagination
                            prevUrl={prevUrl} nextUrl={nextUrl}
                            total={total} from={from} to={to}
                            pageLinks={pageLinks} lastPage={lastPage}
                        />
                    </div>
                )}
            </div>

            {/* ── PDF Viewer Modal (with Edit + Remove in header) ── */}
            {viewingPosition && (
                <PDFViewerModal
                    positionId={viewingPosition.id}
                    positionTitle={viewingPosition.position_title}
                    onClose={() => setViewingPosition(null)}
                    onEdit={() => handleEdit(viewingPosition)}
                    onRemove={() => {
                        setRemovingPosition(viewingPosition);
                        setViewingPosition(null);
                    }}
                />
            )}

            {/* ── Remove Confirmation Modal ── */}
            {removingPosition && (
                <RemoveConfirmModal
                    position={removingPosition}
                    onConfirm={handleRemoveConfirm}
                    onCancel={() => setRemovingPosition(null)}
                    isRemoving={isRemoving}
                />
            )}
        </div>
    );
}