<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personal_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->unique()
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('One-to-one relationship with users');

            // --- Section 1: Personal Information ---
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('suffix')->nullable()->comment('e.g. Jr., Sr., III');
            $table->date('date_of_birth');
            $table->string('birth_place');
            $table->enum('sex', ['Male', 'Female']);
            $table->enum('civil_status', [
                'Single',
                'Married',
                'Widowed',
                'Separated',
                'Other/s',
            ]);
            $table->string('blood_type')->comment('e.g. A+, O-, AB+');
            $table->string('citizenship')->comment('e.g. Filipino, Dual Citizen - By birth');
            $table->decimal('height_cm', 5, 2)->nullable()->comment('Height in centimeters');
            $table->decimal('weight_kg', 5, 2)->nullable()->comment('Weight in kilograms');
            $table->string('mobile_no');
            $table->string('telephone_no')->nullable();

            // --- Section 2: Residential Address ---
            $table->string('house_block_lot_no')->nullable()->comment('House/Block/Lot No.');
            $table->string('street')->nullable();
            $table->string('subdivision_village')->nullable();
            $table->string('barangay');
            $table->string('city_municipality');
            $table->string('province');
            $table->string('region');
            $table->string('zip_code')->nullable();

            // --- Section 3: Permanent Address ---
            $table->string('perm_house_block_lot_no')->nullable()->comment('House/Block/Lot No.');
            $table->string('perm_street')->nullable();
            $table->string('perm_subdivision_village')->nullable();
            $table->string('perm_barangay');
            $table->string('perm_city');
            $table->string('perm_province');
            $table->string('perm_region');
            $table->string('perm_zip_code')->nullable();

            // --- Section 4: Government-Issued IDs (optional) ---
            $table->string('umid_no')->nullable();
            $table->string('pagibig_no')->nullable();
            $table->string('philhealth_no')->nullable();
            $table->string('philsys_no')->nullable()->comment('PhilSys Number (PSN)');
            $table->string('tin_no')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_information');
    }
};