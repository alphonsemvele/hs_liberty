import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../layout';

export default function ReservationCreate() {
    const { data, setData, post, processing, errors } = useForm({
        id_voyageur: '',
        id_hebergement: '',
        date_arrivee: '',
        date_depart: '',
        besoins_speciaux: '',
        id_professionnel: '',
        id_transport: '',
        devise: 'XOF',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reservations');
    };

    // Static options (à remplacer par les vraies données)
    const VOYAGEURS = [
        { id: 1, nom: 'Kofi Diarra',          type: 'moteur',    niveau: 3 },
        { id: 2, nom: 'Amina Mbaye',           type: 'sensoriel', niveau: 2 },
        { id: 3, nom: 'Jean-Baptiste Essomba', type: 'polyhandicap', niveau: 5 },
        { id: 4, nom: 'Fatou Touré',           type: 'moteur',    niveau: 2 },
        { id: 5, nom: 'Oumar Ndiaye',          type: 'cognitif',  niveau: 3 },
    ];

    const HEBERGEMENTS = [
        { id: 1, nom: 'Hôtel Azur Accessible',       ville: 'Dakar',       niveau: 'Excellence',      tarif: '31 000 F/nuit' },
        { id: 2, nom: 'Résidence PMR Casablanca',     ville: 'Casablanca',  niveau: 'Accessible Plus', tarif: '18 900 F/nuit' },
        { id: 3, nom: 'Villa Accessibilité Plus',     ville: 'Abidjan',     niveau: 'Accessible',      tarif: '35 000 F/nuit' },
        { id: 4, nom: 'Hôtel Liberté',                ville: 'Lomé',        niveau: 'Excellence',      tarif: '15 600 F/nuit' },
        { id: 6, nom: 'Riad Accessible',              ville: 'Marrakech',   niveau: 'Accessible',      tarif: '31 000 F/nuit' },
        { id: 8, nom: 'Hôtel Grand Confort PMR',      ville: 'Accra',       niveau: 'Accessible',      tarif: '29 000 F/nuit' },
    ];

    const PROFESSIONNELS = [
        { id: 1, nom: 'Dr. Fatima Sow',   specialite: 'Infirmière',        tarif: '15 000 F/h', pays: ['SN','MA'] },
        { id: 2, nom: 'Mohamed Benali',   specialite: 'Kinésithérapeute',  tarif: '20 000 F/h', pays: ['MA','DZ'] },
        { id: 3, nom: 'Alice Koffi',      specialite: 'Auxiliaire de vie', tarif: '8 000 F/h',  pays: ['CI','SN'] },
        { id: 5, nom: 'Marie Nkoue',      specialite: 'Infirmière',        tarif: '14 000 F/h', pays: ['CM','GA'] },
    ];

    const selVoyageur    = VOYAGEURS.find(v => String(v.id) === data.id_voyageur);
    const selHebergement = HEBERGEMENTS.find(h => String(h.id) === data.id_hebergement);

    const nbNuits = (() => {
        if (!data.date_arrivee || !data.date_depart) return 0;
        const a = new Date(data.date_arrivee);
        const d = new Date(data.date_depart);
        const diff = Math.ceil((d.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    })();

    const NIVEAU_BADGE: Record<string, string> = {
        'Excellence':      'bg-emerald-100 text-emerald-700',
        'Accessible Plus': 'bg-sky-100 text-sky-700',
        'Accessible':      'bg-teal-100 text-teal-700',
    };

    const Field = ({ label, error, children, hint }: { label: string; error?: string; children: React.ReactNode; hint?: string }) => (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
            {children}
            {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{error}</p>}
        </div>
    );

    const inputCls = (err?: string) =>
        `w-full px-4 py-3 text-sm border-2 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:bg-white transition-all ${err ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-emerald-400 focus:shadow-sm focus:shadow-emerald-100'}`;

    return (
        <DashboardLayout title="Nouvelle réservation" subtitle="Créer une réservation pour un voyageur">
            <form onSubmit={submit}>
                <div className="max-w-5xl grid xl:grid-cols-3 gap-6">

                    {/* ── COLONNE PRINCIPALE ── */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* Voyageur */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                </div>
                                <h2 className="text-sm font-bold text-slate-900">Voyageur</h2>
                            </div>
                            <div className="p-6">
                                <Field label="Sélectionner le voyageur *" error={errors.id_voyageur}>
                                    <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                                        {VOYAGEURS.map(v => (
                                            <label key={v.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.id_voyageur === String(v.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                                <input type="radio" name="voyageur" value={String(v.id)} checked={data.id_voyageur === String(v.id)} onChange={e => setData('id_voyageur', e.target.value)} className="sr-only"/>
                                                <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">
                                                    {v.nom.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-slate-900">{v.nom}</p>
                                                    <p className="text-xs text-slate-400 capitalize">{v.type} · Niveau {v.niveau}/5</p>
                                                </div>
                                                {data.id_voyageur === String(v.id) && (
                                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </Field>
                            </div>
                        </div>

                        {/* Hébergement */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h1M9 11h1M9 15h1M14 7h1M14 11h1M14 15h1"/></svg>
                                </div>
                                <h2 className="text-sm font-bold text-slate-900">Hébergement</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <Field label="Sélectionner l'hébergement *" error={errors.id_hebergement}>
                                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                                        {HEBERGEMENTS.map(h => (
                                            <label key={h.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.id_hebergement === String(h.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                                <input type="radio" name="hebergement" value={String(h.id)} checked={data.id_hebergement === String(h.id)} onChange={e => setData('id_hebergement', e.target.value)} className="sr-only"/>
                                                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700 flex-shrink-0">
                                                    {h.nom.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 truncate">{h.nom}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-slate-400">{h.ville}</span>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${NIVEAU_BADGE[h.niveau]}`}>{h.niveau}</span>
                                                        <span className="text-xs font-semibold text-emerald-600">{h.tarif}</span>
                                                    </div>
                                                </div>
                                                {data.id_hebergement === String(h.id) && (
                                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </Field>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Date d'arrivée *" error={errors.date_arrivee}>
                                        <input type="date" value={data.date_arrivee} onChange={e => setData('date_arrivee', e.target.value)} className={inputCls(errors.date_arrivee)}/>
                                    </Field>
                                    <Field label="Date de départ *" error={errors.date_depart}>
                                        <input type="date" value={data.date_depart} onChange={e => setData('date_depart', e.target.value)} className={inputCls(errors.date_depart)}/>
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* Services optionnels */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Services complémentaires</h2>
                                    <p className="text-xs text-slate-400">Optionnels — peuvent être ajoutés après la réservation</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                <Field label="Professionnel de santé (optionnel)">
                                    <select value={data.id_professionnel} onChange={e => setData('id_professionnel', e.target.value)} className={inputCls()}>
                                        <option value="">Aucun professionnel</option>
                                        {PROFESSIONNELS.map(p => (
                                            <option key={p.id} value={String(p.id)}>
                                                {p.nom} — {p.specialite} · {p.tarif} ({p.pays.join(', ')})
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Devise de facturation">
                                    <select value={data.devise} onChange={e => setData('devise', e.target.value)} className={inputCls()}>
                                        {[['XOF','Franc CFA (XOF)'],['EUR','Euro (EUR)'],['USD','Dollar USD'],['MAD','Dirham marocain (MAD)'],['KES','Shilling kényan (KES)'],['GHS','Cedi ghanéen (GHS)']].map(([code,label]) => (
                                            <option key={code} value={code}>{label}</option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Besoins spéciaux / Instructions particulières">
                                    <textarea
                                        value={data.besoins_speciaux}
                                        onChange={e => setData('besoins_speciaux', e.target.value)}
                                        placeholder="Précisez ici tout besoin spécifique : équipements nécessaires, régime alimentaire particulier, protocole médical à respecter…"
                                        rows={4}
                                        className={inputCls()}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* ── RÉCAPITULATIF ── */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden sticky top-24">
                            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="text-sm font-bold text-slate-900">Récapitulatif</h3>
                            </div>
                            <div className="p-5 space-y-4">

                                {/* Voyageur */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Voyageur</p>
                                    {selVoyageur ? (
                                        <div className="flex items-center gap-2.5 p-3 bg-violet-50 rounded-xl">
                                            <div className="w-8 h-8 rounded-lg bg-violet-200 flex items-center justify-center text-xs font-black text-violet-800">
                                                {selVoyageur.nom.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{selVoyageur.nom}</p>
                                                <p className="text-xs text-slate-500 capitalize">{selVoyageur.type}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non sélectionné</p>
                                    )}
                                </div>

                                {/* Hébergement */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Hébergement</p>
                                    {selHebergement ? (
                                        <div className="p-3 bg-emerald-50 rounded-xl">
                                            <p className="text-sm font-semibold text-slate-900">{selHebergement.nom}</p>
                                            <p className="text-xs text-slate-500">{selHebergement.ville} · {selHebergement.tarif}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non sélectionné</p>
                                    )}
                                </div>

                                {/* Dates */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Dates</p>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        {data.date_arrivee && data.date_depart ? (
                                            <div>
                                                <p className="text-sm text-slate-700">{data.date_arrivee} → {data.date_depart}</p>
                                                <p className="text-xs font-bold text-emerald-600 mt-0.5">{nbNuits} nuit{nbNuits > 1 ? 's' : ''}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-300 italic">Non renseignées</p>
                                        )}
                                    </div>
                                </div>

                                {/* Séparateur */}
                                <div className="border-t border-slate-100 pt-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-slate-500">Statut initial</span>
                                        <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">En attente</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">Devise</span>
                                        <span className="text-xs font-semibold text-slate-700">{data.devise}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-5 pb-5 space-y-2">
                                <button
                                    type="submit"
                                    disabled={processing || !data.id_voyageur || !data.id_hebergement || !data.date_arrivee || !data.date_depart}
                                    className="w-full py-3 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                                    Créer la réservation
                                </button>
                                <Link href="/reservations" className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-xl transition-colors flex items-center justify-center">
                                    Annuler
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}