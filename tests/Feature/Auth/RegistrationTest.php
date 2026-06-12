<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\PhoneOtp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        PhoneOtp::create([
            'phone' => PhoneOtp::normalizePhone('+212600000004'),
            'otp_code' => PhoneOtp::hashCode('123456'),
            'expires_at' => now()->addMinutes(5),
            'verified_at' => now(),
            'attempts' => 1,
        ]);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'client',
            'phone' => '+212600000004',
            'client_type' => 'association',
            'contact_name' => 'Acme Contact',
            'company_name' => 'Acme Studio',
            'industry' => 'Education',
            'registration_number' => 'RNA-123',
            'billing_address' => '12 Test Street',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::where('email', 'test@example.com')->firstOrFail();

        $this->assertDatabaseHas('user_roles', [
            'model_id' => $user->id,
            'model_type' => User::class,
        ]);
        $this->assertDatabaseHas('client_profiles', [
            'user_id' => $user->id,
            'client_type' => 'association',
            'contact_name' => 'Acme Contact',
            'company_name' => 'Acme Studio',
        ]);
    }
}
