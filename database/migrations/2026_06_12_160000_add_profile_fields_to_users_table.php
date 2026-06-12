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
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('active')->after('password')->index();
            }

            if (! Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar', 2048)->nullable()->after('status');
            }

            if (! Schema::hasColumn('users', 'country')) {
                $table->string('country')->nullable()->after('avatar')->index();
            }

            if (! Schema::hasColumn('users', 'city')) {
                $table->string('city')->nullable()->after('country')->index();
            }

            if (! Schema::hasColumn('users', 'timezone')) {
                $table->string('timezone')->default('UTC')->after('city');
            }

            if (! Schema::hasColumn('users', 'preferred_language')) {
                $table->string('preferred_language', 10)->default('en')->after('timezone');
            }

            if (! Schema::hasColumn('users', 'is_super_admin')) {
                $table->boolean('is_super_admin')->default(false)->after('preferred_language')->index();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = collect([
                'is_super_admin',
                'preferred_language',
                'timezone',
                'city',
                'country',
                'avatar',
                'status',
            ])->filter(fn (string $column) => Schema::hasColumn('users', $column))->all();

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};
