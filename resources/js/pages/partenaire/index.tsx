import { Link } from '@inertiajs/react';
import PartenaireLayout from './layout';

const STATUT_BADGE: Record<string, string> = {
    confirmee:  'bg-emerald-100 text-emerald-700',
    en_attente: 'bg-amber-100 text-amber-700',
};
const STATUT_LABEL: Record<string, string> = {
    confirmee: 'Confirmée', en_attente: 'En attente',
};

export default function PartenaireIndex({ partenaire, hebergements = [], reservations_a_venir = [], stats }: any) {
    return (
        <PartenaireLayout title={`Bonjour, ${partenaire.prenom} 👋`} subtitle="Tableau de bord partenaire hébergement">

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label:'Hébergements',        value: stats.nb_hebergements,    color:'text-sky-600'     },
                    { label:'Actifs',              value: stats.hebergements_actifs, color:'text-emerald-600' },
                    { label:'Réservations total',  value: stats.reservations_total,  color:'text-violet-600'  },
                    { label:`Revenus ce mois`,     value: stats.revenus_mois + ' XOF', color:'text-amber-600' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Mes hébergements */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900">Mes hébergements</h3>
                        <Link href="/partenaire/hebergements" className="text-xs font-semibold text-sky-600">Voir tout →</Link>
                    </div>
                    {hebergements.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                            {hebergements.map((h: any) => (
                                <Link key={h.id} href={`/partenaire/hebergements/${h.id}`}
                                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-xl flex-shrink-0">🏨</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{h.nom}</p>
                                        <p className="text-xs text-slate-400">{h.ville} · {h.nb_reservations} rés.</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${h.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {h.actif ? 'Actif' : 'Inactif'}
                                        </span>
                                        {h.note > 0 && <span className="text-xs text-amber-500 font-bold">⭐ {h.note}</span>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-12 text-center">
                            <p className="text-3xl mb-3">🏨</p>
                            <p className="text-sm font-semibold text-slate-500">Aucun hébergement</p>
                            <p className="text-xs text-slate-400 mt-1">Contactez l'admin pour ajouter vos hébergements</p>
                        </div>
                    )}
                </div>

                {/* Réservations à venir */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900">Réservations à venir</h3>
                        <Link href="/partenaire/disponibilites" className="text-xs font-semibold text-violet-600">Calendrier →</Link>
                    </div>
                    {reservations_a_venir.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                            {reservations_a_venir.map((r: any) => (
                                <div key={r.id} className="flex items-center gap-4 px-6 py-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">{r.initials}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900">{r.voyageur}</p>
                                        <p className="text-xs text-slate-400 truncate">{r.hebergement}</p>
                                        <p className="text-xs text-slate-500">{r.date_arrivee} → {r.date_depart} · {r.nb_nuits} nuits</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full block mb-1 ${STATUT_BADGE[r.statut] ?? 'bg-slate-100 text-slate-500'}`}>
                                            {STATUT_LABEL[r.statut] ?? r.statut}
                                        </span>
                                        <p className="text-xs font-bold text-emerald-600">{r.montant}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-12 text-center">
                            <p className="text-3xl mb-3">📅</p>
                            <p className="text-sm font-semibold text-slate-500">Aucune réservation à venir</p>
                        </div>
                    )}
                </div>
            </div>
        </PartenaireLayout>
    );
}