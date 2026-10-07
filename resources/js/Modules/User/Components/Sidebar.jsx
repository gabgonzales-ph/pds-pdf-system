import { useEffect, useState } from 'react';

function IconHamburger() {
    return (
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function IconPDS() {
    return (
        <svg className="w-4 h-4 md:w-[18px] md:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

const navItems = [
    { key: 'pds', label: 'Personal Data Sheet', icon: <IconPDS /> },
];

export default function Sidebar({ activePage = 'pds', onNavigate, collapsed, onCollapse, progress = 0 }) {
    const [animatedProgress, setAnimatedProgress] = useState(0);

    // Animate progress smoothly on render or progress change
    useEffect(() => {
        let start = 0;
        const steps = 40;
        const delta = (progress - start) / steps;
        let current = start;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += delta;
            setAnimatedProgress(Math.round(current));
            if (step >= steps) clearInterval(timer);
        }, 600 / steps);

        return () => clearInterval(timer);
    }, [progress]);

    const isComplete = animatedProgress === 100;

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
        if (window.innerWidth < 768) onCollapse(true);
    }

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={`
                    fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]
                    transition-opacity duration-300 md:hidden
                    ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                `}
                onClick={() => onCollapse(true)}
            />

            {/* Sidebar panel */}
            <aside
                className={`
                    fixed top-0 left-0 z-40 h-[100dvh] bg-[#1a5c3a] flex flex-col
                    transition-all duration-300 ease-in-out
                    w-[240px]
                    ${collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
                    ${collapsed ? 'md:w-[62px]' : 'md:w-56 lg:w-60'}
                `}
            >

                {/* Header */}
                <div className={`flex items-center h-14 md:h-16 flex-shrink-0
                    ${collapsed ? 'md:justify-center md:px-0 px-4 justify-between' : 'justify-between px-3 md:px-4'}`}>
                    <span className={`text-white font-bold text-sm md:text-sm lg:text-base tracking-tight truncate
                        ${collapsed ? 'md:hidden' : ''}`}>
                        MISO Portal
                    </span>

                    <button
                        onClick={() => onCollapse(!collapsed)}
                        className="hidden md:flex text-white/80 hover:text-white hover:bg-white/10
                            rounded-lg p-1 md:p-1.5 transition-all flex-shrink-0"
                    >
                        <IconHamburger />
                    </button>

                    <button
                        onClick={() => onCollapse(true)}
                        className="md:hidden text-white/80 hover:text-white hover:bg-white/10
                            rounded-lg p-1.5 transition-all flex-shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mx-3 border-t border-white/10 flex-shrink-0" />

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    {!collapsed && (
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">
                            Main Menu
                        </p>
                    )}

                    {navItems.map(item => {
                        const isActive = activePage === item.key;

                        return (
                            <div key={item.key}>
                                {/* Section button */}
                                <button
                                    onClick={() => handleNavClick(item.key)}
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
                                    <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-white/70'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-sm font-medium truncate
                                        ${collapsed ? 'md:hidden' : ''}`}>
                                        {item.label}
                                    </span>
                                </button>

                                
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}