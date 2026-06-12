<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Models\PhoneOtp;
use App\Services\SmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class PhoneOtpController extends Controller
{
    public function __construct(private readonly SmsService $smsService)
    {
    }

    public function send(SendOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $phone = PhoneOtp::normalizePhone($validated['phone']);

        $recentOtp = PhoneOtp::query()
            ->where('phone', $phone)
            ->whereNull('verified_at')
            ->where('created_at', '>', now()->subSeconds(PhoneOtp::RESEND_COOLDOWN_SECONDS))
            ->latest()
            ->first();

        if ($recentOtp) {
            $retryAfter = max(
                1,
                PhoneOtp::RESEND_COOLDOWN_SECONDS - $recentOtp->created_at->diffInSeconds(now())
            );

            throw ValidationException::withMessages([
                'phone' => "Please wait {$retryAfter} seconds before requesting another code.",
            ])->status(429);
        }

        PhoneOtp::query()
            ->where('phone', $phone)
            ->whereNull('verified_at')
            ->where('expires_at', '>', now())
            ->update(['expires_at' => now()]);

        $code = (string) random_int(100000, 999999);

        PhoneOtp::create([
            'user_id' => $request->user()?->id,
            'phone' => $phone,
            'otp_code' => PhoneOtp::hashCode($code),
            'expires_at' => now()->addMinutes(PhoneOtp::EXPIRES_IN_MINUTES),
            'attempts' => 0,
        ]);

        $this->smsService->sendOtp($phone, $code);

        return response()->json([
            'message' => 'Verification code sent.',
            'expires_in' => PhoneOtp::EXPIRES_IN_MINUTES * 60,
            'retry_after' => PhoneOtp::RESEND_COOLDOWN_SECONDS,
        ]);
    }

    public function verify(VerifyOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $phone = PhoneOtp::normalizePhone($validated['phone']);
        $code = $validated['code'];

        $otp = PhoneOtp::query()
            ->where('phone', $phone)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if (! $otp) {
            throw ValidationException::withMessages([
                'code' => 'Request a verification code before continuing.',
            ]);
        }

        if ($otp->isExpired()) {
            throw ValidationException::withMessages([
                'code' => 'The verification code has expired.',
            ]);
        }

        if (! $otp->hasAttemptsRemaining()) {
            throw ValidationException::withMessages([
                'code' => 'Too many invalid attempts. Request a new code.',
            ])->status(429);
        }

        $otp->increment('attempts');

        if (! $otp->matches($code)) {
            throw ValidationException::withMessages([
                'code' => 'The verification code is invalid.',
            ]);
        }

        $otp->forceFill([
            'verified_at' => Carbon::now(),
        ])->save();

        return response()->json([
            'message' => 'Phone number verified.',
            'phone' => $phone,
            'verified_at' => $otp->verified_at?->toIso8601String(),
        ]);
    }
}
