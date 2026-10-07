// resources/js/Modules/Admin/Components/PositionsSearchAndFilter.jsx

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

function IconPlus() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4v16m8-8H4" />
        </svg>
    );
}

export default function PositionsSearchAndFilter({ filters = {} }) {
    const [search,      setSearch]      = useState(filters.search ?? '');
    const [status,      setStatus]      = useState(filters.status ?? '');
    const [showFilters, setShowFilters] = useState(false);
    const debounceRef = useRef(null);

    const hasActiveFilters = status !== '';

    function applyFilters(overrides = {}) {
        const params = {
            pos_search: overrides.search ?? search,
            pos_status: overrides.status ?? status,
            page: 1,
        };
        Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });

        router.get(route('admin.dashboard'), params, {
            preserveState: true,
            preserveScroll: true,
            only: ['positions', 'posFilters'],
        });
    }

    function handleSearchChange(val) {
        setSearch(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => applyFilters({ search: val }), 350);
    }

    function handleStatusChange(val) {
        setStatus(val);
        applyFilters({ status: val });
    }

    function handleReset() {
        setSearch('');
        setStatus('');
        router.get(route('admin.dashboard'), {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['positions', 'posFilters', 'stats'],
        });
    }

    useEffect(() => () => clearTimeout(debounceRef.current), []);

    const selectClass = "text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/30 focus:border-[#1a5c3a] transition-all duration-150 w-full";

    return (
        <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-2">

                {/* Search */}
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <IconSearch />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => handleSearchChange(e.target.value)}
                        placeholder="Search by position title..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white
                            text-gray-700 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/30 focus:border-[#1a5c3a]
                            transition-all duration-150"
                    />
                </div>

                {/* Filters toggle */}
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
                            1
                        </span>
                    )}
                </button>

                {/* Reset */}
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

                {/* Add Position */}
                <button
                    onClick={() => router.visit(route('admin.positions.create'))}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold
                        bg-[#1a5c3a] text-white rounded-lg
                        hover:bg-[#14472e] active:scale-95 transition-all duration-150 whitespace-nowrap"
                >
                    <IconPlus />
                    Add Position
                </button>
            </div>

            {/* Expanded filter row */}
            {showFilters && (
                <div className="mt-2 flex flex-col sm:flex-row gap-2">
                    <select
                        value={status}
                        onChange={e => handleStatusChange(e.target.value)}
                        className={selectClass}
                        style={{ maxWidth: '220px' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            )}
        </div>
    );
}
