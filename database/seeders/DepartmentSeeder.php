<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    /**
     * Seeder for San Pablo City government departments.
     * Each entry has a 'name' and a 'code' (abbreviation).
     */
    public function run(): void
    {
        $departments = [
            ['name' => "City Accountant's Office",                              'code' => 'CACO'],
            ['name' => "City Administrator's Office",                           'code' => 'CADO'],
            ['name' => 'City Agriculturist Office',                             'code' => 'CAGO'],
            ['name' => "City Assessor's Office",                                'code' => 'CASO'],
            ['name' => 'City Budget Office',                                    'code' => 'CBTO'],
            ['name' => 'City Civil Registrar Office',                           'code' => 'CCRO'],
            ['name' => 'City Cooperatives Office',                              'code' => 'COOP'],
            ['name' => 'City Disaster Risk Reduction Management Office',        'code' => 'CDRRMO'],
            ['name' => 'City Engineer Office',                                  'code' => 'CEO'],
            ['name' => 'City Environmental and Natural Resources Office',       'code' => 'CENRO'],
            ['name' => 'City General Services Office',                          'code' => 'CGSO'],
            ['name' => 'City Health Office',                                    'code' => 'CHO'],
            ['name' => 'City Human Resource Management Office',                 'code' => 'CHRMO'],
            ['name' => 'City Indigency Affairs Office',                         'code' => 'CIAP'],
            ['name' => 'City Information Office',                               'code' => 'CIO'],
            ['name' => 'City Legal Office',                                     'code' => 'CLGO'],
            ['name' => "City Mayor's Office",                                   'code' => 'CMO'],
            ['name' => "City Mayor's Office - BPLO",                           'code' => 'BPLO'],
            ['name' => "City Mayor's Office - CTMO",                           'code' => 'CTMO'],
            ['name' => "City Mayor's Office - GAD Division",                   'code' => 'GAD'],
            ['name' => "City Mayor's Office - LEDIPO",                         'code' => 'LEDIPO'],
            ['name' => "City Mayor's Office - MISO",                           'code' => 'MIS'],
            ['name' => "City Mayor's Office - OSCA",                           'code' => 'OSCA'],
            ['name' => "City Mayor's Office - PDAO",                           'code' => 'PDAO'],
            ['name' => "City Mayor's Office - PESO",                           'code' => 'PESO'],
            ['name' => "City Mayor's Office - Records and Administrative Division", 'code' => 'Records_Office'],
            ['name' => "City Mayor's Office - SPORTS",                         'code' => 'SPORTS'],
            ['name' => "City Mayor's Office - Urban Housing",                  'code' => 'URBAN_HOUSING'],
            ['name' => "City Mayor's Office - Zoning and Land Use Division",   'code' => 'Zoning'],
            ['name' => 'City Planning and Development Office',                  'code' => 'CPDO'],
            ['name' => 'City Population Office',                                'code' => 'CPOP'],
            ['name' => "City Prosecutor's Office",                              'code' => 'CPRO'],
            ['name' => 'City Social Welfare and Development Office',            'code' => 'CSWDO'],
            ['name' => 'City Solid Waste and Management Office',                'code' => 'CSWMO'],
            ['name' => 'City Tourism Office',                                   'code' => 'TOURISM'],
            ['name' => "City Treasurer's Office",                               'code' => 'CTO'],
            ['name' => "City Treasurer's Office - Market",                     'code' => 'CTO-MARKET'],
            ['name' => "City Veterinarian's Office",                            'code' => 'CVET'],
            ['name' => 'Office of the Building Officials',                      'code' => 'OBO'],
            ['name' => 'Pamantasan ng Lungsod ng San Pablo',                    'code' => 'PLSP'],
            ['name' => 'San Pablo City General Hospital',                       'code' => 'SPCGH'],
            ['name' => 'San Pablo City General Hospital - Dialysis',            'code' => 'SPCGH-DIALYSIS'],
            ['name' => 'Sangguniang Panlungsod',                                'code' => 'SPLO'],
            ['name' => 'Sangguniang Panlungsod - City Library',                 'code' => 'LIBRARY'],
        ];

        foreach ($departments as $department) {
            DB::table('departments')->insertOrIgnore([
                'name'       => $department['name'],
                'code'       => $department['code'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}