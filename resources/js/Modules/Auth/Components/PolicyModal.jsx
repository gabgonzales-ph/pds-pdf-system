import { useState, useEffect } from 'react';

export default function PolicyModal({ isOpen, onClose, initialTab = 'terms' }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true));
            setActiveTab(initialTab);
        } else {
            setVisible(false);
        }
    }, [isOpen, initialTab]);

    if (!isOpen && !visible) return null;

    function handleClose() {
        setVisible(false);
        setTimeout(onClose, 250);
    }

    const tabStyles = (tabName) => `
        flex-1 py-3 text-sm font-semibold border-b-2 transition-colors
        ${activeTab === tabName 
            ? 'border-[#1a5c3a] text-[#1a5c3a]' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
    `;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 backdrop-blur-sm transition-all duration-250
                    ${visible ? 'bg-black/40' : 'bg-black/0'}`}
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className={`relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col
                transition-all duration-250 ease-out
                ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                
                {/* Header & Tabs */}
                <div className="px-6 pt-6 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Legal Policies</h2>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setActiveTab('terms')} className={tabStyles('terms')}>
                            Terms of Service
                        </button>
                        <button onClick={() => setActiveTab('privacy')} className={tabStyles('privacy')}>
                            Privacy Policy
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-600 space-y-6">
                    {activeTab === 'terms' ? (
                        <div className="space-y-4">
                            <p><strong>Effective Date:</strong> 17/03/26</p>
                            
                            <h3 className="text-gray-800 font-semibold text-base mt-6">1. Acceptance of Terms</h3>
                            <p>By accessing or using the Profiling System (“System”), you agree to be bound by these Terms of Service. If you do not agree, you must not use the System.</p>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">2. Description of Service</h3>
                            <p>The System provides users with the ability to:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Create and manage personal profiles and Personal Data Sheets (PDS)</li>
                                <li>Submit and update personal and professional information</li>
                                <li>Allow administrators to manage, review, and maintain records</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">3. User Responsibilities</h3>
                            <p>You agree to:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Provide accurate, complete, and up-to-date information</li>
                                <li>Maintain the confidentiality of your account credentials</li>
                                <li>Use the System only for lawful purposes</li>
                            </ul>
                            <p className="mt-2">You must not:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Submit false or misleading data</li>
                                <li>Attempt unauthorized access to other accounts or system components</li>
                                <li>Disrupt or interfere with system security or operations</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">4. Account Management</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Users are responsible for all activities under their account</li>
                                <li>The administrator reserves the right to suspend or terminate accounts that violate these Terms</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">5. Administrative Actions</h3>
                            <p>Administrators may:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Add, edit, delete, or restore user records and documents</li>
                                <li>Maintain logs of user and admin activities (e.g., login, edits, deletions)</li>
                                <li>Monitor system usage to ensure compliance and security</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">6. Data Accuracy and Liability</h3>
                            <p>While the System aims to maintain accurate records:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Users are primarily responsible for their submitted data</li>
                                <li>The System is not liable for errors resulting from incorrect user input</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">7. Intellectual Property</h3>
                            <p>All system content, design, and functionality are owned by the System developers unless otherwise stated. Unauthorized use is prohibited.</p>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">8. Limitation of Liability</h3>
                            <p>The System is provided “as is.” The developers are not liable for:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Data loss</li>
                                <li>Unauthorized access due to user negligence</li>
                                <li>System downtime or technical issues</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">9. Modifications</h3>
                            <p>These Terms may be updated at any time. Continued use of the System constitutes acceptance of changes.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p><strong>Effective Date:</strong> 17/03/26</p>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">1. Information We Collect</h3>
                            <p><strong>a. Personal Information</strong></p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Full name</li>
                                <li>Contact details (email, phone number)</li>
                                <li>Address and demographic data</li>
                                <li>Employment and educational background</li>
                                <li>Government-related eligibility or credentials (if applicable)</li>
                            </ul>
                            <p className="mt-2"><strong>b. System Data</strong></p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Login/logout timestamps</li>
                                <li>Activity logs (e.g., edits, submissions, deletions)</li>
                                <li>Device and browser information</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">2. How We Use Information</h3>
                            <p>Collected data is used to:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Manage user profiles and records</li>
                                <li>Provide system functionality</li>
                                <li>Maintain security and prevent unauthorized access</li>
                                <li>Track system activity for auditing and accountability</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">3. Data Sharing</h3>
                            <p>We do not sell or rent user data. Information may be shared only:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>With authorized administrators</li>
                                <li>When required by law or legal processes</li>
                                <li>For system security and investigation purposes</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">4. Data Storage and Security</h3>
                            <p>We implement appropriate technical and organizational measures to:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Protect data from unauthorized access</li>
                                <li>Secure stored information</li>
                                <li>Maintain system integrity</li>
                            </ul>
                            <p>However, no system is completely secure, and absolute security cannot be guaranteed.</p>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">5. Data Retention</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>User data is retained as long as necessary for system operations</li>
                                <li>Deleted records may be stored temporarily for recovery and audit purposes</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">6. User Rights</h3>
                            <p>Users may:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Access their personal data</li>
                                <li>Request corrections to inaccurate information</li>
                                <li>Request account deactivation (subject to administrative policies)</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">7. Cookies and Tracking</h3>
                            <p>The System may use cookies or similar technologies to:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Maintain sessions</li>
                                <li>Improve user experience</li>
                                <li>Analyze system performance</li>
                            </ul>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">8. Third-Party Services</h3>
                            <p>If third-party services are integrated (e.g., APIs), they may process limited data necessary for functionality.</p>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">9. Changes to This Policy</h3>
                            <p>This Privacy Policy may be updated periodically. Users will be notified of significant changes when applicable.</p>

                            <h3 className="text-gray-800 font-semibold text-base mt-6">10. Contact Information</h3>
                            <p>For questions or concerns regarding these Terms or Privacy Policy, contact:<br/>
                            <strong>[Insert Contact Email / Admin Office]</strong></p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={handleClose}
                        className="w-full py-2.5 bg-[#1a5c3a] hover:bg-[#14472e] text-white font-semibold rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}