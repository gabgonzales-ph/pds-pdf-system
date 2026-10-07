<?php

namespace App\Services\PDS;

trait PDS_CSC_FILLER_P2
{
    // ── Page 2: Civil Service Eligibility ────────────────────────────
    protected array $p2CseColumns = [
        'career_service'       => 7,
        'rating'               => 83.0,
        'date_of_examination'  => 106.0,
        'place_of_examination' => 128.0,
        'license_number'       => 162.0,
        'license_validity'     => 186.0,
    ];

    protected array $p2CseRowY = [26.5, 35, 44.5, 53.5, 62.5, 71.5, 80.5];

    protected array $p2CseTextConfig = [
        'career_service'       => ['maxWidth' => 70,  'lineHeight' => 3,   'noWrap' => false],
        'rating'               => ['maxWidth' => 18,  'lineHeight' => 3.5, 'noWrap' => false],
        'date_of_examination'  => ['maxWidth' => 18,  'lineHeight' => 2,   'noWrap' => false],
        'place_of_examination' => ['maxWidth' => 31,  'lineHeight' => 2,   'noWrap' => false],
        'license_number'       => ['maxWidth' => 18,  'lineHeight' => 2,   'noWrap' => true],
        'license_validity'     => ['maxWidth' => 20,  'lineHeight' => 3.5, 'noWrap' => false],
    ];

    // ── Page 2: Work Experience ───────────────────────────────────────
    protected array $p2WeColumns = [
        'date_from'             => 7,
        'date_to'               => 25,
        'position_title'        => 42,
        'department_agency'     => 102,
        'status_of_appointment' => 161.0,
        'is_government_service' => 185.0,
    ];

    protected float $p2WeStartY  = 122;
    protected array $p2WeRowGaps = [8, 8, 8.5, 8.5, 8, 8, 8, 8.5, 8.5, 8, 8, 8, 8.5, 8.5, 8.5, 8, 8, 8, 8.5, 8.5, 8.5, 8, 8, 8, 8, 8, 8];
    protected int   $p2WeMaxRows = 28;

    protected array $p2WeTextConfig = [
        'date_from'             => ['maxWidth' => 16, 'lineHeight' => 2.5],
        'date_to'               => ['maxWidth' => 16, 'lineHeight' => 2.5],
        'position_title'        => ['maxWidth' => 60, 'lineHeight' => 2.5],
        'department_agency'     => ['maxWidth' => 60, 'lineHeight' => 2.5],
        'monthly_salary'        => ['maxWidth' => 15, 'lineHeight' => 2.5],
        'salary_grade'          => ['maxWidth' => 9,  'lineHeight' => 3.5],
        'status_of_appointment' => ['maxWidth' => 20, 'lineHeight' => 2.5],
        'is_government_service' => ['maxWidth' => 9,  'lineHeight' => 2.5],
    ];

    // ── Page 2: Render ────────────────────────────────────────────────
    protected function renderPage2(array $data): void
    {
        $this->pdf->setSourceFile(storage_path('app/pdf/PDS_CSC_FORMAT_P2.pdf'));
        $tplId = $this->pdf->importPage(1);
        $size  = $this->pdf->getTemplateSize($tplId);
        $this->pdf->AddPage('P', [$size['width'], $size['height']]);
        $this->pdf->useTemplate($tplId, 0, 0, $size['width'], $size['height']);
        $this->pdf->SetFont($this->font, 'B', $this->fontSize);

        $eligibilities = $data['civil_service_eligibilities'] ?? [];
        foreach ($eligibilities as $i => $row) {
            if (!isset($this->p2CseRowY[$i])) break;
            $y = $this->p2CseRowY[$i];
            foreach ($this->p2CseColumns as $field => $x) {
                $val = (string)($row[$field] ?? '');
                if ($val === '') continue;

                $config     = $this->p2CseTextConfig[$field] ?? [];
                $maxWidth   = $config['maxWidth']  ?? 0;
                $lineHeight = $config['lineHeight'] ?? 3.5;
                $noWrap     = $config['noWrap']     ?? false;

                $this->writeText($x, $y, $val, $maxWidth, 0, $lineHeight, $noWrap);
            }
        }

        $workExperiences = $data['work_experiences'] ?? [];
        $y = $this->p2WeStartY;
        foreach ($workExperiences as $i => $row) {
            if ($i >= $this->p2WeMaxRows) break;
            foreach ($this->p2WeColumns as $field => $x) {
                if (in_array($field, ['date_from', 'date_to']) && !empty($row[$field])) {
                    try {
                        $val = \Carbon\Carbon::parse($row[$field])->format('d/m/Y');
                    } catch (\Exception $e) {
                        $val = (string)($row[$field] ?? '');
                    }
                } else {
                    $val = (string)($row[$field] ?? '');
                }
                if ($val === '') continue;

                $config     = $this->p2WeTextConfig[$field] ?? [];
                $maxWidth   = $config['maxWidth']  ?? 0;
                $lineHeight = $config['lineHeight'] ?? 3.5;

                $this->writeText($x, $y, $val, $maxWidth, 0, $lineHeight);
            }
            if (isset($this->p2WeRowGaps[$i])) {
                $y += $this->p2WeRowGaps[$i];
            }
        }
    }
}
