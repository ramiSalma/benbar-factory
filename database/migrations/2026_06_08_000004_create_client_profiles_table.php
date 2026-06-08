<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_profiles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // --- From diagram ---
            $table->string('company_name')->nullable();
            $table->string('industry')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();

            // --- Extended client fields ---
            $table->string('company_size')->nullable()->comment('e.g. 1-10, 11-50, 51-200, 200+');
            $table->string('company_logo')->nullable();
            $table->text('bio')->nullable();
            $table->string('vat_number')->nullable();
            $table->string('billing_address')->nullable();
            $table->string('billing_city')->nullable();
            $table->string('billing_country')->nullable();
            $table->string('billing_zip')->nullable();

            // --- Preferences ---
            $table->enum('preferred_communication', ['email', 'phone', 'chat'])->default('email');
            $table->boolean('receive_newsletter')->default(true);
            $table->boolean('profile_verified')->default(false);  // Admin verified

            // --- Stats (cached/denormalized) ---
            $table->unsignedInteger('total_projects')->default(0);
            $table->unsignedInteger('active_projects')->default(0);
            $table->decimal('total_spent', 12, 2)->default(0);

            // --- Payment ---
            $table->string('stripe_customer_id')->nullable();
            $table->string('default_payment_method')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_profiles');
    }
};
