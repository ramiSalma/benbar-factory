<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'mission_id',
        'freelancer_user_id',
        'score',
        'message',
        'status',
        'proposed_rate',
        'estimated_hours',
        'available_from',
        'attachments',
        'client_feedback',
        'reviewed_at',
    ];

    protected $casts = [
        'attachments'   => 'array',
        'available_from' => 'date',
        'reviewed_at'   => 'datetime',
        'score'         => 'float',
        'proposed_rate' => 'decimal:2',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'freelancer_user_id');
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function accept(string $feedback = null): void
    {
        $this->update([
            'status'          => 'accepted',
            'client_feedback' => $feedback,
            'reviewed_at'     => now(),
        ]);
    }

    public function reject(string $feedback = null): void
    {
        $this->update([
            'status'          => 'rejected',
            'client_feedback' => $feedback,
            'reviewed_at'     => now(),
        ]);
    }
}
