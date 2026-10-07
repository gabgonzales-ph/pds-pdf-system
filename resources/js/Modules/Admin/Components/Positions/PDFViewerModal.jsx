// resources/js/Modules/Admin/Components/PDFViewerModal.jsx

import { useState, useEffect } from 'react';

function IconClose() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function IconEdit() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                   m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );
}

function IconTrash() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7
                   m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

export default function PDFViewerModal({
    userId,
    userName,
    positionId,
    positionTitle,
    onClose,
    onEdit,    // optional — only passed from Positions
    onRemove,  // optional — only passed from Positions
}) {
    const [loaded,  setLoaded]  = useState(false);
    const [visible, setVisible] = useState(false);

    const isPosition = !!positionId;

    const viewUrl = userId
        ? route('admin.pds.view',          { user:     userId,     _t: Date.now() })
        : route('admin.positions.pdf.view', { position: positionId, _t: Date.now() });

    const label = userId ? userName : (positionTitle || 'Position Description Form');

    // Entrance animation
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    // Escape key
    useEffect(() => {
        function handleKey(e) { if (e.key === 'Escape') handleClose(); }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    // Lock body scroll
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
                className={`relative w-full h-full flex flex-col transition-all duration-250
                    ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{ transitionTimingFunction: visible ? 'ease-out' : 'ease-in' }}
            >
                {/* ── Top bar ── */}
                <div className="flex-shrink-0 flex items-center justify-between gap-3
                    px-4 py-2 bg-[#1a5c3a]">

                    {/* Label */}
                    <span className="text-white/80 text-sm font-medium truncate">
                        {label} — {userId ? 'Personal Data Sheet' : 'Position Description Form'}
                    </span>

                    {/* Right-side Actions & Close Button */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Action buttons — only shown for position PDFs */}
                        {isPosition && (
                            <>
                                {onEdit && (
                                    <button
                                        onClick={() => { handleClose(); setTimeout(onEdit, 260); }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                                            bg-white/10 text-white border border-white/20 rounded-lg
                                            hover:bg-white/20 active:scale-95 transition-all duration-150"
                                    >
                                        <IconEdit />
                                        <span>Edit Position</span>
                                    </button>
                                )}
                                {onRemove && (
                                    <button
                                        onClick={() => { handleClose(); setTimeout(onRemove, 260); }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                                            bg-red-500/80 text-white border border-red-400/40 rounded-lg
                                            hover:bg-red-500 active:scale-95 transition-all duration-150"
                                    >
                                        <IconTrash />
                                        <span>Remove</span>
                                    </button>
                                )}
                            </>
                        )}

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold
                                bg-white/10 text-white border border-white/20 rounded-lg
                                hover:bg-white/20 active:scale-95 transition-all duration-150 flex-shrink-0"
                        >
                            <IconClose />
                            <span>Close</span>
                        </button>
                    </div>
                </div>

                {/* ── PDF iframe + skeleton ── */}
                <div className="relative flex-1 min-h-0">
                    <iframe
                        src={viewUrl}
                        className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300
                            ${loaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setLoaded(true)}
                        title={label}
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
                                    <div className="mt-4 space-y-2">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i}
                                                className="h-3 bg-gray-200 rounded animate-pulse"
                                                style={{ width: `${60 + (i % 4) * 8}%`, animationDelay: `${(i + 8) * 60}ms` }}
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