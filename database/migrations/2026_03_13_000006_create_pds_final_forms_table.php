<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pds_final_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->unique()
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('One-to-one with users');

            // ── Question 34: Relatives in government ─────────────────
            $table->boolean('q34a')->nullable();
            $table->boolean('q34b')->nullable()
                  ->comment('LGU Career Employees — fourth degree');
            $table->text('q34_details')->nullable()
                  ->comment('Shared details for 34a and/or 34b');

            // ── Question 35: Administrative / criminal charges ────────
            $table->boolean('q35a')->nullable();
            $table->text('q35a_details')->nullable();
            $table->boolean('q35b')->nullable();
            $table->date('q35b_date_filed')->nullable()
                  ->comment('Date the criminal charge was filed');
            $table->string('q35b_status', 255)->nullable()
                  ->comment('Status of Case/s e.g. Pending, Dismissed');

            // ── Question 36: Convicted of crime ──────────────────────
            $table->boolean('q36')->nullable();
            $table->text('q36_details')->nullable();

            // ── Question 37: Separated from service ──────────────────
            $table->boolean('q37')->nullable();
            $table->text('q37_details')->nullable();

            // ── Question 38: Election candidate / campaign ───────────
            $table->boolean('q38a')->nullable();
            $table->text('q38a_details')->nullable();
            $table->boolean('q38b')->nullable();
            $table->text('q38b_details')->nullable();

            // ── Question 39: Immigrant / permanent resident ───────────
            $table->boolean('q39')->nullable();
            $table->text('q39_details')->nullable();

            // ── Question 40: Indigenous / PWD / Solo parent ───────────
            $table->boolean('q40a')->nullable();
            $table->text('q40a_details')->nullable()
                  ->comment('Name of indigenous group');
            $table->boolean('q40b')->nullable();
            $table->text('q40b_details')->nullable()
                  ->comment('PWD ID Number');
            $table->boolean('q40c')->nullable();
            $table->text('q40c_details')->nullable()
                  ->comment('Solo Parent ID Number');

            // ── Question 41: References (3 rows) ─────────────────────
            $table->string('ref1_name',    255)->nullable();
            $table->string('ref1_address', 500)->nullable();
            $table->string('ref1_contact', 255)->nullable();

            $table->string('ref2_name',    255)->nullable();
            $table->string('ref2_address', 500)->nullable();
            $table->string('ref2_contact', 255)->nullable();

            $table->string('ref3_name',    255)->nullable();
            $table->string('ref3_address', 500)->nullable();
            $table->string('ref3_contact', 255)->nullable();

            // ── Government Issued ID ─────────────────────────────────
            $table->string('gov_id_type',  255)->nullable()
                  ->comment('Type of ID e.g. Passport, Driver\'s License, SSS');
            $table->string('gov_id_number', 255)->nullable()
                  ->comment('ID / License / Passport number');
            $table->date('gov_id_date_issued')->nullable()
                  ->comment('Date the ID was issued');
            $table->string('gov_id_place_issued', 500)->nullable()
                  ->comment('Place / office where the ID was issued');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pds_final_forms');
    }
};
