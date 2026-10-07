// resources/js/Modules/Admin/Components/HeaderStatCards.jsx

import { useEffect, useState } from 'react';

function useCountUp(target, duration = 800) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (target === 0) { setCount(0); return; }
        let startTime = null;
        const start = 0;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
        }

        requestAnimationFrame(step);
    }, [target, duration]);

    return count;
}

function StatCard({ label, description, value, accentColor, icon, delay = 0 }) {
    const animatedValue = useCountUp(value, 900);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div
            className={`
                bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100
                px-3 py-3 sm:px-5 sm:py-5 flex items-center gap-2 sm:gap-4
                hover:shadow-md transition-all duration-200 cursor-default
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
            `}
            style={{ transition: 'opacity 400ms ease-out, transform 400ms ease-out, box-shadow 200ms' }}
        >
            {/* Accent icon block */}
            <div
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 hidden xs:flex sm:flex"
                style={{ backgroundColor: `${accentColor}18` }}
            >
                <span style={{ color: accentColor }}>{icon}</span>
            </div>

            {/* Text */}
            <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium truncate">{label}</p>
                <p
                    className="text-lg sm:text-2xl font-black leading-tight"
                    style={{ color: accentColor }}
                >
                    {String(animatedValue).padStart(2, '0')}
                </p>
                <p className="hidden sm:block text-[11px] text-gray-400 leading-tight truncate mt-0.5">
                    {description}
                </p>
            </div>
        </div>
    );
}

function IconEmployees() {
    return (
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function IconPositions() {
    return (
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

function IconPending() {
    return (
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

export default function HeaderStatCards({ stats = {} }) {
    const { employees = 0, positions = 0, pending = 0 } = stats;

    const cards = [
        {
            label:       'Employees',
            description: 'Completed Personal Data Sheets',
            value:       employees,
            accentColor: '#1a5c3a',
            icon:        <IconEmployees />,
            delay:       0,
        },
        {
            label:       'Positions',
            description: 'Position Description Forms submitted',
            value:       positions,
            accentColor: '#2563eb',
            icon:        <IconPositions />,
            delay:       80,
        },
        {
            label:       'Pending',
            description: 'Registered users with incomplete PDS',
            value:       pending,
            accentColor: '#d97706',
            icon:        <IconPending />,
            delay:       160,
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
            {cards.map(card => (
                <StatCard key={card.label} {...card} />
            ))}
        </div>
    );
}