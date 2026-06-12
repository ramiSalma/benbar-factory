<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class SmsService
{
    public function sendOtp(string $phone, string $code): void
    {
        $message = "Your Benbar Factory verification code is {$code}. It expires in 5 minutes.";

        match (config('services.sms.provider', 'custom')) {
            'twilio' => $this->sendViaTwilio($phone, $message),
            'vonage' => $this->sendViaVonage($phone, $message),
            'custom' => $this->sendViaCustomProvider($phone, $message),
            default => throw new RuntimeException('Unsupported SMS provider.'),
        };
    }

    private function sendViaTwilio(string $phone, string $message): void
    {
        $sid = config('services.sms.twilio.sid');
        $token = config('services.sms.twilio.token');
        $from = config('services.sms.twilio.from');

        if (! $sid || ! $token || ! $from) {
            $this->logMissingProvider('twilio');
            return;
        }

        Http::asForm()
            ->withBasicAuth($sid, $token)
            ->throw()
            ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                'From' => $from,
                'To' => $phone,
                'Body' => $message,
            ]);
    }

    private function sendViaVonage(string $phone, string $message): void
    {
        $key = config('services.sms.vonage.key');
        $secret = config('services.sms.vonage.secret');
        $from = config('services.sms.vonage.from', config('app.name', 'Benbar'));

        if (! $key || ! $secret) {
            $this->logMissingProvider('vonage');
            return;
        }

        Http::asForm()
            ->throw()
            ->post('https://rest.nexmo.com/sms/json', [
                'api_key' => $key,
                'api_secret' => $secret,
                'from' => $from,
                'to' => ltrim($phone, '+'),
                'text' => $message,
            ]);
    }

    private function sendViaCustomProvider(string $phone, string $message): void
    {
        $endpoint = config('services.sms.custom.endpoint');
        $token = config('services.sms.custom.token');

        if (! $endpoint) {
            $this->logMissingProvider('custom');
            return;
        }

        $request = Http::acceptJson();

        if ($token) {
            $request = $request->withToken($token);
        }

        $request->throw()->post($endpoint, [
            'phone' => $phone,
            'message' => $message,
        ]);
    }

    private function logMissingProvider(string $provider): void
    {
        Log::warning('SMS provider is not configured; OTP was not delivered.', [
            'provider' => $provider,
        ]);
    }
}
