
import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';
interface ProfItem {
    id: number; initials: string; nom: string; email: string; specialite: string;
    pays: string[]; tarif: string; note: number; diplome_valide: boolean;
    assurance_rc: boolean; prestations: number; inscription: string;
}
 
export default function ProfessionnelsIndex({ professionnels = [], stats = { total:0, certifies:0, en_attente_validation:0, prestations_mois:0 } }: { professionnels?: ProfItem[]; stats?: any }) {
    const specColors: Record<string, string> = {
        'Infirmière': 'bg-sky-50 text-sky-700',
        'Infirmier': 'bg-sky-50 text-sky-700',
        'Kinésithérapeute': 'bg-violet-50 text-violet-700',
        'Auxiliaire de vie': 'bg-teal-50 text-teal-700',
        'Aide-soignant': 'bg-pink-50 text-pink-700',
    };
    return (
        <DashboardLayout title="Professionnels de santé" subtitle="Réseau certifié à destination">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { l: 'Total', v: stats.total, c: 'text-slate-900' },
                    { l: 'Certifiés', v: stats.certifies, c: 'text-emerald-600' },
                    { l: 'En validation', v: stats.en_attente_validation, c: 'text-amber-600' },
                    { l: 'Prestations / mois', v: stats.prestations_mois, c: 'text-sky-600' },
                ].map(s => (
                    <div key={s.l} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.l}</p>
                        <p className={`text-2xl font-extrabold ${s.c}`}>{s.v}</p>
                    </div>
                ))}
            </div>
 
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input placeholder="Nom, spécialité…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-64"/>
                </div>
            </div>
 
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>{['Professionnel','Spécialité','Pays','Tarif','Note','Diplôme','RC Pro','Prestations','Actions'].map(h=>(
                                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {professionnels.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-xs font-black text-sky-700 flex-shrink-0">{p.initials}</div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{p.nom}</p>
                                                <p className="text-xs text-slate-400">{p.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${specColors[p.specialite] ?? 'bg-slate-100 text-slate-600'}`}>{p.specialite}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-1">{p.pays.map(c=><span key={c} className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{c}</span>)}</div>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{p.tarif}</td>
                                    <td className="px-5 py-4">
                                        {p.note > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                                <span className="text-sm font-semibold text-slate-700">{p.note}</span>
                                            </div>
                                        ) : <span className="text-xs text-slate-300">—</span>}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.diplome_valide ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {p.diplome_valide ? '✓ Vérifié' : '⏳ En attente'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.assurance_rc ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                                            {p.assurance_rc ? '✓' : '✗'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{p.prestations}</td>
                                    <td className="px-5 py-4">
                                        <Link href={`/professionnels/${p.id}`} className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">Voir →</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
 