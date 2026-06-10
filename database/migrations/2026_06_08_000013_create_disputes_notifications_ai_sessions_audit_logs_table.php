<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // --- Disputes ---
        Schema::create('disputes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('mission_id');
            $table->foreign('mission_id')->references('id')->on('missions')->onDelete('cascade');

            $table->unsignedBigInteger('raised_by');
            $table->foreign('raised_by')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('against_user_id');
            $table->foreign('against_user_id')->references('id')->on('users')->onDelete('cascade');

            // --- Admin handling ---
            $table->unsignedBigInteger('assigned_admin_id')->nullable();
            $table->foreign('assigned_admin_id')->references('id')->on('users')->onDelete('set null');

            // --- From diagram ---
            $table->string('subject');
            $table->text('description');
            $table->enum('status', ['open', 'under_review', 'resolved', 'closed', 'escalated'])
                ->default('open');

            // --- Extended fields ---
            $table->enum('type', ['payment', 'quality', 'deadline', 'communication', 'other'])
                ->default('other');
            $table->enum('resolution', ['refund', 'partial_refund', 'no_action', 'warning', 'ban'])
                ->nullable();
            $table->text('resolution_notes')->nullable()->comment('Admin resolution summary');
            $table->decimal('refund_amount', 10, 2)->nullable();
            $table->json('evidence_urls')->nullable()->comment('File URLs submitted as evidence');
            $table->timestamp('resolved_at')->nullable();
            $table->unsignedBigInteger('resolved_by')->nullable();
            $table->foreign('resolved_by')->references('id')->on('users')->onDelete('set null');

            $table->timestamps();
            $table->index('mission_id');
            $table->index('status');
            $table->index('raised_by');
        });

        // --- AI Sessions ---
        Schema::create('ai_sessions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('project_id')->nullable();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
            $table->string('title')->default('New Conversation') ;
            // --- From diagram ---
            $table->text('prompt')->nullable();
            $table->longText('response')->nullable();
            $table->unsignedInteger('tokens_used')->default(0);

            // --- Extended fields ---
            $table->string('model')->default('gpt-4')->comment('AI model used');
            $table->enum('purpose', ['project_brief', 'code_review', 'qa_analysis', 'general', 'matching'])
                ->default('general');
            $table->decimal('cost', 8, 6)->nullable()->comment('API cost in USD');
            $table->json('metadata')->nullable()->comment('Extra context or parameters sent');
            $table->unsignedSmallInteger('duration_ms')->nullable()->comment('Response time in ms');

            $table->timestamps();
            $table->index('user_id');
            $table->index('project_id');
        });

        // --- Notifications ---
        Schema::create('notifications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // --- From diagram ---
            $table->string('title');
            $table->text('message');
            $table->timestamp('read_at')->nullable();

            // --- Extended fields ---
            $table->enum('type', [
                'application', 'mission', 'payment', 'dispute',
                'qa_report', 'system', 'message', 'deadline'
            ])->default('system');
            $table->string('action_url')->nullable()->comment('Frontend route to navigate to');
            $table->json('data')->nullable()->comment('Extra payload for frontend');
            $table->enum('channel', ['in_app', 'email', 'sms', 'push'])->default('in_app');

            $table->timestamps();
            $table->index('user_id');
            $table->index('read_at');
        });

        // --- Audit Logs ---
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            // --- From diagram ---
            $table->string('action');              // e.g. 'created', 'updated', 'deleted', 'approved'
            $table->string('model_type');          // e.g. 'App\Models\Project'
            $table->timestamp('created_at');       // when the action happened

            // --- Extended fields ---
            $table->unsignedBigInteger('model_id')->nullable();
            $table->json('old_values')->nullable()->comment('Snapshot before change');
            $table->json('new_values')->nullable()->comment('Snapshot after change');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('url')->nullable()->comment('Request URL that triggered the action');
            $table->string('tags')->nullable()->comment('e.g. admin-action, auto-system');

            $table->index(['model_type', 'model_id']);
            $table->index('user_id');
            $table->index('action');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('ai_sessions');
        Schema::dropIfExists('disputes');
    }
};
