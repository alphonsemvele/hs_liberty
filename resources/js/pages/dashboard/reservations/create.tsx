import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../layout';

interface Hebergement { id: number; nom: string; ville: string; pays: string; prix_nuit_min: number; prix_nuit_max: number; devise: string; }
interface Voyageur    { id: number; nom: string; initials: string; type_handicap: string; niveau_dependance: number; }

const TYPE_COLOR: Record<string, string> = {
    moteur: 'bg-blue-50 text-blue-700', sensoriel: 'bg-purple-50 text-purple-700',
    cognitif: 'bg-orange-50 text-orange-700', polyhandicap: 'bg-red-50 text-red-700',
    psychiatrique: 'bg-pink-50 text-pink-700', autre: 'bg-slate-100 text-slate-500',
};

export default function ReservationCreate({
    hebergements = [], voyageurs = [],
}: { hebergements?: Hebergement[]; voyageurs?: Voyageur[] }) {

    const { data, setData, post, processing, errors } = useForm({
        voyageur_id:      '',
        hebergement_id:   '',
        date_arrivee:     '',
        date_depart:      '',
        nb_voyageurs:     '1',
        besoins_speciaux: '',
        devise:           'XOF',
    });

    const submit: FormEventHandler = (e) => { e.preventDefault(); post('/reservations'); };

    const selHeb = hebergements.find(h => String(h.id) === data.hebergement_id);
    const selVoy = voyageurs.find(v => String(v.id) === data.voyageur_id);

    // Calcul estimatif
    const nbNuits = data.date_arrivee && data.date_depart
        ? Math.max(0, Math.round((new Date(data.date_depart).getTime() - new Date(data.date_arrivee).getTime()) / 86400000))
        : 0;
    const montantMin = selHeb && nbNuits > 0 ? selHeb.prix_nuit_min * nbNuits : 0;
    const montantMax = selHeb && nbNuits > 0 ? selHeb.prix_nuit_max * nbNuits : 0;

    const inp = (err?: string) =>
        `w-full px-4 py-3 text-sm border-2 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:bg-white transition-all ${err ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-emerald-400'}`;

    const Field = ({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) => (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
            {children}
            {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{error}</p>}
        </div>
    );

    return (
        <DashboardLayout title="Nouvelle réservation" subtitle="Créer une réservation pour un voyageur">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/reservations" className="text-slate-400 hover:text-emerald-600 transition-colors">Réservations</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">Nouvelle réservation</span>
            </div>

            <form onSubmit={submit}>
                <div className="max-w-5xl grid xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-6">

                        {/* 1 — Voyageur */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                </div>
                                <h2 className="text-sm font-bold text-slate-900">Voyageur *</h2>
                            </div>
                            <div className="p-6 space-y-2 max-h-64 overflow-y-auto">
                                {voyageurs.map(v => (
                                    <label key={v.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.voyageur_id === String(v.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                        <input type="radio" name="voyageur" value={String(v.id)} checked={data.voyageur_id === String(v.id)} onChange={e => setData('voyageur_id', e.target.value)} className="sr-only"/>
                                        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">{v.initials}</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{v.nom}</p>
                                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${TYPE_COLOR[v.type_handicap] ?? TYPE_COLOR.autre}`}>{v.type_handicap} · Niv.{v.niveau_dependance}</span>
                                        </div>
                                        {data.voyageur_id === String(v.id) && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                        )}
                                    </label>
                                ))}
                                {voyageurs.length === 0 && <p className="text-sm text-slate-400 italic py-4 text-center">Aucun voyageur en base.</p>}
                                {errors.voyageur_id && <p className="text-xs text-red-500">{errors.voyageur_id}</p>}
                            </div>
                        </div>

                        {/* 2 — Hébergement */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18"/></svg>
                                </div>
                                <h2 className="text-sm font-bold text-slate-900">Hébergement *</h2>
                            </div>
                            <div className="p-6 space-y-2 max-h-64 overflow-y-auto">
                                {hebergements.map(h => (
                                    <label key={h.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.hebergement_id === String(h.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                        <input type="radio" name="hebergement" value={String(h.id)} checked={data.hebergement_id === String(h.id)} onChange={e => setData('hebergement_id', e.target.value)} className="sr-only"/>
                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-sm font-black text-emerald-700 flex-shrink-0">{h.nom.charAt(0)}</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{h.nom}</p>
                                            <p className="text-xs text-slate-400">{h.ville}, {h.pays} · {h.prix_nuit_min.toLocaleString()} – {h.prix_nuit_max.toLocaleString()} {h.devise}/nuit</p>
                                        </div>
                                        {data.hebergement_id === String(h.id) && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                        )}
                                    </label>
                                ))}
                                {hebergements.length === 0 && <p className="text-sm text-slate-400 italic py-4 text-center">Aucun hébergement actif.</p>}
                                {errors.hebergement_id && <p className="text-xs text-red-500">{errors.hebergement_id}</p>}
                            </div>
                        </div>

                        {/* 3 — Dates */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                </div>
                                <h2 className="text-sm font-bold text-slate-900">Dates du séjour *</h2>
                            </div>
                            <div className="p-6 grid md:grid-cols-2 gap-5">
                                <Field label="Date d'arrivée *" error={errors.date_arrivee}>
                                    <input type="date" value={data.date_arrivee} onChange={e => setData('date_arrivee', e.target.value)} className={inp(errors.date_arrivee)}/>
                                </Field>
                                <Field label="Date de départ *" error={errors.date_depart}>
                                    <input type="date" value={data.date_depart} onChange={e => setData('date_depart', e.target.value)} min={data.date_arrivee} className={inp(errors.date_depart)}/>
                                </Field>
                                <Field label="Nombre de voyageurs *" error={errors.nb_voyageurs}>
                                    <input type="number" min="1" max="20" value={data.nb_voyageurs} onChange={e => setData('nb_voyageurs', e.target.value)} className={inp(errors.nb_voyageurs)}/>
                                </Field>
                                <Field label="Devise">
                                    <select value={data.devise} onChange={e => setData('devise', e.target.value)} className={inp()}>
                                        {[['XOF','Franc CFA'],['EUR','Euro'],['MAD','Dirham'],['KES','Shilling'],['USD','Dollar']].map(([v,l])=><option key={v} value={v}>{l} ({v})</option>)}
                                    </select>
                                </Field>
                                <div className="md:col-span-2">
                                    <Field label="Besoins spéciaux" hint="Équipements médicaux requis, accessibilité spécifique, allergies…">
                                        <textarea value={data.besoins_speciaux} onChange={e => setData('besoins_speciaux', e.target.value)} rows={3} placeholder="Précisez les besoins particuliers du voyageur…" className={inp()}/>
                                    </Field>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Récapitulatif sticky */}
                    <div>
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden sticky top-24">
                            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                                <h3 className="text-sm font-bold text-slate-900">Récapitulatif</h3>
                            </div>
                            <div className="p-5 space-y-4">

                                {/* Voyageur */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Voyageur</p>
                                    {selVoy ? (
                                        <div className="flex items-center gap-2.5 p-3 bg-violet-50 rounded-xl">
                                            <div className="w-8 h-8 rounded-lg bg-violet-200 flex items-center justify-center text-xs font-black text-violet-800">{selVoy.initials}</div>
                                            <p className="text-sm font-semibold text-slate-900">{selVoy.nom}</p>
                                        </div>
                                    ) : <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non sélectionné</p>}
                                </div>

                                {/* Hébergement */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Hébergement</p>
                                    {selHeb ? (
                                        <div className="p-3 bg-emerald-50 rounded-xl">
                                            <p className="text-sm font-semibold text-slate-900">{selHeb.nom}</p>
                                            <p className="text-xs text-slate-500">{selHeb.ville}, {selHeb.pays}</p>
                                        </div>
                                    ) : <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non sélectionné</p>}
                                </div>

                                {/* Estimation */}
                                {nbNuits > 0 && selHeb && (
                                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                                        <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2">Estimation</p>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-teal-700">{nbNuits} nuit(s)</span>
                                            <span className="text-xs text-teal-700">× {selHeb.prix_nuit_min.toLocaleString()} {selHeb.devise}</span>
                                        </div>
                                        <div className="border-t border-teal-200 pt-2 mt-2 flex justify-between items-center">
                                            <span className="text-xs font-bold text-teal-800">Total min.</span>
                                            <span className="text-base font-black text-teal-800">{montantMin.toLocaleString()} {data.devise}</span>
                                        </div>
                                        {montantMax > montantMin && (
                                            <p className="text-xs text-teal-600 text-right">max. {montantMax.toLocaleString()} {data.devise}</p>
                                        )}
                                    </div>
                                )}

                                <div className="border-t border-slate-100 pt-3 text-xs text-slate-400 leading-relaxed">
                                    La réservation sera créée avec le statut <strong className="text-amber-600">En attente</strong>. Le montant final sera calculé après confirmation.
                                </div>
                            </div>

                            <div className="px-5 pb-5 space-y-2">
                                <button type="submit"
                                    disabled={processing || !data.voyageur_id || !data.hebergement_id || !data.date_arrivee || !data.date_depart}
                                    className="w-full py-3 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                                    Créer la réservation
                                </button>
                                <Link href="/reservations" className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-xl transition-colors flex items-center justify-center">
                                    Annuler
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}