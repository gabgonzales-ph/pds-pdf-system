<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_developments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->string('title')->nullable()
                  ->comment('Title of Learning & Development Intervention / Training Program');
            $table->date('date_from')->nullable();
            $table->date('date_to')->nullable();
            $table->unsignedInteger('hours')->nullable()
                  ->comment('Number of hours');
            $table->enum('ld_type', [
                'MANAGERIAL',
                'SUPERVISORY',
                'TECHNICAL',
                'FOUNDATION',
            ])->nullable()->comment('Type of LD');
            $table->string('conducted_by')->nullable()
                  ->comment('Conducted / Sponsored By');

            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_developments');
    }
};
