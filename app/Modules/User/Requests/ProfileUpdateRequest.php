<?php

namespace App\Modules\User\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            // Education rules should be at the same level as 'name' and 'email'
            'educational_backgrounds.*.academic_degree' => ['nullable', 'string', 'max:20'], 
            'educational_backgrounds.*.degree_course'    => ['required', 'string', 'max:255'],
        ];
    }
}