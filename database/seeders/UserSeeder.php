<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $departmentId    = DB::table('departments')->value('id');
        $careerServiceId = DB::table('career_services')->value('id');

        // ── Admin account ────────────────────────────────────────────
        DB::table('users')->insertOrIgnore([
            'username'          => 'admin',
            'email'             => 'admin@miso.local',
            'password'          => Hash::make('Admin@12345'),
            'employee_id'       => '00000001',
            'role'              => 'ADMIN',
            'department_id'     => $departmentId,
            'career_service_id' => $careerServiceId,
            'email_verified_at' => now(),
            'created_at'        => now(),
            'updated_at'        => now(),
        ]);

        // ────────────────────────────────────────────────────────────
        // TEST USER - all PDS sections fully populated
        // ────────────────────────────────────────────────────────────
        $userId = DB::table('users')->insertGetId([
            'username'          => 'testuser',
            'email'             => 'testuser@miso.local',
            'password'          => Hash::make('Test@12345'),
            'employee_id'       => '00000002',
            'role'              => 'USER',
            'department_id'     => $departmentId,
            'career_service_id' => $careerServiceId,
            'email_verified_at' => now(),
            'created_at'        => now(),
            'updated_at'        => now(),
        ]);

        // ── I. Personal Information ──────────────────────────────────
        DB::table('personal_information')->insertOrIgnore([
            'user_id'           => $userId,
            'last_name'         => 'DELA CRUZ',
            'first_name'        => 'JUAN',
            'middle_name'       => 'SANTOS',
            'suffix'            => 'JR.',
            'date_of_birth'     => '1990-06-15',
            'birth_place'       => 'MANILA, METRO MANILA',
            'sex'               => 'MALE',
            'civil_status'      => 'MARRIED',
            'blood_type'        => 'O+',
            'citizenship'       => 'Filipino',
            'height_cm'         => 170.00,
            'weight_kg'         => 68.00,
            'mobile_no'         => '09171234567',
            'telephone_no'      => '(02) 8123-4567',
            // Residential Address
            'house_block_lot_no'  => 'BLK 5 LOT 12',
            'street'              => 'RIZAL STREET',
            'subdivision_village' => 'STA. MESA HEIGHTS',
            'barangay'            => 'BARANGAY 1',
            'city_municipality'   => 'CITY OF MANILA',
            'province'            => 'METRO MANILA',
            'region'              => 'NCR',
            'zip_code'            => '1000',
            // Permanent Address
            'perm_house_block_lot_no'  => 'UNIT 3B',
            'perm_street'              => 'MABINI STREET',
            'perm_subdivision_village' => 'VILLA SAN JOSE',
            'perm_barangay'            => 'BARANGAY 5',
            'perm_city'                => 'QUEZON CITY',
            'perm_province'            => 'METRO MANILA',
            'perm_region'              => 'NCR',
            'perm_zip_code'            => '1100',
            // Government IDs
            'umid_no'       => '0012-3456789-0',
            'pagibig_no'    => '1234-5678-9012',
            'philhealth_no' => '12-345678901-2',
            'philsys_no'    => '1234-5678-9012-3',
            'tin_no'        => '123-456-789-000',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        // ── II. Family Background ────────────────────────────────────
        DB::table('family_backgrounds')->insertOrIgnore([
            'user_id'            => $userId,
            'father_surname'     => 'DELA CRUZ',
            'father_first_name'  => 'PEDRO',
            'father_middle_name' => 'REYES',
            'father_suffix'      => 'SR.',
            'mother_surname'     => 'SANTOS',
            'mother_first_name'  => 'MARIA',
            'mother_middle_name' => 'LOPEZ',
            'mother_suffix'      => null,
            'spouse_surname'     => 'DELA CRUZ',
            'spouse_first_name'  => 'ANA',
            'spouse_middle_name' => 'REYES',
            'spouse_suffix'      => null,
            'spouse_birthdate'   => '1993-03-22',
            'created_at'         => now(),
            'updated_at'         => now(),
        ]);

        // ── IV. Civil Service Eligibility (7 entries) ────────────────
        $eligibilities = [
            [
                'career_service'       => 'CAREER SERVICE PROFESSIONAL',
                'rating'               => '82.53',
                'date_of_examination'  => '2012-08-12',
                'place_of_examination' => 'POLYTECHNIC UNIVERSITY OF THE PHILIPPINES, STA. MESA, MANILA',
                'license_number'       => null,
                'license_validity'     => null,
                'order'                => 0,
            ],
            [
                'career_service'       => 'RA 1080 – LICENSURE EXAMINATION FOR ELECTRONICS ENGINEERS (PRC)',
                'rating'               => '79.40',
                'date_of_examination'  => '2011-11-20',
                'place_of_examination' => 'PROFESSIONAL REGULATION COMMISSION BUILDING, SAMPALOC, MANILA',
                'license_number'       => 'ECE-0045678',
                'license_validity'     => '2025-11-20',
                'order'                => 1,
            ],
            [
                'career_service'       => 'CAREER SERVICE SUB-PROFESSIONAL',
                'rating'               => '81.23',
                'date_of_examination'  => '2009-10-25',
                'place_of_examination' => 'POLYTECHNIC UNIVERSITY OF THE PHILIPPINES, STO. TOMAS CAMPUS, BATANGAS',
                'license_number'       => null,
                'license_validity'     => null,
                'order'                => 2,
            ],
            [
                'career_service'       => 'RA 1080 – REGISTERED ELECTRONICS TECHNICIAN (PRC)',
                'rating'               => '76.50',
                'date_of_examination'  => '2010-05-15',
                'place_of_examination' => 'PROFESSIONAL REGULATION COMMISSION BUILDING, SAMPALOC, MANILA',
                'license_number'       => 'RET-0023456',
                'license_validity'     => '2024-05-15',
                'order'                => 3,
            ],
            [
                'career_service'       => 'PHILIPPINE ICT COMPETENCY ASSESSMENT (DICT)',
                'rating'               => 'N/A',
                'date_of_examination'  => '2016-03-14',
                'place_of_examination' => 'DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY, C.P. GARCIA AVENUE, DILIMAN, QUEZON CITY',
                'license_number'       => 'DICT-ICT-2016-003421',
                'license_validity'     => null,
                'order'                => 4,
            ],
            [
                'career_service'       => 'DRIVER\'S LICENSE (PROFESSIONAL)',
                'rating'               => 'N/A',
                'date_of_examination'  => '2010-08-20',
                'place_of_examination' => 'LAND TRANSPORTATION OFFICE - NCR SOUTH DISTRICT OFFICE, PASAY CITY',
                'license_number'       => 'N01-10-098765',
                'license_validity'     => '2026-08-20',
                'order'                => 5,
            ],
            [
                'career_service'       => 'HONOR GRADUATE (RA 1080)',
                'rating'               => 'N/A',
                'date_of_examination'  => '2011-04-15',
                'place_of_examination' => 'POLYTECHNIC UNIVERSITY OF THE PHILIPPINES, STA. MESA, MANILA',
                'license_number'       => null,
                'license_validity'     => null,
                'order'                => 6,
            ],
        ];

        foreach ($eligibilities as $elig) {
            DB::table('civil_service_eligibilities')->insert([
                'user_id'              => $userId,
                'career_service'       => $elig['career_service'],
                'rating'               => $elig['rating'],
                'date_of_examination'  => $elig['date_of_examination'],
                'place_of_examination' => $elig['place_of_examination'],
                'license_number'       => $elig['license_number'],
                'license_validity'     => $elig['license_validity'],
                'order'                => $elig['order'],
                'created_at'           => now(),
                'updated_at'           => now(),
            ]);
        }

        // ── V. Work Experience (28 entries - mix of government and private) ──
        $workExperiences = [
            // ─── Private Sector - Early Career ───────────────────────────────
           
            [
                'date_from'             => '2014-07-01',
                'date_to'               => '2014-12-31',
                'position_title'        => 'IT PROJECT OFFICER (CONCURRENT DETAIL)',
                'department_agency'     => 'DOST-ADVANCED SCIENCE AND TECHNOLOGY INSTITUTE, C.P. GARCIA AVENUE, DILIMAN, QUEZON CITY',
                'status_of_appointment' => 'PERMANENT (DETAIL)',
                'is_government_service' => 'Y',
                'order'                 => 10,
            ],
            [
                'date_from'             => '2015-07-01',
                'date_to'               => '2017-06-30',
                'position_title'        => 'INFORMATION TECHNOLOGY OFFICER II',
                'department_agency'     => 'DEPARTMENT OF SCIENCE AND TECHNOLOGY REGIONAL OFFICE IV-A, BIÑAN, LAGUNA',
                'status_of_appointment' => 'PERMANENT',
                'is_government_service' => 'Y',
                'order'                 => 11,
            ],
            // ─── Private - Part-time / Concurrent ────────────────────────────
            [
                'date_from'             => '2015-09-01',
                'date_to'               => '2016-06-30',
                'position_title'        => 'IT INSTRUCTOR (PART-TIME)',
                'department_agency'     => 'AMA COMPUTER LEARNING CENTER, STA. MESA, MANILA',
                'status_of_appointment' => 'PART-TIME',
                'is_government_service' => 'N',
                'order'                 => 12,
            ],
            // ─── Government - Concurrent Designation ─────────────────────────
            [
                'date_from'             => '2016-01-04',
                'date_to'               => '2016-12-31',
                'position_title'        => 'TECHNICAL WORKING GROUP MEMBER (CONCURRENT)',
                'department_agency'     => 'NATIONAL TELECOMMUNICATIONS COMMISSION, EDSA, QUEZON CITY',
                'status_of_appointment' => 'PERMANENT (CONCURRENT)',
                'is_government_service' => 'Y',
                'order'                 => 13,
            ],
            [
                'date_from'             => '2017-01-03',
                'date_to'               => '2017-06-30',
                'position_title'        => 'INFORMATION TECHNOLOGY OFFICER II (OIC-DIVISION CHIEF, CONCURRENT)',
                'department_agency'     => 'DEPARTMENT OF SCIENCE AND TECHNOLOGY REGIONAL OFFICE IV-A, BIÑAN, LAGUNA',
                'status_of_appointment' => 'PERMANENT (CONCURRENT)',
                'is_government_service' => 'Y',
                'order'                 => 14,
            ],
            // ─── Government Service - City Government of Manila ───────────────
            [
                'date_from'             => '2017-07-01',
                'date_to'               => '2018-06-30',
                'position_title'        => 'SYSTEMS ANALYST',
                'department_agency'     => 'MANAGEMENT INFORMATION SYSTEMS OFFICE, CITY GOVERNMENT OF MANILA, MANILA',
                'status_of_appointment' => 'PERMANENT',
                'is_government_service' => 'Y',
                'order'                 => 15,
            ],
            // ─── Private - Consultancy (Concurrent, After-hours) ─────────────
            [
                'date_from'             => '2018-01-08',
                'date_to'               => '2018-08-31',
                'position_title'        => 'WEB APPLICATION CONSULTANT',
                'department_agency'     => 'DIGITAL INNOVATIONS CORP., SALCEDO VILLAGE, MAKATI CITY',
                'status_of_appointment' => 'CONSULTANCY',
                'is_government_service' => 'N',
                'order'                 => 16,
            ],
            // ─── Government - City of Manila (Continuing) ────────────────────
            [
                'date_from'             => '2018-07-01',
                'date_to'               => '2019-06-30',
                'position_title'        => 'SYSTEMS ANALYST (OIC-SECTION HEAD, CONCURRENT)',
                'department_agency'     => 'MANAGEMENT INFORMATION SYSTEMS OFFICE, CITY GOVERNMENT OF MANILA, MANILA',
                'status_of_appointment' => 'PERMANENT (CONCURRENT)',
                'is_government_service' => 'Y',
                'order'                 => 17,
            ],
            [
                'date_from'             => '2019-07-01',
                'date_to'               => '2020-06-30',
                'position_title'        => 'SYSTEMS ANALYST (OIC-DIVISION CHIEF, CONCURRENT)',
                'department_agency'     => 'MANAGEMENT INFORMATION SYSTEMS OFFICE, CITY GOVERNMENT OF MANILA, MANILA',
                'status_of_appointment' => 'PERMANENT (CONCURRENT)',
                'is_government_service' => 'Y',
                'order'                 => 18,
            ],
            [
                'date_from'             => '2019-10-01',
                'date_to'               => '2020-06-30',
                'position_title'        => 'IT INFRASTRUCTURE ADVISER (CONCURRENT)',
                'department_agency'     => 'MANILA WATERWORKS AND SEWERAGE SYSTEM, ARROCEROS STREET, MANILA',
                'status_of_appointment' => 'CONTRACT OF SERVICE',
                'is_government_service' => 'Y',
                'order'                 => 19,
            ],
            [
                'date_from'             => '2020-07-01',
                'date_to'               => '2022-03-31',
                'position_title'        => 'SENIOR SYSTEMS ANALYST',
                'department_agency'     => 'MANAGEMENT INFORMATION SYSTEMS OFFICE, CITY GOVERNMENT OF MANILA, MANILA',
                'status_of_appointment' => 'PERMANENT',
                'is_government_service' => 'Y',
                'order'                 => 20,
            ],
            // ─── Private - Consultancy (Concurrent) ──────────────────────────
            [
                'date_from'             => '2021-03-01',
                'date_to'               => '2021-12-31',
                'position_title'        => 'IT CONSULTANT',
                'department_agency'     => 'PHILIPPINE CHAMBER OF COMMERCE AND INDUSTRY - ICT COMMITTEE, MANILA',
                'status_of_appointment' => 'CONSULTANCY',
                'is_government_service' => 'N',
                'order'                 => 21,
            ],
            // ─── Government - City of Manila (Present) ───────────────────────
            [
                'date_from'             => '2022-04-01',
                'date_to'               => '2022-12-31',
                'position_title'        => 'SENIOR SYSTEMS ANALYST (DIVISION HEAD, CONCURRENT)',
                'department_agency'     => 'MANAGEMENT INFORMATION SYSTEMS OFFICE, CITY GOVERNMENT OF MANILA, MANILA',
                'status_of_appointment' => 'PERMANENT (CONCURRENT)',
                'is_government_service' => 'Y',
                'order'                 => 22,
            ],
            [
                'date_from'             => '2023-01-02',
                'date_to'               => null,
                'position_title'        => 'SENIOR SYSTEMS ANALYST (DIVISION HEAD)',
                'department_agency'     => 'MANAGEMENT INFORMATION SYSTEMS OFFICE, CITY GOVERNMENT OF MANILA, MANILA',
                'status_of_appointment' => 'PERMANENT',
                'is_government_service' => 'Y',
                'order'                 => 23,
            ],
            [
                'date_from'             => '2023-03-01',
                'date_to'               => '2023-12-31',
                'position_title'        => 'ICT COORDINATOR (CONCURRENT)',
                'department_agency'     => 'MANILA ECONOMIC AND CULTURAL OFFICE - ICT SUBCOMMITTEE, MANILA CITY HALL, MANILA',
                'status_of_appointment' => 'PERMANENT (CONCURRENT)',
                'is_government_service' => 'Y',
                'order'                 => 24,
            ],
            // ─── Private - Contract (Concurrent) ─────────────────────────────
            [
                'date_from'             => '2023-06-05',
                'date_to'               => '2024-02-29',
                'position_title'        => 'SYSTEMS INTEGRATION LEAD (PROJECT-BASED)',
                'department_agency'     => 'SMART COMMUNICATIONS INC., MAKATI CITY',
                'status_of_appointment' => 'CONTRACT',
                'is_government_service' => 'N',
                'order'                 => 25,
            ],
            // ─── Government - Concurrent (Present) ───────────────────────────
            [
                'date_from'             => '2024-01-08',
                'date_to'               => null,
                'position_title'        => 'ICT PROJECT OFFICER (CONCURRENT)',
                'department_agency'     => 'MANILA CITY COUNCIL - COMMITTEE ON SCIENCE AND TECHNOLOGY, MANILA CITY HALL, MANILA',
                'status_of_appointment' => 'PERMANENT (CONCURRENT)',
                'is_government_service' => 'Y',
                'order'                 => 26,
            ],
            // ─── Private - Consultancy (Concurrent, Present) ─────────────────
            [
                'date_from'             => '2024-06-01',
                'date_to'               => null,
                'position_title'        => 'DIGITAL TRANSFORMATION CONSULTANT (CONCURRENT)',
                'department_agency'     => 'ACCENTURE PHILIPPINES INC., BONIFACIO GLOBAL CITY, TAGUIG CITY',
                'status_of_appointment' => 'CONSULTANCY',
                'is_government_service' => 'N',
                'order'                 => 27,
            ],
        ];

        foreach ($workExperiences as $we) {
            DB::table('work_experiences')->insert([
                'user_id'               => $userId,
                'date_from'             => $we['date_from'],
                'date_to'               => $we['date_to'],
                'position_title'        => $we['position_title'],
                'department_agency'     => $we['department_agency'],
                'status_of_appointment' => $we['status_of_appointment'],
                'is_government_service' => $we['is_government_service'],
                'order'                 => $we['order'],
                'created_at'            => now(),
                'updated_at'            => now(),
            ]);
        }

        // ── VI. Voluntary Work (7 entries) ───────────────────────────
        $voluntaryWorks = [
            [
                'org_name_address' => 'PHILIPPINE RED CROSS - MANILA CHAPTER, PALACIO DEL GOBERNADOR, INTRAMUROS, MANILA',
                'date_from'        => '2013-09-01',
                'date_to'          => '2013-09-30',
                'hours'            => 40,
                'position'         => 'VOLUNTEER BLOOD DONOR COORDINATOR',
                'order'            => 0,
            ],
            [
                'org_name_address' => 'GAWAD KALINGA COMMUNITY DEVELOPMENT FOUNDATION, INCORPORATED, 61 JOHN STREET, MURPHY, CUBAO, QUEZON CITY',
                'date_from'        => '2015-04-10',
                'date_to'          => '2015-04-12',
                'hours'            => 24,
                'position'         => 'COMMUNITY VOLUNTEER - LIVELIHOOD WORKSHOP FACILITATOR',
                'order'            => 1,
            ],
            [
                'org_name_address' => 'MANILA YOUTH COUNCIL - BARANGAY 1, CITY OF MANILA, METRO MANILA',
                'date_from'        => '2019-06-01',
                'date_to'          => '2020-05-31',
                'hours'            => 120,
                'position'         => 'INFORMATION TECHNOLOGY ADVISER',
                'order'            => 2,
            ],
            [
                'org_name_address' => 'DEPED MANILA - BRIGADA ESKWELA, DIVISION OF CITY SCHOOLS MANILA, LEPANTO STREET, SAMPALOC, MANILA',
                'date_from'        => '2016-06-06',
                'date_to'          => '2016-06-10',
                'hours'            => 40,
                'position'         => 'VOLUNTEER IT SYSTEMS INSTALLER AND CONFIGURATOR',
                'order'            => 3,
            ],
            [
                'org_name_address' => 'DEPARTMENT OF HEALTH - OPLAN BAKUNA, MANILA HEALTH DEPARTMENT, STA. CRUZ, MANILA',
                'date_from'        => '2021-03-01',
                'date_to'          => '2021-03-31',
                'hours'            => 80,
                'position'         => 'IT DATA ENCODER AND CONTACT TRACING SYSTEM VOLUNTEER',
                'order'            => 4,
            ],
            [
                'org_name_address' => 'PARISH PASTORAL COUNCIL FOR RESPONSIBLE VOTING (PPCRV), EDSA, QUEZON CITY',
                'date_from'        => '2022-05-09',
                'date_to'          => '2022-05-09',
                'hours'            => 16,
                'position'         => 'IT / DATA PROCESSING VOLUNTEER',
                'order'            => 5,
            ],
            [
                'org_name_address' => 'PHILIPPINE COMPUTER SOCIETY - COMMUNITY IT TRAINING PROGRAM, PCS BUILDING, ORTIGAS, PASIG CITY',
                'date_from'        => '2023-07-15',
                'date_to'          => '2023-07-22',
                'hours'            => 56,
                'position'         => 'IT TRAINER AND SESSION FACILITATOR',
                'order'            => 6,
            ],
        ];

        foreach ($voluntaryWorks as $vw) {
            DB::table('voluntary_works')->insert([
                'user_id'          => $userId,
                'org_name_address' => $vw['org_name_address'],
                'date_from'        => $vw['date_from'],
                'date_to'          => $vw['date_to'],
                'hours'            => $vw['hours'],
                'position'         => $vw['position'],
                'order'            => $vw['order'],
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);
        }

        // ── VII. Learning and Development (21 entries) ───────────────
        $learningDevelopments = [
            
            [
                'title'        => 'RECORDS MANAGEMENT AND DOCUMENT TRACKING SYSTEM TRAINING',
                'date_from'    => '2013-05-06',
                'date_to'      => '2013-05-08',
                'hours'        => 24,
                'ld_type'      => 'TECHNICAL',
                'conducted_by' => 'CIVIL SERVICE COMMISSION REGIONAL OFFICE IV-A',
                'order'        => 1,
            ],
            [
                'title'        => 'SUPERVISORY DEVELOPMENT COURSE',
                'date_from'    => '2015-09-21',
                'date_to'      => '2015-09-25',
                'hours'        => 40,
                'ld_type'      => 'SUPERVISORY',
                'conducted_by' => 'CIVIL SERVICE COMMISSION REGIONAL OFFICE IV-A',
                'order'        => 2,
            ],
            [
                'title'        => 'PROJECT MANAGEMENT FOR INFORMATION TECHNOLOGY PROFESSIONALS',
                'date_from'    => '2016-07-11',
                'date_to'      => '2016-07-15',
                'hours'        => 40,
                'ld_type'      => 'TECHNICAL',
                'conducted_by' => 'DEVELOPMENT ACADEMY OF THE PHILIPPINES',
                'order'        => 3,
            ],
            [
                'title'        => 'STRATEGIC PERFORMANCE MANAGEMENT SYSTEM ORIENTATION AND WORKSHOP',
                'date_from'    => '2018-03-19',
                'date_to'      => '2018-03-20',
                'hours'        => 16,
                'ld_type'      => 'MANAGERIAL',
                'conducted_by' => 'CITY GOVERNMENT OF MANILA - HUMAN RESOURCE MANAGEMENT OFFICE',
                'order'        => 4,
            ],
            [
                'title'        => 'INFORMATION SYSTEMS SECURITY AND DATA PRIVACY AWARENESS TRAINING',
                'date_from'    => '2019-10-07',
                'date_to'      => '2019-10-09',
                'hours'        => 24,
                'ld_type'      => 'TECHNICAL',
                'conducted_by' => 'NATIONAL PRIVACY COMMISSION',
                'order'        => 5,
            ],
            [
                'title'        => 'LEADERSHIP AND INNOVATION IN PUBLIC SERVICE PROGRAM',
                'date_from'    => '2021-11-15',
                'date_to'      => '2021-11-19',
                'hours'        => 40,
                'ld_type'      => 'MANAGERIAL',
                'conducted_by' => 'DEVELOPMENT ACADEMY OF THE PHILIPPINES',
                'order'        => 6,
            ],
            [
                'title'        => 'ORIENTATION PROGRAM FOR NEW GOVERNMENT EMPLOYEES',
                'date_from'    => '2011-09-05',
                'date_to'      => '2011-09-09',
                'hours'        => 40,
                'ld_type'      => 'FOUNDATION',
                'conducted_by' => 'DEPARTMENT OF SCIENCE AND TECHNOLOGY REGIONAL OFFICE IV-A - HUMAN RESOURCE MANAGEMENT OFFICE',
                'order'        => 7,
            ],
            [
                'title'        => 'INTRODUCTION TO GEOGRAPHIC INFORMATION SYSTEMS (GIS) SEMINAR',
                'date_from'    => '2012-06-04',
                'date_to'      => '2012-06-06',
                'hours'        => 24,
                'ld_type'      => 'TECHNICAL',
                'conducted_by' => 'DEPARTMENT OF SCIENCE AND TECHNOLOGY REGIONAL OFFICE IV-A',
                'order'        => 8,
            ],
            [
                'title'        => 'CUSTOMER SERVICE EXCELLENCE IN GOVERNMENT WORKSHOP',
                'date_from'    => '2013-08-19',
                'date_to'      => '2013-08-20',
                'hours'        => 16,
                'ld_type'      => 'FOUNDATION',
                'conducted_by' => 'CIVIL SERVICE COMMISSION REGIONAL OFFICE IV-A',
                'order'        => 9,
            ],
            [
                'title'        => 'NETWORK ADMINISTRATION AND CYBERSECURITY FUNDAMENTALS TRAINING',
                'date_from'    => '2014-11-10',
                'date_to'      => '2014-11-14',
                'hours'        => 40,
                'ld_type'      => 'TECHNICAL',
                'conducted_by' => 'DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY',
                'order'        => 10,
            ],
            [
                'title'        => 'PUBLIC FINANCIAL MANAGEMENT TRAINING FOR NON-FINANCE OFFICERS',
                'date_from'    => '2015-02-16',
                'date_to'      => '2015-02-18',
                'hours'        => 24,
                'ld_type'      => 'MANAGERIAL',
                'conducted_by' => 'DEPARTMENT OF BUDGET AND MANAGEMENT REGIONAL OFFICE IV-A',
                'order'        => 11,
            ],
            [
                'title'        => 'AGILE PROJECT MANAGEMENT WORKSHOP',
                'date_from'    => '2016-10-17',
                'date_to'      => '2016-10-19',
                'hours'        => 24,
                'ld_type'      => 'TECHNICAL',
                'conducted_by' => 'DEVELOPMENT ACADEMY OF THE PHILIPPINES',
                'order'        => 12,
            ],
            [
                'title'        => 'GENDER AND DEVELOPMENT ORIENTATION SEMINAR',
                'date_from'    => '2017-04-24',
                'date_to'      => '2017-04-25',
                'hours'        => 16,
                'ld_type'      => 'FOUNDATION',
                'conducted_by' => 'PHILIPPINE COMMISSION ON WOMEN / CITY GOVERNMENT OF MANILA - HRMO',
                'order'        => 13,
            ],
            [
                'title'        => 'CLOUD COMPUTING AND INFRASTRUCTURE MANAGEMENT TRAINING',
                'date_from'    => '2018-08-13',
                'date_to'      => '2018-08-17',
                'hours'        => 40,
                'ld_type'      => 'TECHNICAL',
                'conducted_by' => 'DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY',
                'order'        => 14,
            ],
            [
                'title'        => 'ADVANCED PROJECT MANAGEMENT FOR INFORMATION TECHNOLOGY PROFESSIONALS',
                'date_from'    => '2019-02-25',
                'date_to'      => '2019-03-01',
                'hours'        => 40,
                'ld_type'      => 'TECHNICAL',
                'conducted_by' => 'DEVELOPMENT ACADEMY OF THE PHILIPPINES',
                'order'        => 15,
            ],
            [
                'title'        => 'PUBLIC SERVICE VALUES ORIENTATION WORKSHOP',
                'date_from'    => '2019-08-05',
                'date_to'      => '2019-08-06',
                'hours'        => 16,
                'ld_type'      => 'FOUNDATION',
                'conducted_by' => 'CIVIL SERVICE COMMISSION REGIONAL OFFICE NCR',
                'order'        => 16,
            ],
            [
                'title'        => 'DATA ANALYTICS AND BUSINESS INTELLIGENCE TRAINING (ONLINE)',
                'date_from'    => '2020-10-19',
                'date_to'      => '2020-10-23',
                'hours'        => 40,
                'ld_type'      => 'TECHNICAL',
                'conducted_by' => 'DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY (VIRTUAL DELIVERY)',
                'order'        => 17,
            ],
            [
                'title'        => 'ANTI-RED TAPE AUTHORITY (ARTA) COMPLIANCE AND EASE OF DOING BUSINESS TRAINING',
                'date_from'    => '2021-03-08',
                'date_to'      => '2021-03-09',
                'hours'        => 16,
                'ld_type'      => 'FOUNDATION',
                'conducted_by' => 'ANTI-RED TAPE AUTHORITY / CITY GOVERNMENT OF MANILA - HRMO',
                'order'        => 18,
            ],
            [
                'title'        => 'DIGITAL TRANSFORMATION FOR GOVERNMENT MANAGERS',
                'date_from'    => '2022-09-12',
                'date_to'      => '2022-09-16',
                'hours'        => 40,
                'ld_type'      => 'MANAGERIAL',
                'conducted_by' => 'DEVELOPMENT ACADEMY OF THE PHILIPPINES',
                'order'        => 19,
            ],
            [
                'title'        => 'CYBERSECURITY INCIDENT RESPONSE AND MANAGEMENT WORKSHOP',
                'date_from'    => '2023-05-22',
                'date_to'      => '2023-05-26',
                'hours'        => 40,
                'ld_type'      => 'TECHNICAL',
                'conducted_by' => 'DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY',
                'order'        => 20,
            ],
        ];

        foreach ($learningDevelopments as $ld) {
            DB::table('learning_developments')->insert([
                'user_id'      => $userId,
                'title'        => $ld['title'],
                'date_from'    => $ld['date_from'],
                'date_to'      => $ld['date_to'],
                'hours'        => $ld['hours'],
                'ld_type'      => $ld['ld_type'],
                'conducted_by' => $ld['conducted_by'],
                'order'        => $ld['order'],
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }

        // ── VIII. Other Information ──────────────────────────────────
        DB::table('other_information')->insertOrIgnore([
            'user_id'                   => $userId,

            // Special Skills and Hobbies (7 entries)
            'special_skills'            => json_encode([
                'WEB APPLICATION DEVELOPMENT (PHP / LARAVEL / REACT)',
                'DATABASE ADMINISTRATION (MYSQL, POSTGRESQL)',
                'NETWORK INFRASTRUCTURE CONFIGURATION',
                'PHOTOGRAPHY AND DIGITAL PHOTO EDITING',
                'AMATEUR BASKETBALL PLAYER',
                'BASIC VIDEO EDITING AND MULTIMEDIA PRODUCTION',
                'AMATEUR RADIO OPERATION (CALLSIGN: DU1JDC)',
            ]),

            // Non-Academic Distinctions / Recognition (7 entries)
            'non_academic_distinctions' => json_encode([
                'MOST OUTSTANDING INFORMATION TECHNOLOGY OFFICER - DOST REGION IV-A, 2016',
                'BEST INFORMATION TECHNOLOGY INNOVATION AWARD - CITY GOVERNMENT OF MANILA, 2020',
                'CERTIFICATE OF COMMENDATION - CIVIL SERVICE COMMISSION, 2018',
                'REGIONAL SEARCH FOR OUTSTANDING GOVERNMENT EMPLOYEES (SOGE) NOMINEE - DOST REGION IV-A, 2017',
                'TEN OUTSTANDING MISO EMPLOYEES AWARD - CITY GOVERNMENT OF MANILA, 2019',
                'DANGAL NG BAYAN AWARD (INTEGRITY CATEGORY) - CIVIL SERVICE COMMISSION NCR, 2021',
                'PRESIDENTIAL MERIT AWARD FOR PUBLIC SERVICE EXCELLENCE - OFFICE OF THE PRESIDENT / CSC, 2023',
            ]),

            // Membership in Association / Organization (7 entries)
            'organization_memberships'  => json_encode([
                'PHILIPPINE COMPUTER SOCIETY',
                'ASSOCIATION OF INFORMATION TECHNOLOGY PROFESSIONALS OF THE PHILIPPINES',
                'MANILA GOVERNMENT EMPLOYEES ASSOCIATION',
                'INSTITUTE OF ELECTRONICS ENGINEERS OF THE PHILIPPINES (IECEP)',
                'DATA PRIVACY OFFICERS NETWORK PHILIPPINES',
                'PHILIPPINE GOVERNMENT INFORMATION SYSTEMS PLAN TECHNICAL WORKING GROUP',
                'GOVERNMENT IT PRACTITIONERS ALLIANCE OF THE PHILIPPINES',
            ]),

            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ── IX. Final Form - Questions 34–41 ────────────────────────
        DB::table('pds_final_forms')->insertOrIgnore([
            'user_id' => $userId,

            // Q34 - No relatives in appointing authority within 3rd/4th degree
            'q34a'        => false,
            'q34b'        => false,
            'q34_details' => null,

            // Q35 - No administrative offense; no criminal charge
            'q35a'            => false,
            'q35a_details'    => null,
            'q35b'            => false,
            'q35b_date_filed' => null,
            'q35b_status'     => null,

            // Q36 - No criminal conviction
            'q36'         => false,
            'q36_details' => null,

            // Q37 - No separation from service
            'q37'         => false,
            'q37_details' => null,

            // Q38 - No election candidacy; no campaign-related resignation
            'q38a'         => false,
            'q38a_details' => null,
            'q38b'         => false,
            'q38b_details' => null,

            // Q39 - Not an immigrant or permanent resident of another country
            'q39'         => false,
            'q39_details' => null,

            // Q40 - Not indigenous / no disability / not a solo parent
            'q40a'         => false,
            'q40a_details' => null,
            'q40b'         => false,
            'q40b_details' => null,
            'q40c'         => false,
            'q40c_details' => null,

            // Q41 - References (3 persons, not related to applicant)
            'ref1_name'    => 'ATTY. ROBERTO C. VILLANUEVA',
            'ref1_address' => 'OFFICE OF THE CITY LEGAL OFFICER, CITY HALL BUILDING, PADRE BURGOS STREET, CITY OF MANILA',
            'ref1_contact' => '(02) 5250-4000 LOCAL 1102',

            'ref2_name'    => 'DR. CYNTHIA R. MACARAEG',
            'ref2_address' => 'COLLEGE OF INFORMATION TECHNOLOGY, POLYTECHNIC UNIVERSITY OF THE PHILIPPINES, ANONAS STREET, STA. MESA, MANILA',
            'ref2_contact' => '09189876543 / C.MACARAEG@PUP.EDU.PH',

            'ref3_name'    => 'ENGR. MARCO L. TIONGCO',
            'ref3_address' => 'INFORMATION AND COMMUNICATIONS TECHNOLOGY OFFICE, C.P. GARCIA AVENUE, DILIMAN, QUEZON CITY',
            'ref3_contact' => '(02) 8920-0101 / M.TIONGCO@DICT.GOV.PH',

            // Government Issued ID
            'gov_id_type'         => "DRIVER'S LICENSE",
            'gov_id_number'       => 'N03-12-345678',
            'gov_id_date_issued'  => '2019-04-18',
            

            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}