<?php

namespace Database\Seeders;

use App\Models\ClientProfile;
use App\Models\FreelancerProfile;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);


        $this->call([
            RoleSeeder::class,
        ]);

        $admin = User::updateOrCreate(
            ['email' => 'admin@benbar.test'],
            [
                'name' => 'Benbar Admin',
                'password' => Hash::make('password'),
                'status' => 'active',
                'country' => 'Morocco',
                'city' => 'Casablanca',
                'phone' => '+212600000001',
                'phone_verified_at' => now(),
                'email_verified_at' => now(),
            ],
        );
        $admin->syncRoles(['admin']);

        $client = User::updateOrCreate(
            ['email' => 'client@benbar.test'],
            [
                'name' => 'Benbar Client',
                'password' => Hash::make('password'),
                'status' => 'active',
                'country' => 'Morocco',
                'city' => 'Rabat',
                'phone' => '+212600000002',
                'phone_verified_at' => now(),
                'email_verified_at' => now(),
            ],
        );
        $client->syncRoles(['client']);
        ClientProfile::updateOrCreate(
            ['user_id' => $client->id],
            [
                'client_type' => 'entreprise',
                'contact_name' => 'Benbar Client Contact',
                'company_name' => 'Benbar Client Studio',
                'industry' => 'Technology',
                'phone' => $client->phone,
                'website' => 'https://client.benbar.test',
                'company_size' => '11-50',
                'vat_number' => 'ICE-000001',
                'bio' => 'Demo client account seeded for local testing.',
                'billing_address' => '1 Demo Avenue',
                'billing_country' => 'Morocco',
            ],
        );

        $freelancer = User::updateOrCreate(
            ['email' => 'freelancer@benbar.test'],
            [
                'name' => 'Benbar Freelancer',
                'password' => Hash::make('password'),
                'status' => 'active',
                'country' => 'Morocco',
                'city' => 'Marrakech',
                'phone' => '+212600000003',
                'phone_verified_at' => now(),
                'email_verified_at' => now(),
            ],
        );
        $freelancer->syncRoles(['freelancer']);
        FreelancerProfile::updateOrCreate(
            ['user_id' => $freelancer->id],
            [
                'title' => 'Full Stack Developer',
                'skills' => ['Laravel', 'React', 'Inertia'],
                'hourly_rate' => 50,
                'speciality' => 'Web applications',
                'experience_years' => 5,
                'portfolio_url' => 'https://freelancer.benbar.test',
                'availability' => true,
                'bio' => 'Demo freelancer account seeded for local testing.',
                'headline' => 'Laravel and React product builder',
                'currency' => 'USD',
                'work_type' => 'freelance',
                'hours_per_week' => 30,
            ],
        );
    }
}
