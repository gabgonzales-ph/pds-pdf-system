// resources/js/Modules/User/Components/Header.jsx

import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

// ── Icons ─────────────────────────────────────────────────────────────

function IconHamburger() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function IconBell({ hasUnread }) {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );
}

function IconDocument() {
    return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

function IconCheckCircle() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────

function formatRelativeTime(isoString) {
    if (!isoString) return '';
    const diff = Date.now() - new Date(isoString).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)  return 'just now';
    if (mins  < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

// ── Sileo Toast ───────────────────────────────────────────────────────
// Renders a single Sileo-style notification toast at top-left.

function SileoToast({ notification, onDismiss }) {
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        // Slide in
        const inTimer = setTimeout(() => setVisible(true), 30);
        // Auto-dismiss after 4.5s
        const outTimer = setTimeout(() => handleDismiss(), 4500);
        return () => { clearTimeout(inTimer); clearTimeout(outTimer); };
    }, []);

    function handleDismiss() {
        setLeaving(true);
        setTimeout(() => onDismiss(notification.id), 350);
    }

    return (
        <div
            onClick={handleDismiss}
            style={{
                transform: visible && !leaving ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.96)',
                opacity:   visible && !leaving ? 1 : 0,
                transition: leaving
                    ? 'transform 0.35s cubic-bezier(0.4,0,1,1), opacity 0.35s ease'
                    : 'transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
            }}
            className="flex items-start gap-3 w-[320px] bg-white/95 backdrop-blur-md
                rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.14)] border border-white/60
                px-4 py-3.5 cursor-pointer select-none"
        >
            {/* App icon */}
            <div className="w-10 h-10 rounded-[10px] bg-[#1a5c3a] flex items-center
                justify-center flex-shrink-0 shadow-sm">
                <IconDocument />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide truncate">
                        MISO Portal
                    </span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {formatRelativeTime(notification.time)}
                    </span>
                </div>
                <p className="text-[13px] font-semibold text-gray-800 leading-snug">
                    {notification.title}
                </p>
                <p className="text-[11px] text-gray-500 leading-snug mt-0.5 line-clamp-2">
                    {notification.message}
                </p>
            </div>
        </div>
    );
}

// ── Toast Container ───────────────────────────────────────────────────
// Fixed top-left, stacks multiple toasts

function ToastContainer({ toastQueue, onDismiss }) {
    if (!toastQueue.length) return null;
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toastQueue.map(notif => (
                <div key={notif.id} className="pointer-events-auto">
                    <SileoToast notification={notif} onDismiss={onDismiss} />
                </div>
            ))}
        </div>
    );
}

// ── Notification Bell + Dropdown ──────────────────────────────────────

function NotificationBell({ notifications, onMarkAllRead, onClearAll }) {
    const [open, setOpen] = useState(false);
    const ref  = useRef(null);
    const unreadCount = (notifications || []).filter(n => !n.read).length;

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleOpen() {
        setOpen(prev => {
            // Mark all read when opening
            if (!prev && unreadCount > 0) onMarkAllRead();
            return !prev;
        });
    }

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            {/* Bell button */}
            <button
                onClick={handleOpen}
                className="relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9
                    rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-200
                    active:bg-gray-300 transition-all duration-150"
                aria-label="Notifications"
            >
                <IconBell />
                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5
                        bg-[#1a5c3a] text-white text-[9px] font-bold rounded-full
                        flex items-center justify-center leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl
                    shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100
                    overflow-hidden z-50
                    animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3
                        border-b border-gray-100">
                        <span className="text-sm font-bold text-gray-800 tracking-tight">
                            Notifications
                        </span>
                        {(notifications || []).length > 0 && (
                            <button
                                onClick={onClearAll}
                                className="text-[11px] text-gray-400 hover:text-red-500
                                    transition-colors font-medium"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-72 overflow-y-auto">
                        {(notifications || []).length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center
                                    justify-center text-gray-300">
                                    <IconBell />
                                </div>
                                <p className="text-xs text-gray-400 font-medium">No notifications yet</p>
                            </div>
                        ) : (
                            (notifications || []).map((notif, i) => (
                                <div
                                    key={notif.id}
                                    className={`flex items-start gap-3 px-4 py-3 transition-colors
                                        ${i !== (notifications.length - 1) ? 'border-b border-gray-50' : ''}
                                        ${notif.read ? 'bg-white' : 'bg-[#f0f7f4]'}
                                        hover:bg-gray-50`}
                                >
                                    {/* Icon */}
                                    <div className="w-8 h-8 rounded-[8px] bg-[#1a5c3a] flex items-center
                                        justify-center flex-shrink-0 mt-0.5">
                                        <IconCheckCircle className="text-white" />
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline justify-between gap-1">
                                            <p className="text-xs font-semibold text-gray-800 truncate">
                                                {notif.title}
                                            </p>
                                            <span className="text-[10px] text-gray-400 flex-shrink-0">
                                                {formatRelativeTime(notif.time)}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                                            {notif.message}
                                        </p>
                                    </div>

                                    {/* Unread dot */}
                                    {!notif.read && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a5c3a]
                                            flex-shrink-0 mt-1.5" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Profile Button ────────────────────────────────────────────────────

function ProfileButton({ user }) {
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
                    group-hover:bg-gray-400 transition-all">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
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

// ── Header ────────────────────────────────────────────────────────────

export default function Header({
    user,
    sidebarCollapsed,
    onOpenSidebar,
    notifications = [],
    toastQueue    = [],
    onMarkAllRead,
    onClearAll,
    onDismissToast,
}) {
    return (
        <>
            {/* Sileo toast container — fixed top-left, outside header flow */}
            <ToastContainer toastQueue={toastQueue} onDismiss={onDismissToast} />

            <header
                className={`
                    fixed top-0 right-0 z-30 bg-white border-b border-gray-200
                    h-14 md:h-16 flex items-center px-4 md:px-6
                    transition-all duration-300 ease-in-out
                    left-0
                    md:left-[60px]
                    ${!sidebarCollapsed ? 'md:left-56 lg:left-60' : ''}
                `}
            >
                {/* Mobile hamburger */}
                <button
                    onClick={onOpenSidebar}
                    className="md:hidden flex items-center justify-center w-8 h-8 mr-2
                        text-gray-500 hover:text-gray-700 hover:bg-gray-200
                        rounded-lg transition-all duration-150 flex-shrink-0"
                    aria-label="Open sidebar"
                >
                    <IconHamburger />
                </button>

                {/* Center — Title */}
                <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
                    <h1 className="text-gray-700 font-semibold tracking-[0.15em] md:tracking-[0.2em]
                        text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap">
                        PERSONAL DATA SHEET
                    </h1>
                </div>

                {/* Right — Bell + Profile */}
                <div className="ml-auto flex items-center gap-1 md:gap-2">
                    <NotificationBell
                        notifications={notifications}
                        onMarkAllRead={onMarkAllRead}
                        onClearAll={onClearAll}
                    />
                    <ProfileButton user={user} />
                </div>
            </header>
        </>
    );
}
