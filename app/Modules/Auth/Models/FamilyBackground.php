<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

class FamilyBackground extends Model
{
    protected $table = 'family_backgrounds';

    protected $fillable = [
        'user_id',
        // Father
        'father_surname',
        'father_first_name',
        'father_middle_name',
        'father_suffix',
        // Mother
        'mother_surname',
        'mother_first_name',
        'mother_middle_name',
        'mother_suffix',
        // Spouse
        'spouse_surname',
        'spouse_first_name',
        'spouse_middle_name',
        'spouse_suffix',
        'spouse_birthdate',
        'spouse_occupation',
        'spouse_employer',
        'spouse_business_address',
        'spouse_telephone',
    ];

    protected function casts(): array
    {
        return [
            'spouse_birthdate' => 'date',
        ];
    }

    // ── Relationships ────────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function children()
    {
        return $this->hasMany(Child::class)->orderBy('order');
    }

    // ── Computed Attributes ──────────────────────────────────────────

    public function hasSpouse(): bool
    {
        return !empty($this->spouse_surname) || !empty($this->spouse_first_name);
    }

    public function getFatherFullNameAttribute(): string
    {
        return implode(' ', array_filter([
            $this->father_surname,
            $this->father_first_name,
            $this->father_middle_name,
            $this->father_suffix,
        ]));
    }

    public function getMotherFullNameAttribute(): string
    {
        return implode(' ', array_filter([
            $this->mother_surname,
            $this->mother_first_name,
            $this->mother_middle_name,
            $this->mother_suffix,
        ]));
    }

    public function getSpouseFullNameAttribute(): string
    {
        if (!$this->hasSpouse()) return '';

        return implode(' ', array_filter([
            $this->spouse_surname,
            $this->spouse_first_name,
            $this->spouse_middle_name,
            $this->spouse_suffix,
        ]));
    }
}
