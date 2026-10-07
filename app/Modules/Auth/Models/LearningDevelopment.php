<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

class LearningDevelopment extends Model
{
    protected $table = 'learning_developments';

    protected $fillable = [
        'user_id',
        'title',
        'date_from',
        'date_to',
        'hours',
        'ld_type',
        'conducted_by',
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
