<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PullRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'repository_id',
        'mission_id',
        'author_user_id',
        'reviewer_user_id',
        'pr_number',
        'title',
        'status',
        'description',
        'base_branch',
        'head_branch',
        'url',
        'review_notes',
        'merged_at',
        'closed_at',
        'additions',
        'deletions',
    ];

    protected $casts = [
        'merged_at'  => 'datetime',
        'closed_at'  => 'datetime',
        'additions'  => 'integer',
        'deletions'  => 'integer',
        'pr_number'  => 'integer',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function repository(): BelongsTo
    {
        return $this->belongsTo(Repository::class);
    }

    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_user_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_user_id');
    }

    public function deliverables(): HasMany
    {
        return $this->hasMany(Deliverable::class);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isMerged(): bool
    {
        return $this->status === 'merged';
    }

    public function isOpen(): bool
    {
        return $this->status === 'open';
    }
}
