// ═══════════════════════════════════════════════════════════════
// resources/js/pages/transports/index.tsx
// ═══════════════════════════════════════════════════════════════
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../layout';

interface Transport {
    id: number;
    ref: string;
    voyageur: string;
    voyageur_initials: string;
    type_vehicule: string;
    equipements: string[];
    prestataire: string;
    ville_depart: string;
    ville_arrivee: string;
    date_heure: string;
    statut: 'Confirmé' | 'En attente' | 'En cours' | 'Terminé' | 'Annulé';
    montant: string;
}

interface Stats {
    total: number;
    confirmes: number;
    en_attente: number;
    en_cours: number;
    termines: number;
}

interface Props { transports: Transport[]; stats: Stats; }

const DEFAUT_TRANSPORTS: Transport[] = [
    { id:1, ref:'TR-2026-001', voyageur:'Kofi Diarra',          voyageur_initials:'KD', type_vehicule:'Minibus PMR',     equipements:['Rampe électrique','Ceinture fauteuil'],         prestataire:'AccessMobil Dakar',   ville_depart:'Aéroport LSS — Dakar',       ville_arrivee:'Hôtel Azur Accessible',           date_heure:'12/04/2026 14:30', statut:'Terminé',    montant:'12 000 F' },
    { id:2, ref:'TR-2026-002', voyageur:'Amina Mbaye',           voyageur_initials:'AM', type_vehicule:'Berline adaptée', equipements:['Siège pivotant','Poignée de maintien'],         prestataire:'Maroc Accessible',    ville_depart:'Aéroport CMN — Casablanca',  ville_arrivee:'Résidence PMR Casablanca',         date_heure:'15/04/2026 16:00', statut:'Confirmé',   montant:'18 000 F' },
    { id:3, ref:'TR-2026-003', voyageur:'Fatou Touré',           voyageur_initials:'FT', type_vehicule:'Van PMR',         equipements:['Lève-personne','Rampe','Brancard'],             prestataire:'Lomé Mobilité Plus',  ville_depart:'Gare ferroviaire — Lomé',    ville_arrivee:'Hôtel Liberté',                   date_heure:'20/04/2026 10:15', statut:'En attente', montant:'8 500 F'  },
    { id:4, ref:'TR-2026-004', voyageur:'Sophie Eteki',          voyageur_initials:'SE', type_vehicule:'Berline adaptée', equipements:['Siège pivotant'],                              prestataire:'Atlas Transport PMR', ville_depart:'Aéroport RAK — Marrakech',   ville_arrivee:'Riad Accessible',                 date_heure:'25/04/2026 19:45', statut:'En attente', montant:'22 000 F' },
    { id:5, ref:'TR-2026-005', voyageur:'Jean-Baptiste Essomba', voyageur_initials:'JB', type_vehicule:'Minibus PMR',     equipements:['Rampe électrique','Ceinture fauteuil','O₂'],   prestataire:'CI Mobilité Adaptée', ville_depart:'Hôtel',                       ville_arrivee:'Aéroport ABJ — Abidjan',          date_heure:'14/04/2026 08:00', statut:'Terminé',    montant:'14 000 F' },
    { id:6, ref:'TR-2026-006', voyageur:'Danielle Kanga',        voyageur_initials:'DK', type_vehicule:'Van PMR',         equipements:['Lève-personne','Fauteuil roulant de prêt'],    prestataire:'GH AccessTransport',  ville_depart:'Aéroport ACC — Accra',        ville_arrivee:'Hôtel Grand Confort PMR',          date_heure:'01/05/2026 12:00', statut:'En cours',   montant:'19 500 F' },
];

const DEFAUT_STATS: Stats = { total:6, confirmes:2, en_attente:2, en_cours:1, termines:2 };

const STATUT_CONF: Record<string, { badge: string; dot: string }> = {
    'Confirmé':   { badge:'bg-emerald-50 text-emerald-700 border-emerald-100', dot:'bg-emerald-500' },
    'En attente': { badge:'bg-amber-50 text-amber-700 border-amber-100',       dot:'bg-amber-500'   },
    'En cours':   { badge:'bg-blue-50 text-blue-700 border-blue-100',          dot:'bg-blue-500'    },
    'Terminé':    { badge:'bg-slate-100 text-slate-500 border-slate-200',      dot:'bg-slate-400'   },
    'Annulé':     { badge:'bg-red-50 text-red-600 border-red-100',             dot:'bg-red-400'     },
};

export function TransportsIndex({ transports = DEFAUT_TRANSPORTS, stats = DEFAUT_STATS }: Partial<Props>) {
    return (
        <DashboardLayout title="Transports Adaptés" subtitle="Réservations de transport PMR certifié">

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {[
                    { l:'Total',       v:stats.total,       c:'text-slate-900' },
                    { l:'Confirmés',   v:stats.confirmes,   c:'text-emerald-600' },
                    { l:'En attente',  v:stats.en_attente,  c:'text-amber-600' },
                    { l:'En cours',    v:stats.en_cours,    c:'text-blue-600' },
                    { l:'Terminés',    v:stats.termines,    c:'text-slate-400' },
                ].map(s => (
                    <div key={s.l} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.l}</p>
                        <p className={`text-2xl font-extrabold ${s.c}`}>{s.v}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input placeholder="Voyageur, réf, ville…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-56"/>
                    </div>
                    <div className="flex gap-1.5">
                        {(['Tous','Confirmé','En attente','En cours','Terminé'] as const).map(s => (
                            <button key={s} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${s === 'Tous' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <Link href="/transports/create" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/></svg>
                    Réserver un transport
                </Link>
            </div>

            {/* Cards transports */}
            <div className="space-y-3">
                {transports.map(t => {
                    const sc = STATUT_CONF[t.statut];
                    return (
                        <div key={t.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-emerald-100 hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    {/* Icône véhicule */}
                                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                                        </svg>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="text-xs font-mono font-semibold text-slate-400">{t.ref}</span>
                                            <span className="text-xs font-semibold text-slate-600">—</span>
                                            <span className="text-sm font-bold text-slate-900">{t.type_vehicule}</span>
                                            <span className="text-xs text-slate-400">· {t.prestataire}</span>
                                        </div>

                                        {/* Trajet */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-sm font-semibold text-slate-700">{t.ville_depart}</span>
                                            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                            <span className="text-sm font-semibold text-slate-700">{t.ville_arrivee}</span>
                                        </div>

                                        {/* Voyageur + équipements + date */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center text-[10px] font-black text-violet-700">{t.voyageur_initials}</div>
                                                <span className="text-xs text-slate-600 font-medium">{t.voyageur}</span>
                                            </div>
                                            <span className="text-slate-200">·</span>
                                            <div className="flex gap-1.5">
                                                {t.equipements.map(eq => (
                                                    <span key={eq} className="text-[10px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{eq}</span>
                                                ))}
                                            </div>
                                            <span className="text-slate-200">·</span>
                                            <span className="text-xs text-slate-500">{t.date_heure}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Droite */}
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${sc.badge}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${t.statut === 'En cours' ? 'animate-pulse' : ''}`}/>
                                        {t.statut}
                                    </span>
                                    <span className="text-base font-black text-slate-900">{t.montant}</span>
                                    <Link href={`/transports/${t.id}`} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                                        Détails →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </DashboardLayout>
    );
}

// ═══════════════════════════════════════════════════════════════
// resources/js/pages/transports/create.tsx
// ═══════════════════════════════════════════════════════════════
export function TransportCreate() {
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

    const VOYAGEURS = [
        { id:1, nom:'Kofi Diarra',          type:'moteur',       niveau:3 },
        { id:2, nom:'Amina Mbaye',           type:'sensoriel',    niveau:2 },
        { id:3, nom:'Jean-Baptiste Essomba', type:'polyhandicap', niveau:5 },
        { id:4, nom:'Fatou Touré',           type:'moteur',       niveau:2 },
        { id:6, nom:'Sophie Eteki',          type:'moteur',       niveau:4 },
    ];

    const TYPES_VEHICULES = [
        { val:'berline',  label:'Berline adaptée',   desc:'1–2 fauteuils pliants',         icon:'🚗' },
        { val:'van',      label:'Van PMR',            desc:'Lève-personne intégré, 1–3 PMR', icon:'🚐' },
        { val:'minibus',  label:'Minibus PMR',        desc:'4–8 PMR, rampe électrique',      icon:'🚌' },
        { val:'ambulance',label:'Ambulance légère',   desc:'Transport médical non urgent',   icon:'🚑' },
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
                                    {VOYAGEURS.map(v => (
                                        <label key={v.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.id_voyageur === String(v.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                            <input type="radio" name="voyageur" value={String(v.id)} checked={data.id_voyageur === String(v.id)} onChange={e => setData('id_voyageur', e.target.value)} className="sr-only"/>
                                            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">
                                                {v.nom.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-slate-900">{v.nom}</p>
                                                <p className="text-xs text-slate-400 capitalize">{v.type} · Dépendance {v.niveau}/5</p>
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

export default TransportsIndex;