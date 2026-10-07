<?php

namespace App\Modules\Auth\Controllers;


use App\Modules\Auth\Models\Department;
use App\Modules\Auth\Models\CareerService;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticationController
{
    /**
     * Show the authentication landing page (Login + Registration).
     *
     * Passes departments and career services as Inertia props
     * so the Registration dropdowns are populated from the database.
     */
    public function index(): Response
    {
        return Inertia::render('Auth/Pages/AuthenticationPage', [
            'departments'    => Department::orderBy('name')->get(['id', 'name']),
            'careerServices' => CareerService::orderBy('name')->get(['id', 'name']),
        ]);
    }
}
