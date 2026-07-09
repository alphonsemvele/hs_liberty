import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../layout';

interface VoyageurOption    { id: number; nom: string; }
interface ReservationOption { id: number; ref: string; hebergement: string; ville: string; date_arrivee: string; date_depart: string; }

export default function ProgrammeCreate({
    voyageurs     = [],
    reservations  = [],
}: {
    voyageurs?:    VoyageurOption[];
    reservations?: ReservationOption[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        voyageur_id:    '',
        reservation_id: '',
        titre:          '',
    });

    const submit: FormEventHandler = (e) => { e.preventDefault(); post('/programme'); };

    const selVoy  = voyageurs.find(v => String(v.id) === data.voyageur_id);
    const selResa = reservations.find(r => String(r.id) === data.reservation_id);
    const canSubmit = data.voyageur_id && data.reservation_id && data.titre;

    const inp = (err?: string) =>
        `w-full px-4 py-3 text-sm border-2 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:bg-white transition-all ${err ? 'border-red-300' : 'border-slate-200 focus:border-emerald-400'}`;

    const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            {children}
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );

    return (
        <DashboardLayout title="Nouveau programme" subtitle="Créer un plan de séjour pour un voyageur">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/programme" className="text-slate-400 hover:text-emerald-600 transition-colors">Programmes</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">Nouveau programme</span>
            </div>

            <form onSubmit={submit}>
                <div className="max-w-4xl grid xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-6">

                        {/* 1 — Voyageur */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                </div>
                                <h2 className="text-sm font-bold text-slate-900">Voyageur *</h2>
                            </div>
                            <div className="p-6 space-y-2 max-h-52 overflow-y-auto">
                                {voyageurs.map(v => (
                                    <label key={v.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.voyageur_id === String(v.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                        <input type="radio" name="voyageur" value={String(v.id)} checked={data.voyageur_id === String(v.id)} onChange={e => setData('voyageur_id', e.target.value)} className="sr-only"/>
                                        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">
                                            {v.nom.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900 flex-1">{v.nom}</span>
                                        {data.voyageur_id === String(v.id) && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                        )}
                                    </label>
                                ))}
                                {voyageurs.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">Aucun voyageur en base.</p>}
                                {errors.voyageur_id && <p className="text-xs text-red-500 mt-2">{errors.voyageur_id}</p>}
                            </div>
                        </div>

                        {/* 2 — Réservation */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Réservation associée *</h2>
                                    <p className="text-xs text-slate-400">Le programme sera rattaché à cette réservation</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-2 max-h-52 overflow-y-auto">
                                {reservations.map(r => (
                                    <label key={r.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.reservation_id === String(r.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                        <input type="radio" name="reservation" value={String(r.id)} checked={data.reservation_id === String(r.id)} onChange={e => setData('reservation_id', e.target.value)} className="sr-only"/>
                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700 flex-shrink-0">
                                            {r.hebergement.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{r.hebergement}</p>
                                            <p className="text-xs text-slate-400">{r.ville} · {r.date_arrivee} → {r.date_depart}</p>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{r.ref}</span>
                                        {data.reservation_id === String(r.id) && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                        )}
                                    </label>
                                ))}
                                {reservations.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">Aucune réservation disponible.</p>}
                                {errors.reservation_id && <p className="text-xs text-red-500 mt-2">{errors.reservation_id}</p>}
                            </div>
                        </div>

                        {/* 3 — Titre */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                </div>
                                <h2 className="text-sm font-bold text-slate-900">Titre du programme *</h2>
                            </div>
                            <div className="p-6">
                                <Field label="Intitulé" error={errors.titre}>
                                    <input
                                        value={data.titre}
                                        onChange={e => setData('titre', e.target.value)}
                                        placeholder="ex: Séjour détente Dakar · Kofi Diarra"
                                        className={inp(errors.titre)}
                                    />
                                </Field>
                                <p className="mt-2 text-xs text-slate-400">
                                    Les étapes et la checklist pourront être ajoutées après création.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Récap sticky */}
                    <div>
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden sticky top-24">
                            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                                <h3 className="text-sm font-bold text-slate-900">Récapitulatif</h3>
                            </div>
                            <div className="p-5 space-y-4">

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Voyageur</p>
                                    {selVoy
                                        ? <div className="flex items-center gap-2.5 p-3 bg-violet-50 rounded-xl">
                                            <div className="w-8 h-8 rounded-lg bg-violet-200 flex items-center justify-center text-xs font-black text-violet-800">
                                                {selVoy.nom.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900">{selVoy.nom}</p>
                                          </div>
                                        : <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non sélectionné</p>
                                    }
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Réservation</p>
                                    {selResa
                                        ? <div className="p-3 bg-emerald-50 rounded-xl">
                                            <p className="text-sm font-semibold text-slate-900">{selResa.hebergement}</p>
                                            <p className="text-xs text-slate-500">{selResa.ville} · {selResa.date_arrivee} → {selResa.date_depart}</p>
                                          </div>
                                        : <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non sélectionnée</p>
                                    }
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Titre</p>
                                    {data.titre
                                        ? <p className="text-sm font-semibold text-slate-900 p-3 bg-sky-50 rounded-xl">{data.titre}</p>
                                        : <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non renseigné</p>
                                    }
                                </div>

                                <div className="border-t border-slate-100 pt-3">
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>Statut initial</span>
                                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Brouillon</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 pb-5 space-y-2">
                                <button type="submit" disabled={processing || !canSubmit}
                                    className="w-full py-3 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                                    Créer le programme
                                </button>
                                <Link href="/programme" className="w-full py-2.5 text-sm text-slate-500 rounded-xl flex items-center justify-center hover:text-slate-700 transition-colors">
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