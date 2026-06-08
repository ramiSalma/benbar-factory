<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('freelancer_profiles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // --- From diagram ---
            $table->string('title');                          // e.g. "Full Stack Developer"
            $table->json('skills');                           // array of skill strings
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->string('speciality')->nullable();
            $table->unsignedSmallInteger('experience_years')->default(0);
            $table->string('portfolio_url')->nullable();
            $table->boolean('availability')->default(true);

            // --- Extended freelancer fields ---
            $table->text('bio')->nullable();
            $table->string('headline')->nullable()->comment('Short tagline shown on profile');
            $table->json('languages')->nullable()->comment('[{"lang":"French","level":"Native"}]');
            $table->json('certifications')->nullable()->comment('Array of certification objects');
            $table->json('education')->nullable()->comment('Array of education objects');

            // --- Rate & payment ---
            $table->decimal('minimum_project_budget', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->string('stripe_account_id')->nullable()->comment('Stripe Connect account for payouts');
            $table->boolean('stripe_onboarded')->default(false);
            $table->string('iban')->nullable();
            $table->string('bank_name')->nullable();

            // --- Identity & verification ---
            $table->boolean('identity_verified')->default(false);  // Admin verified KYC
            $table->string('id_document_url')->nullable();
            $table->timestamp('identity_verified_at')->nullable();
            $table->unsignedBigInteger('verified_by')->nullable()->comment('Admin user_id who verified');
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');

            // --- Availability & work preferences ---
            $table->enum('work_type', ['full_time', 'part_time', 'contract', 'freelance'])->default('freelance');
            $table->unsignedSmallInteger('hours_per_week')->nullable();
            $table->json('preferred_project_types')->nullable();  // e.g. ["web","mobile","api"]

            // --- Stats (cached/denormalized) ---
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->unsignedInteger('total_reviews')->default(0);
            $table->unsignedInteger('completed_missions')->default(0);
            $table->decimal('total_earned', 12, 2)->default(0);
            $table->unsignedInteger('on_time_delivery_rate')->default(0)->comment('Percentage 0-100');

            // --- Profile status ---
            $table->enum('profile_status', ['draft', 'submitted', 'approved', 'rejected', 'suspended'])
                ->default('draft');
            $table->text('rejection_reason')->nullable();

            $table->timestamps();

            $table->index('availability');
            $table->index('profile_status');
            $table->index('hourly_rate');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('freelancer_profiles');
    }
};
