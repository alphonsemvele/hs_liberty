import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Urgence {
    id: number; reference: string; voyageur: string; initials: string;
    type: string; statut: string; localisation: string; adresse: string;
    declenchee_le: string; depuis: string; description: string;
    notes_resolution: string; prise_en_charge_le: string | null;
    resolue_le: string | null; operateur: string; hebergement: string;
    latitude: number | null; longitude: number | null;
}

const TYPE_CONF: Record<string, { label: string; icon: string; bg: string; text: string }> = {
    medical:  { label: 'Médical',  icon: '🏥', bg: 'bg-red-100',    text: 'text-red-700'    },
    securite: { label: 'Sécurité', icon: '🔒', bg: 'bg-orange-100', text: 'text-orange-700' },
    accident: { label: 'Accident', icon: '⚠️', bg: 'bg-amber-100',  text: 'text-amber-700'  },
    autre:    { label: 'Autre',    icon: '📢', bg: 'bg-slate-100',  text: 'text-slate-600'  },
};

const STATUT_CONF: Record<string, { label: string; badge: string; banniere: string }> = {
    declenche:    { label: 'Déclenchée',    badge: 'bg-red-100 text-red-700',     banniere: 'from-red-600 to-red-700'       },
    en_traitement:{ label: 'En traitement', badge: 'bg-amber-100 text-amber-700', banniere: 'from-amber-500 to-orange-500'  },
    resolu:       { label: 'Résolue',       badge: 'bg-emerald-100 text-emerald-700', banniere: 'from-emerald-600 to-teal-600' },
};

export default function UrgenceShow({ urgence }: { urgence: Urgence }) {
    const u = urgence;
    if (!u) return null;

    const [showModal, setShowModal] = useState(false);
    const { data, setData, patch, processing } = useForm({
        statut:           u.statut,
        notes_resolution: u.notes_resolution ?? '',
    });

    const tc = TYPE_CONF[u.type] ?? TYPE_CONF.autre;
    const sc = STATUT_CONF[u.statut] ?? STATUT_CONF.declenche;

    const handleUpdate = () => {
        patch(`/urgences/${u.id}/statut`, {
            onSuccess: () => setShowModal(false),
        });
    };

    return (
        <DashboardLayout title={`Urgence ${u.reference}`} subtitle={`${u.voyageur} · ${tc.label}`}>

            {/* Modal changement statut */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)}/>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">Mettre à jour le statut</h3>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nouveau statut</label>
                                <div className="space-y-2">
                                    {[
                                        { val:'declenche',     label:'Déclenchée',    color:'border-red-300 bg-red-50 text-red-700'      },
                                        { val:'en_traitement', label:'En traitement', color:'border-amber-300 bg-amber-50 text-amber-700' },
                                        { val:'resolu',        label:'Résolue',       color:'border-emerald-300 bg-emerald-50 text-emerald-700' },
                                    ].map(s => (
                                        <label key={s.val} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.statut === s.val ? s.color : 'border-slate-200 hover:border-slate-300'}`}>
                                            <input type="radio" name="statut" value={s.val} checked={data.statut === s.val} onChange={e => setData('statut', e.target.value)} className="sr-only"/>
                                            <span className="text-sm font-semibold">{s.label}</span>
                                            {data.statut === s.val && <div className="ml-auto w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg></div>}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {data.statut === 'resolu' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Notes de résolution</label>
                                    <textarea value={data.notes_resolution} onChange={e => setData('notes_resolution', e.target.value)}
                                        rows={3} placeholder="Décrivez comment l'urgence a été résolue…"
                                        className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-400 focus:bg-white"/>
                                </div>
                            )}
                        </div>
                        <div className="px-6 pb-6 flex gap-3">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-sm border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50">Annuler</button>
                            <button onClick={handleUpdate} disabled={processing}
                                className="flex-1 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-40 flex items-center justify-center gap-2">
                                {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/urgences" className="text-slate-400 hover:text-red-600 transition-colors">Urgences</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">{u.reference}</span>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">

                    {/* Hero card */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className={`h-24 bg-gradient-to-br ${sc.banniere} relative`}>
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'radial-gradient(circle at 80% 40%, white 0%, transparent 55%)' }}/>
                            <div className="absolute bottom-3 right-4 flex items-center gap-2">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 text-white border border-white/30`}>{sc.label}</span>
                                {u.statut !== 'resolu' && <span className="text-xs font-bold text-white/80">il y a {u.depuis}</span>}
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <div className="flex items-end gap-4 -mt-7 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-red-500 border-4 border-white shadow-lg flex items-center justify-center text-lg font-black text-white flex-shrink-0">
                                    {u.initials}
                                </div>
                                <div className="mb-1">
                                    <h1 className="text-xl font-black text-slate-900">{u.voyageur}</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${tc.bg} ${tc.text}`}>
                                            {tc.icon} {tc.label}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono">{u.reference}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-5">
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-400 mb-1">Déclenchée</p>
                                    <p className="text-sm font-black text-slate-900">{u.declenchee_le}</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-400 mb-1">Prise en charge</p>
                                    <p className="text-sm font-black text-slate-900">{u.prise_en_charge_le ?? '—'}</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-400 mb-1">Résolue</p>
                                    <p className="text-sm font-black text-slate-900">{u.resolue_le ?? '—'}</p>
                                </div>
                            </div>

                            {u.localisation && (
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Localisation</p>
                                        <p className="text-sm text-slate-700">{u.localisation}</p>
                                        {u.adresse && <p className="text-xs text-slate-400 mt-0.5">{u.adresse}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {u.description && (
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900">Description de l'urgence</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600 leading-relaxed">{u.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Notes résolution */}
                    {u.notes_resolution && (
                        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Notes de résolution</p>
                            </div>
                            <p className="text-sm text-emerald-700 leading-relaxed">{u.notes_resolution}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                        {u.statut !== 'resolu' && (
                            <button onClick={() => setShowModal(true)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                Mettre à jour le statut
                            </button>
                        )}
                        {u.statut === 'declenche' && (
                            <button onClick={() => { setData('statut', 'en_traitement'); handleUpdate(); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                Prendre en charge
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-900">Fiche</h3></div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { l:'Référence',    v: u.reference    },
                                { l:'Hébergement',  v: u.hebergement  },
                                { l:'Opérateur',    v: u.operateur    },
                                { l:'Statut',       v: sc.label       },
                            ].map(item => (
                                <div key={item.l} className="flex items-center justify-between px-5 py-3">
                                    <span className="text-xs text-slate-400 font-medium">{item.l}</span>
                                    <span className="text-sm font-semibold text-slate-900">{item.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}