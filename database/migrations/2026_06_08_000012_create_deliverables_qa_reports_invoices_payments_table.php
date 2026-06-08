<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // --- Deliverables ---
        Schema::create('deliverables', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('mission_id');
            $table->foreign('mission_id')->references('id')->on('missions')->onDelete('cascade');

            $table->unsignedBigInteger('submitted_by');
            $table->foreign('submitted_by')->references('id')->on('users')->onDelete('cascade');

            // --- From diagram ---
            $table->string('file_url')->nullable();
            $table->string('version')->default('1.0');
            $table->timestamp('submitted_at')->useCurrent();

            // --- Extended fields ---
            $table->text('description')->nullable();
            $table->json('files')->nullable()->comment('Array of {name, url, size, type}');
            $table->string('demo_url')->nullable();
            $table->string('repository_branch')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'revision_requested'])
                ->default('pending');
            $table->text('feedback')->nullable()->comment('Client or QA feedback');
            $table->unsignedBigInteger('pull_request_id')->nullable();
            $table->foreign('pull_request_id')->references('id')->on('pull_requests')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();
            $table->index('mission_id');
        });

        // --- QA Reports ---
        Schema::create('qa_reports', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('mission_id');
            $table->foreign('mission_id')->references('id')->on('missions')->onDelete('cascade');

            $table->unsignedBigInteger('deliverable_id')->nullable();
            $table->foreign('deliverable_id')->references('id')->on('deliverables')->onDelete('set null');

            $table->unsignedBigInteger('qa_reviewer_id');
            $table->foreign('qa_reviewer_id')->references('id')->on('users')->onDelete('cascade');

            // --- From diagram ---
            $table->enum('result', ['pass', 'fail', 'partial', 'pending'])->default('pending');
            $table->text('comments')->nullable();
            $table->integer('score')->nullable()->comment('0-100 quality score');

            // --- Extended fields ---
            $table->text('summary')->nullable();
            $table->json('test_cases')->nullable()->comment('Array of {name, status, notes}');
            $table->json('bugs_found')->nullable()->comment('Array of {severity, description, steps}');
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->nullable();
            $table->unsignedSmallInteger('hours_spent')->nullable();
            $table->string('report_file_url')->nullable();

            $table->timestamps();
            $table->index('mission_id');
            $table->index('qa_reviewer_id');
        });

        // --- Invoices ---
        Schema::create('invoices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('project_id');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');

            $table->unsignedBigInteger('client_user_id');
            $table->foreign('client_user_id')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('freelancer_user_id')->nullable();
            $table->foreign('freelancer_user_id')->references('id')->on('users')->onDelete('set null');

            // --- From diagram ---
            $table->string('reference')->unique();
            $table->decimal('total', 12, 2);
            $table->enum('status', ['draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded'])
                ->default('draft');

            // --- Extended fields ---
            $table->string('currency', 3)->default('USD');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('platform_fee', 10, 2)->default(0)->comment('Platform commission');
            $table->decimal('platform_fee_rate', 5, 2)->default(0);
            $table->json('line_items')->nullable()->comment('Array of {description, qty, unit_price, total}');
            $table->text('notes')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('pdf_url')->nullable();
            $table->string('stripe_invoice_id')->nullable();

            $table->timestamps();
            $table->index('project_id');
            $table->index('status');
            $table->index('reference');
        });

        // --- Payments ---
        Schema::create('payments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('mission_id');
            $table->foreign('mission_id')->references('id')->on('missions')->onDelete('cascade');

            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('set null');

            $table->unsignedBigInteger('payer_user_id');
            $table->foreign('payer_user_id')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('payee_user_id')->nullable()->comment('Freelancer receiving payment');
            $table->foreign('payee_user_id')->references('id')->on('users')->onDelete('set null');

            // --- From diagram ---
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded', 'disputed'])
                ->default('pending');
            $table->timestamp('paid_at')->nullable();

            // --- Extended fields ---
            $table->string('currency', 3)->default('USD');
            $table->enum('payment_method', ['stripe', 'bank_transfer', 'paypal', 'crypto', 'other'])
                ->default('stripe');
            $table->string('transaction_id')->nullable()->comment('External payment gateway ID');
            $table->string('stripe_payment_intent_id')->nullable();
            $table->decimal('platform_fee', 10, 2)->default(0);
            $table->decimal('freelancer_payout', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->string('receipt_url')->nullable();
            $table->boolean('payout_sent')->default(false);
            $table->timestamp('payout_sent_at')->nullable();
            $table->string('stripe_transfer_id')->nullable()->comment('Stripe Connect transfer ID');

            $table->timestamps();
            $table->index('mission_id');
            $table->index('status');
            $table->index('payer_user_id');
            $table->index('payee_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('qa_reports');
        Schema::dropIfExists('deliverables');
    }
};
