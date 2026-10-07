<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // --- Account Credentials ---
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('employee_id')->unique()->comment('Numeric employee ID, stored as string to preserve leading zeros');

            // --- Role & Department ---
            $table->enum('role', ['user', 'admin'])->default('user');
            $table->foreignId('department_id')
                  ->nullable()
                  ->constrained('departments')
                  ->nullOnDelete();
            $table->foreignId('career_service_id')
                  ->nullable()
                  ->constrained('career_services')
                  ->nullOnDelete();
 

            // --- Laravel Default Fields ---
            
            $table->rememberToken();
            $table->timestamp('email_verified_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
