// resources/js/Modules/User/Components/OtherInformation.jsx

import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Section } from './PDSShared';

const MAX_PER_LIST = 7;
// Standard DB varchar limit to prevent SQL truncation errors
const MAX_STRING_LENGTH = 255; 

function ListEditor({ label, sublabel, items = [], onChange }) {
    const [draft, setDraft] = useState('');
    const atMax = items.length >= MAX_PER_LIST;

    function add() {
        const trimmed = draft.trim();
        if (!trimmed || atMax) return;
        
        // EDGE CASE FIX: Prevent exact duplicates
        if (items.includes(trimmed)) {
            setDraft(''); // Just clear it if they typed a duplicate
            return;
        }

        onChange([...items, trimmed]);
        setDraft('');
    }

    function remove(i) {
        onChange(items.filter((_, idx) => idx !== i));
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') { 
            e.preventDefault(); 
            add(); 
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
                    {sublabel && (
                        <p className="text-[10px] text-gray-300 mt-0.5">{sublabel}</p>
                    )}
                </div>
                <span className={`text-[10px] font-semibold flex-shrink-0 ${
                    atMax ? 'text-amber-500' : 'text-gray-300'
                }`}>
                    {items.length} / {MAX_PER_LIST}
                </span>
            </div>

            {items.length > 0 && (
                <div className="flex flex-col gap-1.5">
                    {items.map((item, i) => (
                        // Changed key to a combination of item+index to be safer if duplicates somehow bypass the check
                        <div key={`${item}-${i}`}
                            className="flex items-center justify-between gap-2 px-3 py-2
                                bg-white border border-gray-100 rounded-lg group">
                            <span className="text-xs text-gray-700 leading-snug break-all">{item}</span>
                            <button
                                type="button" // EDGE CASE FIX: Prevent accidental form submissions
                                onClick={() => remove(i)}
                                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                                title="Remove">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                        d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!atMax ? (
                <div className="flex gap-2">
                    <input
                        value={draft}
                        onChange={e => setDraft(e.target.value.toUpperCase())}
                        onKeyDown={handleKeyDown}
                        maxLength={MAX_STRING_LENGTH} // EDGE CASE FIX: Protect database limits
                        placeholder={`Type and press Enter or click Add…`}
                        className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5
                            focus:outline-none focus:border-[#1a5c3a] focus:ring-1 focus:ring-[#1a5c3a]/20
                            placeholder-gray-300 bg-white"
                    />
                    <button
                        type="button" // EDGE CASE FIX: Prevent accidental form submissions
                        onClick={add}
                        disabled={draft.trim() === ''}
                        className="px-3 py-1.5 bg-[#1a5c3a] text-white text-xs font-semibold rounded-lg
                            hover:bg-[#14472e] active:scale-95 transition-all duration-150 disabled:opacity-40">
                        Add
                    </button>
                </div>
            ) : (
                <p className="text-[10px] text-amber-500 font-semibold">Maximum of {MAX_PER_LIST} entries reached</p>
            )}
        </div>
    );
}

export default function OtherInformation({ data = null }) {
    const [open, setOpen]   = useState(false);
    const [saving, setSaving] = useState(false);

    const [skills,       setSkills]       = useState(data?.special_skills            ?? []);
    const [distinctions, setDistinctions] = useState(data?.non_academic_distinctions ?? []);
    const [memberships,  setMemberships]  = useState(data?.organization_memberships  ?? []);

    // EDGE CASE FIX: Sync local state when Inertia pushes new 'data' props from the server
    // This prevents the 'hasChanges' flag from getting stuck as true if the backend sanitizes data differently.
    useEffect(() => {
        setSkills(data?.special_skills ?? []);
        setDistinctions(data?.non_academic_distinctions ?? []);
        setMemberships(data?.organization_memberships ?? []);
    }, [data]);

    function handleSave() {
        setSaving(true);
        router.patch(route('user.other-information.update'), {
            special_skills:            skills,
            non_academic_distinctions: distinctions,
            organization_memberships:  memberships,
        }, {
            preserveScroll: true,
            only: ['otherInformation', 'progress'],
            onSuccess: () => setSaving(false),
            onError:   () => setSaving(false),
        });
    }

    const hasChanges =
        JSON.stringify(skills)       !== JSON.stringify(data?.special_skills            ?? []) ||
        JSON.stringify(distinctions) !== JSON.stringify(data?.non_academic_distinctions ?? []) ||
        JSON.stringify(memberships)  !== JSON.stringify(data?.organization_memberships  ?? []);

    return (
        <Section
            title="VIII. Other Information"
            open={open}
            onToggle={() => setOpen(o => !o)}
        >
            <div className="px-5 py-4 md:px-6 md:py-5 space-y-5">

                <ListEditor
                    label="Special Skills and Hobbies"
                    sublabel="Personal talents or recreational interests"
                    items={skills}
                    onChange={setSkills}
                />

                <div className="border-t border-gray-50" />

                <ListEditor
                    label="Non-Academic Distinctions / Recognition"
                    sublabel="e.g. Religious, Socio-Civic awards and honors — write in full"
                    items={distinctions}
                    onChange={setDistinctions}
                />

                <div className="border-t border-gray-50" />

                <ListEditor
                    label="Membership in Association / Organization"
                    sublabel="Full names of groups you belong to"
                    items={memberships}
                    onChange={setMemberships}
                />

                {hasChanges && (
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button 
                            type="button"
                            onClick={handleSave} 
                            disabled={saving}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1a5c3a] text-white text-xs font-semibold rounded-lg
                                hover:bg-[#14472e] active:scale-95 transition-all duration-150 disabled:opacity-50">
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSkills(data?.special_skills ?? []);
                                setDistinctions(data?.non_academic_distinctions ?? []);
                                setMemberships(data?.organization_memberships ?? []);
                            }}
                            className="px-4 py-1.5 text-gray-500 text-xs font-semibold border border-gray-200 rounded-lg
                                hover:bg-gray-50 active:scale-95 transition-all duration-150">
                            Discard
                        </button>
                    </div>
                )}
            </div>
        </Section>
    );
}