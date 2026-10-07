// resources/js/Modules/Admin/Components/Profiling/PositionBadge.jsx

import { tierCfg } from './tierConfig';

// ── Status Badge ──────────────────────────────────────────────────────

export function StatusBadge({ complete }) {
    return complete ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold
            bg-green-50 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Complete
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold
            bg-zinc-100 text-zinc-600 border border-zinc-200">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
            Incomplete
        </span>
    );
}

// ── Position Badge ────────────────────────────────────────────────────
// Read-only display badge — remove button lives in AssignedPositionsPanel.

export function PositionBadge({ position }) {
    if (!position) return null;

    const cfg = tierCfg(position.tier);

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
            text-[11px] font-semibold border w-full transition-colors duration-150
            ${cfg.badge}`}>
            
            <span className="flex-1 truncate leading-tight">{position.position_title}</span>
        </span>
    );
}
