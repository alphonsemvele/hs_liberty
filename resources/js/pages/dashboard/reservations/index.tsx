import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Reservation {
    id: number; ref: string; initials: string; voyageur: string; hebergement: string;
    date_arrivee: string; date_depart: string; nb_nuits: number;
    statut: 'Confirmée' | 'En attente' | 'Terminée' | 'Annulée';
    montant: string; devise: string; created_at: string;
}
interface Stats { total:number; confirmees:number; en_attente:number; terminees:number; annulees:number; ce_mois:number; revenus_mois:string; }
interface Props { reservations: Reservation[]; stats: Stats; }

const STATUT_STYLE: Record<string, string> = {
    'Confirmée':  'bg-emerald-50 text-emerald-700 border-emerald-100',
    'En attente': 'bg-amber-50 text-amber-700 border-amber-100',
    'Terminée':   'bg-slate-100 text-slate-500 border-slate-200',
    'Annulée':    'bg-red-50 text-red-600 border-red-100',
};
const STATUT_DOT: Record<string, string> = {
    'Confirmée': 'bg-emerald-500', 'En attente': 'bg-amber-500',
    'Terminée':  'bg-slate-400',   'Annulée':    'bg-red-400',
};

export default function ReservationsIndex({ reservations = [], stats = { total:0, confirmees:0, en_attente:0, terminees:0, annulees:0, ce_mois:0, revenus_mois:'—' } }: Partial<Props>) {
    return (
        <DashboardLayout title="Réservations" subtitle="Suivi de toutes les réservations">

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <p className="text-xs text-slate-400 font-medium mb-1">Ce mois</p>
                    <p className="text-2xl font-extrabold text-slate-900">{stats.ce_mois}</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">+12% vs mois dernier</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <p className="text-xs text-slate-400 font-medium mb-1">Revenus du mois</p>
                    <p className="text-2xl font-extrabold text-slate-900">{stats.revenus_mois}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <p className="text-xs text-slate-400 font-medium mb-1">Confirmées</p>
                    <p className="text-2xl font-extrabold text-emerald-600">{stats.confirmees}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <p className="text-xs text-slate-400 font-medium mb-1">En attente</p>
                    <p className="text-2xl font-extrabold text-amber-600">{stats.en_attente}</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input placeholder="Voyageur, ref…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-56"/>
                    </div>
                    <div className="flex gap-1.5">
                        {(['Tous', 'Confirmée', 'En attente', 'Terminée', 'Annulée'] as const).map(s => (
                            <button key={s} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${s === 'Tous' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
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
                            <tr>
                                {['Réf.','Voyageur','Hébergement','Dates','Nuits','Montant','Statut','Actions'].map(h => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {reservations.map(r => (
                                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <span className="text-xs font-mono font-semibold text-slate-500">{r.ref}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-xs font-black text-emerald-700 flex-shrink-0">{r.initials}</div>
                                            <span className="text-sm font-semibold text-slate-900">{r.voyageur}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 max-w-[200px]">
                                        <span className="text-sm text-slate-600 truncate block">{r.hebergement}</span>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className="text-xs text-slate-600">{r.date_arrivee} → {r.date_depart}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-semibold text-slate-700">{r.nb_nuits}n</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-semibold text-slate-900">{r.montant}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUT_STYLE[r.statut]}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUT_DOT[r.statut]}`}/>
                                            {r.statut}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Link href={`/reservations/${r.id}`} className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">
                                            Détails →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-400">{reservations.length} réservation(s)</p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Préc.</button>
                        <button className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg">1</button>
                        <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Suiv.</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}