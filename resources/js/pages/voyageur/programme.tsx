import VoyageurLayout from './layout';

interface Etape { ordre: number; type: string; titre: string; heure: string; description: string; lieu: string; }
interface CheckItem { item: string; fait: boolean; }
interface Programme {
    id: number; titre: string; destination: string; date_debut: string;
    date_fin: string; statut: string; etapes: Etape[]; checklist: CheckItem[];
}

const TYPE_ICON: Record<string, string> = {
    transport: '✈️', hebergement: '🏨', loisir: '🎭', soin: '💊', autre: '📌',
};
const TYPE_BG: Record<string, string> = {
    transport: 'bg-sky-100', hebergement: 'bg-emerald-100', loisir: 'bg-amber-100', soin: 'bg-pink-100', autre: 'bg-slate-100',
};

export default function VoyageurProgramme({ programme }: { programme: Programme }) {
    if (!programme) return null;
    const p = programme;
    const checkFait = p.checklist.filter(c => c.fait).length;

    return (
        <VoyageurLayout title={p.titre} subtitle={`${p.destination} · ${p.date_debut} → ${p.date_fin}`}>

            {/* Checklist */}
            {p.checklist.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-4">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">Préparation</h3>
                        <span className="text-xs font-bold text-slate-500">{checkFait}/{p.checklist.length}</span>
                    </div>
                    <div className="p-4">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width:`${p.checklist.length ? (checkFait/p.checklist.length*100) : 0}%` }}/>
                        </div>
                        <div className="space-y-2">
                            {p.checklist.map((c, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${c.fait ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                        {c.fait && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                    </div>
                                    <span className={`text-sm ${c.fait ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>{c.item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Programme</h3>
                    <span className="text-xs text-slate-400">{p.etapes.length} étapes</span>
                </div>
                <div className="p-4">
                    {p.etapes.length > 0 ? (
                        <div className="relative">
                            <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-slate-100"/>
                            <div className="space-y-4">
                                {p.etapes.map((e, i) => (
                                    <div key={i} className="relative flex gap-3">
                                        <div className={`relative z-10 w-10 h-10 rounded-2xl ${TYPE_BG[e.type] ?? TYPE_BG.autre} flex items-center justify-center text-lg flex-shrink-0`}>
                                            {TYPE_ICON[e.type] ?? TYPE_ICON.autre}
                                        </div>
                                        <div className="flex-1 bg-slate-50 rounded-2xl p-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-black text-slate-300 tracking-widest">ÉTAPE {e.ordre}</span>
                                                <span className="text-xs font-mono font-bold text-slate-500">{e.heure}</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900">{e.titre}</p>
                                            {e.lieu && <p className="text-xs text-slate-400 mt-0.5">📍 {e.lieu}</p>}
                                            {e.description && <p className="text-xs text-slate-500 mt-1">{e.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-6">Aucune étape pour l'instant</p>
                    )}
                </div>
            </div>
        </VoyageurLayout>
    );
}