// resources/js/Modules/Auth/Components/Registration/StepFamilyBackground.jsx

import React, { useEffect } from 'react';

const SUFFIX_OPTIONS = ['', 'Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];

const inputClass = (err) =>
    `w-full px-4 py-2.5 md:py-3 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/40 focus:border-[#1a5c3a] transition-colors
    ${err ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`;

const selectClass = (err) =>
    `w-full px-4 py-2.5 md:py-3 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]/40 focus:border-[#1a5c3a] transition-colors
    ${err ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`;

const Field = ({ label, error, required, children, fieldName }) => (
    <div data-field={fieldName}>
        <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-xs md:text-sm text-red-500">{error}</p>}
    </div>
);

const SectionTitle = ({ children, optional }) => (
    <h3 className="text-sm md:text-base font-bold text-[#1a5c3a] uppercase tracking-wide border-b border-[#1a5c3a]/20 pb-2 mb-4 mt-6 first:mt-0 flex items-center gap-2">
        {children}
        {optional && (
            <span className="text-xs font-normal text-gray-400 normal-case tracking-normal border border-gray-300 rounded px-1.5 py-0.5">
                Optional
            </span>
        )}
    </h3>
);

const SuffixSelect = ({ value, onChange, error }) => (
    <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        size={1}
        className={selectClass(error)}
        style={{ maxHeight: 'calc(10 * 2.25rem)', overflowY: 'auto' }}
    >
        <option value="">None</option>
        {SUFFIX_OPTIONS.filter(s => s !== '').map(s => (
            <option key={s} value={s}>{s}</option>
        ))}
    </select>
);

const NameGrid = ({ prefix, data, setData, errors: errs, required }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Surname" error={errs?.[`${prefix}_surname`]} required={required}
            fieldName={`${prefix}_surname`}>
            <input type="text" value={data[`${prefix}_surname`] || ''}
                onChange={e => setData(`${prefix}_surname`, e.target.value.toUpperCase())}
                className={inputClass(errs?.[`${prefix}_surname`])}
                placeholder="Surname" />
        </Field>
        <Field label="First Name" error={errs?.[`${prefix}_first_name`]} required={required}
            fieldName={`${prefix}_first_name`}>
            <input type="text" value={data[`${prefix}_first_name`] || ''}
                onChange={e => setData(`${prefix}_first_name`, e.target.value.toUpperCase())}
                className={inputClass(errs?.[`${prefix}_first_name`])}
                placeholder="First name" />
        </Field>
        <Field label="Middle Name" error={errs?.[`${prefix}_middle_name`]}
            fieldName={`${prefix}_middle_name`}>
            <input type="text" value={data[`${prefix}_middle_name`] || ''}
                onChange={e => setData(`${prefix}_middle_name`, e.target.value.toUpperCase())}
                className={inputClass(errs?.[`${prefix}_middle_name`])}
                placeholder="Middle name (optional)" />
        </Field>
        <Field label="Name Extension (Suffix)" error={errs?.[`${prefix}_suffix`]}
            fieldName={`${prefix}_suffix`}>
            <SuffixSelect
                value={data[`${prefix}_suffix`]}
                onChange={val => setData(`${prefix}_suffix`, val)}
                error={errs?.[`${prefix}_suffix`]}
            />
        </Field>
    </div>
);

// Statuses that require spouse information to be filled in.
const SPOUSE_REQUIRED_STATUSES = ['Married', 'Widowed', 'Separated'];

export default function StepFamilyBackground({ data, setData, errors }) {
    const civilStatus = data.civil_status;
    const isCivilStatusRequiringSpouse = SPOUSE_REQUIRED_STATUSES.includes(civilStatus);

    // Hide the spouse section entirely for statuses that never need it.
    // This is broader than the old isSingle check — it covers 'Single',
    // 'Annulled', 'Other/s', and any future status not in SPOUSE_REQUIRED_STATUSES.
    const showSpouseSection = isCivilStatusRequiringSpouse;

    // Clear all spouse fields whenever civil_status changes to one that does
    // not require spouse info. Depends on the raw civil_status string so it
    // re-runs on every status change, not just Single ↔ non-Single transitions.
    // This prevents ghost data from a prior Married/Widowed/Separated entry
    // from silently surviving a status change and being submitted.
    useEffect(() => {
        if (!isCivilStatusRequiringSpouse) {
            setData(prev => ({
                ...prev,
                spouse_surname: '',
                spouse_first_name: '',
                spouse_middle_name: '',
                spouse_suffix: '',
                spouse_birthdate: '',
            }));
        }
    }, [civilStatus]); // eslint-disable-line react-hooks/exhaustive-deps
    // Note: intentionally depending on civilStatus (the raw value) rather than
    // a derived boolean so Married → Widowed → Single all trigger correctly.

    return (
        <div className="space-y-4">
            <SectionTitle>Father's Name</SectionTitle>
            <NameGrid prefix="father" data={data} setData={setData} errors={errors} required />

            <SectionTitle>Mother's Maiden Name</SectionTitle>
            <NameGrid prefix="mother" data={data} setData={setData} errors={errors} required />

            {showSpouseSection && (
                <>
                    <SectionTitle>Spouse Information</SectionTitle>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Surname" error={errors.spouse_surname}
                            required={isCivilStatusRequiringSpouse} fieldName="spouse_surname">
                            <input type="text" value={data.spouse_surname || ''}
                                onChange={e => setData('spouse_surname', e.target.value.toUpperCase())}
                                className={inputClass(errors.spouse_surname)}
                                placeholder="Surname" />
                        </Field>
                        <Field label="First Name" error={errors.spouse_first_name}
                            required={isCivilStatusRequiringSpouse} fieldName="spouse_first_name">
                            <input type="text" value={data.spouse_first_name || ''}
                                onChange={e => setData('spouse_first_name', e.target.value.toUpperCase())}
                                className={inputClass(errors.spouse_first_name)}
                                placeholder="First name" />
                        </Field>

                        <Field label="Middle Name" error={errors.spouse_middle_name} fieldName="spouse_middle_name">
                            <input type="text" value={data.spouse_middle_name || ''}
                                onChange={e => setData('spouse_middle_name', e.target.value.toUpperCase())}
                                className={inputClass(errors.spouse_middle_name)}
                                placeholder="Middle name (optional)" />
                        </Field>

                        <Field label="Name Extension (Suffix)" error={errors.spouse_suffix}
                            fieldName="spouse_suffix">
                            <SuffixSelect
                                value={data.spouse_suffix}
                                onChange={val => setData('spouse_suffix', val)}
                                error={errors.spouse_suffix}
                            />
                        </Field>

                        <Field label="Date of Birth" error={errors.spouse_birthdate}
                            required={isCivilStatusRequiringSpouse} fieldName="spouse_birthdate">
                            <input type="date" value={data.spouse_birthdate || ''}
                                onChange={e => setData('spouse_birthdate', e.target.value)}
                                className={inputClass(errors.spouse_birthdate)}
                                max={(() => {
                                    const d = new Date();
                                    d.setFullYear(d.getFullYear() - 18);
                                    return d.toISOString().split('T')[0];
                                })()} />
                        </Field>
                    </div>
                </>
            )}
        </div>
    );
}