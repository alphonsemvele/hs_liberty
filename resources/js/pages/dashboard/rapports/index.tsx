import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';


interface RapportKpis { reservations_mois:number; revenus_mois:string; taux_occupation:number; taux_satisfaction:number; voyageurs_actifs:number; urgences_mois:number; certifications_valides:number; professionnels_actifs:number; }
 
export default function RapportsIndex({ kpis, reservations_par_mois = [], top_hebergements = [], repartition_handicap = [] }: { kpis?: RapportKpis; reservations_par_mois?: any[]; top_hebergements?: any[]; repartition_handicap?: any[]; }) {
    const k = kpis ?? { reservations_mois:127, revenus_mois:'6 540 000 F', taux_occupation:74, taux_satisfaction:94, voyageurs_actifs:1842, urgences_mois:4, certifications_valides:4, professionnels_actifs:5 };
    const maxCount = Math.max(...reservations_par_mois.map(r => r.count), 1);
    const handicapColors = ['bg-blue-500','bg-purple-500','bg-orange-500','bg-red-500'];
 
    return (
        <DashboardLayout title="Rapports" subtitle="Vue d'ensemble de la plateforme">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { l: 'Réservations / mois', v: k.reservations_mois, c: 'text-emerald-600', sub: '+12% vs N-1' },
                    { l: 'Revenus du mois',     v: k.revenus_mois,      c: 'text-slate-900',  sub: 'Toutes devises confondues' },
                    { l: 'Taux d\'occupation',  v: `${k.taux_occupation}%`, c: 'text-sky-600', sub: 'Hébergements actifs' },
                    { l: 'Satisfaction',        v: `${k.taux_satisfaction}%`, c: 'text-amber-600', sub: `${k.voyageurs_actifs.toLocaleString('fr-FR')} voyageurs actifs` },
                ].map(s=>(
                    <div key={s.l} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.l}</p>
                        <p className={`text-2xl font-extrabold ${s.c}`}>{s.v}</p>
                        <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>
 
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Histogramme réservations */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-6">Réservations par mois</h3>
                    <div className="flex items-end gap-2 h-40">
                        {reservations_par_mois.map((r,i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-xs font-semibold text-slate-600">{r.count}</span>
                                <div className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-400" style={{ height: `${(r.count / maxCount) * 100}%`, minHeight: '4px' }}/>
                                <span className="text-[9px] text-slate-400 whitespace-nowrap">{r.mois.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </div>
 
                {/* Répartition handicap */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-6">Répartition par type de handicap</h3>
                    <div className="space-y-3">
                        {repartition_handicap.map((h,i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-medium text-slate-700">{h.type}</span>
                                    <span className="text-slate-500 font-semibold">{h.count} · {h.pct}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${handicapColors[i]}`} style={{ width: `${h.pct}%` }}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
 
            {/* Top hébergements */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Top hébergements</h3>
                </div>
                <div className="divide-y divide-slate-50">
                    {top_hebergements.map((h,i) => (
                        <div key={i} className="flex items-center px-6 py-4">
                            <span className="text-xl font-black text-slate-200 w-8">#{i+1}</span>
                            <div className="flex-1 ml-3">
                                <p className="text-sm font-semibold text-slate-900">{h.nom}</p>
                                <p className="text-xs text-slate-400">{h.ville}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">{h.reservations}</p>
                                    <p className="text-xs text-slate-400">réservations</p>
                                </div>
                                <div className="flex items-center gap-1 ml-4">
                                    <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <span className="text-sm font-bold text-slate-700">{h.note}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}