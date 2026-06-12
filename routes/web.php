<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\ClientRequestController;
use App\Http\Controllers\ProfileController;
use App\Models\ClientRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$fallbackCountries = [
    ['name' => 'Morocco', 'code' => 'MA', 'cities' => ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier']],
    ['name' => 'France', 'code' => 'FR', 'cities' => ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux']],
    ['name' => 'United States', 'code' => 'US', 'cities' => ['New York', 'San Francisco', 'Austin', 'Chicago', 'Seattle']],
    ['name' => 'Canada', 'code' => 'CA', 'cities' => ['Montreal', 'Toronto', 'Vancouver', 'Ottawa', 'Calgary']],
    ['name' => 'Spain', 'code' => 'ES', 'cities' => ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao']],
];

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/location/countries', function () use ($fallbackCountries) {
    try {
        $response = Http::timeout(8)->get('https://restcountries.com/v3.1/all', [
            'fields' => 'name,cca2,flag',
        ]);

        if ($response->successful()) {
            $countries = collect($response->json())
                ->map(fn (array $country) => [
                    'name' => data_get($country, 'name.common'),
                    'code' => $country['cca2'] ?? null,
                    'flag' => $country['flag'] ?? null,
                ])
                ->filter(fn (array $country) => $country['name'] && $country['code'])
                ->sortBy('name')
                ->values()
                ->all();

            if ($countries !== []) {
                return response()->json(['countries' => $countries]);
            }
        }
    } catch (\Throwable) {
        //
    }

    return response()->json(['countries' => $fallbackCountries]);
})->name('location.countries');

Route::get('/location/cities', function (Request $request) use ($fallbackCountries) {
    $country = $request->string('country')->toString();
    $fallbackCountry = collect($fallbackCountries)->firstWhere('name', $country);
    $fallback = $fallbackCountry['cities'] ?? [];

    if ($country === '') {
        return response()->json(['cities' => $fallback]);
    }

    try {
        $response = Http::timeout(8)->post('https://countriesnow.space/api/v0.1/countries/cities', [
            'country' => $country,
        ]);

        if ($response->successful()) {
            $cities = $response->json('data');

            if (is_array($cities) && $cities !== []) {
                sort($cities);

                return response()->json(['cities' => $cities]);
            }
        }
    } catch (\Throwable) {
        //
    }

    return response()->json(['cities' => $fallback]);
})->name('location.cities');

Route::get('/dashboard', function (Request $request) {
    $user = $request->user()->load(['roles', 'clientProfile', 'freelancerProfile', 'qaProfile']);
    $primaryRole = $user->getRoleNames()->first();

    return Inertia::render('Dashboard', [
        'profile' => match ($primaryRole) {
            'client' => $user->clientProfile,
            'freelancer' => $user->freelancerProfile,
            'qa' => $user->qaProfile,
            default => null,
        },
        'adminStats' => $user->hasRole('admin') ? [
            'users' => User::count(),
            'clients' => User::role('client')->count(),
            'freelancers' => User::role('freelancer')->count(),
            'projects' => Project::count(),
            'clientRequests' => ClientRequest::count(),
        ] : null,
        'roles' => $user->getRoleNames(),
        'primaryRole' => $primaryRole,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/client-requests/{clientRequest}/accept', [ClientRequestController::class, 'accept'])
        ->name('client-requests.accept');
    Route::resource('client-requests', ClientRequestController::class);

    // routes/web.php  — inside your auth middleware group

    Route::prefix('ai')->name('ai.')->group(function () {
        Route::get('/', [AIController::class, 'index'])->name('index');
        Route::post('/sessions', [AIController::class, 'storeSession'])->name('new');
        Route::get('/{session}', [AIController::class, 'show'])->name('show');
        Route::post('/{session}/send', [AIController::class, 'sendMessage'])->name('send');
        Route::delete('/sessions/{session}', [AIController::class, 'destroySession'])->name('destroy');
    });
});

require __DIR__.'/auth.php';
