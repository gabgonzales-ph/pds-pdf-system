<?php

namespace App\Modules\User\Controllers;

use App\Modules\Auth\Models\PdsFinalForm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PdsFinalFormController
{
    /**
     * Create or update the user's final form (questions 34–41).
     * PATCH /user/final-form
     */
    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            // Q34
            'q34_details'      => ['nullable', 'string', 'max:1000'],

            // Q35
            'q35a_details'     => ['nullable', 'string', 'max:1000'],
            'q35b_date_filed'  => ['nullable', 'date'],
            'q35b_status'      => ['nullable', 'string', 'max:255'],

            // Q36–Q37
            'q36_details'      => ['nullable', 'string', 'max:1000'],
            'q37_details'      => ['nullable', 'string', 'max:1000'],

            // Q38–Q39
            'q38a_details'     => ['nullable', 'string', 'max:1000'],
            'q38b_details'     => ['nullable', 'string', 'max:1000'],
            'q39_details'      => ['nullable', 'string', 'max:500'],

            // Q40
            'q40a_details'     => ['nullable', 'string', 'max:500'],
            'q40b_details'     => ['nullable', 'string', 'max:255'],
            'q40c_details'     => ['nullable', 'string', 'max:255'],

            // Q41 References
            'ref1_name'        => ['nullable', 'string', 'max:255'],
            'ref1_address'     => ['nullable', 'string', 'max:500'],
            'ref1_contact'     => ['nullable', 'string', 'max:255'],
            'ref2_name'        => ['nullable', 'string', 'max:255'],
            'ref2_address'     => ['nullable', 'string', 'max:500'],
            'ref2_contact'     => ['nullable', 'string', 'max:255'],
            'ref3_name'        => ['nullable', 'string', 'max:255'],
            'ref3_address'     => ['nullable', 'string', 'max:500'],
            'ref3_contact'     => ['nullable', 'string', 'max:255'],

            // Government Issued ID
            'gov_id_type'         => ['nullable', 'string', 'max:255'],
            'gov_id_number'       => ['nullable', 'string', 'max:255'],
            'gov_id_date_issued'  => ['nullable', 'date'],
            'gov_id_place_issued' => ['nullable', 'string', 'max:500'],
        ]);

        // Explicitly set all boolean fields.
        // If an HTML checkbox is unchecked, it isn't sent in the request.
        // $request->boolean() safely defaults missing keys to false.
        $booleans = [
            'q34a', 'q34b', 'q35a', 'q35b', 'q36', 'q37', 
            'q38a', 'q38b', 'q39', 'q40a', 'q40b', 'q40c'
        ];
        
        foreach ($booleans as $field) {
            $data[$field] = $request->boolean($field);
        }

        // Clean up detail fields if the corresponding question is NO (false)
        if (!$data['q34a'] && !$data['q34b']) {
            $data['q34_details'] = null;
        }
        if (!$data['q35a']) {
            $data['q35a_details'] = null;
        }
        if (!$data['q35b']) {
            $data['q35b_date_filed'] = null;
            $data['q35b_status'] = null;
        }
        if (!$data['q36']) {
            $data['q36_details'] = null;
        }
        if (!$data['q37']) {
            $data['q37_details'] = null;
        }
        if (!$data['q38a']) {
            $data['q38a_details'] = null;
        }
        if (!$data['q38b']) {
            $data['q38b_details'] = null;
        }
        if (!$data['q39']) {
            $data['q39_details'] = null;
        }
        if (!$data['q40a']) {
            $data['q40a_details'] = null;
        }
        if (!$data['q40b']) {
            $data['q40b_details'] = null;
        }
        if (!$data['q40c']) {
            $data['q40c_details'] = null;
        }

        PdsFinalForm::updateOrCreate(
            ['user_id' => Auth::id()],
            $data
        );

        return back();
    }
}