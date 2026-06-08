<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'client_user_id',
        'freelancer_user_id',
        'reference',
        'total',
        'status',
        'currency',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'platform_fee',
        'platform_fee_rate',
        'line_items',
        'notes',
        'due_date',
        'sent_at',
        'paid_at',
        'pdf_url',
        'stripe_invoice_id',
    ];

    protected $casts = [
        'line_items'        => 'array',
        'due_date'          => 'date',
        'sent_at'           => 'datetime',
        'paid_at'           => 'datetime',
        'total'             => 'decimal:2',
        'subtotal'          => 'decimal:2',
        'tax_rate'          => 'decimal:2',
        'tax_amount'        => 'decimal:2',
        'platform_fee'      => 'decimal:2',
        'platform_fee_rate' => 'decimal:2',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_user_id');
    }

    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'freelancer_user_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeOverdue($query)
    {
        return $query->where('status', 'sent')
                     ->whereDate('due_date', '<', now());
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'sent'
            && $this->due_date
            && $this->due_date->isPast();
    }

    public function markAsSent(): void
    {
        $this->update(['status' => 'sent', 'sent_at' => now()]);
    }

    public function markAsPaid(): void
    {
        $this->update(['status' => 'paid', 'paid_at' => now()]);
    }
}
