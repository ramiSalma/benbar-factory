<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(['admin', 'client', 'freelancer', 'qa'])->each(
            fn (string $role) => Role::firstOrCreate([
                'name' => $role,
                'guard_name' => 'web',
            ])
        );
    }
}
