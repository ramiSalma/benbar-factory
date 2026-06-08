<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qa_profiles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // --- From diagram ---
            $table->string('speciality')->nullable();          // e.g. "Manual Testing", "Automation QA"
            $table->unsignedSmallInteger('experience_years')->default(0);

            // --- Extended QA fields ---
            $table->text('bio')->nullable();
            $table->json('tools')->nullable()->comment('e.g. ["Selenium","Cypress","Postman"]');
            $table->json('methodologies')->nullable()->comment('e.g. ["TDD","BDD","Exploratory"]');
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->boolean('availability')->default(true);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->unsignedInteger('total_reviews')->default(0);
            $table->unsignedInteger('completed_reviews')->default(0);
            $table->boolean('profile_verified')->default(false);  // Admin verified

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qa_profiles');
    }
};
