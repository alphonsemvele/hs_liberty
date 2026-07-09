import { Link, router } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Prof {
    id: number; initials: string; nom: string; email: string; telephone: string;
    specialite: string; pays: string; certifie: boolean; actif: boolean;
    nb_soins: number; note: number; created_at: string;
}
interface Stats { total: number; certifies: number; actifs: number; specialites: number; }

function Stars({ n }: { n: number }) {
    return (
        <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
                <svg key={i} className={`w-3 h-3 ${i <= Math.round(n) ? 'text-amber-400 fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            ))}
        </div>
    );
}

export default function ProfessionnelsIndex({
    professionnels = [],
    stats = { total:0, certifies:0, actifs:0, specialites:0 },
}: { professionnels?: Prof[]; stats?: Stats }) {
    return (
        <DashboardLayout title="Professionnels de santé" subtitle="Soignants certifiés intervenant auprès des voyageurs">

            {/* KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label:'Total',        value:stats.total,       color:'text-slate-900'   },
                    { label:'Certifiés',    value:stats.certifies,   color:'text-emerald-600' },
                    { label:'Actifs',       value:stats.actifs,      color:'text-sky-600'     },
                    { label:'Spécialités',  value:stats.specialites, color:'text-violet-600'  },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input placeholder="Nom, spécialité, pays…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-60"/>
                </div>
                <Link href="/professionnels/create"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/></svg>
                    Ajouter un professionnel
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {['Professionnel','Spécialité','Pays','Certification','Soins','Note','Statut','Actions'].map(h => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {professionnels.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-xs font-black text-pink-700 flex-shrink-0">
                                                {p.initials}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{p.nom}</p>
                                                <p className="text-xs text-slate-400">{p.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4"><span className="text-sm text-slate-700">{p.specialite}</span></td>
                                    <td className="px-5 py-4"><span className="text-sm text-slate-500">{p.pays}</span></td>
                                    <td className="px-5 py-4">
                                        {p.certifie
                                            ? <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                Certifié
                                              </span>
                                            : <span className="text-xs text-slate-400">Non certifié</span>
                                        }
                                    </td>
                                    <td className="px-5 py-4"><span className="text-sm font-semibold text-slate-700">{p.nb_soins}</span></td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Stars n={p.note}/>
                                            <span className="text-xs font-semibold text-slate-600">{p.note > 0 ? p.note.toFixed(1) : '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${p.actif ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${p.actif ? 'bg-emerald-500' : 'bg-slate-400'}`}/>
                                            {p.actif ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Link href={`/professionnels/${p.id}`} className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">
                                            Voir →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {professionnels.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Aucun professionnel enregistré</p>
                        <Link href="/professionnels/create" className="mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                            + Ajouter un professionnel →
                        </Link>
                    </div>
                )}
                {professionnels.length > 0 && (
                    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-400">{professionnels.length} professionnel(s)</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}