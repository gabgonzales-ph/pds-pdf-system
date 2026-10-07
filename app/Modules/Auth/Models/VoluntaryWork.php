<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

class VoluntaryWork extends Model
{
    protected $table = 'voluntary_works';

    protected $fillable = [
        'user_id',
        'org_name_address',
        'date_from',
        'date_to',
        'hours',
        'position',
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
