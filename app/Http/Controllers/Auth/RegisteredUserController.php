<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ClientProfile;
use App\Models\FreelancerProfile;
use App\Models\PhoneOtp;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:client,freelancer'],
            'country' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^\+?[0-9\s().-]{8,30}$/'],
            'client_type' => [
                Rule::requiredIf($request->role === 'client'),
                Rule::in(['particulier', 'entreprise', 'association', 'administration', 'bureau_etudes']),
            ],
            'contact_name' => [Rule::requiredIf($request->role === 'client'), 'nullable', 'string', 'max:255'],
            'company_name' => [
                Rule::requiredIf($request->role === 'client' && $request->client_type !== 'particulier'),
                'nullable',
                'string',
                'max:255',
            ],
            'industry' => [
                Rule::requiredIf($request->role === 'client' && in_array($request->client_type, ['entreprise', 'association'], true)),
                'nullable',
                'string',
                'max:255',
            ],
            'website' => ['nullable', 'url', 'max:255'],
            'company_size' => [
                Rule::requiredIf($request->role === 'client' && in_array($request->client_type, ['entreprise', 'bureau_etudes'], true)),
                'nullable',
                'string',
                'max:255',
            ],
            'vat_number' => [
                Rule::requiredIf($request->role === 'client' && $request->client_type === 'entreprise'),
                'nullable',
                'string',
                'max:255',
            ],
            'registration_number' => [
                Rule::requiredIf($request->role === 'client' && in_array($request->client_type, ['association', 'bureau_etudes'], true)),
                'nullable',
                'string',
                'max:255',
            ],
            'department' => [
                Rule::requiredIf($request->role === 'client' && $request->client_type === 'administration'),
                'nullable',
                'string',
                'max:255',
            ],
            'study_office_speciality' => [
                Rule::requiredIf($request->role === 'client' && $request->client_type === 'bureau_etudes'),
                'nullable',
                'string',
                'max:255',
            ],
            'billing_address' => [
                Rule::requiredIf($request->role === 'client'),
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

        $phone = PhoneOtp::normalizePhone($request->phone);
        $verifiedOtp = PhoneOtp::query()
            ->where('phone', $phone)
            ->whereNotNull('verified_at')
            ->whereNull('user_id')
            ->where('verified_at', '>=', now()->subMinutes(PhoneOtp::EXPIRES_IN_MINUTES))
            ->latest('verified_at')
            ->first();

        if (! $verifiedOtp) {
            throw ValidationException::withMessages([
                'phone' => 'Verify your phone number before creating your account.',
            ]);
        }

        $user = DB::transaction(function () use ($request, $phone, $verifiedOtp): User {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'country' => $request->country,
                'city' => $request->city,
                'preferred_language' => $request->preferred_language ?? 'en',
                'status' => 'active',
                'phone' => $phone,
                'phone_verified_at' => Carbon::parse($verifiedOtp->verified_at),
            ]);

            $verifiedOtp->forceFill([
                'user_id' => $user->id,
            ])->save();

            Role::firstOrCreate([
                'name' => $request->role,
                'guard_name' => 'web',
            ]);

            $user->assignRole($request->role);

            // ---------------- CLIENT ----------------
            if ($request->role === 'client') {
                ClientProfile::create([
                    'user_id' => $user->id,
                    'client_type' => $request->client_type,
                    'contact_name' => $request->contact_name,
                    'company_name' => $request->company_name,
                    'industry' => $request->industry,
                    'phone' => $phone,
                    'website' => $request->website,
                    'company_size' => $request->company_size,
                    'bio' => $request->bio,
                    'vat_number' => $request->vat_number,
                    'registration_number' => $request->registration_number,
                    'department' => $request->department,
                    'study_office_speciality' => $request->study_office_speciality,
                    'billing_address' => $request->billing_address,
                    'billing_city' => $request->city,
                    'billing_country' => $request->country,
                ]);
            }

            // ---------------- FREELANCER ----------------
            if ($request->role === 'freelancer') {
                FreelancerProfile::create([
                    'user_id' => $user->id,
                    'title' => $request->title ?: 'Freelancer',
                    'skills' => $request->skills ?? [],
                    'hourly_rate' => $request->hourly_rate,
                    'speciality' => $request->speciality,
                    'experience_years' => $request->experience_years ?? 0,
                    'portfolio_url' => $request->portfolio_url,
                    'availability' => $request->availability ?? true,
                    'bio' => $request->bio,
                    'headline' => $request->headline,
                    'languages' => $request->languages ?? [],
                    'certifications' => $request->certifications ?? [],
                    'education' => $request->education ?? [],
                    'minimum_project_budget' => $request->minimum_project_budget,
                    'currency' => $request->currency ?? 'USD',
                    'work_type' => $request->work_type ?? 'freelance',
                    'hours_per_week' => $request->hours_per_week,
                ]);
            }

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
