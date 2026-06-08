<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->bigIncrements('id');

            // --- From diagram ---
            $table->string('name');
            $table->text('description');
            $table->decimal('budget', 12, 2);
            $table->enum('status', ['draft', 'open', 'in_progress', 'review', 'completed', 'cancelled', 'disputed'])
                ->default('draft');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            // --- Relationships ---
            $table->unsignedBigInteger('client_user_id');
            $table->foreign('client_user_id')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('client_request_id')->nullable();
            $table->foreign('client_request_id')->references('id')->on('client_requests')->onDelete('set null');

            $table->unsignedBigInteger('assigned_freelancer_id')->nullable()->comment('Main assigned freelancer');
            $table->foreign('assigned_freelancer_id')->references('id')->on('users')->onDelete('set null');

            $table->unsignedBigInteger('qa_reviewer_id')->nullable();
            $table->foreign('qa_reviewer_id')->references('id')->on('users')->onDelete('set null');

            // --- Extended fields ---
            $table->string('slug')->unique()->nullable();
            $table->enum('project_type', ['fixed', 'hourly', 'milestone'])->default('fixed');
            $table->string('currency', 3)->default('USD');
            $table->decimal('agreed_rate', 10, 2)->nullable()->comment('Hourly rate if hourly type');
            $table->json('tech_stack')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_private')->default(false);
            $table->boolean('nda_required')->default(false);
            $table->string('nda_document_url')->nullable();

            // --- Admin control ---
            $table->boolean('is_featured')->default(false);
            $table->text('admin_notes')->nullable();
            $table->unsignedBigInteger('created_by_admin')->nullable();
            $table->foreign('created_by_admin')->references('id')->on('users')->onDelete('set null');

            // --- Progress tracking ---
            $table->unsignedTinyInteger('completion_percentage')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('client_user_id');
            $table->index('assigned_freelancer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
