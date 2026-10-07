<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();

            // ── Actor ─────────────────────────────────────────────────
            $table->foreignId('actor_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete()
                  ->comment('The user (admin or regular user) who performed the action');
            $table->enum('actor_type', ['admin', 'user', 'system'])
                  ->default('system')
                  ->comment('Role context of the actor at the time of the action');

            // ── Action ────────────────────────────────────────────────
            $table->string('action')
                  ->comment('Standardized action type, e.g. ADMIN_LOGIN, PDS_REMOVED');

            // ── Affected Entity ───────────────────────────────────────
            $table->string('entity_type')
                  ->nullable()
                  ->comment('Model or resource type affected, e.g. User, Position');
            $table->unsignedBigInteger('entity_id')
                  ->nullable()
                  ->comment('Primary key of the affected record');

            // ── Field-level Changes ───────────────────────────────────
            $table->json('changes')
                  ->nullable()
                  ->comment('Stores before/after values per field for update actions');

            // ── Request Context ───────────────────────────────────────
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();

            // ── Timestamp (immutable — no updated_at) ─────────────────
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
