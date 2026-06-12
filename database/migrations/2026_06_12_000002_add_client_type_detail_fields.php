<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client_profiles', function (Blueprint $table) {
            $table->string('contact_name')->nullable()->after('client_type');
            $table->string('registration_number')->nullable()->after('vat_number');
            $table->string('department')->nullable()->after('registration_number');
            $table->string('study_office_speciality')->nullable()->after('department');
        });
    }

    public function down(): void
    {
        Schema::table('client_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'contact_name',
                'registration_number',
                'department',
                'study_office_speciality',
            ]);
        });
    }
};
