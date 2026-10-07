<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureIsUser
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || !auth()->user()->isUser()) {
            abort(403);
        }
        return $next($request);
    }
}
