import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AidantLayout from './layout';

interface CheckItem { item: string; fait: boolean; categorie: string; }

const CAT_CONF: Record<string, { label: string; color: string; icon: string }> = {
    documents:   { label:'Documents',   color:'bg-sky-50 text-sky-700 border-sky-200',     icon:'📄' },
    hebergement: { label:'Hébergement', color:'bg-emerald-50 text-emerald-700 border-emerald-200', icon:'🏨' },
    sante:       { label:'Santé',       color:'bg-pink-50 text-pink-700 border-pink-200',   icon:'💊' },
    transport:   { label:'Transport',   color:'bg-violet-50 text-violet-700 border-violet-200', icon:'🚐' },
    securite:    { label:'Sécurité',    color:'bg-amber-50 text-amber-700 border-amber-200', icon:'🔒' },
};

export default function AidantChecklist({
    voyageur_id,
    checklist: initialChecklist = [],
}: {
    voyageur_id: number;
    checklist: CheckItem[];
}) {
    const [checklist, setChecklist] = useState<CheckItem[]>(initialChecklist);
    const [saved, setSaved] = useState(false);
    const form = useForm({ checklist: initialChecklist });

    const toggle = (idx: number) => {
        const updated = checklist.map((c, i) => i === idx ? { ...c, fait: !c.fait } : c);
        setChecklist(updated);
        form.setData('checklist', updated);
    };

    const save = () => {
        form.patch(`/aidant/checklist/${voyageur_id}`, {
            onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2000); },
        });
    };

    const fait   = checklist.filter(c => c.fait).length;
    const total  = checklist.length;
    const pct    = total > 0 ? Math.round(fait / total * 100) : 0;

    // Grouper par catégorie
    const categories = [...new Set(checklist.map(c => c.categorie ?? 'autre'))];

    return (
        <AidantLayout title="Checklist de préparation" subtitle="Suivi des tâches avant le départ">

            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/aidant" className="text-slate-400 hover:text-teal-600 transition-colors">Tableau de bord</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <Link href={`/aidant/suivi/${voyageur_id}`} className="text-slate-400 hover:text-teal-600 transition-colors">Suivi</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">Checklist</span>
            </div>

            <div className="max-w-2xl space-y-5">

                {/* Progression */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm font-bold text-slate-900">Progression</p>
                            <p className="text-xs text-slate-400">{fait}/{total} tâches complétées</p>
                        </div>
                        <span className={`text-2xl font-extrabold ${pct === 100 ? 'text-emerald-600' : 'text-teal-600'}`}>{pct}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-teal-500'}`} style={{ width:`${pct}%` }}/>
                    </div>
                    {pct === 100 && (
                        <p className="text-xs font-bold text-emerald-600 mt-2 text-center">✅ Tout est prêt pour le départ !</p>
                    )}
                </div>

                {/* Items par catégorie */}
                {categories.map(cat => {
                    const items = checklist.map((c, i) => ({ ...c, idx: i })).filter(c => (c.categorie ?? 'autre') === cat);
                    const cc = CAT_CONF[cat] ?? { label: cat, color: 'bg-slate-100 text-slate-600 border-slate-200', icon: '📌' };
                    return (
                        <div key={cat} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                                <span className="text-lg">{cc.icon}</span>
                                <h3 className="text-sm font-bold text-slate-900">{cc.label}</h3>
                                <span className="ml-auto text-xs text-slate-400">
                                    {items.filter(i => i.fait).length}/{items.length}
                                </span>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {items.map(item => (
                                    <label key={item.idx} onClick={() => toggle(item.idx)}
                                        className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${item.fait ? 'bg-slate-50/50' : ''}`}>
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all
                                            ${item.fait ? 'bg-teal-600 border-teal-600' : 'border-slate-300 hover:border-teal-400'}`}>
                                            {item.fait && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                        </div>
                                        <span className={`text-sm transition-all ${item.fait ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                                            {item.item}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Bouton sauvegarder */}
                <div className="flex items-center justify-between pt-2">
                    <Link href={`/aidant/suivi/${voyageur_id}`} className="text-sm text-slate-500 hover:text-slate-700">← Retour au suivi</Link>
                    <button onClick={save} disabled={form.processing}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all
                            ${saved ? 'bg-emerald-500 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'} disabled:opacity-50`}>
                        {form.processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                        {saved ? '✅ Sauvegardé !' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </AidantLayout>
    );
}