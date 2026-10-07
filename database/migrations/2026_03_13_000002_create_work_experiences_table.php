<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->date('date_from')->nullable();
            $table->date('date_to')->nullable();
            $table->string('position_title')->nullable();
            $table->string('department_agency')->nullable()
                  ->comment('Department / Agency / Office / Company — full name');
            $table->string('status_of_appointment', 100)->nullable()
                  ->comment('Permanent / Temporary / Casual / Contractual etc.');
            $table->char('is_government_service', 1)->nullable()
                  ->comment('Y or N');

            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_experiences');
    }
};
