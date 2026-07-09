import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Etape { ordre: number; type: 'transport'|'hebergement'|'loisir'|'soin'|'autre'; titre: string; heure: string; details: string; }
interface CheckItem { item: string; fait: boolean; }
interface Programme {
    id: number; titre: string; voyageur: string; destination: string;
    date_debut: string; date_fin: string; statut: string;
    partage_aidants: boolean; etapes: Etape[]; checklist: CheckItem[];
}

const TYPE_STYLE: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
    transport:   { bg:'bg-sky-100',    text:'text-sky-700',    label:'Transport',   icon:<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> },
    hebergement: { bg:'bg-emerald-100',text:'text-emerald-700',label:'Hébergement',  icon:<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18"/></svg> },
    loisir:      { bg:'bg-amber-100',  text:'text-amber-700',  label:'Loisir',      icon:<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    soin:        { bg:'bg-pink-100',   text:'text-pink-700',   label:'Soin médical',icon:<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg> },
    autre:       { bg:'bg-slate-100',  text:'text-slate-600',  label:'Autre',       icon:<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
};

const STATUT_CFG: Record<string, { badge: string; label: string }> = {
    en_cours: { badge:'bg-emerald-100 text-emerald-700', label:'En cours'  },
    a_venir:  { badge:'bg-sky-100 text-sky-700',         label:'À venir'   },
    termine:  { badge:'bg-slate-100 text-slate-500',     label:'Terminé'   },
    brouillon:{ badge:'bg-amber-100 text-amber-700',     label:'Brouillon' },
};

// ── Modal ajout étape ─────────────────────────────────────────
function ModalEtape({ programmeId, onClose }: { programmeId: number; onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type:        'transport' as string,
        titre:       '',
        date_heure:  '',
        description: '',
        lieu:        '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/programme/${programmeId}/etapes`, {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    const inp = (err?: string) =>
        `w-full px-4 py-3 text-sm border-2 rounded-xl bg-slate-50 focus:outline-none focus:bg-white transition-all ${err ? 'border-red-300' : 'border-slate-200 focus:border-emerald-400'}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

                {/* Header modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Ajouter une étape</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                <form onSubmit={submit}>
                    <div className="p-6 space-y-4">

                        {/* Type — cards */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Type *</label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(TYPE_STYLE).map(([val, ts]) => (
                                    <label key={val} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${data.type === val ? `border-emerald-400 ${ts.bg}` : 'border-slate-200 hover:border-slate-300'}`}>
                                        <input type="radio" name="type" value={val} checked={data.type === val} onChange={e => setData('type', e.target.value)} className="sr-only"/>
                                        <span className={data.type === val ? ts.text : 'text-slate-400'}>{ts.icon}</span>
                                        <span className="text-[10px] font-bold text-slate-700 leading-tight">{ts.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Titre */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Titre *</label>
                            <input value={data.titre} onChange={e => setData('titre', e.target.value)} placeholder="ex: Vol Douala → Dakar" className={inp(errors.titre)}/>
                            {errors.titre && <p className="mt-1 text-xs text-red-500">{errors.titre}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Heure */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Heure</label>
                                <input type="time" value={data.date_heure} onChange={e => setData('date_heure', e.target.value)} className={inp()}/>
                            </div>
                            {/* Lieu */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Lieu</label>
                                <input value={data.lieu} onChange={e => setData('lieu', e.target.value)} placeholder="ex: Aéroport" className={inp()}/>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Détails</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} placeholder="Informations complémentaires…" className={inp()}/>
                        </div>
                    </div>

                    <div className="px-6 pb-6 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                            Annuler
                        </button>
                        <button type="submit" disabled={processing || !data.titre}
                            className="flex-1 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                            {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                            Ajouter l'étape
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Page principale ───────────────────────────────────────────
export default function ProgrammeShow({ programme }: { programme: Programme }) {
    const [showModal, setShowModal] = useState(false);
    const prog = programme;
    if (!prog) return null;

    const checkFait  = prog.checklist.filter(c => c.fait).length;
    const checkTotal = prog.checklist.length;
    const pct = checkTotal > 0 ? Math.round((checkFait / checkTotal) * 100) : 0;
    const sc  = STATUT_CFG[prog.statut] ?? STATUT_CFG.brouillon;

    const togglePartage = () => router.patch(`/programme/${prog.id}`, { partage_aidants: !prog.partage_aidants });

    return (
        <DashboardLayout title={prog.titre} subtitle={`Programme de ${prog.voyageur}`}>

            {showModal && <ModalEtape programmeId={prog.id} onClose={() => setShowModal(false)}/>}

            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/programme" className="text-slate-400 hover:text-emerald-600 transition-colors">Programmes</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">{prog.titre}</span>
            </div>

            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-black text-slate-900">{prog.titre}</h1>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${sc.badge}`}>{sc.label}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                {prog.voyageur}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                {prog.destination}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                {prog.date_debut} → {prog.date_fin}
                            </span>
                            {prog.partage_aidants && (
                                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    Partagé avec aidants
                                </span>
                            )}
                        </div>
                    </div>
                    <button onClick={() => setShowModal(true)} className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/></svg>
                        Ajouter une étape
                    </button>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">

                {/* Timeline */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Programme du séjour</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400">{prog.etapes.length} étape{prog.etapes.length !== 1 ? 's' : ''}</span>
                                <button onClick={() => setShowModal(true)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/></svg>
                                    Ajouter
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {prog.etapes.length > 0 ? (
                                <div className="relative">
                                    <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-slate-100"/>
                                    <div className="space-y-4">
                                        {prog.etapes.map((e, i) => {
                                            const ts = TYPE_STYLE[e.type] ?? TYPE_STYLE.autre;
                                            return (
                                                <div key={i} className="relative flex gap-4">
                                                    <div className={`relative z-10 w-11 h-11 rounded-2xl ${ts.bg} flex items-center justify-center flex-shrink-0 ${ts.text}`}>
                                                        {ts.icon}
                                                    </div>
                                                    <div className={`flex-1 p-4 rounded-2xl border transition-all hover:shadow-sm ${prog.statut === 'en_cours' && i === 1 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <span className="text-[10px] font-black text-slate-300 tracking-widest">ÉTAPE {e.ordre}</span>
                                                            <span className="text-xs font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-lg flex-shrink-0">{e.heure}</span>
                                                        </div>
                                                        <h4 className="font-bold text-slate-900 mb-1">{e.titre}</h4>
                                                        {e.details && <p className="text-sm text-slate-500">{e.details}</p>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-3">Aucune étape pour l'instant</p>
                                    <button onClick={() => setShowModal(true)}
                                        className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/></svg>
                                        Ajouter la première étape
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Checklist */}
                    {prog.checklist.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-bold text-slate-900">Checklist préparation</h3>
                                    <span className="text-xs font-bold text-slate-500">{checkFait}/{checkTotal}</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${pct}%` }}/>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {prog.checklist.map((c, i) => (
                                    <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${c.fait ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                            {c.fait && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                        </div>
                                        <span className={`text-sm ${c.fait ? 'text-slate-400 line-through' : 'text-slate-900 font-medium'}`}>{c.item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                        <button onClick={() => setShowModal(true)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14"/></svg>
                            Ajouter une étape
                        </button>
                        <button onClick={togglePartage}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${prog.partage_aidants ? 'border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-500' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {prog.partage_aidants ? 'Arrêter le partage' : 'Partager avec aidants'}
                        </button>
                    </div>

                    {/* Légende types */}
                    {prog.etapes.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-5">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Types d'étapes</p>
                            <div className="space-y-2">
                                {Object.entries(TYPE_STYLE).filter(([k]) => k !== 'autre').map(([type, ts]) => {
                                    const count = prog.etapes.filter(e => e.type === type).length;
                                    if (count === 0) return null;
                                    return (
                                        <div key={type} className="flex items-center gap-3">
                                            <div className={`w-7 h-7 rounded-lg ${ts.bg} ${ts.text} flex items-center justify-center flex-shrink-0`}>{ts.icon}</div>
                                            <span className="text-sm text-slate-600">{ts.label}</span>
                                            <span className="text-xs font-semibold text-slate-400 ml-auto">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}