<?php

namespace App\Services\ActivityLog;

use App\Modules\Admin\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogService
{
    /**
     * Record an activity log entry.
     *
     * @param  string       $action      Standardized action type constant from ActivityLog
     * @param  int|null     $actorId     ID of the user performing the action
     * @param  string       $actorType   'admin', 'user', or 'system'
     * @param  string|null  $entityType  Name of the affected model/resource, e.g. 'User', 'Position'
     * @param  int|null     $entityId    Primary key of the affected record
     * @param  array|null   $changes     Field-level before/after diff for update actions
     * @param  Request|null $request     Current HTTP request for IP and user agent capture
     */
    public static function log(
        string $action,
        ?int $actorId = null,
        string $actorType = 'system',
        ?string $entityType = null,
        ?int $entityId = null,
        ?array $changes = null,
        ?Request $request = null,
    ): void {
        ActivityLog::create([
            'actor_id'    => $actorId,
            'actor_type'  => $actorType,
            'action'      => $action,
            'entity_type' => $entityType,
            'entity_id'   => $entityId,
            'changes'     => $changes,
            'ip_address'  => $request?->ip(),
            'user_agent'  => $request?->userAgent(),
        ]);
    }
}
