import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../layout';

interface VoyageurOption { id: number; nom: string; type_handicap: string; niveau_dependance: number; }

export default function TransportCreate({ voyageurs = [] }: { voyageurs?: VoyageurOption[] }) {
    const { data, setData, post, processing, errors } = useForm({
        id_voyageur:     '',
        id_reservation:  '',
        type_vehicule:   '',
        ville_depart:    '',
        adresse_depart:  '',
        ville_arrivee:   '',
        adresse_arrivee: '',
        date_heure:      '',
        equipements:     [] as string[],
        instructions:    '',
        devise:          'XOF',
    });

    const submit: FormEventHandler = (e) => { e.preventDefault(); post('/transports'); };

    const TYPES_VEHICULES = [
        { val:'berline',  label:'Berline adaptée',   desc:'1–2 fauteuils pliants',         icon:'🚗' },
        { val:'van',      label:'Van PMR',            desc:'Lève-personne intégré, 1–3 PMR', icon:'🚐' },
        { val:'minibus',  label:'Minibus PMR',        desc:'4–8 PMR, rampe électrique',      icon:'🚌' },
        { val:'ambulance_legere',label:'Ambulance légère',   desc:'Transport médical non urgent',   icon:'🚑' },
    ];

    const EQUIPEMENTS_DISPO = [
        'Rampe d\'accès électrique',
        'Lève-personne',
        'Ceinture de maintien fauteuil',
        'Siège pivotant',
        'Bouteille O₂ à bord',
        'Brancard intégré',
        'Poignées de maintien',
        'Climatisation médicale',
    ];

    const toggleEq = (eq: string) => {
        const curr = data.equipements;
        setData('equipements', curr.includes(eq) ? curr.filter(e => e !== eq) : [...curr, eq]);
    };

    const inputCls = (err?: string) =>
        `w-full px-4 py-3 text-sm border-2 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:bg-white transition-all ${err ? 'border-red-300' : 'border-slate-200 focus:border-emerald-400 focus:shadow-sm focus:shadow-emerald-100'}`;

    const Field = ({ label, children, error }: { label:string; children:React.ReactNode; error?:string }) => (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );

    return (
        <DashboardLayout title="Réserver un transport" subtitle="Nouveau transport adapté PMR">
            <form onSubmit={submit}>
                <div className="max-w-4xl space-y-6">

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
                                <div className="grid gap-2 max-h-48 overflow-y-auto pr-1">
                                    {voyageurs.map(v => (
                                        <label key={v.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.id_voyageur === String(v.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                            <input type="radio" name="voyageur" value={String(v.id)} checked={data.id_voyageur === String(v.id)} onChange={e => setData('id_voyageur', e.target.value)} className="sr-only"/>
                                            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">
                                                {v.nom.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-slate-900">{v.nom}</p>
                                                <p className="text-xs text-slate-400 capitalize">{v.type_handicap} · Dépendance {v.niveau_dependance}/5</p>
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

                    {/* Type de véhicule */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-lg">🚐</div>
                            <h2 className="text-sm font-bold text-slate-900">Type de véhicule</h2>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-3">
                            {TYPES_VEHICULES.map(tv => (
                                <label key={tv.val} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${data.type_vehicule === tv.val ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <input type="radio" name="type_vehicule" value={tv.val} checked={data.type_vehicule === tv.val} onChange={e => setData('type_vehicule', e.target.value)} className="sr-only"/>
                                    <span className="text-2xl flex-shrink-0">{tv.icon}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">{tv.label}</p>
                                        <p className="text-xs text-slate-400">{tv.desc}</p>
                                    </div>
                                    {data.type_vehicule === tv.val && (
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Trajet */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                            </div>
                            <h2 className="text-sm font-bold text-slate-900">Trajet</h2>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-5">
                            <div className="space-y-4">
                                <Field label="Ville de départ *" error={errors.ville_depart}>
                                    <input value={data.ville_depart} onChange={e => setData('ville_depart', e.target.value)} placeholder="ex: Dakar" className={inputCls(errors.ville_depart)}/>
                                </Field>
                                <Field label="Adresse précise de départ *" error={errors.adresse_depart}>
                                    <input value={data.adresse_depart} onChange={e => setData('adresse_depart', e.target.value)} placeholder="Aéroport, hôtel, domicile…" className={inputCls(errors.adresse_depart)}/>
                                </Field>
                            </div>
                            <div className="space-y-4">
                                <Field label="Ville d'arrivée *" error={errors.ville_arrivee}>
                                    <input value={data.ville_arrivee} onChange={e => setData('ville_arrivee', e.target.value)} placeholder="ex: Dakar Centre" className={inputCls(errors.ville_arrivee)}/>
                                </Field>
                                <Field label="Adresse précise d'arrivée *" error={errors.adresse_arrivee}>
                                    <input value={data.adresse_arrivee} onChange={e => setData('adresse_arrivee', e.target.value)} placeholder="Hôtel, clinique, domicile…" className={inputCls(errors.adresse_arrivee)}/>
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field label="Date et heure de prise en charge *" error={errors.date_heure}>
                                    <input type="datetime-local" value={data.date_heure} onChange={e => setData('date_heure', e.target.value)} className={inputCls(errors.date_heure)}/>
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* Équipements */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                </div>
                                <h2 className="text-sm font-bold text-slate-900">Équipements requis</h2>
                            </div>
                            <span className="text-xs text-slate-400">{data.equipements.length} sélectionné(s)</span>
                        </div>
                        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                            {EQUIPEMENTS_DISPO.map(eq => (
                                <label key={eq} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${data.equipements.includes(eq) ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}
                                    onClick={() => toggleEq(eq)}>
                                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${data.equipements.includes(eq) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                                        {data.equipements.includes(eq) && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                    </div>
                                    <span className="text-xs font-medium text-slate-700 leading-tight">{eq}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-sm font-bold text-slate-900">Instructions spéciales</h2>
                        </div>
                        <div className="p-6">
                            <textarea
                                value={data.instructions}
                                onChange={e => setData('instructions', e.target.value)}
                                placeholder="Précisez ici : type de fauteuil roulant (manuel/électrique/dimensions), médicaments à bord, protocole médical particulier, niveau d'autonomie du voyageur…"
                                rows={4}
                                className={inputCls()}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                        <Link href="/transports" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || !data.id_voyageur || !data.type_vehicule || !data.ville_depart || !data.ville_arrivee || !data.date_heure}
                            className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                            Confirmer la réservation transport
                        </button>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}