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
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

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
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
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
                'company_logo' => $request->company_logo,
                'bio' => $request->bio,
                'vat_number' => $request->vat_number,
                'billing_address' => $request->billing_address,
                'billing_city' => $request->billing_city,
                'billing_country' => $request->billing_country,
                'billing_zip' => $request->billing_zip,
                'preferred_communication' => $request->preferred_communication ?? 'email',
                'receive_newsletter' => $request->receive_newsletter ?? true,
            ]);
        }

        // ---------------- FREELANCER ----------------
        if ($request->role === 'freelancer') {
            FreelancerProfile::create([
                'user_id' => $user->id,
                'title' => $request->title,
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
                'preferred_project_types' => $request->preferred_project_types ?? [],
            ]);
        }

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
