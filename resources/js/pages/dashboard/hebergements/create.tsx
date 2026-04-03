import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../layout';

export default function HebergementCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        adresse: '',
        ville: '',
        pays: '',
        latitude: '',
        longitude: '',
        telephone: '',
        email_contact: '',
        site_web: '',
        description: '',
        niveau_certif: '',
        equipements: [] as string[],
        type_handicaps: [] as string[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/hebergements');
    };

    const EQUIPEMENTS = [
        'Fauteuil roulant de prêt',
        'Lit médicalisé',
        'Lève-personne',
        'Barre d\'appui salle de bain',
        'Douche à l\'italienne',
        'Ascenseur PMR',
        'Rampe d\'accès',
        'Parking handicapé',
        'Piscine accessible',
        'Restaurant accessible',
    ];

    const TYPES_HANDICAP = ['Moteur', 'Sensoriel', 'Cognitif', 'Polyhandicap'];

    const toggleArray = (key: 'equipements' | 'type_handicaps', val: string) => {
        const current = data[key] as string[];
        setData(key, current.includes(val) ? current.filter(v => v !== val) : [...current, val]);
    };

    const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            {children}
            {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{error}</p>}
        </div>
    );

    const inputClass = (hasError?: string) =>
        `w-full px-4 py-3 text-sm border-2 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:bg-white transition-all ${hasError ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-emerald-400 focus:shadow-sm focus:shadow-emerald-100'}`;

    return (
        <DashboardLayout title="Ajouter un hébergement" subtitle="Nouvel établissement sur la plateforme">
            <form onSubmit={submit}>
                <div className="max-w-4xl space-y-6">

                    {/* ── Informations générales ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h1M9 11h1M9 15h1M14 7h1M14 11h1M14 15h1"/>
                                </svg>
                            </div>
                            <h2 className="text-sm font-bold text-slate-900">Informations générales</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <Field label="Nom de l'établissement *" error={errors.nom}>
                                    <input
                                        value={data.nom}
                                        onChange={e => setData('nom', e.target.value)}
                                        placeholder="ex: Hôtel Azur Accessible"
                                        className={inputClass(errors.nom)}
                                    />
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field label="Adresse complète *" error={errors.adresse}>
                                    <input
                                        value={data.adresse}
                                        onChange={e => setData('adresse', e.target.value)}
                                        placeholder="Numéro, rue, quartier…"
                                        className={inputClass(errors.adresse)}
                                    />
                                </Field>
                            </div>
                            <Field label="Ville *" error={errors.ville}>
                                <input
                                    value={data.ville}
                                    onChange={e => setData('ville', e.target.value)}
                                    placeholder="ex: Dakar"
                                    className={inputClass(errors.ville)}
                                />
                            </Field>
                            <Field label="Pays *" error={errors.pays}>
                                <select
                                    value={data.pays}
                                    onChange={e => setData('pays', e.target.value)}
                                    className={inputClass(errors.pays)}
                                >
                                    <option value="">Sélectionner…</option>
                                    {[['SN','Sénégal'],['MA','Maroc'],['CI','Côte d\'Ivoire'],['CM','Cameroun'],['TG','Togo'],['KE','Kenya'],['GH','Ghana'],['GA','Gabon'],['DZ','Algérie'],['TN','Tunisie'],['FR','France'],['ES','Espagne'],['DE','Allemagne']].map(([code,label])=>(
                                        <option key={code} value={code}>{label}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Téléphone" error={errors.telephone}>
                                <input
                                    value={data.telephone}
                                    onChange={e => setData('telephone', e.target.value)}
                                    placeholder="+221 33 123 45 67"
                                    className={inputClass(errors.telephone)}
                                />
                            </Field>
                            <Field label="Email de contact" error={errors.email_contact}>
                                <input
                                    type="email"
                                    value={data.email_contact}
                                    onChange={e => setData('email_contact', e.target.value)}
                                    placeholder="contact@hotel.com"
                                    className={inputClass(errors.email_contact)}
                                />
                            </Field>
                            <div className="md:col-span-2">
                                <Field label="Site web" error={errors.site_web}>
                                    <input
                                        value={data.site_web}
                                        onChange={e => setData('site_web', e.target.value)}
                                        placeholder="https://www.hotel.com"
                                        className={inputClass(errors.site_web)}
                                    />
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field label="Description" error={errors.description}>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Décrivez l'établissement, son environnement, ses atouts pour les personnes en situation de handicap…"
                                        rows={4}
                                        className={inputClass(errors.description)}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* ── Localisation GPS ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Localisation GPS</h2>
                                <p className="text-xs text-slate-400">Utilisé pour la recherche de proximité</p>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-5">
                            <Field label="Latitude *" error={errors.latitude}>
                                <input
                                    value={data.latitude}
                                    onChange={e => setData('latitude', e.target.value)}
                                    placeholder="ex: 14.693700"
                                    className={inputClass(errors.latitude)}
                                />
                            </Field>
                            <Field label="Longitude *" error={errors.longitude}>
                                <input
                                    value={data.longitude}
                                    onChange={e => setData('longitude', e.target.value)}
                                    placeholder="ex: -17.444100"
                                    className={inputClass(errors.longitude)}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* ── Niveau de certification ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Niveau de certification ISO 21902</h2>
                                <p className="text-xs text-slate-400">Laisser vide si l'audit n'a pas encore eu lieu</p>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { val: 'Accessible', label: 'Accessible', desc: 'Critères de base respectés', color: 'teal', score: '60–74' },
                                { val: 'Accessible Plus', label: 'Accessible Plus', desc: 'Niveau intermédiaire avancé', color: 'sky', score: '75–89' },
                                { val: 'Excellence', label: 'Excellence', desc: 'Meilleur niveau de la plateforme', color: 'emerald', score: '90–100' },
                            ].map(opt => (
                                <label key={opt.val} className={`relative flex flex-col gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${data.niveau_certif === opt.val ? `border-${opt.color}-400 bg-${opt.color}-50` : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                    <input type="radio" name="niveau_certif" value={opt.val} checked={data.niveau_certif === opt.val} onChange={e => setData('niveau_certif', e.target.value)} className="sr-only"/>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-900">{opt.label}</span>
                                        <span className="text-xs text-slate-400 font-mono">{opt.score}/100</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{opt.desc}</p>
                                    {data.niveau_certif === opt.val && (
                                        <div className="absolute top-3 right-3 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ── Équipements PMR ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Équipements disponibles</h2>
                                <p className="text-xs text-slate-400">{data.equipements.length} équipement(s) sélectionné(s)</p>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                            {EQUIPEMENTS.map(eq => (
                                <label key={eq} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${data.equipements.includes(eq) ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.equipements.includes(eq) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}
                                        onClick={() => toggleArray('equipements', eq)}>
                                        {data.equipements.includes(eq) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                    </div>
                                    <span className="text-sm text-slate-700 font-medium">{eq}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ── Types de handicap accueillis ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <h2 className="text-sm font-bold text-slate-900">Types de handicap accueillis</h2>
                        </div>
                        <div className="p-6 flex flex-wrap gap-3">
                            {TYPES_HANDICAP.map(t => (
                                <label key={t} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${data.type_handicaps.includes(t) ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                    onClick={() => toggleArray('type_handicaps', t)}>
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${data.type_handicaps.includes(t) ? 'bg-amber-500 border-amber-500' : 'border-slate-300'}`}>
                                        {data.type_handicaps.includes(t) && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                    </div>
                                    <span className="text-sm font-semibold">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex items-center justify-between pt-2">
                        <Link href="/hebergements" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                            Annuler
                        </Link>
                        <div className="flex gap-3">
                            <button type="button" className="px-5 py-2.5 text-sm font-semibold text-slate-600 border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all">
                                Sauvegarder brouillon
                            </button>
                            <button type="submit" disabled={processing} className="px-6 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                                Publier l'hébergement
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}