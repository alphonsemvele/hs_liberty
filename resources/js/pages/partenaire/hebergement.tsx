import { Link } from '@inertiajs/react';
import PartenaireLayout from './layout';

const STATUT_CONF: Record<string, { label: string; badge: string }> = {
    confirmee:  { label:'Confirmée',   badge:'bg-emerald-100 text-emerald-700' },
    en_attente: { label:'En attente',  badge:'bg-amber-100 text-amber-700'     },
    terminee:   { label:'Terminée',    badge:'bg-slate-100 text-slate-500'     },
    annulee:    { label:'Annulée',     badge:'bg-red-100 text-red-600'         },
};

export default function PartenaireHebergement({ hebergement, reservations = [] }: any) {
    const h = hebergement;
    return (
        <PartenaireLayout title={h.nom} subtitle={`${h.ville}${h.pays ? `, ${h.pays}` : ''}`}>
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/partenaire/hebergements" className="text-slate-400 hover:text-sky-600">Mes hébergements</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">{h.nom}</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                    {/* Fiche */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className={`h-2 ${h.actif ? 'bg-emerald-500' : 'bg-slate-300'}`}/>
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">{h.nom}</h2>
                                    <p className="text-sm text-slate-400 mt-1">📍 {h.adresse || h.ville}{h.pays ? `, ${h.pays}` : ''}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${h.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{h.actif ? 'Actif' : 'Inactif'}</span>
                                    {h.certifie && <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-700">✓ Certifié</span>}
                                </div>
                            </div>
                            {h.description && <p className="text-sm text-slate-600 leading-relaxed">{h.description}</p>}
                        </div>
                    </div>

                    {/* Réservations */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Réservations</h3>
                            <span className="text-xs text-slate-400">{reservations.length}</span>
                        </div>
                        {reservations.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {reservations.map((r: any) => {
                                    const sc = STATUT_CONF[r.statut] ?? STATUT_CONF.terminee;
                                    return (
                                        <div key={r.id} className="flex items-center gap-4 px-6 py-3.5">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900">{r.voyageur}</p>
                                                <p className="text-xs text-slate-400">{r.date_arrivee} → {r.date_depart} · {r.nb_nuits} nuits</p>
                                                <p className="text-xs font-mono text-slate-300">{r.reference}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full block mb-1 ${sc.badge}`}>{sc.label}</span>
                                                <p className="text-xs font-bold text-emerald-600">{r.montant}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-8">Aucune réservation</p>
                        )}
                    </div>
                </div>

                {/* Sidebar stats */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Statistiques</p>
                        <div className="space-y-3">
                            <div className="flex justify-between"><span className="text-sm text-slate-500">Total réservations</span><span className="text-sm font-bold text-slate-900">{reservations.length}</span></div>
                            <div className="flex justify-between"><span className="text-sm text-slate-500">Note moyenne</span><span className="text-sm font-bold text-amber-500">{h.note > 0 ? `⭐ ${h.note}` : '—'}</span></div>
                            <div className="flex justify-between"><span className="text-sm text-slate-500">Nb avis</span><span className="text-sm font-bold text-slate-900">{h.nb_avis}</span></div>
                            <div className="flex justify-between"><span className="text-sm text-slate-500">Ajouté le</span><span className="text-sm font-bold text-slate-900">{h.created_at}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </PartenaireLayout>
    );
}