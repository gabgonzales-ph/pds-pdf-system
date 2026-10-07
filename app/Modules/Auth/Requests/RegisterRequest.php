<?php

namespace App\Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // ── Step 1: Account ──────────────────────────────────────
            'username'          => ['required', 'string', 'max:50', 'unique:users,username', 'alpha_dash'],
            'email'             => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'          => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'employee_id'       => ['required', 'digits_between:1,20', 'unique:users,employee_id'],
            'department_id'     => ['required', 'exists:departments,id'],
            'career_service_id' => ['required', 'exists:career_services,id'],

            // ── Step 2: Personal Information ─────────────────────────
            'last_name'         => ['required', 'string', 'max:100'],
            'first_name'        => ['required', 'string', 'max:100'],
            'middle_name'       => ['nullable', 'string', 'max:100'],
            'suffix'            => ['nullable', 'string', 'max:20'],
            'date_of_birth'     => ['required', 'date', 'before:today'],
            'birth_place'       => ['required', 'string', 'max:255'],
            'sex'               => ['required', 'in:Male,Female'],
            'civil_status'      => ['required', 'in:Single,Married,Widowed,Separated,Other/s'],
            'blood_type'        => ['required', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'citizenship'       => ['required', 'in:Filipino,Dual Citizen'],
            'citizenship_by'      => ['nullable', 'required_if:citizenship,Dual Citizen', 'in:By birth,By naturalization'],
            'citizenship_country' => ['nullable', 'required_if:citizenship,Dual Citizen', 'string', 'max:100'],
            'height_cm'         => ['nullable', 'numeric', 'min:0', 'max:300'],
            'weight_kg'         => ['nullable', 'numeric', 'min:0', 'max:500'],
            'mobile_no'         => ['required', 'digits:11'],
            'telephone_no'      => ['nullable', 'string', 'max:20'],
            // Residential Address
            'house_block_lot_no'   => ['nullable', 'string', 'max:100'],
            'street'               => ['nullable', 'string', 'max:100'],
            'subdivision_village'  => ['nullable', 'string', 'max:100'],
            'barangay'             => ['required', 'string', 'max:100'],
            'city_municipality'    => ['required', 'string', 'max:100'],
            'province'             => ['required', 'string', 'max:100'],
            'region'               => ['required', 'string', 'max:100'],
            'zip_code'             => ['nullable', 'digits:4'],
            // Permanent Address
            'perm_house_block_lot_no'  => ['nullable', 'string', 'max:100'],
            'perm_street'              => ['nullable', 'string', 'max:100'],
            'perm_subdivision_village' => ['nullable', 'string', 'max:100'],
            'perm_barangay'            => ['required', 'string', 'max:100'],
            'perm_city'                => ['required', 'string', 'max:100'],
            'perm_province'            => ['required', 'string', 'max:100'],
            'perm_region'              => ['required', 'string', 'max:100'],
            'perm_zip_code'            => ['nullable', 'digits:4'],

            // ── Step 3: Family Background ────────────────────────────
            'father_surname'     => ['required', 'string', 'max:100'],
            'father_first_name'  => ['required', 'string', 'max:100'],
            'father_middle_name' => ['nullable', 'string', 'max:100'],
            'father_suffix'      => ['nullable', 'string', 'max:20'],
            'mother_surname'     => ['required', 'string', 'max:100'],
            'mother_first_name'  => ['required', 'string', 'max:100'],
            'mother_middle_name' => ['nullable', 'string', 'max:100'],
            'mother_suffix'      => ['nullable', 'string', 'max:20'],
            // Spouse (optional — but if any field filled, all required)
            'spouse_surname'     => ['nullable', 'string', 'max:100', 'required_with:spouse_first_name'],
            'spouse_first_name'  => ['nullable', 'string', 'max:100', 'required_with:spouse_surname'],
            'spouse_middle_name' => ['nullable', 'string', 'max:100',],
            'spouse_suffix'      => ['nullable', 'string', 'max:20'],
            'spouse_birthdate'   => ['nullable', 'date', 'before:today', 'required_with:spouse_surname'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.unique'            => 'This username is already taken.',
            'username.alpha_dash'        => 'Username may only contain letters, numbers, dashes, and underscores.',
            'email.unique'               => 'This email is already registered.',
            'password.confirmed'         => 'Passwords do not match.',
            'employee_id.unique'         => 'This Employee ID is already registered.',
            'employee_id.digits_between' => 'Employee ID must be numeric.',
            'date_of_birth.before'       => 'Date of birth must be in the past.',
            'mobile_no.digits'           => 'Mobile number must be exactly 11 digits.',
            'mobile_no.starts_with'      => 'Mobile number must start with 09.',
            'citizenship_by.required_if' => 'Please specify By birth or By naturalization.',
            'citizenship_country.required_if' => 'Please indicate your country of other citizenship.',
            'zip_code.digits'            => 'Zip code must be exactly 4 digits.',
            'perm_zip_code.digits'       => 'Permanent zip code must be exactly 4 digits.',
            'spouse_birthdate.before'    => "Spouse's birthdate must be in the past.",
        ];
    }
}
