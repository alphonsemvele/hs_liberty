import ProfessionnelLayout from './layout';

const STATUT_CONF: Record<string, { label: string; badge: string }> = {
    planifie: { label:'Planifiée',  badge:'bg-amber-100 text-amber-700'   },
    realise:  { label:'Réalisée',   badge:'bg-emerald-100 text-emerald-700'},
    annule:   { label:'Annulée',    badge:'bg-red-100 text-red-600'       },
};

export default function ProfessionnelInterventions({ interventions = [] }: { interventions: any[] }) {
    const aVenir  = interventions.filter(i => i.statut === 'planifie');
    const passees = interventions.filter(i => i.statut !== 'planifie');

    const Card = ({ i }: { i: any }) => {
        const sc = STATUT_CONF[i.statut] ?? STATUT_CONF.realise;
        return (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:border-pink-200 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-xs font-black text-pink-700 flex-shrink-0">{i.initials}</div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{i.voyageur}</p>
                            <p className="text-xs text-slate-400">{i.type}</p>
                        </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${sc.badge}`}>{sc.label}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>📅 {i.date} à {i.heure}</span>
                    <span>⏱ {i.duree}</span>
                    <span className="font-semibold text-emerald-600">{i.montant}</span>
                </div>
                {i.notes && <p className="text-xs text-slate-500 mt-2 bg-slate-50 rounded-xl px-3 py-2">{i.notes}</p>}
            </div>
        );
    };

    return (
        <ProfessionnelLayout title="Mes interventions" subtitle={`${interventions.length} intervention(s)`}>
            {aVenir.length > 0 && (
                <div className="mb-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">À venir</p>
                    <div className="space-y-3">{aVenir.map(i => <Card key={i.id} i={i}/>)}</div>
                </div>
            )}
            {passees.length > 0 && (
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Historique</p>
                    <div className="space-y-3 opacity-80">{passees.map(i => <Card key={i.id} i={i}/>)}</div>
                </div>
            )}
            {interventions.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                    <p className="text-4xl mb-4">🩺</p>
                    <p className="text-sm font-bold text-slate-600 mb-1">Aucune intervention</p>
                    <p className="text-xs text-slate-400">Vos interventions apparaîtront ici</p>
                </div>
            )}
        </ProfessionnelLayout>
    );
}