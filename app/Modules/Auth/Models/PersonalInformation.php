<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalInformation extends Model
{
    protected $table = 'personal_information';

    protected $fillable = [
        'user_id',
        'last_name',
        'first_name',
        'middle_name',
        'suffix',
        'date_of_birth',
        'birth_place',
        'sex',
        'civil_status',
        'blood_type',
        'citizenship',
        'height_cm',
        'weight_kg',
        'mobile_no',
        'telephone_no',
        // Residential Address
        'house_block_lot_no',
        'street',
        'subdivision_village',
        'barangay',
        'city_municipality',
        'province',
        'region',
        'zip_code',
        // Permanent Address
        'perm_house_block_lot_no',
        'perm_street',
        'perm_subdivision_village',
        'perm_barangay',
        'perm_city',
        'perm_province',
        'perm_region',
        'perm_zip_code',
        // Government-issued IDs
        'umid_no',
        'pagibig_no',
        'philhealth_no',
        'philsys_no',
        'tin_no',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
