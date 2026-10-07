<?php

namespace App\Modules\User\Services;

class ProgressCalculator
{
    /**
     * Calculate PDS progress for a user
     *
     * @param \App\Models\User $user
     * @return array Section-wise and overall progress (0–100)
     */
    public static function calculate($user): array
    {
        $pi         = $user->personalInformation;
        $fb         = $user->familyBackground;
        $edu        = $user->educationalBackgrounds ?? collect();
        
        $civilStatus = strtolower($pi?->civil_status ?? '');
        $requiresSpouse = in_array($civilStatus, ['married', 'widowed', 'separated']);

        // ── Personal Information
        $piFields = [
            $pi?->last_name, $pi?->first_name, 
            $pi?->date_of_birth, $pi?->birth_place, $pi?->sex,
            $pi?->civil_status, $pi?->blood_type, $pi?->citizenship,
            $pi?->mobile_no,
            $pi?->region, $pi?->province, $pi?->city_municipality, $pi?->barangay,
            $pi?->perm_region, $pi?->perm_province, $pi?->perm_city, $pi?->perm_barangay,
            $user->email, $user->employee_id,
        ];
        $piScore = self::pct($piFields);

        // ── Family Background
        $fbFields = [
            $fb?->father_surname, $fb?->father_first_name,
            $fb?->mother_surname, $fb?->mother_first_name,
        ];
        
        if ($requiresSpouse) {
            $fbFields[] = $fb?->spouse_surname;
            $fbFields[] = $fb?->spouse_first_name;
            $fbFields[] = $fb?->spouse_birthdate; 
        }
        $fbScore = self::pct($fbFields);

        // ── Educational Background
        $eduScore = 0;
        foreach ($edu as $e) {
            $fields = [
                $e->school_name, 
                $e->degree_course,
                $e->attendance_from, 
                $e->attendance_to,
                $e->year_graduated ?: $e->highest_level
            ];
            
            $rowScore = self::pct($fields);
            
            if ($rowScore > $eduScore) {
                $eduScore = $rowScore;
            }
        }

        // ── Civil Service
        $cse = $user->civilServiceEligibilities ?? collect();
        $cseScore = $cse->count() > 0 ? 100 : 0;

        // ── Work Experience
        $we = $user->workExperiences ?? collect();
        $weScore = $we->count() > 0 ? 100 : 0;

        // ── Voluntary Work
        $vw = $user->voluntaryWorks ?? collect();
        $vwScore = $vw->count() > 0 ? 100 : 0;

        // ── Learning & Development
        $ld = $user->learningDevelopments ?? collect();
        $ldScore = $ld->count() > 0 ? 100 : 0;

        // ── Other Information
        $oi = $user->otherInformation;
        $oiHasData = !empty($oi?->special_skills)
                  || !empty($oi?->non_academic_distinctions)
                  || !empty($oi?->organization_memberships);
        $oiScore = $oiHasData ? 100 : 0;

        // ── Final Form
        $ff = $user->pdsFinalForm;
        $ffKeys = ['q34a','q34b','q35a','q35b','q36','q37','q38a','q38b','q39','q40a','q40b','q40c'];
        $ffTotal = count($ffKeys);
        $ffAnswered = 0;
        if ($ff) {
            foreach ($ffKeys as $key) {
                if (!is_null($ff->$key) && $ff->$key !== '') $ffAnswered++;
            }
        }
        $ffScore = $ffTotal > 0 ? round(($ffAnswered / $ffTotal) * 100) : 0;

        // ── Overall Score
        $overall = round(
            ($piScore + $fbScore + $eduScore + $cseScore + $weScore +
             $vwScore + $ldScore + $oiScore + $ffScore) / 9
        );

        return [
            'personal'        => $piScore,
            'family'          => $fbScore,
            'education'       => $eduScore,
            'civil_service'   => $cseScore,
            'work_experience' => $weScore,
            'voluntary_work'  => $vwScore,
            'learning_dev'    => $ldScore,
            'other_info'      => $oiScore,
            'final_form'      => $ffScore,
            'overall'         => $overall,
        ];
    }

    private static function pct(array $fields): int
    {
        $total = count($fields);
        $filled = count(array_filter($fields, fn($v) => !is_null($v) && $v !== ''));
        return $total > 0 ? round(($filled / $total) * 100) : 0;
    }
}