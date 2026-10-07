// resources/js/Modules/Admin/Components/ProfilingSearchAndFilter.jsx

import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';

function IconSearch() {
    return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

function IconFilter() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
    );
}

export default function ProfilingSearchAndFilter({ departments = [], filters = {} }) {
    const [search,     setSearch]     = useState(filters.search     ?? '');
    const [department, setDepartment] = useState(filters.department ?? '');
    const [status,     setStatus]     = useState(filters.status     ?? '');
    const [showFilters, setShowFilters] = useState(false);
    const debounceRef = useRef(null);

    const hasActiveFilters = department !== '' || status !== '';

    function applyFilters(overrides = {}) {
        const params = {
            search:     overrides.search     ?? search,
            department: overrides.department ?? department,
            status:     overrides.status     ?? status,
            page: 1,
        };
        // Strip empty values
        Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });

        router.get(route('admin.dashboard'), params, {
            preserveState: true,
            preserveScroll: true,
            only: ['employees', 'filters'],
        });
    }

    function handleSearchChange(val) {
        setSearch(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            applyFilters({ search: val });
        }, 350);
    }

    function handleDepartmentChange(val) {
        setDepartment(val);
        applyFilters({ department: val });
    }

    function handleStatusChange(val) {
        setStatus(val);
        applyFilters({ status: val });
    }

    function handleReset() {
        setSearch('');
        setDepartment('');
        setStatus('');
        router.get(route('admin.dashboard'), {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['employees', 'filters'],
        });
    }

    useEffect(() => () => clearTimeout(debounceRef.current), []);

    const selectClass = "text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/30 focus:border-[#1a5c3a] transition-all duration-150 w-full";

    return (
        <div className="mb-4">
            {/* ── Main toolbar row ── */}
            <div className="flex flex-col sm:flex-row gap-2">

                {/* Search input */}
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <IconSearch />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => handleSearchChange(e.target.value)}
                        placeholder="Search by name or employee ID..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white
                            text-gray-700 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/30 focus:border-[#1a5c3a]
                            transition-all duration-150"
                    />
                </div>

                {/* Filters toggle button */}
                <button
                    onClick={() => setShowFilters(p => !p)}
                    className={`
                        flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border
                        transition-all duration-150 whitespace-nowrap
                        ${showFilters || hasActiveFilters
                            ? 'bg-[#1a5c3a] text-white border-[#1a5c3a]'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}
                    `}
                >
                    <IconFilter />
                    Filters
                    {hasActiveFilters && (
                        <span className="w-4 h-4 rounded-full bg-white/30 text-[10px] font-bold
                            flex items-center justify-center leading-none">
                            {[department, status].filter(Boolean).length}
                        </span>
                    )}
                </button>

                {/* Reset — only shown when filters active */}
                {(hasActiveFilters || search) && (
                    <button
                        onClick={handleReset}
                        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700
                            border border-gray-200 rounded-lg bg-white hover:bg-gray-50
                            transition-all duration-150 whitespace-nowrap"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* ── Expanded filter row ── */}
            {showFilters && (
                <div className="mt-2 flex flex-col sm:flex-row gap-2
                    animate-in fade-in slide-in-from-top-1 duration-200">

                    {/* Department */}
                    <select
                        value={department}
                        onChange={e => handleDepartmentChange(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">All Departments</option>
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>

                    {/* Status */}
                    <select
                        value={status}
                        onChange={e => handleStatusChange(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">All Statuses</option>
                        <option value="complete">Complete</option>
                        <option value="incomplete">Incomplete</option>
                        <option value="with_position">With Position</option>
                        <option value="without_position">Without Position</option>
                    </select>
                </div>
            )}
        </div>
    );
}