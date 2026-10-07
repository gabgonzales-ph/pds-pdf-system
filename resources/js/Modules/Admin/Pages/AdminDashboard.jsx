// resources/js/Modules/Admin/Pages/AdminDashboard.jsx

import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import AdminHeader from '../Components/AdminHeader';
import AdminSideBar from '../Components/AdminSideBar';
import HeaderStatCards from '../Components/HeaderStatCards';
import Profiling from '../Components/EmployeeProfiling/EmployeeProfiling';
import Positions from '../Components/Positions/Positions';
import Archives from '../Components/Archives/Archives';
import ActivityLog from '../Components/ActivityLog';


export default function AdminDashboard() {
    const {
        auth, stats, employees, departments, filters,
        positions, posFilters,
        archivedUsers, archivedPositions,
        positionAssignmentLogs,             // ← new
    } = usePage().props;

    const initialSection = (() => {
        const params = new URLSearchParams(window.location.search);
        const s = params.get('section');
        if (s === 'positions')     return 'positions';
        if (s === 'archives')      return 'archives';
        if (s === 'activity-log')  return 'activity-log';
        if (s === 'org-structure') return 'org-structure';
        return 'profiling';
    })();

    const [activePage,       setActivePage]       = useState(initialSection);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

            <AdminSideBar
                activePage={activePage}
                onNavigate={setActivePage}
                collapsed={sidebarCollapsed}
                onCollapse={setSidebarCollapsed}
            />

            <AdminHeader
                user={auth?.user}
                activePage={activePage}
                sidebarCollapsed={sidebarCollapsed}
                onOpenSidebar={() => setSidebarCollapsed(false)}
            />

            <main
                className={`
                    pt-14 md:pt-16 min-h-screen
                    transition-all duration-300 ease-in-out
                    pl-0
                    ${sidebarCollapsed ? 'md:pl-[60px]' : 'md:pl-56 lg:pl-60'}
                `}
            >
                <div className="p-4 md:p-6 lg:p-8">

                    <HeaderStatCards stats={stats} />

                    {activePage === 'profiling' && (
                        <Profiling
                            employees={employees}
                            departments={departments}
                            filters={filters}
                        />
                    )}

                    {activePage === 'positions' && (
                        <Positions
                            positions={positions}
                            posFilters={posFilters}
                            onNavigate={setActivePage}    // ← passed so Position Archives button works
                        />
                    )}

                    

                    {activePage === 'archives' && (
                        <Archives
                            
                        />
                    )}

                    {activePage === 'activity-log' && (
                        <ActivityLog />
                    )}

                </div>
            </main>
        </div>
    );
}