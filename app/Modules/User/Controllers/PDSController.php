<?php

namespace App\Modules\User\Controllers;

use App\Services\PDS\PDSFillerService;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PDSController
{
    public function download(): Response
    {
        $user = Auth::user()->load([
            'personalInformation',
            'familyBackground.children',
            'educationalBackgrounds',
            'civilServiceEligibilities',
            'workExperiences',
            'voluntaryWorks',
            'learningDevelopments',
            'otherInformation',
            'pdsFinalForm',
        ]);

        $pi  = $user->personalInformation;
        $fb  = $user->familyBackground;
        $edu = $user->educationalBackgrounds ?? collect();
        $cs  = $pi->civil_status ?? '';
        $cit = $pi->citizenship  ?? '';

        // ── Section I: Personal Information ──────────────────────────
        $data = [
            'last_name'           => $pi->last_name ?: 'N/A',
            'first_name'          => $pi->first_name ?: 'N/A',
            'middle_name'         => $pi->middle_name ?: 'N/A',
            'suffix'              => $pi->suffix ?: 'N/A',
            'date_of_birth'       => $pi->date_of_birth
                                        ? Carbon::parse($pi->date_of_birth)->format('d/m/Y')
                                        : 'N/A',
            'birth_place'         => $pi->birth_place ?: 'N/A',
            'height_cm'           => $pi->height_cm
                                        ? number_format($pi->height_cm / 100, 2)
                                        : 'N/A',
            'weight_kg'           => $pi->weight_kg ?: 'N/A',
            'blood_type'          => $pi->blood_type ?: 'N/A',
            'umid_no'             => $pi->umid_no ?: 'N/A',
            'pagibig_no'          => $pi->pagibig_no ?: 'N/A',
            'philhealth_no'       => $pi->philhealth_no ?: 'N/A',
            'philsys_no'          => $pi->philsys_no ?: 'N/A',
            'tin_no'              => $pi->tin_no ?: 'N/A',
            'employee_id'         => $user->employee_id ?: 'N/A',
            'telephone_no'        => $pi->telephone_no ?: 'N/A',
            'mobile_no'           => $pi->mobile_no ?: 'N/A',
            'email'               => $user->email ?: 'N/A',
            'citizenship_country' => str_contains($cit, '(')
                                        ? trim(substr($cit, strpos($cit, '(') + 1, -1))
                                        : '',
            'chk_male'            => ($pi->sex ?? '') === 'Male',
            'chk_female'          => ($pi->sex ?? '') === 'Female',
            'chk_single'          => $cs === 'Single',
            'chk_married'         => $cs === 'Married',
            'chk_widowed'         => $cs === 'Widowed',
            'chk_separated'       => $cs === 'Separated',
            'chk_other'           => $cs === 'Other/s',
            'chk_filipino'        => $cit === 'Filipino',
            'chk_dual'            => str_starts_with($cit, 'Dual'),
            'chk_by_birth'        => str_contains($cit, 'By birth'),
            'chk_by_nat'          => str_contains($cit, 'By naturalization'),
            'res_house'           => $pi->house_block_lot_no ?: 'N/A',
            'res_street'          => $pi->street ?: 'N/A',
            'res_subdivision'     => $pi->subdivision_village ?: 'N/A',
            'res_barangay'        => $pi->barangay ?: 'N/A',
            'res_city'            => $pi->city_municipality ?: 'N/A',
            'res_province'        => $pi->province ?: 'N/A',
            'res_zip'             => $pi->zip_code ?: 'N/A',
            'perm_house'          => $pi->perm_house_block_lot_no ?: 'N/A',
            'perm_street'         => $pi->perm_street ?: 'N/A',
            'perm_subdivision'    => $pi->perm_subdivision_village ?: 'N/A',
            'perm_barangay'       => $pi->perm_barangay ?: 'N/A',
            'perm_city'           => $pi->perm_city ?: 'N/A',
            'perm_province'       => $pi->perm_province ?: 'N/A',
            'perm_zip'            => $pi->perm_zip_code ?: 'N/A',
        ];

        // ── Section II: Family Background ────────────────────────────
        $data['spouse_surname']       = $fb?->spouse_surname ?: 'N/A';
        $data['spouse_first_name']    = $fb?->spouse_first_name ?: 'N/A';
        $data['spouse_suffix']        = $fb?->spouse_suffix ?: 'N/A';
        $data['spouse_middle_name']   = $fb?->spouse_middle_name ?: 'N/A';
        $data['spouse_occupation']    = $fb?->spouse_occupation ?: 'N/A';
        $data['spouse_employer']      = $fb?->spouse_employer ?: 'N/A';
        $data['spouse_business_addr'] = $fb?->spouse_business_address ?: 'N/A';
        $data['spouse_telephone']     = $fb?->spouse_telephone ?: 'N/A';
        $data['father_surname']       = $fb?->father_surname ?: 'N/A';
        $data['father_first_name']    = $fb?->father_first_name ?: 'N/A';
        $data['father_suffix']        = $fb?->father_suffix ?: 'N/A';
        $data['father_middle_name']   = $fb?->father_middle_name ?: 'N/A';
        $data['mother_surname']       = $fb?->mother_surname ?: 'N/A';
        $data['mother_first_name']    = $fb?->mother_first_name ?: 'N/A';
        $data['mother_middle_name']   = $fb?->mother_middle_name ?: 'N/A';

        $childrenList = ($fb?->children ?? collect())->values();
        
        if ($childrenList->isEmpty()) {
            $data['children'] = [
                [
                    'name'          => 'N/A',
                    'date_of_birth' => 'N/A'
                ]
            ];
        } else {
            $data['children'] = $childrenList->map(fn($c) => [
                'name'          => trim($c->name ?? $c->child_name ?? $c->full_name ?? '') ?: 'N/A',
                'date_of_birth' => $c->date_of_birth ?? 'N/A',
            ])->toArray();
        }

        // ── Section III: Educational Background ──────────────────────
        $levelMap = [
            'elem' => ['Elementary'],
            'sec'  => ['Secondary'],
            'voc'  => ['Vocation', 'Vocational', 'Trade'],
            'col'  => ['College'],
            'grad' => ['Graduate'],
        ];

        foreach ($levelMap as $key => $keywords) {
            $record = $edu->first(fn($e) =>
                collect($keywords)->contains(fn($k) =>
                    str_contains(strtolower($e->level), strtolower($k))
                )
            );
            
            if (!$record) {
                // Set default N/A values if the user has no record for this education level
                $data["edu_{$key}"] = [
                    'school' => 'N/A',
                    'degree' => 'N/A',
                    'from'   => 'N/A',
                    'to'     => 'N/A',
                    'units'  => 'N/A',
                    'year'   => 'N/A',
                    'honors' => 'N/A',
                ];
                continue;
            }

            $degreeCourse   = $record->degree_course ?: '';
            $academicDegree = $record->academic_degree ?: '';

            if (in_array($key, ['col', 'grad']) && $academicDegree !== '' && $degreeCourse !== '') {
                $combinedDegree = $academicDegree . ' in ' . $degreeCourse;
            } elseif ($academicDegree !== '') {
                $combinedDegree = $academicDegree;
            } elseif ($degreeCourse !== '') {
                $combinedDegree = $degreeCourse;
            } else {
                $combinedDegree = 'N/A';
            }

            $data["edu_{$key}"] = [
                'school' => $record->school_name ?: 'N/A',
                'degree' => $combinedDegree,
                'from'   => $record->attendance_from ?: 'N/A',
                'to'     => $record->attendance_to ?: 'N/A',
                'units'  => $record->highest_level ?: 'N/A',
                'year'   => $record->year_graduated ?: 'N/A',
                'honors' => $record->honors_received ?: 'N/A',
            ];
        }

        // ── Section IV: Civil Service Eligibility ────────────────────
        $data['civil_service_eligibilities'] = ($user->civilServiceEligibilities ?? collect())
            ->values()
            ->map(fn($r) => [
                'career_service'       => $r->career_service ?: 'N/A',
                'rating'               => $r->rating ?: 'N/A',
                'date_of_examination'  => $r->date_of_examination
                                            ? Carbon::parse($r->date_of_examination)->format('d/m/Y')
                                            : 'N/A',
                'place_of_examination' => $r->place_of_examination ?: 'N/A',
                'license_number'       => $r->license_number ?: 'N/A',
                'license_validity'     => $r->license_validity
                                            ? Carbon::parse($r->license_validity)->format('d/m/Y')
                                            : 'N/A',
            ])->toArray();

        // ── Section V: Work Experience ────────────────────────────────
        $data['work_experiences'] = ($user->workExperiences ?? collect())
            ->values()
            ->map(fn($r) => [
                'date_from'             => $r->date_from ?: 'N/A',
                'date_to'               => $r->date_to ?: 'N/A',
                'position_title'        => $r->position_title ?: 'N/A',
                'department_agency'     => $r->department_agency ?: 'N/A',
                'status_of_appointment' => $r->status_of_appointment ?: 'N/A',
                'is_government_service' => $r->is_government_service ?: 'N/A',
            ])->toArray();

        // ── Section VI: Voluntary Work ────────────────────────────────
        $data['voluntary_works'] = ($user->voluntaryWorks ?? collect())
            ->values()
            ->map(fn($r) => [
                'org_name_address' => $r->org_name_address ?: 'N/A',
                'date_from'        => $r->date_from ?: 'N/A',
                'date_to'          => $r->date_to ?: 'N/A',
                'hours'            => $r->hours !== null ? (string)$r->hours : 'N/A',
                'position'         => $r->position ?: 'N/A',
            ])->toArray();

        // ── Section VII: Learning & Development ──────────────────────
        $data['learning_developments'] = ($user->learningDevelopments ?? collect())
            ->values()
            ->map(fn($r) => [
                'title'        => $r->title ?: 'N/A',
                'date_from'    => $r->date_from ?: 'N/A',
                'date_to'      => $r->date_to ?: 'N/A',
                'hours'        => $r->hours !== null ? (string)$r->hours : 'N/A',
                'ld_type'      => $r->ld_type ?: 'N/A',
                'conducted_by' => $r->conducted_by ?: 'N/A',
            ])->toArray();

        // ── Section VIII: Other Information ──────────────────────────
        $oi = $user->otherInformation;
        $data['other_information'] = [
            'special_skills'            => $oi?->special_skills ?: [],
            'non_academic_distinctions' => $oi?->non_academic_distinctions ?: [],
            'organization_memberships'  => $oi?->organization_memberships ?: [],
        ];

        // ── Section IX: Final Form / Questions ───────────────────────
        $ff = $user->pdsFinalForm;
        
        // Initialize default fields to prevent undefined array key errors in PDSFillerService
        $data['pds_final_form'] = [
            'q34a' => null, 'q34_details' => 'N/A',
            'q34b' => null,
            'q35a' => null, 'q35a_details' => 'N/A',
            'q35b' => null, 'q35b_date_filed' => 'N/A', 'q35b_status' => 'N/A',
            'q36' => null, 'q36_details' => 'N/A',
            'q37' => null, 'q37_details' => 'N/A',
            'q38a' => null, 'q38a_details' => 'N/A',
            'q38b' => null, 'q38b_details' => 'N/A',
            'q39' => null, 'q39_details' => 'N/A',
            'q40a' => null, 'q40a_details' => 'N/A',
            'q40b' => null, 'q40b_details' => 'N/A',
            'q40c' => null, 'q40c_details' => 'N/A',
            'gov_id_type' => 'N/A', 'gov_id_number' => 'N/A', 'gov_id_date_issued' => '', 'gov_id_place_issued' => '',
            
        ];

        for ($i = 1; $i <= 3; $i++) {
            $data['pds_final_form']["ref{$i}_name"]    = 'N/A';
            $data['pds_final_form']["ref{$i}_address"] = 'N/A';
            $data['pds_final_form']["ref{$i}_contact"] = 'N/A';
        }

        if ($ff) {
            $data['pds_final_form']['q34a']         = $ff->q34a;
            $data['pds_final_form']['q34b']         = $ff->q34b;
            $data['pds_final_form']['q34_details']  = $ff->q34_details ?: 'N/A';

            $data['pds_final_form']['q35a']             = $ff->q35a;
            $data['pds_final_form']['q35a_details']     = $ff->q35a_details ?: 'N/A';
            $data['pds_final_form']['q35b']             = $ff->q35b;
            $data['pds_final_form']['q35b_date_filed']  = $ff->q35b_date_filed
                ? $ff->q35b_date_filed->format('m/d/Y')
                : 'N/A';
            $data['pds_final_form']['q35b_status']      = $ff->q35b_status ?: 'N/A';

            $data['pds_final_form']['q36']          = $ff->q36;
            $data['pds_final_form']['q36_details']  = $ff->q36_details ?: 'N/A';
            $data['pds_final_form']['q37']          = $ff->q37;
            $data['pds_final_form']['q37_details']  = $ff->q37_details ?: 'N/A';

            $data['pds_final_form']['q38a']         = $ff->q38a;
            $data['pds_final_form']['q38a_details'] = $ff->q38a_details ?: 'N/A';
            $data['pds_final_form']['q38b']         = $ff->q38b;
            $data['pds_final_form']['q38b_details'] = $ff->q38b_details ?: 'N/A';

            $data['pds_final_form']['q39']          = $ff->q39;
            $data['pds_final_form']['q39_details']  = $ff->q39_details ?: 'N/A';

            $data['pds_final_form']['q40a']         = $ff->q40a;
            $data['pds_final_form']['q40a_details'] = $ff->q40a_details ?: 'N/A';
            $data['pds_final_form']['q40b']         = $ff->q40b;
            $data['pds_final_form']['q40b_details'] = $ff->q40b_details ?: 'N/A';
            $data['pds_final_form']['q40c']         = $ff->q40c;
            $data['pds_final_form']['q40c_details'] = $ff->q40c_details ?: 'N/A';

            for ($i = 1; $i <= 3; $i++) {
                $data['pds_final_form']["ref{$i}_name"]    = $ff->{"ref{$i}_name"} ?: 'N/A';
                $data['pds_final_form']["ref{$i}_address"] = $ff->{"ref{$i}_address"} ?: 'N/A';
                $data['pds_final_form']["ref{$i}_contact"] = $ff->{"ref{$i}_contact"} ?: 'N/A';
            }

            $data['pds_final_form']['gov_id_type']         = $ff->gov_id_type ?: 'N/A';
            $data['pds_final_form']['gov_id_number']       = $ff->gov_id_number ?: 'N/A';
            $data['pds_final_form']['gov_id_date_issued']  = $ff->gov_id_date_issued
                ? $ff->gov_id_date_issued->format('m/d/Y') 
                : '';
            $data['pds_final_form']['gov_id_place_issued'] = $ff->gov_id_place_issued ?: '';
        }

        $pdf      = (new PDSFillerService())->generate($data);
        $filename = 'PDS_' . ($pi->last_name ?: 'user') . '.pdf';

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }
}