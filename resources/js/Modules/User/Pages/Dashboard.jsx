// resources/js/Modules/User/Pages/Dashboard.jsx

import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import PersonalDataSheet from '../Components/PersonalDataSheet';

export default function Dashboard() {
    const { auth, progress, positions } = usePage().props;
    const userId = auth?.user?.id;

    const [activePage, setActivePage] = useState('pds');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // ── Notification state ────────────────────────────────────────────
    const [notifications, setNotifications] = useState(() => {
        try {
            const stored = localStorage.getItem(`pds_notifs_${userId}`);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [toastQueue, setToastQueue] = useState([]);

    const prevProgress  = useRef(progress?.overall ?? 0);
    // Track which position IDs we've already notified about
    const notifiedPositionIds = useRef(
        new Set(
            (() => {
                try {
                    const stored = localStorage.getItem(`pds_notified_positions_${userId}`);
                    return stored ? JSON.parse(stored) : [];
                } catch {
                    return [];
                }
            })()
        )
    );

    // Persist notifications
    useEffect(() => {
        try {
            localStorage.setItem(`pds_notifs_${userId}`, JSON.stringify(notifications));
        } catch { /* storage unavailable */ }
    }, [notifications, userId]);

    // Persist notified position IDs
    useEffect(() => {
        try {
            localStorage.setItem(
                `pds_notified_positions_${userId}`,
                JSON.stringify([...notifiedPositionIds.current])
            );
        } catch { /* storage unavailable */ }
    }, [notifications, userId]); // re-persist whenever notifications change

    // ── PDS complete notification ─────────────────────────────────────
    useEffect(() => {
        const current = progress?.overall ?? 0;
        const prev    = prevProgress.current;
        prevProgress.current = current;

        if (current === 100 && prev < 100) {
            const alreadyNotified = notifications.some(n => n.type === 'pds_complete');
            if (!alreadyNotified) {
                const notif = {
                    id:      Date.now(),
                    type:    'pds_complete',
                    title:   'PDS Complete',
                    message: 'Your Personal Data Sheet is now 100% complete and ready to download.',
                    time:    new Date().toISOString(),
                    read:    false,
                };
                setNotifications(prev => [notif, ...prev]);
                setToastQueue(prev => [...prev, notif]);
            }
        }

        if (current < 100 && prev === 100) {
            setNotifications(prev => prev.filter(n => n.type !== 'pds_complete'));
        }
    }, [progress?.overall]);

    // On mount: silent pds_complete if already 100
    useEffect(() => {
        if ((progress?.overall ?? 0) === 100) {
            const alreadyNotified = notifications.some(n => n.type === 'pds_complete');
            if (!alreadyNotified) {
                const notif = {
                    id:      Date.now(),
                    type:    'pds_complete',
                    title:   'PDS Complete',
                    message: 'Your Personal Data Sheet is now 100% complete and ready to download.',
                    time:    new Date().toISOString(),
                    read:    true,
                };
                setNotifications(prev => [notif, ...prev]);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Position assignment notifications ─────────────────────────────
    useEffect(() => {
        if (!Array.isArray(positions) || positions.length === 0) return;

        const newNotifs  = [];
        const newToasts  = [];

        positions.forEach(pos => {
            if (notifiedPositionIds.current.has(pos.id)) return;

            notifiedPositionIds.current.add(pos.id);

            const tierLabel = pos.tier
                ? pos.tier.charAt(0).toUpperCase() + pos.tier.slice(1)
                : 'N/A';

            const notif = {
                id:      `pos_${pos.id}_${Date.now()}`,
                type:    'position_assigned',
                positionId: pos.id,
                title:   'Position Assigned',
                message: `${pos.position_title} • ${tierLabel} • Item No. ${pos.item_number ?? 'N/A'}`,
                time:    pos.assigned_at ?? new Date().toISOString(),
                read:    false,
            };

            newNotifs.push(notif);
            newToasts.push(notif);
        });

        if (newNotifs.length > 0) {
            setNotifications(prev => [...newNotifs, ...prev]);
            setToastQueue(prev => [...prev, ...newToasts]);
        }
    }, [positions]);

    function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }

    function clearAllNotifications() {
        setNotifications([]);
    }

    function dismissToast(id) {
        setToastQueue(prev => prev.filter(n => n.id !== id));
    }

    // ── Sidebar responsive collapse ───────────────────────────────────
    useEffect(() => {
        function syncCollapse() {
            if (window.innerWidth < 768) setSidebarCollapsed(true);
        }
        syncCollapse();
        window.addEventListener('resize', syncCollapse);
        return () => window.removeEventListener('resize', syncCollapse);
    }, []);

    return (
        <div className="min-h-screen bg-[#f0f2f0]">
            <Sidebar
                activePage={activePage}
                onNavigate={setActivePage}
                collapsed={sidebarCollapsed}
                onCollapse={setSidebarCollapsed}
                progress={progress?.overall || 0}
            />
            <Header
                user={auth?.user}
                sidebarCollapsed={sidebarCollapsed}
                onOpenSidebar={() => setSidebarCollapsed(false)}
                notifications={notifications}
                toastQueue={toastQueue}
                onMarkAllRead={markAllRead}
                onClearAll={clearAllNotifications}
                onDismissToast={dismissToast}
            />
            <main
                className={`
                    pt-14 md:pt-16 min-h-screen transition-all duration-300 ease-in-out
                    pl-0
                    ${sidebarCollapsed ? 'md:pl-[60px]' : 'md:pl-56 lg:pl-60'}
                `}
            >
                <div className="p-0 md:p-0 lg:p-0">
                    {activePage === 'pds' && <PersonalDataSheet />}
                </div>
            </main>
        </div>
    );
}