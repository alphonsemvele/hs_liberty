import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Reservation {
    id: number; ref: string; initials: string; voyageur: string;
    hebergement: string; date_arrivee: string; date_depart: string;
    nb_nuits: number; statut: string; montant: string; devise: string; created_at: string;
}
interface Stats {
    total: number; confirmees: number; en_attente: number;
    terminees: number; annulees: number; revenus_mois: string;
}

const STATUT: Record<string, { badge: string; dot: string; label: string }> = {
    'En_attente': { badge: 'bg-amber-50 text-amber-700 border-amber-200',    dot: 'bg-amber-400',   label: 'En attente' },
    'Confirmee':  { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Confirmée'  },
    'Terminee':   { badge: 'bg-slate-100 text-slate-500 border-slate-200',    dot: 'bg-slate-400',   label: 'Terminée'   },
    'Annulee':    { badge: 'bg-red-50 text-red-600 border-red-200',           dot: 'bg-red-400',     label: 'Annulée'    },
    'Litige':     { badge: 'bg-orange-50 text-orange-600 border-orange-200',  dot: 'bg-orange-400',  label: 'Litige'     },
    // fallback pour les valeurs déjà capitalisées
    'En attente': { badge: 'bg-amber-50 text-amber-700 border-amber-200',    dot: 'bg-amber-400',   label: 'En attente' },
    'Confirmée':  { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Confirmée'  },
    'Terminée':   { badge: 'bg-slate-100 text-slate-500 border-slate-200',    dot: 'bg-slate-400',   label: 'Terminée'   },
    'Annulée':    { badge: 'bg-red-50 text-red-600 border-red-200',           dot: 'bg-red-400',     label: 'Annulée'    },
};

function Badge({ statut }: { statut: string }) {
    const cfg = STATUT[statut] ?? { badge: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400', label: statut };
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
            {cfg.label}
        </span>
    );
}

export default function ReservationsIndex({
    reservations = [],
    stats = { total:0, confirmees:0, en_attente:0, terminees:0, annulees:0, revenus_mois:'0 XOF' },
}: { reservations?: Reservation[]; stats?: Stats }) {
    return (
        <DashboardLayout title="Réservations" subtitle="Suivi de toutes les réservations">

            {/* KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                {[
                    { label: 'Total',       value: stats.total,      color: 'text-slate-900',   bg: 'bg-slate-50'   },
                    { label: 'Confirmées',  value: stats.confirmees, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'En attente',  value: stats.en_attente, color: 'text-amber-600',   bg: 'bg-amber-50'   },
                    { label: 'Terminées',   value: stats.terminees,  color: 'text-slate-400',   bg: 'bg-slate-50'   },
                    { label: 'Annulées',    value: stats.annulees,   color: 'text-red-500',     bg: 'bg-red-50'     },
                    { label: 'Revenus',     value: stats.revenus_mois, color: 'text-teal-600',  bg: 'bg-teal-50', small: true },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className={`font-extrabold ${s.color} ${(s as any).small ? 'text-base' : 'text-2xl'}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input placeholder="Ref, voyageur, hébergement…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-64"/>
                    </div>
                    <select className="text-sm border border-slate-200 rounded-xl bg-white px-3 py-2 focus:outline-none text-slate-600">
                        <option>Tous les statuts</option>
                        <option>Confirmée</option>
                        <option>En attente</option>
                        <option>Terminée</option>
                        <option>Annulée</option>
                    </select>
                </div>
                <Link href="/reservations/create" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/></svg>
                    Nouvelle réservation
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>{['Référence','Voyageur','Hébergement','Dates','Nuits','Montant','Statut','Actions'].map(h=>(
                                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {reservations.map(r => (
                                <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-5 py-4">
                                        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">{r.ref}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">{r.initials}</div>
                                            <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{r.voyageur}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-slate-600 max-w-[180px] truncate block">{r.hebergement}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                            <span>{r.date_arrivee}</span>
                                            <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                                            <span>{r.date_depart}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-semibold text-slate-700">{r.nb_nuits}n</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-bold text-slate-900">{r.montant}</span>
                                    </td>
                                    <td className="px-5 py-4"><Badge statut={r.statut}/></td>
                                    <td className="px-5 py-4">
                                        <Link href={`/reservations/${r.id}`} className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">Voir →</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {reservations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                            <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-600 mb-1">Aucune réservation</p>
                        <p className="text-xs text-slate-400 mb-4">Créez la première réservation de la plateforme</p>
                        <Link href="/reservations/create" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">+ Nouvelle réservation →</Link>
                    </div>
                )}

                {reservations.length > 0 && (
                    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-400">{reservations.length} réservation(s)</p>
                        <div className="flex gap-1">
                            <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Préc.</button>
                            <button className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg">1</button>
                            <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Suiv.</button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}