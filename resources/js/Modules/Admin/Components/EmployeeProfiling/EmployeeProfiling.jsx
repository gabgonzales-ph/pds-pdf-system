// resources/js/Modules/Admin/Components/Profiling.jsx

import { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import ProfilingSearchAndFilter from './ProfilingSearchAndFilter';
import PDFViewerModal from '../Positions/PDFViewerModal';
import { StatusBadge } from './PositionBadge';
import { PositionsCell } from './PositionsCell';
import { PositionAssignModal, RemoveConfirmModal } from './PositionAssignModal';

// ── API Utilities ──────────────────────────────────────────────────────────

function getCsrfToken() {
    const raw = document.cookie
        .split('; ')
        .find(r => r.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
    return raw ? decodeURIComponent(raw) : '';
}

async function apiFetch(url, method = 'GET') {
    const res = await fetch(url, {
        method,
        headers: { Accept: 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, ...data };
    return data;
}

// ── Icons ──────────────────────────────────────────────────────────────────

function IconClose() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function IconView() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
                   -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

function IconPlus() {
    return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
    );
}

function IconEdit() {
    return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                   m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );
}

function IconEmpty() {
    return (
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                   M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                   m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function IconChevronRight() {
    return (
        <svg className="w-4 h-4 text-gray-300 group-hover:text-[#1a5c3a] transition-colors duration-200"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );
}

function IconSpinner({ className = 'w-4 h-4' }) {
    return (
        <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5"
                strokeLinecap="round" strokeDasharray="50" strokeDashoffset="15" />
        </svg>
    );
}

function IconUser() {
    return (
        <svg className="w-5 h-5 text-[#1a5c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

// ── Pagination ─────────────────────────────────────────────────────────────

function Pagination({ prevUrl, nextUrl, total, from, to, pageLinks, lastPage }) {
    if (lastPage <= 1) return null;

    function goTo(url) {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: false, only: ['employees', 'filters'] });
    }

    const pages = pageLinks.slice(1, -1);

    return (
        <div className="flex items-center justify-between px-1 mt-4">
            <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{from}</span>–
                <span className="font-medium text-gray-600">{to}</span> of{' '}
                <span className="font-medium text-gray-600">{total}</span> employees
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => goTo(prevUrl)}
                    disabled={!prevUrl}
                    className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200
                        rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all duration-150"
                >
                    Previous
                </button>
                <div className="hidden sm:flex items-center gap-1">
                    {pages.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(link.url)}
                            disabled={!link.url}
                            className={`w-8 h-8 text-xs font-medium rounded-lg transition-all duration-150
                                ${link.active
                                    ? 'bg-[#1a5c3a] text-white border border-[#1a5c3a]'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}
                                disabled:opacity-40`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
                <button
                    onClick={() => goTo(nextUrl)}
                    disabled={!nextUrl}
                    className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200
                        rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all duration-150"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

// ── Profile Info Row ───────────────────────────────────────────────────────

function InfoRow({ label, value, fullWidth = false }) {
    return (
        <div className={`flex flex-col gap-0.5 ${fullWidth ? 'col-span-2' : ''}`}>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-medium text-gray-800 leading-snug">
                {value || <span className="text-gray-300 italic font-normal">Not provided</span>}
            </span>
        </div>
    );
}

// ── Profile Drawer Skeleton ────────────────────────────────────────────────

function ProfileSkeleton() {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            {/* Avatar + name skeleton */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-lg w-1/3" />
                </div>
            </div>
            {/* Divider */}
            <div className="h-px bg-gray-100" />
            {/* Grid skeleton */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className={`space-y-1.5 ${i >= 6 ? 'col-span-2' : ''}`}>
                        <div className="h-2.5 bg-gray-100 rounded w-1/3" style={{ animationDelay: `${i * 50}ms` }} />
                        <div className="h-3.5 bg-gray-100 rounded w-2/3" style={{ animationDelay: `${i * 50 + 20}ms` }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Employee Profile Drawer ────────────────────────────────────────────────

function EmployeeProfileDrawer({
    emp,
    onClose,
    onAssignPosition,
    onViewPDS,
    onRemove,
    positions,
    posModalOpenId,
}) {
    const [visible,   setVisible]   = useState(false);
    const [profile,   setProfile]   = useState(null);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(false);
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== 'undefined' && window.innerWidth >= 768
    );

    // Track desktop vs mobile for height
    useEffect(() => {
        function onResize() { setIsDesktop(window.innerWidth >= 768); }
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Entrance animation
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    // Fetch profile on mount
    useEffect(() => {
        setLoading(true);
        setError(false);
        apiFetch(route('admin.users.profile', { user: emp.id }))
            .then(data => { setProfile(data); setLoading(false); })
            .catch(() => { setError(true); setLoading(false); });
    }, [emp.id]);

    // Lock body scroll
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    // Escape key
    useEffect(() => {
        function handler(e) { if (e.key === 'Escape') handleClose(); }
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    function handleClose() {
        setVisible(false);
        setTimeout(onClose, 300);
    }

    const hasPositions = positions.length > 0;
    const canAssign    = emp.is_complete;

    return (
        <>
            {/* ── Backdrop ── */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-300
                    ${visible ? 'bg-black/40 backdrop-blur-[2px]' : 'bg-black/0 backdrop-blur-none'}`}
                onClick={handleClose}
            />

            {/* ── Drawer panel ── */}
            {/* Mobile: bottom sheet | Desktop: right slide-in */}
            <div
                className={`
                    fixed z-50 bg-white shadow-2xl flex flex-col
                    transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]

                    /* Mobile: full-width bottom sheet, capped height */
                    bottom-0 left-0 right-0 rounded-t-2xl
                    ${visible ? 'translate-y-0' : 'translate-y-full'}

                    /* Desktop: full-height right drawer */
                    md:inset-y-0 md:left-auto md:right-0 md:rounded-none md:rounded-l-2xl
                    md:w-[420px] lg:w-[460px]
                    ${visible ? 'md:translate-x-0 md:translate-y-0' : 'md:translate-x-full md:translate-y-0'}
                `}
                style={{
                    maxHeight: isDesktop ? '100dvh' : '92dvh',
                    height:    isDesktop ? '100dvh' : 'auto',
                }}
            >
                {/* ── Mobile drag handle ── */}
                <div className="md:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
                    <div className="w-10 h-1 bg-gray-200 rounded-full" />
                </div>

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#1a5c3a]/10 flex items-center justify-center flex-shrink-0">
                            <IconUser />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 leading-tight truncate">
                                Employee Overview
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5 font-mono">
                                {emp.employee_id}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                            text-gray-500 hover:bg-gray-200 active:scale-90 transition-all duration-150"
                        aria-label="Close"
                    >
                        <IconClose />
                    </button>
                </div>

                {/* ── Body (scrollable) ── */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {loading && <ProfileSkeleton />}

                    {!loading && error && (
                        <div className="p-8 flex flex-col items-center gap-3 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Failed to load profile</p>
                            <p className="text-xs text-gray-400">Please try closing and reopening this panel.</p>
                        </div>
                    )}

                    {!loading && !error && profile && (
                        <div className="p-5 space-y-5">

                            {/* ── Profile header card ── */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br
                                from-[#1a5c3a]/5 to-[#1a5c3a]/[0.02] border border-[#1a5c3a]/10">
                                <div className="w-14 h-14 rounded-2xl bg-[#1a5c3a]/10 flex items-center
                                    justify-center flex-shrink-0 shadow-sm">
                                    <svg className="w-7 h-7 text-[#1a5c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    {profile.found ? (
                                        <>
                                            <p className="font-bold text-gray-900 text-base leading-tight truncate">
                                                {profile.full_name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">{emp.department}</p>
                                            <div className="mt-1.5">
                                                <StatusBadge complete={emp.is_complete} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-bold text-gray-900 text-base leading-tight truncate">
                                                {emp.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">{emp.department}</p>
                                            <div className="mt-1.5">
                                                <StatusBadge complete={emp.is_complete} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {!profile.found ? (
                                /* ── PDS not yet submitted ── */
                                <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-4
                                    flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center
                                        justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800">PDS Not Submitted</p>
                                        <p className="text-xs text-amber-700/80 mt-0.5 leading-relaxed">
                                            This employee has not yet submitted their Personal Data Sheet.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* ── Personal Information Grid ── */
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                                        Personal Information
                                    </p>
                                    <div className="grid grid-cols-2 gap-x-5 gap-y-4
                                        p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
                                        <InfoRow label="Full Name"      value={profile.full_name}     fullWidth />
                                        <InfoRow label="Date of Birth"  value={profile.date_of_birth} />
                                        <InfoRow label="Citizenship"    value={profile.citizenship}   />
                                        <InfoRow label="Sex"            value={profile.sex}           />
                                        <InfoRow label="Civil Status"   value={profile.civil_status}  />
                                        <InfoRow
                                            label="Height"
                                            value={profile.height_cm ? `${profile.height_cm} cm` : null}
                                        />
                                        <InfoRow
                                            label="Weight"
                                            value={profile.weight_kg ? `${profile.weight_kg} kg` : null}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── Contact Information ── */}
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                                    Contact Information
                                </p>
                                <div className="grid grid-cols-1 gap-y-4
                                    p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
                                    <InfoRow label="Mobile No." value={profile.found ? profile.mobile_no  : null} />
                                    <InfoRow label="Email"      value={profile.found ? profile.email      : null} />
                                    <InfoRow label="Residential Address"
                                        value={profile.found ? profile.residential_address : null}
                                        fullWidth
                                    />
                                </div>
                            </div>

                            {/* ── Positions ── */}
                            {positions.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                                        Assigned Positions
                                    </p>
                                    <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
                                        <PositionsCell positions={positions} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Footer — Action Buttons ── */}
                <div className="flex-shrink-0 border-t border-gray-100 p-4 bg-white">
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">

                        {/* Assign / Edit Position */}
                        <div className="flex-1 relative group/assignbtn">
                            <button
                                onClick={() => canAssign && onAssignPosition(emp)}
                                disabled={!canAssign}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5
                                    text-xs font-semibold rounded-xl border transition-all duration-150 active:scale-95
                                    ${canAssign
                                        ? 'bg-white text-[#1a5c3a] border-[#1a5c3a] hover:bg-[#1a5c3a]/5'
                                        : 'bg-white text-gray-300 border-gray-200 cursor-not-allowed'
                                    }`}
                            >
                                {hasPositions ? <><IconEdit /> Edit Position</> : <><IconPlus /> Assign Position</>}
                            </button>

                            {/* Tooltip — only shown when disabled */}
                            {!canAssign && (
                                <div className="
                                    pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5
                                    px-3 py-2 rounded-lg bg-gray-900 text-white text-[11px] font-medium
                                    whitespace-nowrap shadow-lg z-10
                                    opacity-0 -translate-y-1
                                    group-hover/assignbtn:opacity-100 group-hover/assignbtn:translate-y-0
                                    transition-all duration-200 ease-out
                                ">
                                    User's Personal Data Sheet is incomplete
                                    {/* Arrow */}
                                    <span className="absolute top-full left-1/2 -translate-x-1/2
                                        border-4 border-transparent border-t-gray-900" />
                                </div>
                            )}
                        </div>

                        {/* View PDS */}
                        <button
                            onClick={() => onViewPDS(emp)}
                            className="flex-1 flex items-center justify-center gap-2 px-1 py-2.5
                                text-xs font-semibold bg-[#1a5c3a] text-white rounded-xl
                                hover:bg-[#14472e] active:scale-95 transition-all duration-150"
                        >
                            <IconView /> View PDS
                        </button>

                        {/* Remove */}
                        <button
                            onClick={() => onRemove(emp)}
                            className="flex-1 flex items-center justify-center gap-2 px-1 py-2.5
                                text-xs font-semibold text-red-500 border border-red-200 rounded-xl
                                bg-white hover:bg-red-50 active:scale-95 transition-all duration-150"
                        >
                            <IconTrash /> Remove
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function Profiling({ employees = {}, departments = [], filters = {} }) {

    // ── Pagination helpers ────────────────────────────────────────────
    const rows      = employees.data          ?? [];
    const prevUrl   = employees.prev_page_url ?? null;
    const nextUrl   = employees.next_page_url ?? null;
    const total     = employees.total         ?? 0;
    const from      = employees.from          ?? 0;
    const to        = employees.to            ?? 0;
    const pageLinks = employees.links         ?? [];
    const lastPage  = employees.last_page     ?? 1;

    // ── Derived State (Single Source of Truth) ────────────────────────
    const [drawerEmpId, setDrawerEmpId]     = useState(null);
    const [posModalEmpId, setPosModalEmpId] = useState(null);

    // Instead of holding stale object copies, we derive the full object from the fresh props
    const drawerEmp   = drawerEmpId   ? rows.find(e => e.id === drawerEmpId)   : null;
    const posModalEmp = posModalEmpId ? rows.find(e => e.id === posModalEmpId) : null;

    // ── Employee removal state ────────────────────────────────────────
    const [viewingEmployee,  setViewingEmployee]  = useState(null);
    const [removingEmployee, setRemovingEmployee] = useState(null);
    const [isRemoving,       setIsRemoving]       = useState(false);

    // ── Position modal state ──────────────────────────────────────────
    const [posSearch,     setPosSearch]     = useState('');
    const [availCache,    setAvailCache]    = useState({});
    const [assigningId,   setAssigningId]   = useState(null);
    const [isRemovingPos, setIsRemovingPos] = useState(false);

    function getPositions(emp) {
        return emp?.positions ?? [];
    }

    // ── Open drawer ───────────────────────────────────────────────────
    function openDrawer(emp) {
        setDrawerEmpId(emp.id);
    }

    function closeDrawer() {
        setDrawerEmpId(null);
    }

    // ── Employee removal ──────────────────────────────────────────────

    function handleRemoveConfirm() {
        if (!removingEmployee) return;
        setIsRemoving(true);
        router.delete(route('admin.users.destroy', { user: removingEmployee.id }), {
            preserveState: true,
            only: ['employees', 'stats', 'filters', 'archivedUsers'],
            onSuccess: () => {
                setRemovingEmployee(null);
                setIsRemoving(false);
                // Close drawer if removing the currently viewed employee
                if (drawerEmp?.id === removingEmployee.id) closeDrawer();
            },
            onError: () => setIsRemoving(false),
        });
    }

    // ── Position modal ────────────────────────────────────────────────

    async function openPositionModal(emp) {
        setPosSearch('');
        setPosModalEmpId(emp.id);
        setAvailCache(prev => ({ ...prev, [emp.id]: { ...(prev[emp.id] ?? {}), loading: true } }));
        try {
            const data = await apiFetch(route('admin.users.positions.available', { user: emp.id }));
            setAvailCache(prev => ({ ...prev, [emp.id]: { loading: false, ...data } }));
        } catch {
            setAvailCache(prev => ({
                ...prev,
                [emp.id]: {
                    ...(prev[emp.id] ?? {}),
                    loading: false, assignable: false, error: true,
                    message: 'Failed to load available positions. Please try again.',
                },
            }));
        }
    }

    function closePositionModal() {
        const id = posModalEmpId;
        setPosModalEmpId(null);
        setPosSearch('');
        setIsRemovingPos(false);
        if (id != null) {
            setAvailCache(s => { const n = { ...s }; delete n[id]; return n; });
        }
    }

    async function handleAssignPosition(position) {
        if (!posModalEmp || assigningId) return;
        const empId = posModalEmp.id;
        setAssigningId(position.id);
        try {
            await apiFetch(
                route('admin.users.positions.assign', { user: empId, position: position.id }), 'POST'
            );
            router.reload({
                only: ['employees', 'stats'],
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Refresh available cache so the list shrinks to exclude what was just assigned
                    apiFetch(route('admin.users.positions.available', { user: empId }))
                        .then(data => {
                            setAvailCache(prev => ({ ...prev, [empId]: { loading: false, ...data } }));
                        });
                },
                onFinish: () => {
                    setAssigningId(null);
                }
            });
        } catch (err) {
            console.error('[Position] Assign failed:', err?.message ?? err);
            setAssigningId(null);
        }
    }

    async function handleRemovePosition(position) {
        if (!posModalEmp || isRemovingPos) return;
        const empId = posModalEmp.id;
        setIsRemovingPos(true);
        try {
            await apiFetch(
                route('admin.users.positions.remove', { user: empId, position: position.id }), 'DELETE'
            );
            router.reload({
                only: ['employees', 'stats'],
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Update cache to show the removed position again as "Available"
                    apiFetch(route('admin.users.positions.available', { user: empId }))
                        .then(data => {
                            setAvailCache(prev => ({ ...prev, [empId]: { loading: false, ...data } }));
                        });
                },
                onFinish: () => {
                    setIsRemovingPos(false);
                }
            });
        } catch (err) {
            console.error('[Position] Remove failed:', err?.message ?? err);
            setIsRemovingPos(false);
        }
    }

    // ── Shared row / card click handler ───────────────────────────────
    // Stops propagation so inner buttons (if any) don't also open drawer.
    function handleRowClick(emp, e) {
        // If clicking a button inside the row, let the button handle it
        if (e.target.closest('button')) return;
        openDrawer(emp);
    }

    // ── Render ────────────────────────────────────────────────────────

    return (
        <div>
            <ProfilingSearchAndFilter departments={departments} filters={filters} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* ── Desktop table ── */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                {[
                                    ['ID',             'left'],
                                    ['Name',           'left'],
                                    ['Department',     'left'],
                                    ['Status',         'left'],
                                    ['Date Submitted', 'left'],
                                    ['Positions',      'left'],
                                ].map(([label, align]) => (
                                    <th key={label} className={`text-${align} text-[11px] font-bold text-gray-400
                                        uppercase tracking-wider px-4 py-2`}>
                                        {label}
                                    </th>
                                ))}
                                {/* Empty header for chevron column */}
                                <th className="px-3 py-2 w-8" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <IconEmpty />
                                            <p className="text-sm text-gray-400 font-medium">No employees found</p>
                                            <p className="text-xs text-gray-300">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : rows.map((emp, i) => {
                                const positions  = getPositions(emp);
                                const isSelected = drawerEmp?.id === emp.id;
                                return (
                                    <tr
                                        key={emp.id}
                                        onClick={(e) => handleRowClick(emp, e)}
                                        className={`group cursor-pointer transition-all duration-150
                                            animate-in fade-in slide-in-from-bottom-1
                                            ${isSelected
                                                ? 'bg-[#1a5c3a]/[0.06] border-l-[3px] border-l-[#1a5c3a]'
                                                : 'hover:bg-[#1a5c3a]/[0.03] hover:border-l-[3px] hover:border-l-[#1a5c3a]/40 border-l-[3px] border-l-transparent'
                                            }`}
                                        style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'forwards' }}
                                    >
                                        <td className="px-4 py-2">
                                            <span className="font-mono text-xs font-semibold text-[#1a7a52]">
                                                {emp.employee_id}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className={`font-medium transition-colors duration-150
                                                ${isSelected ? 'text-[#1a5c3a]' : 'text-gray-800'}`}>
                                                {emp.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="text-gray-500">{emp.department}</span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <StatusBadge complete={emp.is_complete} />
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="text-gray-500 text-xs">{emp.date_submitted}</span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <PositionsCell positions={positions} />
                                        </td>
                                        <td className="px-3 py-2">
                                            <IconChevronRight />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ── Mobile cards ── */}
                <div className="md:hidden divide-y divide-gray-100">
                    {rows.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3">
                            <IconEmpty />
                            <p className="text-sm text-gray-400 font-medium">No employees found</p>
                        </div>
                    ) : rows.map((emp, i) => {
                        const positions  = getPositions(emp);
                        const isSelected = drawerEmp?.id === emp.id;
                        return (
                            <div
                                key={emp.id}
                                onClick={(e) => handleRowClick(emp, e)}
                                className={`px-4 py-2.5 cursor-pointer transition-all duration-150
                                    animate-in fade-in slide-in-from-bottom-1
                                    ${isSelected
                                        ? 'bg-[#1a5c3a]/[0.06] border-l-[3px] border-l-[#1a5c3a]'
                                        : 'hover:bg-[#1a5c3a]/[0.03] active:bg-[#1a5c3a]/[0.06] border-l-[3px] border-l-transparent hover:border-l-[#1a5c3a]/40'
                                    }`}
                                style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'forwards' }}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <div className="min-w-0 flex-1">
                                        <p className={`font-medium text-sm truncate transition-colors duration-150
                                            ${isSelected ? 'text-[#1a5c3a]' : 'text-gray-800'}`}>
                                            {emp.name}
                                        </p>
                                        <p className="font-mono text-xs text-[#1a7a52] font-semibold mt-0.5">
                                            {emp.employee_id}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                        <StatusBadge complete={emp.is_complete} />
                                        <IconChevronRight />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">{emp.department}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{emp.date_submitted}</p>

                                {positions.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-50">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            Positions
                                        </p>
                                        <PositionsCell positions={positions} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ── Pagination ── */}
                {rows.length > 0 && (
                    <div className="px-5 py-4 border-t border-gray-100">
                        <Pagination
                            prevUrl={prevUrl} nextUrl={nextUrl}
                            total={total} from={from} to={to}
                            pageLinks={pageLinks} lastPage={lastPage}
                        />
                    </div>
                )}
            </div>

            {/* ── Employee Profile Drawer ── */}
            {drawerEmp && (
                <EmployeeProfileDrawer
                    emp={drawerEmp}
                    positions={getPositions(drawerEmp)}
                    onClose={closeDrawer}
                    onAssignPosition={(emp) => { openPositionModal(emp); }}
                    onViewPDS={(emp) => { setViewingEmployee(emp); }}
                    onRemove={(emp) => { setRemovingEmployee(emp); }}
                    posModalOpenId={posModalEmp?.id}
                />
            )}

            {/* ── Dual-panel Position Modal ── */}
            {posModalEmp && (
                <PositionAssignModal
                    emp={posModalEmp}
                    positions={getPositions(posModalEmp)}
                    cacheEntry={availCache[posModalEmp.id]}
                    search={posSearch}
                    onSearchChange={setPosSearch}
                    onAssign={handleAssignPosition}
                    onRemove={handleRemovePosition}
                    onClose={closePositionModal}
                    assigningId={assigningId}
                    isRemoving={isRemovingPos}
                />
            )}

            {/* ── PDF Viewer Modal ── */}
            {viewingEmployee && (
                <PDFViewerModal
                    userId={viewingEmployee.id}
                    userName={viewingEmployee.name}
                    onClose={() => setViewingEmployee(null)}
                />
            )}

            {/* ── Remove Account Modal ── */}
            {removingEmployee && (
                <RemoveConfirmModal
                    employee={removingEmployee}
                    onConfirm={handleRemoveConfirm}
                    onCancel={() => setRemovingEmployee(null)}
                    isRemoving={isRemoving}
                />
            )}
        </div>
    );
}