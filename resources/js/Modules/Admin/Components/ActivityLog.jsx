// resources/js/Modules/Admin/Components/ActivityLog.jsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

// ── Constants ─────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 15;

const ACTION_META = {
    ADMIN_LOGIN:            { label: 'Admin Login',       bg: 'bg-blue-50',   border: 'border-blue-100',   text: 'text-blue-600'   },
    ADMIN_LOGOUT:           { label: 'Admin Logout',      bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-500'   },
    USER_LOGIN:             { label: 'User Login',        bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600' },
    USER_LOGOUT:            { label: 'User Logout',       bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-500'   },
    USER_REGISTERED:        { label: 'User Registered',   bg: 'bg-green-50',  border: 'border-green-100',  text: 'text-green-700'  },
    PDS_REMOVED:            { label: 'PDS Removed',       bg: 'bg-red-50',    border: 'border-red-100',    text: 'text-red-600'    },
    PDS_RESTORED:           { label: 'PDS Restored',      bg: 'bg-green-50',  border: 'border-green-100',  text: 'text-green-700'  },
    POSITION_FORM_CREATED:  { label: 'Position Created',  bg: 'bg-green-50',  border: 'border-green-100',  text: 'text-green-700'  },
    POSITION_FORM_UPDATED:  { label: 'Position Updated',  bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-600'  },
    POSITION_FORM_REMOVED:  { label: 'Position Removed',  bg: 'bg-red-50',    border: 'border-red-100',    text: 'text-red-600'    },
    POSITION_FORM_RESTORED: { label: 'Position Restored', bg: 'bg-green-50',  border: 'border-green-100',  text: 'text-green-700'  },
};

const TABS = [
    {
        key:     'admin_auth',
        label:   'Admin',
        desc:    'Admin login & logout events',
        actions: ['ADMIN_LOGIN', 'ADMIN_LOGOUT'],
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955
                       11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29
                       9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
        ),
    },
    {
        key:     'user_auth',
        label:   'Users',
        desc:    'User logins, logouts & registrations',
        actions: ['USER_LOGIN', 'USER_LOGOUT', 'USER_REGISTERED'],
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                       M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                       m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
        ),
    },
    {
        key:     'pds',
        label:   'Employee Profiling',
        desc:    'PDS archive & restore actions',
        actions: ['PDS_REMOVED', 'PDS_RESTORED'],
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0
                       00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0
                       11-4 0 2 2 0 014 0zm0 0c0 1.657-1.343 3-3 3s-3-1.343-3-3"/>
            </svg>
        ),
    },
    {
        key:     'positions',
        label:   'Positions',
        desc:    'Position create, update & archive events',
        actions: ['POSITION_FORM_CREATED', 'POSITION_FORM_UPDATED', 'POSITION_FORM_REMOVED', 'POSITION_FORM_RESTORED'],
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2
                       2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0
                       00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
        ),
    },
];

// ── Helpers ───────────────────────────────────────────────────────────

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-PH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
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

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

function formatActorName(actor) {
    if (!actor) return '—';
    if (actor.personal_information) {
        const pi = actor.personal_information;
        const middleInitial = pi.middle_name ? ` ${pi.middle_name.charAt(0)}.` : '';
        const suffix = pi.suffix ? ` ${pi.suffix}` : '';
        return `${pi.first_name}${middleInitial} ${pi.last_name}${suffix}`.trim();
    }
    return actor.username;
}

// ── Icons ─────────────────────────────────────────────────────────────

function IconRefresh({ spinning }) {
    return (
        <svg className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003
                   8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
    );
}

function IconActivity() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0
                   0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0
                   0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
    );
}

function IconChevron({ open }) {
    return (
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
    );
}

function IconEmpty() {
    return (
        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0
                   0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0
                   0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
    );
}

// ── Dropdown ──────────────────────────────────────────────────────────

function TableDropdown({ selected, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const current = TABS.find(t => t.key === selected) ?? TABS[0];

    useEffect(() => {
        function handler(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-200
                    rounded-xl text-xs font-semibold text-gray-700 shadow-sm
                    hover:border-gray-300 hover:shadow transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/20 min-w-[220px]"
            >
                <span className="text-[#1a5c3a] flex-shrink-0">{current.icon}</span>
                <span className="flex-1 text-left truncate">{current.label}</span>
                <svg
                    className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200
                        ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            <div className={`absolute left-0 top-full mt-1.5 w-72 bg-white border border-gray-100
                rounded-xl shadow-lg overflow-hidden z-20
                transition-all duration-200 origin-top
                ${open
                    ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'}`}
                style={{ transformOrigin: 'top' }}
            >
                {TABS.map(opt => (
                    <button
                        key={opt.key}
                        onClick={() => { onChange(opt.key); setOpen(false); }}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left
                            transition-colors duration-150
                            ${selected === opt.key ? 'bg-[#1a5c3a]/5' : 'hover:bg-gray-50'}`}
                    >
                        <span className={`mt-0.5 flex-shrink-0 transition-colors duration-150
                            ${selected === opt.key ? 'text-[#1a5c3a]' : 'text-gray-400'}`}>
                            {opt.icon}
                        </span>
                        <div className="min-w-0">
                            <p className={`text-xs font-semibold truncate transition-colors duration-150
                                ${selected === opt.key ? 'text-[#1a5c3a]' : 'text-gray-700'}`}>
                                {opt.label}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</p>
                        </div>
                        {selected === opt.key && (
                            <svg className="w-3.5 h-3.5 text-[#1a5c3a] ml-auto mt-0.5 flex-shrink-0"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1
                                       1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"/>
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ── Action Badge ──────────────────────────────────────────────────────

function ActionBadge({ action }) {
    const meta = ACTION_META[action] ?? {
        label: action, bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full
            text-[10px] font-bold border ${meta.bg} ${meta.border} ${meta.text} whitespace-nowrap`}>
            {meta.label}
        </span>
    );
}

// ── Changes Diff Viewer ───────────────────────────────────────────────

function ChangesViewer({ changes }) {
    const [open, setOpen]     = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const btnRef              = useRef(null);

    useEffect(() => {
        if (!open) return;
        function reposition() {
            if (!btnRef.current) return;
            const rect = btnRef.current.getBoundingClientRect();
            setCoords({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
        }
        reposition();
        window.addEventListener('scroll', reposition, true);
        window.addEventListener('resize', reposition);
        return () => {
            window.removeEventListener('scroll', reposition, true);
            window.removeEventListener('resize', reposition);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        function handler(e) {
            if (!btnRef.current?.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    if (!changes || Object.keys(changes).length === 0)
        return <span className="text-gray-300 text-[11px]">—</span>;

    const entries       = Object.entries(changes);
    const isBeforeAfter = entries.some(
        ([, v]) => v !== null && typeof v === 'object' && ('before' in v || 'after' in v)
    );
    const fieldCount = entries.length;

    const renderValue = (value) => {
        if (value === null || value === undefined || value === '')
            return <em className="text-gray-300">—</em>;
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    const dropdown = open && createPortal(
        <div
            className="fixed z-[9999] rounded-xl border border-gray-100 overflow-hidden
                shadow-lg bg-white min-w-[260px] max-w-[360px]"
            style={{ top: coords.top, left: coords.left, animation: 'dropdownIn 150ms ease-out both' }}
        >
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {isBeforeAfter ? 'Field Changes' : 'Details'}
                </p>
            </div>
            <div className="divide-y divide-gray-50 max-h-52 overflow-y-auto">
                {isBeforeAfter
                    ? entries.map(([field, { before, after }]) => (
                        <div key={field} className="px-3 py-2.5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                {field.replace(/_/g, ' ')}
                            </p>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-start gap-1.5">
                                    <span className="text-[9px] font-bold text-red-400 uppercase
                                        bg-red-50 border border-red-100 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
                                        Before
                                    </span>
                                    <span className="text-[11px] text-gray-500 break-words leading-relaxed line-clamp-2">
                                        {renderValue(before)}
                                    </span>
                                </div>
                                <div className="flex items-start gap-1.5">
                                    <span className="text-[9px] font-bold text-green-600 uppercase
                                        bg-green-50 border border-green-100 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
                                        After
                                    </span>
                                    <span className="text-[11px] text-gray-700 font-medium break-words leading-relaxed line-clamp-2">
                                        {renderValue(after)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                    : entries.map(([field, value]) => (
                        <div key={field} className="px-3 py-2.5 flex items-start gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide
                                flex-shrink-0 pt-0.5 min-w-[80px]">
                                {field.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[11px] text-gray-700 font-medium break-words leading-relaxed">
                                {renderValue(value)}
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>,
        document.body
    );

    return (
        <div className="inline-block">
            <button
                ref={btnRef}
                onClick={() => setOpen(v => !v)}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg
                    text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100
                    hover:bg-amber-100 transition-colors duration-150"
            >
                <span>{fieldCount} field{fieldCount !== 1 ? 's' : ''}</span>
                <IconChevron open={open} />
            </button>
            {dropdown}
        </div>
    );
}

// ── Empty State ───────────────────────────────────────────────────────

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <IconEmpty />
            </div>
            <p className="text-sm font-semibold text-gray-400">No activity logs yet</p>
            <p className="text-xs text-gray-300 mt-1">Activity will appear here as it occurs.</p>
        </div>
    );
}

// ── Entity Cell ───────────────────────────────────────────────────────

function EntityCell({ log, tab }) {
    if (!log.entity_type)
        return <span className="text-gray-300 text-[11px]">—</span>;

    const humanLabel =
        log.entity_full_name ||
        (tab === 'positions' && log.entity_position_title) ||
        null;

    const EntityMeta = () => (
        <span className="text-[10px] text-gray-400 leading-snug">
            {log.entity_type}
            {log.entity_id && <span className="font-mono ml-1">#{log.entity_id}</span>}
        </span>
    );

    return (
        <div className="flex flex-col gap-0.5">
            {humanLabel ? (
                <>
                    <span className="text-xs font-semibold text-gray-700 leading-snug">{humanLabel}</span>
                    <EntityMeta />
                </>
            ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-gray-600">{log.entity_type}</span>
                    {log.entity_id && (
                        <span className="font-mono text-[10px] text-gray-400">#{log.entity_id}</span>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Log Table ─────────────────────────────────────────────────────────

function LogTable({ logs, showChanges = false, tab }) {
    if (!logs.length) return <EmptyState />;

    const entityHeader =
        tab === 'pds'       ? 'Affected User'     :
        tab === 'positions' ? 'Affected Position'  :
        'Entity';

    return (
        <>
            {/* Desktop table */}
            <div className="hidden md:block rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-40">
                                Action
                            </th>
                            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Actor
                            </th>
                            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                {entityHeader}
                            </th>
                            {showChanges && (
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-40">
                                    Changes
                                </th>
                            )}
                            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-44">
                                Date & Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <tr
                                key={log.id}
                                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors duration-150"
                                style={{ animation: `logRowIn 250ms ease-out ${i * 25}ms both` }}
                            >
                                <td className="px-4 py-3 align-top"><ActionBadge action={log.action} /></td>
                                <td className="px-4 py-3 align-top">
                                    {log.actor ? (
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-semibold text-gray-700">
                                                {formatActorName(log.actor)}
                                            </span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full w-fit
                                                    ${log.actor_type === 'admin'
                                                        ? 'bg-[#1a5c3a]/10 text-[#1a5c3a]'
                                                        : 'bg-indigo-50 text-indigo-600'}`}>
                                                    {log.actor_type}
                                                </span>
                                                <span className="text-[9px] text-gray-400 font-mono">
                                                    @{log.actor.username}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-300 text-[11px]">—</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <EntityCell log={log} tab={tab} />
                                </td>
                                {showChanges && (
                                    <td className="px-4 py-3 align-top">
                                        <ChangesViewer changes={log.changes} />
                                    </td>
                                )}
                                <td className="px-4 py-3 align-top">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-gray-500">{formatDate(log.created_at)}</span>
                                        <span className="text-[10px] text-gray-300">{timeAgo(log.created_at)}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                {logs.map((log, i) => (
                    <div
                        key={log.id}
                        className="px-4 py-4 bg-white hover:bg-gray-50/60 transition-colors duration-150"
                        style={{ animation: `logRowIn 250ms ease-out ${i * 25}ms both` }}
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <ActionBadge action={log.action} />
                            <span className="text-[10px] text-gray-300 flex-shrink-0">
                                {timeAgo(log.created_at)}
                            </span>
                        </div>
                        {log.actor && (
                            <div className="mb-2">
                                <p className="text-xs text-gray-600 font-semibold">
                                    {formatActorName(log.actor)}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    @{log.actor.username} · {log.actor_type}
                                </p>
                            </div>
                        )}
                        <div className="mb-1">
                            <EntityCell log={log} tab={tab} />
                        </div>
                        {showChanges && log.changes && Object.keys(log.changes).length > 0 && (
                            <div className="mt-2">
                                <ChangesViewer changes={log.changes} />
                            </div>
                        )}
                        <p className="text-[10px] text-gray-400 mt-2">{formatDate(log.created_at)}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

// ── Main ActivityLog Component ────────────────────────────────────────

export default function ActivityLog() {
    const [activeTab, setActiveTab]     = useState('admin_auth');
    const [logs, setLogs]               = useState([]);
    const [loading, setLoading]         = useState(true);
    const [refreshing, setRefreshing]   = useState(false);
    const [error, setError]             = useState(null);
    const [contentKey, setContentKey]   = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages]   = useState(1);

    const currentTab = TABS.find(t => t.key === activeTab) ?? TABS[0];

    const fetchLogs = useCallback(async (silent = false, page = 1) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                actions:  currentTab.actions.join(','),
                per_page: ITEMS_PER_PAGE,
                page,
            });

            const res = await fetch(`/admin/activity-logs?${params}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept':           'application/json',
                    'X-CSRF-TOKEN':     getCsrfToken(),
                },
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);

            const data     = await res.json();
            const logsData = data.data      !== undefined ? data.data      : (data.logs ?? []);
            const lastPage = data.last_page !== undefined ? data.last_page : 1;

            setLogs(logsData);
            setTotalPages(lastPage);
            setContentKey(k => k + 1);
        } catch {
            setError('Failed to load activity logs.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab, currentTab]);

    // Fetch on mount and whenever activeTab or currentPage changes
    useEffect(() => {
        fetchLogs(false, currentPage);
    }, [activeTab, currentPage]);

    const handleTabChange = (key) => {
        if (key === activeTab) return;
        setActiveTab(key);
        setLogs([]);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages)
            setCurrentPage(newPage);
    };

    return (
        <>
            <style>{`
                @keyframes logRowIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes dropdownIn {
                    from { opacity: 0; transform: translateY(-4px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes contentFadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="space-y-5 mt-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* ── Card Header ── */}
                    <div className="px-5 py-4 md:px-6 border-b border-gray-100">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#1a5c3a]/10 flex items-center
                                    justify-center flex-shrink-0">
                                    <span className="text-[#1a5c3a]"><IconActivity /></span>
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-gray-700">Activity Logs</h2>
                                    <p className="text-[10px] text-gray-400">System-wide audit trail</p>
                                </div>
                            </div>

                            <button
                                onClick={() => fetchLogs(true, currentPage)}
                                disabled={loading || refreshing}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                                    text-[#1a5c3a] border border-[#1a5c3a]/30 rounded-lg
                                    hover:bg-[#1a5c3a] hover:text-white hover:border-[#1a5c3a]
                                    disabled:opacity-40 disabled:cursor-not-allowed
                                    transition-all duration-200 flex-shrink-0"
                            >
                                <IconRefresh spinning={refreshing} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                        </div>

                        {/* ── Dropdown row ── */}
                        <div className="mt-4">
                            <TableDropdown selected={activeTab} onChange={handleTabChange} />
                        </div>
                    </div>

                    {/* ── Active table label ── */}
                    <div className="px-5 md:px-6 pt-4 pb-2 flex items-center gap-2">
                        <span className="text-[#1a5c3a]">{currentTab.icon}</span>
                        <h3 className="text-xs font-bold text-gray-600">{currentTab.label}</h3>
                        <span className="text-[10px] text-gray-300">·</span>
                        <span className="text-[10px] text-gray-400">{currentTab.desc}</span>
                    </div>

                    {/* ── Table content ── */}
                    <div className="px-5 md:px-6 pb-5 md:pb-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <svg className="w-6 h-6 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                                <p className="text-xs text-gray-400">Loading logs…</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-400" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667
                                               1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464
                                               0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">{error}</p>
                                <button
                                    onClick={() => fetchLogs(false, currentPage)}
                                    className="text-xs text-[#1a5c3a] font-semibold hover:underline"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : (
                            <div
                                key={contentKey}
                                style={{ animation: 'contentFadeIn 200ms ease-out both' }}
                            >
                                <LogTable
                                    logs={logs}
                                    showChanges={activeTab === 'positions'}
                                    tab={activeTab}
                                />

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1.5 text-xs font-semibold text-gray-600
                                                bg-white border border-gray-200 rounded-lg
                                                hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                                                transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-xs text-gray-500 font-medium">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1.5 text-xs font-semibold text-gray-600
                                                bg-white border border-gray-200 rounded-lg
                                                hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                                                transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}