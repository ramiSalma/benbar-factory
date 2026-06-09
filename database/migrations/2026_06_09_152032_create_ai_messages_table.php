<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_messages', function (Blueprint $table) {

            $table->id();

            $table->foreignId('ai_session_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->enum('role', ['system', 'user', 'assistant']);

            $table->longText('content');

            $table->unsignedInteger('tokens_used')->nullable();

            $table->string('model')->nullable();

            $table->timestamps();

            $table->index('ai_session_id');
            $table->index('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_messages');
    }
};
