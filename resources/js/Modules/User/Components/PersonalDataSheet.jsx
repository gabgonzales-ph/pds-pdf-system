// resources/js/Modules/User/Components/PersonalDataSheet.jsx

import { useState, useRef, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import PersonalInformationSection     from './PersonalInformation';
import FamilyBackgroundSection        from './FamilyBackground';
import EducationalBackgroundSection   from './EducationalBackground';
import CivilServiceEligibilitySection from './CivilServiceEligibility';
import WorkExperienceSection          from './WorkExperience';
import VoluntaryWorkSection           from './VoluntaryWorkInvolvementCivic';
import LearningAndDevelopmentSection  from './LearningAndDevelopmentInterventions';
import OtherInformationSection        from './OtherInformation';
import FinalFormSection               from './FinalForm';
import ViewPDS                        from './ViewPDS';

// ─────────────────────────────────────────────────────────────────────
// Tier config
// ─────────────────────────────────────────────────────────────────────

const TIER_CONFIG = {
    executive:  { badge: 'text-purple-700'  },
    management: { badge: 'text-blue-700'    },
    staff:      { badge: 'text-emerald-700' },
};

const DEFAULT_TIER = { badge: 'text-gray-600' };

function tierCfg(tier) {
    return TIER_CONFIG[tier?.toLowerCase()] ?? DEFAULT_TIER;
}

function tierLabel(tier) {
    return tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : '';
}

// ─────────────────────────────────────────────────────────────────────
// Verified icon (Meta-style gold badge)
// ─────────────────────────────────────────────────────────────────────

function VerifiedIcon() {
    return (
        <svg
            viewBox="0 0 22 22"
            style={{ width: '14px', height: '14px', flexShrink: 0 }}
            aria-hidden="true"
        >
            <path
                d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.648.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816z"
                fill="#FFD700"
            />
            <path
                d="M9.006 14.99l-3.5-3.5 1.414-1.414 2.086 2.086 4.586-4.586 1.414 1.414z"
                fill="white"
            />
        </svg>
    );
}

// ─────────────────────────────────────────────────────────────────────
// Pending icon (clock outline, muted gray)
// ─────────────────────────────────────────────────────────────────────

function PendingIcon() {
    return (
        <svg
            viewBox="0 0 22 22"
            style={{ width: '14px', height: '14px', flexShrink: 0 }}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
        >
            <circle cx="11" cy="11" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 7v4l2.5 2.5" />
        </svg>
    );
}

// ─────────────────────────────────────────────────────────────────────
// Position badges
// ─────────────────────────────────────────────────────────────────────

function PositionBadge({ position, primary = false }) {
    const cfg = tierCfg(position.tier);
    return (
        <span
            className={`inline-flex items-center gap-1 transition-all duration-200
                ${primary
                    ? 'text-[12px] md:text-[13px] font-bold'
                    : 'text-[10px] md:text-[11px] font-semibold opacity-80'
                }
                ${cfg.badge}`}
        >
            <VerifiedIcon />
            <span className="leading-none">{position.position_title}</span>
            <span className="opacity-50 font-medium leading-none text-gray-400">
                · {tierLabel(position.tier)}
            </span>
        </span>
    );
}

function PositionBadges({ positions }) {
    if (!positions?.length) {
        return (
            <div className="mt-2 flex items-center gap-1.5 text-[12px] md:text-[13px] font-semibold text-gray-400">
                <PendingIcon />
                <span className="leading-none">Position Assignment:</span>
                <span className="leading-none font-bold text-gray-400">Pending</span>
            </div>
        );
    }

    const order  = ['executive', 'management', 'staff'];
    const sorted = [...positions].sort((a, b) => {
        const ai = order.indexOf(a.tier?.toLowerCase());
        const bi = order.indexOf(b.tier?.toLowerCase());
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    const [primary, ...rest] = sorted;

    return (
        <div className="mt-2 flex flex-wrap items-center gap-2">
            <PositionBadge position={primary} primary />
            {rest.map(p => (
                <PositionBadge key={p.id} position={p} />
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────
// Section registry
// ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
    { id: 'personal',   label: 'Personal Information',      roman: 'I',    progressKey: 'personal'        },
    { id: 'family',     label: 'Family Background',         roman: 'II',   progressKey: 'family'          },
    { id: 'education',  label: 'Educational Background',    roman: 'III',  progressKey: 'education'       },
    { id: 'civil',      label: 'Civil Service Eligibility', roman: 'IV',   progressKey: 'civil_service'   },
    { id: 'work',       label: 'Work Experience',           roman: 'V',    progressKey: 'work_experience' },
    { id: 'voluntary',  label: 'Voluntary Work',            roman: 'VI',   progressKey: 'voluntary_work'  },
    { id: 'learning',   label: 'Learning & Development',    roman: 'VII',  progressKey: 'learning_dev'    },
    { id: 'other',      label: 'Other Information',         roman: 'VIII', progressKey: 'other_info'      },
    { id: 'final',      label: 'References & Final Form',   roman: 'IX',   progressKey: 'final_form'      },
];

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function formatDisplayDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d)) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function buildFullName(pi) {
    if (!pi?.last_name && !pi?.first_name) return null;
    const mi     = pi?.middle_name ? ` ${pi.middle_name.charAt(0).toUpperCase()}.` : '';
    const suffix = pi?.suffix       ? ` ${pi.suffix}` : '';
    const last   = (pi?.last_name  || '').toUpperCase();
    const first  = pi?.first_name  || '';
    return `${last}, ${first}${mi}${suffix}`;
}

// ─────────────────────────────────────────────────────────────────────
// Mobile scrollable tabs
// ─────────────────────────────────────────────────────────────────────

function MobileTabs({ sections, activeId, isSectionDone, onSelect }) {
    const scrollRef = useRef(null);
    const activeRef = useRef(null);
    const [fadeLeft,  setFadeLeft]  = useState(false);
    const [fadeRight, setFadeRight] = useState(false);

    function updateFades() {
        const el = scrollRef.current;
        if (!el) return;
        setFadeLeft(el.scrollLeft > 8);
        setFadeRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    }

    useEffect(() => { updateFades(); }, []);

    useEffect(() => {
        const container = scrollRef.current;
        const tab       = activeRef.current;
        if (!container || !tab) return;
        const containerLeft = container.getBoundingClientRect().left;
        const tabLeft       = tab.getBoundingClientRect().left;
        const tabCenter     = tabLeft - containerLeft + tab.offsetWidth / 2;
        const targetScroll  = container.scrollLeft + tabCenter - container.clientWidth / 2;
        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }, [activeId]);

    return (
        <div className="relative">
            <div
                className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 transition-opacity duration-300"
                style={{ opacity: fadeLeft ? 1 : 0, background: 'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))' }}
            />
            <div
                className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 transition-opacity duration-300"
                style={{ opacity: fadeRight ? 1 : 0, background: 'linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))' }}
            />
            <div
                ref={scrollRef}
                onScroll={updateFades}
                className="overflow-x-auto scrollbar-none"
                style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            >
                <style>{`.scrollbar-none::-webkit-scrollbar{display:none}.scrollbar-none{-ms-overflow-style:none;scrollbar-width:none}`}</style>
                <div className="flex gap-1 px-3 pt-2.5 pb-2 w-max">
                    {sections.map(s => {
                        const isDone   = isSectionDone(s.progressKey);
                        const isActive = activeId === s.id;
                        return (
                            <button
                                key={s.id}
                                ref={isActive ? activeRef : null}
                                onClick={() => onSelect(s.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all duration-200 flex-shrink-0
                                    ${isActive
                                        ? 'bg-blue-50 text-blue-900 font-bold border border-blue-100'
                                        : 'text-gray-500 hover:bg-gray-100 font-semibold'
                                    }`}
                            >
                                {isDone && (
                                    <svg className="w-3 h-3 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {s.roman}. {s.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────
// Sidebar nav item
// ─────────────────────────────────────────────────────────────────────

function NavItem({ section, isActive, isDone, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`relative w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-300 ease-in-out group
                ${isActive ? 'bg-blue-50' : 'hover:bg-gray-100/60'}`}
        >
            {isActive && <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 transition-all duration-300" />}
            <span className="flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {isDone ? (
                    <svg className="w-[20px] h-[20px] text-green-500 drop-shadow-sm" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-[20px] h-[20px] text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="9" />
                    </svg>
                )}
            </span>
            <span className={`flex-1 text-[13px] leading-tight transition-colors duration-300
                ${isActive ? 'font-bold text-blue-900' :
                  isDone   ? 'font-medium text-gray-800' :
                             'font-medium text-gray-400 group-hover:text-gray-600'}`}>
                {section.label}
            </span>
        </button>
    );
}

// ─────────────────────────────────────────────────────────────────────
// Animation
// ─────────────────────────────────────────────────────────────────────

const STYLE = `
@keyframes pds-fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0);    }
}
.pds-section-enter {
    animation: pds-fade-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
}
`;

// ─────────────────────────────────────────────────────────────────────
// Section content renderer
// ─────────────────────────────────────────────────────────────────────

function SectionContent({ activeId, props }) {
    const {
        personalInformation, familyBackground, children,
        civilServiceEligibilities, workExperiences, voluntaryWorks,
        learningDevelopments, otherInformation, pdsFinalForm, auth,
    } = props;

    const civilStatus = personalInformation?.civil_status || '';

    // Convert to an array to guarantee proper order when printing
    const sectionsList = [
        { id: 'personal',  component: <PersonalInformationSection data={personalInformation} auth={auth} /> },
        { id: 'family',    component: <FamilyBackgroundSection data={familyBackground} children={children} civilStatus={civilStatus} /> },
        { id: 'education', component: <EducationalBackgroundSection /> },
        { id: 'civil',     component: <CivilServiceEligibilitySection data={civilServiceEligibilities ?? []} /> },
        { id: 'work',      component: <WorkExperienceSection data={workExperiences ?? []} /> },
        { id: 'voluntary', component: <VoluntaryWorkSection data={voluntaryWorks ?? []} /> },
        { id: 'learning',  component: <LearningAndDevelopmentSection data={learningDevelopments ?? []} /> },
        { id: 'other',     component: <OtherInformationSection data={otherInformation} /> },
        { id: 'final',     component: <FinalFormSection data={pdsFinalForm} /> },
    ];

    return (
        <>
            {sectionsList.map(({ id, component }) => (
                <div
                    key={id}
                    // For active id we show it normally. For inactive ones, we hide them visually but force them to render block-level when printing.
                    className={activeId === id ? 'pds-section-enter block' : 'hidden print:block print:break-inside-avoid print:mb-8'}
                >
                    {component}
                </div>
            ))}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────

export default function PersonalDataSheet() {
    const pageProps = usePage().props;
    const { personalInformation, progress, userCreatedAt, lastModified, auth, positions } = pageProps;

    const fullName = buildFullName(personalInformation);
    const overall  = progress?.overall ?? 0;

    const [activeId, setActiveId] = useState('personal');
    const activeSection = SECTIONS.find(s => s.id === activeId);

    function isSectionDone(progressKey) {
        const v = progress?.[progressKey];
        return typeof v === 'number' && v >= 100;
    }

    const doneSections = SECTIONS.filter(s => isSectionDone(s.progressKey)).length;
    const barColor = overall === 100 ? '#22c55e' : '#60a5fa';

    return (
        <>
            <style>{STYLE}</style>

            {/* Changed flex wrapper to allow native page breaks during print */}
            <div className="flex h-full min-h-screen bg-white print:block">

                {/* ══ Sidebar — Desktop ══ */}
                <aside className="hidden md:flex flex-col w-64 lg:w-72 flex-shrink-0 sticky top-0 h-screen bg-gray-50 border-r border-gray-200 z-10 print:hidden">
                    <div className="px-6 pt-6 pb-8 border-b border-gray-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
                            CSC Form No. 212
                        </p>
                        <p className="text-sm font-bold text-gray-800 leading-tight">
                            Revised 2025
                        </p>
                    </div>

                    <nav className="flex-1 overflow-y-auto">
                        {SECTIONS.map(section => (
                            <NavItem
                                key={section.id}
                                section={section}
                                isActive={activeId === section.id}
                                isDone={isSectionDone(section.progressKey)}
                                onClick={() => setActiveId(section.id)}
                            />
                        ))}
                    </nav>

                    <div className="px-6 py-2 border-t border-gray-200 bg-white/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Progress</span>
                            <span className={`text-xs font-bold tabular-nums ${overall === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                                {overall}%
                            </span>
                        </div>
                        <div className="h-[4px] bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-in-out"
                                style={{ width: `${overall}%`, backgroundColor: barColor }}
                            />
                        </div>
                        <p className="mt-3 text-[11px] font-medium text-gray-400">
                            {doneSections} of {SECTIONS.length} sections complete
                        </p>
                    </div>
                </aside>

                {/* ══ Main content ══ */}
                <main className="flex-1 min-w-0 flex flex-col bg-white print:block print:w-full print:p-0">

                    {/* ── Top header ── */}
                    <header className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm relative z-19 print:hidden">
                        <div className="px-4 md:px-8 py-5 flex items-start gap-3 md:gap-6">

                            <div className="flex-1 min-w-0">

                                {/* Created + Modified (mobile: same row) */}
                                <div className="flex items-center gap-3 mb-1">
                                    <p className="text-[11px] text-gray-400 font-medium">
                                        Created&ensp;
                                        <span className="font-semibold text-gray-600">
                                            {formatDisplayDate(userCreatedAt)}
                                        </span>
                                    </p>
                                    <span className="sm:hidden text-gray-200 select-none">·</span>
                                    <p className="sm:hidden text-[11px] text-gray-400 font-medium">
                                        Modified&ensp;
                                        <span className="font-semibold text-gray-500">
                                            {formatDisplayDate(lastModified)}
                                        </span>
                                    </p>
                                </div>

                                {/* Full name */}
                                <h1 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight truncate leading-tight">
                                    {fullName ?? (
                                        <span className="text-gray-300 font-medium text-base italic">
                                            No name provided yet
                                        </span>
                                    )}
                                </h1>

                                {/* Position badges — shows pending state when empty */}
                                <PositionBadges positions={positions} />

                                {/* Department & Career Service */}
                                {(auth?.user?.department || auth?.user?.career_service) && (
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        {auth.user.department && (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] md:text-[11px] font-semibold text-gray-700">
                                                <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                {auth.user.department.name}{auth.user.department.code && ` (${auth.user.department.code})`}
                                            </span>
                                        )}
                                        {auth.user.career_service && (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] md:text-[11px] font-semibold text-gray-700">
                                                <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                </svg>
                                                {auth.user.career_service.name}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Last modified — desktop only */}
                            <div className="hidden sm:block flex-shrink-0 pl-4 md:pl-8 border-l border-gray-100 pt-0.5">
                                <p className="text-[11px] text-gray-400 mb-1 font-medium">Last modified</p>
                                <p className="text-sm font-bold text-gray-700 whitespace-nowrap">
                                    {formatDisplayDate(lastModified)}
                                </p>
                            </div>

                            {/* View PDS button */}
                            <div className="flex-shrink-0 pl-3 md:pl-8 border-l border-gray-100 pt-0.5">
                                <div className="md:hidden">
                                    <ViewPDS userName={fullName} compact />
                                </div>
                                <div className="hidden md:block">
                                    <ViewPDS userName={fullName} />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* ── Mobile: tabs + progress ── */}
                    <div className="md:hidden flex-shrink-0 bg-white border-b border-gray-100 print:hidden">
                        <MobileTabs
                            sections={SECTIONS}
                            activeId={activeId}
                            isSectionDone={isSectionDone}
                            onSelect={setActiveId}
                        />
                        <div className="px-4 pb-4 pt-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-semibold text-gray-400">
                                    {doneSections} of {SECTIONS.length} sections complete
                                </span>
                                <span className={`text-xs font-bold tabular-nums ${overall === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                                    {overall}%
                                </span>
                            </div>
                            <div className="h-[4px] bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${overall}%`, backgroundColor: barColor }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Breadcrumb ── */}
                    <div className="flex-shrink-0 px-4 md:px-8 py-4 flex items-center gap-3 bg-white print:hidden">
                        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400">
                            Section {activeSection?.roman}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-[12px] font-bold text-gray-700">
                            {activeSection?.label}
                        </span>
                        {isSectionDone(activeSection?.progressKey) && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="flex items-center gap-1.5 text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Complete
                                </span>
                            </>
                        )}
                    </div>

                    {/* ── Section content ── */}
                    <div className="flex-1 px-4 md:px-8 pb-10 bg-white print:p-0 print:pb-0">
                        <SectionContent activeId={activeId} props={pageProps} />
                    </div>

                </main>
            </div>
        </>
    );
}