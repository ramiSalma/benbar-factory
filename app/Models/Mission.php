<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mission extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'lot_id',
        'project_id',
        'title',
        'description',
        'budget',
        'deadline',
        'status',
        'assigned_freelancer_id',
        'qa_reviewer_id',
        'order',
        'estimated_hours',
        'actual_hours',
        'required_skills',
        'priority',
        'assigned_at',
        'submitted_at',
        'approved_at',
        'completed_at',
        'completion_notes',
        'rejection_reason',
    ];

    protected $casts = [
        'required_skills' => 'array',
        'deadline'        => 'date',
        'assigned_at'     => 'datetime',
        'submitted_at'    => 'datetime',
        'approved_at'     => 'datetime',
        'completed_at'    => 'datetime',
        'budget'          => 'decimal:2',
        'order'           => 'integer',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function lot(): BelongsTo
    {
        return $this->belongsTo(Lot::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignedFreelancer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_freelancer_id');
    }

    public function qaReviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'qa_reviewer_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function deliverables(): HasMany
    {
        return $this->hasMany(Deliverable::class);
    }

    public function latestDeliverable(): HasOne
    {
        return $this->hasOne(Deliverable::class)->latestOfMany();
    }

    public function qaReports(): HasMany
    {
        return $this->hasMany(QaReport::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function disputes(): HasMany
    {
        return $this->hasMany(Dispute::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeForFreelancer($query, int $userId)
    {
        return $query->where('assigned_freelancer_id', $userId);
    }

    public function scopeOverdue($query)
    {
        return $query->whereNotIn('status', ['completed', 'cancelled'])
                     ->whereDate('deadline', '<', now());
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isAssigned(): bool
    {
        return !is_null($this->assigned_freelancer_id);
    }

    public function isOverdue(): bool
    {
        return $this->deadline
            && $this->deadline->isPast()
            && !in_array($this->status, ['completed', 'cancelled']);
    }
}
