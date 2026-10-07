<?php

namespace App\Modules\User\Controllers;

use App\Modules\Auth\Models\LearningDevelopment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class LearningDevelopmentController
{
    /** POST /user/learning-development */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'        => ['nullable', 'string', 'max:255'],
            'date_from'    => ['nullable', 'date'],
            'date_to'      => ['nullable', 'date', 'after_or_equal:date_from'],
            'hours'        => ['nullable', 'integer', 'min:0'],
            'ld_type'      => ['nullable', Rule::in(['MANAGERIAL', 'SUPERVISORY', 'TECHNICAL', 'FOUNDATION'])],
            'conducted_by' => ['nullable', 'string', 'max:255'],
        ]);

        $count = Auth::user()->learningDevelopments()->count();

        Auth::user()->learningDevelopments()->create(array_merge(
            $data,
            ['order' => $count]
        ));

        return back();
    }

    /** PATCH /user/learning-development/{learningDevelopment} */
    public function update(Request $request, LearningDevelopment $learningDevelopment): RedirectResponse
    {
        abort_unless($learningDevelopment->user_id === Auth::id(), 403);

        $data = $request->validate([
            'title'        => ['nullable', 'string', 'max:255'],
            'date_from'    => ['nullable', 'date'],
            'date_to'      => ['nullable', 'date', 'after_or_equal:date_from'],
            'hours'        => ['nullable', 'integer', 'min:0'],
            'ld_type'      => ['nullable', Rule::in(['MANAGERIAL', 'SUPERVISORY', 'TECHNICAL', 'FOUNDATION'])],
            'conducted_by' => ['nullable', 'string', 'max:255'],
        ]);

        $learningDevelopment->update($data);

        return back();
    }

    /** DELETE /user/learning-development/{learningDevelopment} */
    public function destroy(LearningDevelopment $learningDevelopment): RedirectResponse
    {
        abort_unless($learningDevelopment->user_id === Auth::id(), 403);

        $learningDevelopment->delete();

        return back();
    }
}
