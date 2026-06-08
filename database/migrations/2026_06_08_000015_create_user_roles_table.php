<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('user_roles')) {
            Schema::create('user_roles', function (Blueprint $table) {
                $table->unsignedBigInteger('role_id');
                $table->string('model_type');
                $table->unsignedBigInteger('model_id');
                $table->index(['model_id', 'model_type'], 'user_roles_model_id_model_type_index');
                $table->foreign('role_id')
                    ->references('id')
                    ->on('roles')
                    ->cascadeOnDelete();
                $table->primary(['role_id', 'model_id', 'model_type'], 'user_roles_role_model_type_primary');
            });
        }

        if (Schema::hasTable('model_has_roles')) {
            DB::table('model_has_roles')
                ->orderBy('role_id')
                ->each(function (object $role): void {
                    DB::table('user_roles')->updateOrInsert([
                        'role_id' => $role->role_id,
                        'model_type' => $role->model_type,
                        'model_id' => $role->model_id,
                    ]);
                });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('model_has_roles')) {
            Schema::dropIfExists('user_roles');
        }
    }
};
