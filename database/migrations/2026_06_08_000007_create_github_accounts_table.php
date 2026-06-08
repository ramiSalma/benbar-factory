<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('github_accounts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // --- From diagram ---
            $table->string('github_id');
            $table->string('username');

            // --- Extended fields ---
            $table->string('access_token')->nullable();
            $table->string('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('profile_url')->nullable();
            $table->string('email')->nullable()->comment('GitHub public email');
            $table->json('scopes')->nullable()->comment('OAuth scopes granted');

            $table->timestamps();

            $table->index('github_id');
            $table->index('username');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('github_accounts');
    }
};
