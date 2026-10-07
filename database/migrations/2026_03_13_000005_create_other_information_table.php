<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('other_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->unique()
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('One-to-one with users');

            // Each stored as a JSON array of strings
            $table->json('special_skills')->nullable()
                  ->comment('Special skills / hobbies');
            $table->json('non_academic_distinctions')->nullable()
                  ->comment('Non-academic distinctions / recognition');
            $table->json('organization_memberships')->nullable()
                  ->comment('Membership in civic/professional organizations');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('other_information');
    }
};
