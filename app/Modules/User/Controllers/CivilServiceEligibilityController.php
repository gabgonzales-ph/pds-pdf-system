<?php

namespace App\Modules\User\Controllers;

use App\Modules\Auth\Models\CivilServiceEligibility;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CivilServiceEligibilityController
{
    /** POST /user/civil-service */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'career_service'      => ['nullable', 'string', 'max:255'],
            'rating'              => ['nullable', 'string', 'max:50'],
            'date_of_examination' => ['nullable', 'date'],
            'place_of_examination'=> ['nullable', 'string', 'max:255'],
            'license_number'      => ['nullable', 'string', 'max:100'],
            'license_validity'    => ['nullable', 'date'],
        ]);

        $count = Auth::user()->civilServiceEligibilities()->count();

        Auth::user()->civilServiceEligibilities()->create(array_merge(
            $data,
            ['order' => $count]
        ));

        return back();
    }

    /** PATCH /user/civil-service/{eligibility} */
    public function update(Request $request, CivilServiceEligibility $eligibility): RedirectResponse
    {
        abort_unless($eligibility->user_id === Auth::id(), 403);

        $data = $request->validate([
            'career_service'      => ['nullable', 'string', 'max:255'],
            'rating'              => ['nullable', 'string', 'max:50'],
            'date_of_examination' => ['nullable', 'date'],
            'place_of_examination'=> ['nullable', 'string', 'max:255'],
            'license_number'      => ['nullable', 'string', 'max:100'],
            'license_validity'    => ['nullable', 'date'],
        ]);

        $eligibility->update($data);

        return back();
    }

    /** DELETE /user/civil-service/{eligibility} */
    public function destroy(CivilServiceEligibility $eligibility): RedirectResponse
    {
        abort_unless($eligibility->user_id === Auth::id(), 403);

        $eligibility->delete();

        return back();
    }
}
