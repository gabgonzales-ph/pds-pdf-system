<?php

namespace App\Modules\Admin\Controllers;

use App\Services\Position\PositionFillerService;

class PositionPDFTestController
{
    public function preview()
    {
        $data = [
            // ── Page 1 text fields ────────────────────────────────────
            'position_title'               => 'POSITION TITLE TEST',
            'item_number'                  => 'ITEM-NUMBER-TEST-001',
            'salary_grade'                 => 'SG-00',
            'gov_unit_type'                => 'City',           // checkbox
            'gov_unit_class'               => '3rd Class',      // checkbox
            'department_agency'            => 'DEPARTMENT AGENCY TEST',
            'bureau_office'                => 'BUREAU OFFICE TEST',
            'department_branch_division'   => 'DEPT BRANCH DIVISION TEST',
            'workstation'                  => 'WORKSTATION TEST',
            'present_approp_act'           => 'PRESENT APPROP TEST',
            'previous_approp_act'          => 'PREVIOUS APPROP TEST',
            'salary_authorized'            => 'SAL AUTH TEST',
            'other_compensation'           => 'OTHER COMP TEST',
            'immediate_supervisor_title'   => 'IMMEDIATE SUPERVISOR TEST',
            'next_higher_supervisor_title' => 'NEXT HIGHER SUPERVISOR TEST',

            // ── Section 15: Supervised positions ─────────────────────
            'supervised_positions' => [
                ['position_title' => 'SUP POS TITLE 1', 'item_number' => 'SUP ITEM 1'],
                ['position_title' => 'SUP POS TITLE 2', 'item_number' => 'SUP ITEM 2'],
                ['position_title' => 'SUP POS TITLE 3', 'item_number' => 'SUP ITEM 3'],
            ],

            // ── Section 16: Equipment ─────────────────────────────────
            'equipment_tools' => [
                'EQUIPMENT TOOL 1',
                'EQUIPMENT TOOL 2',
                'EQUIPMENT TOOL 3',
            ],

            // ── Section 17a: Internal contacts (all checked on Occasional) ──
            'contacts_internal' => [
                'executive_managerial' => ['occasional' => true,  'frequent' => false],
                'supervisors'          => ['occasional' => false, 'frequent' => true],
                'non_supervisors'      => ['occasional' => true,  'frequent' => false],
                'staff'                => ['occasional' => false, 'frequent' => true],
            ],

            // ── Section 17b: External contacts ───────────────────────
            'contacts_external' => [
                'general_public' => ['occasional' => true,  'frequent' => false],
                'other_agencies' => ['occasional' => false, 'frequent' => true],
                'others'         => ['text' => 'OTHERS SPECIFY TEST', 'occasional' => false, 'frequent' => false],
            ],

            // ── Section 18: Working condition ─────────────────────────
            // Test 'Office Work' with 'Occasional'
            // Change to 'Field Work' / 'Frequent' / 'Others' to test other combos
            'working_condition_type'      => 'Office Work',
            'working_condition_other'     => 'WORKING CONDITION OTHER TEST',
            'working_condition_frequency' => 'Occasional',

            // ── Section 19: Unit function ─────────────────────────────
            'unit_function_description' => 'UNIT FUNCTION DESCRIPTION TEST — This is a test paragraph to check the position and wrapping of long text in the unit function description field on page 1.',

            // ── Page 2 ────────────────────────────────────────────────
            'position_function_description' => 'POSITION FUNCTION DESCRIPTION TEST — This is a test paragraph to check the position and wrapping of long text in the job summary field on page 2.',

            'edu_standard'         => 'EDUCATION TEST',
            'experience_standard'  => 'EXPERIENCE TEST',
            'training_standard'    => 'TRAINING TEST',
            'eligibility_standard' => 'ELIGIBILITY TEST',

            // ── Section 21e: Core competencies ───────────────────────
            'core_competencies' => [
                ['competency' => 'CORE COMP 1', 'level' => 'LEVEL 1'],
                ['competency' => 'CORE COMP 2', 'level' => 'LEVEL 2'],
                ['competency' => 'CORE COMP 3', 'level' => 'LEVEL 3'],
            ],

            // ── Section 21f: Leadership competencies ─────────────────
            'leadership_competencies' => [
                ['competency' => 'LEAD COMP 1', 'level' => 'LEVEL 1'],
                ['competency' => 'LEAD COMP 2', 'level' => 'LEVEL 2'],
                ['competency' => 'LEAD COMP 3', 'level' => 'LEVEL 3'],
            ],

            // ── Section 22: Duties & responsibilities ─────────────────
            'duties_responsibilities' => [
                ['percentage' => '40%', 'description' => 'DUTY DESCRIPTION ROW 1 TEST',    'competency_level' => 'COMP LEVEL 1'],
                ['percentage' => '30%', 'description' => 'DUTY DESCRIPTION ROW 2 TEST',    'competency_level' => 'COMP LEVEL 2'],
                ['percentage' => '20%', 'description' => 'DUTY DESCRIPTION ROW 3 TEST',    'competency_level' => 'COMP LEVEL 3'],
                ['percentage' => '10%', 'description' => 'DUTY DESCRIPTION ROW 4 TEST',    'competency_level' => 'COMP LEVEL 4'],
            ],
        ];

        $pdf = (new PositionFillerService())->generate($data);

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="position_test.pdf"',
            'Cache-Control'       => 'no-cache',
        ]);
    }
}
