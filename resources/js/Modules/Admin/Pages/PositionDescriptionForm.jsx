// resources/js/Modules/Admin/Pages/PositionDescriptionForm.jsx

import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

const COMPETENCY_LEVELS = ['Basic', 'Intermediate', 'Advanced', 'Superior', 'Distinguished'];

const TIER_OPTIONS = [
    { value: 'executive',  label: 'Executive'  },
    { value: 'management', label: 'Management' },
    { value: 'staff',      label: 'Staff'      },
];

// ── Shared UI primitives ──────────────────────────────────────────────

function SectionCard({ number, title, children }) {
    return (
        <div className="bg-white md:rounded-2xl shadow-sm border-y md:border border-gray-100 overflow-hidden mb-px md:mb-5">
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#1a5c3a] text-white text-xs font-bold
                    flex items-center justify-center flex-shrink-0">
                    {number}
                </span>
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h2>
            </div>
            <div className="p-4 md:p-6">{children}</div>
        </div>
    );
}

function Field({ label, error, required, children, half }) {
    return (
        <div className={half ? 'flex-1 min-w-0' : 'w-full'}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500" data-error="true">{error}</p>}
        </div>
    );
}

const inputClass = (error) =>
    `w-full px-3 py-2 text-sm border rounded-lg bg-white text-gray-800
    focus:outline-none focus:ring-2 transition-all duration-150
    ${error
        ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
        : 'border-gray-200 focus:ring-[#1a5c3a]/20 focus:border-[#1a5c3a]'}`;

function TextInput({ value, onChange, placeholder, error, type = 'text' }) {
    return (
        <input
            type={type}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputClass(error)}
        />
    );
}

function SelectInput({ value, onChange, options, placeholder, error }) {
    return (
        <select value={value} onChange={e => onChange(e.target.value)} className={inputClass(error)}>
            <option value="">{placeholder || 'Select…'}</option>
            {options.map(o => (
                <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
            ))}
        </select>
    );
}

function TextArea({ value, onChange, placeholder, error, rows = 4, maxLength }) {
    return (
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            className={inputClass(error) + ' resize-y'}
        />
    );
}

function AddRowButton({ onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#1a5c3a]
                hover:text-[#14472e] transition-colors duration-150 px-1"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {label}
        </button>
    );
}

function RemoveRowButton({ onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                text-gray-300 hover:text-red-400 transition-colors duration-150 rounded-lg
                hover:bg-red-50 bg-gray-50 md:bg-transparent"
        >
            <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    );
}

// ── Tier Badge (preview inside the select label area) ─────────────────

const TIER_STYLES = {
    executive:  'bg-purple-50 text-purple-700 border-purple-200',
    management: 'bg-blue-50 text-blue-700 border-blue-200',
    staff:      'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function TierPreviewBadge({ tier }) {
    if (!tier) return null;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
            border capitalize ml-1.5 transition-all duration-200 ${TIER_STYLES[tier] ?? ''}`}>
            {tier}
        </span>
    );
}

// ── Default form state ────────────────────────────────────────────────

function defaultForm() {
    return {
        position_title:               '',
        tier:                         '',
        item_number:                  '',
        salary_grade:                 '',
        gov_unit_type:                '',
        gov_unit_class:               '',
        department_agency:            '',
        bureau_office:                '',
        department_branch_division:   '',
        workstation:                  '',
        present_approp_act:           '',
        previous_approp_act:          '',
        salary_authorized:            '',
        other_compensation:           '',
        immediate_supervisor_title:   '',
        next_higher_supervisor_title: '',
        supervised_positions:         [{ position_title: '', item_number: '' }],
        equipment_tools:              [''],
        contacts_internal: {
            executive_managerial: { occasional: false, frequent: false },
            supervisors:          { occasional: false, frequent: false },
            non_supervisors:      { occasional: false, frequent: false },
            staff:                { occasional: false, frequent: false },
        },
        contacts_external: {
            general_public: { occasional: false, frequent: false },
            other_agencies: { occasional: false, frequent: false },
            others:         { text: '', occasional: false, frequent: false },
        },
        working_condition_type:        '',
        working_condition_other:       '',
        working_condition_frequency:   '',
        unit_function_description:     '',
        position_function_description: '',
        edu_standard:                  '',
        experience_standard:           '',
        training_standard:             '',
        eligibility_standard:          '',
        core_competencies:             [{ competency: '', level: '' }],
        leadership_competencies:       [{ competency: '', level: '' }],
        duties_responsibilities:       [{ percentage: '', description: '', competency_level: '' }],
    };
}

// ── Client-side publish validation ───────────────────────────────────

function validateForPublish(form) {
    const e = {};
    const req = (key, label) => { if (!form[key]?.toString().trim()) e[key] = `${label} is required.`; };

    req('position_title',               'Position title');
    req('tier',                         'Tier');
    req('item_number',                  'Item number');
    req('salary_grade',                 'Salary grade');
    req('gov_unit_type',                'Governmental unit type');
    req('gov_unit_class',               'Governmental unit class');
    req('department_agency',            'Department / Agency');
    req('bureau_office',                'Bureau or Office');
    req('department_branch_division',   'Department / Branch / Division');
    req('workstation',                  'Workstation');
    req('present_approp_act',           'Present Approp Act');
    req('previous_approp_act',          'Previous Approp Act');
    req('salary_authorized',            'Salary authorized');
    req('other_compensation',           'Other compensation');
    req('immediate_supervisor_title',   'Immediate supervisor title');
    req('next_higher_supervisor_title', 'Next higher supervisor title');

    form.supervised_positions.forEach((row, i) => {
        if (!row.position_title?.trim()) e[`sup_pos_title_${i}`] = 'Position title is required.';
        if (!row.item_number?.trim())    e[`sup_pos_item_${i}`]  = 'Item number is required.';
    });

    form.equipment_tools.forEach((tool, i) => {
        if (!tool?.trim()) e[`equipment_${i}`] = 'Equipment item is required.';
    });

    ['executive_managerial', 'supervisors', 'non_supervisors', 'staff'].forEach(key => {
        const row = form.contacts_internal[key];
        if (!row.occasional && !row.frequent) e[`ci_${key}`] = 'Select frequency.';
    });

    ['general_public', 'other_agencies'].forEach(key => {
        const row = form.contacts_external[key];
        if (!row.occasional && !row.frequent) e[`ce_${key}`] = 'Select frequency.';
    });

    req('working_condition_type',      'Working condition type');
    req('working_condition_frequency', 'Working condition frequency');
    if (form.working_condition_type === 'Others' && !form.working_condition_other?.trim())
        e.working_condition_other = 'Please specify the working condition.';

    req('unit_function_description',     'Unit function description');
    req('position_function_description', 'Position function description');
    req('edu_standard',                  'Education standard');
    req('experience_standard',           'Experience standard');
    req('training_standard',             'Training standard');
    req('eligibility_standard',          'Eligibility standard');

    form.core_competencies.forEach((row, i) => {
        if (!row.competency?.trim()) e[`core_comp_${i}`]  = 'Competency is required.';
        if (!row.level?.trim())      e[`core_level_${i}`] = 'Level is required.';
    });

    form.leadership_competencies.forEach((row, i) => {
        if (!row.competency?.trim()) e[`lead_comp_${i}`]  = 'Competency is required.';
        if (!row.level?.trim())      e[`lead_level_${i}`] = 'Level is required.';
    });

    form.duties_responsibilities.forEach((row, i) => {
        if (!row.percentage?.trim())       e[`duty_pct_${i}`]  = 'Percentage is required.';
        if (!row.description?.trim())      e[`duty_desc_${i}`] = 'Description is required.';
        if (!row.competency_level?.trim()) e[`duty_comp_${i}`] = 'Competency level is required.';
    });

    return e;
}

// ── Icons ─────────────────────────────────────────────────────────────

function IconBack() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    );
}

// ── Main Form Component ───────────────────────────────────────────────

export default function PositionDescriptionForm() {
    const { position } = usePage().props;
    const isEditing = !!position;

    const [form,       setForm]       = useState(() => position ? { ...defaultForm(), ...position } : defaultForm());
    const [errors,     setErrors]     = useState({});
    const [submitting, setSubmitting] = useState(false);

    function set(key, value) {
        setForm(f => ({ ...f, [key]: value }));
        if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
    }

    function setNested(path, value) {
        setForm(f => {
            const updated = { ...f };
            let obj = updated;
            for (let i = 0; i < path.length - 1; i++) {
                obj[path[i]] = { ...obj[path[i]] };
                obj = obj[path[i]];
            }
            obj[path[path.length - 1]] = value;
            return updated;
        });
    }

    function addRow(key, template) {
        setForm(f => ({ ...f, [key]: [...f[key], template] }));
    }

    function removeRow(key, index) {
        setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }));
    }

    function updateRow(key, index, field, value) {
        setForm(f => ({
            ...f,
            [key]: f[key].map((row, i) => i === index ? { ...row, [field]: value } : row),
        }));
        const errKey = field ? `${key}_${field}_${index}` : `${key}_${index}`;
        if (errors[errKey]) setErrors(e => { const n = { ...e }; delete n[errKey]; return n; });
    }

    function setContactRadio(section, rowKey, choice) {
        setNested([section, rowKey, 'occasional'], choice === 'occasional');
        setNested([section, rowKey, 'frequent'],   choice === 'frequent');
        const errKey = section === 'contacts_internal' ? `ci_${rowKey}` : `ce_${rowKey}`;
        if (errors[errKey]) setErrors(e => { const n = { ...e }; delete n[errKey]; return n; });
    }

    function handleSubmit(status) {
        if (status === 'published') {
            const errs = validateForPublish(form);
            if (Object.keys(errs).length > 0) {
                setErrors(errs);
                setTimeout(() => {
                    const first = document.querySelector('[data-error="true"]');
                    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 50);
                return;
            }
        }

        setSubmitting(true);
        const payload = { ...form, status };
        const opts = {
            onError: (errs) => { setErrors(errs); setSubmitting(false); },
            onSuccess: () => setSubmitting(false),
        };

        if (isEditing) {
            router.put(route('admin.positions.update', { position: position.id }), payload, opts);
        } else {
            router.post(route('admin.positions.store'), payload, opts);
        }
    }

    function handleCancel() {
        router.visit(route('admin.dashboard') + '?section=positions');
    }

    const hasErrors = Object.keys(errors).length > 0;

    function ContactRadioRow({ label, rowKey, section, errKey }) {
        const row = section === 'contacts_internal'
            ? form.contacts_internal[rowKey]
            : form.contacts_external[rowKey];
        const err = errors[errKey];

        return (
            <tr className={err ? 'bg-red-50/40' : ''}>
                <td className="px-3 py-2.5 text-sm text-gray-700 font-medium border-r border-gray-100">
                    {label}
                    {err && <p className="text-xs text-red-500 mt-0.5" data-error="true">{err}</p>}
                </td>
                <td className="px-3 py-2.5 text-center border-r border-gray-100">
                    <input
                        type="radio"
                        checked={row.occasional}
                        onChange={() => setContactRadio(section, rowKey, 'occasional')}
                        className="w-4 h-4 accent-[#1a5c3a] cursor-pointer"
                    />
                </td>
                <td className="px-3 py-2.5 text-center">
                    <input
                        type="radio"
                        checked={row.frequent}
                        onChange={() => setContactRadio(section, rowKey, 'frequent')}
                        className="w-4 h-4 accent-[#1a5c3a] cursor-pointer"
                    />
                </td>
            </tr>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f2f0]">

            {/* ── Sticky Top Bar ── */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-[#1a5c3a] shadow-md">
                <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex items-center gap-1.5 text-white/70 hover:text-white
                                transition-colors duration-150 flex-shrink-0"
                        >
                            <IconBack />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-white font-bold text-sm truncate">
                                    {isEditing ? 'Edit Position' : 'Add Position'}
                                </p>
                                {/* Live tier badge in top bar */}
                                {form.tier && (
                                    <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full
                                        text-[10px] font-semibold border capitalize transition-all duration-200
                                        ${form.tier === 'executive'  ? 'bg-purple-100 text-purple-700 border-purple-300' :
                                          form.tier === 'management' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                          'bg-emerald-100 text-emerald-700 border-emerald-300'}`}>
                                        {form.tier}
                                    </span>
                                )}
                            </div>
                            <p className="text-white/60 text-[11px] hidden sm:block">
                                CS Form No. 212-D — Position Description Form
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {hasErrors && (
                            <span className="hidden sm:flex items-center gap-1.5 text-xs text-red-200 font-medium">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Fix errors
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => handleSubmit('draft')}
                            disabled={submitting}
                            className="px-3 py-1.5 text-sm font-semibold text-white/90 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50"
                        >
                            {submitting ? '…' : 'Draft'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSubmit('published')}
                            disabled={submitting}
                            className="px-3 py-1.5 text-sm font-semibold text-[#1a5c3a] bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            {submitting ? '…' : 'Publish'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Form body ── */}
            <div className="pt-14 pb-16">
                <div className="max-w-5xl mx-auto px-0 md:px-8 py-0 md:py-6 space-y-0">

                    {/* 1. Basic Info */}
                    <SectionCard number="1" title="Basic Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Row 1: Position Title + Tier */}
                            <Field label="Position Title" error={errors.position_title} required>
                                <TextInput
                                    value={form.position_title}
                                    onChange={v => set('position_title', v)}
                                    placeholder="e.g. Administrative Officer II"
                                    error={errors.position_title}
                                />
                            </Field>
                            <Field label="Tier" error={errors.tier} required>
                                <div className="relative">
                                    <SelectInput
                                        value={form.tier}
                                        onChange={v => set('tier', v)}
                                        options={TIER_OPTIONS}
                                        placeholder="Select tier…"
                                        error={errors.tier}
                                    />
                                    {/* Inline tier badge preview — shown when a tier is selected */}
                                    {form.tier && (
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <TierPreviewBadge tier={form.tier} />
                                        </div>
                                    )}
                                </div>
                            </Field>
                            {/* Row 2: Item Number + Salary Grade */}
                            <Field label="Item Number" error={errors.item_number} required>
                                <TextInput
                                    value={form.item_number}
                                    onChange={v => set('item_number', v)}
                                    placeholder="e.g. OSEC-DILG-..."
                                    error={errors.item_number}
                                />
                            </Field>
                            <Field label="Salary Grade" error={errors.salary_grade} required>
                                <TextInput
                                    value={form.salary_grade}
                                    onChange={v => set('salary_grade', v)}
                                    placeholder="e.g. 15"
                                    error={errors.salary_grade}
                                />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* 2. Local Gov */}
                    <SectionCard number="2" title="For Local Government Position">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Governmental Unit" error={errors.gov_unit_type} required>
                                <SelectInput value={form.gov_unit_type} onChange={v => set('gov_unit_type', v)} options={['Province', 'City', 'Municipality']} placeholder="Select unit type…" error={errors.gov_unit_type} />
                            </Field>
                            <Field label="Class" error={errors.gov_unit_class} required>
                                <SelectInput value={form.gov_unit_class} onChange={v => set('gov_unit_class', v)} options={['1st Class', '2nd Class', '3rd Class', '4th Class', '5th Class', '6th Class', 'Special']} placeholder="Select class…" error={errors.gov_unit_class} />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* 3. Office */}
                    <SectionCard number="3" title="Office / Location">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Department / Agency" error={errors.department_agency} required>
                                <TextInput value={form.department_agency} onChange={v => set('department_agency', v)} placeholder="e.g. DILG" error={errors.department_agency} />
                            </Field>
                            <Field label="Bureau or Office" error={errors.bureau_office} required>
                                <TextInput value={form.bureau_office} onChange={v => set('bureau_office', v)} placeholder="e.g. Finance Division" error={errors.bureau_office} />
                            </Field>
                            <Field label="Department / Branch / Division" error={errors.department_branch_division} required>
                                <TextInput value={form.department_branch_division} onChange={v => set('department_branch_division', v)} placeholder="e.g. Budget Section" error={errors.department_branch_division} />
                            </Field>
                            <Field label="Workstation" error={errors.workstation} required>
                                <TextInput value={form.workstation} onChange={v => set('workstation', v)} placeholder="e.g. Main Office" error={errors.workstation} />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* 4. Compensation */}
                    <SectionCard number="4" title="Appropriation & Compensation">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Present Approp Act" error={errors.present_approp_act} required>
                                <TextInput value={form.present_approp_act} onChange={v => set('present_approp_act', v)} placeholder="e.g. GAA FY 2025" error={errors.present_approp_act} />
                            </Field>
                            <Field label="Previous Approp Act" error={errors.previous_approp_act} required>
                                <TextInput value={form.previous_approp_act} onChange={v => set('previous_approp_act', v)} placeholder="e.g. GAA FY 2024" error={errors.previous_approp_act} />
                            </Field>
                            <Field label="Salary Authorized" error={errors.salary_authorized} required>
                                <div className={`flex items-center border rounded-lg overflow-hidden ${errors.salary_authorized ? 'border-red-400' : 'border-gray-300'}`}>
                                    <span className="px-3 py-2 bg-gray-100 text-gray-500 text-sm font-medium border-r border-gray-300 select-none">PHP</span>
                                    <input type="text" value={form.salary_authorized} onChange={e => set('salary_authorized', e.target.value)} placeholder="35,000" className="flex-1 px-3 py-2 text-sm bg-white outline-none" />
                                </div>
                            </Field>
                            <Field label="Other Compensation" error={errors.other_compensation} required>
                                <TextInput value={form.other_compensation} onChange={v => set('other_compensation', v)} placeholder="e.g. PERA" error={errors.other_compensation} />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* 5. Supervision */}
                    <SectionCard number="5" title="Supervision">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Field label="Immediate Supervisor" error={errors.immediate_supervisor_title} required>
                                <TextInput value={form.immediate_supervisor_title} onChange={v => set('immediate_supervisor_title', v)} placeholder="Position Title" error={errors.immediate_supervisor_title} />
                            </Field>
                            <Field label="Higher Supervisor" error={errors.next_higher_supervisor_title} required>
                                <TextInput value={form.next_higher_supervisor_title} onChange={v => set('next_higher_supervisor_title', v)} placeholder="Position Title" error={errors.next_higher_supervisor_title} />
                            </Field>
                        </div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Directly Supervised Positions <span className="text-red-400">*</span></p>
                        <div className="space-y-3">
                            {form.supervised_positions.map((row, i) => (
                                <div key={i} className="flex flex-col md:flex-row gap-2 items-start bg-gray-50/40 md:bg-transparent p-3 md:p-0 rounded-xl border md:border-0 border-gray-100 relative">
                                    <div className="flex-1 w-full">
                                        <TextInput value={row.position_title} onChange={v => updateRow('supervised_positions', i, 'position_title', v)} placeholder="Position title" error={errors[`sup_pos_title_${i}`]} />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <TextInput value={row.item_number} onChange={v => updateRow('supervised_positions', i, 'item_number', v)} placeholder="Item number" error={errors[`sup_pos_item_${i}`]} />
                                    </div>
                                    {form.supervised_positions.length > 1 && (
                                        <div className="absolute -top-2 -right-2 md:relative md:top-0 md:right-0">
                                            <RemoveRowButton onClick={() => removeRow('supervised_positions', i)} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <AddRowButton label="Add position" onClick={() => addRow('supervised_positions', { position_title: '', item_number: '' })} />
                    </SectionCard>

                    {/* 6. Equipment */}
                    <SectionCard number="6" title="Machine, Equipment, Tools, Etc.">
                        <div className="space-y-2">
                            {form.equipment_tools.map((tool, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <div className="flex-1">
                                        <TextInput value={tool} onChange={v => {
                                            const u = [...form.equipment_tools]; u[i] = v; set('equipment_tools', u);
                                        }} placeholder="Equipment name" error={errors[`equipment_${i}`]} />
                                    </div>
                                    {form.equipment_tools.length > 1 && <RemoveRowButton onClick={() => removeRow('equipment_tools', i)} />}
                                </div>
                            ))}
                        </div>
                        <AddRowButton label="Add item" onClick={() => addRow('equipment_tools', '')} />
                    </SectionCard>

                    {/* 7. Contacts Internal */}
                    <SectionCard number="7" title="17a. Contacts — Internal">
                        <div className="border border-gray-200 rounded-xl overflow-x-auto">
                            <table className="w-full text-sm min-w-[400px]">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase">
                                        <th className="text-left px-3 py-2.5 border-r border-gray-200">Internal</th>
                                        <th className="text-center px-3 py-2.5 w-24 border-r border-gray-200">Occas.</th>
                                        <th className="text-center px-3 py-2.5 w-24">Freq.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <ContactRadioRow label="Executive / Managerial" rowKey="executive_managerial" section="contacts_internal" errKey="ci_executive_managerial" />
                                    <ContactRadioRow label="Supervisors" rowKey="supervisors" section="contacts_internal" errKey="ci_supervisors" />
                                    <ContactRadioRow label="Non-Supervisors" rowKey="non_supervisors" section="contacts_internal" errKey="ci_non_supervisors" />
                                    <ContactRadioRow label="Staff" rowKey="staff" section="contacts_internal" errKey="ci_staff" />
                                </tbody>
                            </table>
                        </div>
                    </SectionCard>

                    {/* 8. Contacts External */}
                    <SectionCard number="8" title="17b. Contacts — External">
                        <div className="border border-gray-200 rounded-xl overflow-x-auto">
                            <table className="w-full text-sm min-w-[400px]">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase">
                                        <th className="text-left px-3 py-2.5 border-r border-gray-200">External</th>
                                        <th className="text-center px-3 py-2.5 w-24 border-r border-gray-200">Occas.</th>
                                        <th className="text-center px-3 py-2.5 w-24">Freq.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <ContactRadioRow label="General Public" rowKey="general_public" section="contacts_external" errKey="ce_general_public" />
                                    <ContactRadioRow label="Other Agencies" rowKey="other_agencies" section="contacts_external" errKey="ce_other_agencies" />
                                    <tr>
                                        <td className="px-3 py-2.5 border-r border-gray-100">
                                            <TextInput value={form.contacts_external.others.text} onChange={v => setNested(['contacts_external', 'others', 'text'], v)} placeholder="Others (specify)" />
                                        </td>
                                        <td className="px-3 py-2.5 text-center text-gray-300">—</td>
                                        <td className="px-3 py-2.5 text-center text-gray-300">—</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </SectionCard>

                    {/* 9. Working Condition */}
                    <SectionCard number="9" title="18a. Working Condition">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <Field label="Type of Work" error={errors.working_condition_type} required>
                                    <SelectInput value={form.working_condition_type} onChange={v => set('working_condition_type', v)} options={['Office Work', 'Field Work', 'Others']} placeholder="Select type…" error={errors.working_condition_type} />
                                </Field>
                                {form.working_condition_type === 'Others' && (
                                    <div className="mt-3">
                                        <Field label="Specify" error={errors.working_condition_other} required>
                                            <TextInput value={form.working_condition_other} onChange={v => set('working_condition_other', v)} placeholder="Describe condition" />
                                        </Field>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-2">Frequency <span className="text-red-400">*</span></p>
                                <div className="flex gap-4 md:flex-col md:gap-2">
                                    {['Occasional', 'Frequent'].map(opt => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer bg-gray-50 md:bg-transparent px-3 py-2 md:p-0 rounded-lg flex-1 md:flex-none">
                                            <input type="radio" checked={form.working_condition_frequency === opt} onChange={() => set('working_condition_frequency', opt)} className="w-4 h-4 accent-[#1a5c3a]" />
                                            <span className="text-sm text-gray-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.working_condition_frequency && <p className="mt-1 text-xs text-red-500">{errors.working_condition_frequency}</p>}
                            </div>
                        </div>
                    </SectionCard>

                    {/* 10. Function Descriptions */}
                    <SectionCard number="10" title="Function Descriptions">
                        <div className="space-y-4">
                            <Field label="Unit Function Description" error={errors.unit_function_description} required>
                                <TextArea value={form.unit_function_description} onChange={v => set('unit_function_description', v)} placeholder="Brief description of section function…" error={errors.unit_function_description} rows={3} />
                            </Field>
                            <Field label="Position Function Description" error={errors.position_function_description} required>
                                <TextArea value={form.position_function_description} onChange={v => set('position_function_description', v)} placeholder="Job summary / general function…" error={errors.position_function_description} rows={3} />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* 11. Qualification Standards */}
                    <SectionCard number="11" title="Qualification Standards">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Field label="21a. Education" error={errors.edu_standard} required>
                                <TextInput value={form.edu_standard} onChange={v => set('edu_standard', v)} placeholder="Degree" error={errors.edu_standard} />
                            </Field>
                            <Field label="21b. Experience" error={errors.experience_standard} required>
                                <TextInput value={form.experience_standard} onChange={v => set('experience_standard', v)} placeholder="Years of experience" error={errors.experience_standard} />
                            </Field>
                            <Field label="21c. Training" error={errors.training_standard} required>
                                <TextInput value={form.training_standard} onChange={v => set('training_standard', v)} placeholder="Hours of training" error={errors.training_standard} />
                            </Field>
                            <Field label="21d. Eligibility" error={errors.eligibility_standard} required>
                                <TextInput value={form.eligibility_standard} onChange={v => set('eligibility_standard', v)} placeholder="CS Eligibility" error={errors.eligibility_standard} />
                            </Field>
                        </div>

                        {/* 21e. Core Competencies */}
                        <div className="mb-8">
                            <p className="text-xs font-semibold text-gray-600 mb-3">21e. Core Competencies <span className="text-red-400">*</span></p>

                            {/* Desktop View */}
                            <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden mb-2">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase">
                                        <tr>
                                            <th className="text-left px-4 py-2.5">Competency</th>
                                            <th className="text-left px-4 py-2.5 w-56">Level</th>
                                            <th className="w-10" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {form.core_competencies.map((row, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2">
                                                    <TextInput value={row.competency} onChange={v => updateRow('core_competencies', i, 'competency', v)} placeholder="Name" error={errors[`core_comp_${i}`]} />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <SelectInput value={row.level} onChange={v => updateRow('core_competencies', i, 'level', v)} options={COMPETENCY_LEVELS} error={errors[`core_level_${i}`]} />
                                                </td>
                                                <td className="px-2 py-2">
                                                    {form.core_competencies.length > 1 && <RemoveRowButton onClick={() => removeRow('core_competencies', i)} />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4">
                                {form.core_competencies.map((row, i) => (
                                    <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50/30 relative space-y-3">
                                        {form.core_competencies.length > 1 && (
                                            <div className="absolute top-2 right-2"><RemoveRowButton onClick={() => removeRow('core_competencies', i)} /></div>
                                        )}
                                        <Field label="Competency" error={errors[`core_comp_${i}`]} required>
                                            <TextInput value={row.competency} onChange={v => updateRow('core_competencies', i, 'competency', v)} placeholder="Competency name" error={errors[`core_comp_${i}`]} />
                                        </Field>
                                        <Field label="Level" error={errors[`core_level_${i}`]} required>
                                            <SelectInput value={row.level} onChange={v => updateRow('core_competencies', i, 'level', v)} options={COMPETENCY_LEVELS} error={errors[`core_level_${i}`]} />
                                        </Field>
                                    </div>
                                ))}
                            </div>
                            <AddRowButton label="Add core competency" onClick={() => addRow('core_competencies', { competency: '', level: '' })} />
                        </div>

                        {/* 21f. Leadership Competencies */}
                        <div className="mb-2">
                            <p className="text-xs font-semibold text-gray-600 mb-3">21f. Leadership Competencies <span className="text-red-400">*</span></p>

                            {/* Desktop View */}
                            <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden mb-2">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase">
                                        <tr>
                                            <th className="text-left px-4 py-2.5">Competency</th>
                                            <th className="text-left px-4 py-2.5 w-56">Level</th>
                                            <th className="w-10" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {form.leadership_competencies.map((row, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2">
                                                    <TextInput value={row.competency} onChange={v => updateRow('leadership_competencies', i, 'competency', v)} placeholder="Name" error={errors[`lead_comp_${i}`]} />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <SelectInput value={row.level} onChange={v => updateRow('leadership_competencies', i, 'level', v)} options={COMPETENCY_LEVELS} error={errors[`lead_level_${i}`]} />
                                                </td>
                                                <td className="px-2 py-2">
                                                    {form.leadership_competencies.length > 1 && <RemoveRowButton onClick={() => removeRow('leadership_competencies', i)} />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4">
                                {form.leadership_competencies.map((row, i) => (
                                    <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50/30 relative space-y-3">
                                        {form.leadership_competencies.length > 1 && (
                                            <div className="absolute top-2 right-2"><RemoveRowButton onClick={() => removeRow('leadership_competencies', i)} /></div>
                                        )}
                                        <Field label="Competency" error={errors[`lead_comp_${i}`]} required>
                                            <TextInput value={row.competency} onChange={v => updateRow('leadership_competencies', i, 'competency', v)} placeholder="Competency name" error={errors[`lead_comp_${i}`]} />
                                        </Field>
                                        <Field label="Level" error={errors[`lead_level_${i}`]} required>
                                            <SelectInput value={row.level} onChange={v => updateRow('leadership_competencies', i, 'level', v)} options={COMPETENCY_LEVELS} error={errors[`lead_level_${i}`]} />
                                        </Field>
                                    </div>
                                ))}
                            </div>
                            <AddRowButton label="Add leadership competency" onClick={() => addRow('leadership_competencies', { competency: '', level: '' })} />
                        </div>
                    </SectionCard>

                    {/* 12. Duties & Responsibilities */}
                    <SectionCard number="12" title="Statement of Duties and Responsibilities">
                        <p className="text-xs text-gray-500 mb-4">List technical competencies with working time percentage (Max 650 characters combined).</p>

                        {/* Desktop View */}
                        <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden mb-2">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase">
                                    <tr>
                                        <th className="text-left px-4 py-2.5 w-28">% Time</th>
                                        <th className="text-left px-4 py-2.5">Duties and Responsibilities</th>
                                        <th className="text-left px-4 py-2.5 w-52">Level</th>
                                        <th className="w-10" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(() => {
                                        const DUTY_POOL = 650;
                                        const totalUsed = form.duties_responsibilities.reduce((sum, r) => sum + (r.description?.length || 0), 0);
                                        const remaining = DUTY_POOL - totalUsed;

                                        return form.duties_responsibilities.map((row, i) => {
                                            const otherUsed = totalUsed - (row.description?.length || 0);
                                            const maxForRow = Math.max(0, DUTY_POOL - otherUsed);
                                            return (
                                                <tr key={i} className="align-top">
                                                    <td className="px-4 py-2">
                                                        <div className="relative">
                                                            <input type="text" value={row.percentage} onChange={e => updateRow('duties_responsibilities', i, 'percentage', e.target.value.replace(/[^0-9]/g, ''))} className={inputClass(errors[`duty_pct_${i}`]) + ' pr-6'} />
                                                            <span className="absolute right-2 top-2 text-gray-400">%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <TextArea value={row.description} onChange={v => updateRow('duties_responsibilities', i, 'description', v)} rows={3} maxLength={maxForRow} error={errors[`duty_desc_${i}`]} />
                                                        <div className="text-[10px] text-right text-gray-400 mt-1">{remaining} chars left</div>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <SelectInput value={row.competency_level} onChange={v => updateRow('duties_responsibilities', i, 'competency_level', v)} options={COMPETENCY_LEVELS} error={errors[`duty_comp_${i}`]} />
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        {form.duties_responsibilities.length > 1 && <RemoveRowButton onClick={() => removeRow('duties_responsibilities', i)} />}
                                                    </td>
                                                </tr>
                                            );
                                        });
                                    })()}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden space-y-6">
                            {(() => {
                                const DUTY_POOL = 650;
                                const totalUsed = form.duties_responsibilities.reduce((sum, r) => sum + (r.description?.length || 0), 0);
                                const remaining = DUTY_POOL - totalUsed;

                                return form.duties_responsibilities.map((row, i) => {
                                    const otherUsed = totalUsed - (row.description?.length || 0);
                                    const maxForRow = Math.max(0, DUTY_POOL - otherUsed);
                                    return (
                                        <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50/30 relative space-y-4">
                                            {form.duties_responsibilities.length > 1 && (
                                                <div className="absolute top-2 right-2"><RemoveRowButton onClick={() => removeRow('duties_responsibilities', i)} /></div>
                                            )}
                                            <div className="w-1/2">
                                                <Field label="% Time" error={errors[`duty_pct_${i}`]} required>
                                                    <div className="relative">
                                                        <TextInput value={row.percentage} onChange={v => updateRow('duties_responsibilities', i, 'percentage', v.replace(/[^0-9]/g, ''))} error={errors[`duty_pct_${i}`]} />
                                                        <span className="absolute right-3 top-2 text-gray-400 text-sm">%</span>
                                                    </div>
                                                </Field>
                                            </div>
                                            <Field label="Duties and Responsibilities" error={errors[`duty_desc_${i}`]} required>
                                                <TextArea value={row.description} onChange={v => updateRow('duties_responsibilities', i, 'description', v)} rows={4} maxLength={maxForRow} error={errors[`duty_desc_${i}`]} />
                                                <div className="text-[10px] text-right text-gray-400 mt-1 font-medium">{remaining} chars left in pool</div>
                                            </Field>
                                            <Field label="Competency Level" error={errors[`duty_comp_${i}`]} required>
                                                <SelectInput value={row.competency_level} onChange={v => updateRow('duties_responsibilities', i, 'competency_level', v)} options={COMPETENCY_LEVELS} error={errors[`duty_comp_${i}`]} />
                                            </Field>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                        <AddRowButton label="Add duty / responsibility" onClick={() => addRow('duties_responsibilities', { percentage: '', description: '', competency_level: '' })} />
                    </SectionCard>

                </div>
            </div>
        </div>
    );
}