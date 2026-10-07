<?php

namespace App\Services\PDS;

trait PDS_CSC_FILLER_P4
{
    // ── Page 4: Questions [yesX, noX, detailsX, questionY, detailsY] ─
    protected array $p4Questions = [
        'q34a' => [135.5, 156,   140, 32.0,  38.5],
        'q34b' => [135.5, 156,   60.0, 44.0,  38.5],
        'q35a' => [135, 156.9, 140, 62.0,  54.5],
        'q35b' => [135, 157.5, 140, 78.0,  58],
        'q36'  => [135,   158.5, 140, 96.0,  91.7],
        'q37'  => [134.5,   158.5, 140, 112.0, 105.5],
        'q38a' => [135,   160.5, 159, 130.0, 117],
        'q38b' => [135.5, 161,   159, 146.0, 127.5],
        'q39'  => [135,   160.5, 140, 162.0, 143],
        'q40a' => [135, 161,   172, 178.0, 166.5],
        'q40b' => [135, 161,   172, 194.0, 175.0],
        'q40c' => [135, 161,   172, 210.0, 184.0],
    ];

    // ── Page 4: Checkbox Y positions ─────────────────────────────────
    protected array $p4CheckboxY = [
        'q34a' => ['yes_y' => 24.5,  'no_y' => 24.5],
        'q34b' => ['yes_y' => 30.0,  'no_y' => 30],
        'q35a' => ['yes_y' => 45.5,  'no_y' => 45.5],
        'q35b' => ['yes_y' => 62.5,  'no_y' => 62.5],
        'q36'  => ['yes_y' => 83.5,  'no_y' => 83.5],
        'q37'  => ['yes_y' => 99,    'no_y' => 99],
        'q38a' => ['yes_y' => 113.5,    'no_y' => 113.5],
        'q38b' => ['yes_y' => 123.5,   'no_y' => 123.5],
        'q39'  => ['yes_y' => 135,   'no_y' => 135.0],
        'q40a' => ['yes_y' => 163.5,   'no_y' => 163.5],
        'q40b' => ['yes_y' => 171.5,   'no_y' => 171.5],
        'q40c' => ['yes_y' => 181,   'no_y' => 181.0],
    ];

    // ── Page 4: Question details text config ─────────────────────────
    protected array $p4QuestionDetailsTextConfig = [
        'q34a' => ['maxWidth' => 150, 'lineHeight' => 3.5],
        'q34b' => ['maxWidth' => 150, 'lineHeight' => 3.5],
        'q35a' => ['maxWidth' => 110, 'lineHeight' => 3.5],
        'q35b' => ['maxWidth' => 140, 'lineHeight' => 3.5],
        'q36'  => ['maxWidth' => 150, 'lineHeight' => 3.5],
        'q37'  => ['maxWidth' => 150, 'lineHeight' => 3.5],
        'q38a' => ['maxWidth' => 150, 'lineHeight' => 3.5],
        'q38b' => ['maxWidth' => 150, 'lineHeight' => 3.5],
        'q39'  => ['maxWidth' => 150, 'lineHeight' => 3.5],
        'q40a' => ['maxWidth' => 150, 'lineHeight' => 3.5],
        'q40b' => ['maxWidth' => 150, 'lineHeight' => 3.5],
        'q40c' => ['maxWidth' => 150, 'lineHeight' => 3.5],
    ];

    // ── Page 4: Q35b extra fields ─────────────────────────────────────
    protected array $p4Q35bExtra = [
        'q35b_date_filed' => [160, 71.0],
        'q35b_status'     => [160, 75.5],
    ];

    // ── Page 4: References [name_x, address_x, contact_x, y] ─────────
    protected array $p4Refs = [
        ['name_x' => 7,  'address_x' => 83.0,  'contact_x' => 130.5, 'y' => 202.5],
        ['name_x' => 7,  'address_x' => 83.0,  'contact_x' => 130.5, 'y' => 210],
        ['name_x' => 7,  'address_x' => 83.0,  'contact_x' => 130.5, 'y' => 217.5],
    ];

    protected array $p4RefsTextConfig = [
        'name'    => ['maxWidth' => 80, 'lineHeight' => 2],
        'address' => ['maxWidth' => 48, 'lineHeight' => 2],
        'contact' => ['maxWidth' => 25, 'lineHeight' => 2],
    ];

    // ── Page 4: Government ID ─────────────────────────────────────────
    protected array $p4GovId = [
        'gov_id_type'         => [30,  261.0],
        'gov_id_number'       => [30,  267.5],
        'gov_id_date_issued'  => [30,  274.5],
        'gov_id_place_issued' => [30,  275],
    ];

    protected array $p4GovIdTextConfig = [
        'gov_id_type'         => ['maxWidth' => 83,  'lineHeight' => 3.5],
        'gov_id_number'       => ['maxWidth' => 120, 'lineHeight' => 3.5],
        'gov_id_date_issued'  => ['maxWidth' => 53,  'lineHeight' => 3.5],
        'gov_id_place_issued' => ['maxWidth' => 45,  'lineHeight' => 2],
    ];

    // ── Page 4: Render ────────────────────────────────────────────────
    protected function renderPage4(array $data): void
    {
        $this->pdf->setSourceFile(storage_path('app/pdf/PDS_CSC_FORMAT_P4.pdf'));
        $tplId = $this->pdf->importPage(1);
        $size  = $this->pdf->getTemplateSize($tplId);
        $this->pdf->AddPage('P', [$size['width'], $size['height']]);
        $this->pdf->useTemplate($tplId, 0, 0, $size['width'], $size['height']);
        $this->pdf->SetFont($this->font, 'B', $this->fontSize);

        $ff = $data['pds_final_form'] ?? [];

        $q34DetailsWritten = false;
        foreach ($this->p4Questions as $key => [$yesX, $noX, $detailsX, $questionY, $detailsY]) {
            $answer = $ff[$key] ?? null;
            $chkY   = $this->p4CheckboxY[$key] ?? [];
            $yesY   = $chkY['yes_y'] ?? $questionY;
            $noY    = $chkY['no_y']  ?? $questionY;

            if ($answer === true) {
                $this->drawCheck($yesX, $yesY);

                if (in_array($key, ['q34a', 'q34b'])) {
                    if (!$q34DetailsWritten) {
                        $details = (string)($ff['q34_details'] ?? '');
                        if ($details !== '') {
                            $config     = $this->p4QuestionDetailsTextConfig['q34a'] ?? [];
                            $maxWidth   = $config['maxWidth']  ?? 0;
                            $lineHeight = $config['lineHeight'] ?? 3.5;
                            $this->writeText($detailsX, $detailsY, $details, $maxWidth, 0, $lineHeight);
                        }
                        $q34DetailsWritten = true;
                    }
                } elseif ($key !== 'q35b') {
                    $details = (string)($ff[$key . '_details'] ?? '');
                    if ($details !== '') {
                        $config     = $this->p4QuestionDetailsTextConfig[$key] ?? [];
                        $maxWidth   = $config['maxWidth']  ?? 0;
                        $lineHeight = $config['lineHeight'] ?? 3.5;
                        $this->writeText($detailsX, $detailsY, $details, $maxWidth, 0, $lineHeight);
                    }
                }
            } elseif ($answer === false) {
                $this->drawCheck($noX, $noY);
            }
        }

        if (($ff['q35b'] ?? null) === true) {
            foreach ($this->p4Q35bExtra as $field => [$x, $y]) {
                $val = (string)($ff[$field] ?? '');
                if ($val !== '') {
                    $this->writeText($x, $y, $val);
                }
            }
        }

        foreach ($this->p4Refs as $i => $ref) {
            $n      = $i + 1;
            $fields = [
                'name'    => $ref['name_x'],
                'address' => $ref['address_x'],
                'contact' => $ref['contact_x'],
            ];
            foreach ($fields as $suffix => $x) {
                $val = (string)($ff["ref{$n}_{$suffix}"] ?? '');
                if ($val !== '') {
                    $config     = $this->p4RefsTextConfig[$suffix] ?? [];
                    $maxWidth   = $config['maxWidth']  ?? 0;
                    $lineHeight = $config['lineHeight'] ?? 3.5;
                    $this->writeText($x, $ref['y'], $val, $maxWidth, 0, $lineHeight);
                }
            }
        }

        foreach ($this->p4GovId as $field => [$x, $y]) {
            $val = (string)($ff[$field] ?? '');
            if ($val !== '') {
                $config     = $this->p4GovIdTextConfig[$field] ?? [];
                $maxWidth   = $config['maxWidth']  ?? 0;
                $lineHeight = $config['lineHeight'] ?? 3.5;
                $this->writeText($x, $y, $val, $maxWidth, 0, $lineHeight);
            }
        }

        $dateAccomplished = (string)($ff['date_accomplished'] ?? '');
        if ($dateAccomplished !== '') {
            $this->writeText(120.0, 252.0, $dateAccomplished);
        }
    }
}
