import { Link } from '@inertiajs/react';
import TransporteurLayout from './layout';

const STATUT_CONF: Record<string, { label: string; badge: string; dot: string }> = {
    en_attente: { label:'En attente',  badge:'bg-amber-50 text-amber-700 border-amber-200',   dot:'bg-amber-500'         },
    confirme:   { label:'Confirmée',   badge:'bg-sky-50 text-sky-700 border-sky-200',         dot:'bg-sky-500'           },
    en_cours:   { label:'En cours',    badge:'bg-emerald-50 text-emerald-700 border-emerald-200', dot:'bg-emerald-500 animate-pulse' },
    termine:    { label:'Terminée',    badge:'bg-slate-100 text-slate-500 border-slate-200',  dot:'bg-slate-400'         },
    annule:     { label:'Annulée',     badge:'bg-red-50 text-red-600 border-red-200',         dot:'bg-red-400'           },
};

const TYPE_ICON: Record<string, string> = {
    berline: '🚗', van: '🚐', minibus: '🚌', ambulance_legere: '🚑',
};

export default function TransporteurIndex({ transporteur, courses_a_venir = [], stats }: any) {
    return (
        <TransporteurLayout title={`Bonjour, ${transporteur.prenom} 👋`} subtitle="Tableau de bord transporteur PMR">

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label:'Total courses',  value: stats.total,     color:'text-slate-900'   },
                    { label:'À venir',        value: stats.a_venir,   color:'text-sky-600'     },
                    { label:'En cours',       value: stats.en_cours,  color:'text-emerald-600' },
                    { label:'Terminées',      value: stats.terminees, color:'text-violet-600'  },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Courses à venir */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Prochaines courses</h3>
                    <Link href="/transporteur/courses" className="text-xs font-semibold text-violet-600">Voir tout →</Link>
                </div>

                {courses_a_venir.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {courses_a_venir.map((c: any) => {
                            const sc = STATUT_CONF[c.statut] ?? STATUT_CONF.en_attente;
                            return (
                                <div key={c.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">{c.initials}</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{c.voyageur}</p>
                                                <p className="text-xs text-slate-400 font-mono">{c.reference}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-xl">{TYPE_ICON[c.type_vehicule] ?? '🚐'}</span>
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${sc.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
                                                {sc.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-12 space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"/>
                                            <span className="truncate">{c.adresse_depart}, <strong>{c.ville_depart}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"/>
                                            <span className="truncate">{c.adresse_arrivee}, <strong>{c.ville_arrivee}</strong></span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs font-semibold text-slate-500">📅 {c.date_heure}</span>
                                            <span className="text-xs font-bold text-emerald-600">{c.montant}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-12 text-center">
                        <p className="text-4xl mb-3">🚐</p>
                        <p className="text-sm font-semibold text-slate-500">Aucune course à venir</p>
                        <p className="text-xs text-slate-400 mt-1">Vos prochaines courses apparaîtront ici</p>
                    </div>
                )}
            </div>
        </TransporteurLayout>
    );
}