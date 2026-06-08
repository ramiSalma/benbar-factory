<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_user_id',
        'title',
        'description',
        'status',
        'budget_min',
        'budget_max',
        'currency',
        'deadline',
        'required_skills',
        'project_type',
        'experience_level',
        'estimated_duration_weeks',
        'is_featured',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
        'views_count',
        'applications_count',
    ];

    protected $casts = [
        'required_skills' => 'array',
        'deadline'        => 'date',
        'reviewed_at'     => 'datetime',
        'is_featured'     => 'boolean',
        'budget_min'      => 'decimal:2',
        'budget_max'      => 'decimal:2',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_user_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function getBudgetRangeAttribute(): string
    {
        if ($this->budget_min && $this->budget_max) {
            return "{$this->currency} {$this->budget_min} – {$this->budget_max}";
        }
        return $this->budget_min
            ? "{$this->currency} {$this->budget_min}+"
            : 'Budget not specified';
    }

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }
}
