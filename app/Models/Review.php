<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'mission_id',
        'reviewer_id',
        'reviewee_id',
        'role',
        'rating',
        'comment',
        'quality_rating',
        'communication_rating',
        'deadline_rating',
        'professionalism_rating',
        'is_public',
        'is_featured',
    ];

    protected $casts = [
        'rating'                  => 'decimal:2',
        'quality_rating'          => 'decimal:2',
        'communication_rating'    => 'decimal:2',
        'deadline_rating'         => 'decimal:2',
        'professionalism_rating'  => 'decimal:2',
        'is_public'               => 'boolean',
        'is_featured'             => 'boolean',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewee_id');
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
