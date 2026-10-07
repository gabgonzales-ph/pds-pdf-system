// resources/js/Modules/User/Components/PDSShared.jsx
// Shared utilities and UI primitives used across all PDS section components.

import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

// ── Helpers ───────────────────────────────────────────────────────────

export function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function val(v) {
    return v || null;
}

// ── Section Wrapper ───────────────────────────────────────────────────
// `open` and `onToggle` are accepted but intentionally ignored —
// collapsing is no longer used; sections are shown/hidden by the sidebar.

export function Section({ title, open: _open, onToggle: _onToggle, accent = '#1a5c3a', children }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {children}
        </div>
    );
}

// ── Sub-section Label ─────────────────────────────────────────────────

export function SubLabel({ children }) {
    return (
        <div className="col-span-full flex items-center gap-2 mt-2 mb-1">
            <span className="text-[9px] sm:text-[10px] font-black text-[#1a5c3a]/60
                uppercase tracking-[0.15em]">
                {children}
            </span>
            <div className="flex-1 h-px bg-[#1a5c3a]/10" />
        </div>
    );
}

// ── Spinner ───────────────────────────────────────────────────────────

export function Spinner() {
    return (
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
    );
}

// ── Save / Cancel Buttons ─────────────────────────────────────────────

export function SaveCancelButtons({ onSave, onCancel, saving }) {
    return (
        <>
            <button onClick={onSave} disabled={saving}
                className="text-[#1a5c3a] hover:text-[#14472e] transition-colors flex-shrink-0" title="Save">
                {saving ? <Spinner /> : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                )}
            </button>
            <button onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0" title="Cancel">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </>
    );
}

// ── Read-only Field ───────────────────────────────────────────────────

export function Field({ label, value, span = 1 }) {
    const isEmpty = !val(value);
    const colSpan = span === 2 ? 'col-span-2' : span === 3 ? 'col-span-3' : 'col-span-1';

    return (
        <div className={`${colSpan} flex flex-col gap-1`}>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
                {label}
            </span>
            <span className={`text-xs sm:text-sm leading-snug font-medium
                ${isEmpty ? 'text-gray-300 italic' : 'text-gray-800'}`}>
                {isEmpty ? 'N/A' : value}
            </span>
        </div>
    );
}

// ── Inline Editable Field ─────────────────────────────────────────────

export function EditableField({ label, fieldKey, value, url, span = 1, type = 'text', placeholder, requiredMark = false }) {
    const isEmpty   = !val(value);
    const colSpan   = span === 2 ? 'col-span-2' : 'col-span-1';
    const isDateType = type === 'date';

    const [editing,  setEditing]  = useState(false);
    const [inputVal, setInputVal] = useState(value || '');
    const [saving,   setSaving]   = useState(false);
    const inputRef = useRef(null);

    useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

    function normalize(raw) {
        return isDateType ? raw : raw.toUpperCase();
    }

    function handleChange(e) {
        setInputVal(normalize(e.target.value));
    }

    function handleSave() {
        setSaving(true);
        const payload = inputVal ? normalize(inputVal) : null;
        router.patch(url, { [fieldKey]: payload }, {
            preserveScroll: true,
            onSuccess: () => { setSaving(false); setEditing(false); },
            onError:   () => setSaving(false),
        });
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter')  handleSave();
        if (e.key === 'Escape') { setEditing(false); setInputVal(value || ''); }
    }

    function handleStartEdit() {
        // Normalise existing value when opening edit mode so saved
        // lowercase data also renders uppercase in the input immediately.
        setInputVal(isDateType ? (value || '') : (value || '').toUpperCase());
        setEditing(true);
    }

    return (
        <div className={`${colSpan} flex flex-col gap-1`}>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
                {label}{requiredMark && <span className="text-red-400 ml-0.5">*</span>}
            </span>
            {editing ? (
                <div className="flex items-center gap-1.5">
                    <input
                        ref={inputRef}
                        type={type}
                        value={inputVal}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        disabled={saving}
                        placeholder={isDateType ? undefined : (placeholder || label).toUpperCase()}
                        className="flex-1 text-xs sm:text-sm font-medium text-gray-800
                            border-b border-[#1a5c3a] bg-transparent outline-none py-0.5
                            placeholder-gray-300 min-w-0"
                    />
                    <SaveCancelButtons
                        onSave={handleSave}
                        onCancel={() => { setEditing(false); setInputVal(value || ''); }}
                        saving={saving}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2 group/ef">
                    <span className={`text-xs sm:text-sm font-medium leading-snug
                        ${isEmpty ? 'text-gray-300 italic' : 'text-gray-800'}`}>
                        {isEmpty ? 'Not provided' : (isDateType ? formatDate(value) : value)}
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