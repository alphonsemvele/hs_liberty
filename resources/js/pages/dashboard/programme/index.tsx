import React from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Programme {
    id: number; titre: string; voyageur: string; voyageur_initials: string;
    destination: string; pays: string; date_debut: string; date_fin: string;
    nb_nuits: number; nb_etapes: number; checklist_total: number; checklist_faites: number;
    statut: 'en_cours' | 'a_venir' | 'termine'; partage_aidants: boolean; urgences: number;
}
interface Stats { total: number; en_cours: number; a_venir: number; termines: number; }

const STATUT_CONF: Record<string, { label: string; badge: string; dot: string; bar: string }> = {
    en_cours:  { label:'En cours',  badge:'bg-emerald-50 text-emerald-700 border-emerald-200', dot:'bg-emerald-500 animate-pulse', bar:'bg-emerald-500' },
    a_venir:   { label:'À venir',   badge:'bg-sky-50 text-sky-700 border-sky-200',             dot:'bg-sky-400',                   bar:'bg-sky-400'     },
    termine:   { label:'Terminé',   badge:'bg-slate-100 text-slate-500 border-slate-200',      dot:'bg-slate-400',                 bar:'bg-slate-300'   },
    brouillon: { label:'Brouillon', badge:'bg-amber-50 text-amber-700 border-amber-200',       dot:'bg-amber-400',                 bar:'bg-amber-300'   },
};

const STATUT_FALLBACK = { label:'Inconnu', badge:'bg-slate-100 text-slate-500 border-slate-200', dot:'bg-slate-400', bar:'bg-slate-200' };

export default function ProgrammeIndex({
    programmes = [],
    stats = { total:0, en_cours:0, a_venir:0, termines:0 },
}: { programmes?: Programme[]; stats?: Stats }) {
    const [filtre, setFiltre] = React.useState<'tous'|'en_cours'|'a_venir'|'termine'>('tous');
    const filtres = filtre === 'tous' ? programmes : programmes.filter(p => p.statut === filtre);

    return (
        <DashboardLayout title="Programmes de séjour" subtitle="Plans personnalisés par voyageur">

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label:'Total',    value:stats.total,    color:'text-slate-900'   },
                    { label:'En cours', value:stats.en_cours, color:'text-emerald-600' },
                    { label:'À venir',  value:stats.a_venir,  color:'text-sky-600'     },
                    { label:'Terminés', value:stats.termines, color:'text-slate-400'   },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input placeholder="Voyageur, destination…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-56"/>
                    </div>
                    <div className="flex gap-1.5">
                        {([
                            { val:'tous',     label:'Tous'     },
                            { val:'en_cours', label:'En cours' },
                            { val:'a_venir',  label:'À venir'  },
                            { val:'termine',  label:'Terminés' },
                        ] as const).map(f => (
                            <button key={f.val} onClick={() => setFiltre(f.val)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${filtre === f.val ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
                <Link href="/programme/create" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/></svg>
                    Nouveau programme
                </Link>
            </div>

            {/* Grille */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtres.map(p => {
                    const sc  = STATUT_CONF[p.statut] ?? STATUT_FALLBACK;
                    const pct = p.checklist_total > 0 ? Math.round((p.checklist_faites / p.checklist_total) * 100) : 0;
                    return (
                        <div key={p.id} className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-all group ${p.statut === 'en_cours' ? 'border-emerald-200' : 'border-slate-100'}`}>
                            <div className={`h-1.5 ${sc.bar}`}/>
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-2 mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors truncate">{p.titre}</h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="w-5 h-5 rounded-lg bg-violet-100 flex items-center justify-center text-[9px] font-black text-violet-700">{p.voyageur_initials}</div>
                                            <span className="text-xs text-slate-500">{p.voyageur}</span>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${sc.badge}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>{sc.label}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                        <span className="text-sm font-semibold text-slate-700">{p.destination}</span>
                                        {p.pays && <span className="text-xs text-slate-400">· {p.pays}</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                        <span className="text-xs text-slate-500">{p.date_debut} → {p.date_fin}</span>
                                        {p.nb_nuits > 0 && <span className="text-xs font-semibold text-emerald-600">{p.nb_nuits}n</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-4 flex-wrap">
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                                        <span>{p.nb_etapes} étape{p.nb_etapes > 1 ? 's' : ''}</span>
                                    </div>
                                    {p.partage_aidants && (
                                        <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                            Partagé aidants
                                        </div>
                                    )}
                                    {p.urgences > 0 && (
                                        <div className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"/>
                                            {p.urgences} urgence{p.urgences > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>

                                {p.checklist_total > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            <span className="text-slate-400 font-medium">Préparation</span>
                                            <span className={`font-bold ${pct === 100 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-500' : 'text-slate-500'}`}>
                                                {p.checklist_faites}/{p.checklist_total}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-slate-300'}`} style={{ width: `${pct}%` }}/>
                                        </div>
                                    </div>
                                )}

                                <Link href={`/programme/${p.id}`}
                                    className="flex items-center justify-between w-full pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                    Voir le programme complet
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                                </Link>
                            </div>
                        </div>
                    );
                })}

                {filtres.length === 0 && (
                    <div className="md:col-span-2 xl:col-span-3 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Aucun programme</p>
                        <Link href="/programme/create" className="mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700">+ Créer un programme →</Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}