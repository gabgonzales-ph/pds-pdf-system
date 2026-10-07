<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

class PdsFinalForm extends Model
{
    protected $table = 'pds_final_forms';

    protected $fillable = [
        'user_id',

        // Q34
        'q34a', 'q34b', 'q34_details',

        // Q35 — q35b has two extra fields
        'q35a', 'q35a_details',
        'q35b', 'q35b_details', 'q35b_date_filed', 'q35b_status',

        // Q36–Q37
        'q36', 'q36_details',
        'q37', 'q37_details',

        // Q38–Q39
        'q38a', 'q38a_details',
        'q38b', 'q38b_details',
        'q39',  'q39_details',

        // Q40
        'q40a', 'q40a_details',
        'q40b', 'q40b_details',
        'q40c', 'q40c_details',

        // Q41 References
        'ref1_name', 'ref1_address', 'ref1_contact',
        'ref2_name', 'ref2_address', 'ref2_contact',
        'ref3_name', 'ref3_address', 'ref3_contact',

        // Government Issued ID
        'gov_id_type',
        'gov_id_number',
        'gov_id_date_issued',
        'gov_id_place_issued',
    ];

    protected $casts = [
        'q34a' => 'boolean', 'q34b' => 'boolean',
        'q35a' => 'boolean', 'q35b' => 'boolean',
        'q36'  => 'boolean',
        'q37'  => 'boolean',
        'q38a' => 'boolean', 'q38b' => 'boolean',
        'q39'  => 'boolean',
        'q40a' => 'boolean', 'q40b' => 'boolean', 'q40c' => 'boolean',
        'q35b_date_filed'  => 'date',
        'gov_id_date_issued' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
