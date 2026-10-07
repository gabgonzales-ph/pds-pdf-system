// resources/js/Modules/Admin/Components/AdminSideBar.jsx

import { useEffect } from 'react';

function IconHamburger() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function IconProfiling() {
    return (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function IconPositions() {
    return (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}



function IconArchives() {
    return (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
        </svg>
    );
}

function IconActivityLog() {
    return (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
    );
}

const navItems = [
    { key: 'profiling',     label: 'Employee Profiling', icon: <IconProfiling /> },
    { key: 'positions',     label: 'Positions',          icon: <IconPositions /> },
    
];

const bottomItems = [
    { key: 'archives',     label: 'Archives',       icon: <IconArchives />     },
    { key: 'activity-log', label: 'Activity Log',   icon: <IconActivityLog />  },
];

function NavButton({ item, isActive, collapsed, onClick }) {
    return (
        <button
            onClick={onClick}
            title={collapsed ? item.label : undefined}
            className={`
                w-full flex items-center rounded-lg
                transition-all duration-150
                ${collapsed ? 'md:justify-center md:py-2.5 md:px-0 gap-3 px-3 py-2.5' : 'gap-3 px-3 py-2.5'}
                ${isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'}
            `}
        >
            <span className={`flex-shrink-0 transition-colors duration-150
                ${isActive ? 'text-white' : 'text-white/70'}`}>
                {item.icon}
            </span>
            {/* Label: always show on mobile drawer, hide when desktop-collapsed */}
            <span className={`text-sm font-medium truncate ${collapsed ? 'md:hidden' : ''}`}>
                {item.label}
            </span>
        </button>
    );
}

export default function AdminSideBar({ activePage = 'profiling', onNavigate, collapsed, onCollapse }) {
    // Lock body scroll on mobile when drawer is open
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile && !collapsed) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
    }, [collapsed]);

    function handleNavClick(key) {
        onNavigate?.(key);
        // On mobile, close drawer after navigating
        if (window.innerWidth < 768) onCollapse(true);
    }

    return (
        <>
            {/* ── Mobile backdrop ───────────────────────────────────── */}
            <div
                className={`
                    fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]
                    transition-opacity duration-300 md:hidden
                    ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                `}
                onClick={() => onCollapse(true)}
                aria-hidden="true"
            />

            {/* ── Sidebar panel ─────────────────────────────────────── */}
            <aside
                className={`
                    fixed top-0 left-0 z-40 h-[100dvh] bg-[#1a5c3a] flex flex-col
                    transition-all duration-300 ease-in-out
                    w-[260px]
                    ${collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
                    ${collapsed ? 'md:w-[60px]' : 'md:w-56 lg:w-60'}
                `}
            >
                {/* ── Header: Title + Hamburger ── */}
                <div className={`flex items-center h-14 md:h-16 flex-shrink-0
                    ${collapsed ? 'md:justify-center md:px-0 px-4 justify-between' : 'justify-between px-4'}`}>

                    {/* Branding — always visible on mobile drawer */}
                    <div className={`flex flex-col truncate ${collapsed ? 'md:hidden' : ''}`}>
                        <span className="text-white font-bold text-sm lg:text-base tracking-tight truncate">
                            MISO Portal
                        </span>
                        <span className="text-white/50 text-[10px] italic truncate">
                            Administrative Dashboard
                        </span>
                    </div>

                    {/* Hamburger — desktop only, inside sidebar */}
                    <button
                        onClick={() => onCollapse(!collapsed)}
                        className="hidden md:flex text-white/80 hover:text-white hover:bg-white/10
                            rounded-lg p-1.5 transition-all duration-150 flex-shrink-0"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <IconHamburger />
                    </button>

                    {/* Close ✕ — mobile drawer only */}
                    <button
                        onClick={() => onCollapse(true)}
                        className="md:hidden text-white/80 hover:text-white hover:bg-white/10
                            rounded-lg p-1.5 transition-all duration-150 flex-shrink-0"
                        aria-label="Close sidebar"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Divider */}
                <div className="mx-3 border-t border-white/10 flex-shrink-0" />

                {/* ── Navigation ── */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                    {!collapsed && (
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest
                            px-3 mb-3 truncate md:block">
                            Main Menu
                        </p>
                    )}

                    {navItems.map(item => (
                        <NavButton
                            key={item.key}
                            item={item}
                            isActive={activePage === item.key}
                            collapsed={collapsed}
                            onClick={() => handleNavClick(item.key)}
                        />
                    ))}
                </nav>

                {/* ── Bottom Section: Archives + Activity Log ── */}
                <div className="px-2 pb-4 flex-shrink-0">
                    <div className={`mx-1 border-t border-white/10 ${collapsed ? 'mb-2' : 'mb-3'}`} />

                    {!collapsed && (
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest
                            px-3 mb-2 truncate">
                            System
                        </p>
                    )}

                    {bottomItems.map(item => (
                        <NavButton
                            key={item.key}
                            item={item}
                            isActive={activePage === item.key}
                            collapsed={collapsed}
                            onClick={() => handleNavClick(item.key)}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
}