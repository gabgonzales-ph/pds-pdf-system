<?php

namespace App\Services\PDS;

trait PDS_CSC_FILLER_P3
{
    // ── Page 3: Voluntary Work ────────────────────────────────────────
    protected array $p3VwColumns = [
        'org_name_address' => 7,
        'date_from'        => 92,
        'date_to'          => 107.0,
        'hours'            => 127.0,
        'position'         => 139.0,
    ];

    protected float $p3VwStartY  = 28.0;
    protected array $p3VwRowGaps = [6, 7.5, 7.5, 7.5, 7.5, 7];
    protected int   $p3VwMaxRows = 7;

    protected array $p3VwTextConfig = [
        'org_name_address' => ['maxWidth' => 85, 'lineHeight' => 2.5],
        'date_from'        => ['maxWidth' => 16, 'lineHeight' => 2.5],
        'date_to'          => ['maxWidth' => 16, 'lineHeight' => 2.5],
        'hours'            => ['maxWidth' => 13, 'lineHeight' => 2.5],
        'position'         => ['maxWidth' => 66, 'lineHeight' => 2.5],
    ];

    // ── Page 3: Learning & Development ───────────────────────────────
    protected array $p3LdColumns = [
        'title'        => 7,
        'date_from'    => 92,
        'date_to'      => 107.0,
        'hours'        => 124,
        'ld_type'      => 138,
        'conducted_by' => 156.0,
    ];

    protected float $p3LdStartY  = 101.5;
    protected array $p3LdRowGaps = [6, 6.5, 6.5, 6.5, 6.5, 7, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.6, 6.5, 6.5];
    protected int   $p3LdMaxRows = 21;

    protected array $p3LdTextConfig = [
        'title'        => ['maxWidth' => 85, 'lineHeight' => 2.5],
        'date_from'    => ['maxWidth' => 16, 'lineHeight' => 2.5],
        'date_to'      => ['maxWidth' => 16, 'lineHeight' => 2],
        'hours'        => ['maxWidth' => 13, 'lineHeight' => 2],
        'ld_type'      => ['maxWidth' => 19, 'lineHeight' => 2],
        'conducted_by' => ['maxWidth' => 50, 'lineHeight' => 2.5],
    ];

    // ── Page 3: Other Information ─────────────────────────────────────
    protected array $p3OtherBaseX = [
        'special_skills'            => 7,
        'non_academic_distinctions' => 56.0,
        'organization_memberships'  => 157.0,
    ];

    protected array $p3OtherRowY = [
        'special_skills'            => [249.0, 256.0, 262.0, 269.0, 275.5, 282.0, 288.0],
        'non_academic_distinctions' => [249.0, 256.0, 262.0, 269.0, 275.5, 282.0, 288.0],
        'organization_memberships'  => [249.0, 256.0, 262.0, 269.0, 275.5, 282.0, 288.0],
    ];

    protected array $p3OtherTextConfig = [
        'special_skills'            => ['maxWidth' => 45, 'lineHeight' => 2.5],
        'non_academic_distinctions' => ['maxWidth' => 100, 'lineHeight' => 2.5],
        'organization_memberships'  => ['maxWidth' => 45, 'lineHeight' => 2.5],
    ];

    // ── Page 3: Render ────────────────────────────────────────────────
    protected function renderPage3(array $data): void
    {
        $this->pdf->setSourceFile(storage_path('app/pdf/PDS_CSC_FORMAT_P3.pdf'));
        $tplId = $this->pdf->importPage(1);
        $size  = $this->pdf->getTemplateSize($tplId);
        $this->pdf->AddPage('P', [$size['width'], $size['height']]);
        $this->pdf->useTemplate($tplId, 0, 0, $size['width'], $size['height']);
        $this->pdf->SetFont($this->font, 'B', $this->fontSize);

        $voluntaryWorks = $data['voluntary_works'] ?? [];
        $y = $this->p3VwStartY;
        foreach ($voluntaryWorks as $i => $row) {
            if ($i >= $this->p3VwMaxRows) break;
            foreach ($this->p3VwColumns as $field => $x) {
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

                $config     = $this->p3VwTextConfig[$field] ?? [];
                $maxWidth   = $config['maxWidth']  ?? 0;
                $lineHeight = $config['lineHeight'] ?? 3.5;

                $this->writeText($x, $y, $val, $maxWidth, 0, $lineHeight);
            }
            if (isset($this->p3VwRowGaps[$i])) {
                $y += $this->p3VwRowGaps[$i];
            }
        }

        $learningDevelopments = $data['learning_developments'] ?? [];
        $y = $this->p3LdStartY;
        foreach ($learningDevelopments as $i => $row) {
            if ($i >= $this->p3LdMaxRows) break;
            foreach ($this->p3LdColumns as $field => $x) {
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

                $config     = $this->p3LdTextConfig[$field] ?? [];
                $maxWidth   = $config['maxWidth']  ?? 0;
                $lineHeight = $config['lineHeight'] ?? 3.5;

                $this->writeText($x, $y, $val, $maxWidth, 0, $lineHeight);
            }
            if (isset($this->p3LdRowGaps[$i])) {
                $y += $this->p3LdRowGaps[$i];
            }
        }

        $oi = $data['other_information'] ?? [];
        $lists = [
            'special_skills',
            'non_academic_distinctions',
            'organization_memberships',
        ];
        foreach ($lists as $listKey) {
            $items      = $oi[$listKey] ?? [];
            $baseX      = $this->p3OtherBaseX[$listKey];
            $rowYs      = $this->p3OtherRowY[$listKey];
            $config     = $this->p3OtherTextConfig[$listKey] ?? [];
            $maxWidth   = $config['maxWidth']  ?? 0;
            $lineHeight = $config['lineHeight'] ?? 3.5;

            foreach ($items as $j => $item) {
                if (!isset($rowYs[$j])) break;
                $this->writeText($baseX, $rowYs[$j], (string)$item, $maxWidth, 0, $lineHeight);
            }
        }
    }
}
