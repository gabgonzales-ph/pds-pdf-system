<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

class WorkExperience extends Model
{
    protected $table = 'work_experiences';

    protected $fillable = [
        'user_id',
        'date_from',
        'date_to',
        'position_title',
        'department_agency',
        'status_of_appointment',
        'is_government_service',  // stored as 'Y' | 'N' | null
        'order',
    ];

    protected $casts = [
        'date_from' => 'date',
        'date_to'   => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
