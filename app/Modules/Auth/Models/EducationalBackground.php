<?php

namespace App\Modules\Auth\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EducationalBackground extends Model
{
    protected $table = 'educational_backgrounds';

    protected $fillable = [
        'user_id',
        'level',
        'school_name',
        'academic_degree',
        'degree_course',
        'attendance_from',
        'attendance_to',
        'highest_level',
        'year_graduated',
        'honors_received',
    ];

    /**
     * Explicitly cast date-related columns as strings to prevent
     * Eloquent from applying implicit year/date casting after
     * the migration from year() to string columns.
     */
    protected $casts = [
        'attendance_from' => 'string',
        'attendance_to'   => 'string',
        'year_graduated'  => 'string',
    ];

    /**
     * Get the user that owns the educational background.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
