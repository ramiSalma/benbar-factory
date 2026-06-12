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
        Schema::table('projects', function (Blueprint $table) {
            if (! Schema::hasColumn('projects', 'cahier_de_charge_pdf_path')) {
                $table->string('cahier_de_charge_pdf_path')->nullable()->after('cahier_de_charge');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'cahier_de_charge_pdf_path')) {
                $table->dropColumn('cahier_de_charge_pdf_path');
            }
        });
    }
};
