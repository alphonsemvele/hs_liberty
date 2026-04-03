import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Hebergement {
    id: number; nom: string; ville: string; pays: string;
    niveau_certif: string | null; note: number; reservations: number;
    actif: boolean; created_at: string;
}
interface Stats { total: number; certifies: number; non_certifies: number; inactifs: number; }
interface Props { hebergements: Hebergement[]; stats: Stats; }

const NIVEAU_STYLE: Record<string, string> = {
    'Excellence':      'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Accessible Plus': 'bg-sky-100 text-sky-700 border-sky-200',
    'Accessible':      'bg-teal-100 text-teal-700 border-teal-200',
};

export default function HebergementsIndex({ hebergements = [], stats = { total:0, certifies:0, non_certifies:0, inactifs:0 } }: Partial<Props>) {
    return (
        <DashboardLayout title="Hébergements" subtitle="Gérez les établissements certifiés">

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total',          value: stats.total,         color: 'text-slate-900' },
                    { label: 'Certifiés',      value: stats.certifies,     color: 'text-emerald-600' },
                    { label: 'Non certifiés',  value: stats.non_certifies, color: 'text-amber-600' },
                    { label: 'Inactifs',       value: stats.inactifs,      color: 'text-slate-400' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input placeholder="Rechercher…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-64"/>
                    </div>
                    <select className="text-sm border border-slate-200 rounded-xl bg-white px-3 py-2 focus:outline-none focus:border-emerald-400 text-slate-600">
                        <option>Tous les niveaux</option>
                        <option>Excellence</option>
                        <option>Accessible Plus</option>
                        <option>Accessible</option>
                        <option>Non certifié</option>
                    </select>
                </div>
                <Link href="/hebergements/create" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/></svg>
                    Ajouter un hébergement
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {['Établissement','Ville / Pays','Certification','Note','Réservations','Statut','Actions'].map(h => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {hebergements.map(h => (
                                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-xs font-black text-emerald-700 flex-shrink-0">
                                                {h.nom.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-slate-900 text-sm">{h.nom}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-slate-600">{h.ville}</span>
                                        <span className="text-xs text-slate-400 ml-1">· {h.pays}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {h.niveau_certif ? (
                                            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${NIVEAU_STYLE[h.niveau_certif] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                {h.niveau_certif}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Non certifié</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        {h.note > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                                <span className="text-sm font-semibold text-slate-700">{h.note}</span>
                                            </div>
                                        ) : <span className="text-xs text-slate-300">—</span>}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-semibold text-slate-700">{h.reservations}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${h.actif ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${h.actif ? 'bg-emerald-500' : 'bg-slate-300'}`}/>
                                            {h.actif ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/hebergements/${h.id}`} className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">Voir</Link>
                                            <Link href={`/hebergements/${h.id}/edit`} className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">Modifier</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-400">{hebergements.length} établissement(s)</p>
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