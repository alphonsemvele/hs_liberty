import { Link, router } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface ReservationDetail {
    id: number; ref: string; initials: string; voyageur: string; voyageur_id: number;
    hebergement: string; hebergement_id: number; ville: string; pays: string;
    date_arrivee: string; date_depart: string; nb_nuits: number; nb_voyageurs: number;
    statut: string; paiement_statut: string; montant: string; montant_raw: number;
    devise: string; besoins_speciaux: string | null; created_at: string;
}

const STATUT_CFG: Record<string, { badge: string; dot: string; label: string; icon: string }> = {
    en_attente: { badge: 'bg-amber-50 text-amber-700 border-amber-200',      dot: 'bg-amber-400',   label: 'En attente', icon: '⏳' },
    confirmee:  { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Confirmée',  icon: '✅' },
    terminee:   { badge: 'bg-slate-100 text-slate-500 border-slate-200',      dot: 'bg-slate-400',   label: 'Terminée',   icon: '🏁' },
    annulee:    { badge: 'bg-red-50 text-red-600 border-red-200',             dot: 'bg-red-400',     label: 'Annulée',    icon: '❌' },
    litige:     { badge: 'bg-orange-50 text-orange-600 border-orange-200',    dot: 'bg-orange-400',  label: 'Litige',     icon: '⚠️' },
};

const PAIEMENT_CFG: Record<string, { badge: string; label: string }> = {
    non_paye:                { badge: 'bg-red-50 text-red-500 border-red-100',         label: 'Non payé'              },
    en_attente:              { badge: 'bg-amber-50 text-amber-600 border-amber-100',   label: 'Paiement en attente'   },
    paye:                    { badge: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Payé'              },
    rembourse:               { badge: 'bg-sky-50 text-sky-600 border-sky-100',         label: 'Remboursé'             },
    partiellement_rembourse: { badge: 'bg-violet-50 text-violet-600 border-violet-100', label: 'Part. remboursé'     },
};

const TRANSITIONS: Record<string, string[]> = {
    en_attente: ['confirmee', 'annulee'],
    confirmee:  ['terminee',  'annulee', 'litige'],
    terminee:   [],
    annulee:    [],
    litige:     ['confirmee', 'annulee'],
};

export default function ReservationShow({ reservation }: { reservation: ReservationDetail }) {
    const r   = reservation;
    const cfg = STATUT_CFG[r.statut] ?? STATUT_CFG.en_attente;
    const pcfg = PAIEMENT_CFG[r.paiement_statut] ?? PAIEMENT_CFG.non_paye;
    const transitions = TRANSITIONS[r.statut] ?? [];

    const changeStatut = (statut: string) => {
        if (confirm(`Passer la réservation en "${STATUT_CFG[statut]?.label}" ?`)) {
            router.put(`/reservations/${r.id}/statut`, { statut });
        }
    };

    const STATUT_BTN: Record<string, string> = {
        confirmee: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        terminee:  'bg-slate-600 hover:bg-slate-700 text-white',
        annulee:   'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200',
        litige:    'bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-200',
    };

    return (
        <DashboardLayout title={`Réservation ${r.ref}`} subtitle={`${r.hebergement} · ${r.ville}, ${r.pays}`}>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/reservations" className="text-slate-400 hover:text-emerald-600 transition-colors">Réservations</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="font-mono text-emerald-700 font-bold">{r.ref}</span>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">

                    {/* Hero card */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        {/* Banner gradient */}
                        <div className="h-36 bg-gradient-to-br from-teal-600 via-emerald-600 to-emerald-500 relative p-6 flex items-end justify-between">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 80%, white, transparent 60%)' }}/>
                            <div className="relative z-10">
                                <p className="text-emerald-200 text-xs font-mono mb-1">{r.ref}</p>
                                <h1 className="text-xl font-black text-white leading-tight">{r.hebergement}</h1>
                                <p className="text-emerald-200 text-sm">{r.ville}, {r.pays}</p>
                            </div>
                            <div className="relative z-10 text-right">
                                <p className="text-2xl font-black text-white">{r.montant}</p>
                                <p className="text-emerald-200 text-xs">{r.nb_nuits} nuit(s)</p>
                            </div>
                        </div>

                        {/* Statut + paiement */}
                        <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
                            <div className="p-5 flex items-center gap-3">
                                <span className="text-2xl">{cfg.icon}</span>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium mb-1">Statut réservation</p>
                                    <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full border ${cfg.badge}`}>
                                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`}/>
                                        {cfg.label}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium mb-1">Paiement</p>
                                    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${pcfg.badge}`}>
                                        {pcfg.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Détails séjour */}
                        <div className="p-6">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Détails du séjour</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: '📅', label: 'Arrivée',    value: r.date_arrivee },
                                    { icon: '📅', label: 'Départ',     value: r.date_depart  },
                                    { icon: '🌙', label: 'Durée',      value: `${r.nb_nuits} nuit(s)` },
                                    { icon: '👤', label: 'Voyageurs',  value: `${r.nb_voyageurs} pers.` },
                                ].map(item => (
                                    <div key={item.label} className="bg-slate-50 rounded-xl p-4 text-center">
                                        <p className="text-lg mb-1">{item.icon}</p>
                                        <p className="text-xs text-slate-400 font-medium mb-1">{item.label}</p>
                                        <p className="text-sm font-bold text-slate-900">{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {r.besoins_speciaux && (
                                <div className="mt-5 p-4 bg-sky-50 rounded-xl border border-sky-100">
                                    <p className="text-xs font-bold text-sky-700 mb-1">Besoins spéciaux</p>
                                    <p className="text-sm text-sky-800">{r.besoins_speciaux}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Voyageur */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">Voyageur</h3>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-base font-black text-violet-700">
                                    {r.initials}
                                </div>
                                <div>
                                    <p className="text-base font-bold text-slate-900">{r.voyageur}</p>
                                    <p className="text-xs text-slate-400">Voyageur enregistré</p>
                                </div>
                            </div>
                            <Link href={`/voyageurs/${r.voyageur_id}`} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                Voir le profil →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">

                    {/* Actions statut */}
                    {transitions.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-5">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Changer le statut</p>
                            <div className="space-y-2">
                                {transitions.map(s => (
                                    <button key={s} onClick={() => changeStatut(s)}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${STATUT_BTN[s] ?? 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                                        {STATUT_CFG[s]?.icon} {STATUT_CFG[s]?.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Infos rapides */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Informations</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { label: 'Référence',   value: r.ref },
                                { label: 'Créée le',    value: r.created_at },
                                { label: 'Hébergement', value: r.hebergement },
                                { label: 'Montant',     value: r.montant },
                                { label: 'Devise',      value: r.devise },
                                { label: 'Paiement',    value: PAIEMENT_CFG[r.paiement_statut]?.label ?? r.paiement_statut },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between px-5 py-3">
                                    <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                                    <span className="text-sm font-semibold text-slate-900 text-right max-w-[140px] truncate">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Liens rapides */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Liens rapides</p>
                        <Link href={`/hebergements/${r.hebergement_id}`}
                            className="w-full flex items-center gap-3 px-4 py-2.5 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl text-sm font-medium transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18"/></svg>
                            Voir l'hébergement
                        </Link>
                        <Link href={`/voyageurs/${r.voyageur_id}`}
                            className="w-full flex items-center gap-3 px-4 py-2.5 border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-600 hover:text-violet-700 rounded-xl text-sm font-medium transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            Voir le voyageur
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}