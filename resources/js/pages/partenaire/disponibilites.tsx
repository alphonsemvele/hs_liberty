import PartenaireLayout from './layout';

const STATUT_COLOR: Record<string, string> = {
    confirmee:  'bg-emerald-100 border-emerald-200 text-emerald-700',
    en_attente: 'bg-amber-100 border-amber-200 text-amber-700',
};

export default function PartenaireDisponibilites({ hebergements = [], reservations = [] }: any) {
    const mois = [...Array(3)].map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() + i);
        return { year: d.getFullYear(), month: d.getMonth() };
    });

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDay    = (year: number, month: number) => new Date(year, month, 1).getDay();

    const isOccupe = (year: number, month: number, day: number) => {
        const date = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        return reservations.find((r: any) => date >= r.date_arrivee && date < r.date_depart);
    };

    return (
        <PartenaireLayout title="Disponibilités" subtitle="Vue calendrier de vos réservations">

            {/* Légende */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-100 border border-slate-200"/><span className="text-xs text-slate-500">Disponible</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-200"/><span className="text-xs text-slate-500">Confirmée</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-200"/><span className="text-xs text-slate-500">En attente</span></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {mois.map(({ year, month }) => {
                    const MOIS_LABELS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
                    const JOURS = ['Di','Lu','Ma','Me','Je','Ve','Sa'];
                    const days   = getDaysInMonth(year, month);
                    const first  = getFirstDay(year, month);

                    return (
                        <div key={`${year}-${month}`} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                                <p className="text-sm font-bold text-slate-900">{MOIS_LABELS[month]} {year}</p>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-7 mb-2">
                                    {JOURS.map(j => <p key={j} className="text-[10px] font-bold text-slate-400 text-center">{j}</p>)}
                                </div>
                                <div className="grid grid-cols-7 gap-0.5">
                                    {[...Array(first)].map((_, i) => <div key={`e-${i}`}/>)}
                                    {[...Array(days)].map((_, i) => {
                                        const day = i + 1;
                                        const res = isOccupe(year, month, day);
                                        const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                                        return (
                                            <div key={day} title={res ? `${res.hebergement} — ${res.label_arrivee}→${res.label_depart}` : ''}
                                                className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-all cursor-default
                                                    ${isToday ? 'ring-2 ring-sky-400 font-bold' : ''}
                                                    ${res?.statut === 'confirmee'  ? 'bg-emerald-200 text-emerald-800 font-semibold' :
                                                      res?.statut === 'en_attente' ? 'bg-amber-200 text-amber-800 font-semibold' :
                                                      'hover:bg-slate-100 text-slate-500'}`}>
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Liste réservations */}
            {reservations.length > 0 && (
                <div className="mt-6 bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900">Réservations actives</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {reservations.map((r: any) => (
                            <div key={r.id} className="flex items-center gap-4 px-6 py-3.5">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900">{r.hebergement}</p>
                                    <p className="text-xs text-slate-400">{r.label_arrivee} → {r.label_depart} · {r.nb_nuits} nuits</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUT_COLOR[r.statut] ?? 'bg-slate-100 text-slate-500'}`}>
                                    {r.statut === 'confirmee' ? 'Confirmée' : 'En attente'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </PartenaireLayout>
    );
}