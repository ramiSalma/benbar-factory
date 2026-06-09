<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ClientRequestController;
use App\Http\Controllers\AIController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

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
        'roles' => $user->getRoleNames(),
        'primaryRole' => $primaryRole,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');



    Route::resource('client-requests', ClientRequestController::class);

    Route::get('/ai', [AIController::class, 'storeSession'])
        ->name('ai.new');

    Route::get('/ai/{session}', [AIController::class, 'show'])
        ->name('ai.show');

    Route::post('/ai/{session}/send', [AIController::class, 'sendMessage'])
        ->name('ai.send');
});

require __DIR__.'/auth.php';
