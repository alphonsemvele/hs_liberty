import { Link } from '@inertiajs/react';
import VoyageurLayout from './layout';

interface Reservation {
    id: number; reference: string; hebergement: string; ville: string; pays: string;
    date_arrivee: string; date_depart: string; nb_nuits: number;
    statut: string; montant: string;
}

const STATUT_CONF: Record<string, { label: string; badge: string; dot: string }> = {
    confirmee:  { label:'Confirmée',   badge:'bg-emerald-50 text-emerald-700 border-emerald-200', dot:'bg-emerald-500'        },
    en_attente: { label:'En attente',  badge:'bg-amber-50 text-amber-700 border-amber-200',       dot:'bg-amber-500'          },
    terminee:   { label:'Terminée',    badge:'bg-slate-100 text-slate-500 border-slate-200',      dot:'bg-slate-400'          },
    annulee:    { label:'Annulée',     badge:'bg-red-50 text-red-600 border-red-200',             dot:'bg-red-400'            },
};

export default function VoyageurReservations({ reservations = [] }: { reservations?: Reservation[] }) {
    const actives  = reservations.filter(r => ['confirmee','en_attente'].includes(r.statut));
    const archives = reservations.filter(r => !['confirmee','en_attente'].includes(r.statut));

    const Card = ({ r }: { r: Reservation }) => {
        const sc = STATUT_CONF[r.statut] ?? STATUT_CONF.terminee;
        return (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-slate-50">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl flex-shrink-0">🏨</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{r.hebergement}</p>
                        <p className="text-xs text-slate-400">📍 {r.ville}{r.pays ? `, ${r.pays}` : ''}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${sc.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
                        {sc.label}
                    </span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                        <p className="text-xs text-slate-400">
                            {r.date_arrivee} → {r.date_depart} · <span className="font-semibold text-slate-600">{r.nb_nuits} nuits</span>
                        </p>
                        <p className="text-xs font-mono text-slate-300">{r.reference}</p>
                    </div>
                    <p className="text-sm font-black text-emerald-600">{r.montant}</p>
                </div>
            </div>
        );
    };

    return (
        <VoyageurLayout title="Mes réservations" subtitle={`${reservations.length} séjour(s) au total`}>

            {actives.length > 0 && (
                <div className="mb-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">À venir · En cours</p>
                    <div className="space-y-3">
                        {actives.map(r => <Card key={r.id} r={r}/>)}
                    </div>
                </div>
            )}

            {archives.length > 0 && (
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Historique</p>
                    <div className="space-y-3 opacity-75">
                        {archives.map(r => <Card key={r.id} r={r}/>)}
                    </div>
                </div>
            )}

            {reservations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-4xl mb-4">✈️</p>
                    <p className="text-sm font-bold text-slate-600 mb-1">Aucune réservation</p>
                    <p className="text-xs text-slate-400">Vos séjours apparaîtront ici</p>
                </div>
            )}
        </VoyageurLayout>
    );
}