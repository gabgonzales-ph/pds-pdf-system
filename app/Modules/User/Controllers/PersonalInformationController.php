<?php

namespace App\Modules\User\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class PersonalInformationController
{
    /**
     * Update optional fields on the authenticated user's personal information.
     * PATCH /user/personal-information
     */
    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        // 1. Validate incoming data, including the user's email and strict mobile rules
        $data = $request->validate([
            // User Account Field
            'email'                    => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],

            // Identity & Status
            'middle_name'              => ['sometimes', 'nullable', 'string', 'max:255'],
            'suffix'                   => ['sometimes', 'nullable', 'string', 'max:10'],
            'civil_status'             => ['sometimes', 'nullable', 'in:Single,Married,Widowed,Separated,Other/s'],
            
            // Residential Address
            'house_block_lot_no'       => ['sometimes', 'nullable', 'string', 'max:255'],
            'street'                   => ['sometimes', 'nullable', 'string', 'max:255'],
            'subdivision_village'      => ['sometimes', 'nullable', 'string', 'max:255'],
            'region'                   => ['sometimes', 'required', 'string', 'max:255'],
            'province'                 => ['sometimes', 'required', 'string', 'max:255'],
            'city_municipality'        => ['sometimes', 'required', 'string', 'max:255'],
            'barangay'                 => ['sometimes', 'required', 'string', 'max:255'],
            'zip_code'                 => ['sometimes', 'nullable', 'string', 'max:10'],
            
            // Permanent Address
            'perm_house_block_lot_no'  => ['sometimes', 'nullable', 'string', 'max:255'],
            'perm_street'              => ['sometimes', 'nullable', 'string', 'max:255'],
            'perm_subdivision_village' => ['sometimes', 'nullable', 'string', 'max:255'],
            'perm_region'              => ['sometimes', 'required', 'string', 'max:255'],
            'perm_province'            => ['sometimes', 'required', 'string', 'max:255'],
            'perm_city'                => ['sometimes', 'required', 'string', 'max:255'],
            'perm_barangay'            => ['sometimes', 'required', 'string', 'max:255'],
            'perm_zip_code'            => ['sometimes', 'nullable', 'string', 'max:10'],
            
            // Physical & Contact
            'height_cm'                => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'weight_kg'                => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'telephone_no'             => ['sometimes', 'nullable', 'string', 'max:50'],
            'mobile_no'                => ['sometimes', 'required', 'string', 'size:11'],
            
            // Government IDs
            'umid_no'                  => ['sometimes', 'nullable', 'string', 'max:50'],
            'pagibig_no'               => ['sometimes', 'nullable', 'string', 'max:50'],
            'philhealth_no'            => ['sometimes', 'nullable', 'string', 'max:50'],
            'philsys_no'               => ['sometimes', 'nullable', 'string', 'max:50'],
            'tin_no'                   => ['sometimes', 'nullable', 'string', 'max:50'],
        ]);

        // 2. Update User Email if present in the request
        if (array_key_exists('email', $data)) {
            $user->update(['email' => $data['email']]);
            unset($data['email']); // Remove from array so it doesn't pass to PersonalInformation
        }

        // 3. Update Personal Information fields
        if (!empty($data)) {
            $user->personalInformation()->update($data);

            // Cascade delete/nullify family info if status changes to Single
            if (isset($data['civil_status']) && $data['civil_status'] === 'Single') {
                $user->familyBackground->children()->delete();

                $user->familyBackground()->update([
                    'spouse_surname'          => null,
                    'spouse_first_name'       => null,
                    'spouse_middle_name'      => null,
                    'spouse_suffix'           => null,
                    'spouse_birthdate'        => null,
                    'spouse_occupation'       => null,
                    'spouse_employer'         => null,
                    'spouse_business_address' => null,
                    'spouse_telephone'        => null,
                ]);
            }
        }

        return back();
    }
}