import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
Circular Progress Ring
─────────────────────────────────────────*/
function CircularProgress({ pct, size = 44, stroke = 3.5 }) {
const r = (size - stroke * 2) / 2;
const circ = 2 * Math.PI * r;
const offset = circ - (pct / 100) * circ;


return (
    <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
    >
        <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
        />

        <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#1a5c3a"
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
                transition: "stroke-dashoffset 600ms ease"
            }}
        />

        <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
                transform: "rotate(90deg)",
                transformOrigin: `${size / 2}px ${size / 2}px`,
                fontSize: "9px",
                fontWeight: 700,
                fill: "#1a5c3a"
            }}
        >
            {pct}%
        </text>
    </svg>
);


}

/* ─────────────────────────────────────────
Sections
─────────────────────────────────────────*/
const SECTIONS = [
{ key: "personal", label: "Personal" },
{ key: "family", label: "Family" },
{ key: "education", label: "Education" },
{ key: "civil_service", label: "Eligibility" },
{ key: "work_experience", label: "Work Exp" },
{ key: "voluntary_work", label: "Voluntary" },
{ key: "learning_dev", label: "L&D" },
{ key: "other_info", label: "Other Info" },
{ key: "final_form", label: "Questions" }
];

/* ─────────────────────────────────────────
Section Marker
─────────────────────────────────────────*/
function Marker({ label, done }) {
return ( <div className="flex flex-col items-center w-[48px]">
<div
className={`                 w-4 h-4 rounded-full border flex items-center justify-center
                transition-all duration-300
                ${done ? "bg-[#1a5c3a] border-[#1a5c3a]" : "bg-white border-gray-300"}
            `}
>
{done && ( <svg
                     className="w-2.5 h-2.5 text-white"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                 > <path
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         strokeWidth={3}
                         d="M5 13l4 4L19 7"
                     /> </svg>
)} </div>


        <span className="text-[8px] text-gray-500 text-center mt-1">
            {label}
        </span>
    </div>
);


}

/* ─────────────────────────────────────────
Main Component
─────────────────────────────────────────*/
export default function PDSProgressWidget({ progress }) {


const {
    overall = 0,
    personal = 0,
    family = 0,
    education = 0,
    civil_service = 0,
    work_experience = 0,
    voluntary_work = 0,
    learning_dev = 0,
    other_info = 0,
    final_form = 0
} = progress ?? {};

const scores = {
    personal,
    family,
    education,
    civil_service,
    work_experience,
    voluntary_work,
    learning_dev,
    other_info,
    final_form
};

const completed =
    SECTIONS.filter(s => scores[s.key] === 100).length;

const progressWidth =
    (completed / (SECTIONS.length - 1)) * 100;

/* Widget state */
const [expanded, setExpanded] = useState(true);
const timerRef = useRef(null);

/* Auto collapse logic */
function triggerExpand() {

    setExpanded(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
        setExpanded(false);
    }, 3000);
}

/* On login mount */
useEffect(() => {
    triggerExpand();
}, []);

return (
    <div className="fixed bottom-4 right-4 z-50">

        {/* Expanded Pill */}
        <div
            className={`
            bg-white shadow-lg border rounded-full
            transition-all duration-500 ease-out
            flex items-center gap-4 px-4 py-2
            ${expanded ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
            style={{ minWidth: "260px", maxWidth: "80vw" }}
        >

            <CircularProgress pct={overall} />

            <div className="flex-1">

                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>PDS Progress</span>
                    <span>{completed}/9</span>
                </div>

                <div className="relative">

                    <div className="absolute top-[8px] left-0 right-0 h-[2px] bg-gray-200" />

                    <div
                        className="absolute top-[8px] left-0 h-[2px] bg-[#1a5c3a] transition-all duration-500"
                        style={{ width: `${progressWidth}%` }}
                    />

                    <div className="flex justify-between relative">

                        {SECTIONS.map(section => (
                            <Marker
                                key={section.key}
                                label={section.label}
                                done={scores[section.key] === 100}
                            />
                        ))}

                    </div>

                </div>

            </div>
        </div>

        {/* Circle Button */}
        <button
            onClick={triggerExpand}
            className={`
            absolute bottom-0 right-0
            bg-white shadow-lg border rounded-full
            transition-all duration-500
            ${expanded ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"}
        `}
        >

            <CircularProgress pct={overall} size={44} stroke={4} />

        </button>

    </div>
);


}
