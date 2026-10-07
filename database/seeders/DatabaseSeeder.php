<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            DepartmentSeeder::class,
            CareerServiceSeeder::class,
            AdminSeeder::class,
            UserSeeder::class,
            PositionSeeder::class,
            PositionDescriptionSeeder::class,
            MinimalUserSeeder::class,
        ]);
    }
}
