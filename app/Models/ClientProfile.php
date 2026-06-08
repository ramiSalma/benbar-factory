<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClientProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'industry',
        'phone',
        'website',
        'company_size',
        'company_logo',
        'bio',
        'vat_number',
        'billing_address',
        'billing_city',
        'billing_country',
        'billing_zip',
        'preferred_communication',
        'receive_newsletter',
    ];

    protected $casts = [
        'receive_newsletter'  => 'boolean',
        'profile_verified'    => 'boolean',
        'total_spent'         => 'decimal:2',
        'total_projects'      => 'integer',
        'active_projects'     => 'integer',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'client_user_id', 'user_id');
    }

    public function clientRequests(): HasMany
    {
        return $this->hasMany(ClientRequest::class, 'client_user_id', 'user_id');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function getFullBillingAddressAttribute(): string
    {
        return implode(', ', array_filter([
            $this->billing_address,
            $this->billing_city,
            $this->billing_zip,
            $this->billing_country,
        ]));
    }
}
