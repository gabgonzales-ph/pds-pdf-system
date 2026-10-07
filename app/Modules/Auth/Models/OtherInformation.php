<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

class OtherInformation extends Model
{
    protected $table = 'other_information';

    protected $fillable = [
        'user_id',
        'special_skills',
        'non_academic_distinctions',
        'organization_memberships',
    ];

    protected $casts = [
        'special_skills'            => 'array',
        'non_academic_distinctions' => 'array',
        'organization_memberships'  => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
