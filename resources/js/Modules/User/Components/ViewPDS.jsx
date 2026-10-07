// resources/js/Modules/User/Components/ViewPDS.jsx

import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

// ── PDF Viewer Modal ──────────────────────────────────────────────────

function PDSViewerModal({ userName, onClose }) {
    const [loaded,  setLoaded]  = useState(false);
    const [visible, setVisible] = useState(false);

    const viewUrl = route('user.pds.download');
    const label   = userName || 'Personal Data Sheet';

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        function handleKey(e) { if (e.key === 'Escape') handleClose(); }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    function handleClose() {
        setVisible(false);
        setTimeout(onClose, 250);
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center
                transition-all duration-250
                ${visible ? 'bg-black/60' : 'bg-black/0'}`}
            style={{ transitionTimingFunction: 'ease-out' }}
            onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div
                className={`relative w-full h-full flex flex-col
                    transition-all duration-250
                    ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{ transitionTimingFunction: visible ? 'ease-out' : 'ease-in' }}
            >
                {/* Top bar */}
                <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-[#1a5c3a]">
                    <span className="text-white/80 text-sm font-medium truncate">
                        {label} — Personal Data Sheet
                    </span>
                    <button
                        onClick={handleClose}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold
                            bg-white/10 text-white border border-white/20 rounded-lg
                            hover:bg-white/20 active:scale-95 transition-all duration-150
                            flex-shrink-0 ml-4"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Close</span>
                    </button>
                </div>

                {/* iframe + skeleton */}
                <div className="relative flex-1 min-h-0">
                    <iframe
                        src={viewUrl}
                        className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300
                            ${loaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setLoaded(true)}
                        title="Personal Data Sheet"
                    />
                    {!loaded && (
                        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center gap-4">
                            <div className="w-full max-w-2xl px-8 space-y-3">
                                <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto" />
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
                                    <div className="mt-4 space-y-2">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i}
                                                className="h-3 bg-gray-200 rounded animate-pulse"
                                                style={{ width: `${75 + (i % 3) * 10}%`, animationDelay: `${i * 60}ms` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-center text-sm text-gray-400 animate-pulse">
                                    Loading {label}…
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── ViewPDS Button ────────────────────────────────────────────────────
// compact=true  → icon-only square button (for tight spaces / mobile header)
// compact=false → full labeled button (default)

export default function ViewPDS({ userName, compact = false }) {
    const { progress } = usePage().props;
    const isComplete = progress?.overall === 100;

    const [showTooltip, setShowTooltip] = useState(false);
    const [showModal,   setShowModal]   = useState(false);

    function handleClick() {
        if (!isComplete) {
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
            return;
        }
        setShowModal(true);
    }

    return (
        <>
            <div className="relative inline-block">
                <button
                    onClick={handleClick}
                    title="Print / Download Personal Data Sheet"
                    className={`flex items-center justify-center gap-2 rounded-xl text-sm font-semibold
                        border transition-all duration-200 select-none
                        ${compact ? 'w-9 h-9 p-0' : 'px-5 py-2.5'}
                        ${isComplete
                            ? 'bg-[#1a5c3a] text-white border-[#1a5c3a] hover:bg-[#14472e] hover:border-[#14472e] shadow-sm hover:shadow-md active:scale-95'
                            : 'bg-white text-gray-300 border-gray-200 cursor-not-allowed'
                        }`}
                >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {!compact && (
                        <span>Print / Download PDS</span>
                    )}
                </button>

                {/* Tooltip */}
                {showTooltip && (
                    <div className="absolute bottom-full right-0 mb-2 z-50
                        animate-in fade-in slide-in-from-bottom-1 duration-200">
                        <div className="bg-gray-800 text-white text-xs font-medium
                            px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                            Please complete the Personal Data Sheet first.
                            <span className="absolute top-full right-4 w-0 h-0
                                border-l-4 border-r-4 border-t-4
                                border-l-transparent border-r-transparent border-t-gray-800" />
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <PDSViewerModal
                    userName={userName}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
