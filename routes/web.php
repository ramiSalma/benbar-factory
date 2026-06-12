<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\ClientRequestController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SecuritySettingsController;
use App\Models\ClientRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



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
    Route::redirect('/profile', '/user/profile')->name('profile.edit');
    Route::get('/user/security', SecuritySettingsController::class)->name('security.show');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/client-requests', [ClientRequestController::class, 'adminIndex'])
            ->name('client-requests.index');
        Route::get('/client-requests/{clientRequest}', [ClientRequestController::class, 'adminShow'])
            ->name('client-requests.show');
        Route::post('/client-requests/{clientRequest}/accept', [ClientRequestController::class, 'accept'])
            ->name('client-requests.accept');
    });

    Route::prefix('client')->name('client.')->group(function () {
        Route::get('/requests', [ClientRequestController::class, 'index'])->name('requests.index');
        Route::get('/requests/create', [ClientRequestController::class, 'create'])->name('requests.create');
        Route::post('/requests', [ClientRequestController::class, 'store'])->name('requests.store');
        Route::get('/requests/{clientRequest}', [ClientRequestController::class, 'show'])->name('requests.show');
        Route::get('/requests/{clientRequest}/edit', [ClientRequestController::class, 'edit'])->name('requests.edit');
        Route::put('/requests/{clientRequest}', [ClientRequestController::class, 'update'])->name('requests.update');
        Route::patch('/requests/{clientRequest}', [ClientRequestController::class, 'update'])->name('requests.patch');
        Route::delete('/requests/{clientRequest}', [ClientRequestController::class, 'destroy'])->name('requests.destroy');

        Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
        Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');

        Route::prefix('ai')->name('ai.')->group(function () {
            Route::get('/', [AIController::class, 'index'])->name('index');
            Route::post('/sessions', [AIController::class, 'storeSession'])->name('new');
            Route::get('/{session}', [AIController::class, 'show'])->name('show');
            Route::post('/{session}/send', [AIController::class, 'sendMessage'])->name('send');
            Route::delete('/sessions/{session}', [AIController::class, 'destroySession'])->name('destroy');
        });
    });

    Route::post('/client-requests/{clientRequest}/accept', [ClientRequestController::class, 'accept'])
        ->name('client-requests.accept');
    Route::resource('client-requests', ClientRequestController::class);
    Route::resource('projects', ProjectController::class)->only(['index', 'show']);

    // routes/web.php  — inside your auth middleware group

    Route::prefix('ai')->name('ai.')->group(function () {
        Route::get('/', [AIController::class, 'index'])->name('index');
        Route::post('/sessions', [AIController::class, 'storeSession'])->name('new');
        Route::get('/{session}', [AIController::class, 'show'])->name('show');
        Route::post('/{session}/send', [AIController::class, 'sendMessage'])->name('send');
        Route::delete('/sessions/{session}', [AIController::class, 'destroySession'])->name('destroy');
    });
});
