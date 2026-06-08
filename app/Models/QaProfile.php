<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QaProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'speciality',
        'experience_years',
        'bio',
        'tools',
        'methodologies',
        'hourly_rate',
        'availability',
        'average_rating',
        'total_reviews',
        'completed_reviews',
        'profile_verified',
    ];

    protected $casts = [
        'tools'           => 'array',
        'methodologies'   => 'array',
        'availability'    => 'boolean',
        'profile_verified' => 'boolean',
        'hourly_rate'     => 'decimal:2',
        'average_rating'  => 'decimal:2',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function qaReports(): HasMany
    {
        return $this->hasMany(QaReport::class, 'qa_reviewer_id', 'user_id');
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeAvailable($query)
    {
        return $query->where('availability', true)->where('profile_verified', true);
    }
}
