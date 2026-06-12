import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

const clientTypes = [
    { value: 'particulier', label: 'Particulier', helper: 'Individual project owner' },
    { value: 'entreprise', label: 'Entreprise', helper: 'Registered company' },
    { value: 'association', label: 'Association', helper: 'Nonprofit or organization' },
    { value: 'administration', label: 'Administration', helper: 'Public administration' },
    { value: 'bureau_etudes', label: "Bureau d'etudes", helper: 'Engineering or consulting office' },
];

const inputClass =
    'mt-1 block w-full bg-white/50 border-white/60 text-slate-900 rounded-xl placeholder-slate-400 focus:bg-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner';

const labelClass = 'text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5';
const errorClass = 'mt-1.5 text-xs font-semibold text-red-600';

export default function ClientRegisterForm({ data, setData, errors }) {
    const isOrganization = data.client_type !== 'particulier';

    return (
        <>
            <div>
                <InputLabel value="Type de client" className={labelClass} />
                <select className="mt-1 block w-full rounded-xl border-white/60 bg-white/50 p-2.5 text-slate-900 shadow-inner focus:bg-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 outline-none text-sm font-medium" value={data.client_type} onChange={(e) => setData('client_type', e.target.value)} required>
                    {clientTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label} - {type.helper}
                        </option>
                    ))}
                </select>
                <InputError message={errors.client_type} className={errorClass} />
            </div>

            <div>
                <InputLabel value="Contact Name" className={labelClass} />
                <TextInput
                    value={data.contact_name}
                    onChange={(e) => setData('contact_name', e.target.value)}
                    className={inputClass}
                    placeholder="Primary contact"
                    required
                />
                <InputError message={errors.contact_name} className={errorClass} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {isOrganization && (
                    <div>
                        <InputLabel value="Organization Name" className={labelClass} />
                        <TextInput
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            className={inputClass}
                            placeholder="Acme Corp"
                            required
                        />
                        <InputError message={errors.company_name} className={errorClass} />
                    </div>
                )}

                {['entreprise', 'association'].includes(data.client_type) && (
                    <div>
                        <InputLabel value={data.client_type === 'association' ? 'Mission Domain' : 'Industry'} className={labelClass} />
                        <TextInput
                            value={data.industry}
                            onChange={(e) => setData('industry', e.target.value)}
                            className={inputClass}
                            placeholder="Technology, finance, education..."
                            required
                        />
                        <InputError message={errors.industry} className={errorClass} />
                    </div>
                )}

                {data.client_type === 'bureau_etudes' && (
                    <div>
                        <InputLabel value="Study Office Speciality" className={labelClass} />
                        <TextInput
                            value={data.study_office_speciality}
                            onChange={(e) => setData('study_office_speciality', e.target.value)}
                            className={inputClass}
                            placeholder="Civil engineering, energy, architecture..."
                            required
                        />
                        <InputError message={errors.study_office_speciality} className={errorClass} />
                    </div>
                )}

                {data.client_type === 'administration' && (
                    <div>
                        <InputLabel value="Department" className={labelClass} />
                        <TextInput
                            value={data.department}
                            onChange={(e) => setData('department', e.target.value)}
                            className={inputClass}
                            placeholder="Procurement, IT, urban planning..."
                            required
                        />
                        <InputError message={errors.department} className={errorClass} />
                    </div>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {data.client_type === 'entreprise' && (
                    <div>
                        <InputLabel value="VAT / ICE Number" className={labelClass} />
                        <TextInput
                            value={data.vat_number}
                            onChange={(e) => setData('vat_number', e.target.value)}
                            className={inputClass}
                            placeholder="Tax identifier"
                            required
                        />
                        <InputError message={errors.vat_number} className={errorClass} />
                    </div>
                )}

                {['association', 'bureau_etudes'].includes(data.client_type) && (
                    <div>
                        <InputLabel value="Registration Number" className={labelClass} />
                        <TextInput
                            value={data.registration_number}
                            onChange={(e) => setData('registration_number', e.target.value)}
                            className={inputClass}
                            placeholder="Registration or license number"
                            required
                        />
                        <InputError message={errors.registration_number} className={errorClass} />
                    </div>
                )}

                {['entreprise', 'bureau_etudes'].includes(data.client_type) && (
                    <div>
                        <InputLabel value="Company Size" className={labelClass} />
                        <TextInput
                            value={data.company_size}
                            onChange={(e) => setData('company_size', e.target.value)}
                            className={inputClass}
                            placeholder="1-10, 11-50, 50+"
                            required
                        />
                        <InputError message={errors.company_size} className={errorClass} />
                    </div>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel value="Billing Address" className={labelClass} />
                    <TextInput
                        value={data.billing_address}
                        onChange={(e) => setData('billing_address', e.target.value)}
                        className={inputClass}
                        placeholder="Street address"
                        required
                    />
                    <InputError message={errors.billing_address} className={errorClass} />
                </div>

                <div>
                    <InputLabel value="Website" className={labelClass} />
                    <TextInput
                        type="url"
                        value={data.website}
                        onChange={(e) => setData('website', e.target.value)}
                        className={inputClass}
                        placeholder="https://example.com"
                    />
                    <InputError message={errors.website} className={errorClass} />
                </div>
            </div>

            <div>
                <InputLabel value="Client Biography" className={labelClass} />
                <textarea
                    value={data.bio}
                    onChange={(e) => setData('bio', e.target.value)}
                    className="mt-1 block w-full bg-white/50 border border-white/60 text-slate-900 rounded-xl placeholder-slate-400 focus:bg-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner p-3 text-sm outline-none"
                    rows="3"
                    placeholder="Tell us about your team and vision..."
                />
                <InputError message={errors.bio} className={errorClass} />
            </div>
        </>
    );
}
