<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('position_assignment_logs', function (Blueprint $table) {
            $table->id();

            // Nullable FK — position may be hard-deleted later
            $table->foreignId('position_id')
                  ->nullable()
                  ->constrained('positions')
                  ->nullOnDelete();

            // Snapshot — persists even if position is deleted
            $table->string('position_title');
            $table->string('position_tier')->nullable();

            // Nullable FK — user may be deleted later
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            // Snapshot — persists even if user/PI is deleted
            $table->string('user_name');
            $table->string('employee_id')->nullable();

            // 'assigned' or 'unassigned'
            $table->enum('event', ['assigned', 'unassigned']);

            // Admin who performed the action
            $table->foreignId('performed_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->timestamp('created_at')->useCurrent();

            // Index for ORDER BY created_at DESC pagination queries
            $table->index('created_at', 'pal_created_at_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('position_assignment_logs');
    }
};