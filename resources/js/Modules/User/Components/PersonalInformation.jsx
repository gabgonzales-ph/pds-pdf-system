// resources/js/Modules/User/Components/PersonalInformation.jsx

import { useState, useRef, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import {
    Section, SubLabel, Field, SaveCancelButtons, formatDate, val,
} from './PDSShared';

// ── Constants ─────────────────────────────────────────────────────────

const CIVIL_STATUSES = ['Single', 'Married', 'Widowed', 'Separated', 'Other/s'];
const SUFFIX_OPTIONS = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];
const PSGC_BASE = 'https://psgc.gitlab.io/api';

// ── Generic Editable Field ───────────────────────────────────────────

function EditableField({ label, fieldKey, value, type = "text", placeholder = "Add info...", maxLength }) {
    const isEmpty = !val(value);
    const [editing, setEditing] = useState(false);
    const [inputVal, setInputVal] = useState(value || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    function handleSave() {
        let finalValue = inputVal.trim() === '' ? null : inputVal.trim();
        
        // Basic frontend validation for mobile
        if (fieldKey === 'mobile_no' && finalValue && finalValue.length !== 11) {
            setError("Must be exactly 11 digits");
            return;
        }

        setError(null);

        if (finalValue === (value || null)) {
            setEditing(false);
            return;
        }

        setSaving(true);
        router.patch('/user/personal-information', { [fieldKey]: finalValue }, {
            preserveScroll: true,
            onSuccess: () => { setSaving(false); setEditing(false); },
            onError: (err) => { 
                setSaving(false); 
                setError(err[fieldKey] || "An error occurred");
                if (!err[fieldKey]) setInputVal(value || ''); 
            },
        });
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') { setEditing(false); setInputVal(value || ''); setError(null); }
    }

    return (
        <div className="flex flex-col gap-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
                {label}
            </span>

            {editing ? (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <input
                            ref={inputRef}
                            type={type}
                            value={inputVal}
                            maxLength={maxLength}
                            onChange={e => {
                                // Strip non-digits for mobile
                                const val = fieldKey === 'mobile_no' ? e.target.value.replace(/\D/g, '') : e.target.value;
                                setInputVal(val);
                                setError(null);
                            }}
                            onKeyDown={handleKeyDown}
                            disabled={saving}
                            className={`flex-1 text-xs sm:text-sm font-medium text-gray-800
                                border-b bg-transparent outline-none py-0.5 placeholder-gray-300 min-w-0
                                ${error ? 'border-red-500' : 'border-[#1a5c3a]'}`}
                            placeholder={placeholder}
                        />
                        <SaveCancelButtons
                            onSave={handleSave}
                            onCancel={() => { setEditing(false); setInputVal(value || ''); setError(null); }}
                            saving={saving}
                        />
                    </div>
                    {error && <span className="text-[10px] text-red-500">{error}</span>}
                </div>
            ) : isEmpty ? (
                <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-[#1a5c3a] font-medium hover:underline text-left transition-colors w-fit"
                >
                    + Add
                </button>
            ) : (
                <div className="flex items-center gap-2 group/field">
                    <span className="text-xs sm:text-sm font-medium text-gray-800">{value}</span>
                    <button
                        onClick={() => { setEditing(true); setInputVal(value); }}
                        className="opacity-0 group-hover/field:opacity-100 transition-opacity text-gray-400 hover:text-[#1a5c3a]"
                        title={`Edit ${label}`}
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Dropdown Editable Field (Civil Status / Suffix) ──────────────────

function SelectEditableField({ label, fieldKey, value, options, placeholder = "Select..." }) {
    const [editing, setEditing] = useState(false);
    const [selected, setSelected] = useState(value || '');
    const [saving, setSaving] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => { if (editing) selectRef.current?.focus(); }, [editing]);

    function handleSave() {
        const finalValue = selected === '' ? null : selected;
        if (finalValue === (value || null)) {
            setEditing(false);
            return;
        }

        setSaving(true);
        router.patch('/user/personal-information', { [fieldKey]: finalValue }, {
            preserveScroll: true,
            onSuccess: () => { setSaving(false); setEditing(false); },
            onError: () => setSaving(false),
        });
    }

    return (
        <div className="flex flex-col gap-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
                {label}
            </span>
            {editing ? (
                <div className="flex items-center gap-1.5">
                    <select
                        ref={selectRef}
                        value={selected}
                        onChange={e => setSelected(e.target.value)}
                        disabled={saving}
                        className="flex-1 text-xs sm:text-sm font-medium text-gray-800 border-b border-[#1a5c3a] bg-transparent outline-none py-0.5 cursor-pointer"
                    >
                        <option value="">{placeholder}</option>
                        {options.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <SaveCancelButtons
                        onSave={handleSave}
                        onCancel={() => { setEditing(false); setSelected(value || ''); }}
                        saving={saving}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2 group/select">
                    <span className={`text-xs sm:text-sm font-medium leading-snug ${!value ? 'text-gray-300 italic' : 'text-gray-800'}`}>
                        {value || 'Not provided'}
                    </span>
                    <button
                        onClick={() => { setEditing(true); setSelected(value || ''); }}
                        className="opacity-0 group-hover/select:opacity-100 transition-opacity text-gray-400 hover:text-[#1a5c3a]"
                        title={`Edit ${label}`}
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Inline Address Editor Panel ────────────────────────────────────────

function AddressEditor({ data, onCancel, onSuccess }) {
    const { data: form, setData, patch, processing, errors } = useForm({
        house_block_lot_no: data?.house_block_lot_no?.toUpperCase() || '',
        street: data?.street?.toUpperCase() || '',
        subdivision_village: data?.subdivision_village?.toUpperCase() || '',
        region: data?.region?.toUpperCase() || '',
        province: data?.province?.toUpperCase() || '',
        city_municipality: data?.city_municipality?.toUpperCase() || '',
        barangay: data?.barangay?.toUpperCase() || '',
        zip_code: data?.zip_code?.toUpperCase() || '',
        
        perm_house_block_lot_no: data?.perm_house_block_lot_no?.toUpperCase() || '',
        perm_street: data?.perm_street?.toUpperCase() || '',
        perm_subdivision_village: data?.perm_subdivision_village?.toUpperCase() || '',
        perm_region: data?.perm_region?.toUpperCase() || '',
        perm_province: data?.perm_province?.toUpperCase() || '',
        perm_city: data?.perm_city?.toUpperCase() || '', 
        perm_barangay: data?.perm_barangay?.toUpperCase() || '',
        perm_zip_code: data?.perm_zip_code?.toUpperCase() || '',
    });

    const [codes, setCodes] = useState({
        region: '', province: '', city: '', barangay: '',
        perm_region: '', perm_province: '', perm_city: '', perm_barangay: ''
    });

    const [opts, setOpts] = useState({
        regions: [], provinces: [], cities: [], barangays: [],
        perm_provinces: [], perm_cities: [], perm_barangays: []
    });

    const [showCopyMessage, setShowCopyMessage] = useState(false);

    // Initial Load & Reverse Match for Regions
    useEffect(() => {
        fetch(`${PSGC_BASE}/regions/`)
            .then(r => r.json())
            .then(res => {
                const sorted = res.map(x => ({ ...x, name: x.name.toUpperCase() })).sort((a,b) => a.name.localeCompare(b.name));
                setOpts(p => ({ ...p, regions: sorted }));
                
                if (data?.region) {
                    const match = sorted.find(x => x.name === data.region.toUpperCase());
                    if (match) setCodes(c => ({ ...c, region: match.code }));
                }
                if (data?.perm_region) {
                    const match = sorted.find(x => x.name === data.perm_region.toUpperCase());
                    if (match) setCodes(c => ({ ...c, perm_region: match.code }));
                }
            });
    }, [data]);

    // Residential Cascade
    useEffect(() => {
        if (!codes.region) { setOpts(p => ({ ...p, provinces: [], cities: [], barangays: [] })); return; }
        fetch(`${PSGC_BASE}/regions/${codes.region}/provinces/`).then(r => r.json()).then(res => {
            const sorted = res.map(x => ({ ...x, name: x.name.toUpperCase() })).sort((a,b) => a.name.localeCompare(b.name));
            setOpts(p => ({ ...p, provinces: sorted }));
            if (data?.province) {
                const match = sorted.find(x => x.name === data.province.toUpperCase());
                if (match) setCodes(c => ({ ...c, province: match.code }));
            }
        });
    }, [codes.region, data?.province]);

    useEffect(() => {
        if (!codes.province) { setOpts(p => ({ ...p, cities: [], barangays: [] })); return; }
        fetch(`${PSGC_BASE}/provinces/${codes.province}/cities-municipalities/`).then(r => r.json()).then(res => {
            const sorted = res.map(x => ({ ...x, name: x.name.toUpperCase() })).sort((a,b) => a.name.localeCompare(b.name));
            setOpts(p => ({ ...p, cities: sorted }));
            if (data?.city_municipality) {
                const match = sorted.find(x => x.name === data.city_municipality.toUpperCase());
                if (match) setCodes(c => ({ ...c, city: match.code }));
            }
        });
    }, [codes.province, data?.city_municipality]);

    useEffect(() => {
        if (!codes.city) { setOpts(p => ({ ...p, barangays: [] })); return; }
        fetch(`${PSGC_BASE}/cities-municipalities/${codes.city}/barangays/`).then(r => r.json()).then(res => {
            const sorted = res.map(x => ({ ...x, name: x.name.toUpperCase() })).sort((a,b) => a.name.localeCompare(b.name));
            setOpts(p => ({ ...p, barangays: sorted }));
        });
    }, [codes.city]);

    // Permanent Cascade
    useEffect(() => {
        if (!codes.perm_region) { setOpts(p => ({ ...p, perm_provinces: [], perm_cities: [], perm_barangays: [] })); return; }
        fetch(`${PSGC_BASE}/regions/${codes.perm_region}/provinces/`).then(r => r.json()).then(res => {
            const sorted = res.map(x => ({ ...x, name: x.name.toUpperCase() })).sort((a,b) => a.name.localeCompare(b.name));
            setOpts(p => ({ ...p, perm_provinces: sorted }));
            if (data?.perm_province) {
                const match = sorted.find(x => x.name === data.perm_province.toUpperCase());
                if (match) setCodes(c => ({ ...c, perm_province: match.code }));
            }
        });
    }, [codes.perm_region, data?.perm_province]);

    useEffect(() => {
        if (!codes.perm_province) { setOpts(p => ({ ...p, perm_cities: [], perm_barangays: [] })); return; }
        fetch(`${PSGC_BASE}/provinces/${codes.perm_province}/cities-municipalities/`).then(r => r.json()).then(res => {
            const sorted = res.map(x => ({ ...x, name: x.name.toUpperCase() })).sort((a,b) => a.name.localeCompare(b.name));
            setOpts(p => ({ ...p, perm_cities: sorted }));
            if (data?.perm_city) {
                const match = sorted.find(x => x.name === data.perm_city.toUpperCase());
                if (match) setCodes(c => ({ ...c, perm_city: match.code }));
            }
        });
    }, [codes.perm_province, data?.perm_city]);

    useEffect(() => {
        if (!codes.perm_city) { setOpts(p => ({ ...p, perm_barangays: [] })); return; }
        fetch(`${PSGC_BASE}/cities-municipalities/${codes.perm_city}/barangays/`).then(r => r.json()).then(res => {
            const sorted = res.map(x => ({ ...x, name: x.name.toUpperCase() })).sort((a,b) => a.name.localeCompare(b.name));
            setOpts(p => ({ ...p, perm_barangays: sorted }));
        });
    }, [codes.perm_city]);

    function copyResidentialToPermanent() {
        setData(prev => ({
            ...prev,
            perm_house_block_lot_no:  prev.house_block_lot_no,
            perm_street:              prev.street,
            perm_subdivision_village: prev.subdivision_village,
            perm_region:              prev.region,
            perm_province:            prev.province,
            perm_city:                prev.city_municipality,
            perm_barangay:            prev.barangay,
            perm_zip_code:            prev.zip_code,
        }));
        setCodes(c => ({
            ...c,
            perm_region: c.region,
            perm_province: c.province,
            perm_city: c.city,
            perm_barangay: c.barangay,
        }));
        
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2500);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        patch('/user/personal-information', {
            preserveScroll: true,
            onSuccess: () => onSuccess(),
        });
    };

    const inputClass = (err) => `w-full px-3 py-2 border rounded-md text-sm uppercase focus:outline-none focus:ring-1 focus:ring-[#1a5c3a] transition-colors ${err ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`;
    const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

    return (
        <form onSubmit={handleSubmit} className="col-span-2 sm:col-span-4 bg-gray-50/50 p-5 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4 relative">
            <h4 className="text-sm font-bold text-[#1a5c3a] mb-4">Edit Residential Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="md:col-span-1"><label className={labelClass}>House/Block/Lot No.</label><input type="text" value={form.house_block_lot_no} onChange={e => setData('house_block_lot_no', e.target.value.toUpperCase())} className={inputClass(errors.house_block_lot_no)} placeholder="OPTIONAL" /></div>
                <div className="md:col-span-1"><label className={labelClass}>Street</label><input type="text" value={form.street} onChange={e => setData('street', e.target.value.toUpperCase())} className={inputClass(errors.street)} placeholder="OPTIONAL" /></div>
                <div className="md:col-span-2"><label className={labelClass}>Subdivision / Village</label><input type="text" value={form.subdivision_village} onChange={e => setData('subdivision_village', e.target.value.toUpperCase())} className={inputClass(errors.subdivision_village)} placeholder="OPTIONAL" /></div>
                
                <div>
                    <label className={labelClass}>Region <span className="text-red-500">*</span></label>
                    <select value={codes.region} onChange={e => {
                        const val = e.target.value;
                        const name = opts.regions.find(r => r.code === val)?.name || '';
                        setCodes(c => ({ ...c, region: val, province: '', city: '', barangay: '' }));
                        setData(d => ({ ...d, region: name, province: '', city_municipality: '', barangay: '' }));
                    }} className={inputClass(errors.region)}>
                        <option value="">SELECT REGION</option>
                        {opts.regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Province <span className="text-red-500">*</span></label>
                    <select disabled={!codes.region} value={codes.province} onChange={e => {
                        const val = e.target.value;
                        const name = opts.provinces.find(p => p.code === val)?.name || '';
                        setCodes(c => ({ ...c, province: val, city: '', barangay: '' }));
                        setData(d => ({ ...d, province: name, city_municipality: '', barangay: '' }));
                    }} className={inputClass(errors.province)}>
                        <option value="">SELECT PROVINCE</option>
                        {opts.provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>City/Municipality <span className="text-red-500">*</span></label>
                    <select disabled={!codes.province} value={codes.city} onChange={e => {
                        const val = e.target.value;
                        const name = opts.cities.find(c => c.code === val)?.name || '';
                        setCodes(c => ({ ...c, city: val, barangay: '' }));
                        setData(d => ({ ...d, city_municipality: name, barangay: '' }));
                    }} className={inputClass(errors.city_municipality)}>
                        <option value="">SELECT CITY</option>
                        {opts.cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Barangay <span className="text-red-500">*</span></label>
                    <select disabled={!codes.city} value={opts.barangays.find(b => b.name === form.barangay)?.code || ''} onChange={e => {
                        const val = e.target.value;
                        const name = opts.barangays.find(b => b.code === val)?.name || '';
                        setData('barangay', name);
                    }} className={inputClass(errors.barangay)}>
                        <option value="">SELECT BARANGAY</option>
                        {opts.barangays.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                    </select>
                </div>
                <div><label className={labelClass}>Zip Code</label><input type="text" value={form.zip_code} onChange={e => setData('zip_code', e.target.value.toUpperCase())} className={inputClass(errors.zip_code)} maxLength={4} /></div>
            </div>

            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <h4 className="text-sm font-bold text-[#1a5c3a]">Edit Permanent Address</h4>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={copyResidentialToPermanent} className="flex items-center gap-1.5 text-xs font-semibold text-[#1a5c3a] bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors border border-green-200">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Same as Residential
                    </button>
                    <span className={`text-xs font-medium text-green-600 transition-opacity duration-300 ${showCopyMessage ? 'opacity-100' : 'opacity-0'}`}>Copied!</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-1"><label className={labelClass}>House/Block/Lot No.</label><input type="text" value={form.perm_house_block_lot_no} onChange={e => setData('perm_house_block_lot_no', e.target.value.toUpperCase())} className={inputClass(errors.perm_house_block_lot_no)} placeholder="OPTIONAL" /></div>
                <div className="md:col-span-1"><label className={labelClass}>Street</label><input type="text" value={form.perm_street} onChange={e => setData('perm_street', e.target.value.toUpperCase())} className={inputClass(errors.perm_street)} placeholder="OPTIONAL" /></div>
                <div className="md:col-span-2"><label className={labelClass}>Subdivision / Village</label><input type="text" value={form.perm_subdivision_village} onChange={e => setData('perm_subdivision_village', e.target.value.toUpperCase())} className={inputClass(errors.perm_subdivision_village)} placeholder="OPTIONAL" /></div>
                
                <div>
                    <label className={labelClass}>Region <span className="text-red-500">*</span></label>
                    <select value={codes.perm_region} onChange={e => {
                        const val = e.target.value;
                        const name = opts.regions.find(r => r.code === val)?.name || '';
                        setCodes(c => ({ ...c, perm_region: val, perm_province: '', perm_city: '', perm_barangay: '' }));
                        setData(d => ({ ...d, perm_region: name, perm_province: '', perm_city: '', perm_barangay: '' }));
                    }} className={inputClass(errors.perm_region)}>
                        <option value="">SELECT REGION</option>
                        {opts.regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Province <span className="text-red-500">*</span></label>
                    <select disabled={!codes.perm_region} value={codes.perm_province} onChange={e => {
                        const val = e.target.value;
                        const name = opts.perm_provinces.find(p => p.code === val)?.name || '';
                        setCodes(c => ({ ...c, perm_province: val, perm_city: '', perm_barangay: '' }));
                        setData(d => ({ ...d, perm_province: name, perm_city: '', perm_barangay: '' }));
                    }} className={inputClass(errors.perm_province)}>
                        <option value="">SELECT PROVINCE</option>
                        {opts.perm_provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>City/Municipality <span className="text-red-500">*</span></label>
                    <select disabled={!codes.perm_province} value={codes.perm_city} onChange={e => {
                        const val = e.target.value;
                        const name = opts.perm_cities.find(c => c.code === val)?.name || '';
                        setCodes(c => ({ ...c, perm_city: val, perm_barangay: '' }));
                        setData(d => ({ ...d, perm_city: name, perm_barangay: '' }));
                    }} className={inputClass(errors.perm_city)}>
                        <option value="">SELECT CITY</option>
                        {opts.perm_cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Barangay <span className="text-red-500">*</span></label>
                    <select disabled={!codes.perm_city} value={opts.perm_barangays.find(b => b.name === form.perm_barangay)?.code || ''} onChange={e => {
                        const val = e.target.value;
                        const name = opts.perm_barangays.find(b => b.code === val)?.name || '';
                        setData('perm_barangay', name);
                    }} className={inputClass(errors.perm_barangay)}>
                        <option value="">SELECT BARANGAY</option>
                        {opts.perm_barangays.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                    </select>
                </div>
                <div><label className={labelClass}>Zip Code</label><input type="text" value={form.perm_zip_code} onChange={e => setData('perm_zip_code', e.target.value.toUpperCase())} className={inputClass(errors.perm_zip_code)} maxLength={4} /></div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button type="button" onClick={onCancel} disabled={processing} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={processing} className="px-5 py-2 text-sm font-bold text-white bg-[#1a5c3a] hover:bg-[#14472e] rounded-lg shadow-md transition-colors disabled:opacity-50">Save Addresses</button>
            </div>
        </form>
    );
}

// ── Personal Information Section ──────────────────────────────────────

export default function PersonalInformationSection({ data, auth }) {
    const [open, setOpen] = useState(true);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    return (
        <Section
            title="I. Personal Information"
            open={open}
            onToggle={() => setOpen(p => !p)}
        >
            <div className="px-5 pb-7 md:px-7 md:pb-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-6 pt-6 relative">

                    {/* ── Name ── */}
                    <SubLabel>Full Name</SubLabel>
                    <Field label="Last Name"      value={data?.last_name} />
                    <Field label="First Name"     value={data?.first_name} />
                    <EditableField label="Middle Name" fieldKey="middle_name" value={data?.middle_name} />
                    <SelectEditableField 
                        label="Name Extension" 
                        fieldKey="suffix" 
                        value={data?.suffix} 
                        options={SUFFIX_OPTIONS} 
                        placeholder="Select suffix..."
                    />

                    {/* ── Birth & Personal ── */}
                    <SubLabel>Personal Details</SubLabel>
                    <Field label="Date of Birth"  value={formatDate(data?.date_of_birth)} />
                    <Field label="Place of Birth" value={data?.birth_place} />
                    <Field label="Sex at Birth"   value={data?.sex} />
                    <SelectEditableField 
                        label="Civil Status" 
                        fieldKey="civil_status" 
                        value={data?.civil_status} 
                        options={CIVIL_STATUSES} 
                    />
                    <Field label="Citizenship"    value={data?.citizenship} span={2} />
                    <Field label="Blood Type"     value={data?.blood_type} />

                    {/* ── Address Section Toggle Header ── */}
                    <div className="col-span-2 sm:col-span-4 flex items-center justify-between mt-4">
                        <SubLabel className="!mt-0">Address Information</SubLabel>
                        {!isEditingAddress && (
                            <button 
                                onClick={() => setIsEditingAddress(true)}
                                className="text-xs font-bold text-[#1a5c3a] hover:text-[#14472e] hover:underline flex items-center gap-1 transition-all"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                Update Addresses
                            </button>
                        )}
                    </div>

                    {isEditingAddress ? (
                        <AddressEditor 
                            data={data} 
                            onCancel={() => setIsEditingAddress(false)} 
                            onSuccess={() => setIsEditingAddress(false)} 
                        />
                    ) : (
                        <>
                            {/* Read-Only Residential Address */}
                            <div className="col-span-2 sm:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4 pt-2">
                                <span className="col-span-2 md:col-span-4 text-[11px] font-bold text-gray-500 uppercase">Residential Address</span>
                                {/* Row 1: House | Street | Subdivision (span 2) */}
                                <Field label="House/Block/Lot No."   value={data?.house_block_lot_no} />
                                <Field label="Street"                value={data?.street} />
                                <Field label="Subdivision / Village" value={data?.subdivision_village} span={2} />
                                {/* Row 2: Barangay | City | Province | Zip Code */}
                                <Field label="Barangay"              value={data?.barangay} />
                                <Field label="City / Municipality"   value={data?.city_municipality} />
                                <Field label="Province"              value={data?.province} />
                                <Field label="Zip Code"              value={data?.zip_code} />
                                {/* Row 3: Region (full width on mobile, single col on desktop) */}
                                <Field label="Region"                value={data?.region} />
                            </div>

                            {/* Read-Only Permanent Address */}
                            <div className="col-span-2 sm:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4 pt-4">
                                <span className="col-span-2 md:col-span-4 text-[11px] font-bold text-gray-500 uppercase">Permanent Address</span>
                                {/* Row 1: House | Street | Subdivision (span 2) */}
                                <Field label="House/Block/Lot No."   value={data?.perm_house_block_lot_no} />
                                <Field label="Street"                value={data?.perm_street} />
                                <Field label="Subdivision / Village" value={data?.perm_subdivision_village} span={2} />
                                {/* Row 2: Barangay | City | Province | Zip Code */}
                                <Field label="Barangay"              value={data?.perm_barangay} />
                                <Field label="City / Municipality"   value={data?.perm_city} />
                                <Field label="Province"              value={data?.perm_province} />
                                <Field label="Zip Code"              value={data?.perm_zip_code} />
                                {/* Row 3: Region */}
                                <Field label="Region"                value={data?.perm_region} />
                            </div>
                        </>
                    )}

                    {/* ── Physical & Contact ── */}
                    <SubLabel className="mt-4">Physical & Contact Information</SubLabel>
                    <EditableField label="Height (cm)" fieldKey="height_cm" type="number" value={data?.height_cm} />
                    <EditableField label="Weight (kg)" fieldKey="weight_kg" type="number" value={data?.weight_kg} />
                    <div className="hidden sm:block" /> {/* spacer */}
                    <div className="hidden sm:block" /> {/* spacer */}
                    
                    <EditableField label="Mobile No." fieldKey="mobile_no" value={data?.mobile_no} maxLength={11} placeholder="09XXXXXXXXX" />
                    <EditableField label="Telephone No." fieldKey="telephone_no" value={data?.telephone_no} />
                    <div className="hidden sm:block col-span-2" /> {/* spacer to push email to the next line */}
                   
                    <div className="col-span-2 sm:col-span-2">
                        <EditableField label="Email Address" fieldKey="email" type="email" value={auth?.user?.email} placeholder="name@company.com" />
                    </div>
                    <div className="hidden sm:block" /> {/* spacer */}
                    <div className="col-span-2 sm:col-span-2">
                        <Field label="Employee ID" value={auth?.user?.employee_id} />
                    </div>
                    
                    {/* ── Government IDs ── */}
                    <SubLabel>Government-Issued IDs</SubLabel>
                    <EditableField label="UMID ID No."       fieldKey="umid_no"       value={data?.umid_no} />
                    <EditableField label="PAG-IBIG ID No."   fieldKey="pagibig_no"    value={data?.pagibig_no} />
                    <EditableField label="PhilHealth No."     fieldKey="philhealth_no" value={data?.philhealth_no} />
                    <EditableField label="PhilSys No. (PSN)" fieldKey="philsys_no"    value={data?.philsys_no} />
                    <EditableField label="TIN No."           fieldKey="tin_no"        value={data?.tin_no} />

                </div>
            </div>
        </Section>
    );
}