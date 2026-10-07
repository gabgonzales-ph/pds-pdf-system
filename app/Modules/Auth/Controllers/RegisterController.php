<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Admin\Models\ActivityLog;
use App\Modules\Auth\Models\FamilyBackground;
use App\Modules\Auth\Models\PersonalInformation;
use App\Modules\Auth\Models\User;
use App\Modules\Auth\Requests\RegisterRequest;
use App\Services\ActivityLog\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController
{
    /**
     * Check if a username is already taken.
     */
    public function validateUsername(Request $request)
    {
        $request->validate(['username' => 'required|string|min:3']);

        $taken = User::where('username', $request->username)->exists();
        
        return response()->json([
            'taken' => $taken
        ]);
    }

    /**
     * Check if an email is already taken.
     */
    public function validateEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $taken = User::where('email', $request->email)->exists();
        
        return response()->json([
            'taken' => $taken
        ]);
    }

    /**
     * Handle final registration — all steps submitted at once.
     * POST /register
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        // ── Create User ──────────────────────────────────────────────
        $user = User::create([
            'username'          => $request->username,
            'email'             => $request->email,
            'password'          => Hash::make($request->password),
            'employee_id'       => $request->employee_id,
            'department_id'     => $request->department_id,
            'career_service_id' => $request->career_service_id,
            'role'              => 'user',
        ]);

        // ── Save Personal Information ────────────────────────────────
        PersonalInformation::create([
            'user_id'           => $user->id,
            'last_name'         => $request->last_name,
            'first_name'        => $request->first_name,
            'middle_name'       => $request->middle_name,
            'suffix'            => $request->suffix,
            'date_of_birth'     => $request->date_of_birth,
            'birth_place'       => $request->birth_place,
            'sex'               => $request->sex,
            'civil_status'      => $request->civil_status,
            'blood_type'        => $request->blood_type,
            'citizenship'       => $request->citizenship === 'Dual Citizen'
                                    ? 'Dual Citizen - ' . $request->citizenship_by . ' (' . $request->citizenship_country . ')'
                                    : $request->citizenship,
            'height_cm'         => $request->height_cm ?: null,
            'weight_kg'         => $request->weight_kg ?: null,
            'mobile_no'         => $request->mobile_no,
            'telephone_no'      => $request->telephone_no,
            // Residential Address
            'house_block_lot_no'  => $request->house_block_lot_no,
            'street'              => $request->street,
            'subdivision_village' => $request->subdivision_village,
            'barangay'            => $request->barangay,
            'city_municipality'   => $request->city_municipality,
            'province'            => $request->province,
            'region'              => $request->region,
            'zip_code'            => $request->zip_code,
            // Permanent Address
            'perm_house_block_lot_no'  => $request->perm_house_block_lot_no,
            'perm_street'              => $request->perm_street,
            'perm_subdivision_village' => $request->perm_subdivision_village,
            'perm_barangay'            => $request->perm_barangay,
            'perm_city'                => $request->perm_city,
            'perm_province'            => $request->perm_province,
            'perm_region'              => $request->perm_region,
            'perm_zip_code'            => $request->perm_zip_code,
        ]);

        // ── Save Family Background ───────────────────────────────────
        FamilyBackground::create([
            'user_id'            => $user->id,
            'father_surname'     => $request->father_surname,
            'father_first_name'  => $request->father_first_name,
            'father_middle_name' => $request->father_middle_name,
            'father_suffix'      => $request->father_suffix,
            'mother_surname'     => $request->mother_surname,
            'mother_first_name'  => $request->mother_first_name,
            'mother_middle_name' => $request->mother_middle_name,
            'mother_suffix'      => $request->mother_suffix,
            'spouse_surname'     => $request->spouse_surname,
            'spouse_first_name'  => $request->spouse_first_name,
            'spouse_middle_name' => $request->spouse_middle_name,
            'spouse_suffix'      => $request->spouse_suffix,
            'spouse_birthdate'   => $request->spouse_birthdate ?: null,
        ]);

        // ── Log registration ─────────────────────────────────────────
        ActivityLogService::log(
            action: ActivityLog::ACTION_USER_REGISTERED,
            actorId: $user->id,
            actorType: 'user',
            entityType: 'User',
            entityId: $user->id,
            request: $request,
        );

        // ── Log in the new user ──────────────────────────────────────
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('user.dashboard');
    }
}