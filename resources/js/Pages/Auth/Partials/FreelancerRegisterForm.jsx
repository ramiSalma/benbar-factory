import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

const inputClass =
    'mt-1 block w-full bg-white/50 border-white/60 text-slate-900 rounded-xl placeholder-slate-400 focus:bg-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner';

const labelClass = 'text-slate-700 font-bold tracking-wide text-xs uppercase mb-1.5';
const errorClass = 'mt-1.5 text-xs font-semibold text-red-600';

export default function FreelancerRegisterForm({ data, setData, errors }) {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel value="Professional Title" className={labelClass} />
                    <TextInput
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={inputClass}
                        placeholder="Full Stack Engineer"
                    />
                    <InputError message={errors.title} className={errorClass} />
                </div>

                <div>
                    <InputLabel value="Headline" className={labelClass} />
                    <TextInput
                        value={data.headline}
                        onChange={(e) => setData('headline', e.target.value)}
                        className={inputClass}
                        placeholder="Building digital architectures"
                    />
                    <InputError message={errors.headline} className={errorClass} />
                </div>
            </div>

            <div>
                <InputLabel value="Specialities / Tech Stack" className={labelClass} />
                <TextInput
                    value={data.speciality}
                    onChange={(e) => setData('speciality', e.target.value)}
                    className={inputClass}
                    placeholder="React, AWS, Node.js, Figma"
                />
                <InputError message={errors.speciality} className={errorClass} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel value="Hourly Rate ($)" className={labelClass} />
                    <TextInput
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.hourly_rate}
                        onChange={(e) => setData('hourly_rate', e.target.value)}
                        className={inputClass}
                        placeholder="50.00"
                    />
                    <InputError message={errors.hourly_rate} className={errorClass} />
                </div>

                <div>
                    <InputLabel value="Years of Experience" className={labelClass} />
                    <TextInput
                        type="number"
                        min="0"
                        value={data.experience_years}
                        onChange={(e) => setData('experience_years', e.target.value)}
                        className={inputClass}
                        placeholder="5"
                    />
                    <InputError message={errors.experience_years} className={errorClass} />
                </div>
            </div>

            <div>
                <InputLabel value="Portfolio URL" className={labelClass} />
                <TextInput
                    type="url"
                    value={data.portfolio_url}
                    onChange={(e) => setData('portfolio_url', e.target.value)}
                    className={inputClass}
                    placeholder="https://portfolio.dev"
                />
                <InputError message={errors.portfolio_url} className={errorClass} />
            </div>

            <div>
                <InputLabel value="Professional Bio" className={labelClass} />
                <textarea
                    value={data.bio}
                    onChange={(e) => setData('bio', e.target.value)}
                    className="mt-1 block w-full bg-white/50 border border-white/60 text-slate-900 rounded-xl placeholder-slate-400 focus:bg-white/90 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner p-3 text-sm outline-none"
                    rows="3"
                    placeholder="Share your experience, past products, or design ethics..."
                />
                <InputError message={errors.bio} className={errorClass} />
            </div>
        </>
    );
}
