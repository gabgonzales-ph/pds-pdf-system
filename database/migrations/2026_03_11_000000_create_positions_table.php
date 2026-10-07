<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('positions', function (Blueprint $table) {
            $table->id();

            // ── Basic Info ────────────────────────────────────────────
            $table->string('position_title')->nullable();
            $table->enum('tier', ['executive', 'management', 'staff'])
                  ->nullable()
                  ->comment('Hierarchy tier of the position');
            $table->string('item_number')->nullable();
            $table->string('salary_grade')->nullable();

            // ── Local Government ──────────────────────────────────────
            $table->enum('gov_unit_type', ['Province', 'City', 'Municipality'])->nullable();
            $table->enum('gov_unit_class', ['1st Class', '2nd Class', '3rd Class', '4th Class', '5th Class', '6th Class', 'Special'])->nullable();

            // ── Office / Location ─────────────────────────────────────
            $table->string('department_agency')->nullable();
            $table->string('bureau_office')->nullable();
            $table->string('department_branch_division')->nullable();
            $table->string('workstation')->nullable();

            // ── Appropriation / Compensation ──────────────────────────
            $table->string('present_approp_act')->nullable();
            $table->string('previous_approp_act')->nullable();
            $table->string('salary_authorized')->nullable();
            $table->string('other_compensation')->nullable();

            // ── Supervision ───────────────────────────────────────────
            $table->string('immediate_supervisor_title')->nullable();
            $table->string('next_higher_supervisor_title')->nullable();

            // ── Dynamic JSON fields ───────────────────────────────────
            $table->json('supervised_positions')->nullable();
            $table->json('equipment_tools')->nullable();
            $table->json('contacts_internal')->nullable();
            $table->json('contacts_external')->nullable();

            // ── Working Condition ─────────────────────────────────────
            $table->enum('working_condition_type', ['Office Work', 'Field Work', 'Others'])->nullable();
            $table->string('working_condition_other')->nullable();
            $table->enum('working_condition_frequency', ['Occasional', 'Frequent'])->nullable();

            // ── Function Descriptions ─────────────────────────────────
            $table->text('unit_function_description')->nullable();
            $table->text('position_function_description')->nullable();

            // ── Qualification Standards ───────────────────────────────
            $table->string('edu_standard')->nullable();
            $table->string('experience_standard')->nullable();
            $table->string('training_standard')->nullable();
            $table->string('eligibility_standard')->nullable();

            $table->json('core_competencies')->nullable();
            $table->json('leadership_competencies')->nullable();

            // ── Duties & Responsibilities ─────────────────────────────
            $table->json('duties_responsibilities')->nullable();

            // ── Status ────────────────────────────────────────────────
            $table->enum('status', ['draft', 'published'])->default('draft');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};