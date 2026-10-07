<?php

namespace App\Modules\User\Controllers;

use App\Modules\Auth\Models\OtherInformation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OtherInformationController
{
    /**
     * Create or update the user's other information record.
     * PATCH /user/other-information
     */
    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'special_skills'            => ['nullable', 'array'],
            'special_skills.*'          => ['string', 'max:255'],
            'non_academic_distinctions' => ['nullable', 'array'],
            'non_academic_distinctions.*' => ['string', 'max:255'],
            'organization_memberships'  => ['nullable', 'array'],
            'organization_memberships.*'=> ['string', 'max:255'],
        ]);

        OtherInformation::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'special_skills'            => $data['special_skills']            ?? [],
                'non_academic_distinctions' => $data['non_academic_distinctions'] ?? [],
                'organization_memberships'  => $data['organization_memberships']  ?? [],
            ]
        );

        return back();
    }
}
