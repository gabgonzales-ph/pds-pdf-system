<?php

namespace App\Modules\Admin\Controllers;

use App\Modules\Admin\Models\ActivityLog;
use App\Modules\Admin\Models\Position;
use App\Services\ActivityLog\ActivityLogService;
use App\Services\Position\PositionFillerService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PositionController
{
    // ── Validation rules ──────────────────────────────────────────────

    private function rules(bool $publishing): array
    {
        $req = $publishing ? 'required' : 'nullable';

        return [
            'position_title'               => [$req, 'string', 'max:255'],
            'tier'                         => [$req, Rule::in(Position::TIERS)],
            'item_number'                  => [$req, 'string', 'max:100'],
            'salary_grade'                 => [$req, 'string', 'max:50'],
            'gov_unit_type'                => [$req, Rule::in(['Province', 'City', 'Municipality'])],
            'gov_unit_class'               => [$req, Rule::in(['1st Class', '2nd Class', '3rd Class', '4th Class', '5th Class', '6th Class', 'Special'])],
            'department_agency'            => [$req, 'string', 'max:255'],
            'bureau_office'                => [$req, 'string', 'max:255'],
            'department_branch_division'   => [$req, 'string', 'max:255'],
            'workstation'                  => [$req, 'string', 'max:255'],
            'present_approp_act'           => [$req, 'string', 'max:255'],
            'previous_approp_act'          => [$req, 'string', 'max:255'],
            'salary_authorized'            => [$req, 'string', 'max:100'],
            'other_compensation'           => [$req, 'string', 'max:100'],
            'immediate_supervisor_title'   => [$req, 'string', 'max:255'],
            'next_higher_supervisor_title' => [$req, 'string', 'max:255'],

            // Dynamic rows
            'supervised_positions'                       => [$req, 'array', 'min:1'],
            'supervised_positions.*.position_title'      => [$req, 'string', 'max:255'],
            'supervised_positions.*.item_number'         => [$req, 'string', 'max:100'],

            'equipment_tools'   => [$req, 'array', 'min:1'],
            'equipment_tools.*' => [$req, 'string', 'max:255'],

            // Contacts — internal
            'contacts_internal'                                  => [$req, 'array'],
            'contacts_internal.executive_managerial.occasional'  => ['nullable', 'boolean'],
            'contacts_internal.executive_managerial.frequent'    => ['nullable', 'boolean'],
            'contacts_internal.supervisors.occasional'           => ['nullable', 'boolean'],
            'contacts_internal.supervisors.frequent'             => ['nullable', 'boolean'],
            'contacts_internal.non_supervisors.occasional'       => ['nullable', 'boolean'],
            'contacts_internal.non_supervisors.frequent'         => ['nullable', 'boolean'],
            'contacts_internal.staff.occasional'                 => ['nullable', 'boolean'],
            'contacts_internal.staff.frequent'                   => ['nullable', 'boolean'],

            // Contacts — external
            'contacts_external'                           => [$req, 'array'],
            'contacts_external.general_public.occasional' => ['nullable', 'boolean'],
            'contacts_external.general_public.frequent'   => ['nullable', 'boolean'],
            'contacts_external.other_agencies.occasional' => ['nullable', 'boolean'],
            'contacts_external.other_agencies.frequent'   => ['nullable', 'boolean'],
            'contacts_external.others.text'               => ['nullable', 'string', 'max:255'],
            'contacts_external.others.occasional'         => ['nullable', 'boolean'],
            'contacts_external.others.frequent'           => ['nullable', 'boolean'],

            // Working condition
            'working_condition_type'      => [$req, Rule::in(['Office Work', 'Field Work', 'Others'])],
            'working_condition_other'     => [
                Rule::requiredIf($publishing && request()->input('working_condition_type') === 'Others'),
                'nullable', 'string', 'max:255',
            ],
            'working_condition_frequency' => [$req, Rule::in(['Occasional', 'Frequent'])],

            // Descriptions
            'unit_function_description'     => [$req, 'string'],
            'position_function_description' => [$req, 'string'],

            // Qualification standards
            'edu_standard'         => [$req, 'string', 'max:255'],
            'experience_standard'  => [$req, 'string', 'max:255'],
            'training_standard'    => [$req, 'string', 'max:255'],
            'eligibility_standard' => [$req, 'string', 'max:255'],

            'core_competencies'              => [$req, 'array', 'min:1'],
            'core_competencies.*.competency' => [$req, 'string', 'max:255'],
            'core_competencies.*.level'      => [$req, 'string', 'max:100'],

            'leadership_competencies'              => [$req, 'array', 'min:1'],
            'leadership_competencies.*.competency' => [$req, 'string', 'max:255'],
            'leadership_competencies.*.level'      => [$req, 'string', 'max:100'],

            'duties_responsibilities'                    => [$req, 'array', 'min:1'],
            'duties_responsibilities.*.percentage'       => [$req, 'string', 'max:50'],
            'duties_responsibilities.*.description'      => [$req, 'string'],
            'duties_responsibilities.*.competency_level' => [$req, 'string', 'max:100'],
        ];
    }

    // ── Index — positions list for AdminDashboard ─────────────────────

    public function index(Request $request): Response
    {
        $search  = $request->get('search', '');
        $status  = $request->get('status', '');
        $perPage = 10;

        $query = Position::query()->latest();

        if ($search) {
            $query->where('position_title', 'like', "%{$search}%");
        }

        if ($status) {
            $query->where('status', $status);
        }

        $positions = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Pages/AdminDashboard', [
            'positions'  => $positions,
            'posFilters' => ['search' => $search, 'status' => $status],
        ]);
    }

    // ── Create form ───────────────────────────────────────────────────

    public function create(): Response
    {
        return Inertia::render('Admin/Pages/PositionDescriptionForm');
    }

    // ── Store ─────────────────────────────────────────────────────────

    public function store(Request $request)
    {
        $publishing = $request->input('status') === 'published';
        $validated  = $request->validate($this->rules($publishing));

        $position = Position::create(array_merge($validated, [
            'status' => $publishing ? 'published' : 'draft',
        ]));

        ActivityLogService::log(
            action: ActivityLog::ACTION_POSITION_FORM_CREATED,
            actorId: auth()->id(),
            actorType: 'admin',
            entityType: 'Position',
            entityId: $position->id,
            request: $request,
        );

        return redirect()
            ->to(route('admin.dashboard') . '?section=positions')
            ->with('success', $publishing
                ? 'Position published successfully.'
                : 'Position saved as draft.'
            );
    }

    // ── Edit form ─────────────────────────────────────────────────────

    public function edit(Position $position): Response
    {
        return Inertia::render('Admin/Pages/PositionDescriptionForm', [
            'position' => $position,
        ]);
    }

    // ── Update ────────────────────────────────────────────────────────

    public function update(Request $request, Position $position)
    {
        $publishing = $request->input('status') === 'published';
        $validated  = $request->validate($this->rules($publishing));

        $allUpdates = array_merge($validated, [
            'status' => $publishing ? 'published' : 'draft',
        ]);

        // ── Capture field-level before values ────────────────────────
        $before = [];
        foreach (array_keys($allUpdates) as $field) {
            $before[$field] = $position->$field;
        }

        $position->update($allUpdates);

        // ── Compute diff — only changed fields ───────────────────────
        $changes = [];
        foreach ($allUpdates as $field => $newValue) {
            $oldValue = $before[$field];
            $oldNorm  = is_array($oldValue) ? json_encode($oldValue) : $oldValue;
            $newNorm  = is_array($newValue) ? json_encode($newValue) : $newValue;
            if ($oldNorm !== $newNorm) {
                $changes[$field] = [
                    'before' => $oldValue,
                    'after'  => $newValue,
                ];
            }
        }

        ActivityLogService::log(
            action: ActivityLog::ACTION_POSITION_FORM_UPDATED,
            actorId: auth()->id(),
            actorType: 'admin',
            entityType: 'Position',
            entityId: $position->id,
            changes: $changes ?: null,
            request: $request,
        );

        return redirect()
            ->to(route('admin.dashboard') . '?section=positions')
            ->with('success', $publishing
                ? 'Position updated and published.'
                : 'Position draft updated.'
            );
    }

    // ── Destroy ───────────────────────────────────────────────────────

    public function destroy(Request $request, Position $position)
    {
        $position->delete();

        ActivityLogService::log(
            action: ActivityLog::ACTION_POSITION_FORM_REMOVED,
            actorId: auth()->id(),
            actorType: 'admin',
            entityType: 'Position',
            entityId: $position->id,
            request: $request,
        );

        return back()->with('success', 'Position removed.');
    }

    // ── Restore ───────────────────────────────────────────────────────

    public function restore(Request $request, int $position)
    {
        $record = Position::onlyTrashed()->findOrFail($position);
        $record->restore();

        ActivityLogService::log(
            action: ActivityLog::ACTION_POSITION_FORM_RESTORED,
            actorId: auth()->id(),
            actorType: 'admin',
            entityType: 'Position',
            entityId: $position,
            request: $request,
        );

        return back()->with('success', 'Position restored.');
    }

    // ── View PDF ──────────────────────────────────────────────────────

    public function viewPdf(Position $position): \Illuminate\Http\Response
    {
        $data     = $position->toArray();
        $pdf      = (new PositionFillerService())->generate($data);
        $filename = 'PDF_' . str_replace(' ', '_', $position->position_title ?? 'position') . '.pdf';

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }
}