<?php

namespace App\Services\PDS;

trait PDS_CSC_FILLER_P1
{
    // ── Page 1: Special field groups ──────────────────────────────────
    protected array $smallFields = [
        'edu_elem_units',
        'edu_sec_units',
        'edu_voc_units',
        'edu_col_units',
        'edu_grad_units',
    ];

    protected array $honorsFields = [
        'edu_elem_honors',
        'edu_sec_honors',
        'edu_voc_honors',
        'edu_col_honors',
        'edu_grad_honors',
    ];

    protected array $attendanceFields = [
        'edu_elem_from', 'edu_elem_to',
        'edu_sec_from',  'edu_sec_to',
        'edu_voc_from',  'edu_voc_to',
        'edu_col_from',  'edu_col_to',
        'edu_grad_from', 'edu_grad_to',
    ];

    // ── Page 1: Coordinate map ────────────────────────────────────────
    protected array $map = [
        'last_name'           => [43.0,  44],
        'first_name'          => [43.0,  49.5],
        'middle_name'         => [43.0,  55.5],
        'suffix'              => [178.0, 50.5],
        'date_of_birth'       => [43.0,  64.0],
        'birth_place'         => [43.0,  72.5],
        'height_cm'           => [43.0,  99.0],
        'weight_kg'           => [43.0,  105.7],
        'blood_type'          => [43.0,  112.3],
        'umid_no'             => [43.0,  119.7],
        'pagibig_no'          => [43.0,  127],
        'philhealth_no'       => [43.0,  133],
        'philsys_no'          => [43.0,  140],
        'tin_no'              => [43.0,  147],
        'employee_id'         => [43.0,  154],
        'telephone_no'        => [123.7, 139.7],
        'mobile_no'           => [123.7, 146.5],
        'email'               => [123.7, 153.4],
        'citizenship_country' => [153.9,  80],
        'chk_male'            => [42,    79.8],
        'chk_female'          => [70.5,  79.8],
        'chk_single'          => [42,    85.8],
        'chk_married'         => [70.5,  85.8],
        'chk_widowed'         => [42,    89.6],
        'chk_separated'       => [70.5,  89.6],
        'chk_other'           => [42,    93.5],
        'chk_filipino'        => [135.4, 64],
        'chk_dual'            => [153.9, 64],
        'chk_by_birth'        => [158.9, 68.3],
        'chk_by_nat'          => [174.4, 68.3],
        'res_house'           => [123.7, 85],
        'res_street'          => [163.5, 85],
        'res_subdivision'     => [123.7, 91.5],
        'res_barangay'        => [163.5, 91.5],
        'res_city'            => [123.7, 98.5],
        'res_province'        => [163.5, 98.5],
        'res_zip'             => [123.7, 106.5],
        'perm_house'          => [123.7, 111],
        'perm_street'         => [163.5, 111],
        'perm_subdivision'    => [123.7, 118.2],
        'perm_barangay'       => [163.5, 118.2],
        'perm_city'           => [123.7, 125],
        'perm_province'       => [163.5, 125],
        'perm_zip'            => [123.7, 133.2],
        'spouse_surname'      => [43,    164.5],
        'spouse_first_name'   => [43,    171],
        'spouse_suffix'       => [109.5, 171],
        'spouse_middle_name'  => [43,    176.5],
        'spouse_occupation'   => [43,    182.5],
        'spouse_employer'     => [43,    188],
        'spouse_business_addr' => [43,   193.7],
        'spouse_telephone'    => [43,    199.5],
        'father_surname'      => [43,    205.7],
        'father_first_name'   => [43,    211.1],
        'father_suffix'       => [109.5, 211.1],
        'father_middle_name'  => [43,    217],
        'mother_surname'      => [43,    228.7],
        'mother_first_name'   => [43,    234.7],
        'mother_middle_name'  => [43,    239.9],
        'edu_elem_school'     => [40,    263.5],
        'edu_elem_degree'     => [89,    263.5],
        'edu_elem_from'       => [132.5, 263.5],
        'edu_elem_to'         => [143.5, 263.5],
        'edu_elem_units'      => [156.0, 263.5],
        'edu_elem_year'       => [174,   263.5],
        'edu_elem_honors'     => [188.5, 263.5],
        'edu_sec_school'      => [40,    271.5],
        'edu_sec_degree'      => [89,    271.5],
        'edu_sec_from'        => [132.5, 271.5],
        'edu_sec_to'          => [143.5, 271.5],
        'edu_sec_units'       => [156,   271.5],
        'edu_sec_year'        => [174,   271.5],
        'edu_sec_honors'      => [188.5, 271.5],
        'edu_voc_school'      => [40,    279.5],
        'edu_voc_degree'      => [89,    279.5],
        'edu_voc_from'        => [132.5, 279.5],
        'edu_voc_to'          => [143.5, 279.5],
        'edu_voc_units'       => [156,   279.5],
        'edu_voc_year'        => [174,   279.5],
        'edu_voc_honors'      => [188.5, 279.5],
        'edu_col_school'      => [40,    287.5],
        'edu_col_degree'      => [89,    287.5],
        'edu_col_from'        => [132.5, 287.5],
        'edu_col_to'          => [143.5, 287.5],
        'edu_col_units'       => [156,   287.5],
        'edu_col_year'        => [174,   287.5],
        'edu_col_honors'      => [188.5, 287.5],
        'edu_grad_school'     => [40,    295.5],
        'edu_grad_degree'     => [89,    295.5],
        'edu_grad_from'       => [132.5, 295.5],
        'edu_grad_to'         => [143.5, 295.5],
        'edu_grad_units'      => [156,   295.5],
        'edu_grad_year'       => [174,   295.5],
        'edu_grad_honors'     => [188.5, 295.5],
    ];

    // ── Page 1: Children row positions [nameX, dobX, rowY] ───────────
    protected array $childRows = [
        0  => [120, 178, 171],
        1  => [120, 178, 176.5],
        2  => [120, 178, 182.5],
        3  => [120, 178, 188],
        4  => [120, 178, 193.7],
        5  => [120, 178, 199.5],
        6  => [120, 178, 205.7],
        7  => [120, 178, 211.1],
        8  => [120, 178, 217],
        9  => [120, 178, 228.7],
        10 => [120, 178, 234.7],
        11 => [120, 178, 239.9],
    ];

    // ── Page 1: Personal information text config [maxWidth, lineHeight] ─
    // Widths derived from coordinate geometry (A4 = 210 mm):
    //   Left column (x ≈ 43):        right boundary ≈ 120 mm → ~75 mm wide
    //   Right column pairs:           split at x ≈ 163.5     → ~35 / ~25 mm
    //   Right column contact (x≈123.7): right boundary ≈ 187  → ~60 mm wide
    //   Spouse/father fields with suffix at x=109.5:          → ~62 mm
    protected array $p1PersonalInfoTextConfig = [
        // ── Name block ────────────────────────────────────────────────
        'last_name'            => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'first_name'           => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'middle_name'          => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'suffix'               => ['maxWidth' => 20,  'lineHeight' => 3.5],
        // ── Birth / physical ──────────────────────────────────────────
        'date_of_birth'        => ['maxWidth' => 55,  'lineHeight' => 3.5],
        'birth_place'          => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'height_cm'            => ['maxWidth' => 30,  'lineHeight' => 3.5],
        'weight_kg'            => ['maxWidth' => 30,  'lineHeight' => 3.5],
        'blood_type'           => ['maxWidth' => 30,  'lineHeight' => 3.5],
        // ── Government IDs ────────────────────────────────────────────
        'umid_no'              => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'pagibig_no'           => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'philhealth_no'        => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'philsys_no'           => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'tin_no'               => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'employee_id'          => ['maxWidth' => 75,  'lineHeight' => 3.5],
        // ── Contact (right column) ────────────────────────────────────
        'telephone_no'         => ['maxWidth' => 60,  'lineHeight' => 3.5],
        'mobile_no'            => ['maxWidth' => 60,  'lineHeight' => 3.5],
        'email'                => ['maxWidth' => 60,  'lineHeight' => 3.5], // rendered as hyperlink
        // ── Citizenship ───────────────────────────────────────────────
        'citizenship_country'  => ['maxWidth' => 45,  'lineHeight' => 3.5],
        // ── Residential address ───────────────────────────────────────
        'res_house'            => ['maxWidth' => 35,  'lineHeight' => 3.5],
        'res_street'           => ['maxWidth' => 25,  'lineHeight' => 3.5],
        'res_subdivision'      => ['maxWidth' => 35,  'lineHeight' => 3.5],
        'res_barangay'         => ['maxWidth' => 25,  'lineHeight' => 3.5],
        'res_city'             => ['maxWidth' => 35,  'lineHeight' => 3.5],
        'res_province'         => ['maxWidth' => 25,  'lineHeight' => 3.5],
        'res_zip'              => ['maxWidth' => 35,  'lineHeight' => 3.5],
        // ── Permanent address ─────────────────────────────────────────
        'perm_house'           => ['maxWidth' => 35,  'lineHeight' => 3.5],
        'perm_street'          => ['maxWidth' => 25,  'lineHeight' => 3.5],
        'perm_subdivision'     => ['maxWidth' => 35,  'lineHeight' => 3.5],
        'perm_barangay'        => ['maxWidth' => 25,  'lineHeight' => 3.5],
        'perm_city'            => ['maxWidth' => 35,  'lineHeight' => 3.5],
        'perm_province'        => ['maxWidth' => 25,  'lineHeight' => 3.5],
        'perm_zip'             => ['maxWidth' => 35,  'lineHeight' => 3.5],
        // ── Spouse ───────────────────────────────────────────────────
        'spouse_surname'       => ['maxWidth' => 62,  'lineHeight' => 3.5],
        'spouse_first_name'    => ['maxWidth' => 62,  'lineHeight' => 3.5],
        'spouse_suffix'        => ['maxWidth' => 15,  'lineHeight' => 3.5],
        'spouse_middle_name'   => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'spouse_occupation'    => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'spouse_employer'      => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'spouse_business_addr' => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'spouse_telephone'     => ['maxWidth' => 75,  'lineHeight' => 3.5],
        // ── Father ───────────────────────────────────────────────────
        'father_surname'       => ['maxWidth' => 62,  'lineHeight' => 3.5],
        'father_first_name'    => ['maxWidth' => 62,  'lineHeight' => 3.5],
        'father_suffix'        => ['maxWidth' => 15,  'lineHeight' => 3.5],
        'father_middle_name'   => ['maxWidth' => 75,  'lineHeight' => 3.5],
        // ── Mother ───────────────────────────────────────────────────
        'mother_surname'       => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'mother_first_name'    => ['maxWidth' => 75,  'lineHeight' => 3.5],
        'mother_middle_name'   => ['maxWidth' => 75,  'lineHeight' => 3.5],
    ];

    // ── Page 1: Education text config [maxWidth, lineHeight] ─────────
    protected array $eduTextConfig = [
        'school' => ['maxWidth' => 45, 'lineHeight' => 2.5],
        'degree' => ['maxWidth' => 40, 'lineHeight' => 2.5],
        'from'   => ['maxWidth' => 16, 'lineHeight' => 2],
        'to'     => ['maxWidth' => 16, 'lineHeight' => 2],
        'units'  => ['maxWidth' => 16, 'lineHeight' => 2.5],
        'year'   => ['maxWidth' => 16, 'lineHeight' => 2],
        'honors' => ['maxWidth' => 16, 'lineHeight' => 2.5],
    ];

    // ── Page 1: Render ────────────────────────────────────────────────
    protected function renderPage1(array $data): void
    {
        $this->pdf->setSourceFile(storage_path('app/pdf/PDS_CSC_FORMAT.pdf'));
        $tplId = $this->pdf->importPage(1);
        $size  = $this->pdf->getTemplateSize($tplId);
        $this->pdf->AddPage('P', [$size['width'], $size['height']]);
        $this->pdf->useTemplate($tplId, 0, 0, $size['width'], $size['height']);
        $this->pdf->SetFont($this->font, 'B', $this->fontSize);

        foreach ($this->map as $field => [$x, $y]) {
            if (str_starts_with($field, 'chk_')) {
                if (!empty($data[$field])) $this->drawCheck($x, $y);
                continue;
            }
            // Email is rendered separately as a styled hyperlink — skip here
            if ($field === 'email') continue;

            $value = (string)($data[$field] ?? '');
            if ($value === '') continue;

            $config     = $this->p1PersonalInfoTextConfig[$field] ?? [];
            $maxWidth   = $config['maxWidth']  ?? 0;
            $lineHeight = $config['lineHeight'] ?? 3.5;

            $this->writeText($x, $y, $value, $maxWidth, 0, $lineHeight);
        }

        // ── Email: blue, underlined, not bold, clickable mailto link ──
        $email = (string)($data['email'] ?? '');
        if ($email !== '') {
            [$emailX, $emailY] = $this->map['email'];
            $config     = $this->p1PersonalInfoTextConfig['email'] ?? [];
            $maxWidth   = $config['maxWidth']  ?? 60;
            $lineHeight = $config['lineHeight'] ?? 3.5;

            // Shrink font to fit maxWidth, matching writeText() logic
            $size = $this->fontSize;
            while ($size >= $this->minFontSize) {
                $this->pdf->SetFont($this->font, 'U', $size);
                if ($this->pdf->GetStringWidth($email) <= $maxWidth) break;
                $size -= 0.5;
            }

            $this->pdf->SetTextColor(0, 0, 255);
            $this->pdf->SetXY($emailX, $emailY);
            $this->pdf->Write($lineHeight, $email, 'mailto:' . $email);

            // Reset to default text color and bold font for subsequent fields
            $this->pdf->SetTextColor(0, 0, 0);
            $this->pdf->SetFont($this->font, 'B', $this->fontSize);
        }

        $children = $data['children'] ?? [];
        foreach ($children as $i => $child) {
            if (!isset($this->childRows[$i])) break;
            [$nameX, $dobX, $rowY] = $this->childRows[$i];
            if (!empty($child['name'])) {
                $this->writeText($nameX, $rowY, $child['name']);
            }
            if (!empty($child['date_of_birth'])) {
                try {
                    $dob = \Carbon\Carbon::parse($child['date_of_birth'])->format('d/m/Y');
                } catch (\Exception $e) {
                    $dob = $child['date_of_birth'];
                }
                $this->writeText($dobX, $rowY, $dob);
            }
        }

        $eduLevels = [
            'elem' => $data['edu_elem'] ?? null,
            'sec'  => $data['edu_sec']  ?? null,
            'voc'  => $data['edu_voc']  ?? null,
            'col'  => $data['edu_col']  ?? null,
            'grad' => $data['edu_grad'] ?? null,
        ];

        foreach ($eduLevels as $key => $edu) {
            if (!$edu) continue;
            $fields = [
                'school' => "edu_{$key}_school",
                'degree' => "edu_{$key}_degree",
                'from'   => "edu_{$key}_from",
                'to'     => "edu_{$key}_to",
                'units'  => "edu_{$key}_units",
                'year'   => "edu_{$key}_year",
                'honors' => "edu_{$key}_honors",
            ];
            foreach ($fields as $dataKey => $mapKey) {
                $val = (string)($edu[$dataKey] ?? '');
                if ($val === '' || !isset($this->map[$mapKey])) continue;
                [$x, $y] = $this->map[$mapKey];

                $size = match (true) {
                    in_array($mapKey, $this->honorsFields)     => $this->honorsFontSize,
                    in_array($mapKey, $this->smallFields)      => $this->smallFontSize,
                    in_array($mapKey, $this->attendanceFields) => $this->attendanceFontSize,
                    default                                     => $this->fontSize,
                };

                $config     = $this->eduTextConfig[$dataKey] ?? [];
                $maxWidth   = $config['maxWidth']  ?? 0;
                $lineHeight = $config['lineHeight'] ?? 0;

                $this->writeText($x, $y, $val, $maxWidth, $size, $lineHeight);
            }
        }
    }
}
