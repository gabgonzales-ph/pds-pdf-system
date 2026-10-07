<?php

namespace App\Modules\User\Controllers;

use App\Modules\Auth\Models\VoluntaryWork;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoluntaryWorkController
{
    /** POST /user/voluntary-work */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'org_name_address' => ['required', 'string', 'max:1000'],
            'date_from'        => ['nullable', 'date'],
            'date_to'          => ['nullable', 'date'],
            'hours'            => ['nullable', 'integer', 'min:0'],
            'position'         => ['nullable', 'string', 'max:255'],
        ]);

        $count = Auth::user()->voluntaryWorks()->count();

        Auth::user()->voluntaryWorks()->create(array_merge(
            $data,
            ['order' => $count]
        ));

        return back();
    }

    /** PATCH /user/voluntary-work/{voluntaryWork} */
    public function update(Request $request, VoluntaryWork $voluntaryWork): RedirectResponse
    {
        abort_unless($voluntaryWork->user_id === Auth::id(), 403);

        $data = $request->validate([
            'org_name_address' => ['required', 'string', 'max:1000'],
            'date_from'        => ['nullable', 'date'],
            'date_to'          => ['nullable', 'date'],
            'hours'            => ['nullable', 'integer', 'min:0'],
            'position'         => ['nullable', 'string', 'max:255'],
        ]);

        $voluntaryWork->update($data);

        return back();
    }

    /** DELETE /user/voluntary-work/{voluntaryWork} */
    public function destroy(VoluntaryWork $voluntaryWork): RedirectResponse
    {
        abort_unless($voluntaryWork->user_id === Auth::id(), 403);

        $voluntaryWork->delete();

        return back();
    }
}
