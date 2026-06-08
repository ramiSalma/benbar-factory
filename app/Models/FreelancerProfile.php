<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FreelancerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'skills',
        'hourly_rate',
        'speciality',
        'experience_years',
        'portfolio_url',
        'availability',
        'bio',
        'headline',
        'languages',
        'certifications',
        'education',
        'minimum_project_budget',
        'currency',
        'work_type',
        'hours_per_week',
        'preferred_project_types',
        'iban',
        'bank_name',
    ];

    protected $casts = [
        'skills'                  => 'array',
        'languages'               => 'array',
        'certifications'          => 'array',
        'education'               => 'array',
        'preferred_project_types' => 'array',
        'availability'            => 'boolean',
        'stripe_onboarded'        => 'boolean',
        'identity_verified'       => 'boolean',
        'identity_verified_at'    => 'datetime',
        'hourly_rate'             => 'decimal:2',
        'minimum_project_budget'  => 'decimal:2',
        'average_rating'          => 'decimal:2',
        'total_earned'            => 'decimal:2',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifiedByAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function missions(): HasMany
    {
        return $this->hasMany(Mission::class, 'assigned_freelancer_id', 'user_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'freelancer_user_id', 'user_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewee_id', 'user_id');
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeAvailable($query)
    {
        return $query->where('availability', true)
            ->where('profile_status', 'approved');
    }

    public function scopeApproved($query)
    {
        return $query->where('profile_status', 'approved');
    }

    public function scopeBySkill($query, string $skill)
    {
        return $query->whereJsonContains('skills', $skill);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isApproved(): bool
    {
        return $this->profile_status === 'approved';
    }

    public function isAvailableForWork(): bool
    {
        return $this->availability && $this->isApproved();
    }

    public function getStarRatingAttribute(): float
    {
        return round($this->average_rating, 1);
    }
}
