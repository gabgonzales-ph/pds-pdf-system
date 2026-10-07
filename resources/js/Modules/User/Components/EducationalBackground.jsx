// resources/js/Modules/User/Components/EducationalBackground.jsx

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { router, usePage } from '@inertiajs/react';
import { Section, Spinner } from './PDSShared';

// ── Constants ─────────────────────────────────────────────────────────

const ACADEMIC_DEGREES = ['BS', 'BA', 'BFA', 'BEEd', 'BSEd', 'BSIT', 'BSCS', 'BSCE', 'MS', 'MA', 'MBA', 'MPA', 'MEd', 'PhD', 'EdD'];

const EDUCATION_LEVELS = [
    { key: 'Elementary',            label: 'Elementary' },
    { key: 'Secondary',             label: 'Secondary' },
    { key: 'Vocation/Trade Course', label: 'Vocational/Trade Course' },
    { key: 'College',               label: 'College' },
    { key: 'Graduate Studies',      label: 'Graduate Studies' },
];

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

// ── Helpers ───────────────────────────────────────────────────────────

function emptyRow(level) {
    return {
        level,
        school_name:     '',
        academic_degree: '',
        degree_course:   '',
        attendance_from: '',
        attendance_to:   '',
        highest_level:   '',
        year_graduated:  '',
        honors_received: '',
    };
}

function rowFromData(data) {
    return {
        level:           data.level,
        school_name:     data.school_name     || '',
        academic_degree: data.academic_degree || '',
        degree_course:   data.degree_course   || '',
        attendance_from: data.attendance_from || '',
        attendance_to:   data.attendance_to   || '',
        highest_level:   data.highest_level   || '',
        year_graduated:  data.year_graduated  || '',
        honors_received: data.honors_received || '',
    };
}

function rowHasAnyData(row) {
    return ['school_name', 'degree_course', 'academic_degree', 'attendance_from',
            'attendance_to', 'highest_level', 'year_graduated', 'honors_received']
        .some(f => row[f]?.trim?.());
}

function rowIsComplete(row) {
    const isHigherEd = ['College', 'Graduate Studies'].includes(row.level);
    return Boolean(
        row.school_name?.trim()     &&
        row.degree_course?.trim()   &&
        row.attendance_from?.trim() &&
        row.attendance_to?.trim()   &&
        (row.highest_level?.trim() || row.year_graduated?.trim()) &&
        (!isHigherEd || row.academic_degree?.trim())
    );
}

function rowIsDirty(formRow, serverRow) {
    if (!serverRow) return rowHasAnyData(formRow);
    const fields = ['school_name', 'academic_degree', 'degree_course', 'attendance_from',
                    'attendance_to', 'highest_level', 'year_graduated', 'honors_received'];
    return fields.some(f => (formRow[f] ?? '').trim() !== (serverRow[f] ?? '').toString().trim());
}

function validateRow(row) {
    const errors = {};
    if (!row.school_name.trim())     errors.school_name     = 'School name is required.';
    if (!row.degree_course.trim())   errors.degree_course   = 'Degree/Course is required.';
    if (!row.attendance_from.trim()) errors.attendance_from = 'Date From is required.';
    if (!row.attendance_to.trim())   errors.attendance_to   = 'Date To is required.';
    
    const isHigherEd = ['College', 'Graduate Studies'].includes(row.level);
    if (isHigherEd && !row.academic_degree.trim()) errors.academic_degree = 'Required.';

    // Chronological validation
    if (row.attendance_from && row.attendance_to && row.attendance_to !== 'UNDERGRAD') {
        const [fD, fM, fY] = row.attendance_from.split('/').map(Number);
        const [tD, tM, tY] = row.attendance_to.split('/').map(Number);
        
        if (fD && fM && fY && tD && tM && tY) {
            const fromDate = new Date(fY, fM - 1, fD);
            const toDate = new Date(tY, tM - 1, tD);
            if (fromDate > toDate) {
                errors.attendance_to = 'Date To cannot be earlier than Date From.';
            }
        }
    }

    // Year Graduated and Highest Level Interdependence
    const hasYear = (row.year_graduated || '').trim();
    const hasLevel = (row.highest_level || '').trim();

    if (!hasYear && !hasLevel) {
        errors.year_graduated = 'Required if no Highest Level provided.';
        errors.highest_level = 'Required if not graduated.';
    }

    if (hasYear && hasYear !== 'N/A' && !/^\d{4}$/.test(hasYear)) {
        errors.year_graduated = 'Must be a 4-digit year or N/A.';
    }

    return errors;
}

// Parse "dd/mm/yyyy" or "UNDERGRAD" into day/month/year parts
function parseDateValue(value) {
    if (!value || value === 'UNDERGRAD') return { day: '', month: '', year: '' };
    const parts = value.split('/');
    if (parts.length === 3) {
        return { day: parts[0], month: parts[1], year: parts[2] };
    }
    return { day: '', month: '', year: '' };
}

function validateDateParts(day, month, year) {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (!d || !m || !y || year.length < 4) return { valid: false, error: null };

    if (y < 1900) return { valid: false, error: 'Year must be 1900 or later.' };

    // Use Date to validate calendar correctness (handles leap years, month lengths)
    const parsed = new Date(y, m - 1, d);
    if (
        parsed.getFullYear() !== y ||
        parsed.getMonth()    !== m - 1 ||
        parsed.getDate()     !== d
    ) return { valid: false, error: 'Invalid calendar date.' };

    // Full date — not in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsed > today) return { valid: false, error: 'Date cannot be in the future.' };

    return { valid: true, error: null };
}


// ── Date Picker Modal ─────────────────────────────────────────────────

function DatePickerModal({ isOpen, onClose, value, onChange, label, allowUndergraduate = false }) {
    const isUndergraduate = value === 'UNDERGRAD';
    const parsed = parseDateValue(isUndergraduate ? '' : value);

    const [day,   setDay]   = useState(parsed.day);
    const [month, setMonth] = useState(parsed.month);
    const [year,  setYear]  = useState(parsed.year);
    
    const [ugActive,   setUgActive]   = useState(isUndergraduate);
    const [visible,    setVisible]    = useState(false);
    const [animIn,     setAnimIn]     = useState(false);
    const [dateError,  setDateError]  = useState(null);

    const dayRef   = useRef(null);
    const monthRef = useRef(null);
    const yearRef  = useRef(null);

    // Sync state when modal opens
    useEffect(() => {
        if (isOpen) {
            const isUg = value === 'UNDERGRAD';
            const p = parseDateValue(isUg ? '' : value);
            setDay(p.day);
            setMonth(p.month);
            setYear(p.year);
            setUgActive(isUg);
            setDateError(null);
            setVisible(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
        } else {
            setAnimIn(false);
            const t = setTimeout(() => setVisible(false), 250);
            return () => clearTimeout(t);
        }
    }, [isOpen, value]);

    // ESC to close
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen]);

    function handleClose() {
        onClose();
    }

    function handleConfirm() {
        if (ugActive) {
            onChange('UNDERGRAD');
            handleClose();
            return;
        }

        const d = day.padStart(2, '0');
        const m = month.padStart(2, '0');
        const y = year;

        const { valid, error } = validateDateParts(d, m, y);
        if (!valid) {
            setDateError(error);
            return;
        }

        onChange(`${d}/${m}/${y}`);
        handleClose();
    }

    function toggleUndergraduate() {
        setUgActive(prev => {
            if (!prev) {
                // Activating — clear date fields
                setDay('');
                setMonth('');
                setYear('');
            }
            return !prev;
        });
    }

    function handleDayChange(v) {
        const clean = v.replace(/\D/g, '').slice(0, 2);
        setDay(clean);
        setDateError(null);
        if (clean.length === 2) monthRef.current?.focus();
    }

    function handleMonthChange(v) {
        const clean = v.replace(/\D/g, '').slice(0, 2);
        setMonth(clean);
        setDateError(null);
        if (clean.length === 2) yearRef.current?.focus();
    }

    function handleYearChange(v) {
        const clean = v.replace(/\D/g, '').slice(0, 4);
        setYear(clean);
        setDateError(null);
    }

    const canConfirm = ugActive || (day && month && year && year.length === 4 && !dateError);

    if (!visible) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ transition: 'all 0.25s ease' }}
            onClick={handleClose}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
                style={{
                    opacity: animIn ? 1 : 0,
                    transition: 'opacity 0.25s ease',
                }}
            />

            {/* Modal Card */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xs p-5 flex flex-col gap-4"
                style={{
                    opacity:   animIn ? 1 : 0,
                    transform: animIn ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
                    transition: 'opacity 0.25s ease, transform 0.25s ease',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
                    <button
                        onClick={handleClose}
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400
                            hover:text-gray-600 hover:bg-gray-100 transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Date Inputs */}
                <div
                    className="flex gap-2"
                    style={{
                        opacity:    ugActive ? 0.35 : 1,
                        pointerEvents: ugActive ? 'none' : 'auto',
                        transition: 'opacity 0.2s ease',
                    }}
                >
                    {/* Day */}
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center">Day</label>
                        <input
                            ref={dayRef}
                            type="text"
                            inputMode="numeric"
                            maxLength={2}
                            value={day}
                            onChange={e => handleDayChange(e.target.value)}
                            placeholder="DD"
                            disabled={ugActive}
                            className="w-full text-center text-sm font-semibold text-gray-800 bg-gray-50
                                border border-gray-200 rounded-xl px-2 py-2.5 outline-none
                                focus:border-[#1a5c3a] focus:bg-white transition-all placeholder-gray-300"
                        />
                    </div>

                    <div className="flex items-end pb-2.5 text-gray-300 font-light text-lg select-none">/</div>

                    {/* Month */}
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center">Month</label>
                        <input
                            ref={monthRef}
                            type="text"
                            inputMode="numeric"
                            maxLength={2}
                            value={month}
                            onChange={e => handleMonthChange(e.target.value)}
                            placeholder="MM"
                            disabled={ugActive}
                            className="w-full text-center text-sm font-semibold text-gray-800 bg-gray-50
                                border border-gray-200 rounded-xl px-2 py-2.5 outline-none
                                focus:border-[#1a5c3a] focus:bg-white transition-all placeholder-gray-300"
                        />
                    </div>

                    <div className="flex items-end pb-2.5 text-gray-300 font-light text-lg select-none">/</div>

                    {/* Year */}
                    <div className="flex-[1.6] flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center">Year</label>
                        <input
                            ref={yearRef}
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            value={year}
                            onChange={e => handleYearChange(e.target.value)}
                            placeholder="YYYY"
                            disabled={ugActive}
                            className="w-full text-center text-sm font-semibold text-gray-800 bg-gray-50
                                border border-gray-200 rounded-xl px-2 py-2.5 outline-none
                                focus:border-[#1a5c3a] focus:bg-white transition-all placeholder-gray-300"
                        />
                    </div>
                </div>
                
                {dateError && (
                    <p className="text-[11px] text-red-500 font-medium -mt-1 text-center">{dateError}</p>
                )}

                {/* Undergraduate Toggle — only for attendance_to */}
                {allowUndergraduate && (
                    <button
                        onClick={toggleUndergraduate}
                        className={`w-full text-xs font-semibold py-2.5 rounded-xl border transition-all duration-200
                            ${ugActive
                                ? 'bg-red-500 text-white border-red-500 shadow-sm hover:bg-red-600'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-[#1a5c3a] hover:text-[#1a5c3a] hover:bg-green-50/40'
                            }`}
                    >
                        {ugActive ? '✓ Undergraduate (tap to undo)' : 'Undergraduate'}
                    </button>
                )}

                {/* Confirm */}
                <button
                    onClick={handleConfirm}
                    disabled={!canConfirm}
                    className={`w-full text-xs font-semibold py-2.5 rounded-xl transition-all duration-200
                        ${canConfirm
                            ? 'bg-[#1a5c3a] text-white hover:bg-[#14472e] shadow-sm'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Confirm
                </button>
            </div>
        </div>,
        document.body
    );
}

// ── Field Components ──────────────────────────────────────────────────

function FieldLabel({ children, required }) {
    return (
        <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            {children}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
    );
}

function FieldInput({ value, onChange, placeholder, year, disabled, error }) {
    return (
        <div>
            <input
                type="text"
                value={value}
                onChange={e => {
                    let v = e.target.value.toUpperCase();
                    if (year) {
                        v = v.replace(/[^0-9A-Z/]/g, '').slice(0, 10);
                    }
                    onChange(v);
                }}
                placeholder={placeholder || '—'}
                disabled={disabled}
                className={`w-full text-xs text-gray-800 bg-white border rounded-lg px-3 py-2
                    outline-none placeholder-gray-300 transition-colors disabled:opacity-40
                    ${error ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#1a5c3a]'}`}
            />
            {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
        </div>
    );
}

function FieldSelect({ value, onChange, options, disabled, error, placeholder }) {
    return (
        <div>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
                className={`w-full text-xs text-gray-800 bg-white border rounded-lg px-3 py-2
                    outline-none transition-colors disabled:opacity-40
                    ${error ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#1a5c3a]'}`}
            >
                <option value="">{placeholder || 'Select...'}</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
        </div>
    );
}

// ── Date Trigger Input ────────────────────────────────────────────────

function DateTriggerInput({ value, onClick, disabled, error, placeholder }) {
    const isUg = value === 'UNDERGRAD';
    const isEmpty = !value;

    return (
        <div>
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`w-full text-xs text-left bg-white border rounded-lg px-3 py-2
                    outline-none transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
                    ${error
                        ? 'border-red-400 hover:border-red-400'
                        : 'border-gray-200 hover:border-[#1a5c3a] focus:border-[#1a5c3a]'
                    }`}
            >
                <span className={`${isEmpty ? 'text-gray-300' : isUg ? 'text-[#1a5c3a] font-semibold tracking-widest text-[10px]' : 'text-gray-800'}`}>
                    {isEmpty ? (placeholder || 'dd/mm/yyyy') : value}
                </span>
            </button>
            {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
        </div>
    );
}

// ── Level Card Form ───────────────────────────────────────────────────

function LevelCardForm({ levelKey, form, onChange, errors, disabled }) {
    const isHigherEd = ['College', 'Graduate Studies'].includes(levelKey);

    const [modalOpen, setModalOpen] = useState(null); // 'from' | 'to' | null

    function update(field, value) {
        let nextForm = { ...form, [field]: value };

        if (field === 'attendance_to') {
            if (value === 'UNDERGRAD') {
                nextForm.year_graduated = 'N/A';
            } else {
                const parts = (value || '').split('/');
                const extractedYear = parts.length === 3 ? parts[2] : '';
                const currentYearGrad = form.year_graduated;

                const isAutoValue = !currentYearGrad || currentYearGrad === 'N/A' || /^\d{4}$/.test(currentYearGrad);
                if (isAutoValue) nextForm.year_graduated = extractedYear;
            }
        }

        onChange(nextForm);
    }

    return (
        <div className="mt-3 bg-gray-50/70 border border-gray-100 rounded-xl p-4 flex flex-col gap-4">

           {/* School Name */}
            <div>
                <FieldLabel required>Name of School</FieldLabel>
                <FieldInput
                    value={form.school_name}
                    onChange={v => update('school_name', v)}
                    placeholder="Enter school name"
                    disabled={disabled}
                    error={errors?.school_name}
                />
            </div>

            {/* Degree / Course */}
            <div>
                <FieldLabel required>
                    {isHigherEd ? 'Academic Degree & Course/Major' : 'Basic Education / Degree / Course'}
                </FieldLabel>
                {isHigherEd ? (
                    <div className="flex gap-2">
                        <div className="w-32 flex-shrink-0">
                            <FieldSelect
                                value={form.academic_degree}
                                onChange={v => update('academic_degree', v)}
                                options={ACADEMIC_DEGREES}
                                disabled={disabled}
                                error={errors?.academic_degree}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <FieldInput
                                value={form.degree_course}
                                onChange={v => update('degree_course', v)}
                                placeholder="Course / Major"
                                disabled={disabled}
                                error={errors?.degree_course}
                            />
                        </div>
                    </div>
                ) : (
                    <FieldInput
                        value={form.degree_course}
                        onChange={v => update('degree_course', v)}
                        placeholder="e.g. Elementary Education"
                        disabled={disabled}
                        error={errors?.degree_course}
                    />
                )}
            </div>

            {/* Attendance From / To */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <FieldLabel required>From</FieldLabel>
                    <DateTriggerInput
                        value={form.attendance_from}
                        onClick={() => !disabled && setModalOpen('from')}
                        disabled={disabled}
                        error={errors?.attendance_from}
                        placeholder="dd/mm/yyyy"
                    />
                </div>
                <div>
                    <FieldLabel required>To</FieldLabel>
                    <DateTriggerInput
                        value={form.attendance_to}
                        onClick={() => !disabled && setModalOpen('to')}
                        disabled={disabled}
                        error={errors?.attendance_to}
                        placeholder="dd/mm/yyyy"
                    />
                </div>
            </div>

            {/* Highest Level / Units Earned */}
            <div>
                <FieldLabel>Highest Level / Units Earned (If not graduated)</FieldLabel>
                <FieldInput
                    value={form.highest_level}
                    onChange={v => update('highest_level', v)}
                    placeholder="e.g. 4th Year / 120 units"
                    disabled={disabled}
                    error={errors?.highest_level}
                />
            </div>

            {/* Year Graduated */}
            <div>
                <FieldLabel>Year Graduated</FieldLabel>
                <FieldInput
                    value={form.year_graduated}
                    onChange={v => update('year_graduated', v)}
                    placeholder="YYYY"
                    year
                    disabled={disabled || form.attendance_to === 'UNDERGRAD'}
                    error={errors?.year_graduated}
                />
            </div>

            {/* Honors / Scholarship */}
            <div>
                <FieldLabel>Scholarship / Honors Received</FieldLabel>
                <FieldInput
                    value={form.honors_received}
                    onChange={v => update('honors_received', v)}
                    placeholder="If none, leave this field blank"
                    disabled={disabled}
                />
            </div>

            {/* Date Picker Modals */}
            <DatePickerModal
                isOpen={modalOpen === 'from'}
                onClose={() => setModalOpen(null)}
                value={form.attendance_from}
                onChange={v => { update('attendance_from', v); setModalOpen(null); }}
                label="Attendance From"
                allowUndergraduate={false}
            />
            <DatePickerModal
                isOpen={modalOpen === 'to'}
                onClose={() => setModalOpen(null)}
                value={form.attendance_to}
                onChange={v => { update('attendance_to', v); setModalOpen(null); }}
                label="Attendance To"
                allowUndergraduate={true}
            />
        </div>
    );
}

// ── Level Button ──────────────────────────────────────────────────────

function LevelButton({
    levelLabel, hasFilled, isComplete, isOpen, hasErrors,
    onToggle, onRemove, onConfirmRemove, onCancelRemove,
    removing, pendingRemove, disabled,
}) {
    return (
        <div className={`flex items-center gap-2 transition-all duration-200
            ${pendingRemove ? 'rounded-xl border border-red-200 bg-red-50 px-3 py-1.5' : ''}`}>

            {pendingRemove ? (
                <>
                    <span className="flex-1 min-w-0 text-xs font-semibold text-red-600 truncate">
                        Remove {levelLabel}?
                    </span>
                    <button
                        onClick={onCancelRemove}
                        disabled={removing}
                        className="text-[11px] font-medium text-gray-500 hover:text-gray-700
                            px-2.5 py-1 rounded-lg border border-gray-200 bg-white
                            hover:bg-gray-50 transition-all disabled:opacity-40">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirmRemove}
                        disabled={removing}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-white
                            px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600
                            transition-all disabled:opacity-40">
                        {removing ? <Spinner /> : null}
                        {removing ? 'Removing…' : 'Confirm'}
                    </button>
                </>
            ) : (
                <>
                    <button
                        onClick={onToggle}
                        disabled={disabled}
                        className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold
                            border transition-all duration-150 text-left
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${hasErrors
                                ? 'bg-red-50 text-red-600 border-red-300'
                                : isOpen
                                    ? 'bg-[#1a5c3a] text-white border-[#1a5c3a] shadow-sm'
                                    : isComplete
                                        ? 'bg-white text-gray-700 border-[#1a5c3a]'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#1a5c3a] hover:text-[#1a5c3a] hover:bg-green-50/40'
                            }`}
                    >
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                            ${hasErrors ? 'bg-red-100' : isOpen ? 'bg-white/20' : isComplete ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                            {hasErrors ? (
                                <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01"/>
                                </svg>
                            ) : (
                                <svg className={`w-3 h-3 ${isOpen ? 'text-white' : isComplete ? 'text-[#1a5c3a]' : 'text-gray-400'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                        d={isOpen ? 'M19 9l-7 7-7-7' : 'M12 4v16m8-8H4'}/>
                                </svg>
                            )}
                        </span>
                        <span className="flex-1 min-w-0 truncate">{levelLabel}</span>
                    </button>

                    {hasFilled && (
                        <button
                            onClick={onRemove}
                            disabled={removing || disabled}
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl
                                border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200
                                hover:bg-red-50 transition-all disabled:opacity-40">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

// ── Main Section ──────────────────────────────────────────────────────

export default function EducationalBackgroundSection() {
    const { educationalBackgrounds } = usePage().props;
    const [open, setOpen] = useState(false);

    const dataMap = {};
    (educationalBackgrounds || []).forEach(row => { dataMap[row.level] = row; });

    const [forms, setForms] = useState(() => {
        const init = {};
        EDUCATION_LEVELS.forEach(({ key }) => {
            init[key] = dataMap[key] ? rowFromData(dataMap[key]) : emptyRow(key);
        });
        return init;
    });

    const [fieldErrors, setFieldErrors]     = useState({});
    const [expandedLevels, setExpanded]     = useState(new Set());
    const [pendingRemove, setPendingRemove] = useState(null);
    const [deletingLevel, setDeletingLevel] = useState(null);
    const [saving, setSaving]               = useState(false);
    const [globalError, setGlobalError]     = useState(null);

    useEffect(() => {
        setForms(prev => {
            const next = { ...prev };
            EDUCATION_LEVELS.forEach(({ key }) => {
                if (!expandedLevels.has(key)) {
                    const serverData = (educationalBackgrounds || []).find(r => r.level === key);
                    next[key] = serverData ? rowFromData(serverData) : emptyRow(key);
                }
            });
            return next;
        });
    }, [educationalBackgrounds]);

    const isDirty = useMemo(() => {
        return EDUCATION_LEVELS.some(({ key }) => rowIsDirty(forms[key], dataMap[key] ?? null));
    }, [forms, educationalBackgrounds]);

    function updateForm(levelKey, updatedRow) {
        setForms(prev => ({ ...prev, [levelKey]: updatedRow }));
        setFieldErrors(prev => {
            if (!prev[levelKey]) return prev;
            const next = { ...prev };
            delete next[levelKey];
            return next;
        });
        setGlobalError(null);
    }

    function toggleExpand(levelKey) {
        if (pendingRemove && pendingRemove !== levelKey) setPendingRemove(null);
        setExpanded(prev => {
            const next = new Set(prev);
            next.has(levelKey) ? next.delete(levelKey) : next.add(levelKey);
            return next;
        });
    }

    function handleRemoveConfirm(levelKey) {
        setPendingRemove(null);
        setDeletingLevel(levelKey);
        router.delete(`/user/educational-background/${encodeURIComponent(levelKey)}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingLevel(null);
                setExpanded(prev => { const next = new Set(prev); next.delete(levelKey); return next; });
                setForms(prev => ({ ...prev, [levelKey]: emptyRow(levelKey) }));
                setFieldErrors(prev => { const next = { ...prev }; delete next[levelKey]; return next; });
            },
            onError: () => setDeletingLevel(null),
        });
    }

    function handleSave() {
        const newErrors = {};
        EDUCATION_LEVELS.forEach(({ key }) => {
            const row = forms[key];
            if (rowHasAnyData(row)) {
                const errs = validateRow(row);
                if (Object.keys(errs).length > 0) newErrors[key] = errs;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            setExpanded(prev => {
                const next = new Set(prev);
                Object.keys(newErrors).forEach(k => next.add(k));
                return next;
            });
            setGlobalError('Please complete the required fields.');
            return;
        }

        const payload = EDUCATION_LEVELS
            .map(({ key }) => forms[key])
            .filter(row => rowHasAnyData(row));

        if (payload.length === 0) return;

        setSaving(true);
        router.post('/user/educational-background', { education: payload }, {
            preserveScroll: true,
            onSuccess: () => {
                setSaving(false);
                setExpanded(new Set());
            },
            onError: (errs) => {
                setSaving(false);
                setGlobalError('Validation failed. Please review the highlighted fields.');

                const nextFieldErrors = {};
                const nextExpanded = new Set(expandedLevels);

                Object.keys(errs).forEach(key => {
                    const match = key.match(/^education\.(\d+)\.(.+)$/);
                    if (match) {
                        const index = parseInt(match[1], 10);
                        const field = match[2];
                        const rowData = payload[index];
                        if (rowData && rowData.level) {
                            if (!nextFieldErrors[rowData.level]) nextFieldErrors[rowData.level] = {};
                            nextFieldErrors[rowData.level][field] = errs[key];
                            nextExpanded.add(rowData.level);
                        }
                    }
                });

                setFieldErrors(nextFieldErrors);
                setExpanded(nextExpanded);
            },
        });
    }

    const isBusy  = saving || !!deletingLevel;
    const canSave = isDirty && !isBusy;

    return (
        <Section title="III. Educational Background" open={open} onToggle={() => setOpen(p => !p)}>
            <div className="px-5 pb-7 md:px-7 md:pb-8 pt-5">

                {globalError && (
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                        {globalError}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {EDUCATION_LEVELS.map(({ key, label }) => {
                        const isExpanded   = expandedLevels.has(key);
                        const isDeleting   = deletingLevel === key;
                        const hasErrors    = !!fieldErrors[key];
                        const hasFilled    = rowHasAnyData(forms[key]);
                        const isComplete   = rowIsComplete(forms[key]);
                        const isPending    = pendingRemove === key;

                        return (
                            <div key={key}>
                                <LevelButton
                                    levelLabel={label}
                                    hasFilled={hasFilled}
                                    isComplete={isComplete}
                                    isOpen={isExpanded}
                                    hasErrors={hasErrors}
                                    pendingRemove={isPending}
                                    removing={isDeleting}
                                    disabled={isBusy}
                                    onToggle={() => toggleExpand(key)}
                                    onRemove={() => setPendingRemove(key)}
                                    onConfirmRemove={() => handleRemoveConfirm(key)}
                                    onCancelRemove={() => setPendingRemove(null)}
                                />

                                {isExpanded && (
                                    <LevelCardForm
                                        levelKey={key}
                                        form={forms[key]}
                                        onChange={updatedRow => updateForm(key, updatedRow)}
                                        errors={fieldErrors[key]}
                                        disabled={isBusy}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                    <button
                        onClick={handleSave}
                        disabled={!canSave}
                        className={`text-xs font-medium px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm
                            ${canSave ? 'bg-[#1a5c3a] text-white hover:bg-[#14472e]' : 'bg-gray-200 text-gray-400'}`}>
                        {saving && <Spinner />}
                        {saving ? 'Saving…' : 'Save Educational Background'}
                    </button>
                </div>
            </div>
        </Section>
    );
}