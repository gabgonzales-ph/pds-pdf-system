import { useState, useEffect } from 'react';
import PolicyModal from './PolicyModal'; // Adjust import path if needed

export default function FinalRegistration({ onConfirm, onCancel, isSubmitting }) {
    const [visible, setVisible] = useState(false);
    
    // State to manage the policy modal
    const [policyModal, setPolicyModal] = useState({ isOpen: false, tab: 'terms' });

    // Trigger entrance on mount
    useEffect(() => {
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);

    function handleCancel() {
        setVisible(false);
        setTimeout(onCancel, 250);
    }

    function openPolicy(e, tab) {
        e.preventDefault();
        setPolicyModal({ isOpen: true, tab });
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 backdrop-blur-sm transition-all duration-250
                        ${visible ? 'bg-black/30' : 'bg-black/0'}`}
                    onClick={handleCancel}
                />

                {/* Modal */}
                <div className={`relative bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4 text-center
                    transition-all duration-250 ease-out
                    ${visible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-4 scale-95'}`}>
                    {/* Icon */}
                    <div className="w-16 h-16 bg-[#f0f7f3] rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-[#1a5c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        We are almost finished..
                    </h2>

                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        Clicking <strong>"Register"</strong> signifies your acceptance of the{' '}
                        <button onClick={(e) => openPolicy(e, 'terms')} className="text-[#1a5c3a] underline underline-offset-2 hover:text-[#14472e] transition-colors">
                            Terms
                        </button>
                        {' '}and{' '}
                        <button onClick={(e) => openPolicy(e, 'privacy')} className="text-[#1a5c3a] underline underline-offset-2 hover:text-[#14472e] transition-colors">
                            Privacy Policy
                        </button>.
                        Please ensure that you have read and understood these policies before proceeding with your registration.
                    </p>

                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="w-full py-3 bg-[#1a5c3a] hover:bg-[#14472e] text-white font-semibold rounded-xl
                            transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                                Registering...
                            </>
                        ) : 'Register'}
                    </button>
                </div>
            </div>

            {/* Render the Policy Modal on top (z-[60] handles stacking above the main z-50 modal) */}
            <PolicyModal 
                isOpen={policyModal.isOpen} 
                initialTab={policyModal.tab}
                onClose={() => setPolicyModal({ ...policyModal, isOpen: false })} 
            />
        </>
    );
}