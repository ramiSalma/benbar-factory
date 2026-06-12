<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Laravel\Fortify\Features;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'country' => $user->country,
                    'city' => $user->city,
                    'status' => $user->status,
                    'roles' => $user->getRoleNames(),
                    'email_verified_at' => $user->email_verified_at,
                    'two_factor_enabled' => Features::enabled(Features::twoFactorAuthentication()) &&
                        ! is_null($user->two_factor_secret),
                ] : null,
            ],
        ];
    }
}
