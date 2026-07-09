import { Link, router } from '@inertiajs/react';
import PartenaireLayout from './layout';

export default function PartenaireHebergements({ hebergements = [] }: { hebergements: any[] }) {
    return (
        <PartenaireLayout title="Mes hébergements" subtitle={`${hebergements.length} hébergement(s)`}>
            {hebergements.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {hebergements.map(h => (
                        <div key={h.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-sky-200 transition-colors">
                            <div className={`h-3 ${h.actif ? 'bg-emerald-500' : 'bg-slate-300'}`}/>
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">{h.nom}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">📍 {h.ville}{h.pays ? `, ${h.pays}` : ''}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${h.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {h.actif ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                    <span>📋 {h.nb_reservations} réservations</span>
                                    {h.note > 0 && <span>⭐ {h.note}/5 ({h.nb_avis} avis)</span>}
                                    {h.certifie && <span className="text-emerald-600 font-semibold">✓ Certifié</span>}
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/partenaire/hebergements/${h.id}`}
                                        className="flex-1 text-center py-2 text-xs font-bold bg-sky-50 text-sky-700 rounded-xl hover:bg-sky-100 transition-colors">
                                        Voir détail
                                    </Link>
                                    <button onClick={() => router.patch(`/partenaire/hebergements/${h.id}/toggle`)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${h.actif ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                                        {h.actif ? 'Désactiver' : 'Activer'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center py-16 text-center">
                    <p className="text-4xl mb-4">🏨</p>
                    <p className="text-sm font-bold text-slate-600">Aucun hébergement assigné</p>
                    <p className="text-xs text-slate-400 mt-1">Contactez l'administrateur pour rattacher vos hébergements</p>
                </div>
            )}
        </PartenaireLayout>
    );
}