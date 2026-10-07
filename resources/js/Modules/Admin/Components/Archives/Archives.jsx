// resources/js/Modules/Admin/Components/ActivityLogs.jsx
//
// File structure:
//   Components/
//   ├── ActivityLogs.jsx                  ← this file
//   └── ActivityLogs/
//       ├── EmployeeProfiling.jsx
//       ├── Positions.jsx
//       └── PositionAssignmentHistory.jsx

import { useState, useEffect, useRef } from 'react';
import { router, usePage }             from '@inertiajs/react';

import EmployeeProfiling        from './Archives_EmployeeProfiling';
import Positions                from './Archives_Positions';
import PositionAssignmentHistory from './PositionAssignmentHistory';


// ── Table options ─────────────────────────────────────────────────────
 
const TABLE_OPTIONS = [
    {
        key:   'pds',
        label: 'Employee Profiling',
        desc:  'Archived employee records',
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
        key:   'positions',
        label: 'Positions',
        desc:  'Archived position records',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2
                       2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0
                       00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
        ),
    },
    {
        key:   'assignment',
        label: 'Position Assignment History',
        desc:  'All assignment & removal events',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0
                       00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2
                       2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
        ),
    },
];
 
// ── Dropdown ──────────────────────────────────────────────────────────
 
function TableDropdown({ selected, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
 
    const current = TABLE_OPTIONS.find(o => o.key === selected) ?? TABLE_OPTIONS[0];
 
    // Close on outside click
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
 
            {/* Dropdown panel */}
            <div className={`absolute left-0 top-full mt-1.5 w-64 bg-white border border-gray-100
                rounded-xl shadow-lg overflow-hidden z-20
                transition-all duration-200 origin-top
                ${open
                    ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'}`}
                style={{ transformOrigin: 'top' }}
            >
                {TABLE_OPTIONS.map(opt => (
                    <button
                        key={opt.key}
                        onClick={() => { onChange(opt.key); setOpen(false); }}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left
                            transition-colors duration-150
                            ${selected === opt.key
                                ? 'bg-[#1a5c3a]/5'
                                : 'hover:bg-gray-50'}`}
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
 
// ── Main Component ────────────────────────────────────────────────────
 
export default function ActivityLogs() {
    const { props } = usePage();
 
    // ── Derive initial table from URL (persisted via query string) ────
    const urlParams   = new URLSearchParams(window.location.search);
    const initialTable = (() => {
        const t = urlParams.get('arch_table');
        return ['pds', 'positions', 'assignment'].includes(t) ? t : (props.archTable ?? 'pds');
    })();
 
    const [activeTable, setActiveTable] = useState(initialTable);
    const [loaded, setLoaded]           = useState(false);
    const [isChangingPage, setIsChangingPage] = useState(false);
 
    // ── Read paginated props from Inertia ─────────────────────────────
    const archivedUsers          = props.archivedUsers          ?? null;
    const archivedPositions      = props.archivedPositions      ?? null;
    const positionAssignmentLogs = props.positionAssignmentLogs ?? null;
 
    // ── Initial lazy-load on mount ────────────────────────────────────
    useEffect(() => {
        router.reload({
            only: ['archivedUsers', 'archivedPositions', 'positionAssignmentLogs', 'archTable'],
            preserveScroll: true,
            preserveState: true,
            data: { arch_table: activeTable },
            onSuccess: () => setLoaded(true),
            onError:   () => setLoaded(true),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
 
    // ── Handle table switch via dropdown ──────────────────────────────
    function handleTableChange(key) {
        setActiveTable(key);
        // Persist to URL and reset all page params to 1
        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(
                    [...new URLSearchParams(window.location.search).entries()]
                        .filter(([k]) => !['arch_table', 'arch_users_page', 'arch_pos_page', 'assign_page'].includes(k))
                ),
                arch_table: key,
            },
            {
                preserveScroll: true,
                preserveState:  true,
                only: ['archivedUsers', 'archivedPositions', 'positionAssignmentLogs', 'archTable'],
                replace: true,
            }
        );
    }
 
    // ── Handle pagination ─────────────────────────────────────────────
    function handlePageChange(pageParam, pageNumber) {
        setIsChangingPage(true);
        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(new URLSearchParams(window.location.search).entries()),
                arch_table: activeTable,
                [pageParam]: pageNumber,
            },
            {
                preserveScroll: true,
                preserveState:  true,
                only: ['archivedUsers', 'archivedPositions', 'positionAssignmentLogs'],
                replace: true,
                onFinish: () => setIsChangingPage(false),
            }
        );
    }
 
    const isLoading = !loaded || isChangingPage;
 
    // ── Totals for the header summary ─────────────────────────────────
    const totals = {
        pds:        archivedUsers?.total          ?? 0,
        positions:  archivedPositions?.total      ?? 0,
        assignment: positionAssignmentLogs?.total ?? 0,
    };
 
    const activeOption = TABLE_OPTIONS.find(o => o.key === activeTable);
 
    return (
        <div className="space-y-4 mt-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
 
                {/* ── Card Header ── */}
                <div className="px-5 py-4 md:px-6 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#1a5c3a]/8 flex items-center
                                justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-[#1a5c3a]" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                                           a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-700">Archives</h2>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                    Archives, assignments &amp; removals
                                </p>
                            </div>
                        </div>
 
                        {/* Loading indicator */}
                        {!loaded && (
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1">
                                <svg className="w-3 h-3 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                                Loading…
                            </div>
                        )}
                    </div>
 
                    {/* ── Dropdown + summary row ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
                        <TableDropdown selected={activeTable} onChange={handleTableChange} />
 
                        {/* Record count pill */}
                        {loaded && totals[activeTable] > 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                    bg-gray-100 text-[10px] font-semibold text-gray-500
                                    transition-all duration-300">
                                    {totals[activeTable].toLocaleString()} record{totals[activeTable] !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
 
                {/* ── Active table label ── */}
                {loaded && activeOption && (
                    <div className="px-5 md:px-6 pt-4 pb-2 flex items-center gap-2">
                        <span className="text-[#1a5c3a]">{activeOption.icon}</span>
                        <h3 className="text-xs font-bold text-gray-600">{activeOption.label}</h3>
                        <span className="text-[10px] text-gray-300">·</span>
                        <span className="text-[10px] text-gray-400">{activeOption.desc}</span>
                    </div>
                )}
 
                {/* ── Table content ── */}
                <div className="px-5 md:px-6 pb-5 md:pb-6">
                    {/* Animate content transitions */}
                    <div
                        key={activeTable}
                        className="transition-opacity duration-200"
                        style={{ opacity: isChangingPage ? 0.5 : 1 }}
                    >
                        {activeTable === 'pds' && (
                            <EmployeeProfiling
                                pagination={archivedUsers}
                                isLoading={isLoading}
                                onPageChange={page => handlePageChange('arch_users_page', page)}
                            />
                        )}
                        {activeTable === 'positions' && (
                            <Positions
                                pagination={archivedPositions}
                                isLoading={isLoading}
                                onPageChange={page => handlePageChange('arch_pos_page', page)}
                            />
                        )}
                        {activeTable === 'assignment' && (
                            <PositionAssignmentHistory
                                pagination={positionAssignmentLogs}
                                isLoading={isLoading}
                                onPageChange={page => handlePageChange('assign_page', page)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}