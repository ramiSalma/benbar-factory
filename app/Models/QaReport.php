<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QaReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'mission_id',
        'deliverable_id',
        'qa_reviewer_id',
        'result',
        'comments',
        'score',
        'summary',
        'test_cases',
        'bugs_found',
        'severity',
        'hours_spent',
        'report_file_url',
    ];

    protected $casts = [
        'test_cases' => 'array',
        'bugs_found' => 'array',
        'score'      => 'integer',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    public function deliverable(): BelongsTo
    {
        return $this->belongsTo(Deliverable::class);
    }

    public function qaReviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'qa_reviewer_id');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isPassed(): bool
    {
        return $this->result === 'pass';
    }

    public function isFailed(): bool
    {
        return $this->result === 'fail';
    }

    public function getBugsCountAttribute(): int
    {
        return is_array($this->bugs_found) ? count($this->bugs_found) : 0;
    }
}
