import { useState } from 'react';
import { router } from '@inertiajs/react';
import TransporteurLayout from './layout';

const STATUT_CONF: Record<string, { label: string; badge: string; dot: string }> = {
    en_attente: { label:'En attente',  badge:'bg-amber-50 text-amber-700 border-amber-200',       dot:'bg-amber-500'     },
    confirme:   { label:'Confirmée',   badge:'bg-sky-50 text-sky-700 border-sky-200',             dot:'bg-sky-500'       },
    en_cours:   { label:'En cours',    badge:'bg-emerald-50 text-emerald-700 border-emerald-200', dot:'bg-emerald-500 animate-pulse' },
    termine:    { label:'Terminée',    badge:'bg-slate-100 text-slate-500 border-slate-200',      dot:'bg-slate-400'     },
    annule:     { label:'Annulée',     badge:'bg-red-50 text-red-600 border-red-200',             dot:'bg-red-400'       },
};

const TYPE_ICON: Record<string, string> = {
    berline: '🚗', van: '🚐', minibus: '🚌', ambulance_legere: '🚑',
};

const ACTIONS: Record<string, { label: string; next: string; color: string }[]> = {
    en_attente: [{ label: 'Confirmer',   next: 'confirme', color: 'bg-sky-600 text-white hover:bg-sky-700'         }],
    confirme:   [{ label: 'Démarrer',    next: 'en_cours', color: 'bg-emerald-600 text-white hover:bg-emerald-700' }],
    en_cours:   [{ label: 'Terminer',    next: 'termine',  color: 'bg-violet-600 text-white hover:bg-violet-700'   }],
    termine:    [],
    annule:     [],
};

export default function TransporteurCourses({ courses = [] }: { courses: any[] }) {
    const [filtre, setFiltre] = useState<string>('tous');

    const filtrees = filtre === 'tous' ? courses : courses.filter(c => c.statut === filtre);
    const actives  = courses.filter(c => ['en_attente','confirme','en_cours'].includes(c.statut));
    const passees  = courses.filter(c => ['termine','annule'].includes(c.statut));

    return (
        <TransporteurLayout title="Mes courses" subtitle={`${courses.length} course(s)`}>

            {/* Filtres */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {[
                    { val:'tous',       label:'Toutes',      count: courses.length     },
                    { val:'en_attente', label:'En attente',  count: courses.filter(c=>c.statut==='en_attente').length },
                    { val:'confirme',   label:'Confirmées',  count: courses.filter(c=>c.statut==='confirme').length  },
                    { val:'en_cours',   label:'En cours',    count: courses.filter(c=>c.statut==='en_cours').length  },
                    { val:'termine',    label:'Terminées',   count: courses.filter(c=>c.statut==='termine').length   },
                ].map(f => (
                    <button key={f.val} onClick={() => setFiltre(f.val)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filtre === f.val ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'}`}>
                        {f.label}
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${filtre === f.val ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{f.count}</span>
                    </button>
                ))}
            </div>

            {/* Liste */}
            <div className="space-y-4">
                {filtrees.map(c => {
                    const sc      = STATUT_CONF[c.statut] ?? STATUT_CONF.en_attente;
                    const actions = ACTIONS[c.statut] ?? [];

                    return (
                        <div key={c.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-50">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{TYPE_ICON[c.type_vehicule] ?? '🚐'}</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{c.voyageur}</p>
                                            <p className="text-xs text-slate-400 font-mono">{c.reference} · {c.date_heure}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border flex-shrink-0 ${sc.badge}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
                                        {sc.label}
                                    </span>
                                </div>
                            </div>

                            <div className="px-6 py-4 space-y-2">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"/>
                                    </span>
                                    <span className="text-slate-600">{c.adresse_depart}, <span className="font-semibold">{c.ville_depart}</span></span>
                                </div>
                                <div className="ml-2.5 w-px h-4 bg-slate-200"/>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                        <span className="w-2 h-2 rounded-full bg-red-500"/>
                                    </span>
                                    <span className="text-slate-600">{c.adresse_arrivee}, <span className="font-semibold">{c.ville_arrivee}</span></span>
                                </div>
                            </div>

                            {(c.equipements?.length > 0 || c.instructions) && (
                                <div className="px-6 pb-4 space-y-2">
                                    {c.equipements?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {c.equipements.map((eq: string) => (
                                                <span key={eq} className="text-[10px] font-semibold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full border border-violet-100">{eq}</span>
                                            ))}
                                        </div>
                                    )}
                                    {c.instructions && (
                                        <p className="text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2">{c.instructions}</p>
                                    )}
                                </div>
                            )}

                            {actions.length > 0 && (
                                <div className="px-6 pb-4 flex items-center justify-between">
                                    <p className="text-xs font-bold text-emerald-600">{c.montant}</p>
                                    <div className="flex gap-2">
                                        {actions.map(a => (
                                            <button key={a.next} onClick={() => router.patch(`/transporteur/courses/${c.id}/statut`, { statut: a.next })}
                                                className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${a.color}`}>
                                                {a.label} →
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filtrees.length === 0 && (
                    <div className="flex flex-col items-center py-16 text-center">
                        <p className="text-4xl mb-4">🚐</p>
                        <p className="text-sm font-bold text-slate-600">Aucune course</p>
                    </div>
                )}
            </div>
        </TransporteurLayout>
    );
}