<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id'          => $request->user()->id,
                    'name'        => $request->user()->personalInformation
                                        ? trim($request->user()->personalInformation->first_name . ' ' . $request->user()->personalInformation->last_name)
                                        : $request->user()->username,
                    'username'    => $request->user()->username,
                    'email'       => $request->user()->email,
                    'employee_id' => $request->user()->employee_id,
                    'role'        => $request->user()->role,
                    'department'     => $request->user()->department,
                    'career_service' => $request->user()->careerService,
                ] : null,
            ],
        ];
    }
}