<?php

namespace App\Modules\Admin\Controllers;

use App\Modules\Admin\Models\ActivityLog;
use App\Modules\Admin\Models\Position;
use App\Modules\Auth\Models\PersonalInformation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController
{
    // ── Action groups ─────────────────────────────────────────────────

    private const PROFILING_ACTIONS = [
        ActivityLog::ACTION_PDS_REMOVED,
        ActivityLog::ACTION_PDS_RESTORED,
    ];

    private const POSITION_ACTIONS = [
        ActivityLog::ACTION_POSITION_FORM_CREATED,
        ActivityLog::ACTION_POSITION_FORM_UPDATED,
        ActivityLog::ACTION_POSITION_FORM_REMOVED,
        ActivityLog::ACTION_POSITION_FORM_RESTORED,
    ];

    private const POSITION_ASSIGNMENT_ACTIONS = [
        ActivityLog::ACTION_ASSIGN_POSITION,
        ActivityLog::ACTION_REMOVE_POSITION,
    ];

    // Actions whose entity_id refers to a user that needs full-name enrichment
    private const USER_ENTITY_ACTIONS = [
        ActivityLog::ACTION_PDS_REMOVED,
        ActivityLog::ACTION_PDS_RESTORED,
        ActivityLog::ACTION_ASSIGN_POSITION,
        ActivityLog::ACTION_REMOVE_POSITION,
    ];

    /**
     * GET /admin/activity-logs?actions=ADMIN_LOGIN,ADMIN_LOGOUT
     */
    public function index(Request $request): JsonResponse
    {
        $actions = $request->query('actions');

        $actionList = [];
        if ($actions) {
            $actionList = array_values(array_filter(
                array_map('trim', explode(',', $actions))
            ));
        }

        $logs = ActivityLog::with(['actor:id,username,role'])
            ->orderByDesc('created_at')
            ->limit(200)
            ->when(!empty($actionList), fn ($q) => $q->whereIn('action', $actionList))
            ->get();

        // Determine which enrichments are needed based on actions actually present in results
        $presentActions = $logs->pluck('action')->unique()->values()->all();

        $needsUserFullName       = !empty(array_intersect($presentActions, self::USER_ENTITY_ACTIONS));
        $needsPositionTitle      = !empty(array_intersect($presentActions, self::POSITION_ACTIONS));
        $needsAssignmentMetadata = !empty(array_intersect($presentActions, self::POSITION_ASSIGNMENT_ACTIONS));

        // ── Attach entity_full_name for user-entity logs ──────────────
        if ($needsUserFullName) {
            $userEntityLogs = $logs->filter(
                fn ($log) => in_array($log->action, self::USER_ENTITY_ACTIONS)
            );

            $userIds = $userEntityLogs->pluck('entity_id')->filter()->unique()->values();

            $personalInfoMap = $userIds->isNotEmpty()
                ? PersonalInformation::whereIn('user_id', $userIds)
                    ->get(['user_id', 'first_name', 'last_name'])
                    ->keyBy('user_id')
                : collect();

            $logs->each(function ($log) use ($personalInfoMap) {
                if (!in_array($log->action, self::USER_ENTITY_ACTIONS)) {
                    return;
                }

                $info = $log->entity_id ? $personalInfoMap->get($log->entity_id) : null;
                $log->entity_full_name = $info
                    ? trim($info->first_name . ' ' . $info->last_name)
                    : null;
            });
        }

        // ── Attach entity_position_title for position form logs ───────
        if ($needsPositionTitle) {
            $positionIds = $logs
                ->filter(fn ($log) => in_array($log->action, self::POSITION_ACTIONS))
                ->pluck('entity_id')
                ->filter()
                ->unique()
                ->values();

            if ($positionIds->isNotEmpty()) {
                $positionMap = Position::withTrashed()
                    ->whereIn('id', $positionIds)
                    ->get(['id', 'position_title'])
                    ->keyBy('id');

                $logs->each(function ($log) use ($positionMap) {
                    if (in_array($log->action, self::POSITION_ACTIONS)) {
                        $log->entity_position_title =
                            $positionMap->get($log->entity_id)?->position_title ?? null;
                    }
                });
            }
        }

        // ── Attach position metadata for assignment logs (from changes) 
        if ($needsAssignmentMetadata) {
            $logs->each(function ($log) {
                if (!in_array($log->action, self::POSITION_ASSIGNMENT_ACTIONS)) {
                    return;
                }
                $log->entity_position_title = $log->changes['position_title'] ?? null;
                $log->entity_position_tier  = $log->changes['tier'] ?? null;
            });
        }

        return response()->json([
            'logs' => $logs,
        ]);
    }
}