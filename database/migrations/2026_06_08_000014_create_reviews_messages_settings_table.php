<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // --- Reviews (client rates freelancer after mission, and vice versa) ---
        Schema::create('reviews', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('mission_id');
            $table->foreign('mission_id')->references('id')->on('missions')->onDelete('cascade');

            $table->unsignedBigInteger('reviewer_id')->comment('Who wrote the review');
            $table->foreign('reviewer_id')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('reviewee_id')->comment('Who is being reviewed');
            $table->foreign('reviewee_id')->references('id')->on('users')->onDelete('cascade');

            $table->enum('role', ['client_to_freelancer', 'freelancer_to_client'])->comment('Direction of review');
            $table->decimal('rating', 3, 2)->comment('1.00 to 5.00');
            $table->text('comment')->nullable();

            // --- Criteria ratings ---
            $table->decimal('quality_rating', 3, 2)->nullable();
            $table->decimal('communication_rating', 3, 2)->nullable();
            $table->decimal('deadline_rating', 3, 2)->nullable();
            $table->decimal('professionalism_rating', 3, 2)->nullable();

            $table->boolean('is_public')->default(true);
            $table->boolean('is_featured')->default(false); // Admin can feature reviews

            $table->timestamps();

            $table->unique(['mission_id', 'reviewer_id', 'role']);
            $table->index('reviewee_id');
        });

        // --- Messages (direct messaging between users) ---
        Schema::create('conversations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');

            $table->unsignedBigInteger('mission_id')->nullable();
            $table->foreign('mission_id')->references('id')->on('missions')->onDelete('set null');

            $table->string('subject')->nullable();
            $table->enum('type', ['project', 'mission', 'support', 'general'])->default('general');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();
        });

        Schema::create('conversation_participants', function (Blueprint $table) {
            $table->unsignedBigInteger('conversation_id');
            $table->unsignedBigInteger('user_id');
            $table->primary(['conversation_id', 'user_id']);
            $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamp('last_read_at')->nullable();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('conversation_id');
            $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');

            $table->unsignedBigInteger('sender_id');
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');

            $table->text('body');
            $table->json('attachments')->nullable()->comment('Array of {name, url, type, size}');
            $table->timestamp('read_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('conversation_id');
            $table->index('sender_id');
        });

        // --- Platform settings (admin-controlled key/value store) ---
        Schema::create('platform_settings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string')->comment('string, integer, boolean, json');
            $table->string('group')->nullable()->comment('e.g. fees, email, limits');
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false)->comment('Expose to frontend?');
            $table->timestamps();
        });

        // --- Skill tags (normalized list for freelancer skill matching) ---
        Schema::create('skill_tags', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('category')->nullable()->comment('e.g. frontend, backend, mobile, devops');
            $table->unsignedInteger('usage_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_tags');
        Schema::dropIfExists('platform_settings');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversation_participants');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('reviews');
    }
};
