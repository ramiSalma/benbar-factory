<?php

namespace App\Actions\Fortify;

use App\Models\ClientProfile;
use App\Models\FreelancerProfile;
use App\Models\PhoneOtp;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Spatie\Permission\Models\Role;

class CreateNewUser implements CreatesNewUsers
{
    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     *
     * @throws ValidationException
     */
    public function create(array $input): User
    {
        $validator = Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::in(['client', 'freelancer'])],
            'country' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^\+?[0-9\s().-]{8,30}$/'],
            'client_type' => [
                Rule::requiredIf(($input['role'] ?? null) === 'client'),
                Rule::in(['particulier', 'entreprise', 'association', 'administration', 'bureau_etudes']),
            ],
            'contact_name' => [Rule::requiredIf(($input['role'] ?? null) === 'client'), 'nullable', 'string', 'max:255'],
            'company_name' => [
                Rule::requiredIf(($input['role'] ?? null) === 'client' && ($input['client_type'] ?? null) !== 'particulier'),
                'nullable',
                'string',
                'max:255',
            ],
            'industry' => [
                Rule::requiredIf(($input['role'] ?? null) === 'client' && in_array($input['client_type'] ?? null, ['entreprise', 'association'], true)),
                'nullable',
                'string',
                'max:255',
            ],
            'website' => ['nullable', 'url', 'max:255'],
            'company_size' => [
                Rule::requiredIf(($input['role'] ?? null) === 'client' && in_array($input['client_type'] ?? null, ['entreprise', 'bureau_etudes'], true)),
                'nullable',
                'string',
                'max:255',
            ],
            'vat_number' => [
                Rule::requiredIf(($input['role'] ?? null) === 'client' && ($input['client_type'] ?? null) === 'entreprise'),
                'nullable',
                'string',
                'max:255',
            ],
            'registration_number' => [
                Rule::requiredIf(($input['role'] ?? null) === 'client' && in_array($input['client_type'] ?? null, ['association', 'bureau_etudes'], true)),
                'nullable',
                'string',
                'max:255',
            ],
            'department' => [
                Rule::requiredIf(($input['role'] ?? null) === 'client' && ($input['client_type'] ?? null) === 'administration'),
                'nullable',
                'string',
                'max:255',
            ],
            'study_office_speciality' => [
                Rule::requiredIf(($input['role'] ?? null) === 'client' && ($input['client_type'] ?? null) === 'bureau_etudes'),
                'nullable',
                'string',
                'max:255',
            ],
            'billing_address' => [
                Rule::requiredIf(($input['role'] ?? null) === 'client'),
                'nullable',
                'string',
                'max:255',
            ],
            'bio' => ['nullable', 'string', 'max:2000'],
            'title' => ['nullable', 'string', 'max:255'],
            'speciality' => ['nullable', 'string', 'max:255'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:80'],
            'portfolio_url' => ['nullable', 'url', 'max:255'],
            'headline' => ['nullable', 'string', 'max:255'],
        ]);

        $validator->validate();

        $phone = PhoneOtp::normalizePhone($input['phone']);
        $verifiedOtp = PhoneOtp::query()
            ->where('phone', $phone)
            ->whereNotNull('verified_at')
            ->whereNull('user_id')
            ->where('verified_at', '>=', now()->subMinutes(PhoneOtp::EXPIRES_IN_MINUTES))
            ->latest('verified_at')
            ->first();

        if (! $verifiedOtp) {
            throw ValidationException::withMessages([
                'phone' => __('Verify your phone number before creating your account.'),
            ]);
        }

        return DB::transaction(function () use ($input, $phone, $verifiedOtp): User {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => Hash::make($input['password']),
                'country' => $input['country'] ?? null,
                'city' => $input['city'] ?? null,
                'preferred_language' => $input['preferred_language'] ?? 'en',
                'status' => 'active',
                'phone' => $phone,
                'phone_verified_at' => Carbon::parse($verifiedOtp->verified_at),
            ]);

            $verifiedOtp->forceFill([
                'user_id' => $user->id,
            ])->save();

            Role::firstOrCreate([
                'name' => $input['role'],
                'guard_name' => 'web',
            ]);

            $user->assignRole($input['role']);

            if ($input['role'] === 'client') {
                ClientProfile::create([
                    'user_id' => $user->id,
                    'client_type' => $input['client_type'] ?? null,
                    'contact_name' => $input['contact_name'] ?? null,
                    'company_name' => $input['company_name'] ?? null,
                    'industry' => $input['industry'] ?? null,
                    'phone' => $phone,
                    'website' => $input['website'] ?? null,
                    'company_size' => $input['company_size'] ?? null,
                    'bio' => $input['bio'] ?? null,
                    'vat_number' => $input['vat_number'] ?? null,
                    'registration_number' => $input['registration_number'] ?? null,
                    'department' => $input['department'] ?? null,
                    'study_office_speciality' => $input['study_office_speciality'] ?? null,
                    'billing_address' => $input['billing_address'] ?? null,
                    'billing_city' => $input['city'] ?? null,
                    'billing_country' => $input['country'] ?? null,
                ]);
            }

            if ($input['role'] === 'freelancer') {
                FreelancerProfile::create([
                    'user_id' => $user->id,
                    'title' => $input['title'] ?? 'Freelancer',
                    'skills' => $input['skills'] ?? [],
                    'hourly_rate' => $input['hourly_rate'] ?? null,
                    'speciality' => $input['speciality'] ?? null,
                    'experience_years' => $input['experience_years'] ?? 0,
                    'portfolio_url' => $input['portfolio_url'] ?? null,
                    'availability' => $input['availability'] ?? true,
                    'bio' => $input['bio'] ?? null,
                    'headline' => $input['headline'] ?? null,
                    'languages' => $input['languages'] ?? [],
                    'certifications' => $input['certifications'] ?? [],
                    'education' => $input['education'] ?? [],
                    'minimum_project_budget' => $input['minimum_project_budget'] ?? null,
                    'currency' => $input['currency'] ?? 'USD',
                    'work_type' => $input['work_type'] ?? 'freelance',
                    'hours_per_week' => $input['hours_per_week'] ?? null,
                ]);
            }

            return $user;
        });
    }
}
