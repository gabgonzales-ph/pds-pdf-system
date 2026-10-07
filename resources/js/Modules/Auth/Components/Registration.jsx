// resources/js/Modules/Auth/Components/Registration/Registration.jsx

import { useState, useRef, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import StepAccount from './Registration/StepAccount';
import StepPersonalInfo from './Registration/StepPersonalInfo';
import StepFamilyBackground from './Registration/StepFamilyBackground';
import StepSummary from './Registration/StepSummary';

const STEP_REQUIRED = {
    1: ['username', 'email', 'password', 'password_confirmation', 'employee_id', 'department_id', 'career_service_id'],
    2: [
        'last_name', 'first_name',
        'date_of_birth', 'birth_place', 'sex', 'civil_status',
        'blood_type', 'citizenship', 'mobile_no',
        'region', 'province', 'city_municipality', 'barangay',
        'perm_region', 'perm_province', 'perm_city', 'perm_barangay',
    ],
    3: [
        'father_surname', 'father_first_name',
        'mother_surname', 'mother_first_name',
    ],
    4: [],
};

const FIELD_LABELS = {
    username: 'Username', email: 'Email', password: 'Password',
    password_confirmation: 'Confirm Password', employee_id: 'Employee ID',
    department_id: 'Department', career_service_id: 'Career Service',
    last_name: 'Last Name', first_name: 'First Name', middle_name: 'Middle Name',
    date_of_birth: 'Date of Birth', birth_place: 'Birth Place', sex: 'Sex',
    civil_status: 'Civil Status', blood_type: 'Blood Type', citizenship: 'Citizenship',
    mobile_no: 'Mobile No.', region: 'Region', province: 'Province',
    house_block_lot_no: 'House/Block/Lot No.', street: 'Street',
    subdivision_village: 'Subdivision / Village',
    city_municipality: 'City / Municipality', barangay: 'Barangay',
    perm_house_block_lot_no: 'Perm. House/Block/Lot No.', perm_street: 'Perm. Street',
    perm_subdivision_village: 'Perm. Subdivision / Village',
    perm_region: 'Permanent Region', perm_province: 'Permanent Province',
    perm_city: 'Permanent City / Municipality', perm_barangay: 'Permanent Barangay',
    father_surname: "Father's Surname", father_first_name: "Father's First Name",
    father_middle_name: "Father's Middle Name", mother_surname: "Mother's Surname",
    mother_first_name: "Mother's First Name", mother_middle_name: "Mother's Middle Name",
};

function validateBirthdate(value, label = 'Date of Birth') {
    if (!value) return null;
    const dob = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dob >= today) return `${label} must be a past date.`;

    const min18 = new Date(today);
    min18.setFullYear(min18.getFullYear() - 18);
    if (dob > min18) return `Must be at least 18 years old.`;

    return null;
}

// Fields that are private/internal and must never be sent to the backend
const INTERNAL_FIELDS = new Set(['_departments', '_careerServices']);

export default function Registration({
    onSwitchToLogin,
    onShowFinal,
    departments = [],
    careerServices = [],
}) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Tracks which fields currently have a live async error so we never
    // rely on fragile string-sniffing to preserve them across validation runs.
    const asyncErrorFields = useRef(new Set());

    const scrollContainerRef = useRef(null);

    const [formData, setFormDataRaw] = useState({
        username: '', email: '', password: '', password_confirmation: '',
        employee_id: '', department_id: '', career_service_id: '',
        // Internal reference data — kept here for StepAccount's selects
        // but stripped before submission (see getSubmissionPayload).
        _departments: departments,
        _careerServices: careerServices,
        last_name: '', first_name: '', middle_name: '', suffix: '',
        date_of_birth: '', birth_place: '', sex: '', civil_status: '',
        blood_type: '', citizenship: '', citizenship_by: '', citizenship_country: '',
        height_cm: '', weight_kg: '', mobile_no: '', telephone_no: '',
        house_block_lot_no: '', street: '', subdivision_village: '',
        region_code: '', region: '', province_code: '', province: '',
        city_code: '', city_municipality: '', barangay_code: '', barangay: '',
        zip_code: '',
        perm_house_block_lot_no: '', perm_street: '', perm_subdivision_village: '',
        perm_region_code: '', perm_region: '', perm_province_code: '', perm_province: '',
        perm_city_code: '', perm_city: '', perm_barangay_code: '', perm_barangay: '',
        perm_zip_code: '',
        father_surname: '', father_first_name: '', father_middle_name: '', father_suffix: '',
        mother_surname: '', mother_first_name: '', mother_middle_name: '', mother_suffix: '',
        spouse_surname: '', spouse_first_name: '', spouse_middle_name: '', spouse_suffix: '',
        spouse_birthdate: '',
    });

    // Returns formData with all internal/reference fields stripped.
    // Always use this when passing data to onShowFinal.
    function getSubmissionPayload(data) {
        return Object.fromEntries(
            Object.entries(data).filter(([key]) => !INTERNAL_FIELDS.has(key))
        );
    }

    const setError = useCallback((field, message) => {
        asyncErrorFields.current.add(field);
        setErrors(prev => ({ ...prev, [field]: message }));
    }, []);

    const clearErrors = useCallback((field) => {
        asyncErrorFields.current.delete(field);
        setErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const scrollToFirstError = (newErrors) => {
        const firstErrorKey = Object.keys(newErrors)[0];
        if (!firstErrorKey || !scrollContainerRef.current) return;

        setTimeout(() => {
            const element = scrollContainerRef.current.querySelector(
                `[data-field="${firstErrorKey}"]`
            );
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Fallback: scroll container to top so the user at least sees
                // the error summary rather than staring at a blank area.
                scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 50);
    };

    function setData(keyOrUpdater, value) {
        if (typeof keyOrUpdater === 'function') {
            setFormDataRaw(keyOrUpdater);
        } else {
            setFormDataRaw(prev => ({ ...prev, [keyOrUpdater]: value }));
        }
    }

    function validateStep(stepNum) {
        const newErrors = {};

        // Preserve live async errors by checking the ref — no string-sniffing.
        asyncErrorFields.current.forEach(field => {
            if (errors[field]) {
                newErrors[field] = errors[field];
            }
        });

        STEP_REQUIRED[stepNum].forEach(field => {
            if (!formData[field] || String(formData[field]).trim() === '') {
                // Don't overwrite an already-set async error for the same field.
                if (!newErrors[field]) {
                    newErrors[field] = `${FIELD_LABELS[field] || field} is required.`;
                }
            }
        });

        if (stepNum === 1) {
            if (formData.password && formData.password.length < 8)
                newErrors.password = 'Password must be at least 8 characters.';
            if (formData.password !== formData.password_confirmation)
                newErrors.password_confirmation = 'Passwords do not match.';
            // Validate email format only if not already flagged by an async error
            if (!newErrors.email && formData.email && !/\S+@\S+\.\S+/.test(formData.email))
                newErrors.email = 'Please enter a valid email address.';
        }

        if (stepNum === 2) {
            if (!newErrors.date_of_birth) {
                const dobErr = validateBirthdate(formData.date_of_birth, 'Date of Birth');
                if (dobErr) newErrors.date_of_birth = dobErr;
            }

            if (formData.citizenship === 'Dual Citizen') {
                // Keep these as separate keys — they represent separate fields.
                if (!formData.citizenship_by)
                    newErrors.citizenship_by = 'Please select By birth or By naturalization.';
                if (!formData.citizenship_country)
                    newErrors.citizenship_country = 'Country of other citizenship is required.';
            }
        }

        if (stepNum === 3) {
            const needsSpouse = ['Married', 'Widowed', 'Separated'].includes(formData.civil_status);
            if (needsSpouse) {
                if (!String(formData.spouse_surname || '').trim())
                    newErrors.spouse_surname = 'Spouse surname is required.';
                if (!String(formData.spouse_first_name || '').trim())
                    newErrors.spouse_first_name = 'Spouse first name is required.';
                if (!String(formData.spouse_birthdate || '').trim())
                    newErrors.spouse_birthdate = 'Spouse date of birth is required.';
            }

            // Only validate spouse_birthdate format when spouse info is actually required
            // and the field has a value. Prevents blocking users with leftover data.
            if (needsSpouse && !newErrors.spouse_birthdate && formData.spouse_birthdate) {
                const spouseErr = validateBirthdate(formData.spouse_birthdate, 'Spouse date of birth');
                if (spouseErr) newErrors.spouse_birthdate = spouseErr;
            }
        }

        setErrors(newErrors);
        return newErrors;
    }

    function handleNext() {
        // Step 4 is summary-only — skip validation entirely and go straight to submission.
        if (step === 4) {
            onShowFinal({
                formData: getSubmissionPayload(formData),
                setIsSubmitting,
                setStep,
                setErrors,
                STEP_REQUIRED,
            });
            return;
        }

        const currentErrors = validateStep(step);

        if (Object.keys(currentErrors).length > 0) {
            scrollToFirstError(currentErrors);
            return;
        }

        // Clear non-async errors on successful advance; async errors are
        // managed exclusively through setError/clearErrors from sub-components.
        setErrors(prev => {
            const next = {};
            asyncErrorFields.current.forEach(field => {
                if (prev[field]) next[field] = prev[field];
            });
            return next;
        });

        const nextStep = step + 1;
        setStep(nextStep);

        // Always scroll to top on step advance — not just on first visit.
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function handleBack() {
        setErrors({});
        asyncErrorFields.current.clear();
        if (step > 1) {
            setStep(step - 1);
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            onSwitchToLogin();
        }
    }

    // Build only the active step's JSX to avoid rendering all four trees
    // on every parent re-render. StepPersonalInfo in particular holds
    // expensive PSGC cascade state that must not be unmounted, so we keep
    // all steps mounted but hidden — only the active one is visible.
    // NOTE: display:none keeps DOM nodes alive (preserving StepPersonalInfo's
    // local cascade state) while avoiding unnecessary re-renders of siblings.
    const renderStep = (stepNum) => {
        const isActive = step === stepNum;
        const style = isActive ? undefined : { display: 'none' };

        switch (stepNum) {
            case 1:
                return (
                    <div key={1} style={style}>
                        <StepAccount
                            data={formData} setData={setData}
                            errors={errors} setError={setError} clearErrors={clearErrors}
                        />
                    </div>
                );
            case 2:
                return (
                    <div key={2} style={style}>
                        <StepPersonalInfo data={formData} setData={setData} errors={errors} />
                    </div>
                );
            case 3:
                return (
                    <div key={3} style={style}>
                        <StepFamilyBackground data={formData} setData={setData} errors={errors} />
                    </div>
                );
            case 4:
                // StepSummary only renders when active — it has no persistent
                // local state that needs to survive unmounting.
                return isActive ? (
                    <div key={4}>
                        <StepSummary
                            data={formData}
                            departments={departments}
                            careerServices={careerServices}
                        />
                    </div>
                ) : null;
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col min-h-0">
            <div className="flex-shrink-0 mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    {step === 4 ? 'Review & Finalize' : 'Employee Registration'}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                    {step === 4
                        ? 'Ensure all information is correct before submitting.'
                        : 'All details provided in this form will be reflected in your Personal Data Sheet.'}
                </p>
            </div>

            <div className="flex-shrink-0">
                <ProgressBar currentStep={step} />
            </div>

            <div
                ref={scrollContainerRef}
                className="flex-1 min-h-0 overflow-y-auto pr-1 pb-4"
            >
                {[1, 2, 3, 4].map(renderStep)}
            </div>

            <div className="flex-shrink-0 flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 min-h-[44px] text-sm font-medium text-gray-600 bg-white border border-gray-300
                        hover:bg-gray-50 rounded-xl transition-all"
                >
                    Back
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-[#1a5c3a] hover:bg-[#14472e]
                        rounded-xl transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed
                        flex items-center gap-2"
                >
                    {step === 4 ? 'Register' : step === 3 ? 'Review' : 'Save & Continue'}
                </button>
            </div>
        </div>
    );
}