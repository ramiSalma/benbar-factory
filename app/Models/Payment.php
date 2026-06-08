<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'mission_id',
        'invoice_id',
        'payer_user_id',
        'payee_user_id',
        'amount',
        'status',
        'paid_at',
        'currency',
        'payment_method',
        'transaction_id',
        'stripe_payment_intent_id',
        'platform_fee',
        'freelancer_payout',
        'notes',
        'receipt_url',
        'payout_sent',
        'payout_sent_at',
        'stripe_transfer_id',
    ];

    protected $casts = [
        'paid_at'           => 'datetime',
        'payout_sent_at'    => 'datetime',
        'amount'            => 'decimal:2',
        'platform_fee'      => 'decimal:2',
        'freelancer_payout' => 'decimal:2',
        'payout_sent'       => 'boolean',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function payer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'payer_user_id');
    }

    public function payee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'payee_user_id');
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePendingPayout($query)
    {
        return $query->where('status', 'completed')
                     ->where('payout_sent', false);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function markComplete(string $transactionId = null): void
    {
        $this->update([
            'status'         => 'completed',
            'paid_at'        => now(),
            'transaction_id' => $transactionId ?? $this->transaction_id,
        ]);
    }
}
