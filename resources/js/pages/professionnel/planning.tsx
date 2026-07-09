import ProfessionnelLayout from './layout';

const JOURS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

export default function ProfessionnelPlanning({ interventions = [], semaine_label = '' }: { interventions: any[]; semaine_label: string }) {
    const parJour: Record<string, any[]> = {};
    JOURS.forEach(j => parJour[j] = []);
    interventions.forEach(i => {
        const jour = i.jour ? i.jour.charAt(0).toUpperCase() + i.jour.slice(1) : '';
        if (parJour[jour]) parJour[jour].push(i);
    });

    return (
        <ProfessionnelLayout title="Planning" subtitle={semaine_label ? `Semaine du ${semaine_label}` : 'Semaine en cours'}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {JOURS.map(jour => (
                    <div key={jour} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className={`px-4 py-3 border-b border-slate-100 ${parJour[jour].length > 0 ? 'bg-pink-50' : ''}`}>
                            <p className={`text-sm font-bold ${parJour[jour].length > 0 ? 'text-pink-700' : 'text-slate-400'}`}>{jour}</p>
                            <p className="text-xs text-slate-400">{parJour[jour].length} intervention(s)</p>
                        </div>
                        <div className="p-3 space-y-2 min-h-[80px]">
                            {parJour[jour].length > 0 ? parJour[jour].map(i => (
                                <div key={i.id} className="bg-pink-50 border border-pink-100 rounded-xl p-2.5">
                                    <p className="text-xs font-bold text-pink-700">{i.heure}</p>
                                    <p className="text-xs font-semibold text-slate-900 mt-0.5">{i.voyageur}</p>
                                    <p className="text-[10px] text-slate-400">{i.type} · {i.duree} min</p>
                                </div>
                            )) : (
                                <p className="text-xs text-slate-300 text-center pt-3">Libre</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </ProfessionnelLayout>
    );
}