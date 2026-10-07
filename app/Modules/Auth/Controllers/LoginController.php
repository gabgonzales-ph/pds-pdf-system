<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Admin\Models\ActivityLog;
use App\Modules\Auth\Requests\LoginRequest;
use App\Services\ActivityLog\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class LoginController
{
    public function store(LoginRequest $request): RedirectResponse
    {
        // ── Rate limiting ────────────────────────────────────────────
        $throttleKey = Str::lower($request->input('login')) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, maxAttempts: 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return back()->withErrors([
                'login' => "Too many login attempts. Please try again in {$seconds} seconds.",
            ]);
        }

        // ── Attempt login ────────────────────────────────────────────
        $credentials = [
            $request->loginField() => $request->input('login'),
            'password'             => $request->input('password'),
        ];

        if (!Auth::attempt($credentials, remember: false)) {
            RateLimiter::hit($throttleKey, 60);

            return back()->withErrors([
                'login' => 'The provided credentials do not match our records.',
            ]);
        }

        // ── Login successful ─────────────────────────────────────────
        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        $user = Auth::user();

        // ── Log admin login ──────────────────────────────────────────
        if ($user->isAdmin()) {
            ActivityLogService::log(
                action: ActivityLog::ACTION_ADMIN_LOGIN,
                actorId: $user->id,
                actorType: 'admin',
                request: $request,
            );
        }

        // ── Role-based redirect ──────────────────────────────────────
        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            default => redirect()->route('user.dashboard'),
        };
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        // ── Log admin logout before session is invalidated ───────────
        if ($user?->isAdmin()) {
            ActivityLogService::log(
                action: ActivityLog::ACTION_ADMIN_LOGOUT,
                actorId: $user->id,
                actorType: 'admin',
                request: $request,
            );
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('auth.index');
    }
}
