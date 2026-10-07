<?php

namespace App\Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'login'    => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'login.required'    => 'Please enter your username or email.',
            'password.required' => 'Please enter your password.',
        ];
    }

    /**
     * Determine whether the login value is an email or a username.
     */
    public function loginField(): string
    {
        return filter_var($this->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
    }
}
