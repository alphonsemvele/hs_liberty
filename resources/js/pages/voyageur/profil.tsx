import { useForm, usePage } from '@inertiajs/react';
import VoyageurLayout from './layout';

interface Profil {
    prenom: string; nom: string; email: string;
    type_handicap: string; niveau_dependance: number;
    besoins: string; telephone: string;
    date_naissance: string; ville: string; pays: string;
}

const TYPES_HANDICAP = [
    { val:'moteur',        label:'Moteur',         icon:'♿' },
    { val:'sensoriel',     label:'Sensoriel',      icon:'👁️' },
    { val:'cognitif',      label:'Cognitif',       icon:'🧠' },
    { val:'polyhandicap',  label:'Polyhandicap',   icon:'🤝' },
    { val:'psychiatrique', label:'Psychiatrique',  icon:'💙' },
];

const inputCls = 'w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all';

export default function VoyageurProfil({ profil }: { profil: Profil }) {
    const { props } = usePage<any>();
    const flash = props.flash as any;

    const { data, setData, patch, processing, errors } = useForm({
        prenom:            profil.prenom,
        nom:               profil.nom,
        telephone:         profil.telephone,
        type_handicap:     profil.type_handicap,
        niveau_dependance: profil.niveau_dependance,
        besoins:           profil.besoins,
        ville:             profil.ville,
        pays:              profil.pays,
    });

    const pwForm = useForm({
        current_password: '',
        password:         '',
        password_confirmation: '',
    });

    const initials = ((profil.prenom?.[0] ?? '?') + (profil.nom?.[0] ?? '')).toUpperCase();

    return (
        <VoyageurLayout title="Mon profil" subtitle="Gérez vos informations personnelles">

            {flash?.success && (
                <div className="mb-5 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p className="text-sm font-semibold text-emerald-700">{flash.success}</p>
                </div>
            )}

            <div className="max-w-2xl space-y-6">

                {/* Avatar + email */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-700 flex items-center justify-center text-3xl font-black text-white flex-shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="text-xl font-black text-slate-900">{profil.prenom} {profil.nom}</p>
                        <p className="text-sm text-slate-400 mt-1">{profil.email}</p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 mt-2">
                            ✈️ Voyageur
                        </span>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </div>
                        <h2 className="text-sm font-bold text-slate-900">Informations personnelles</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Prénom</label>
                                <input value={data.prenom} onChange={e => setData('prenom', e.target.value)} className={inputCls} placeholder="Prénom"/>
                                {errors.prenom && <p className="mt-1 text-xs text-red-500">{errors.prenom}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nom</label>
                                <input value={data.nom} onChange={e => setData('nom', e.target.value)} className={inputCls} placeholder="Nom"/>
                                {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom}</p>}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Téléphone</label>
                                <input value={data.telephone} onChange={e => setData('telephone', e.target.value)} className={inputCls} placeholder="+221 77 000 00 00"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ville</label>
                                <input value={data.ville} onChange={e => setData('ville', e.target.value)} className={inputCls} placeholder="Dakar"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pays</label>
                            <input value={data.pays} onChange={e => setData('pays', e.target.value)} className={inputCls} placeholder="Sénégal"/>
                        </div>
                    </div>
                </div>

                {/* Situation de handicap */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                        </div>
                        <h2 className="text-sm font-bold text-slate-900">Situation de handicap</h2>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Type de handicap</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {TYPES_HANDICAP.map(t => (
                                    <label key={t.val} className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.type_handicap === t.val ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                        <input type="radio" name="type_handicap" value={t.val} checked={data.type_handicap === t.val} onChange={e => setData('type_handicap', e.target.value)} className="sr-only"/>
                                        <span className="text-lg">{t.icon}</span>
                                        <span className="text-xs font-semibold text-slate-700">{t.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Niveau de dépendance — <span className="text-emerald-600">{data.niveau_dependance}/5</span>
                            </label>
                            <input type="range" min={1} max={5} value={data.niveau_dependance}
                                onChange={e => setData('niveau_dependance', Number(e.target.value))}
                                className="w-full accent-emerald-600"/>
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>Autonome</span><span>Assistance totale</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Besoins spécifiques</label>
                            <textarea value={data.besoins} onChange={e => setData('besoins', e.target.value)}
                                rows={3} placeholder="Décrivez vos besoins : type de fauteuil, équipements requis, régime alimentaire…"
                                className={inputCls}/>
                        </div>
                    </div>
                </div>

                {/* Bouton sauvegarder */}
                <div className="flex justify-end">
                    <button onClick={() => patch('/mon-espace/profil')} disabled={processing}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
                        {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                        Sauvegarder les modifications
                    </button>
                </div>

                {/* Changer mot de passe */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        </div>
                        <h2 className="text-sm font-bold text-slate-900">Changer le mot de passe</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {['current_password', 'password', 'password_confirmation'].map((field, i) => (
                            <div key={field}>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    {['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer le mot de passe'][i]}
                                </label>
                                <input type="password"
                                    value={(pwForm.data as any)[field]}
                                    onChange={e => pwForm.setData(field as any, e.target.value)}
                                    className={inputCls} placeholder="••••••••"/>
                                {(pwForm.errors as any)[field] && <p className="mt-1 text-xs text-red-500">{(pwForm.errors as any)[field]}</p>}
                            </div>
                        ))}
                        <div className="flex justify-end pt-2">
                            <button onClick={() => pwForm.patch('/mon-espace/profil/password')} disabled={pwForm.processing}
                                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
                                Mettre à jour
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </VoyageurLayout>
    );
}