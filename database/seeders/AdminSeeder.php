<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Creates a default administrator account.
     * Change the credentials before deploying to production.
     */
    public function run(): void
    {
        // Get the first available department and career service for the admin placeholder
        $departmentId   = DB::table('departments')->value('id');
        $careerServiceId = DB::table('career_services')->value('id');

        DB::table('users')->insertOrIgnore([
            'username'            => 'admin',
            'email'               => 'admin@miso.local',
            'password'            => Hash::make('Admin@12345'),
            'employee_id'         => '00000001',
            'role'                => 'admin',
            'department_id'       => $departmentId,
            'career_service_id'   => $careerServiceId,
             'email_verified_at'   => now(),
            'created_at'          => now(),
            'updated_at'          => now(),
        ]);
    }
}