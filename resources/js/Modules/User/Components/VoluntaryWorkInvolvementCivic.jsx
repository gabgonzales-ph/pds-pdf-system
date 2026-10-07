// resources/js/Modules/User/Components/VoluntaryWorkInvolvementCivic.jsx

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Section } from './PDSShared';

const MAX_ROWS = 7;

const EMPTY_FORM = {
    org_name_address: '',
    date_from:        '',
    date_to:          '',
    hours:            '',
    position:         '',
};

function fmtDate(dateStr) {
    if (!dateStr) return '—';
    try {
        const d    = new Date(dateStr);
        const dd   = String(d.getDate()).padStart(2, '0');
        const mm   = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    } catch {
        return dateStr;
    }
}

const inputCls = `w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5
    focus:outline-none focus:border-[#1a5c3a] focus:ring-1 focus:ring-[#1a5c3a]/20
    placeholder-gray-300 bg-white`;

const labelCls = 'block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1';

function RowForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
    const [form, setForm] = useState({ ...initial });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const canSave = form.org_name_address.trim() !== '';

    return (
        <div className="bg-[#f7faf8] border border-[#1a5c3a]/10 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                    <label className={labelCls}>
                        Name & Address of Organization
                        <span className="text-red-400 ml-0.5">*</span>
                        <span className="ml-1 normal-case font-normal text-gray-300">(must be written in full)</span>
                    </label>
                    <textarea
                        rows={2}
                        className={`${inputCls} resize-none`}
                        placeholder="E.G. PHILIPPINE RED CROSS — LOS BAÑOS CHAPTER"
                        value={form.org_name_address}
                        onChange={e => set('org_name_address', e.target.value.toUpperCase())}
                    />
                </div>
                <div>
                    <label className={labelCls}>From (Inclusive Date)</label>
                    <input type="date" className={inputCls} value={form.date_from} onChange={e => set('date_from', e.target.value)} />
                </div>
                <div>
                    <label className={labelCls}>To (Inclusive Date)</label>
                    <input type="date" className={inputCls} value={form.date_to} onChange={e => set('date_to', e.target.value)} />
                </div>
                <div>
                    <label className={labelCls}>Number of Hours</label>
                    <input type="number" min="0" className={inputCls} placeholder="0" value={form.hours} onChange={e => set('hours', e.target.value)} />
                </div>
                <div>
                    <label className={labelCls}>Position / Nature of Work</label>
                    <input className={inputCls} placeholder="E.G. VOLUNTEER" value={form.position} onChange={e => set('position', e.target.value.toUpperCase())} />
                </div>
            </div>

            <div className="flex gap-2 pt-1">
                <button onClick={() => onSave(form)} disabled={saving || !canSave} className="px-4 py-1.5 bg-[#1a5c3a] text-white text-xs font-semibold rounded-lg hover:bg-[#14472e] active:scale-95 transition-all duration-150 disabled:opacity-40">
                    {saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={onCancel} className="px-4 py-1.5 text-gray-500 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-all duration-150">
                    Cancel
                </button>
            </div>
        </div>
    );
}

function toInit(row) {
    return {
        org_name_address: row.org_name_address ?? '',
        date_from:        row.date_from        ?? '',
        date_to:          row.date_to          ?? '',
        hours:            row.hours            ?? '',
        position:         row.position         ?? '',
    };
}

const EditIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
);
const DeleteIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
);

export default function VoluntaryWorkInvolvementCivic({ data = [] }) {
    const [open, setOpen]           = useState(false);
    const [adding, setAdding]       = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving]       = useState(false);
    const [removing, setRemoving]   = useState(null);

    const naRecord = data.find(r => r.org_name_address === 'N/A');
    const isNA = !!naRecord;
    const validData = data.filter(r => r.org_name_address !== 'N/A');

    const atMax = validData.length >= MAX_ROWS;
    const isEmpty = validData.length === 0;

    function handleAdd(form) {
        setSaving(true);
        router.post(route('user.voluntary-work.store'), form, {
            preserveScroll: true,
            only: ['voluntaryWorks', 'progress'],
            onSuccess: () => { setSaving(false); setAdding(false); },
            onError:   () => setSaving(false),
        });
    }

    function handleSetNA() {
        setSaving(true);
        router.post(route('user.voluntary-work.store'), { ...EMPTY_FORM, org_name_address: 'N/A' }, {
            preserveScroll: true,
            only: ['voluntaryWorks', 'progress'],
            onSuccess: () => setSaving(false),
            onError: () => setSaving(false),
        });
    }

    function handleUpdate(id, form) {
        setSaving(true);
        router.patch(route('user.voluntary-work.update', { voluntaryWork: id }), form, {
            preserveScroll: true,
            only: ['voluntaryWorks', 'progress'],
            onSuccess: () => { setSaving(false); setEditingId(null); },
            onError:   () => setSaving(false),
        });
    }

    function handleDelete(id) {
        setRemoving(id);
        router.delete(route('user.voluntary-work.destroy', { voluntaryWork: id }), {
            preserveScroll: true,
            only: ['voluntaryWorks', 'progress'],
            onFinish: () => setRemoving(null),
        });
    }

    return (
        <Section title="VI. Voluntary Work or Involvement in Civic Organizations" open={open} onToggle={() => setOpen(o => !o)}>
            <div className="px-5 py-4 md:px-6 md:py-5 space-y-4">

                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-400">{validData.length} / {MAX_ROWS} entries</p>
                    {atMax && <span className="text-[10px] text-amber-500 font-semibold">Maximum entries reached</span>}
                </div>

                {isNA ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95 duration-300">
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-sm mb-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-700">Not Applicable</p>
                            <p className="text-xs text-gray-500 mt-1">You have indicated no voluntary work or involvement.</p>
                        </div>
                        <button
                            onClick={() => handleDelete(naRecord.id)}
                            disabled={removing === naRecord.id}
                            className="mt-2 text-xs font-semibold text-gray-500 hover:text-gray-700 px-4 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all duration-150 shadow-sm"
                        >
                            {removing === naRecord.id ? 'Clearing...' : 'Clear & Add Voluntary Work'}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                        <th className="px-3 py-2.5 text-left w-[35%]">Name & Address of Organization<span className="text-red-400 ml-0.5">*</span></th>
                                        <th className="px-3 py-2.5 text-left whitespace-nowrap">From</th>
                                        <th className="px-3 py-2.5 text-left whitespace-nowrap">To</th>
                                        <th className="px-3 py-2.5 text-left whitespace-nowrap">No. of Hours</th>
                                        <th className="px-3 py-2.5 text-left">Position / Nature of Work</th>
                                        <th className="px-3 py-2.5 w-10" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isEmpty && !adding && (
                                        <tr>
                                            <td colSpan={6} className="px-3 py-8 text-center text-gray-300 italic text-xs">No voluntary work records yet</td>
                                        </tr>
                                    )}
                                    {validData.map((row, i) => (
                                        editingId === row.id ? (
                                            <tr key={row.id}>
                                                <td colSpan={6} className="px-3 py-3">
                                                    <RowForm initial={toInit(row)} onSave={form => handleUpdate(row.id, form)} onCancel={() => setEditingId(null)} saving={saving} />
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={row.id} className="hover:bg-gray-50/60 group animate-in fade-in slide-in-from-bottom-1" style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'forwards' }}>
                                                <td className="px-3 py-2.5 font-medium text-gray-800 leading-snug">{row.org_name_address || '—'}</td>
                                                <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{fmtDate(row.date_from)}</td>
                                                <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{fmtDate(row.date_to)}</td>
                                                <td className="px-3 py-2.5 text-gray-600">{row.hours ?? '—'}</td>
                                                <td className="px-3 py-2.5 text-gray-600">{row.position || '—'}</td>
                                                <td className="px-3 py-2.5">
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => setEditingId(row.id)} className="text-gray-400 hover:text-[#1a5c3a] transition-colors"><EditIcon /></button>
                                                        <button onClick={() => handleDelete(row.id)} disabled={removing === row.id} className="text-gray-400 hover:text-red-400 transition-colors"><DeleteIcon /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    ))}
                                    {adding && (
                                        <tr>
                                            <td colSpan={6} className="px-3 py-3">
                                                <RowForm onSave={handleAdd} onCancel={() => setAdding(false)} saving={saving} />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-3">
                            {isEmpty && !adding && (
                                <p className="text-center text-gray-300 italic text-xs py-6">No voluntary work records yet</p>
                            )}
                            {validData.map(row => (
                                editingId === row.id ? (
                                    <RowForm key={row.id} initial={toInit(row)} onSave={form => handleUpdate(row.id, form)} onCancel={() => setEditingId(null)} saving={saving} />
                                ) : (
                                    <div key={row.id} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-white">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-semibold text-gray-800 leading-snug flex-1">{row.org_name_address || '—'}</p>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={() => setEditingId(row.id)} className="text-gray-400 hover:text-[#1a5c3a] transition-colors"><EditIcon /></button>
                                                <button onClick={() => handleDelete(row.id)} disabled={removing === row.id} className="text-gray-400 hover:text-red-400 transition-colors"><DeleteIcon /></button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500">
                                            <span>From: <strong className="text-gray-700">{fmtDate(row.date_from)}</strong></span>
                                            <span>To: <strong className="text-gray-700">{fmtDate(row.date_to)}</strong></span>
                                            <span>Hours: <strong className="text-gray-700">{row.hours ?? '—'}</strong></span>
                                            <span>Position: <strong className="text-gray-700">{row.position || '—'}</strong></span>
                                        </div>
                                    </div>
                                )
                            ))}
                            {adding && <RowForm onSave={handleAdd} onCancel={() => setAdding(false)} saving={saving} />}
                        </div>

                        {!adding && editingId === null && !atMax && (
                            <div className="flex flex-wrap items-center gap-4 pt-1">
                                <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-xs font-semibold text-[#1a5c3a] hover:text-[#14472e] transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
                                    Add Voluntary Work
                                </button>
                                {isEmpty && (
                                    <button onClick={handleSetNA} disabled={saving} className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                                        No Voluntary Work
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Section>
    );
}