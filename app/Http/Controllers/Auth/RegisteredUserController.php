<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ClientProfile;
use App\Models\FreelancerProfile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
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
            'preferred_language' => ['nullable', 'string', 'max:10'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'company_size' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'title' => ['nullable', 'string', 'max:255'],
            'speciality' => ['nullable', 'string', 'max:255'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:80'],
            'portfolio_url' => ['nullable', 'url', 'max:255'],
            'headline' => ['nullable', 'string', 'max:255'],
        ]);

        $user = DB::transaction(function () use ($request): User {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'country' => $request->country,
                'city' => $request->city,
                'preferred_language' => $request->preferred_language ?? 'en',
                'status' => 'active',
            ]);

            Role::firstOrCreate([
                'name' => $request->role,
                'guard_name' => 'web',
            ]);

            $user->assignRole($request->role);

            // ---------------- CLIENT ----------------
            if ($request->role === 'client') {
                ClientProfile::create([
                    'user_id' => $user->id,
                    'company_name' => $request->company_name,
                    'industry' => $request->industry,
                    'phone' => $request->phone,
                    'website' => $request->website,
                    'company_size' => $request->company_size,
                    'bio' => $request->bio,
                    'vat_number' => $request->vat_number,
                    'billing_country' => $request->billing_country,
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
