<?php

namespace App\Modules\User\Controllers;

use App\Modules\Auth\Models\Child;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FamilyBackgroundController
{
    /**
     * Update spouse fields.
     * PATCH /user/family-background/spouse
     */
    public function updateSpouse(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'spouse_surname'          => ['nullable', 'string', 'max:100'],
            'spouse_first_name'       => ['nullable', 'string', 'max:100'],
            'spouse_middle_name'      => ['nullable', 'string', 'max:100'],
            'spouse_suffix'           => ['nullable', 'string', 'max:20'],
            'spouse_birthdate'        => ['nullable', 'date', 'before:today'],
            'spouse_occupation'       => ['nullable', 'string', 'max:255'],
            'spouse_employer'         => ['nullable', 'string', 'max:255'],
            'spouse_business_address' => ['nullable', 'string', 'max:255'],
            'spouse_telephone'        => ['nullable', 'string', 'max:20'],
        ]);

        Auth::user()->familyBackground()->update($data);

        return back();
    }

    /**
     * Add a child.
     * POST /user/family-background/children
     */
    public function addChild(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
        ]);

        $familyBackground = Auth::user()->familyBackground;
        $order = $familyBackground->children()->count();

        $familyBackground->children()->create([
            'name'          => $data['name'],
            'date_of_birth' => $data['date_of_birth'] ?? null,
            'order'         => $order,
        ]);

        return back();
    }

    /**
     * Update a child.
     * PATCH /user/family-background/children/{child}
     */
    public function updateChild(Request $request, Child $child): RedirectResponse
    {
        // Ensure the child belongs to the authenticated user
        abort_unless($child->familyBackground->user_id === Auth::id(), 403);

        $data = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
        ]);

        $child->update($data);

        return back();
    }

    /**
     * Delete a child.
     * DELETE /user/family-background/children/{child}
     */
    public function deleteChild(Child $child): RedirectResponse
    {
        abort_unless($child->familyBackground->user_id === Auth::id(), 403);

        $child->delete();

        return back();
    }
}
