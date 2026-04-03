import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';


interface VoyageurItem { id:number; initials:string; nom:string; email:string; telephone:string; type_handicap:string; niveau_dependance:number; reservations:number; inscription:string; actif:boolean; }
 
export default function VoyageursIndex({ voyageurs = [], stats = { total:0, actifs:0, inactifs:0, avec_profil_medical:0 } }: { voyageurs?: VoyageurItem[]; stats?: any }) {
    const typeStyle: Record<string, string> = {
        moteur: 'bg-blue-50 text-blue-700', sensoriel: 'bg-purple-50 text-purple-700',
        cognitif: 'bg-orange-50 text-orange-700', polyhandicap: 'bg-red-50 text-red-700', autre: 'bg-slate-100 text-slate-600',
    };
    return (
        <DashboardLayout title="Voyageurs" subtitle="Tous les profils inscrits">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { l: 'Total inscrits', v: stats.total, c: 'text-slate-900' },
                    { l: 'Actifs', v: stats.actifs, c: 'text-emerald-600' },
                    { l: 'Inactifs', v: stats.inactifs, c: 'text-slate-400' },
                    { l: 'Profil médical', v: stats.avec_profil_medical, c: 'text-violet-600' },
                ].map(s => (
                    <div key={s.l} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.l}</p>
                        <p className={`text-2xl font-extrabold ${s.c}`}>{s.v}</p>
                    </div>
                ))}
            </div>
 
            <div className="flex gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input placeholder="Nom, email…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-full"/>
                </div>
                <select className="text-sm border border-slate-200 rounded-xl bg-white px-3 py-2 focus:outline-none text-slate-600">
                    <option>Tous les handicaps</option>
                    <option>Moteur</option><option>Sensoriel</option>
                    <option>Cognitif</option><option>Polyhandicap</option>
                </select>
            </div>
 
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>{['Voyageur','Handicap','Dépendance','Réservations','Inscription','Statut','Actions'].map(h=>(
                                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {voyageurs.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">{v.initials}</div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{v.nom}</p>
                                                <p className="text-xs text-slate-400">{v.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${typeStyle[v.type_handicap]}`}>{v.type_handicap}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(n=><div key={n} className={`w-3 h-3 rounded-sm ${n<=v.niveau_dependance ? 'bg-violet-500' : 'bg-slate-100'}`}/>)}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{v.reservations}</td>
                                    <td className="px-5 py-4 text-sm text-slate-500">{v.inscription}</td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${v.actif ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                            {v.actif ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Link href={`/voyageurs/${v.id}`} className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">Profil →</Link>
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