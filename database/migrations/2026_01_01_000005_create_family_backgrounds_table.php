<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('family_backgrounds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->unique()
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('One-to-one relationship with users');

            // --- Section 1: Father's Name ---
            $table->string('father_surname')->nullable();
            $table->string('father_first_name')->nullable();
            $table->string('father_middle_name')->nullable();
            $table->string('father_suffix')->nullable();

            // --- Section 2: Mother's Maiden Name ---
            $table->string('mother_surname')->nullable();
            $table->string('mother_first_name')->nullable();
            $table->string('mother_middle_name')->nullable();
            $table->string('mother_suffix')->nullable();

            // --- Section 3: Spouse (entirely optional) ---
            $table->string('spouse_surname')->nullable();
            $table->string('spouse_first_name')->nullable();
            $table->string('spouse_middle_name')->nullable();
            $table->string('spouse_suffix')->nullable();
            $table->date('spouse_birthdate')->nullable();
            $table->string('spouse_occupation')->nullable();
            $table->string('spouse_employer')->nullable();
            $table->string('spouse_business_address')->nullable();
            $table->string('spouse_telephone')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_backgrounds');
    }
};
