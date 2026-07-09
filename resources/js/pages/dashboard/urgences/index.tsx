import { Link, router } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Urgence {
    id: number; reference: string; voyageur: string; initials: string;
    type: string; statut: 'declenche' | 'en_traitement' | 'resolu';
    localisation: string; declenchee_le: string; depuis: string;
}
interface Stats { total: number; declenchees: number; en_traitement: number; resolues: number; }

const TYPE_CONF: Record<string, { label: string; icon: string; color: string }> = {
    medical:  { label: 'Médical',   icon: '🏥', color: 'bg-red-100 text-red-700'    },
    securite: { label: 'Sécurité',  icon: '🔒', color: 'bg-orange-100 text-orange-700' },
    accident: { label: 'Accident',  icon: '⚠️', color: 'bg-amber-100 text-amber-700'  },
    autre:    { label: 'Autre',     icon: '📢', color: 'bg-slate-100 text-slate-600'  },
};

const STATUT_CONF: Record<string, { label: string; badge: string; dot: string }> = {
    declenche:    { label: 'Déclenchée',    badge: 'bg-red-50 text-red-700 border-red-200',      dot: 'bg-red-500 animate-pulse' },
    en_traitement:{ label: 'En traitement', badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500'            },
    resolu:       { label: 'Résolue',       badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500'    },
};

export default function UrgencesIndex({
    urgences = [],
    stats = { total:0, declenchees:0, en_traitement:0, resolues:0 },
}: { urgences?: Urgence[]; stats?: Stats }) {

    const actives = urgences.filter(u => u.statut !== 'resolu');

    return (
        <DashboardLayout title="Urgences & SOS" subtitle="Alertes actives et historique des interventions">

            {/* Bannière alerte si urgences actives */}
            {actives.length > 0 && (
                <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-700">{actives.length} urgence{actives.length > 1 ? 's' : ''} active{actives.length > 1 ? 's' : ''}</p>
                            <p className="text-xs text-red-500">{actives.map(u => u.voyageur).join(' · ')}</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded-xl">Intervention requise</span>
                </div>
            )}

            {/* KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label:'Total',         value:stats.total,          color:'text-slate-900'   },
                    { label:'Déclenchées',   value:stats.declenchees,    color:'text-red-600'     },
                    { label:'En traitement', value:stats.en_traitement,  color:'text-amber-600'   },
                    { label:'Résolues',      value:stats.resolues,       color:'text-emerald-600' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Tableau */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Toutes les alertes</h3>
                    <span className="text-xs text-slate-400">{urgences.length} alerte(s)</span>
                </div>

                {urgences.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {['Voyageur','Type','Localisation','Statut','Déclenchée','Depuis','Actions'].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {urgences.map(u => {
                                    const tc = TYPE_CONF[u.type] ?? TYPE_CONF.autre;
                                    const sc = STATUT_CONF[u.statut] ?? STATUT_CONF.declenche;
                                    return (
                                        <tr key={u.id} className={`hover:bg-slate-50 transition-colors group ${u.statut === 'declenche' ? 'bg-red-50/30' : ''}`}>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-xs font-black text-red-700 flex-shrink-0">
                                                        {u.initials}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{u.voyageur}</p>
                                                        <p className="text-xs text-slate-400 font-mono">{u.reference}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${tc.color}`}>
                                                    <span>{tc.icon}</span>{tc.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-slate-600">{u.localisation}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.badge}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
                                                    {sc.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-slate-500">{u.declenchee_le}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-sm font-semibold ${u.statut !== 'resolu' ? 'text-red-600' : 'text-slate-400'}`}>{u.depuis}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Link href={`/urgences/${u.id}`} className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors">
                                                    Gérer →
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-slate-700 mb-1">Aucune urgence active</p>
                        <p className="text-xs text-slate-400">Tous les voyageurs sont en sécurité.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}