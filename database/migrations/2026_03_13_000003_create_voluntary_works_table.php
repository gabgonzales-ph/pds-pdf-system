<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voluntary_works', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->text('org_name_address')->nullable()
                  ->comment('Name & Address of Organization — full name, combined field');
            $table->date('date_from')->nullable();
            $table->date('date_to')->nullable();
            $table->unsignedInteger('hours')->nullable()
                  ->comment('Number of hours of involvement');
            $table->string('position')->nullable()
                  ->comment('Position / Nature of Work');

            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voluntary_works');
    }
};
