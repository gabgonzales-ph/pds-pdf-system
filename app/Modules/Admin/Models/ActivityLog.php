<?php

namespace App\Modules\Admin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\Auth\Models\User;

class ActivityLog extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'actor_id',
        'actor_type',
        'action',
        'entity_type',
        'entity_id',
        'changes',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'changes'    => 'array',
            'created_at' => 'datetime',
        ];
    }

    // ── Relationships ────────────────────────────────────────────────

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    // ── Action Type Constants ────────────────────────────────────────

    // Authentication
    const ACTION_ADMIN_LOGIN  = 'ADMIN_LOGIN';
    const ACTION_ADMIN_LOGOUT = 'ADMIN_LOGOUT';

    // User events
    const ACTION_USER_REGISTERED = 'USER_REGISTERED';

    // PDS actions
    const ACTION_PDS_REMOVED  = 'PDS_REMOVED';
    const ACTION_PDS_RESTORED = 'PDS_RESTORED';

    // Position description form actions
    const ACTION_POSITION_FORM_CREATED  = 'POSITION_FORM_CREATED';
    const ACTION_POSITION_FORM_UPDATED  = 'POSITION_FORM_UPDATED';
    const ACTION_POSITION_FORM_REMOVED  = 'POSITION_FORM_REMOVED';
    const ACTION_POSITION_FORM_RESTORED = 'POSITION_FORM_RESTORED';

    // Position assignment actions
    const ACTION_ASSIGN_POSITION = 'ASSIGN_POSITION';
    const ACTION_REMOVE_POSITION = 'REMOVE_POSITION';

    // ── Scopes ────────────────────────────────────────────────────────

    public function scopePositionActions($query)
    {
        return $query->whereIn('action', [
            self::ACTION_ASSIGN_POSITION,
            self::ACTION_REMOVE_POSITION,
        ]);
    }
}