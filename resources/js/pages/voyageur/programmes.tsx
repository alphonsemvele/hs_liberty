import { Link } from '@inertiajs/react';
import VoyageurLayout from './layout';

interface Programme {
    id: number; titre: string; destination: string;
    date_debut: string; date_fin: string; statut: string; nb_etapes: number;
}

const STATUT_CONF: Record<string, { label: string; color: string; bar: string }> = {
    en_cours:  { label:'En cours',  color:'text-emerald-700 bg-emerald-50', bar:'bg-emerald-500' },
    a_venir:   { label:'À venir',   color:'text-sky-700 bg-sky-50',         bar:'bg-sky-400'     },
    termine:   { label:'Terminé',   color:'text-slate-500 bg-slate-100',    bar:'bg-slate-300'   },
    brouillon: { label:'Brouillon', color:'text-amber-700 bg-amber-50',     bar:'bg-amber-400'   },
};

export default function VoyageurProgrammes({ programmes = [] }: { programmes?: Programme[] }) {
    return (
        <VoyageurLayout title="Mes programmes" subtitle="Plans détaillés de vos séjours">
            <div className="space-y-3">
                {programmes.map(p => {
                    const sc = STATUT_CONF[p.statut] ?? STATUT_CONF.brouillon;
                    return (
                        <Link key={p.id} href={`/mon-espace/programme/${p.id}`}
                            className="block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-emerald-200 transition-colors">
                            <div className={`h-1 ${sc.bar}`}/>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{p.titre}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${sc.color}`}>{sc.label}</span>
                                </div>
                                <p className="text-xs text-slate-400 mb-3">📍 {p.destination} · {p.date_debut} → {p.date_fin}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">{p.nb_etapes} étape{p.nb_etapes !== 1 ? 's' : ''}</span>
                                    <span className="text-xs font-semibold text-emerald-600">Voir →</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
                {programmes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-4xl mb-4">🗺️</p>
                        <p className="text-sm font-bold text-slate-600 mb-1">Aucun programme</p>
                        <p className="text-xs text-slate-400">Vos programmes de séjour apparaîtront ici</p>
                    </div>
                )}
            </div>
        </VoyageurLayout>
    );
}