<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

class CivilServiceEligibility extends Model
{
    protected $table = 'civil_service_eligibilities';

    protected $fillable = [
        'user_id',
        'career_service',
        'rating',
        'date_of_examination',
        'place_of_examination',
        'license_number',
        'license_validity',
        'order',
    ];

    protected $casts = [
        'date_of_examination' => 'date',
        'license_validity'    => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
