// resources/js/Modules/Admin/Components/Profiling/PositionsCell.jsx

import { PositionBadge } from './PositionBadge';

// Read-only column cell — assign/remove actions live in the Actions column
// and the dual-panel PositionAssignModal respectively.

export function PositionsCell({ positions = [] }) {
    if (positions.length === 0) {
        return (
            <span className="text-xs text-gray-300 italic">No positions assigned</span>
        );
    }

    return (
        <div className="flex flex-col gap-1.5" style={{ minWidth: '160px', maxWidth: '200px' }}>
            {positions.map(pos => (
                <PositionBadge key={pos.id} position={pos} />
            ))}
        </div>
    );
}
