<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;

class PhoneOtp extends Model
{
    use HasFactory;

    public const EXPIRES_IN_MINUTES = 5;
    public const RESEND_COOLDOWN_SECONDS = 60;
    public const MAX_ATTEMPTS = 5;

    protected $fillable = [
        'user_id',
        'phone',
        'otp_code',
        'expires_at',
        'verified_at',
        'attempts',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'verified_at' => 'datetime',
        'attempts' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function normalizePhone(string $phone): string
    {
        $phone = trim($phone);
        $hasLeadingPlus = str_starts_with($phone, '+');
        $digits = preg_replace('/\D+/', '', $phone);

        return ($hasLeadingPlus ? '+' : '').$digits;
    }

    public static function hashCode(string $code): string
    {
        return Hash::make($code);
    }

    public function matches(string $code): bool
    {
        return Hash::check($code, $this->otp_code);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isVerified(): bool
    {
        return $this->verified_at !== null;
    }

    public function hasAttemptsRemaining(): bool
    {
        return $this->attempts < self::MAX_ATTEMPTS;
    }
}
