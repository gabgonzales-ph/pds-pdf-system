// resources/js/Modules/Auth/Components/ProgressBar.jsx

export default function ProgressBar({ currentStep }) {
    const steps = [
        { number: 1, label: 'Account' },
        { number: 2, label: 'Personal Info' },
        { number: 3, label: 'Family' },
        { number: 4, label: 'Summary' },
    ];

    return (
        <div className="flex items-center justify-center mb-6 px-2">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    {/* Step Circle */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`
                                w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center
                                text-xs sm:text-sm font-bold transition-all duration-300
                                ${currentStep === step.number
                                    ? 'bg-[#1a5c3a] text-white shadow-md scale-110'
                                    : currentStep > step.number
                                        ? 'bg-[#1a5c3a] text-white'
                                        : 'bg-gray-200 text-gray-400'}
                            `}
                        >
                            {currentStep > step.number ? (
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                step.number
                            )}
                        </div>
                        <span className={`mt-1 text-[10px] sm:text-xs font-medium whitespace-nowrap
                            ${currentStep === step.number ? 'text-[#1a5c3a]' : 'text-gray-400'}`}>
                            {step.label}
                        </span>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                        <div className={`
                            h-0.5 w-8 sm:w-12 md:w-16 mx-1 sm:mx-2 mb-4 transition-all duration-500
                            ${currentStep > step.number ? 'bg-[#1a5c3a]' : 'bg-gray-200'}
                        `} />
                    )}
                </div>
            ))}
        </div>
    );
}