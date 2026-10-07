// resources/js/Modules/Auth/Components/Registration/CustomSelect.jsx

import { useState, useRef, useEffect } from 'react';

/**
 * A fully custom dropdown that:
 * - Shows a searchable input when open
 * - Renders a fixed-height list (10 items) with a scrollbar
 * - Works consistently across all devices/browsers
 */
export default function CustomSelect({
    value,
    onChange,
    options = [],       // [{ value, label }]
    placeholder = 'Select...',
    disabled = false,
    error = false,
    loading = false,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);
    const searchRef = useRef(null);
    const listRef = useRef(null);

    const selectedLabel = options.find(o => o.value === value)?.label || '';

    const filtered = search.trim()
        ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
        : options;

    // Close on outside click
    useEffect(() => {
        function handleClick(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (open && searchRef.current) {
            searchRef.current.focus();
        }
    }, [open]);

    function handleSelect(val) {
        onChange(val);
        setOpen(false);
        setSearch('');
    }

    function handleToggle() {
        if (disabled) return;
        setOpen(prev => !prev);
        setSearch('');
    }

    const baseClass = `w-full px-4 py-2.5 border rounded-lg text-sm flex items-center justify-between
        transition-colors cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' : 'bg-white'}
        ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}
        ${open && !disabled ? 'ring-2 ring-[#1a5c3a]/40 border-[#1a5c3a]' : ''}`;

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger */}
            <div className={baseClass} onClick={handleToggle}>
                <span className={selectedLabel ? 'text-gray-800' : 'text-gray-400'}>
                    {loading ? 'Loading...' : (selectedLabel || placeholder)}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200
                        ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown panel */}
            {open && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {/* Search */}
                    <div className="p-2 border-b border-gray-100">
                        <input
                            ref={searchRef}
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md
                                focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/40 focus:border-[#1a5c3a]"
                        />
                    </div>

                    {/* Options — fixed to ~10 items height */}
                    <div
                        ref={listRef}
                        className="overflow-y-auto"
                        style={{ maxHeight: 'calc(10 * 2.375rem)' }}
                    >
                        {filtered.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                No results found
                            </div>
                        ) : (
                            filtered.map(option => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                                        ${option.value === value
                                            ? 'bg-[#1a5c3a] text-white'
                                            : 'text-gray-700 hover:bg-[#1a5c3a]/10'}`}
                                >
                                    {option.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
