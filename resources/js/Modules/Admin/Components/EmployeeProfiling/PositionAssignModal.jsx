import { useState, useRef, useEffect } from 'react';
import { TIER_ORDER, tierCfg, tierLabel } from './tierConfig';

// ── Spinner ───────────────────────────────────────────────────────────

function IconSpinner({ className = 'w-4 h-4' }) {
    return (
        <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5"
                strokeLinecap="round" strokeDasharray="50" strokeDashoffset="15" />
        </svg>
    );
}

// ── Remove Account Confirm Modal ──────────────────────────────────────

export function RemoveConfirmModal({ employee, onConfirm, onCancel, isRemoving }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50
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

                <h3 className="text-base font-bold text-gray-800 text-center mb-1">Remove Account</h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Are you sure you want to permanently remove{' '}
                    <span className="font-semibold text-gray-700">{employee?.name}</span>'s account?
                    This will delete all their data and cannot be undone.
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

// ── Available Positions Panel ─────────────────────────────────────────

function AvailablePositionsPanel({ emp, cacheEntry, search, onSearchChange, onAssign, assigningId }) {
    const [confirmingPos, setConfirmingPos] = useState(null);
    const searchRef = useRef(null);

    useEffect(() => {
        if (searchRef.current) searchRef.current.focus();
    }, []);

    const rawPositions = cacheEntry?.positions ?? {};
    const q = search.trim().toLowerCase();
    const { loading, assignable, message } = cacheEntry ?? { loading: true };

    const allTiers = Array.from(new Set([...TIER_ORDER, ...Object.keys(rawPositions)]));

    const filtered = {};
    allTiers.forEach(tier => {
        const list = (rawPositions[tier] ?? []).filter(p =>
            !q || p.position_title.toLowerCase().includes(q) || (p.item_number ?? '').toLowerCase().includes(q)
        );
        if (list.length) filtered[tier] = list;
    });

    const hasResults = Object.keys(filtered).length > 0;
    const totalAvailable = Object.values(rawPositions).reduce((s, l) => s + l.length, 0);
    const shownCount = Object.values(filtered).reduce((s, l) => s + l.length, 0);

    function selectPosition(pos) {
        if (assigningId) return;
        setConfirmingPos(pos);
    }

    function confirmAssign() {
        if (!confirmingPos) return;
        onAssign(confirmingPos);
        setConfirmingPos(null);
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Search */}
            <div className="px-4 pt-3 pb-3 flex-shrink-0">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={searchRef}
                        type="text"
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="Search by title or item number…"
                        className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200
                            rounded-xl outline-none focus:ring-2 focus:ring-[#1a5c3a]/20
                            focus:border-[#1a5c3a]/40 placeholder-gray-400 transition-all duration-150"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2
                                text-gray-400 hover:text-gray-600 transition-colors duration-150"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="h-px bg-gray-100 flex-shrink-0 mx-4" />

            {/* Scrollable list */}
            <div className="overflow-y-auto flex-1 min-h-0 py-2">
                {loading && (
                    <div className="py-14 flex flex-col items-center gap-3">
                        <IconSpinner className="w-6 h-6 text-[#1a5c3a]" />
                        <p className="text-xs text-gray-400 font-medium">Loading available positions…</p>
                    </div>
                )}

                {!loading && !assignable && (
                    <div className="mx-4 my-6 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-5
                        flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94
                                       a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-amber-800">PDS Incomplete</p>
                            <p className="text-xs text-amber-700/80 mt-1 leading-relaxed">
                                {message ?? 'The employee must complete their Personal Data Sheet before positions can be assigned.'}
                            </p>
                        </div>
                    </div>
                )}

                {!loading && assignable && !hasResults && (
                    <div className="py-12 flex flex-col items-center gap-2 text-center px-5">
                        <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                                   M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm font-semibold text-gray-500">
                            {q ? 'No matches found' : 'All positions assigned'}
                        </p>
                        <p className="text-xs text-gray-400">
                            {q ? `No positions match "${q}"` : 'This employee holds all available positions.'}
                        </p>
                    </div>
                )}

                {!loading && assignable && hasResults &&
                    allTiers.filter(t => filtered[t]).map(tier => {
                        const cfg = tierCfg(tier);
                        return (
                            <div key={tier} className="mb-1">
                                <div className={`mx-4 mb-1 px-3 py-1.5 rounded-lg flex items-center gap-2 ${cfg.header} border-0`}>
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.label}`}>
                                        {tierLabel(tier)}
                                    </span>
                                    <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.pill}`}>
                                        {filtered[tier].length}
                                    </span>
                                </div>

                                <div className="mx-4 rounded-xl border border-gray-100 overflow-hidden mb-3">
                                    {filtered[tier].map((pos, idx) => {
                                        const isConfirming = confirmingPos?.id === pos.id;
                                        const isAssigning = assigningId === pos.id;
                                        const isLast = idx === filtered[tier].length - 1;
                                        return (
                                            <button
                                                key={pos.id}
                                                onClick={() => selectPosition(pos)}
                                                disabled={!!assigningId}
                                                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left
                                                    transition-all duration-150 group disabled:cursor-not-allowed
                                                    ${!isLast ? 'border-b border-gray-50' : ''}
                                                    ${isConfirming ? 'bg-[#1a5c3a]/5' : `bg-white ${cfg.row}`}`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-semibold truncate leading-tight
                                                        transition-colors duration-150
                                                        ${isConfirming ? 'text-[#1a5c3a]' : 'text-gray-800'}`}>
                                                        {pos.position_title}
                                                    </p>
                                                    {pos.item_number && (
                                                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                                                            Item No. {pos.item_number}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={`flex-shrink-0 transition-all duration-150
                                                    ${isConfirming ? 'text-[#1a5c3a]' : cfg.icon}`}>
                                                    {isAssigning
                                                        ? <IconSpinner className="w-4 h-4 text-[#1a5c3a]" />
                                                        : isConfirming
                                                            ? (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            )
                                                    }
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            {/* Assign Confirmation Footer */}
            <div className={`flex-shrink-0 overflow-hidden transition-all duration-300 ease-out
                ${confirmingPos ? 'max-h-52 opacity-100' : 'max-h-0 opacity-0'}`}>
                {confirmingPos && (() => {
                    const cfg = tierCfg(confirmingPos.tier);
                    return (
                        <div className="border-t-2 border-[#1a5c3a]/10 bg-gradient-to-b from-white to-gray-50/80 px-4 py-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                                Confirm Assignment
                            </p>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm mb-3">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg
                                    text-[10px] font-bold border flex-shrink-0 ${cfg.badge}`}>
                                    <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                                    {tierLabel(confirmingPos.tier)}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                                        {confirmingPos.position_title}
                                    </p>
                                    {confirmingPos.item_number && (
                                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                                            Item No. {confirmingPos.item_number}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfirmingPos(null)}
                                    className="flex-1 px-3 py-2.5 text-xs font-semibold text-gray-600
                                        bg-white border border-gray-200 rounded-xl
                                        hover:bg-gray-50 active:scale-95 transition-all duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAssign}
                                    disabled={!!assigningId}
                                    className="flex-[2] px-3 py-2.5 text-xs font-semibold text-white
                                        bg-[#1a5c3a] rounded-xl shadow-sm shadow-[#1a5c3a]/20
                                        hover:bg-[#14472e] active:scale-95 transition-all duration-150
                                        disabled:opacity-60 disabled:cursor-not-allowed
                                        flex items-center justify-center gap-1.5"
                                >
                                    {assigningId
                                        ? <><IconSpinner className="w-3 h-3" /> Assigning…</>
                                        : <>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Confirm Assignment
                                        </>
                                    }
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Footer count */}
            {!loading && assignable && totalAvailable > 0 && !confirmingPos && (
                <div className="flex-shrink-0 border-t border-gray-100 px-4 py-2.5">
                    <p className="text-[11px] text-gray-400 text-center">
                        {q && hasResults
                            ? `${shownCount} of ${totalAvailable} positions shown`
                            : `${totalAvailable} positions available`
                        }
                    </p>
                </div>
            )}
        </div>
    );
}

// ── Assigned Positions Panel ──────────────────────────────────────────

function AssignedPositionsPanel({ emp, positions, onRemove, isRemoving }) {
    const [confirmingRemove, setConfirmingRemove] = useState(null);

    useEffect(() => {
        if (confirmingRemove && !positions.find(p => p.id === confirmingRemove.id)) {
            setConfirmingRemove(null);
        }
    }, [positions, confirmingRemove]);

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Scrollable list */}
            <div className="overflow-y-auto flex-1 min-h-0 p-4">
                {positions.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-2 text-center">
                        <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7
                                   a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm font-semibold text-gray-500">No positions assigned</p>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                            Use the Assign tab to add a position.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {positions.map(pos => {
                            const cfg = tierCfg(pos.tier);
                            const isConfirming = confirmingRemove?.id === pos.id;

                            return (
                                <div
                                    key={pos.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border
                                        transition-all duration-200
                                        ${isConfirming
                                            ? 'border-red-200 bg-red-50/40 shadow-sm shadow-red-100'
                                            : 'border-gray-100 bg-white hover:border-gray-200'
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                                            {pos.position_title}
                                        </p>
                                        <span className={`inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5
                                            rounded text-[10px] font-bold border ${cfg.badge}`}>
                                            {tierLabel(pos.tier)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setConfirmingRemove(isConfirming ? null : pos)}
                                        disabled={isRemoving}
                                        title={isConfirming ? 'Cancel removal' : `Remove ${pos.position_title}`}
                                        className={`flex-shrink-0 w-7 h-7 flex items-center justify-center
                                            rounded-lg border transition-all duration-150 active:scale-90
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            ${isConfirming
                                                ? 'bg-red-500 border-red-500 text-white'
                                                : 'bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50'
                                            }`}
                                    >
                                        {isRemoving && isConfirming
                                            ? <IconSpinner className="w-3 h-3" />
                                            : (
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7
                                                           m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )
                                        }
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Inline Remove Confirmation */}
            <div className={`flex-shrink-0 overflow-hidden transition-all duration-300 ease-out
                ${confirmingRemove ? 'max-h-52 opacity-100' : 'max-h-0 opacity-0'}`}>
                {confirmingRemove && (() => {
                    const cfg = tierCfg(confirmingRemove.tier);
                    return (
                        <div className="border-t-2 border-red-100 bg-gradient-to-b from-white to-red-50/40 px-4 py-4">
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3">
                                Confirm Removal
                            </p>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-red-100 shadow-sm mb-3">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg
                                    text-[10px] font-bold border flex-shrink-0 ${cfg.badge}`}>
                                    <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                                    {tierLabel(confirmingRemove.tier)}
                                </span>
                                <p className="text-sm font-semibold text-gray-800 truncate flex-1 leading-tight">
                                    {confirmingRemove.position_title}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfirmingRemove(null)}
                                    disabled={isRemoving}
                                    className="flex-1 px-3 py-2.5 text-xs font-semibold text-gray-600
                                        bg-white border border-gray-200 rounded-xl
                                        hover:bg-gray-50 active:scale-95 transition-all duration-150
                                        disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { onRemove(confirmingRemove); setConfirmingRemove(null); }}
                                    disabled={isRemoving}
                                    className="flex-[2] px-3 py-2.5 text-xs font-semibold text-white
                                        bg-red-500 rounded-xl hover:bg-red-600 active:scale-95
                                        transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed
                                        flex items-center justify-center gap-1.5"
                                >
                                    {isRemoving
                                        ? <><IconSpinner className="w-3 h-3" /> Removing…</>
                                        : 'Yes, Remove Position'
                                    }
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

// ── Position Assign Modal ─────────────────────────────────────────────

export function PositionAssignModal({
    emp,
    positions,
    cacheEntry,
    search,
    onSearchChange,
    onAssign,
    onRemove,
    onClose,
    assigningId,
    isRemoving,
}) {
    const [activeTab, setActiveTab] = useState('assign');

    // Escape → close
    useEffect(() => {
        function handler(e) { if (e.key === 'Escape') onClose(); }
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // Lock body scroll
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    const tabs = [
        {
            id: 'assign',
            label: 'Assign Position',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745
                           M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01
                           M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            id: 'assigned',
            label: 'Assigned',
            badge: positions.length || null,
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                           M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
        },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col md:items-center md:justify-center
                bg-black/40 backdrop-blur-sm"
            style={{ animation: 'fadeInBackdrop 200ms ease forwards' }}
            onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <style>{`
                @keyframes fadeInBackdrop { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUpSheet   { from { transform: translateY(100%) } to { transform: translateY(0) } }
                @keyframes slideDownDesktop { from { opacity: 0; transform: translateY(-12px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
            `}</style>

            {/* ── Mobile: full-screen bottom sheet ── */}
            <div
                className="
                    md:hidden flex flex-col bg-white w-full
                    rounded-t-2xl overflow-hidden
                    fixed bottom-0 left-0 right-0
                "
                style={{
                    height: '92dvh',
                    animation: 'slideUpSheet 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards',
                }}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* Mobile header */}
                <div className="px-4 pt-2 pb-3 flex items-center justify-between gap-3 flex-shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#1a5c3a]/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4.5 h-4.5 text-[#1a5c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                                       M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                                       m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 leading-tight truncate">Manage Positions</p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{emp?.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                            text-gray-500 hover:bg-gray-200 active:scale-90 transition-all duration-150"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tab bar */}
                <div className="px-4 pb-0 flex-shrink-0">
                    <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                                    text-xs font-semibold transition-all duration-200
                                    ${activeTab === tab.id
                                        ? 'bg-white text-[#1a5c3a] shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }
                                `}
                            >
                                {tab.icon}
                                {tab.label}
                                {tab.badge != null && (
                                    <span className={`
                                        min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold
                                        flex items-center justify-center
                                        ${activeTab === tab.id
                                            ? 'bg-[#1a5c3a]/10 text-[#1a5c3a]'
                                            : 'bg-gray-200 text-gray-500'
                                        }
                                    `}>
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                <div className="flex-1 min-h-0 overflow-hidden mt-1">
                    <div
                        className="w-full h-full transition-all duration-200"
                        style={{ display: activeTab === 'assign' ? 'flex' : 'none', flexDirection: 'column' }}
                    >
                        <AvailablePositionsPanel
                            emp={emp}
                            cacheEntry={cacheEntry}
                            search={search}
                            onSearchChange={onSearchChange}
                            onAssign={(pos) => { onAssign(pos); setActiveTab('assigned'); }}
                            assigningId={assigningId}
                        />
                    </div>
                    <div
                        className="w-full h-full transition-all duration-200"
                        style={{ display: activeTab === 'assigned' ? 'flex' : 'none', flexDirection: 'column' }}
                    >
                        <AssignedPositionsPanel
                            emp={emp}
                            positions={positions}
                            onRemove={onRemove}
                            isRemoving={isRemoving}
                        />
                    </div>
                </div>
            </div>

            {/* ── Desktop: centred card, side-by-side panels ── */}
            <div
                className="hidden md:flex w-full max-w-5xl mx-4 gap-5"
                style={{
                    height: 'min(650px, 85vh)',
                    animation: 'slideDownDesktop 240ms ease forwards',
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-full
                        bg-white/10 hover:bg-white/20 text-white backdrop-blur-md
                        transition-all duration-150 active:scale-90 z-[60]"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left panel */}
                <div className="flex-1 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
                    {/* Panel header */}
                    <div className="px-5 pt-5 pb-4 flex items-center gap-3 flex-shrink-0 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-[#1a5c3a]/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-[#1a5c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745
                                       M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01
                                       M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 leading-tight">Assign Position</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{emp?.name}</p>
                        </div>
                    </div>
                    <AvailablePositionsPanel
                        emp={emp}
                        cacheEntry={cacheEntry}
                        search={search}
                        onSearchChange={onSearchChange}
                        onAssign={onAssign}
                        assigningId={assigningId}
                    />
                </div>

                {/* Right panel */}
                <div className="flex-1 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
                    {/* Panel header */}
                    <div className="px-5 pt-5 pb-4 flex items-center gap-3 flex-shrink-0 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-[#1a5c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                                       M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 leading-tight">Assigned Positions</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{emp?.name}</p>
                        </div>
                        {positions.length > 0 && (
                            <span className="ml-auto text-[11px] font-bold text-gray-400 bg-gray-50
                                px-2 py-0.5 rounded-full border border-gray-200">
                                {positions.length}
                            </span>
                        )}
                    </div>
                    <AssignedPositionsPanel
                        emp={emp}
                        positions={positions}
                        onRemove={onRemove}
                        isRemoving={isRemoving}
                    />
                </div>
            </div>
        </div>
    );
}