<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('children', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_background_id')
                  ->constrained('family_backgrounds')
                  ->cascadeOnDelete();
            $table->string('name');
            $table->date('date_of_birth')->nullable();
            $table->unsignedInteger('order')->default(0)->comment('Display order');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('children');
    }
};
