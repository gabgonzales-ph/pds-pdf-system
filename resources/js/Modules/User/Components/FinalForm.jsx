// resources/js/Modules/User/Components/FinalForm.jsx

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Section } from './PDSShared';

/**
 * Helper to ensure dates are in YYYY-MM-DD format for HTML5 inputs.
 * This prevents the "does not conform to the required format" error.
 */
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // If it's a full ISO string, take only the date part
    return dateStr.split('T')[0];
};

const QUESTIONS = [
    {
        id: 'q34',
        groupLabel: 'Background & Relationship Questions',
        groupDetailField: {
            key: 'q34_details',
            label: 'If YES to any, provide details',
            type: 'textarea',
            placeholder: 'Name, position, and degree of relationship…',
        },
        parts: [
            {
                key: 'q34a', label: '34a.',
                text: 'Are you related within the third degree of consanguinity or affinity to the appointing or recommending authority, or to the chief of bureau or office, or to the person who has immediate supervision over you in the Office, Bureau or Department where you will be appointed?',
            },
            {
                key: 'q34b', label: '34b.',
                text: 'Are you related to the appointing or recommending authority, or to the chief of bureau or office, or to the person who has immediate supervision over you in the Office, Bureau or Department where you will be appointed, within the fourth degree (LGU Career Employees)?',
            },
        ],
    },
    {
        id: 'q35',
        parts: [
            {
                key: 'q35a', label: '35a.',
                text: 'Have you ever been found guilty of any administrative offense?',
                detailFields: [
                    { key: 'q35a_details', label: 'If YES, provide details (date/s, offense, penalty)', type: 'textarea',
                      placeholder: 'Date, nature of offense, penalty imposed…' },
                ],
            },
            {
                key: 'q35b', label: '35b.',
                text: 'Have you been criminally charged before any court?',
                detailFields: [
                    { key: 'q35b_date_filed',  label: 'Date Filed',       type: 'date',  colSpan: 'full', placeholder: '' },
                    { key: 'q35b_status',      label: 'Status of Case/s', type: 'text',  colSpan: 'full',
                      placeholder: 'e.g. Pending, Dismissed, Acquitted…' },
                ],
            },
        ],
    },
    {
        id: 'q36',
        parts: [
            {
                key: 'q36', label: '36.',
                text: 'Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?',
                detailFields: [
                    { key: 'q36_details', label: 'If YES, provide details', type: 'textarea',
                      placeholder: 'Crime/violation, court, date, penalty…' },
                ],
            },
        ],
    },
    {
        id: 'q37',
        parts: [
            {
                key: 'q37', label: '37.',
                text: 'Have you ever been separated from the service in any of the following modes: resignation, retirement, dropped from the rolls, dismissal, termination, end of term, finished contract or phased out (abolition) in the public or private sector?',
                detailFields: [
                    { key: 'q37_details', label: 'If YES, provide details', type: 'textarea',
                      placeholder: 'Mode of separation, date, employer/agency…' },
                ],
            },
        ],
    },
    {
        id: 'q38',
        groupLabel: 'Election & Residency Questions',
        parts: [
            {
                key: 'q38a', label: '38a.',
                text: 'Have you ever been a candidate in a national or local election held within the last year (except Barangay election)?',
                detailFields: [
                    { key: 'q38a_details', label: 'If YES, provide details', type: 'textarea',
                      placeholder: 'Position sought, election date, locality…' },
                ],
            },
            {
                key: 'q38b', label: '38b.',
                text: 'Have you resigned from the government service during the three (3)-month period before the last election to promote/actively campaign for a national or local candidate?',
                detailFields: [
                    { key: 'q38b_details', label: 'If YES, provide details', type: 'textarea',
                      placeholder: 'Date of resignation, candidate campaigned for…' },
                ],
            },
        ],
    },
    {
        id: 'q39',
        parts: [
            {
                key: 'q39', label: '39.',
                text: 'Have you acquired the status of an immigrant or permanent resident of another country?',
                detailFields: [
                    { key: 'q39_details', label: 'If YES, provide details (country)', type: 'text',
                      placeholder: 'Country and type of residency / immigration status…' },
                ],
            },
        ],
    },
    {
        id: 'q40',
        groupLabel: 'Statutory Identification (RA 8371, RA 7277, RA 11861)',
        parts: [
            {
                key: 'q40a', label: '40a.',
                text: "Pursuant to the Indigenous People's Act (RA 8371) — Are you a member of any indigenous group?",
                detailFields: [
                    { key: 'q40a_details', label: 'If YES, specify group', type: 'text',
                      placeholder: 'Name of indigenous group…' },
                ],
            },
            {
                key: 'q40b', label: '40b.',
                text: 'Pursuant to the Magna Carta for Disabled Persons (RA 7277) — Are you a person with disability?',
                detailFields: [
                    { key: 'q40b_details', label: 'If YES, specify ID Number', type: 'text',
                      placeholder: 'PWD ID Number…' },
                ],
            },
            {
                key: 'q40c', label: '40c.',
                text: "Pursuant to the Solo Parents' Welfare Act (RA 11861) — Are you a solo parent?",
                detailFields: [
                    { key: 'q40c_details', label: 'If YES, specify ID Number', type: 'text',
                      placeholder: 'Solo Parent ID Number…' },
                ],
            },
        ],
    },
];

const ALL_PARTS = QUESTIONS.flatMap(q => q.parts);

function buildInitialState(data) {
    const state = {};
    ALL_PARTS.forEach(p => {
        // Convert 1/0 from DB to true/false for component state
        const val = data?.[p.key];
        state[p.key] = (val === 1 || val === true) ? true : (val === 0 || val === false) ? false : null;

        (p.detailFields ?? []).forEach(f => {
            state[f.key] = f.type === 'date' 
                ? formatDate(data?.[f.key]) 
                : (data?.[f.key] ?? '');
        });
    });

    QUESTIONS.forEach(q => {
        if (q.groupDetailField) {
            state[q.groupDetailField.key] = data?.[q.groupDetailField.key] ?? '';
        }
    });

    state.gov_id_type         = data?.gov_id_type         ?? '';
    state.gov_id_number       = data?.gov_id_number       ?? '';
    state.gov_id_date_issued  = formatDate(data?.gov_id_date_issued);
    state.gov_id_place_issued = data?.gov_id_place_issued ?? '';
    
    for (let i = 1; i <= 3; i++) {
        state[`ref${i}_name`]    = data?.[`ref${i}_name`]    ?? '';
        state[`ref${i}_address`] = data?.[`ref${i}_address`] ?? '';
        state[`ref${i}_contact`] = data?.[`ref${i}_contact`] ?? '';
    }
    return state;
}

const inputCls = `w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5
    focus:outline-none focus:border-[#1a5c3a] focus:ring-1 focus:ring-[#1a5c3a]/20
    placeholder-gray-300 bg-white`;
const labelCls = 'block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1';

function YesNo({ value, onChange }) {
    // Standardize comparison to handle 1/true and 0/false correctly
    const isActive = (v) => {
        if (v === true) return value === true || value === 1;
        if (v === false) return value === false || value === 0;
        return false;
    };

    return (
        <div className="flex gap-2">
            {[true, false].map(v => (
                <button key={String(v)} type="button"
                    onClick={() => onChange(isActive(v) ? null : v)}
                    className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all duration-150 active:scale-95
                        ${isActive(v)
                            ? v
                                ? 'bg-[#1a5c3a] border-[#1a5c3a] text-white'
                                : 'bg-red-500 border-red-500 text-white'
                            : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                        }`}
                >
                    {v ? 'YES' : 'NO'}
                </button>
            ))}
        </div>
    );
}

function DetailField({ fieldDef, value, onChange }) {
    if (fieldDef.type === 'textarea') {
        return (
            <>
                <label className={labelCls}>{fieldDef.label}</label>
                <textarea rows={2} value={value} onChange={e => onChange(e.target.value.toUpperCase())}
                    placeholder={fieldDef.placeholder}
                    className={`${inputCls} resize-none`} />
            </>
        );
    }
    if (fieldDef.type === 'date') {
        return (
            <>
                <label className={labelCls}>{fieldDef.label}</label>
                <input type="date" className={inputCls} value={formatDate(value)}
                    onChange={e => onChange(e.target.value)} />
            </>
        );
    }
    return (
        <>
            <label className={labelCls}>{fieldDef.label}</label>
            <input type="text" className={inputCls} placeholder={fieldDef.placeholder}
                value={value} onChange={e => onChange(e.target.value.toUpperCase())} />
        </>
    );
}

function ReferencesTable({ form, set }) {
    return (
        <div className="space-y-3">
            <div className="flex items-start gap-3">
                <span className="text-[10px] font-black text-[#1a5c3a]/60 uppercase tracking-widest
                    flex-shrink-0 pt-0.5 min-w-[32px]">41.</span>
                <div>
                    <p className="text-xs text-gray-700 font-semibold">References</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                        Person not related by consanguinity or affinity to the applicant/appointee.
                    </p>
                </div>
            </div>

            <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100 ml-9">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            <th className="px-3 py-2.5 text-center w-8">#</th>
                            <th className="px-3 py-2.5 text-left w-[28%]">Name</th>
                            <th className="px-3 py-2.5 text-left w-[40%]">Office / Residential Address</th>
                            <th className="px-3 py-2.5 text-left">Contact No. and/or Email</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[1, 2, 3].map(i => (
                            <tr key={i}>
                                <td className="px-3 py-1.5 text-center text-gray-400 font-bold">{i}</td>
                                <td className="px-2 py-1.5">
                                    <input className={inputCls} placeholder="Full name"
                                        value={form[`ref${i}_name`]}
                                        onChange={e => set(`ref${i}_name`, e.target.value.toUpperCase())} />
                                </td>
                                <td className="px-2 py-1.5">
                                    <input className={inputCls} placeholder="Address"
                                        value={form[`ref${i}_address`]}
                                        onChange={e => set(`ref${i}_address`, e.target.value.toUpperCase())} />
                                </td>
                                <td className="px-2 py-1.5">
                                    <input className={inputCls} placeholder="Contact"
                                        value={form[`ref${i}_contact`]}
                                        onChange={e => set(`ref${i}_contact`, e.target.value.toUpperCase())} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden space-y-3 ml-9">
                {[1, 2, 3].map(i => (
                    <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-white">
                        <p className="text-[10px] font-black text-[#1a5c3a]/50 uppercase tracking-widest">
                            Reference {i}
                        </p>
                        <div>
                            <label className={labelCls}>Name</label>
                            <input className={inputCls} placeholder="Full name"
                                value={form[`ref${i}_name`]}
                                onChange={e => set(`ref${i}_name`, e.target.value.toUpperCase())} />
                        </div>
                        <div>
                            <label className={labelCls}>Office / Residential Address</label>
                            <input className={inputCls} placeholder="Address"
                                value={form[`ref${i}_address`]}
                                onChange={e => set(`ref${i}_address`, e.target.value.toUpperCase())} />
                        </div>
                        <div>
                            <label className={labelCls}>Contact No. and/or Email</label>
                            <input className={inputCls} placeholder="Contact"
                                value={form[`ref${i}_contact`]}
                                onChange={e => set(`ref${i}_contact`, e.target.value.toUpperCase())} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function FinalForm({ data = null }) {
    const [open, setOpen]     = useState(false);
    const [form, setForm]     = useState(() => buildInitialState(data));
    const [saving, setSaving] = useState(false);

    // 'date' or 'place' — only one issuance field is active at a time.
    // Seed from existing data: if place_issued has a value, default to 'place'.
    const [govIdMode, setGovIdMode] = useState(() =>
        data?.gov_id_place_issued ? 'place' : 'date'
    );

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    function handleGovIdModeChange(mode) {
        setGovIdMode(mode);
        // Clear the inactive field so stale data is not sent on save
        if (mode === 'date')  set('gov_id_place_issued', '');
        if (mode === 'place') set('gov_id_date_issued', '');
    }

    const answeredCount = ALL_PARTS.filter(p => form[p.key] !== null).length;
    const totalCount    = ALL_PARTS.length;
    const hasChanges    = JSON.stringify(form) !== JSON.stringify(buildInitialState(data));

    // --- Validation Logic ---
    const allQuestionsAnswered = answeredCount === totalCount;
    
    const allRefsFilled = [1, 2, 3].every(i =>
        form[`ref${i}_name`]?.trim() &&
        form[`ref${i}_address`]?.trim() &&
        form[`ref${i}_contact`]?.trim()
    );

    const govIdFilled = 
        form.gov_id_type?.trim() && 
        form.gov_id_number?.trim() && 
        (form.gov_id_date_issued || form.gov_id_place_issued?.trim());

    const isFormValid = allQuestionsAnswered && allRefsFilled && govIdFilled;
    // ------------------------

    function handleSave() {
        setSaving(true);
        router.patch(route('user.final-form.update'), form, {
            preserveScroll: true,
            only: ['pdsFinalForm', 'progress'],
            onSuccess: () => setSaving(false),
            onError:   () => setSaving(false),
        });
    }

    let lastGroupLabel = null;

    return (
        <Section
            title={`IX. Questions & References (${answeredCount}/${totalCount} answered)`}
            open={open}
            onToggle={() => setOpen(o => !o)}
        >
            <div className="px-5 py-4 md:px-6 md:py-5">
                {QUESTIONS.map((group, gi) => {
                    const showGroupLabel = group.groupLabel && group.groupLabel !== lastGroupLabel;
                    if (showGroupLabel) lastGroupLabel = group.groupLabel;

                    const anyPartYes = group.groupDetailField
                        ? group.parts.some(p => form[p.key] === true || form[p.key] === 1)
                        : false;

                    return (
                        <div key={group.id}
                            className={[
                                'space-y-4',
                                gi < QUESTIONS.length - 1 ? 'pb-4 border-b border-gray-50' : 'pb-4',
                                gi > 0 ? 'pt-4' : 'pt-0',
                            ].join(' ')}
                        >
                            {showGroupLabel && (
                                <p className="text-[10px] font-black text-[#1a5c3a]/50 uppercase tracking-widest">
                                    {group.groupLabel}
                                </p>
                            )}

                            {group.parts.map(part => (
                                <div key={part.key} className="space-y-2">
                                    <div className="flex items-start gap-3">
                                        <span className="text-[10px] font-black text-[#1a5c3a]/60 uppercase tracking-widest
                                            flex-shrink-0 pt-0.5 min-w-[32px]">
                                            {part.label}
                                        </span>
                                        <p className="text-xs text-gray-700 leading-relaxed flex-1">
                                            {part.text}
                                        </p>
                                    </div>

                                    <div className="pl-9">
                                        <YesNo
                                            value={form[part.key]}
                                            onChange={v => set(part.key, v)}
                                        />
                                    </div>

                                    {(form[part.key] === true || form[part.key] === 1) && !group.groupDetailField && part.detailFields?.length > 0 && (
                                        <div className="pl-9">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                                {part.detailFields.map(fieldDef => (
                                                    <div key={fieldDef.key}
                                                        className={
                                                            fieldDef.type === 'textarea' || fieldDef.colSpan === 'full'
                                                                ? 'sm:col-span-2'
                                                                : ''
                                                        }
                                                    >
                                                        <DetailField
                                                            fieldDef={fieldDef}
                                                            value={form[fieldDef.key]}
                                                            onChange={v => set(fieldDef.key, v)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {anyPartYes && group.groupDetailField && (
                                <div className="pl-9 pt-1">
                                    <DetailField
                                        fieldDef={group.groupDetailField}
                                        value={form[group.groupDetailField.key]}
                                        onChange={v => set(group.groupDetailField.key, v)}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}

                <div className="pt-4 pb-4 border-t border-gray-100">
                    <ReferencesTable form={form} set={set} />
                </div>

                <div className="pt-4 pb-4 border-t border-gray-100 space-y-3">
                    <div>
                        <p className="text-xs text-gray-700 font-semibold">Government Issued ID</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Valid government ID required for verification.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>Type of ID <span className="text-red-400">*</span></label>
                            <input type="text" className={inputCls} placeholder="e.g. Passport"
                                value={form.gov_id_type} onChange={e => set('gov_id_type', e.target.value.toUpperCase())} />
                        </div>
                        <div>
                            <label className={labelCls}>ID Number <span className="text-red-400">*</span></label>
                            <input type="text" className={inputCls} placeholder="ID number"
                                value={form.gov_id_number} onChange={e => set('gov_id_number', e.target.value.toUpperCase())} />
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                            <label className={labelCls}>
                                Issuance <span className="text-red-400">*</span>
                                <span className="ml-1.5 normal-case text-gray-300 font-normal tracking-normal">
                                    — choose one
                                </span>
                            </label>
                            {/* Pill toggle */}
                            <div className="flex gap-2">
                                {[
                                    { mode: 'date',  label: 'Date Issued'  },
                                    { mode: 'place', label: 'Place Issued' },
                                ].map(({ mode, label }) => (
                                    <button key={mode} type="button"
                                        onClick={() => handleGovIdModeChange(mode)}
                                        className={[
                                            'px-3 py-1 rounded-lg border text-xs font-bold',
                                            'transition-all duration-150 active:scale-95',
                                            govIdMode === mode
                                                ? 'bg-[#1a5c3a] border-[#1a5c3a] text-white shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300',
                                        ].join(' ')}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            {/* Active input */}
                            <div className="transition-all duration-150">
                                {govIdMode === 'date' ? (
                                    <input type="date" className={inputCls}
                                        value={formatDate(form.gov_id_date_issued)}
                                        onChange={e => set('gov_id_date_issued', e.target.value)} />
                                ) : (
                                    <input type="text" className={inputCls} placeholder="City / Office"
                                        value={form.gov_id_place_issued}
                                        onChange={e => set('gov_id_place_issued', e.target.value.toUpperCase())} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {hasChanges && (
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button onClick={handleSave} disabled={saving || !isFormValid}
                            className="px-4 py-1.5 bg-[#1a5c3a] text-white text-xs font-semibold rounded-lg hover:bg-[#14472e] disabled:opacity-50 disabled:cursor-not-allowed">
                            {saving ? 'Saving…' : 'Save Answers'}
                        </button>
                        <button onClick={() => setForm(buildInitialState(data))}
                            className="px-4 py-1.5 text-gray-500 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50">
                            Discard
                        </button>
                    </div>
                )}
            </div>
        </Section>
    );
}