<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // --- Repositories ---
        Schema::create('repositories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('project_id');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');

            $table->unsignedBigInteger('github_account_id')->nullable();
            $table->foreign('github_account_id')->references('id')->on('github_accounts')->onDelete('set null');

            // --- From diagram ---
            $table->string('name');
            $table->string('url');
            $table->string('visibility')->default('private'); // 'public' or 'private'

            // --- Extended fields ---
            $table->string('github_repo_id')->nullable()->comment('GitHub internal ID');
            $table->string('default_branch')->default('main');
            $table->text('description')->nullable();
            $table->json('languages')->nullable()->comment('Detected languages from GitHub API');
            $table->boolean('webhook_active')->default(false);
            $table->string('webhook_secret')->nullable();

            $table->timestamps();
            $table->index('project_id');
        });

        // --- Commits ---
        Schema::create('commits', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('repository_id');
            $table->foreign('repository_id')->references('id')->on('repositories')->onDelete('cascade');

            $table->unsignedBigInteger('mission_id')->nullable();
            $table->foreign('mission_id')->references('id')->on('missions')->onDelete('set null');

            $table->unsignedBigInteger('author_user_id')->nullable();
            $table->foreign('author_user_id')->references('id')->on('users')->onDelete('set null');

            // --- From diagram ---
            $table->string('sha')->unique();
            $table->text('message');

            // --- Extended fields ---
            $table->string('branch')->nullable();
            $table->string('author_github_login')->nullable();
            $table->string('author_email')->nullable();
            $table->timestamp('committed_at')->nullable();
            $table->unsignedSmallInteger('additions')->default(0);
            $table->unsignedSmallInteger('deletions')->default(0);
            $table->unsignedSmallInteger('changed_files')->default(0);
            $table->string('url')->nullable()->comment('GitHub commit URL');

            $table->timestamps();
            $table->index('repository_id');
            $table->index('mission_id');
        });

        // --- Pull Requests ---
        Schema::create('pull_requests', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('repository_id');
            $table->foreign('repository_id')->references('id')->on('repositories')->onDelete('cascade');

            $table->unsignedBigInteger('mission_id')->nullable();
            $table->foreign('mission_id')->references('id')->on('missions')->onDelete('set null');

            $table->unsignedBigInteger('author_user_id')->nullable();
            $table->foreign('author_user_id')->references('id')->on('users')->onDelete('set null');

            $table->unsignedBigInteger('reviewer_user_id')->nullable();
            $table->foreign('reviewer_user_id')->references('id')->on('users')->onDelete('set null');

            // --- From diagram ---
            $table->unsignedInteger('pr_number');
            $table->string('title');
            $table->enum('status', ['open', 'review', 'approved', 'merged', 'closed'])->default('open');

            // --- Extended fields ---
            $table->text('description')->nullable();
            $table->string('base_branch')->default('main');
            $table->string('head_branch')->nullable();
            $table->string('url')->nullable()->comment('GitHub PR URL');
            $table->text('review_notes')->nullable();
            $table->timestamp('merged_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->unsignedSmallInteger('additions')->default(0);
            $table->unsignedSmallInteger('deletions')->default(0);

            $table->timestamps();
            $table->index('repository_id');
            $table->index('mission_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pull_requests');
        Schema::dropIfExists('commits');
        Schema::dropIfExists('repositories');
    }
};
