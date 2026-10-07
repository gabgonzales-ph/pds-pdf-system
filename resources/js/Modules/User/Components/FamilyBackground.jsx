// resources/js/Modules/User/Components/FamilyBackground.jsx

import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    Section, SubLabel, Field, EditableField, SaveCancelButtons, Spinner, formatDate,
} from './PDSShared';

// ── Constants ─────────────────────────────────────────────────────────

const SPOUSE_REQUIRED_STATUSES = ['Married', 'Widowed', 'Separated'];
const SPOUSE_URL = '/user/family-background/spouse';

const SUFFIX_OPTIONS = ['N/A', 'JR.', 'SR.', 'II', 'III', 'IV', 'V'];

// ── Shared style ──────────────────────────────────────────────────────

const textInputClass =
    'flex-1 text-xs sm:text-sm font-medium text-gray-800 uppercase ' +
    'border-b border-[#1a5c3a] bg-transparent outline-none py-0.5 ' +
    'placeholder-gray-300 min-w-0';

// ── Suffix Dropdown Field ─────────────────────────────────────────────

function SuffixDropdownField({ label, fieldKey, value, url, requiredMark = false }) {
    const [editing,  setEditing]  = useState(false);
    const [selected, setSelected] = useState(value || 'N/A');
    const [saving,   setSaving]   = useState(false);
    const selectRef = useRef(null);

    useEffect(() => { if (editing) selectRef.current?.focus(); }, [editing]);

    function handleSave() {
        setSaving(true);
        router.patch(url, { [fieldKey]: selected === 'N/A' ? null : selected }, {
            preserveScroll: true,
            onSuccess: () => { setSaving(false); setEditing(false); },
            onError:   () => setSaving(false),
        });
    }

    function handleStartEdit() {
        setSelected(value || 'N/A');
        setEditing(true);
    }

    const isEmpty = !value || value === 'N/A';

    return (
        <div className="col-span-1 flex flex-col gap-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
                {label}{requiredMark && <span className="text-red-400 ml-0.5">*</span>}
            </span>
            {editing ? (
                <div className="flex items-center gap-1.5">
                    <select
                        ref={selectRef}
                        value={selected}
                        onChange={e => setSelected(e.target.value)}
                        disabled={saving}
                        className="flex-1 text-xs sm:text-sm font-medium text-gray-800
                            border-b border-[#1a5c3a] bg-transparent outline-none py-0.5
                            cursor-pointer min-w-0"
                    >
                        {SUFFIX_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <SaveCancelButtons
                        onSave={handleSave}
                        onCancel={() => { setEditing(false); setSelected(value || 'N/A'); }}
                        saving={saving}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2 group/ef">
                    <span className={`text-xs sm:text-sm font-medium leading-snug
                        ${isEmpty ? 'text-gray-300 italic' : 'text-gray-800'}`}>
                        {isEmpty ? 'N/A' : value}
                    </span>
                    <button
                        onClick={handleStartEdit}
                        className="opacity-0 group-hover/ef:opacity-100 transition-opacity text-gray-400 hover:text-[#1a5c3a]"
                        title="Edit"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Child Row ─────────────────────────────────────────────────────────

function ChildRow({ child, disabled }) {
    const [editing,  setEditing]  = useState(false);
    const [name,     setName]     = useState(child.name || '');
    const [dob,      setDob]      = useState(child.date_of_birth?.split('T')[0] || '');
    const [saving,   setSaving]   = useState(false);
    const [deleting, setDeleting] = useState(false);

    function handleSave() {
        if (!name.trim()) return;
        setSaving(true);
        router.patch(`/user/family-background/children/${child.id}`,
            { name: name.trim().toUpperCase(), date_of_birth: dob || null },
            {
                preserveScroll: true,
                onSuccess: () => { setSaving(false); setEditing(false); },
                onError:   () => setSaving(false),
            }
        );
    }

    return (
        <div className="flex items-center gap-2 group/child py-1.5 border-b border-gray-50 last:border-0">
            {editing ? (
                <>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value.toUpperCase())}
                        placeholder="FULL NAME"
                        className={textInputClass}
                    />
                    <input
                        type="date"
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        className="text-xs text-gray-600 border-b border-[#1a5c3a]
                            bg-transparent outline-none py-0.5 w-32 flex-shrink-0"
                    />
                    <SaveCancelButtons
                        onSave={handleSave}
                        onCancel={() => { setEditing(false); setName(child.name); setDob(child.date_of_birth?.split('T')[0] || ''); }}
                        saving={saving}
                    />
                </>
            ) : (
                <>
                    <span className="flex-1 text-xs sm:text-sm font-medium text-gray-800 truncate uppercase">
                        {child.name}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                        {child.date_of_birth ? formatDate(child.date_of_birth) : '—'}
                    </span>
                    {!disabled && (
                        <div className="flex items-center gap-1 opacity-0 group-hover/child:opacity-100 transition-opacity">
                            <button onClick={() => setEditing(true)}
                                className="text-gray-400 hover:text-[#1a5c3a] transition-colors" title="Edit">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => {
                                    setDeleting(true);
                                    router.delete(`/user/family-background/children/${child.id}`, {
                                        preserveScroll: true,
                                        onError: () => setDeleting(false),
                                    });
                                }}
                                disabled={deleting}
                                className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                {deleting ? <Spinner /> : (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ── Add Child Row ─────────────────────────────────────────────────────

function AddChildRow({ onAdded }) {
    const [name,   setName]   = useState('');
    const [dob,    setDob]    = useState('');
    const [saving, setSaving] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    function handleSave() {
        if (!name.trim()) { onAdded?.(); return; }
        setSaving(true);
        router.post('/user/family-background/children',
            { name: name.trim().toUpperCase(), date_of_birth: dob || null },
            {
                preserveScroll: true,
                onSuccess: () => { setSaving(false); onAdded?.(); },
                onError:   () => setSaving(false),
            }
        );
    }

    return (
        <div className="flex items-center gap-2 py-1.5 border-b border-gray-50">
            <input
                ref={inputRef}
                value={name}
                onChange={e => setName(e.target.value.toUpperCase())}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onAdded?.(); }}
                placeholder="CHILD'S FULL NAME"
                className={textInputClass}
            />
            <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="text-xs text-gray-600 border-b border-[#1a5c3a]
                    bg-transparent outline-none py-0.5 w-32 flex-shrink-0"
            />
            <SaveCancelButtons onSave={handleSave} onCancel={() => onAdded?.()} saving={saving} />
        </div>
    );
}

// ── Family Background Section ─────────────────────────────────────────

export default function FamilyBackgroundSection({ data, children: childrenList, civilStatus }) {
    const [open,        setOpen]        = useState(false);
    const [addingChild, setAddingChild] = useState(false);

    const spouseRequired  = SPOUSE_REQUIRED_STATUSES.includes(civilStatus);
    const hasSpouseData   = !!(data?.spouse_surname || data?.spouse_first_name);
    const childrenEnabled = spouseRequired || hasSpouseData;

    return (
        <Section title="II. Family Background" open={open} onToggle={() => setOpen(p => !p)}>
            <div className="px-5 pb-7 md:px-7 md:pb-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-6 pt-6">

                    {/* ── Spouse ── */}
                    <SubLabel>
                        Spouse's Name
                        {spouseRequired && <span className="ml-1 text-red-400 font-bold normal-case">— Required</span>}
                    </SubLabel>

                    {!spouseRequired ? (
                        <div className="col-span-full flex items-center gap-2 py-2 px-3
                            bg-amber-50 border border-amber-100 rounded-xl">
                            <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span className="text-xs text-amber-700 font-medium">
                                Edit Civil Status to add Spouse
                            </span>
                        </div>
                    ) : (
                        <>
                            <EditableField label="Last Name"      fieldKey="spouse_surname"     value={data?.spouse_surname}     url={SPOUSE_URL} requiredMark />
                            <EditableField label="First Name"     fieldKey="spouse_first_name"  value={data?.spouse_first_name}  url={SPOUSE_URL} requiredMark />
                            <EditableField label="Middle Name"    fieldKey="spouse_middle_name" value={data?.spouse_middle_name} url={SPOUSE_URL} />
                            <SuffixDropdownField
                                label="Name Extension"
                                fieldKey="spouse_suffix"
                                value={data?.spouse_suffix}
                                url={SPOUSE_URL}
                            />

                            <SubLabel>Spouse's Details</SubLabel>
                            <EditableField label="Date of Birth"            fieldKey="spouse_birthdate"        value={data?.spouse_birthdate ? data.spouse_birthdate.split('T')[0] : null} url={SPOUSE_URL} type="date" requiredMark />
                            <EditableField label="Occupation"               fieldKey="spouse_occupation"       value={data?.spouse_occupation}       url={SPOUSE_URL} span={2} />
                            <EditableField label="Employer / Business Name" fieldKey="spouse_employer"         value={data?.spouse_employer}         url={SPOUSE_URL} span={2} />
                            <EditableField label="Business Address"         fieldKey="spouse_business_address" value={data?.spouse_business_address} url={SPOUSE_URL} span={2} />
                            <EditableField label="Telephone No."            fieldKey="spouse_telephone"        value={data?.spouse_telephone}        url={SPOUSE_URL} />
                        </>
                    )}

                    {/* ── Children ── */}
                    <SubLabel>Children</SubLabel>
                    <div className="col-span-full">
                        {!childrenEnabled && (
                            <p className="text-xs text-gray-400 italic mb-2">
                                Add a spouse to enable children entries.
                            </p>
                        )}
                        <div className={`${!childrenEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                            {(childrenList?.length > 0 || addingChild) && (
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-[0.12em]">Name</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.12em] w-32 flex-shrink-0">Date of Birth</span>
                                    <span className="w-10" />
                                </div>
                            )}
                            {childrenList?.map(child => (
                                <ChildRow key={child.id} child={child} disabled={!childrenEnabled} />
                            ))}
                            {addingChild && (
                                <AddChildRow onAdded={() => setAddingChild(false)} />
                            )}
                            {!addingChild && (
                                <button
                                    onClick={() => setAddingChild(true)}
                                    className="mt-2 text-xs text-[#1a5c3a] font-medium hover:underline
                                        transition-colors flex items-center gap-1"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
                                    </svg>
                                    Add a child
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Father ── */}
                    <SubLabel>Father's Name</SubLabel>
                    <Field label="Last Name"      value={data?.father_surname} />
                    <Field label="First Name"     value={data?.father_first_name} />
                    <Field label="Middle Name"    value={data?.father_middle_name} />
                    <Field label="Name Extension" value={data?.father_suffix} />

                    {/* ── Mother ── */}
                    <SubLabel>Mother's Name</SubLabel>
                    <Field label="Last Name"      value={data?.mother_surname} />
                    <Field label="First Name"     value={data?.mother_first_name} />
                    <Field label="Middle Name"    value={data?.mother_middle_name} />
                    <Field label="Name Extension" value={data?.mother_suffix} />

                </div>
            </div>
        </Section>
    );
}