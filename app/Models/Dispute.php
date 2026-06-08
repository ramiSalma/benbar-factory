<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dispute extends Model
{
    use HasFactory;

    protected $fillable = [
        'mission_id',
        'raised_by',
        'against_user_id',
        'assigned_admin_id',
        'subject',
        'description',
        'status',
        'type',
        'resolution',
        'resolution_notes',
        'refund_amount',
        'evidence_urls',
        'resolved_at',
        'resolved_by',
    ];

    protected $casts = [
        'evidence_urls' => 'array',
        'resolved_at'   => 'datetime',
        'refund_amount' => 'decimal:2',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    public function raisedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'raised_by');
    }

    public function againstUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'against_user_id');
    }

    public function assignedAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_admin_id');
    }

    public function resolvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeOpen($query)
    {
        return $query->whereIn('status', ['open', 'under_review']);
    }

    public function scopeUnassigned($query)
    {
        return $query->whereNull('assigned_admin_id');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function resolve(User $admin, string $resolution, string $notes, float $refund = null): void
    {
        $this->update([
            'status'           => 'resolved',
            'resolution'       => $resolution,
            'resolution_notes' => $notes,
            'refund_amount'    => $refund,
            'resolved_at'      => now(),
            'resolved_by'      => $admin->id,
        ]);
    }

    public function isResolved(): bool
    {
        return $this->status === 'resolved';
    }
}
