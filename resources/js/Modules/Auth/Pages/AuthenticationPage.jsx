// resources/js/Modules/Auth/Pages/AuthenticationPage.jsx

import { useState, useEffect } from 'react';
import Login from '../Components/Login';
import Registration from '../Components/Registration';
import FinalRegistration from '../Components/FinalRegistration';
import { router } from '@inertiajs/react';

const SCROLL_STYLE = `
@keyframes scrollText {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.animate-scroll {
    display: flex;
    width: max-content;
    animation: scrollText 20s linear infinite;
}
@media (min-width: 768px) {
    .animate-scroll {
        animation: none;
        width: auto;
        display: flex;
        flex-direction: column;
    }
}
`;

export default function AuthenticationPage({ departments = [], careerServices = [] }) {
    const [view, setView] = useState('login');
    const [transitioning, setTransitioning] = useState(false);
    const [finalContext, setFinalContext] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Lock body scroll when the FinalRegistration modal is open
    useEffect(() => {
        if (finalContext) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
    }, [finalContext]);

    function switchView(to) {
        if (transitioning || view === to) return;
        setTransitioning(true);
        setTimeout(() => {
            setView(to);
            setTransitioning(false);
        }, 250);
    }

    function handleShowFinal({ formData, setIsSubmitting: regSetSubmitting, setStep, setErrors, STEP_REQUIRED }) {
        setFinalContext({ formData, regSetSubmitting, setStep, setErrors, STEP_REQUIRED });
    }

    function handleFinalConfirm() {
        if (!finalContext) return;
        const { formData, regSetSubmitting, setStep, setErrors, STEP_REQUIRED } = finalContext;
        setIsSubmitting(true);
        regSetSubmitting(true);
        const payload = Object.fromEntries(
            Object.entries(formData).filter(([k]) => !k.startsWith('_') && !k.endsWith('_code'))
        );
        router.post(route('auth.register'), payload, {
            onError: (errs) => {
                setIsSubmitting(false);
                regSetSubmitting(false);
                setFinalContext(null);
                const errorKeys = Object.keys(errs);
                if (errorKeys.some(k => STEP_REQUIRED[1].includes(k))) setStep(1);
                else if (errorKeys.some(k => STEP_REQUIRED[2].includes(k))) setStep(2);
                else setStep(3);
                setErrors(errs);
            },
            onFinish: () => {
                setIsSubmitting(false);
                regSetSubmitting(false);
            },
        });
    }

    const isLogin = view === 'login';
    const rules = [
        { title: 'Be honest.',      desc: 'Ensure all information is true and accurate.' },
        { title: 'Ensure completeness.', desc: 'Fill out all required fields completely.' },
        { title: 'Double check.', desc: 'Review your entries before submission.' },
    ];

    const displayRules = isMobile ? [...rules, ...rules] : rules;

    return (
        <>
            <style>{SCROLL_STYLE}</style>
            <div className="h-screen overflow-hidden bg-white flex flex-col">
                <div className={`flex flex-1 min-h-0 ${isLogin ? '' : 'flex-col md:flex-row'}`}>

                    {/* ── Left Panel (Rules) ── */}
                    {!isLogin && (
                        <div className="
                            w-full md:w-56 lg:w-64 bg-[#1a5c3a] flex-shrink-0
                            flex flex-row md:flex-col
                            px-4 md:px-8 py-3 md:py-10
                            overflow-hidden relative
                        ">
                            <p className="text-white font-black text-base md:text-xl tracking-tight whitespace-nowrap z-20 bg-[#1a5c3a] pr-4">
                                MISO Portal
                            </p>
                            
                            <div className="flex-1 flex flex-col justify-center w-full overflow-hidden">
                                <ul className="animate-scroll gap-12 md:gap-10 items-center md:items-start ml-4 md:ml-0">
                                    {displayRules.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3 flex-shrink-0 max-w-[160px] md:max-w-none">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                                            <div>
                                                <p className="text-white font-bold text-xs whitespace-nowrap md:whitespace-normal">{item.title}</p>
                                                <p className="text-white/70 text-[10px] md:text-xs mt-1.5 leading-relaxed hidden md:block">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ── Right Panel ── */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                        <div className={`flex-1 flex flex-col justify-center px-6 py-4 
                            ${isLogin ? 'overflow-hidden items-center' : 'overflow-y-auto items-start md:items-center'}`}>

                            {isLogin ? (
                                <div className={`w-full max-w-sm transition-all duration-250 
                                    ${transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                                    
                                    {/* Footer text reverted back inside the card/form area */}
                                    <div className="bg-white md:border md:border-gray-200 md:rounded-2xl md:shadow-sm md:px-7 md:py-7">
                                        <Login onSwitchToRegister={() => switchView('register')} />
                                    </div>

                                    <p className="text-[10px] md:text-xs text-center text-gray-400 mt-5 px-4 leading-relaxed">
                                        This profiling system provides{' '}
                                        <span className="underline underline-offset-2">secure</span> and{' '}
                                        <span className="underline underline-offset-2">confidential</span>{' '}
                                        access to your personal records. Please log in using your authorized credentials to continue.
                                    </p>
                                </div>
                            ) : (
                                <div className={`w-full max-w-2xl transition-all duration-250
                                    ${transitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 md:px-8 py-6 md:py-8
                                        flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
                                        <Registration
                                            departments={departments}
                                            careerServices={careerServices}
                                            onSwitchToLogin={() => switchView('login')}
                                            onShowFinal={handleShowFinal}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {finalContext && (
                <FinalRegistration
                    onConfirm={handleFinalConfirm}
                    onCancel={() => setFinalContext(null)}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
}