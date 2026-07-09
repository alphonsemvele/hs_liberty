import { Link } from '@inertiajs/react';
import VoyageurLayout from './layout';

interface Reservation {
    id: number; reference: string; hebergement: string; ville: string;
    date_arrivee: string; date_depart: string; statut: string; montant: string;
}
interface ProchaineReservation {
    id: number; reference: string; hebergement: string; ville: string; pays: string;
    date_arrivee: string; date_depart: string; nb_nuits: number; dans: string;
}

const STATUT_BADGE: Record<string, string> = {
    confirmee:  'bg-emerald-100 text-emerald-700',
    en_attente: 'bg-amber-100 text-amber-700',
    terminee:   'bg-slate-100 text-slate-500',
    annulee:    'bg-red-100 text-red-600',
};
const STATUT_LABEL: Record<string, string> = {
    confirmee: 'Confirmée', en_attente: 'En attente', terminee: 'Terminée', annulee: 'Annulée',
};

export default function VoyageurIndex({
    voyageur,
    prochaine_reservation,
    reservations_recentes = [],
    nb_reservations = 0,
    nb_programmes = 0,
}: {
    voyageur: { prenom: string; nom: string; type_handicap: string; niveau_dependance: number };
    prochaine_reservation: ProchaineReservation | null;
    reservations_recentes: Reservation[];
    nb_reservations: number;
    nb_programmes: number;
}) {
    return (
        <VoyageurLayout title={`Bonjour, ${voyageur.prenom} 👋`} subtitle="Bienvenue dans votre espace voyage">

            {/* Prochain séjour */}
            {prochaine_reservation ? (
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-5 mb-5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }}/>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Prochain séjour</span>
                            <span className="text-xs font-black text-white bg-white/20 px-2.5 py-1 rounded-full">Dans {prochaine_reservation.dans}</span>
                        </div>
                        <h2 className="text-xl font-black text-white mb-1">{prochaine_reservation.hebergement}</h2>
                        <p className="text-sm text-emerald-100 mb-4">
                            📍 {prochaine_reservation.ville}{prochaine_reservation.pays ? `, ${prochaine_reservation.pays}` : ''}
                        </p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-emerald-200">Du {prochaine_reservation.date_arrivee}</p>
                                <p className="text-xs text-emerald-200">Au {prochaine_reservation.date_depart} · {prochaine_reservation.nb_nuits} nuits</p>
                            </div>
                            <Link href={`/mon-espace/reservations`}
                                className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl transition-colors">
                                Voir →
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-100 rounded-3xl p-5 mb-5 text-center">
                    <p className="text-2xl mb-2">✈️</p>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Aucun séjour à venir</p>
                    <p className="text-xs text-slate-400">Vos prochains voyages apparaîtront ici</p>
                </div>
            )}

            {/* Stats rapides */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <Link href="/mon-espace/reservations"
                    className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 hover:border-emerald-200 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5"/></svg>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-slate-900">{nb_reservations}</p>
                        <p className="text-xs text-slate-400">Réservations</p>
                    </div>
                </Link>
                <Link href="/mon-espace/programmes"
                    className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 hover:border-emerald-200 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-slate-900">{nb_programmes}</p>
                        <p className="text-xs text-slate-400">Programmes</p>
                    </div>
                </Link>
            </div>

            {/* Réservations récentes */}
            {reservations_recentes.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900">Récent</h3>
                        <Link href="/mon-espace/reservations" className="text-xs font-semibold text-emerald-600">Voir tout →</Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {reservations_recentes.map(r => (
                            <div key={r.id} className="flex items-center gap-3 px-4 py-3.5">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-lg flex-shrink-0">🏨</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{r.hebergement}</p>
                                    <p className="text-xs text-slate-400">{r.date_arrivee} → {r.date_depart}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUT_BADGE[r.statut] ?? 'bg-slate-100 text-slate-500'}`}>
                                    {STATUT_LABEL[r.statut] ?? r.statut}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </VoyageurLayout>
    );
}