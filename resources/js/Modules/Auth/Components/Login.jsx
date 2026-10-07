// resources/js/Modules/Auth/Components/Login.jsx

import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

const STYLES = `
@keyframes lFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
}
@keyframes lLogoIn {
    0%   { opacity: 0; transform: scale(0.65) translateY(8px); filter: blur(4px); }
    65%  { transform: scale(1.07) translateY(-2px); filter: blur(0px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes lFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}
`;

function injectStyles() {
    if (document.getElementById('login-anim-css')) return;
    const el = document.createElement('style');
    el.id = 'login-anim-css';
    el.textContent = STYLES;
    document.head.appendChild(el);
}

const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

function fadeUp(delay, duration = 520) {
    return {
        style: {
            opacity: 0,
            animation: `lFadeUp ${duration}ms ${ease} ${delay}ms forwards`,
        },
    };
}

export default function Login({ onSwitchToRegister }) {
    const [showPassword, setShowPassword] = useState(false);
    const [ready, setReady] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        injectStyles();
        const t = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(t);
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        post(route('auth.login'));
    }

    if (!ready) return <div className="w-full" />;

    return (
        // px-1 sm:px-0 — small buffer on mobile so content doesn't hug parent's edge padding
        <div className="w-full px-1 sm:px-0">

            {/* ── Logo & Header ── */}
            <div className="flex flex-col items-center mb-6">
                <div style={{
                    opacity: 0,
                    animation: `lLogoIn 700ms ${ease} 0ms forwards`,
                    marginBottom: '12px',
                }}>
                    <img
                        src="/images/logo.png"
                        alt="Mayor's Office - City of San Pablo"
                        className="w-16 h-16 object-contain drop-shadow-sm"
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                </div>

                {/* text-xl md:text-2xl — responsive heading scale */}
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight"
                    {...fadeUp(90)}>
                    Welcome to MISO
                </h1>

                <p className="text-xs text-gray-400 mt-2 text-center px-2"
                    {...fadeUp(230)}>
                    To proceed, kindly log in to your profile here
                </p>
            </div>

            {/* ── Form ── */}
            {/* space-y-4 (was space-y-3) — more breathing room on mobile */}
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Username or Email */}
                <div {...fadeUp(310)}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Username or Email
                    </label>
                    {/* py-2.5 ensures ~44px touch target height */}
                    <input
                        type="text"
                        value={data.login}
                        onChange={e => setData('login', e.target.value)}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm
                            focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/40 focus:border-[#1a5c3a]
                            transition-colors
                            ${errors.login ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                        placeholder="Enter your username or email"
                        autoComplete="username"
                    />
                    {errors.login && (
                        <p className="mt-1 text-xs text-red-500">{errors.login}</p>
                    )}
                </div>

                {/* Password */}
                <div {...fadeUp(390)}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        {/* py-2.5 + pr-12 — touch target height + room for larger toggle area */}
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm pr-12
                                focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/40 focus:border-[#1a5c3a]
                                transition-colors
                                ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                        {/* min-w/h-[44px] — 44×44px minimum tap target (was 16×16px icon only) */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-1/2 -translate-y-1/2
                                min-w-[44px] min-h-[44px] flex items-center justify-center
                                text-gray-400 hover:text-gray-600 transition-colors"
                            tabIndex={-1}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    )}
                </div>

                {/* Login Button */}
                <div {...fadeUp(460)}>
                    {/* min-h-[44px] — guaranteed tap target on all devices */}
                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            background: 'linear-gradient(135deg, #022c22 0%, #065f46 50%, #1c8f71 100%)',
                        }}
                        className="w-full min-h-[44px] py-2.5 mt-1 text-white font-semibold text-sm
                            rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2 shadow-sm hover:brightness-110 active:scale-[0.98]"
                    >
                        {processing ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                                Logging in...
                            </>
                        ) : 'Login'}
                    </button>
                </div>
            </form>

            {/* Switch to Register */}
            <div className="text-center mt-5" style={{
                opacity: 0,
                animation: `lFadeIn 500ms ease-out 560ms forwards`,
            }}>
                <p className="text-xs text-gray-400">Not yet registered?</p>
                {/* min-h-[44px] px-2 — proper tap target on mobile */}
                <button
                    onClick={onSwitchToRegister}
                    className="text-xs font-semibold text-[#1a5c3a] hover:text-[#14472e] underline underline-offset-2
                        transition-colors mt-0.5 min-h-[44px] px-2 inline-flex items-center"
                >
                    Register Here
                </button>
            </div>

        </div>
    );
}
