import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';
 
// ─── URGENCES ─────────────────────────────────────────────────────────────────
interface UrgenceItem {
    id: number; voyageur: string; initials: string; localisation: string;
    type: 'medical' | 'securite' | 'autre'; statut: 'declenche' | 'en_traitement' | 'resolu';
    operateur: string | null; depuis: string; date_heure: string; notes: string | null;
}
interface UrgenceStats { total:number; actives:number; resolues:number; medicales:number; securite:number; autres:number; }
 
export default function UrgencesIndex({ urgences = [], stats = { total:0, actives:0, resolues:0, medicales:0, securite:0, autres:0 } }: { urgences?: UrgenceItem[]; stats?: UrgenceStats }) {
    const typeLabel = { medical: 'Médical', securite: 'Sécurité', autre: 'Autre' };
    const typeStyle = { medical: 'bg-red-50 text-red-700 border-red-100', securite: 'bg-orange-50 text-orange-700 border-orange-100', autre: 'bg-slate-100 text-slate-500 border-slate-200' };
    const statutStyle = { declenche: 'bg-red-500 text-white animate-pulse', en_traitement: 'bg-orange-400 text-white', resolu: 'bg-emerald-100 text-emerald-700' };
    const statutLabel = { declenche: '🔴 Déclenché', en_traitement: '🟠 En traitement', resolu: '✅ Résolu' };
 
    return (
        <DashboardLayout title="Urgences & SOS" subtitle="Gestion des alertes en temps réel">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                    <p className="text-xs text-red-500 font-bold mb-1 uppercase tracking-wider">Urgences actives</p>
                    <p className="text-3xl font-black text-red-600">{stats.actives}</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-5">
                    <p className="text-xs text-slate-400 font-medium mb-1">Résolues ce mois</p>
                    <p className="text-2xl font-extrabold text-emerald-600">{stats.resolues}</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-5">
                    <p className="text-xs text-slate-400 font-medium mb-1">Type médical</p>
                    <p className="text-2xl font-extrabold text-slate-900">{stats.medicales}</p>
                </div>
            </div>
 
            <div className="space-y-3">
                {urgences.map(u => (
                    <div key={u.id} className={`bg-white rounded-2xl border overflow-hidden transition-all ${u.statut === 'declenche' ? 'border-red-200 shadow-sm shadow-red-100' : u.statut === 'en_traitement' ? 'border-orange-200' : 'border-slate-100'}`}>
                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${u.statut === 'declenche' ? 'bg-red-500 text-white' : u.statut === 'en_traitement' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {u.initials}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-sm font-bold text-slate-900">{u.voyageur}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeStyle[u.type]}`}>{typeLabel[u.type]}</span>
                                    </div>
                                    <p className="text-xs text-slate-400">{u.localisation} · {u.date_heure}</p>
                                    {u.notes && <p className="text-xs text-slate-500 mt-1 italic">{u.notes}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${statutStyle[u.statut]}`}>
                                    {statutLabel[u.statut]}
                                </span>
                                <p className="text-xs text-slate-400">
                                    {u.operateur ? `Opér. : ${u.operateur}` : 'Non pris en charge'}
                                </p>
                                <p className="text-xs text-slate-300">Il y a {u.depuis}</p>
                            </div>
                        </div>
                        {u.statut !== 'resolu' && (
                            <div className="border-t border-slate-50 px-5 py-3 flex gap-3">
                                <button className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-lg transition-colors">
                                    Marquer résolu
                                </button>
                                <button className="text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-1.5 rounded-lg transition-colors">
                                    Prendre en charge
                                </button>
                                <button className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                                    Contacter secours locaux
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {urgences.length === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-500">Aucune urgence active</p>
                        <p className="text-xs text-slate-400 mt-1">Tous les voyageurs sont en sécurité</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}