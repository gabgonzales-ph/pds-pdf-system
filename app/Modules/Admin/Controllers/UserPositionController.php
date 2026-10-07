<?php

namespace App\Modules\Admin\Controllers;

use App\Modules\Admin\Models\ActivityLog;
use App\Modules\Admin\Models\Position;
use App\Modules\Auth\Models\User;
use App\Services\ActivityLog\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserPositionController
{
    /**
     * GET /admin/users/{user}/positions/available
     * Returns published positions not yet assigned to ANY user, grouped by tier.
     */
    public function available(User $user): JsonResponse
    {
        if (!$user->hasPdsCompleted()) {
            return response()->json([
                'assignable' => false,
                'message'    => 'User does not have a completed Personal Data Sheet.',
            ], 422);
        }

        $assignedIds = DB::table('user_positions')->pluck('position_id');

        // Positions are soft-deleted when assigned, so we query withoutTrashed (default).
        // We exclude already-assigned IDs as a safety net.
        $positions = Position::published()
            ->whereNotIn('id', $assignedIds)
            ->orderBy('tier')
            ->orderBy('position_title')
            ->get(['id', 'position_title', 'tier', 'item_number'])
            ->groupBy('tier');

        return response()->json([
            'assignable' => true,
            'positions'  => $positions,
        ]);
    }

    /**
     * POST /admin/users/{user}/positions/{position}
     * Assigns a position to a user and soft-deletes it so it moves to Archives.
     */
    public function assign(Request $request, User $user, Position $position): JsonResponse
    {
        if (!$user->hasPdsCompleted()) {
            return response()->json([
                'message' => 'Cannot assign position: user does not have a completed Personal Data Sheet.',
            ], 422);
        }

        $isAssigned = DB::table('user_positions')->where('position_id', $position->id)->exists();

        if ($isAssigned) {
            return response()->json([
                'message' => 'Position is already assigned to an employee.',
            ], 409);
        }

        if ($position->status !== 'published') {
            return response()->json([
                'message' => 'Only published positions can be assigned.',
            ], 422);
        }

        $user->positions()->attach($position->id, [
            'assigned_by' => auth()->id(),
        ]);

        // ── Resolve employee display name ─────────────────────────────
        $pi       = $user->personalInformation;
        $userName = $pi
            ? trim("{$pi->last_name}, {$pi->first_name}" . ($pi->middle_name ? " {$pi->middle_name}" : ''))
            : $user->username;

        // ── Write assignment log ──────────────────────────────────────
        DB::table('position_assignment_logs')->insert([
            'position_id'    => $position->id,
            'position_title' => $position->position_title,
            'position_tier'  => $position->tier,
            'user_id'        => $user->id,
            'user_name'      => $userName,
            'employee_id'    => str_pad($user->employee_id, 8, '0', STR_PAD_LEFT),
            'event'          => 'assigned',
            'performed_by'   => auth()->id(),
            'created_at'     => now(),
        ]);

        // ── Soft-delete the position so it moves to Archives ──────────
        // It will reappear in the active list when unassigned (restored).
        $position->delete();

        ActivityLogService::log(
            action: ActivityLog::ACTION_ASSIGN_POSITION,
            actorId: auth()->id(),
            actorType: 'admin',
            entityType: 'User',
            entityId: $user->id,
            changes: [
                'position_id'    => $position->id,
                'position_title' => $position->position_title,
                'tier'           => $position->tier,
            ],
            request: $request,
        );

        return response()->json([
            'message'  => 'Position assigned successfully.',
            'position' => [
                'id'             => $position->id,
                'position_title' => $position->position_title,
                'tier'           => $position->tier,
                'item_number'    => $position->item_number,
            ],
        ], 201);
    }

    /**
     * DELETE /admin/users/{user}/positions/{position}
     * Removes a position assignment and restores the position to the active list.
     */
    public function remove(Request $request, User $user, Position $position): JsonResponse
    {
        

        if (!$user->hasPosition($position->id)) {
            return response()->json([
                'message' => 'Position is not assigned to this user.',
            ], 404);
        }

        // ── Resolve employee display name ─────────────────────────────
        $pi       = $user->personalInformation;
        $userName = $pi
            ? trim("{$pi->last_name}, {$pi->first_name}" . ($pi->middle_name ? " {$pi->middle_name}" : ''))
            : $user->username;

        // ── Write unassignment log BEFORE detach ──────────────────────
        DB::table('position_assignment_logs')->insert([
            'position_id'    => $position->id,
            'position_title' => $position->position_title,
            'position_tier'  => $position->tier,
            'user_id'        => $user->id,
            'user_name'      => $userName,
            'employee_id'    => str_pad($user->employee_id, 8, '0', STR_PAD_LEFT),
            'event'          => 'unassigned',
            'performed_by'   => auth()->id(),
            'created_at'     => now(),
        ]);

        $user->positions()->detach($position->id);

        // ── Restore the position back to the active list ──────────────
        $position->restore();

        ActivityLogService::log(
            action: ActivityLog::ACTION_REMOVE_POSITION,
            actorId: auth()->id(),
            actorType: 'admin',
            entityType: 'User',
            entityId: $user->id,
            changes: [
                'position_id'    => $position->id,
                'position_title' => $position->position_title,
                'tier'           => $position->tier,
            ],
            request: $request,
        );

        return response()->json([
            'message' => 'Position removed successfully.',
        ]);
    }
}