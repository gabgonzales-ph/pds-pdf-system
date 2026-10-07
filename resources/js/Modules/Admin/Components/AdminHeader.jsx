// resources/js/Modules/Admin/Components/AdminHeader.jsx

import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

const SECTION_TITLES = {
    profiling: {
        title:    'Employee Profiling',
        subtitle: 'Manage submitted Personal Data Sheets',
    },
    positions: {
        title:    'Positions',
        subtitle: 'Manage Position Description Forms',
    },
    archives: {
        title:    'Archives',
        subtitle: 'View and restore recently deleted records',
    },
    'activity-log': {
        title:    'Activity Logs',
        subtitle: 'System-wide audit trail of all recorded actions',
    },
};

function IconHamburger() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function AdminProfileButton({ user }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleLogout() {
        router.post('/logout');
    }

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 rounded-xl
                    hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 group"
            >
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[#1a5c3a] font-bold text-xs md:text-sm leading-tight
                        truncate max-w-[120px] md:max-w-[180px]">
                        {user?.username || 'Username'}
                    </span>
                    <span className="text-gray-400 text-[10px] md:text-xs leading-tight
                        truncate max-w-[120px] md:max-w-[180px]">
                        {user?.email || 'email@address.com'}
                    </span>
                </div>

                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-300 border border-gray-400
                    flex items-center justify-center flex-shrink-0
                    group-hover:bg-gray-400 transition-all duration-150">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg
                    border border-gray-100 overflow-hidden z-50
                    animate-in fade-in slide-in-from-top-1 duration-150">

                    <div className="sm:hidden px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-[#1a5c3a] truncate">
                            {user?.username || 'Username'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {user?.email || 'email@address.com'}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600
                            hover:bg-red-50 transition-colors duration-150"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default function AdminHeader({ user, activePage, sidebarCollapsed, onOpenSidebar }) {
    const section = SECTION_TITLES[activePage] ?? SECTION_TITLES.profiling;

    return (
        <header
            className={`
                fixed top-0 right-0 z-30 bg-gray-100 border-b border-gray-200
                h-14 md:h-16 flex items-center px-4 md:px-6
                transition-all duration-300 ease-in-out
                left-0
                md:left-[60px]
                ${!sidebarCollapsed ? 'md:left-56 lg:left-60' : ''}
            `}
        >
            {/* Mobile hamburger — opens sidebar drawer */}
            <button
                onClick={onOpenSidebar}
                className="md:hidden flex items-center justify-center w-8 h-8 mr-3
                    text-gray-500 hover:text-gray-700 hover:bg-gray-200
                    rounded-lg transition-all duration-150 flex-shrink-0"
                aria-label="Open sidebar"
            >
                <IconHamburger />
            </button>

            {/* Left — Section title + subtitle */}
            <div className="flex flex-col justify-center min-w-0">
                <h1 className="text-gray-800 font-bold tracking-tight
                    text-sm sm:text-base md:text-lg leading-tight truncate
                    transition-all duration-300">
                    {section.title}
                </h1>
                <p className="hidden sm:block text-gray-400 text-[10px] md:text-xs
                    leading-tight truncate transition-all duration-300">
                    {section.subtitle}
                </p>
            </div>

            {/* Right — Profile Button */}
            <div className="ml-auto">
                <AdminProfileButton user={user} />
            </div>
        </header>
    );
}
