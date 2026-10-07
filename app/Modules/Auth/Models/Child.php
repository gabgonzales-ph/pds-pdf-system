<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    protected $table = 'children';

    protected $fillable = [
        'family_background_id',
        'name',
        'date_of_birth',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    public function familyBackground()
    {
        return $this->belongsTo(FamilyBackground::class);
    }
}
