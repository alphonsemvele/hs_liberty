import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../layout';

const VOYAGEURS = [
    { id:1, nom:'Kofi Diarra',           type:'Moteur',        niveau:3 },
    { id:2, nom:'Amina Mbaye',            type:'Sensoriel',     niveau:2 },
    { id:3, nom:'Jean-Baptiste Essomba',  type:'Polyhandicap',  niveau:5 },
    { id:4, nom:'Fatou Touré',            type:'Moteur',        niveau:2 },
    { id:5, nom:'Oumar Ndiaye',           type:'Cognitif',      niveau:3 },
    { id:6, nom:'Sophie Eteki',           type:'Moteur',        niveau:4 },
];

const TYPES_VEHICULES = [
    { val:'berline',   label:'Berline adaptée',   desc:'1–2 fauteuils pliants, siège pivotant',    icon:'🚗' },
    { val:'van',       label:'Van PMR',            desc:'Lève-personne intégré, 1–3 personnes PMR', icon:'🚐' },
    { val:'minibus',   label:'Minibus PMR',        desc:'4–8 personnes PMR, rampe électrique',      icon:'🚌' },
    { val:'ambulance', label:'Ambulance légère',   desc:'Transport médical non urgent',             icon:'🚑' },
];

const EQUIPEMENTS = [
    "Rampe d'accès électrique",
    'Lève-personne',
    'Ceinture de maintien fauteuil',
    'Siège pivotant',
    'Bouteille O₂ à bord',
    'Brancard intégré',
    'Poignées de maintien',
    'Climatisation médicale',
];

export default function TransportCreate() {
    const { data, setData, post, processing, errors } = useForm({
        id_voyageur:     '',
        type_vehicule:   '',
        ville_depart:    '',
        adresse_depart:  '',
        ville_arrivee:   '',
        adresse_arrivee: '',
        date_heure:      '',
        equipements:     [] as string[],
        instructions:    '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/transports');
    };

    const toggleEq = (eq: string) => {
        const curr = data.equipements;
        setData('equipements', curr.includes(eq) ? curr.filter(e => e !== eq) : [...curr, eq]);
    };

    const input = (err?: string) =>
        `w-full px-4 py-3 text-sm border-2 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-300
         focus:outline-none focus:bg-white transition-all
         ${err ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-emerald-400 focus:shadow-sm focus:shadow-emerald-100'}`;

    const selVoyageur = VOYAGEURS.find(v => String(v.id) === data.id_voyageur);
    const selVehicule = TYPES_VEHICULES.find(t => t.val === data.type_vehicule);

    const SectionCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    {icon}
                </div>
                <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );

    const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            {children}
            {error && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );

    return (
        <DashboardLayout title="Réserver un transport" subtitle="Nouveau transport adapté PMR">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/transports" className="text-slate-400 hover:text-emerald-600 transition-colors">Transports</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">Nouvelle réservation</span>
            </div>

            <form onSubmit={submit}>
                <div className="max-w-5xl grid xl:grid-cols-3 gap-6">

                    {/* ── COLONNE PRINCIPALE ── */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* 1. Voyageur */}
                        <SectionCard
                            icon={<svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}
                            title="Voyageur *"
                        >
                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                {VOYAGEURS.map(v => (
                                    <label key={v.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                                            ${data.id_voyageur === String(v.id)
                                                ? 'border-emerald-400 bg-emerald-50'
                                                : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                        <input type="radio" name="voyageur" value={String(v.id)}
                                            checked={data.id_voyageur === String(v.id)}
                                            onChange={e => setData('id_voyageur', e.target.value)}
                                            className="sr-only"/>
                                        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">
                                            {v.nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{v.nom}</p>
                                            <p className="text-xs text-slate-400">{v.type} · Dépendance {v.niveau}/5</p>
                                        </div>
                                        {data.id_voyageur === String(v.id) && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                            {errors.id_voyageur && <p className="mt-2 text-xs text-red-500">{errors.id_voyageur}</p>}
                        </SectionCard>

                        {/* 2. Type véhicule */}
                        <SectionCard
                            icon={<span className="text-base">🚐</span>}
                            title="Type de véhicule *"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                {TYPES_VEHICULES.map(tv => (
                                    <label key={tv.val}
                                        className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all
                                            ${data.type_vehicule === tv.val
                                                ? 'border-emerald-400 bg-emerald-50'
                                                : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                        <input type="radio" name="type_vehicule" value={tv.val}
                                            checked={data.type_vehicule === tv.val}
                                            onChange={e => setData('type_vehicule', e.target.value)}
                                            className="sr-only"/>
                                        <span className="text-2xl flex-shrink-0 mt-0.5">{tv.icon}</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">{tv.label}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{tv.desc}</p>
                                        </div>
                                        {data.type_vehicule === tv.val && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                            {errors.type_vehicule && <p className="mt-2 text-xs text-red-500">{errors.type_vehicule}</p>}
                        </SectionCard>

                        {/* 3. Trajet */}
                        <SectionCard
                            icon={<svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>}
                            title="Trajet"
                        >
                            <div className="grid md:grid-cols-2 gap-5">
                                {/* Départ */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500"/>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Départ</span>
                                    </div>
                                    <Field label="Ville *" error={errors.ville_depart}>
                                        <input value={data.ville_depart} onChange={e => setData('ville_depart', e.target.value)} placeholder="ex: Dakar" className={input(errors.ville_depart)}/>
                                    </Field>
                                    <Field label="Adresse précise *" error={errors.adresse_depart}>
                                        <input value={data.adresse_depart} onChange={e => setData('adresse_depart', e.target.value)} placeholder="Aéroport, hôtel, domicile…" className={input(errors.adresse_depart)}/>
                                    </Field>
                                </div>

                                {/* Flèche mobile */}
                                <div className="md:hidden flex items-center gap-2 -mt-2 -mb-2">
                                    <div className="flex-1 h-px bg-slate-200"/>
                                    <svg className="w-5 h-5 text-emerald-400 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                    <div className="flex-1 h-px bg-slate-200"/>
                                </div>

                                {/* Arrivée */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-3 h-3 rounded-full bg-slate-400"/>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Arrivée</span>
                                    </div>
                                    <Field label="Ville *" error={errors.ville_arrivee}>
                                        <input value={data.ville_arrivee} onChange={e => setData('ville_arrivee', e.target.value)} placeholder="ex: Dakar Centre" className={input(errors.ville_arrivee)}/>
                                    </Field>
                                    <Field label="Adresse précise *" error={errors.adresse_arrivee}>
                                        <input value={data.adresse_arrivee} onChange={e => setData('adresse_arrivee', e.target.value)} placeholder="Hôtel, clinique, domicile…" className={input(errors.adresse_arrivee)}/>
                                    </Field>
                                </div>
                            </div>

                            {/* Date/heure */}
                            <div className="mt-5">
                                <Field label="Date et heure de prise en charge *" error={errors.date_heure}>
                                    <input type="datetime-local" value={data.date_heure} onChange={e => setData('date_heure', e.target.value)} className={input(errors.date_heure)}/>
                                </Field>
                            </div>
                        </SectionCard>

                        {/* 4. Équipements */}
                        <SectionCard
                            icon={<svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                            title={`Équipements requis ${data.equipements.length > 0 ? `· ${data.equipements.length} sélectionné(s)` : ''}`}
                        >
                            <div className="grid grid-cols-2 gap-2.5">
                                {EQUIPEMENTS.map(eq => {
                                    const checked = data.equipements.includes(eq);
                                    return (
                                        <label key={eq} onClick={() => toggleEq(eq)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                                                ${checked ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                                                ${checked ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                                                {checked && (
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                                )}
                                            </div>
                                            <span className={`text-xs font-medium leading-tight ${checked ? 'text-emerald-800' : 'text-slate-600'}`}>{eq}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </SectionCard>

                        {/* 5. Instructions */}
                        <SectionCard
                            icon={<svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>}
                            title="Instructions spéciales"
                        >
                            <textarea
                                value={data.instructions}
                                onChange={e => setData('instructions', e.target.value)}
                                placeholder="Type de fauteuil (manuel / électrique / dimensions), médicaments à bord, protocole médical, niveau d'autonomie du voyageur, personnes accompagnantes…"
                                rows={4}
                                className={input()}
                            />
                            <p className="text-xs text-slate-400 mt-2">Ces informations seront transmises directement au conducteur.</p>
                        </SectionCard>
                    </div>

                    {/* ── RÉCAPITULATIF STICKY ── */}
                    <div className="space-y-4">
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
                                                {selVoyageur.nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{selVoyageur.nom}</p>
                                                <p className="text-xs text-slate-500">{selVoyageur.type} · Dépendance {selVoyageur.niveau}/5</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non sélectionné</p>
                                    )}
                                </div>

                                {/* Véhicule */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Véhicule</p>
                                    {selVehicule ? (
                                        <div className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-xl">
                                            <span className="text-xl">{selVehicule.icon}</span>
                                            <p className="text-sm font-semibold text-slate-900">{selVehicule.label}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non sélectionné</p>
                                    )}
                                </div>

                                {/* Trajet */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Trajet</p>
                                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                                        {data.ville_depart ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"/>
                                                    <p className="text-xs font-semibold text-slate-700">{data.ville_depart}</p>
                                                </div>
                                                <div className="w-px h-3 bg-slate-300 ml-0.5"/>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0"/>
                                                    <p className="text-xs font-semibold text-slate-700">{data.ville_arrivee || '—'}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-sm text-slate-300 italic">Non renseigné</p>
                                        )}
                                    </div>
                                </div>

                                {/* Date */}
                                {data.date_heure && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date & heure</p>
                                        <p className="text-sm font-semibold text-slate-700 p-3 bg-slate-50 rounded-xl">{data.date_heure.replace('T', ' à ')}</p>
                                    </div>
                                )}

                                {/* Équipements */}
                                {data.equipements.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Équipements</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {data.equipements.map(eq => (
                                                <span key={eq} className="text-[10px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{eq}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-slate-100 pt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">Statut initial</span>
                                        <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">En attente</span>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons */}
                            <div className="px-5 pb-5 space-y-2">
                                <button type="submit"
                                    disabled={processing || !data.id_voyageur || !data.type_vehicule || !data.ville_depart || !data.ville_arrivee || !data.date_heure}
                                    className="w-full py-3 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {processing && (
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                        </svg>
                                    )}
                                    Confirmer la réservation
                                </button>
                                <Link href="/transports" className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-xl transition-colors flex items-center justify-center">
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