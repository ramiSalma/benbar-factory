<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('city');
            $table->timestamp('phone_verified_at')->nullable()->after('phone');
        });

        Schema::table('client_profiles', function (Blueprint $table) {
            $table->enum('client_type', [
                'particulier',
                'entreprise',
                'association',
                'administration',
                'bureau_etudes',
            ])->default('particulier')->after('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('client_profiles', function (Blueprint $table) {
            $table->dropColumn('client_type');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'phone_verified_at']);
        });
    }
};
