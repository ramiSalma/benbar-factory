<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // --- Lots (project subdivisions / sprints) ---
        Schema::create('lots', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('project_id');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');

            // --- From diagram ---
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');

            // --- Extended fields ---
            $table->unsignedSmallInteger('order')->default(0)->comment('Display order within project');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('budget', 10, 2)->nullable();

            $table->timestamps();
            $table->index('project_id');
        });

        // --- Missions (tasks within a lot) ---
        Schema::create('missions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('lot_id');
            $table->foreign('lot_id')->references('id')->on('lots')->onDelete('cascade');

            $table->unsignedBigInteger('project_id');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');

            // --- From diagram ---
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('budget', 10, 2);
            $table->date('deadline')->nullable();
            $table->enum('status', [
                'open', 'assigned', 'in_progress', 'submitted', 'review',
                'approved', 'rejected', 'completed', 'cancelled'
            ])->default('open');

            // --- Extended fields ---
            $table->unsignedBigInteger('assigned_freelancer_id')->nullable();
            $table->foreign('assigned_freelancer_id')->references('id')->on('users')->onDelete('set null');

            $table->unsignedBigInteger('qa_reviewer_id')->nullable();
            $table->foreign('qa_reviewer_id')->references('id')->on('users')->onDelete('set null');

            $table->unsignedSmallInteger('order')->default(0);
            $table->unsignedSmallInteger('estimated_hours')->nullable();
            $table->unsignedSmallInteger('actual_hours')->nullable();
            $table->json('required_skills')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('completion_notes')->nullable();
            $table->text('rejection_reason')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('lot_id');
            $table->index('assigned_freelancer_id');
            $table->index('status');
        });

        // --- Applications (freelancer applies to a mission) ---
        Schema::create('applications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('mission_id');
            $table->foreign('mission_id')->references('id')->on('missions')->onDelete('cascade');

            $table->unsignedBigInteger('freelancer_user_id');
            $table->foreign('freelancer_user_id')->references('id')->on('users')->onDelete('cascade');

            // --- From diagram ---
            $table->float('score')->nullable()->comment('Matching/ranking score');
            $table->text('message')->nullable()->comment('Cover letter / pitch');
            $table->enum('status', ['pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn'])
                ->default('pending');

            // --- Extended fields ---
            $table->decimal('proposed_rate', 10, 2)->nullable();
            $table->unsignedSmallInteger('estimated_hours')->nullable();
            $table->date('available_from')->nullable();
            $table->json('attachments')->nullable()->comment('Portfolio samples or docs');
            $table->text('client_feedback')->nullable()->comment('Why client accepted/rejected');
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();

            $table->unique(['mission_id', 'freelancer_user_id']);
            $table->index('status');
            $table->index('freelancer_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
        Schema::dropIfExists('missions');
        Schema::dropIfExists('lots');
    }
};
