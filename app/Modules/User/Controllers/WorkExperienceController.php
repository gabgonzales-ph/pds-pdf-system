<?php

namespace App\Modules\User\Controllers;

use App\Modules\Auth\Models\WorkExperience;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkExperienceController
{
    /** POST /user/work-experience */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'date_from'              => ['nullable', 'date'],
            'date_to'                => ['nullable', 'date'],
            'position_title'         => ['required', 'string', 'max:255'],
            'department_agency'      => ['nullable', 'string', 'max:255'],
            'status_of_appointment'  => ['nullable', 'string', 'max:100'],
            'is_government_service'  => ['nullable', 'string', 'in:Y,N'],
        ]);

        $count = Auth::user()->workExperiences()->count();

        Auth::user()->workExperiences()->create(array_merge(
            $data,
            ['order' => $count]
        ));

        return back();
    }

    /** PATCH /user/work-experience/{workExperience} */
    public function update(Request $request, WorkExperience $workExperience): RedirectResponse
    {
        abort_unless($workExperience->user_id === Auth::id(), 403);

        $data = $request->validate([
            'date_from'              => ['nullable', 'date'],
            'date_to'                => ['nullable', 'date'],
            'position_title'         => ['required', 'string', 'max:255'],
            'department_agency'      => ['nullable', 'string', 'max:255'],
            'status_of_appointment'  => ['nullable', 'string', 'max:100'],
            'is_government_service'  => ['nullable', 'string', 'in:Y,N'],
        ]);

        $workExperience->update($data);

        return back();
    }

    /** DELETE /user/work-experience/{workExperience} */
    public function destroy(WorkExperience $workExperience): RedirectResponse
    {
        abort_unless($workExperience->user_id === Auth::id(), 403);

        $workExperience->delete();

        return back();
    }
}
