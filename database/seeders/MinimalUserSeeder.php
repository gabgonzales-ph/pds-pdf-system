<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MinimalUserSeeder extends Seeder
{
    public function run(): void
    {
        $minimalUsers = [
            // Original Users
            [
                'first_name'  => 'MARIA',
                'middle_name' => 'CRUZ',
                'last_name'   => 'SANTOS',
                'email'       => 'maria.santos@miso.local',
            ],
            [
                'first_name'  => 'JOSE',
                'middle_name' => null,
                'last_name'   => 'REYES',
                'email'       => 'jose.reyes@miso.local',
            ],
            [
                'first_name'  => 'ANA',
                'middle_name' => 'LIM',
                'last_name'   => 'GARCIA',
                'email'       => 'ana.garcia@miso.local',
            ],
            // 20 Added Users
            [
                'first_name'  => 'JUAN',
                'middle_name' => 'DELA CRUZ',
                'last_name'   => 'BAUTISTA',
                'email'       => 'juan.bautista@miso.local',
            ],
            [
                'first_name'  => 'PEDRO',
                'middle_name' => null,
                'last_name'   => 'PENDUKO',
                'email'       => 'pedro.penduko@miso.local',
            ],
            [
                'first_name'  => 'ELENA',
                'middle_name' => 'GOMEZ',
                'last_name'   => 'ROSALES',
                'email'       => 'elena.rosales@miso.local',
            ],
            [
                'first_name'  => 'RICARDO',
                'middle_name' => 'DALISAY',
                'last_name'   => 'MENDOZA',
                'email'       => 'ricardo.mendoza@miso.local',
            ],
            [
                'first_name'  => 'CARMEN',
                'middle_name' => 'VILLANUEVA',
                'last_name'   => 'ALCANTARA',
                'email'       => 'carmen.alcantara@miso.local',
            ],
            [
                'first_name'  => 'ANTONIO',
                'middle_name' => 'LUNA',
                'last_name'   => 'SAN JUAN',
                'email'       => 'antonio.sanjuan@miso.local',
            ],
            [
                'first_name'  => 'ROSA',
                'middle_name' => null,
                'last_name'   => 'ROSAL',
                'email'       => 'rosa.rosal@miso.local',
            ],
            [
                'first_name'  => 'MIGUEL',
                'middle_name' => 'SY',
                'last_name'   => 'TAN',
                'email'       => 'miguel.tan@miso.local',
            ],
            [
                'first_name'  => 'TERESA',
                'middle_name' => 'MAGBANUA',
                'last_name'   => 'FERRER',
                'email'       => 'teresa.ferrer@miso.local',
            ],
            [
                'first_name'  => 'ANDRES',
                'middle_name' => null,
                'last_name'   => 'BONIFACIO',
                'email'       => 'andres.bonifacio@miso.local',
            ],
            [
                'first_name'  => 'EMILIO',
                'middle_name' => 'AGUINALDO',
                'last_name'   => 'CORTEZ',
                'email'       => 'emilio.cortez@miso.local',
            ],
            [
                'first_name'  => 'GREGORIA',
                'middle_name' => 'DE JESUS',
                'last_name'   => 'ALVAREZ',
                'email'       => 'gregoria.alvarez@miso.local',
            ],
            [
                'first_name'  => 'APOLINARIO',
                'middle_name' => 'MABINI',
                'last_name'   => 'VELASCO',
                'email'       => 'apolinario.velasco@miso.local',
            ],
            [
                'first_name'  => 'MELCHORA',
                'middle_name' => null,
                'last_name'   => 'AQUINO',
                'email'       => 'melchora.aquino@miso.local',
            ],
            [
                'first_name'  => 'MARCELO',
                'middle_name' => 'DEL PILAR',
                'last_name'   => 'GATMAITAN',
                'email'       => 'marcelo.gatmaitan@miso.local',
            ],
            [
                'first_name'  => 'GABRIELA',
                'middle_name' => 'SILANG',
                'last_name'   => 'CARIÑO',
                'email'       => 'gabriela.carino@miso.local',
            ],
            [
                'first_name'  => 'VICENTE',
                'middle_name' => 'LIM',
                'last_name'   => 'CHUA',
                'email'       => 'vicente.chua@miso.local',
            ],
            [
                'first_name'  => 'LEONOR',
                'middle_name' => 'RIVERA',
                'last_name'   => 'KIPPING',
                'email'       => 'leonor.kipping@miso.local',
            ],
            [
                'first_name'  => 'JOSEFA',
                'middle_name' => null,
                'last_name'   => 'LLANES',
                'email'       => 'josefa.llanes@miso.local',
            ],
            [
                'first_name'  => 'ARTURO',
                'middle_name' => 'TOLENTINO',
                'last_name'   => 'DOMINGO',
                'email'       => 'arturo.domingo@miso.local',
            ],
        ];

        foreach ($minimalUsers as $person) {
            // ── Derive username: firstname.lastname, lowercased ──────
            $baseUsername = strtolower(
                preg_replace('/\s+/', '', $person['first_name']) . '.' .
                preg_replace('/\s+/', '', $person['last_name'])
            );

            // Ensure username uniqueness by appending a counter if needed
            $username = $baseUsername;
            $counter  = 1;
            while (DB::table('users')->where('username', $username)->exists()) {
                $username = $baseUsername . $counter;
                $counter++;
            }

            // ── Derive unique employee_id ────────────────────────────
            do {
                $employeeId = 'EMP-' . str_pad((string) random_int(0, 99999999), 8, '0', STR_PAD_LEFT);
            } while (DB::table('users')->where('employee_id', $employeeId)->exists());

            // ── Insert user (no department, no career service, no login) ──
            $userId = DB::table('users')->insertGetId([
                'username'          => $username,
                'email'             => $person['email'],
                'password'          => Hash::make('Test2@12345'),
                'employee_id'       => $employeeId,
                'role'              => 'user',
                'department_id'     => null,
                'career_service_id' => null,
                'email_verified_at' => null,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);

            // ── Insert minimal personal_information ──────────────────
            DB::table('personal_information')->insertOrIgnore([
                'user_id'          => $userId,
                'last_name'        => $person['last_name'],
                'first_name'       => $person['first_name'],
                'middle_name'      => $person['middle_name'],
                // Required non-nullable fields — placeholder values
                'date_of_birth'    => '1900-01-01',
                'birth_place'      => 'N/A',
                'sex'              => 'Male',
                'civil_status'     => 'Single',
                'blood_type'       => 'N/A',
                'citizenship'      => 'N/A',
                'mobile_no'        => 'N/A',
                // Residential Address
                'barangay'         => 'N/A',
                'city_municipality'=> 'N/A',
                'province'         => 'N/A',
                'region'           => 'N/A',
                // Permanent Address
                'perm_barangay'    => 'N/A',
                'perm_city'        => 'N/A',
                'perm_province'    => 'N/A',
                'perm_region'      => 'N/A',
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);
        }
    }
}