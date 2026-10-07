<?php

namespace Database\Seeders;

use App\Modules\Admin\Models\Position;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    public function run(): void
    {
        $positions = [
            [
                'position_title'               => 'Administrative Officer II',
                'item_number'                  => 'OSEC-DILG-ADOF2-1234567-2024',
                'salary_grade'                 => '15',
                'gov_unit_type'                => 'City',
                'gov_unit_class'               => '1st Class',
                'department_agency'            => 'Department of the Interior and Local Government',
                'bureau_office'                => 'Regional Office V',
                'department_branch_division'   => 'Finance and Administrative Division',
                'workstation'                  => 'Main Office, Legazpi City, Albay',
                'present_approp_act'           => 'GAA FY 2025',
                'previous_approp_act'          => 'GAA FY 2024',
                'salary_authorized'            => '35,097',
                'other_compensation'           => 'PERA, ACA, Rice Subsidy',
                'immediate_supervisor_title'   => 'Administrative Officer V',
                'next_higher_supervisor_title' => 'Assistant Regional Director',
                'supervised_positions' => [
                    ['position_title' => 'Administrative Aide VI',  'item_number' => 'OSEC-DILG-AA6-0001-2024'],
                    ['position_title' => 'Administrative Aide IV',  'item_number' => 'OSEC-DILG-AA4-0002-2024'],
                ],
                'equipment_tools' => [
                    'Desktop Computer',
                    'Photocopier Machine',
                    'Telephone',
                    'Filing Cabinet',
                ],
                'contacts_internal' => [
                    'executive_managerial' => ['occasional' => true,  'frequent' => false],
                    'supervisors'          => ['occasional' => false, 'frequent' => true],
                    'non_supervisors'      => ['occasional' => false, 'frequent' => true],
                    'staff'                => ['occasional' => false, 'frequent' => true],
                ],
                'contacts_external' => [
                    'general_public' => ['occasional' => true,  'frequent' => false],
                    'other_agencies' => ['occasional' => true,  'frequent' => false],
                    'others'         => ['text' => 'Local Government Units', 'occasional' => false, 'frequent' => false],
                ],
                'working_condition_type'      => 'Office Work',
                'working_condition_other'     => '',
                'working_condition_frequency' => 'Frequent',
                'unit_function_description'   => 'The Finance and Administrative Division is responsible for the management of financial, human resource, and administrative services of the Regional Office, ensuring efficient and effective delivery of support services in accordance with applicable laws, rules, and regulations.',
                'position_function_description' => 'Responsible for providing administrative and financial support services including budget preparation, records management, procurement assistance, and property management. Ensures timely processing of documents and compliance with government accounting and auditing rules.',
                'edu_standard'        => "Bachelor's degree relevant to the job",
                'experience_standard' => '1 year of relevant experience',
                'training_standard'   => '4 hours of relevant training',
                'eligibility_standard'=> 'Career Service (Professional) / Second Level Eligibility',
                'core_competencies' => [
                    ['competency' => 'Professionalism and Ethics',   'level' => 'Intermediate'],
                    ['competency' => 'Results Focus',                'level' => 'Intermediate'],
                    ['competency' => 'Teamwork',                     'level' => 'Intermediate'],
                    ['competency' => 'Service Orientation',          'level' => 'Intermediate'],
                ],
                'leadership_competencies' => [
                    ['competency' => 'Leading People',    'level' => 'Basic'],
                    ['competency' => 'Thinking Strategically and Creatively', 'level' => 'Basic'],
                ],
                'duties_responsibilities' => [
                    ['percentage' => '30', 'description' => 'Prepares and processes financial documents including disbursement vouchers, purchase orders, and payroll in accordance with COA rules and regulations.', 'competency_level' => 'Intermediate'],
                    ['percentage' => '25', 'description' => 'Maintains and updates records of office supplies, equipment, and property; conducts periodic inventory and prepares reports thereon.', 'competency_level' => 'Intermediate'],
                    ['percentage' => '20', 'description' => 'Assists in the preparation of annual budget proposals and monitors expenditures against allotments.', 'competency_level' => 'Basic'],
                    ['percentage' => '15', 'description' => 'Receives, records, and routes incoming and outgoing communications; maintains filing system for office correspondence and documents.', 'competency_level' => 'Basic'],
                    ['percentage' => '10', 'description' => 'Performs other related tasks as may be assigned by the immediate supervisor.', 'competency_level' => 'Basic'],
                ],
                'status' => 'published',
            ],

            [
                'position_title'               => 'Information Technology Officer I',
                'item_number'                  => 'OSEC-DILG-ITO1-7654321-2024',
                'salary_grade'                 => '19',
                'gov_unit_type'                => 'Province',
                'gov_unit_class'               => '2nd Class',
                'department_agency'            => 'Department of the Interior and Local Government',
                'bureau_office'                => 'Regional Office V',
                'department_branch_division'   => 'Information and Communications Technology Section',
                'workstation'                  => 'Main Office, Legazpi City, Albay',
                'present_approp_act'           => 'GAA FY 2025',
                'previous_approp_act'          => 'GAA FY 2024',
                'salary_authorized'            => '52,446',
                'other_compensation'           => 'PERA, ACA, Rice Subsidy, Hazard Pay',
                'immediate_supervisor_title'   => 'Information Technology Officer II',
                'next_higher_supervisor_title' => 'Regional Director',
                'supervised_positions' => [
                    ['position_title' => 'Information Technology Assistant', 'item_number' => 'OSEC-DILG-ITA-0003-2024'],
                ],
                'equipment_tools' => [
                    'Laptop Computer',
                    'Network Switch and Router',
                    'Server Hardware',
                    'UPS / Power Backup',
                    'Structured Cabling Tools',
                ],
                'contacts_internal' => [
                    'executive_managerial' => ['occasional' => true,  'frequent' => false],
                    'supervisors'          => ['occasional' => false, 'frequent' => true],
                    'non_supervisors'      => ['occasional' => false, 'frequent' => true],
                    'staff'                => ['occasional' => false, 'frequent' => true],
                ],
                'contacts_external' => [
                    'general_public' => ['occasional' => true,  'frequent' => false],
                    'other_agencies' => ['occasional' => false, 'frequent' => true],
                    'others'         => ['text' => 'ICT Vendors and Service Providers', 'occasional' => false, 'frequent' => false],
                ],
                'working_condition_type'      => 'Office Work',
                'working_condition_other'     => '',
                'working_condition_frequency' => 'Frequent',
                'unit_function_description'   => 'The ICT Section manages the information and communications technology infrastructure and systems of the Regional Office, ensuring secure, reliable, and continuous ICT operations that support the delivery of services and programs of the agency.',
                'position_function_description' => 'Plans, implements, and maintains the ICT infrastructure including local area network, internet connectivity, hardware, and software systems. Provides technical support and training to end users and ensures data security and business continuity.',
                'edu_standard'         => "Bachelor's degree in Information Technology, Computer Science, or related field",
                'experience_standard'  => '2 years of relevant experience in ICT systems administration',
                'training_standard'    => '8 hours of relevant training in networking or systems administration',
                'eligibility_standard' => 'Career Service (Professional) / Second Level Eligibility',
                'core_competencies' => [
                    ['competency' => 'Professionalism and Ethics',  'level' => 'Advanced'],
                    ['competency' => 'Results Focus',               'level' => 'Advanced'],
                    ['competency' => 'Teamwork',                    'level' => 'Intermediate'],
                    ['competency' => 'Innovation',                  'level' => 'Advanced'],
                ],
                'leadership_competencies' => [
                    ['competency' => 'Leading People',                            'level' => 'Intermediate'],
                    ['competency' => 'Thinking Strategically and Creatively',     'level' => 'Intermediate'],
                    ['competency' => 'Building Collaborative and Inclusive Teams', 'level' => 'Basic'],
                ],
                'duties_responsibilities' => [
                    ['percentage' => '35', 'description' => 'Installs, configures, and maintains servers, network equipment, workstations, and peripheral devices; monitors system performance and resolves hardware and software issues.', 'competency_level' => 'Advanced'],
                    ['percentage' => '25', 'description' => 'Manages user accounts, access controls, and security policies; implements data backup and recovery procedures to ensure data integrity and availability.', 'competency_level' => 'Advanced'],
                    ['percentage' => '20', 'description' => 'Provides technical assistance and training to end users on the use of ICT equipment, applications, and systems; documents support requests and resolutions.', 'competency_level' => 'Intermediate'],
                    ['percentage' => '10', 'description' => 'Prepares ICT procurement documents including technical specifications, terms of reference, and acceptance reports for ICT equipment and services.', 'competency_level' => 'Intermediate'],
                    ['percentage' => '10', 'description' => 'Performs other related tasks as may be assigned by the supervisor.', 'competency_level' => 'Basic'],
                ],
                'status' => 'published',
            ],

            [
                'position_title'               => 'Human Resource Management Officer I',
                'item_number'                  => 'OSEC-DILG-HRMO1-0011-2024',
                'salary_grade'                 => '15',
                'gov_unit_type'                => 'Municipality',
                'gov_unit_class'               => '3rd Class',
                'department_agency'            => 'Department of the Interior and Local Government',
                'bureau_office'                => 'Regional Office V',
                'department_branch_division'   => 'Human Resource Management Section',
                'workstation'                  => 'Main Office, Legazpi City, Albay',
                'present_approp_act'           => 'GAA FY 2025',
                'previous_approp_act'          => 'GAA FY 2024',
                'salary_authorized'            => '35,097',
                'other_compensation'           => 'PERA, ACA, Rice Subsidy',
                'immediate_supervisor_title'   => 'Human Resource Management Officer III',
                'next_higher_supervisor_title' => 'Administrative Officer V',
                'supervised_positions' => [
                    ['position_title' => 'Human Resource Management Assistant', 'item_number' => 'OSEC-DILG-HRMA-0005-2024'],
                ],
                'equipment_tools' => [
                    'Desktop Computer',
                    'Biometric Attendance System',
                    'Telephone',
                    'Printer/Scanner',
                ],
                'contacts_internal' => [
                    'executive_managerial' => ['occasional' => true,  'frequent' => false],
                    'supervisors'          => ['occasional' => false, 'frequent' => true],
                    'non_supervisors'      => ['occasional' => false, 'frequent' => true],
                    'staff'                => ['occasional' => false, 'frequent' => true],
                ],
                'contacts_external' => [
                    'general_public' => ['occasional' => true,  'frequent' => false],
                    'other_agencies' => ['occasional' => true,  'frequent' => false],
                    'others'         => ['text' => 'CSC Regional Office', 'occasional' => false, 'frequent' => false],
                ],
                'working_condition_type'      => 'Office Work',
                'working_condition_other'     => '',
                'working_condition_frequency' => 'Frequent',
                'unit_function_description'   => 'The Human Resource Management Section administers the human resource programs and services of the Regional Office including recruitment and selection, performance management, learning and development, rewards and recognition, and employee welfare and benefits.',
                'position_function_description' => 'Assists in the implementation of HR programs and services. Maintains and updates the 201 files and HRIS of all personnel. Processes appointments, leave applications, and other HR transactions. Coordinates with the Civil Service Commission on personnel matters.',
                'edu_standard'         => "Bachelor's degree relevant to the job",
                'experience_standard'  => '1 year of relevant experience',
                'training_standard'    => '4 hours of relevant training',
                'eligibility_standard' => 'Career Service (Professional) / Second Level Eligibility',
                'core_competencies' => [
                    ['competency' => 'Professionalism and Ethics', 'level' => 'Intermediate'],
                    ['competency' => 'Results Focus',              'level' => 'Intermediate'],
                    ['competency' => 'Service Orientation',        'level' => 'Advanced'],
                    ['competency' => 'Teamwork',                   'level' => 'Intermediate'],
                ],
                'leadership_competencies' => [
                    ['competency' => 'Leading People',           'level' => 'Basic'],
                    ['competency' => 'Managing Performance',     'level' => 'Basic'],
                ],
                'duties_responsibilities' => [
                    ['percentage' => '30', 'description' => 'Processes appointments, promotions, transfers, and other personnel actions; ensures completeness and accuracy of documents prior to submission to the Civil Service Commission.', 'competency_level' => 'Intermediate'],
                    ['percentage' => '25', 'description' => 'Maintains and updates the 201 files and HRIS of all personnel; ensures accuracy and completeness of records at all times.', 'competency_level' => 'Intermediate'],
                    ['percentage' => '20', 'description' => 'Processes leave applications and maintains leave cards of all personnel in accordance with Civil Service rules and regulations.', 'competency_level' => 'Basic'],
                    ['percentage' => '15', 'description' => 'Assists in the conduct of recruitment and selection activities including posting of vacancies, receiving of applications, and preparation of selection documents.', 'competency_level' => 'Basic'],
                    ['percentage' => '10', 'description' => 'Performs other related tasks as may be assigned by the supervisor.', 'competency_level' => 'Basic'],
                ],
                'status' => 'draft',
            ],
        ];

        foreach ($positions as $data) {
            Position::create($data);
        }
    }
}
