import { useForm, usePage } from '@inertiajs/react';
import ProfessionnelLayout from './layout';

const SPECIALITES = [
    { val:'infirmiere', label:'Infirmier(ère)' }, { val:'kinesitherapeute', label:'Kinésithérapeute' },
    { val:'auxiliaire', label:'Auxiliaire de vie' }, { val:'aide_soignant', label:'Aide-soignant(e)' },
    { val:'medecin', label:'Médecin' }, { val:'ergotherapeute', label:'Ergothérapeute' },
    { val:'orthophoniste', label:'Orthophoniste' }, { val:'autre', label:'Autre' },
];

const inputCls = 'w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-pink-400 focus:bg-white transition-all';

export default function ProfessionnelProfil({ profil }: { profil: any }) {
    const { props } = usePage<any>();
    const flash = props.flash as any;
    const { data, setData, patch, processing, errors } = useForm({ ...profil });
    const initials = ((profil.prenom?.[0] ?? '?') + (profil.nom?.[0] ?? '')).toUpperCase();

    return (
        <ProfessionnelLayout title="Mon profil" subtitle="Gérez vos informations professionnelles">
            {flash?.success && (
                <div className="mb-5 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p className="text-sm font-semibold text-emerald-700">{flash.success}</p>
                </div>
            )}
            <div className="max-w-2xl space-y-6">
                {/* Avatar */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-pink-600 flex items-center justify-center text-3xl font-black text-white flex-shrink-0">{initials}</div>
                    <div>
                        <p className="text-xl font-black text-slate-900">{profil.prenom} {profil.nom}</p>
                        <p className="text-sm text-slate-400 mt-1">{profil.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            {profil.certifie && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">✓ Certifié</span>}
                            {profil.diplome_valide && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">📄 Diplôme validé</span>}
                        </div>
                    </div>
                </div>

                {/* Infos perso */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </div>
                        <h2 className="text-sm font-bold text-slate-900">Informations personnelles</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Prénom</label>
                                <input value={data.prenom} onChange={e => setData('prenom', e.target.value)} className={inputCls}/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nom</label>
                                <input value={data.nom} onChange={e => setData('nom', e.target.value)} className={inputCls}/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">N° RPPS / Ordre professionnel</label>
                            <input value={data.numero_rpps} onChange={e => setData('numero_rpps', e.target.value)} className={inputCls} placeholder="ex: 10012345678"/>
                        </div>
                    </div>
                </div>

                {/* Spécialité & tarif */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                        </div>
                        <h2 className="text-sm font-bold text-slate-900">Spécialité & Tarif</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Spécialité</label>
                            <select value={data.specialite} onChange={e => setData('specialite', e.target.value)} className={inputCls}>
                                <option value="">Sélectionner…</option>
                                {SPECIALITES.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
                            </select>
                        </div>
                        {data.specialite === 'autre' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Préciser</label>
                                <input value={data.specialite_autre} onChange={e => setData('specialite_autre', e.target.value)} className={inputCls} placeholder="ex: Psychomotricien…"/>
                            </div>
                        )}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tarif / heure</label>
                                <input type="number" value={data.tarif_horaire} onChange={e => setData('tarif_horaire', e.target.value)} className={inputCls} placeholder="ex: 15000"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Devise</label>
                                <select value={data.devise} onChange={e => setData('devise', e.target.value)} className={inputCls}>
                                    {['XOF','EUR','USD','MAD','KES','GHS'].map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Bio / Présentation</label>
                            <textarea value={data.bio} onChange={e => setData('bio', e.target.value)} rows={4} className={inputCls} placeholder="Décrivez votre expérience…"/>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button onClick={() => patch('/professionnel/profil')} disabled={processing}
                        className="flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
                        {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                        Sauvegarder
                    </button>
                </div>
            </div>
        </ProfessionnelLayout>
    );
}