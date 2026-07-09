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
    equipements: string[] | null | undefined;
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

const STATUT_LABEL: Record<string, string> = {
    'en_attente': 'En attente',
    'confirme':   'Confirmé',
    'en_cours':   'En cours',
    'termine':    'Terminé',
    'annule':     'Annulé',
};

const STATUT_CONF: Record<string, { badge: string; dot: string }> = {
    'Confirmé':   { badge:'bg-emerald-50 text-emerald-700 border-emerald-100', dot:'bg-emerald-500' },
    'En attente': { badge:'bg-amber-50 text-amber-700 border-amber-100',       dot:'bg-amber-500'   },
    'En cours':   { badge:'bg-blue-50 text-blue-700 border-blue-100',          dot:'bg-blue-500'    },
    'Terminé':    { badge:'bg-slate-100 text-slate-500 border-slate-200',      dot:'bg-slate-400'   },
    'Annulé':     { badge:'bg-red-50 text-red-600 border-red-100',             dot:'bg-red-400'     },
};

export default function TransportsIndex({ transports = DEFAUT_TRANSPORTS, stats = DEFAUT_STATS }: Partial<Props>) {
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
                    const sc = STATUT_CONF[t.statut] ?? STATUT_CONF['En attente'];
                    const equipements = t.equipements ?? [];
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
                                                {equipements.map(eq => (
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
                                        {STATUT_LABEL[t.statut] ?? t.statut}
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