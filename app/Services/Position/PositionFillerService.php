<?php

namespace App\Services\Position;

use setasign\Fpdi\Fpdi;

class PositionFillerService
{
    protected Fpdi  $pdf;
    protected float $fontSize      = 9;
    protected float $smallFontSize = 6;
    protected float $dutyFontSize  = 5;
    protected float $smallField    = 6.0;  // font for supervised rows, contacts, unit function, pct/comp
    protected string $font         = 'Arial';

    protected array $page1Map = [
        'position_title'               => [106.3,  36.7],
        'item_number'                  => [ 24.4,  55.0],
        'salary_grade'                 => [106.3,  55.0],
        'department_agency'            => [ 24.4,  93.3],
        'bureau_office'                => [106.3,  93.3],
        'department_branch_division'   => [ 24.4, 109.5],
        'workstation'                  => [106.3, 109.5],
        'present_approp_act'           => [ 24.4, 124.4],
        'previous_approp_act'          => [ 61.1, 124.4],
        'salary_authorized'            => [106.3, 124.4],
        'other_compensation'           => [146.6, 122.4],
        'immediate_supervisor_title'   => [ 24.4, 143.6],
        'next_higher_supervisor_title' => [106.3, 143.6],
    ];

    protected array $govUnitType = [
        'Province'     => [ 39.4,  65.7],
        'City'         => [ 39.4,  68.9],
        'Municipality' => [ 39.4,  72.0],
    ];

    protected array $govUnitClass = [
        '1st Class' => [ 95.5,  65.7],
        '2nd Class' => [ 95.5,  68.9],
        '3rd Class' => [ 95.5,  72.0],
        '4th Class' => [ 95.5,  75.0],
        '5th Class' => [146.7,  65.7],
        '6th Class' => [146.7,  68.9],
        'Special'   => [146.7,  72.0],
    ];

    protected array $supRows = [
        [ 24.4, 106.3, 162.6],
        [ 24.4, 106.3, 165.2],
        [ 24.4, 106.3, 167.7],
        [ 24.4, 106.3, 170.1],
        [ 70.8, 152.7, 162.6],
        [ 70.8, 152.7, 165.2],
        [ 70.8, 152.7, 167.7],
    ];

    protected array $contactsInternal = [
        'executive_managerial' => [72.0, 95.0, 195.5],
        'supervisors'          => [72.0, 95.0, 199.0],
        'non_supervisors'      => [72.0, 95.0, 202.4],
        'staff'                => [72.0, 95.0, 205.7],
    ];

    protected array $contactsExternal = [
        'general_public' => [153.8, 176.4, 195.5],
        'other_agencies' => [153.8, 176.4, 199.0],
    ];
    protected array $contactsOthersText = [147.4, 205.0];

    protected array $workingConditionRows = [
        'Office Work' => [72.0, 95.3, 213.1],
        'Field Work'  => [72.0, 95.3, 216.7],
    ];
    protected array $workingConditionOther = [106.3, 219.9];

    protected array $unitFunctionPos    = [24.4, 230.0];
    protected float  $unitFunctionLineH = 2.5;  // line height for unit function description

    protected array $page2Map = [
        'position_function_description' => [ 24.4,  25.1],
        'edu_standard'                  => [ 24.4,  89.0],
        'experience_standard'           => [ 60.6,  89.0],
        'training_standard'             => [107.0,  89.0],
        'eligibility_standard'          => [147.5,  89.0],
    ];

    // row gap (mm) between core/leadership competency rows
    protected float $compRowGap = 4.5;

    protected array $coreCompRows = [
        [ 24.4, 153.8, 122.5],
        [ 24.4, 153.8, 126.0],
        [ 24.4, 153.8, 129.3],
        [ 24.4, 153.8, 132.5],
        [ 24.4, 153.8, 135.6],
    ];

    protected array $leadCompRows = [
        [ 24.4, 153.8, 152.5],
        [ 24.4, 153.8, 156.0],
        [ 24.4, 153.8, 159.4],
        [ 24.4, 153.8, 162.7],
        [ 24.4, 153.8, 165.9],
    ];

    // ── Section 22: dynamic Y — rows flow with description height ───────
    protected float $dutiesStartY  = 187.0;
    protected float $dutiesMaxY    = 225.0;
    protected float $dutiesLineH   = 1.5;
    protected float $dutiesRowGap  = 0.5;
    protected float $dutiesPctX    = 24.4;
    protected float $dutiesDescX   = 61.1;
    protected float $dutiesCompX   = 153.8;
    protected float $dutiesDescW   = 85.0;

    // ── Fields that need MultiCell width constraints ───────────────────
    protected array $page1MultiCell = [
        'other_compensation' => 40.0,
    ];

    public function generate(array $data): string
    {
        $this->pdf = new Fpdi();
        $this->pdf->setSourceFile(storage_path('app/pdf/POSITION_DESCRIPTION_FORM.pdf'));
        $this->pdf->SetFont($this->font, '', $this->fontSize);
        $this->pdf->SetTextColor(0, 0, 0);

        // ── PAGE 1 ────────────────────────────────────────────────────
        $this->pdf->AddPage('P', [215.9, 279.4]);
        $tpl1 = $this->pdf->importPage(1);
        $this->pdf->useTemplate($tpl1, 0, 0, 215.9, 279.4);
        $this->pdf->SetFont($this->font, '', $this->fontSize);

        foreach ($this->page1Map as $field => [$x, $y]) {
            $value = (string)($data[$field] ?? '');
            if ($value === '') continue;
            if ($field === 'salary_authorized') {
                $value = 'PHP ' . ltrim($value, 'PHP ');
            }
            $this->pdf->SetXY($x, $y);
            if (isset($this->page1MultiCell[$field])) {
                $this->pdf->MultiCell($this->page1MultiCell[$field], 3.5, $this->sanitize($value), 0, 'L');
            } else {
                $this->pdf->Write(0, $this->sanitize($value));
            }
        }

        // Section 4 — Local Government checkboxes
        $govType  = $data['gov_unit_type']  ?? '';
        $govClass = $data['gov_unit_class'] ?? '';
        if ($govType && isset($this->govUnitType[$govType])) {
            [$cx, $cy] = $this->govUnitType[$govType];
            $this->drawCheck($cx, $cy);
        }
        if ($govClass && isset($this->govUnitClass[$govClass])) {
            [$cx, $cy] = $this->govUnitClass[$govClass];
            $this->drawCheck($cx, $cy);
        }

        // Section 15 — Supervised positions (font size 6)
        $supervised = $data['supervised_positions'] ?? [];
        foreach ($supervised as $i => $row) {
            if (!isset($this->supRows[$i])) break;
            [$tx, $nx, $ry] = $this->supRows[$i];
            $title = (string)($row['position_title'] ?? '');
            $item  = (string)($row['item_number']    ?? '');
            $this->pdf->SetFont($this->font, '', $this->smallField);
            if ($title !== '') { $this->pdf->SetXY($tx, $ry); $this->pdf->Write(0, $this->sanitize($title)); }
            if ($item  !== '') { $this->pdf->SetXY($nx, $ry); $this->pdf->Write(0, $this->sanitize($item)); }
        }
        $this->pdf->SetFont($this->font, '', $this->fontSize);

        // Section 16 — Equipment tools
        $tools    = $data['equipment_tools'] ?? [];
        $toolText = implode(', ', array_filter($tools, fn($t) => $t !== ''));
        if ($toolText !== '') {
            $this->pdf->SetXY(24.4, 179.5);
            $this->pdf->MultiCell(167.2, 4.0, $this->sanitize($toolText), 0, 'L');
        }

        // Section 17a — Internal contacts checkboxes
        $ci = $data['contacts_internal'] ?? [];
        foreach ($this->contactsInternal as $key => [$ox, $fx, $ry]) {
            $row = $ci[$key] ?? [];
            if ($row['occasional'] ?? false) $this->drawCheck($ox, $ry);
            if ($row['frequent']   ?? false) $this->drawCheck($fx, $ry);
        }

        // Section 17b — External contacts checkboxes
        $ce = $data['contacts_external'] ?? [];
        foreach ($this->contactsExternal as $key => [$ox, $fx, $ry]) {
            $row = $ce[$key] ?? [];
            if ($row['occasional'] ?? false) $this->drawCheck($ox, $ry);
            if ($row['frequent']   ?? false) $this->drawCheck($fx, $ry);
        }
        $othersText = $ce['others']['text'] ?? '';
        if ($othersText !== '') {
            [$ox, $oy] = $this->contactsOthersText;
            $this->pdf->SetFont($this->font, '', $this->smallField);
            $this->pdf->SetXY($ox, $oy);
            $this->pdf->Write(0, $this->sanitize($othersText));
            $this->pdf->SetFont($this->font, '', $this->fontSize);
        }

        // Section 18 — Working condition
        $wcType      = $data['working_condition_type']      ?? '';
        $wcFrequency = $data['working_condition_frequency'] ?? '';
        $wcOther     = $data['working_condition_other']     ?? '';
        if ($wcType === 'Others' && $wcOther !== '') {
            [$ox, $oy] = $this->workingConditionOther;
            $this->pdf->SetXY($ox, $oy);
            $this->pdf->Write(0, $this->sanitize($wcOther));
        } elseif ($wcType && isset($this->workingConditionRows[$wcType])) {
            [$ox, $fx, $ry] = $this->workingConditionRows[$wcType];
            if ($wcFrequency === 'Occasional') $this->drawCheck($ox, $ry);
            if ($wcFrequency === 'Frequent')   $this->drawCheck($fx, $ry);
        }

        // Section 19 — Unit function description (font 6, line height 2.0)
        $unitFunc = (string)($data['unit_function_description'] ?? '');
        if ($unitFunc !== '') {
            [$ux, $uy] = $this->unitFunctionPos;
            $this->pdf->SetFont($this->font, '', $this->smallField);
            $this->pdf->SetXY($ux, $uy);
            $this->pdf->MultiCell(164, $this->unitFunctionLineH, $this->sanitize($unitFunc), 0, 'L');
            $this->pdf->SetFont($this->font, '', $this->fontSize);
        }

        // ── PAGE 2 ────────────────────────────────────────────────────
        $this->pdf->AddPage('P', [215.9, 279.4]);
        $tpl2 = $this->pdf->importPage(2);
        $this->pdf->useTemplate($tpl2, 0, 0, 215.9, 279.4);
        $this->pdf->SetFont($this->font, '', $this->fontSize);

        foreach ($this->page2Map as $field => [$x, $y]) {
            $value = (string)($data[$field] ?? '');
            if ($value === '') continue;
            if (in_array($field, ['position_function_description', 'edu_standard',
                                   'experience_standard', 'training_standard', 'eligibility_standard'])) {
                $maxW = match ($field) {
                    'edu_standard',
                    'experience_standard',
                    'training_standard',
                    'eligibility_standard' => 35.5,
                    default                => 164.2,
                };
                $this->pdf->SetXY($x, $y);
                $this->pdf->MultiCell($maxW, 4.0, $this->sanitize($value), 0, 'L');
            } else {
                $this->pdf->SetXY($x, $y);
                $this->pdf->Write(0, $this->sanitize($value));
            }
        }

        // Section 21e — Core competencies (dynamic Y with $compRowGap)
        $coreComps = $data['core_competencies'] ?? [];
        $coreY = $this->coreCompRows[0][2] ?? 122.5;
        foreach ($coreComps as $i => $row) {
            if ($i >= count($this->coreCompRows)) break;
            [$cx, $lx] = $this->coreCompRows[$i];
            $comp  = (string)($row['competency'] ?? '');
            $level = (string)($row['level']      ?? '');
            if ($comp  !== '') { $this->pdf->SetXY($cx, $coreY); $this->pdf->Write(0, $this->sanitize($comp)); }
            if ($level !== '') { $this->pdf->SetXY($lx, $coreY); $this->pdf->Write(0, $this->sanitize($level)); }
            $coreY += $this->compRowGap;
        }

        // Section 21f — Leadership competencies (dynamic Y with $compRowGap)
        $leadComps = $data['leadership_competencies'] ?? [];
        $leadY = $this->leadCompRows[0][2] ?? 152.5;
        foreach ($leadComps as $i => $row) {
            if ($i >= count($this->leadCompRows)) break;
            [$cx, $lx] = $this->leadCompRows[$i];
            $comp  = (string)($row['competency'] ?? '');
            $level = (string)($row['level']      ?? '');
            if ($comp  !== '') { $this->pdf->SetXY($cx, $leadY); $this->pdf->Write(0, $this->sanitize($comp)); }
            if ($level !== '') { $this->pdf->SetXY($lx, $leadY); $this->pdf->Write(0, $this->sanitize($level)); }
            $leadY += $this->compRowGap;
        }

        // Section 22 — Duties & responsibilities (dynamic Y + dynamic font sizing)
        $duties     = $data['duties_responsibilities'] ?? [];
        $totalChars = array_sum(array_map(fn($r) => strlen($r['description'] ?? ''), $duties));
        $sizing     = $this->resolveDutySizing($totalChars);

        $rowY = $this->dutiesStartY;

        foreach ($duties as $row) {
            if ($rowY >= $this->dutiesMaxY) break;

            $pct  = (string)($row['percentage']       ?? '');
            $desc = (string)($row['description']      ?? '');
            $comp = (string)($row['competency_level'] ?? '');

            $this->pdf->SetFont($this->font, '', $sizing['labelFont']);
            if ($pct !== '') {
                $this->pdf->SetXY($this->dutiesPctX, $rowY);
                $this->pdf->Write(0, $this->sanitize($pct . '%'));
            }
            if ($comp !== '') {
                $this->pdf->SetXY($this->dutiesCompX, $rowY);
                $this->pdf->Write(0, $this->sanitize($comp));
            }

            if ($desc !== '') {
                $this->pdf->SetFont($this->font, '', $sizing['descFont']);
                $this->pdf->SetXY($this->dutiesDescX, $rowY);
                $this->pdf->MultiCell($this->dutiesDescW, $sizing['lineH'], $this->sanitize($desc), 0, 'L');
                $rowY = $this->pdf->GetY() + $sizing['rowGap'];
            } else {
                $rowY += $sizing['lineH'] + $sizing['rowGap'];
            }
        }
        $this->pdf->SetFont($this->font, '', $this->fontSize);

        return $this->pdf->Output('S');
    }

    // ── Dynamic font sizing for Section 22 based on total description chars ─
    //
    // Available vertical space: dutiesStartY(187) → dutiesMaxY(225) = 38 mm
    //
    // Tier  | totalChars | labelFont | descFont | lineH | rowGap
    // ──────┼────────────┼───────────┼──────────┼───────┼───────
    //   1   |   0 – 100  |    8.0    |   7.5    |  4.0  |  2.0   (very short)
    //   2   | 101 – 200  |    7.5    |   6.5    |  3.5  |  1.5
    //   3   | 201 – 320  |    7.0    |   5.8    |  3.0  |  1.2
    //   4   | 321 – 450  |    6.5    |   5.2    |  2.5  |  0.8
    //   5   | 451 – 550  |    6.0    |   4.6    |  2.0  |  0.6
    //   6   | 551 – 650  |    6.0    |   4.1    |  1.5  |  0.5   (original max)

    protected function resolveDutySizing(int $totalChars): array
    {
        return match (true) {
            $totalChars <= 100 => ['labelFont' => 8.0, 'descFont' => 7.5, 'lineH' => 4.0, 'rowGap' => 2.0],
            $totalChars <= 200 => ['labelFont' => 7.5, 'descFont' => 6.5, 'lineH' => 3.5, 'rowGap' => 1.5],
            $totalChars <= 320 => ['labelFont' => 7.0, 'descFont' => 5.8, 'lineH' => 3.0, 'rowGap' => 1.2],
            $totalChars <= 450 => ['labelFont' => 6.5, 'descFont' => 5.2, 'lineH' => 2.5, 'rowGap' => 0.8],
            $totalChars <= 550 => ['labelFont' => 6.0, 'descFont' => 4.6, 'lineH' => 2.0, 'rowGap' => 0.6],
            default            => ['labelFont' => 6.0, 'descFont' => 4.1, 'lineH' => 1.5, 'rowGap' => 0.5],
        };
    }

    // ── Sanitize text to Latin-1 (FPDF default encoding) ─────────────

    protected function sanitize(string $text): string
    {
        $search = [
            "\xe2\x82\xb1",  // ₱  Peso sign    (U+20B1)
            "\xe2\x80\x93",  // –  En dash       (U+2013)
            "\xe2\x80\x94",  // —  Em dash       (U+2014)
            "\xe2\x80\x9c",  // "  Left d-quote  (U+201C)
            "\xe2\x80\x9d",  // "  Right d-quote (U+201D)
            "\xe2\x80\x98",  // '  Left s-quote  (U+2018)
            "\xe2\x80\x99",  // '  Right s-quote (U+2019)
            "\xe2\x80\xa6",  // …  Ellipsis      (U+2026)
        ];
        $replace = ['PHP ', '-', '-', '"', '"', "'", "'", '...'];
        $text = str_replace($search, $replace, $text);
        return mb_convert_encoding($text, 'ISO-8859-1', 'UTF-8');
    }

    // ── Draw a checkmark (two lines, font-independent) ────────────────

    protected function drawCheck(float $x, float $y): void
    {
        $this->pdf->SetDrawColor(0, 0, 0);
        $this->pdf->SetLineWidth(0.4);
        $this->pdf->Line($x,       $y + 1.5, $x + 1.2, $y + 2.8);
        $this->pdf->Line($x + 1.2, $y + 2.8, $x + 3.2, $y + 0.3);
    }
}
