<?php

namespace App\Modules\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Position extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'position_title',
        'tier',
        'item_number',
        'salary_grade',
        'gov_unit_type',
        'gov_unit_class',
        'department_agency',
        'bureau_office',
        'department_branch_division',
        'workstation',
        'present_approp_act',
        'previous_approp_act',
        'salary_authorized',
        'other_compensation',
        'immediate_supervisor_title',
        'next_higher_supervisor_title',
        'supervised_positions',
        'equipment_tools',
        'contacts_internal',
        'contacts_external',
        'working_condition_type',
        'working_condition_other',
        'working_condition_frequency',
        'unit_function_description',
        'position_function_description',
        'edu_standard',
        'experience_standard',
        'training_standard',
        'eligibility_standard',
        'core_competencies',
        'leadership_competencies',
        'duties_responsibilities',
        'status',
    ];

    protected $casts = [
        'supervised_positions'    => 'array',
        'equipment_tools'         => 'array',
        'contacts_internal'       => 'array',
        'contacts_external'       => 'array',
        'core_competencies'       => 'array',
        'leadership_competencies' => 'array',
        'duties_responsibilities' => 'array',
    ];

    // ── Tier Constants ────────────────────────────────────────────────

    const TIER_EXECUTIVE  = 'executive';
    const TIER_MANAGEMENT = 'management';
    const TIER_STAFF      = 'staff';

    const TIERS = [
        self::TIER_EXECUTIVE,
        self::TIER_MANAGEMENT,
        self::TIER_STAFF,
    ];

    // ── Relationships ─────────────────────────────────────────────────

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            \App\Modules\Auth\Models\User::class,
            'user_positions',
            'position_id',
            'user_id'
        )->using(UserPosition::class)
         ->withPivot('assigned_by', 'created_at')
         ->withTimestamps()
         ->as('assignment');
    }

    // ── Scopes ────────────────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeByTier($query, string $tier)
    {
        return $query->where('tier', $tier);
    }
}