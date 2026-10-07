// resources/js/Modules/Auth/Components/Registration/StepSummary.jsx

import React, { useEffect, useState } from 'react';

export default function StepSummary({ data, departments, careerServices }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger the entrance animation shortly after the component mounts
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    // Helper to find the label for dropdowns instead of displaying IDs
    const getDepartmentName = (id) => { if (!id) return null; return departments?.find(d => String(d.id) === String(id))?.name || id; };
    const getCareerServiceName = (id) => { if (!id) return null; return careerServices?.find(c => String(c.id) === String(id))?.name || id; };

    const SummarySection = ({ title, children, delayClass = '' }) => (
        <div
            className={`mb-6 bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${delayClass}`}
        >
            <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-100">
                <h3 className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-widest">
                    {title}
                </h3>
            </div>
            <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-8 text-sm">
                    {children}
                </div>
            </div>
        </div>
    );

    const DetailItem = ({ label, value, fullWidth = false }) => (
        <div className={`flex flex-col ${fullWidth ? 'col-span-1 sm:col-span-2 lg:col-span-3' : ''}`}>
            <span className="text-gray-400 text-[11px] md:text-xs font-semibold mb-1 uppercase tracking-wider">{label}</span>
            <span className="font-medium text-gray-800 text-sm md:text-base break-words">
                {value && String(value).trim() !== '' ? (
                    value
                ) : (
                    <span className="text-gray-300 italic font-normal">Not Provided</span>
                )}
            </span>
        </div>
    );

    return (
        <div className="py-2 px-1 pb-8">
            <div
                className={`bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-xl text-sm md:text-base mb-6 flex items-start gap-3 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>Please review your information carefully. Ensure all details are accurate before finalizing your registration to generate your Personal Data Sheet.</p>
            </div>

            <SummarySection title="Account Information" delayClass="delay-75">
                <DetailItem label="Username" value={data.username} />
                <DetailItem label="Email Address" value={data.email} />
                <DetailItem label="Employee ID" value={data.employee_id} />
                <DetailItem label="Department" value={getDepartmentName(data.department_id)} />
                <DetailItem label="Career Service" value={getCareerServiceName(data.career_service_id)} />
            </SummarySection>

            <SummarySection title="Personal Information" delayClass="delay-150">
                <DetailItem label="Full Name" value={`${data.first_name} ${data.middle_name ? data.middle_name + ' ' : ''}${data.last_name} ${data.suffix || ''}`} fullWidth />
                <DetailItem label="Date of Birth" value={data.date_of_birth} />
                <DetailItem label="Place of Birth" value={data.birth_place} />
                <DetailItem label="Sex" value={data.sex} />
                <DetailItem label="Civil Status" value={data.civil_status} />
                <DetailItem label="Blood Type" value={data.blood_type} />
                <DetailItem label="Citizenship" value={data.citizenship === 'Dual Citizen' ? `Dual Citizen (${data.citizenship_by} - ${data.citizenship_country})` : data.citizenship} />
                <DetailItem label="Mobile No." value={data.mobile_no} />
                <DetailItem label="Telephone No." value={data.telephone_no} />
                <DetailItem label="Height (cm)" value={data.height_cm} />
                <DetailItem label="Weight (kg)" value={data.weight_kg} />
            </SummarySection>

            <SummarySection title="Current Address" delayClass="delay-200">
                <DetailItem label="House/Block/Lot No." value={data.house_block_lot_no} />
                <DetailItem label="Street" value={data.street} />
                <DetailItem label="Subdivision/Village" value={data.subdivision_village} />
                <DetailItem label="Barangay" value={data.barangay} />
                <DetailItem label="City/Municipality" value={data.city_municipality} />
                <DetailItem label="Province" value={data.province} />
                <DetailItem label="Region" value={data.region} />
                <DetailItem label="Zip Code" value={data.zip_code} />
            </SummarySection>

            <SummarySection title="Permanent Address" delayClass="delay-300">
                <DetailItem label="House/Block/Lot No." value={data.perm_house_block_lot_no} />
                <DetailItem label="Street" value={data.perm_street} />
                <DetailItem label="Subdivision/Village" value={data.perm_subdivision_village} />
                <DetailItem label="Barangay" value={data.perm_barangay} />
                <DetailItem label="City/Municipality" value={data.perm_city} />
                <DetailItem label="Province" value={data.perm_province} />
                <DetailItem label="Region" value={data.perm_region} />
                <DetailItem label="Zip Code" value={data.perm_zip_code} />
            </SummarySection>

            <SummarySection title="Family Background" delayClass="delay-500">
                <DetailItem label="Father's Name" value={`${data.father_first_name} ${data.father_middle_name || ''} ${data.father_surname} ${data.father_suffix || ''}`} fullWidth />
                <DetailItem label="Mother's Maiden Name" value={`${data.mother_first_name} ${data.mother_middle_name || ''} ${data.mother_surname}`} fullWidth />

                {['Married', 'Widowed', 'Separated'].includes(data.civil_status) && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-8 mt-2 pt-5 border-t border-gray-100">
                        <div className="col-span-full">
                            <h4 className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Spouse Details</h4>
                        </div>
                        <DetailItem label="Spouse's Name" value={`${data.spouse_first_name} ${data.spouse_middle_name || ''} ${data.spouse_surname} ${data.spouse_suffix || ''}`} />
                        <DetailItem label="Spouse's Birthdate" value={data.spouse_birthdate} />
                    </div>
                )}
            </SummarySection>
        </div>
    );
}
