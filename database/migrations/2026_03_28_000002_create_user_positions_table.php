<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_positions', function (Blueprint $table) {
            $table->id();

            // ── Core Relationship ─────────────────────────────────────
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->comment('The employee being assigned the position');

            $table->foreignId('position_id')
                  ->constrained('positions')
                  ->cascadeOnDelete()
                  ->comment('The position being assigned');

            // ── Assignment Tracking ───────────────────────────────────
            $table->foreignId('assigned_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete()
                  ->comment('Admin who performed the assignment');

            // ── Constraints ───────────────────────────────────────────
            // CHANGED: Enforcing strict 1-to-1 matching. A single position cannot be attached to multiple users.
            $table->unique('position_id', 'unique_position_assignment')
                  ->comment('Prevents a position from being assigned to multiple users simultaneously');

            // ── Timestamp (immutable — no updated_at) ─────────────────
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_positions');
    }
};