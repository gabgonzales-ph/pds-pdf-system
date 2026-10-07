<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('civil_service_eligibilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->string('career_service')->nullable()
                  ->comment('Career Service / RA 1080 / Other exam name');
            $table->string('rating')->nullable()
                  ->comment('Rating (if applicable)');
            $table->date('date_of_examination')->nullable();
            $table->string('place_of_examination')->nullable();
            $table->string('license_number')->nullable();
            $table->date('license_validity')->nullable();

            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('civil_service_eligibilities');
    }
};
