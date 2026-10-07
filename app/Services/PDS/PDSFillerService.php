<?php

namespace App\Services\PDS;

use setasign\Fpdi\Fpdi;

class PDSFillerService
{
    use PDS_CSC_FILLER_P1;
    use PDS_CSC_FILLER_P2;
    use PDS_CSC_FILLER_P3;
    use PDS_CSC_FILLER_P4;

    // ── Shared: FPDF instance & font ──────────────────────────────────
    protected Fpdi   $pdf;
    protected string $font = 'Arial Narrow';

    // ── Shared: Font sizes ────────────────────────────────────────────
    protected float $fontSize           = 8;
    protected float $smallFontSize      = 8;
    protected float $honorsFontSize     = 6;
    protected float $attendanceFontSize = 6;

    // ── Shared: Minimum font size when auto-shrinking ─────────────────
    protected float $minFontSize = 5;

    // ── Entry point ───────────────────────────────────────────────────
    public function generate(array $data): string
    {
        $this->pdf = new Fpdi();

        // FPDF custom font setup — bind fontpath directly on the instance
        // to avoid conflicts with the vendor-level FPDF_FONTPATH constant.
        $fontDir = storage_path('app/fonts') . DIRECTORY_SEPARATOR;
        (function () use ($fontDir) {
            $this->fontpath = $fontDir;
        })->bindTo($this->pdf, get_class($this->pdf))();

        $this->pdf->AddFont('Arial Narrow', '',  'arialnarrow.php');
        $this->pdf->AddFont('Arial Narrow', 'B', 'arialnarrowb.php');

        $this->pdf->SetAutoPageBreak(false);
        $this->pdf->SetMargins(0, 0, 0);

        $this->renderPage1($data);
        $this->renderPage2($data);
        $this->renderPage3($data);
        $this->renderPage4($data);

        return $this->pdf->Output('S');
    }

    // ── Shared: Text writer with adaptive font shrinking ──────────────
    protected function writeText(
        float  $x,
        float  $y,
        string $text,
        float  $maxWidth   = 0,
        float  $fontSize   = 0,
        float  $lineHeight = 0,
        bool   $noWrap     = false
    ): void {
        if ($text === '') return;

        $size = $fontSize > 0 ? $fontSize : $this->fontSize;

        if ($maxWidth > 0) {
            while ($size >= $this->minFontSize) {
                $this->pdf->SetFont($this->font, 'B', $size);
                if ($this->pdf->GetStringWidth($text) <= $maxWidth) break;
                $size -= 0.5;
            }
        } else {
            $this->pdf->SetFont($this->font, 'B', $size);
        }

        $this->pdf->SetXY($x, $y);

        if ($maxWidth > 0 && !$noWrap) {
            $lh = $lineHeight > 0 ? $lineHeight : 3.5;
            $this->pdf->MultiCell($maxWidth, $lh, $text, 0, 'L');
        } else {
            $this->pdf->Write($lineHeight > 0 ? $lineHeight : 3.5, $text);
        }

        $this->pdf->SetFont($this->font, 'B', $this->fontSize);
    }

    // ── Shared: Checkbox tick mark ────────────────────────────────────
    protected function drawCheck(float $x, float $y): void
    {
        $this->pdf->SetDrawColor(0, 0, 0);
        $this->pdf->SetLineWidth(0.3);
        $this->pdf->Line($x,       $y + 1.0, $x + 0.7, $y + 1.8);
        $this->pdf->Line($x + 0.7, $y + 1.8, $x + 2.0, $y + 0.2);
    }
}
