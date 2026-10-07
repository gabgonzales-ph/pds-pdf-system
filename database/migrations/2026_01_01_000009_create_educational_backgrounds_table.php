<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('educational_backgrounds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->enum('level', [
                'Elementary',
                'Secondary',
                'Vocation/Trade Course',
                'College',
                'Graduate Studies',
            ]);

            $table->string('school_name')->nullable();
            $table->string('academic_degree', 20)->nullable();
            $table->string('degree_course')->nullable()->comment('Basic Education / Degree / Course');
            $table->string('attendance_from', 10)->nullable();
            $table->string('attendance_to', 13)->nullable();
            $table->string('highest_level')->nullable()->comment('Highest Level / Units Earned if not graduated');
            $table->string('year_graduated', 13)->nullable();
            $table->string('honors_received')->nullable()->comment('Scholarship / Academic Honors Received');

            $table->timestamps();

            // One record per level per user
            $table->unique(['user_id', 'level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('educational_backgrounds');
    }
};
