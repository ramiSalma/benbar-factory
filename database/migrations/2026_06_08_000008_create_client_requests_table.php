<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_requests', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('client_user_id');
            $table->foreign('client_user_id')->references('id')->on('users')->onDelete('cascade');

            // --- From diagram ---
            $table->string('title');
            $table->text('description');
            $table->enum('status', ['draft', 'published', 'in_review', 'accepted', 'rejected', 'closed'])
                ->default('draft');

            // --- Extended fields ---
            $table->decimal('budget_min', 10, 2)->nullable();
            $table->decimal('budget_max', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->date('deadline')->nullable();
            $table->json('required_skills')->nullable();
            $table->enum('project_type', ['fixed', 'hourly', 'milestone'])->default('fixed');
            $table->enum('experience_level', ['junior', 'mid', 'senior', 'expert'])->nullable();
            $table->unsignedSmallInteger('estimated_duration_weeks')->nullable();
            $table->boolean('is_featured')->default(false);         // Admin can feature requests
            $table->text('admin_notes')->nullable();                // Admin internal notes
            $table->unsignedBigInteger('reviewed_by')->nullable(); // Admin who reviewed
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('applications_count')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('client_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_requests');
    }
};
