<?php

namespace App\Modules\User\Controllers;

use App\Modules\User\Services\ProgressCalculator;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserDashboardController
{
    public function index(): Response
    {
        $user = Auth::user()->load([
            'personalInformation',
            'familyBackground.children',
            'educationalBackgrounds',
            'department',
            'careerService',
            'civilServiceEligibilities',
            'workExperiences',
            'voluntaryWorks',
            'learningDevelopments',
            'otherInformation',
            'pdsFinalForm',
            'positions',
        ]);

        // Compute the most recent update across all PDS-related records
        $lastModified = collect([
            optional($user->personalInformation)->updated_at,
            optional($user->familyBackground)->updated_at,
            optional($user->otherInformation)->updated_at,
            optional($user->pdsFinalForm)->updated_at,
        ])
            ->merge($user->educationalBackgrounds->pluck('updated_at'))
            ->merge($user->civilServiceEligibilities->pluck('updated_at'))
            ->merge($user->workExperiences->pluck('updated_at'))
            ->merge($user->voluntaryWorks->pluck('updated_at'))
            ->merge($user->learningDevelopments->pluck('updated_at'))
            ->filter()
            ->sortDesc()
            ->first() ?? $user->created_at;

        return Inertia::render('User/Pages/Dashboard', [
            // ── Page 1 ───────────────────────────────────────────────
            'personalInformation'    => $user->personalInformation,
            'familyBackground'       => $user->familyBackground,
            'children'               => $user->familyBackground?->children ?? [],
            'educationalBackgrounds' => $user->educationalBackgrounds,

            // ── Pages 2–4 ────────────────────────────────────────────
            'civilServiceEligibilities' => $user->civilServiceEligibilities,
            'workExperiences'           => $user->workExperiences,
            'voluntaryWorks'            => $user->voluntaryWorks,
            'learningDevelopments'      => $user->learningDevelopments,
            'otherInformation'          => $user->otherInformation,
            'pdsFinalForm'              => $user->pdsFinalForm,

            // ── Progress ─────────────────────────────────────────────
            'progress' => ProgressCalculator::calculate($user),

            // ── Top Card Meta ─────────────────────────────────────────
            'userCreatedAt' => $user->created_at,
            'lastModified'  => $lastModified,

            // ── Positions ────────────────────────────────────────────
            'positions' => $user->positions->map(fn($p) => [
                'id'             => $p->id,
                'position_title' => $p->position_title,
                'tier'           => $p->tier,
                'item_number'    => $p->item_number,
                'assigned_at'    => $p->assignment->created_at?->toISOString(),
            ])->values(),
        ]);
    }
}