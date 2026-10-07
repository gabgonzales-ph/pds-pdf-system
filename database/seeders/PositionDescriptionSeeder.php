<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PositionDescriptionSeeder extends Seeder
{
    /**
     * Competency levels used across core_competencies, leadership_competencies,
     * and duties_responsibilities. Kept here as a single source of truth —
     * mirrors the COMPETENCY_LEVELS constant in PositionDescriptionForm.jsx.
     */
    const COMPETENCY_LEVELS = [
        'Basic',
        'Intermediate',
        'Advanced',
        'Superior',
        'Distinguished',
    ];

    public function run(): void
    {
        DB::table('positions')->insertOrIgnore([
            // ── Basic Info ─────────────────────────────────────────────────
            'position_title'               => 'Information Technology Officer I',
            'item_number'                  => 'ITMS-001',
            'salary_grade'                 => '15',

            // ── Local Government — enum: Province | City | Municipality ────
            'gov_unit_type'                => 'City',

            // ── enum: 1st Class | 2nd Class | 3rd Class | 4th Class | 5th Class | 6th Class | Special
            'gov_unit_class'               => '1st Class',

            // ── Office / Location ──────────────────────────────────────────
            'department_agency'            => 'City Government of San Pablo',
            'bureau_office'                => "Mayor's Information System Office",
            'department_branch_division'   => 'ICT Division',
            'workstation'                  => 'City Hall, San Pablo City, Laguna',

            // ── Appropriation / Compensation ───────────────────────────────
            'present_approp_act'           => 'FY 2025 Annual Budget',
            'previous_approp_act'          => 'FY 2024 Annual Budget',
            'salary_authorized'            => '33,584',
            'other_compensation'           => 'PERA, Rice Allowance, Clothing Allowance',

            // ── Supervision ────────────────────────────────────────────────
            'immediate_supervisor_title'   => 'Department Head III',
            'next_higher_supervisor_title' => 'City Mayor',

            // ── Supervised Positions ───────────────────────────────────────
            'supervised_positions' => json_encode([
                ['position_title' => 'Computer Maintenance Technologist I', 'item_number' => 'ITMS-002'],
                ['position_title' => 'Administrative Aide VI',              'item_number' => 'ITMS-003'],
            ]),

            // ── Equipment & Tools ──────────────────────────────────────────
            'equipment_tools' => json_encode([
                'Desktop Computer / Laptop',
                'Network Switch & Router',
                'Server Rack Equipment',
                'CCTV Monitoring System',
                'Office Productivity Software (MS Office)',
            ]),

            // ── Internal Contacts ──────────────────────────────────────────
            'contacts_internal' => json_encode([
                'executive_managerial' => ['occasional' => true,  'frequent' => false],
                'supervisors'          => ['occasional' => false, 'frequent' => true],
                'non_supervisors'      => ['occasional' => false, 'frequent' => true],
                'staff'                => ['occasional' => true,  'frequent' => false],
            ]),

            // ── External Contacts ──────────────────────────────────────────
            'contacts_external' => json_encode([
                'general_public' => ['occasional' => true,  'frequent' => false],
                'other_agencies' => ['occasional' => false, 'frequent' => true],
                'others'         => ['text' => 'IT Vendors & Service Providers', 'occasional' => false, 'frequent' => true],
            ]),

            // ── Working Condition — enum: Office Work | Field Work | Others ─
            'working_condition_type'      => 'Office Work',
            'working_condition_other'     => null,

            // ── enum: Occasional | Frequent ────────────────────────────────
            'working_condition_frequency' => 'Frequent',

            // ── Function Descriptions ──────────────────────────────────────
            'unit_function_description'     => "The Mayor's Information System Office (MISO) plans, develops, and maintains all ICT infrastructure and systems of the City Government of San Pablo, ensuring secure, reliable, and efficient delivery of digital services to the public and all city departments.",
            'position_function_description' => "Plans, organizes, and supervises the installation, configuration, and maintenance of the city's ICT hardware and software systems; oversees network infrastructure and ensures uptime, data integrity, and information security across all government offices.",

            // ── Qualification Standards ────────────────────────────────────
            'edu_standard'         => "Bachelor's Degree relevant to the job",
            'experience_standard'  => '2 years of relevant experience',
            'training_standard'    => '8 hours of relevant training',
            'eligibility_standard' => 'Career Service Professional / Second Level Eligibility',

            // ── Core Competencies (level must be one of COMPETENCY_LEVELS) ─
            'core_competencies' => json_encode([
                ['competency' => 'Integrity',           'level' => 'Intermediate'],
                ['competency' => 'Professionalism',     'level' => 'Intermediate'],
                ['competency' => 'Result Focus',        'level' => 'Advanced'],
                ['competency' => 'Teamwork',            'level' => 'Intermediate'],
                ['competency' => 'Service Orientation', 'level' => 'Intermediate'],
            ]),

            // ── Leadership Competencies ────────────────────────────────────
            'leadership_competencies' => json_encode([
                ['competency' => 'Leading People',       'level' => 'Intermediate'],
                ['competency' => 'Managing Performance', 'level' => 'Intermediate'],
            ]),

            // ── Duties & Responsibilities ──────────────────────────────────
            // Total characters across all descriptions must not exceed 650.
            'duties_responsibilities' => json_encode([
                [
                    'percentage'       => '35',
                    'description'      => 'Installs, configures, and maintains servers, network equipment, workstations, and peripheral devices; monitors system performance and resolves hardware and software issues.',
                    'competency_level' => 'Advanced',
                ],
                [
                    'percentage'       => '25',
                    'description'      => 'Manages user accounts, access controls, and security policies; implements data backup and recovery procedures to ensure data integrity and availability.',
                    'competency_level' => 'Advanced',
                ],
                [
                    'percentage'       => '20',
                    'description'      => 'Provides technical assistance and training to end users on the use of ICT equipment, applications, and systems; documents support requests and resolutions.',
                    'competency_level' => 'Intermediate',
                ],
                [
                    'percentage'       => '10',
                    'description'      => 'Prepares ICT procurement documents including technical specifications, terms of reference, and acceptance reports for ICT equipment and services.',
                    'competency_level' => 'Intermediate',
                ],
                [
                    'percentage'       => '10',
                    'description'      => 'Performs other related tasks as may be assigned by the supervisor.',
                    'competency_level' => 'Basic',
                ],
            ]),

            'status'     => 'published',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
