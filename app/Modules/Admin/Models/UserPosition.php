<?php

namespace App\Modules\Admin\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\Auth\Models\User;

class UserPosition extends Pivot
{
    protected $table = 'user_positions';

    // Only created_at — no updated_at on a pivot
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'position_id',
        'assigned_by',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    // ── Relationships ─────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'position_id');
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}