// resources/js/Modules/Auth/Components/Registration/StepPersonalInfo.jsx

import { useState, useEffect } from 'react';
import CustomSelect from './CustomSelect';

const PSGC_BASE = 'https://psgc.cloud/api';
const SUFFIX_OPTIONS = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];

// Helper to fix mojibake encoding issues from the PSGC API
const fixText = (text) => {
    if (!text) return text;
    return text.replace(/Ã±/g, 'ñ').replace(/Ã‘/g, 'Ñ');
};

const inputClass = (err) =>
    `w-full px-4 py-2.5 md:py-3 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2
    focus:ring-[#1a5c3a]/40 focus:border-[#1a5c3a] transition-colors
    ${err ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`;

const selectClass = (err) =>
    `w-full px-4 py-2.5 md:py-3 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2
    focus:ring-[#1a5c3a]/40 focus:border-[#1a5c3a] transition-colors
    ${err ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`;

// fieldName drives data-field so Registration.jsx can scroll to it on error
function Field({ label, error, required, className = '', fieldName, children }) {
    return (
        <div className={className} data-field={fieldName}>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs md:text-sm text-red-500">{error}</p>}
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <h3 className="text-sm md:text-base font-bold text-[#1a5c3a] uppercase tracking-wide
            border-b border-[#1a5c3a]/20 pb-2 mb-4 mt-6 first:mt-0">
            {children}
        </h3>
    );
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const civilStatuses = ['Single', 'Married', 'Widowed', 'Separated', 'Other/s'];

export default function StepPersonalInfo({ data, setData, errors }) {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [permProvinces, setPermProvinces] = useState([]);
    const [permCities, setPermCities] = useState([]);
    const [permBarangays, setPermBarangays] = useState([]);

    const [loadingPsgc, setLoadingPsgc] = useState({});
    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);

    // New state for copy animation
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    useEffect(() => {
        setLoadingCountries(true);
        fetch('https://restcountries.com/v3.1/all?fields=name')
            .then(r => r.json())
            .then(d => {
                const sorted = d
                    .map(c => c.name.common)
                    .filter(n => n !== 'Philippines')
                    .sort((a, b) => a.localeCompare(b));
                setCountries(sorted);
            })
            .catch(() => {})
            .finally(() => setLoadingCountries(false));
    }, []);

    useEffect(() => {
        fetch(`${PSGC_BASE}/regions/`)
            .then(r => r.json())
            .then(d => {
                const fixed = d.map(x => ({ ...x, name: fixText(x.name) }));
                setRegions(fixed.sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!data.region_code) { setProvinces([]); setCities([]); setBarangays([]); return; }
        setLoadingPsgc(p => ({ ...p, province: true }));
        fetch(`${PSGC_BASE}/regions/${data.region_code}/provinces/`)
            .then(r => r.json())
            .then(d => {
                const fixed = d.map(x => ({ ...x, name: fixText(x.name) }));
                setProvinces(fixed.sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(() => setProvinces([]))
            .finally(() => setLoadingPsgc(p => ({ ...p, province: false })));
    }, [data.region_code]);

    useEffect(() => {
        if (!data.province_code) { setCities([]); setBarangays([]); return; }
        setLoadingPsgc(p => ({ ...p, city: true }));
        fetch(`${PSGC_BASE}/provinces/${data.province_code}/cities-municipalities/`)
            .then(r => r.json())
            .then(d => {
                const fixed = d.map(x => ({ ...x, name: fixText(x.name) }));
                setCities(fixed.sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(() => setCities([]))
            .finally(() => setLoadingPsgc(p => ({ ...p, city: false })));
    }, [data.province_code]);

    useEffect(() => {
        if (!data.city_code) { setBarangays([]); return; }
        setLoadingPsgc(p => ({ ...p, barangay: true }));
        fetch(`${PSGC_BASE}/cities-municipalities/${data.city_code}/barangays/`)
            .then(r => r.json())
            .then(d => {
                const fixed = d.map(x => ({ ...x, name: fixText(x.name) }));
                setBarangays(fixed.sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(() => setBarangays([]))
            .finally(() => setLoadingPsgc(p => ({ ...p, barangay: false })));
    }, [data.city_code]);

    // ── Residential zip code autofill ────────────────────────────────────────
    useEffect(() => {
        if (!data.city_code) {
            setData(prev => ({ ...prev, zip_code: '' }));
            return;
        }
        setLoadingPsgc(p => ({ ...p, zip: true }));
        fetch(`${PSGC_BASE}/cities-municipalities/${data.city_code}`)
            .then(r => r.json())
            .then(d => {
                setData(prev => ({ ...prev, zip_code: d.zip_code ?? '' }));
            })
            .catch(() => {})
            .finally(() => setLoadingPsgc(p => ({ ...p, zip: false })));
    }, [data.city_code]);

    useEffect(() => {
        if (!data.perm_region_code) { setPermProvinces([]); setPermCities([]); setPermBarangays([]); return; }
        fetch(`${PSGC_BASE}/regions/${data.perm_region_code}/provinces/`)
            .then(r => r.json())
            .then(d => {
                const fixed = d.map(x => ({ ...x, name: fixText(x.name) }));
                setPermProvinces(fixed.sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(() => setPermProvinces([]));
    }, [data.perm_region_code]);

    useEffect(() => {
        if (!data.perm_province_code) { setPermCities([]); setPermBarangays([]); return; }
        fetch(`${PSGC_BASE}/provinces/${data.perm_province_code}/cities-municipalities/`)
            .then(r => r.json())
            .then(d => {
                const fixed = d.map(x => ({ ...x, name: fixText(x.name) }));
                setPermCities(fixed.sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(() => setPermCities([]));
    }, [data.perm_province_code]);

    useEffect(() => {
        if (!data.perm_city_code) { setPermBarangays([]); return; }
        fetch(`${PSGC_BASE}/cities-municipalities/${data.perm_city_code}/barangays/`)
            .then(r => r.json())
            .then(d => {
                const fixed = d.map(x => ({ ...x, name: fixText(x.name) }));
                setPermBarangays(fixed.sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(() => setPermBarangays([]));
    }, [data.perm_city_code]);

    // ── Permanent zip code autofill ──────────────────────────────────────────
    useEffect(() => {
        if (!data.perm_city_code) {
            setData(prev => ({ ...prev, perm_zip_code: '' }));
            return;
        }
        setLoadingPsgc(p => ({ ...p, perm_zip: true }));
        fetch(`${PSGC_BASE}/cities-municipalities/${data.perm_city_code}`)
            .then(r => r.json())
            .then(d => {
                setData(prev => ({ ...prev, perm_zip_code: d.zip_code ?? '' }));
            })
            .catch(() => {})
            .finally(() => setLoadingPsgc(p => ({ ...p, perm_zip: false })));
    }, [data.perm_city_code]);

    function copyResidentialToPermanent() {
        setData(prev => ({
            ...prev,
            perm_house_block_lot_no:  prev.house_block_lot_no,
            perm_street:              prev.street,
            perm_subdivision_village: prev.subdivision_village,
            perm_region:              prev.region,
            perm_region_code:         prev.region_code,
            perm_province:            prev.province,
            perm_province_code:       prev.province_code,
            perm_city:                prev.city_municipality,
            perm_city_code:           prev.city_code,
            perm_barangay:            prev.barangay,
            perm_barangay_code:       prev.barangay_code,
            perm_zip_code:            prev.zip_code,
        }));
        setPermProvinces(provinces);
        setPermCities(cities);
        setPermBarangays(barangays);

        // Trigger the success message animation
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2500);
    }

    const isDualCitizen = data.citizenship === 'Dual Citizen';

    const regionOptions       = regions.map(r => ({ value: r.code, label: r.name }));
    const provinceOptions     = provinces.map(p => ({ value: p.code, label: p.name }));
    const cityOptions         = cities.map(c => ({ value: c.code, label: c.name }));
    const barangayOptions     = barangays.map(b => ({ value: b.code, label: b.name }));
    const permProvinceOptions = permProvinces.map(p => ({ value: p.code, label: p.name }));
    const permCityOptions     = permCities.map(c => ({ value: c.code, label: c.name }));
    const permBarangayOptions = permBarangays.map(b => ({ value: b.code, label: b.name }));
    const countryOptions      = countries.map(c => ({ value: c, label: c }));
    const bloodTypeOptions    = bloodTypes.map(bt => ({ value: bt, label: bt }));
    const suffixOptions       = [{ value: '', label: 'None' }, ...SUFFIX_OPTIONS.map(s => ({ value: s, label: s }))];

    return (
        <div>
            <SectionTitle>Personal Information</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Last Name" error={errors.last_name} required fieldName="last_name">
                    <input type="text" value={data.last_name || ''}
                        onChange={e => setData('last_name', e.target.value.toUpperCase())}
                        className={inputClass(errors.last_name)} placeholder="Last name" />
                </Field>
                <Field label="First Name" error={errors.first_name} required fieldName="first_name">
                    <input type="text" value={data.first_name || ''}
                        onChange={e => setData('first_name', e.target.value.toUpperCase())}
                        className={inputClass(errors.first_name)} placeholder="First name" />
                </Field>
                <Field label="Middle Name" error={errors.middle_name} fieldName="middle_name">
                    <input type="text" value={data.middle_name || ''}
                        onChange={e => setData('middle_name', e.target.value.toUpperCase())}
                        className={inputClass(errors.middle_name)} placeholder="Middle name (optional)" />
                </Field>

                <Field label="Name Extension (Suffix)" error={errors.suffix} fieldName="suffix">
                    <CustomSelect
                        value={data.suffix || ''}
                        onChange={val => setData('suffix', val)}
                        options={suffixOptions}
                        placeholder="None"
                        error={!!errors.suffix}
                    />
                </Field>

                <Field label="Date of Birth" error={errors.date_of_birth} required fieldName="date_of_birth">
                    <input type="date" value={data.date_of_birth || ''}
                        onChange={e => setData('date_of_birth', e.target.value)}
                        className={inputClass(errors.date_of_birth)}
                        max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().split('T')[0]; })()} />
                </Field>
                <Field label="Birth Place" error={errors.birth_place} required fieldName="birth_place">
                    <input type="text" value={data.birth_place || ''}
                        onChange={e => setData('birth_place', e.target.value.toUpperCase())}
                        className={inputClass(errors.birth_place)} placeholder="City/Municipality, Province" />
                </Field>
            </div>

            <Field label="Sex" error={errors.sex} required fieldName="sex" className="mt-4">
                <div className="flex gap-6 mt-1">
                    {['Male', 'Female'].map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                            <input type="radio" name="sex" value={option}
                                checked={data.sex === option}
                                onChange={() => setData('sex', option)}
                                className="w-4 h-4 accent-[#1a5c3a]" />
                            <span className="text-sm md:text-base text-gray-700">{option}</span>
                        </label>
                    ))}
                </div>
            </Field>

            <Field label="Civil Status" error={errors.civil_status} required fieldName="civil_status" className="mt-4">
                <div className="flex flex-wrap gap-2 md:gap-4 mt-1">
                    {civilStatuses.map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                            <input type="radio" name="civil_status" value={option}
                                checked={data.civil_status === option}
                                onChange={() => setData('civil_status', option)}
                                className="w-4 h-4 accent-[#1a5c3a]" />
                            <span className="text-sm md:text-base text-gray-700">{option}</span>
                        </label>
                    ))}
                </div>
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Field label="Blood Type" error={errors.blood_type} required fieldName="blood_type">
                    <CustomSelect
                        value={data.blood_type || ''}
                        onChange={val => setData('blood_type', val)}
                        options={bloodTypeOptions}
                        placeholder="Select Blood Type"
                        error={!!errors.blood_type}
                    />
                </Field>
                <Field label="Height (cm)" error={errors.height_cm} fieldName="height_cm">
                    <input type="number" min="0" step="0.01" value={data.height_cm || ''}
                        onChange={e => setData('height_cm', e.target.value)}
                        className={inputClass(errors.height_cm)} placeholder="e.g. 165.50" />
                </Field>
                <Field label="Weight (kg)" error={errors.weight_kg} fieldName="weight_kg">
                    <input type="number" min="0" step="0.01" value={data.weight_kg || ''}
                        onChange={e => setData('weight_kg', e.target.value)}
                        className={inputClass(errors.weight_kg)} placeholder="e.g. 60.00" />
                </Field>
                <Field label="Mobile No." error={errors.mobile_no} required fieldName="mobile_no">
                    <input type="text" inputMode="numeric" value={data.mobile_no || ''}
                        onChange={e => setData('mobile_no', e.target.value.replace(/\D/g, ''))}
                        className={inputClass(errors.mobile_no)} placeholder="09XXXXXXXXX" maxLength={11} />
                </Field>
                <Field label="Telephone No." error={errors.telephone_no} fieldName="telephone_no">
                    <input type="text" value={data.telephone_no || ''}
                        onChange={e => setData('telephone_no', e.target.value)}
                        className={inputClass(errors.telephone_no)} placeholder="Optional" />
                </Field>
            </div>

            <Field label="Citizenship" error={errors.citizenship} required fieldName="citizenship" className="mt-4">
                <div className="space-y-3 mt-1">
                    <div className="flex gap-6">
                        {['Filipino', 'Dual Citizen'].map(option => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                                <input type="radio" name="citizenship" value={option}
                                    checked={data.citizenship === option}
                                    onChange={() => {
                                        setData('citizenship', option);
                                        if (option === 'Filipino') {
                                            setData('citizenship_by', '');
                                            setData('citizenship_country', '');
                                        }
                                    }}
                                    className="w-4 h-4 accent-[#1a5c3a]" />
                                <span className="text-sm md:text-base text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>

                    <div className={`flex flex-wrap gap-4 pl-2 transition-opacity
                        ${isDualCitizen ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                        {['By birth', 'By naturalization'].map(option => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                                <input type="radio" name="citizenship_by" value={option}
                                    checked={data.citizenship_by === option}
                                    onChange={() => setData('citizenship_by', option)}
                                    disabled={!isDualCitizen}
                                    className="w-4 h-4 accent-[#1a5c3a]" />
                                <span className="text-sm md:text-base text-gray-500">{option}</span>
                            </label>
                        ))}
                    </div>

                    <div className={`pl-2 transition-opacity
                        ${isDualCitizen ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                        <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                            Country of Other Citizenship <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full sm:w-72" data-field="citizenship_country">
                            <CustomSelect
                                value={data.citizenship_country || ''}
                                onChange={val => setData('citizenship_country', val)}
                                options={countryOptions}
                                placeholder={loadingCountries ? 'Loading countries...' : 'Select country'}
                                disabled={!isDualCitizen}
                                error={!!errors.citizenship_country}
                                loading={loadingCountries}
                            />
                        </div>
                        {errors.citizenship_country && (
                            <p className="mt-1 text-xs md:text-sm text-red-500">{errors.citizenship_country}</p>
                        )}
                    </div>
                </div>
            </Field>

            <SectionTitle>Residential Address</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="House/Block/Lot No." error={errors.house_block_lot_no} fieldName="house_block_lot_no">
                    <input type="text" value={data.house_block_lot_no || ''}
                        onChange={e => setData('house_block_lot_no', e.target.value.toUpperCase())}
                        className={inputClass(errors.house_block_lot_no)} placeholder="Optional" />
                </Field>
                <Field label="Street" error={errors.street} fieldName="street">
                    <input type="text" value={data.street || ''}
                        onChange={e => setData('street', e.target.value.toUpperCase())}
                        className={inputClass(errors.street)} placeholder="Optional" />
                </Field>
                <Field label="Subdivision / Village" error={errors.subdivision_village}
                    fieldName="subdivision_village" className="md:col-span-2">
                    <input type="text" value={data.subdivision_village || ''}
                        onChange={e => setData('subdivision_village', e.target.value.toUpperCase())}
                        className={inputClass(errors.subdivision_village)} placeholder="Optional" />
                </Field>
                <Field label="Region" error={errors.region} required fieldName="region">
                    <CustomSelect
                        value={data.region_code || ''}
                        onChange={val => {
                            const selected = regions.find(r => r.code === val);
                            setData(prev => ({
                                ...prev,
                                region_code: val, region: selected?.name || '',
                                province_code: '', province: '',
                                city_code: '', city_municipality: '',
                                barangay_code: '', barangay: '',
                                zip_code: '',
                            }));
                        }}
                        options={regionOptions}
                        placeholder="Select Region"
                        error={!!errors.region}
                    />
                </Field>
                <Field label="Province" error={errors.province} required fieldName="province">
                    <CustomSelect
                        value={data.province_code || ''}
                        onChange={val => {
                            const selected = provinces.find(p => p.code === val);
                            setData(prev => ({
                                ...prev,
                                province_code: val, province: selected?.name || '',
                                city_code: '', city_municipality: '',
                                barangay_code: '', barangay: '',
                                zip_code: '',
                            }));
                        }}
                        options={provinceOptions}
                        placeholder="Select Province"
                        disabled={!data.region_code}
                        loading={loadingPsgc.province}
                        error={!!errors.province}
                    />
                </Field>
                <Field label="City / Municipality" error={errors.city_municipality} required fieldName="city_municipality">
                    <CustomSelect
                        value={data.city_code || ''}
                        onChange={val => {
                            const selected = cities.find(c => c.code === val);
                            setData(prev => ({
                                ...prev,
                                city_code: val, city_municipality: selected?.name || '',
                                barangay_code: '', barangay: '',
                            }));
                        }}
                        options={cityOptions}
                        placeholder="Select City / Municipality"
                        disabled={!data.province_code}
                        loading={loadingPsgc.city}
                        error={!!errors.city_municipality}
                    />
                </Field>
                <Field label="Barangay" error={errors.barangay} required fieldName="barangay">
                    <CustomSelect
                        value={data.barangay_code || ''}
                        onChange={val => {
                            const selected = barangays.find(b => b.code === val);
                            setData(prev => ({
                                ...prev,
                                barangay_code: val, barangay: selected?.name || '',
                            }));
                        }}
                        options={barangayOptions}
                        placeholder="Select Barangay"
                        disabled={!data.city_code}
                        loading={loadingPsgc.barangay}
                        error={!!errors.barangay}
                    />
                </Field>
                <Field label="Zip Code" error={errors.zip_code} fieldName="zip_code">
                    <div className="relative">
                        <input
                            type="text"
                            value={data.zip_code || ''}
                            onChange={e => setData('zip_code', e.target.value.replace(/\D/g, ''))}
                            className={`${inputClass(errors.zip_code)} ${loadingPsgc.zip ? 'text-gray-400' : ''}`}
                            placeholder={loadingPsgc.zip ? 'Fetching zip code...' : data.city_code ? 'Zip code' : 'Select a city first'}
                            maxLength={4}
                            readOnly={loadingPsgc.zip}
                        />
                        {loadingPsgc.zip && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                <svg className="w-4 h-4 animate-spin text-[#1a5c3a]/50" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            </span>
                        )}
                    </div>
                </Field>
            </div>

            <SectionTitle>Permanent Address</SectionTitle>

            {/* Action Bar Container */}
            <div className="flex items-center gap-4 mb-4">
                <button type="button" onClick={copyResidentialToPermanent}
                    className="flex items-center gap-2 text-sm md:text-base font-medium text-[#1a5c3a]
                        hover:text-[#14472e] border border-[#1a5c3a]/30 hover:border-[#1a5c3a]
                        rounded-lg px-4 py-2 md:py-3 transition-all active:scale-[0.98] min-h-[44px]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Same as Residential Address
                </button>

                {/* Animated Success Message */}
                <div
                    className={`flex items-center gap-1.5 text-sm md:text-base font-medium text-[#1a5c3a] transition-all duration-300 ease-out
                        ${showCopyMessage ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'}`}
                >
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Address copied!
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="House/Block/Lot No." error={errors.perm_house_block_lot_no}
                    fieldName="perm_house_block_lot_no">
                    <input type="text" value={data.perm_house_block_lot_no || ''}
                        onChange={e => setData('perm_house_block_lot_no', e.target.value.toUpperCase())}
                        className={inputClass(errors.perm_house_block_lot_no)} placeholder="Optional" />
                </Field>
                <Field label="Street" error={errors.perm_street} fieldName="perm_street">
                    <input type="text" value={data.perm_street || ''}
                        onChange={e => setData('perm_street', e.target.value.toUpperCase())}
                        className={inputClass(errors.perm_street)} placeholder="Optional" />
                </Field>
                <Field label="Subdivision / Village" error={errors.perm_subdivision_village}
                    fieldName="perm_subdivision_village" className="md:col-span-2">
                    <input type="text" value={data.perm_subdivision_village || ''}
                        onChange={e => setData('perm_subdivision_village', e.target.value.toUpperCase())}
                        className={inputClass(errors.perm_subdivision_village)} placeholder="Optional" />
                </Field>
                <Field label="Region" error={errors.perm_region} required fieldName="perm_region">
                    <CustomSelect
                        value={data.perm_region_code || ''}
                        onChange={val => {
                            const selected = regions.find(r => r.code === val);
                            setData(prev => ({
                                ...prev,
                                perm_region_code: val, perm_region: selected?.name || '',
                                perm_province_code: '', perm_province: '',
                                perm_city_code: '', perm_city: '',
                                perm_barangay_code: '', perm_barangay: '',
                                perm_zip_code: '',
                            }));
                        }}
                        options={regionOptions}
                        placeholder="Select Region"
                        error={!!errors.perm_region}
                    />
                </Field>
                <Field label="Province" error={errors.perm_province} required fieldName="perm_province">
                    <CustomSelect
                        value={data.perm_province_code || ''}
                        onChange={val => {
                            const selected = permProvinces.find(p => p.code === val);
                            setData(prev => ({
                                ...prev,
                                perm_province_code: val, perm_province: selected?.name || '',
                                perm_city_code: '', perm_city: '',
                                perm_barangay_code: '', perm_barangay: '',
                                perm_zip_code: '',
                            }));
                        }}
                        options={permProvinceOptions}
                        placeholder="Select Province"
                        disabled={!data.perm_region_code}
                        error={!!errors.perm_province}
                    />
                </Field>
                <Field label="City / Municipality" error={errors.perm_city} required fieldName="perm_city">
                    <CustomSelect
                        value={data.perm_city_code || ''}
                        onChange={val => {
                            const selected = permCities.find(c => c.code === val);
                            setData(prev => ({
                                ...prev,
                                perm_city_code: val, perm_city: selected?.name || '',
                                perm_barangay_code: '', perm_barangay: '',
                            }));
                        }}
                        options={permCityOptions}
                        placeholder="Select City / Municipality"
                        disabled={!data.perm_province_code}
                        error={!!errors.perm_city}
                    />
                </Field>
                <Field label="Barangay" error={errors.perm_barangay} required fieldName="perm_barangay">
                    <CustomSelect
                        value={data.perm_barangay_code || ''}
                        onChange={val => {
                            const selected = permBarangays.find(b => b.code === val);
                            setData(prev => ({
                                ...prev,
                                perm_barangay_code: val, perm_barangay: selected?.name || '',
                            }));
                        }}
                        options={permBarangayOptions}
                        placeholder="Select Barangay"
                        disabled={!data.perm_city_code}
                        error={!!errors.perm_barangay}
                    />
                </Field>
                <Field label="Zip Code" error={errors.perm_zip_code} fieldName="perm_zip_code">
                    <div className="relative">
                        <input
                            type="text"
                            value={data.perm_zip_code || ''}
                            onChange={e => setData('perm_zip_code', e.target.value.replace(/\D/g, ''))}
                            className={`${inputClass(errors.perm_zip_code)} ${loadingPsgc.perm_zip ? 'text-gray-400' : ''}`}
                            placeholder={loadingPsgc.perm_zip ? 'Fetching zip code...' : data.perm_city_code ? 'Zip code' : 'Select a city first'}
                            maxLength={4}
                            readOnly={loadingPsgc.perm_zip}
                        />
                        {loadingPsgc.perm_zip && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                <svg className="w-4 h-4 animate-spin text-[#1a5c3a]/50" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            </span>
                        )}
                    </div>
                </Field>
            </div>
        </div>
    );
}