// resources/js/Modules/Auth/Components/Registration/StepAccount.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

const EyeIcon = ({ visible, toggle }) => (
    <button
        type="button"
        onClick={toggle}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600
            transition-colors w-8 h-8 flex items-center justify-center"
    >
        {visible ? (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
        ) : (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943-9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        )}
    </button>
);

const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center gap-1.5 text-[11px] md:text-xs transition-colors ${met ? 'text-green-600' : 'text-gray-400'}`}>
        <svg className={`w-3 h-3 ${met ? 'opacity-100' : 'opacity-40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
        <span>{text}</span>
    </div>
);

const Field = ({ label, error, success, required, children, className = "", fieldName }) => (
    <div className={`flex flex-col ${className}`} data-field={fieldName}>
        <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-xs md:text-sm text-red-500">{error}</p>}
        {success && !error && <p className="mt-1 text-xs md:text-sm text-green-600 font-medium">{success}</p>}
    </div>
);

const LoadingSpinner = () => (
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const inputClass = (err, success) =>
    `w-full px-4 py-2.5 md:py-3 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/40 focus:border-[#1a5c3a] transition-colors
    ${err ? 'border-red-400 bg-red-50' : success ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white'}`;

const selectClass = (err) =>
    `w-full px-4 py-2.5 md:py-3 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/40 focus:border-[#1a5c3a] transition-colors overflow-y-auto
    ${err ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`;

export default function StepAccount({ data, setData, errors, setError, clearErrors }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowPasswordConfirm] = useState(false);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    // State for password match success message
    const [passwordMatchMsg, setPasswordMatchMsg] = useState('');

    const password = data.password || '';
    const criteria = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
    };

    // ── Username Standard React Debounce ───────────────────────────────────
    useEffect(() => {
        const username = data.username;
        if (!username || username.length < 3) {
            if (errors.username && errors.username.includes('taken')) clearErrors('username');
            setIsCheckingUsername(false);
            return;
        }

        setIsCheckingUsername(true);
        const timeoutId = setTimeout(async () => {
            try {
                const response = await axios.post('/validate-username', { username });
                if (response.data.taken) setError('username', 'This username is already taken.');
                else if (errors.username && errors.username.includes('taken')) clearErrors('username');
            } catch (err) {
                console.error(err);
            } finally {
                setIsCheckingUsername(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [data.username]);

    // ── Email Standard React Debounce with Format Check ────────────────────
    useEffect(() => {
        const email = data.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            setIsCheckingEmail(false);
            return;
        }

        setIsCheckingEmail(true);
        const timeoutId = setTimeout(async () => {
            try {
                const response = await axios.post('/validate-email', { email });
                if (response.data.taken) setError('email', 'This email is already registered.');
                else if (errors.email && errors.email.includes('registered')) clearErrors('email');
            } catch (err) {
                console.error(err);
            } finally {
                setIsCheckingEmail(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [data.email]);

    // ── Password Match Debounce ────────────────────────────────────────────
    useEffect(() => {
        const confirmPw = data.password_confirmation;
        const pw = data.password;

        if (!confirmPw) {
            setPasswordMatchMsg('');
            if (errors.password_confirmation === 'Password did NOT match.') {
                clearErrors('password_confirmation');
            }
            return;
        }

        // Wait 500ms after the user stops typing to check
        const timeoutId = setTimeout(() => {
            if (pw === confirmPw && pw.length > 0) {
                setPasswordMatchMsg('Password matched.');
                if (errors.password_confirmation) clearErrors('password_confirmation');
            } else {
                setPasswordMatchMsg('');
                setError('password_confirmation', 'Password did NOT match.');
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [data.password, data.password_confirmation]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Username" error={errors.username} required fieldName="username">
                    <div className="relative">
                        <input
                            type="text" id="username" name="username" value={data.username}
                            onChange={e => {
                                setData('username', e.target.value);
                                if (errors.username) clearErrors('username');
                            }}
                            className={inputClass(errors.username) + (isCheckingUsername ? ' pr-10' : '')}
                            placeholder="Enter username" autoComplete="username"
                        />
                        {isCheckingUsername && <LoadingSpinner />}
                    </div>
                </Field>

                <Field label="Email" error={errors.email} required fieldName="email">
                    <div className="relative">
                        <input
                            type="email" id="email" name="email" value={data.email}
                            onChange={e => {
                                setData('email', e.target.value);
                                if (errors.email) clearErrors('email');
                            }}
                            className={inputClass(errors.email) + (isCheckingEmail ? ' pr-10' : '')}
                            placeholder="Enter email address" autoComplete="email"
                        />
                        {isCheckingEmail && <LoadingSpinner />}
                    </div>
                </Field>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-1 gap-4">
                    <Field label="Password" error={errors.password} required fieldName="password">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 mb-2 space-y-1">
                            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Password Requirements:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-2">
                                <PasswordRequirement met={criteria.length} text="8+ characters" />
                                <PasswordRequirement met={criteria.upper} text="Uppercase letter" />
                                <PasswordRequirement met={criteria.number} text="One number" />
                            </div>
                        </div>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className={inputClass(errors.password) + ' pr-10'}
                                placeholder="Create a password" autoComplete="new-password" />
                            <EyeIcon visible={showPassword} toggle={() => setShowPassword(!showPassword)} />
                        </div>
                    </Field>

                    <Field
                        label="Confirm Password"
                        error={errors.password_confirmation}
                        success={passwordMatchMsg}
                        required
                        fieldName="password_confirmation"
                        className="md:justify-end"
                    >
                        <div className="relative">
                            <input type={showConfirm ? 'text' : 'password'} id="password_confirmation" name="password_confirmation" value={data.password_confirmation}
                                onChange={e => {
                                    setData('password_confirmation', e.target.value);
                                    // Hide match and error messages immediately while typing again
                                    if (passwordMatchMsg) setPasswordMatchMsg('');
                                    if (errors.password_confirmation === 'Password did NOT match.') clearErrors('password_confirmation');
                                }}
                                className={inputClass(errors.password_confirmation, passwordMatchMsg) + ' pr-10'}
                                placeholder="Confirm your password" autoComplete="new-password" />
                            <EyeIcon visible={showConfirm} toggle={() => setShowPasswordConfirm(!showConfirm)} />
                        </div>
                    </Field>
                </div>

                <Field label="Employee ID" error={errors.employee_id} required fieldName="employee_id">
                    <input type="text" id="employee_id" name="employee_id" inputMode="numeric" pattern="[0-9]*"
                        value={data.employee_id}
                        onChange={e => setData('employee_id', e.target.value.replace(/\D/g, ''))}
                        className={inputClass(errors.employee_id)}
                        placeholder="Enter employee ID" />
                </Field>

                <Field label="Department" error={errors.department_id} required fieldName="department_id">
                    <select
                        id="department_id"
                        name="department_id"
                        value={data.department_id}
                        onChange={e => setData('department_id', e.target.value)}
                        className={selectClass(errors.department_id)}
                    >
                        <option value="">Select Department</option>
                        {(data._departments || []).map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Career Service" error={errors.career_service_id} required
                    fieldName="career_service_id" className="md:col-span-2">
                    <select
                        id="career_service_id"
                        name="career_service_id"
                        value={data.career_service_id}
                        onChange={e => setData('career_service_id', e.target.value)}
                        className={selectClass(errors.career_service_id)}
                    >
                        <option value="">Select Career Service</option>
                        {(data._careerServices || []).map(cs => (
                            <option key={cs.id} value={cs.id}>{cs.name}</option>
                        ))}
                    </select>
                </Field>
            </div>
        </div>
    );
}
