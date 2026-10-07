<?php

namespace App\Modules\Admin\Controllers;

use App\Modules\Admin\Models\Position;
use App\Services\Position\PositionFillerService;

class PositionPDFController
{
    public function view(Position $position)
    {
        // Force a fresh pull from the DB to ensure recent edits are loaded
        $position->refresh();

        $pdf = (new PositionFillerService())->generate($position->toArray());

        // Append a timestamp to the filename to bypass browser PDF viewer caching
        $filename = 'position_' . $position->id . '_' . time() . '.pdf';

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
            'Cache-Control'       => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma'              => 'no-cache',
            'Expires'             => 'Sat, 01 Jan 2000 00:00:00 GMT',
        ]);
    }

    public function download(Position $position)
    {
        // Force a fresh pull from the DB
        $position->refresh();

        $pdf   = (new PositionFillerService())->generate($position->toArray());
        $title = str($position->position_title ?? 'position')->slug();
        $filename = "{$title}_" . time() . ".pdf";

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control'       => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma'              => 'no-cache',
            'Expires'             => 'Sat, 01 Jan 2000 00:00:00 GMT',
        ]);
    }
}