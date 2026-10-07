<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CareerServiceSeeder extends Seeder
{
    /**
     * Civil Service Commission (CSC) career service eligibility types.
     * Replace or expand this list to match your organization's actual options.
     */
    public function run(): void
    {
        $careerServices = [
            ['name' => 'Career Service Professional'],
            ['name' => 'Career Service Sub-Professional'],
            ['name' => 'Career Executive Service (CES)'],
            ['name' => 'Career Executive Service Eligible (CESE)'],
            ['name' => 'Barangay Official'],
            ['name' => 'Board Examination (RA 1080)'],
            ['name' => 'Honor Graduate (RA 1080)'],
            ['name' => 'Veteran Preference Rating'],
            ['name' => 'Scientific and Technological Specialist'],
            ['name' => 'Not Applicable'],
        ];

        foreach ($careerServices as $service) {
            DB::table('career_services')->insertOrIgnore([
                'name'       => $service['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
