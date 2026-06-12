<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable;
    use HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'avatar',
        'profile_photo_path',
        'country',
        'city',
        'phone',
        'phone_verified_at',
        'timezone',
        'preferred_language',
        'email_verified_at',
        'is_super_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_super_admin' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }




    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function clientProfile(): HasOne
    {
        return $this->hasOne(ClientProfile::class);
    }

    public function freelancerProfile(): HasOne
    {
        return $this->hasOne(FreelancerProfile::class);
    }

    public function qaProfile(): HasOne
    {
        return $this->hasOne(QaProfile::class);
    }

    public function githubAccount(): HasOne
    {
        return $this->hasOne(GithubAccount::class);
    }

    public function clientRequests(): HasMany
    {
        return $this->hasMany(ClientRequest::class, 'client_user_id');
    }

    public function clientProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'client_user_id');
    }

    public function assignedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'assigned_freelancer_id');
    }

    public function qaProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'qa_reviewer_id');
    }

    public function assignedMissions(): HasMany
    {
        return $this->hasMany(Mission::class, 'assigned_freelancer_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'freelancer_user_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    public function aiSessions(): HasMany
    {
        return $this->hasMany(AiSession::class);
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(Conversation::class, 'conversation_participants')
            ->withPivot('last_read_at')
            ->withTimestamps();
    }

    public function reviewsGiven(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function reviewsReceived(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewee_id');
    }

    public function disputesRaised(): HasMany
    {
        return $this->hasMany(Dispute::class, 'raised_by');
    }

    public function paymentsReceived(): HasMany
    {
        return $this->hasMany(Payment::class, 'payee_user_id');
    }

    public function paymentsMade(): HasMany
    {
        return $this->hasMany(Payment::class, 'payer_user_id');
    }

    // -------------------------------------------------------------------------
    // Helper methods
    // -------------------------------------------------------------------------

    public function hasPermission(string $permission): bool
    {
        return $this->hasPermissionTo($permission);
    }

    public function isAdmin(): bool
    {
        return $this->is_super_admin || $this->hasRole('admin');
    }

    public function isClient(): bool
    {
        return $this->hasRole('client');
    }

    public function isFreelancer(): bool
    {
        return $this->hasRole('freelancer');
    }

    public function isQa(): bool
    {
        return $this->hasRole('qa');
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
