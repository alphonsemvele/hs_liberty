import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../layout';

const VOYAGEURS = [
    { id:1, initials:'KD', nom:'Kofi Diarra',           type:'Moteur',        niveau:3 },
    { id:2, initials:'AM', nom:'Amina Mbaye',            type:'Sensoriel',     niveau:2 },
    { id:3, initials:'JB', nom:'Jean-Baptiste Essomba',  type:'Polyhandicap',  niveau:5 },
    { id:4, initials:'FT', nom:'Fatou Touré',            type:'Moteur',        niveau:2 },
    { id:5, initials:'ON', nom:'Oumar Ndiaye',           type:'Cognitif',      niveau:3 },
    { id:6, initials:'SE', nom:'Sophie Eteki',           type:'Moteur',        niveau:4 },
    { id:7, initials:'DK', nom:'Danielle Kanga',         type:'Sensoriel',     niveau:1 },
];

const LIENS = [
    'Époux / Épouse',
    'Père / Mère',
    'Fils / Fille',
    'Frère / Sœur',
    'Grand-parent',
    'Ami(e) proche',
    'Tuteur légal',
    'Accompagnant professionnel',
    'Autre',
];

const NIVEAUX = [
    {
        val:   'lecture',
        label: 'Lecture',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
        ),
        desc:  'Consultation uniquement du programme et de l\'historique des interventions.',
        perms: [
            { label: 'Voir le programme de séjour',       ok: true  },
            { label: 'Consulter l\'historique',           ok: true  },
            { label: 'Modifier la checklist',             ok: false },
            { label: 'Contacter les professionnels',      ok: false },
            { label: 'Accès protocole d\'urgence',        ok: false },
        ],
        color: 'border-sky-300 bg-sky-50',
        badge: 'bg-sky-50 text-sky-700 border-sky-200',
        btn:   'bg-sky-500',
    },
    {
        val:   'ecriture',
        label: 'Écriture',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
        ),
        desc:  'Accès complet au programme, modification de la checklist et contact des soignants.',
        perms: [
            { label: 'Voir le programme de séjour',       ok: true  },
            { label: 'Consulter l\'historique',           ok: true  },
            { label: 'Modifier la checklist',             ok: true  },
            { label: 'Contacter les professionnels',      ok: true  },
            { label: 'Accès protocole d\'urgence',        ok: false },
        ],
        color: 'border-emerald-300 bg-emerald-50',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        btn:   'bg-emerald-500',
    },
    {
        val:   'urgence',
        label: 'Urgence uniquement',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
        ),
        desc:  'Accès exclusif au protocole médical d\'urgence. Aucune autre donnée n\'est visible.',
        perms: [
            { label: 'Voir le programme de séjour',       ok: false },
            { label: 'Consulter l\'historique',           ok: false },
            { label: 'Modifier la checklist',             ok: false },
            { label: 'Contacter les professionnels',      ok: false },
            { label: 'Accès protocole d\'urgence',        ok: true  },
        ],
        color: 'border-red-300 bg-red-50',
        badge: 'bg-red-50 text-red-600 border-red-200',
        btn:   'bg-red-500',
    },
];

export default function AidantCreate() {
    const { data, setData, post, processing, errors } = useForm({
        id_voyageur:       '',
        nom:               '',
        prenom:            '',
        email:             '',
        telephone:         '',
        lien_parente:      '',
        niveau_acces:      '' as '' | 'lecture' | 'ecriture' | 'urgence',
        consentement:      false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/aidants');
    };

    const inputCls = (err?: string) =>
        `w-full px-4 py-3 text-sm border-2 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-300
         focus:outline-none focus:bg-white transition-all
         ${err ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-emerald-400 focus:shadow-sm focus:shadow-emerald-100'}`;

    const Field = ({ label, error, children }: {
        label: string; error?: string; children: React.ReactNode;
    }) => (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            {children}
            {error && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );

    const selVoyageur = VOYAGEURS.find(v => String(v.id) === data.id_voyageur);
    const selNiveau   = NIVEAUX.find(n => n.val === data.niveau_acces);
    const canSubmit   = data.id_voyageur && data.nom && data.email && data.telephone && data.niveau_acces && data.consentement;

    return (
        <DashboardLayout title="Ajouter un aidant" subtitle="Lier un proche ou un accompagnant à un voyageur">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/aidants" className="text-slate-400 hover:text-emerald-600 transition-colors">Aidants</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                <span className="text-slate-600 font-medium">Nouvel aidant</span>
            </div>

            <form onSubmit={submit}>
                <div className="max-w-5xl grid xl:grid-cols-3 gap-6">

                    {/* ── COLONNE PRINCIPALE ── */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* 1 — Voyageur concerné */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Voyageur concerné *</h2>
                                    <p className="text-xs text-slate-400">L'aidant aura accès aux informations de ce voyageur</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                    {VOYAGEURS.map(v => (
                                        <label key={v.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                                                ${data.id_voyageur === String(v.id)
                                                    ? 'border-emerald-400 bg-emerald-50'
                                                    : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                            <input type="radio" name="voyageur" value={String(v.id)}
                                                checked={data.id_voyageur === String(v.id)}
                                                onChange={e => setData('id_voyageur', e.target.value)}
                                                className="sr-only"/>
                                            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">
                                                {v.initials}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-slate-900">{v.nom}</p>
                                                <p className="text-xs text-slate-400 capitalize">{v.type} · Dépendance {v.niveau}/5</p>
                                            </div>
                                            {data.id_voyageur === String(v.id) && (
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                                {errors.id_voyageur && <p className="mt-2 text-xs text-red-500">{errors.id_voyageur}</p>}
                            </div>
                        </div>

                        {/* 2 — Infos aidant */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                </div>
                                <h2 className="text-sm font-bold text-slate-900">Informations de l'aidant</h2>
                            </div>
                            <div className="p-6 grid md:grid-cols-2 gap-5">
                                <Field label="Prénom *" error={errors.prenom}>
                                    <input value={data.prenom} onChange={e => setData('prenom', e.target.value)}
                                        placeholder="ex: Adja" className={inputCls(errors.prenom)}/>
                                </Field>
                                <Field label="Nom *" error={errors.nom}>
                                    <input value={data.nom} onChange={e => setData('nom', e.target.value)}
                                        placeholder="ex: Diarra" className={inputCls(errors.nom)}/>
                                </Field>
                                <Field label="Email *" error={errors.email}>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                        placeholder="prenom.nom@email.com" className={inputCls(errors.email)}/>
                                </Field>
                                <Field label="Téléphone *" error={errors.telephone}>
                                    <input value={data.telephone} onChange={e => setData('telephone', e.target.value)}
                                        placeholder="+221 77 987 65 43" className={inputCls(errors.telephone)}/>
                                </Field>
                                <div className="md:col-span-2">
                                    <Field label="Lien de parenté *" error={errors.lien_parente}>
                                        <select value={data.lien_parente} onChange={e => setData('lien_parente', e.target.value)}
                                            className={inputCls(errors.lien_parente)}>
                                            <option value="">Sélectionner…</option>
                                            {LIENS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* 3 — Niveau d'accès */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Niveau d'accès *</h2>
                                    <p className="text-xs text-slate-400">Définit ce que l'aidant peut voir et faire</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-3">
                                {NIVEAUX.map(n => (
                                    <label key={n.val}
                                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                                            ${data.niveau_acces === n.val ? n.color : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                        <input type="radio" name="niveau_acces" value={n.val}
                                            checked={data.niveau_acces === n.val}
                                            onChange={e => setData('niveau_acces', e.target.value as 'lecture'|'ecriture'|'urgence')}
                                            className="sr-only"/>

                                        {/* Icône + label */}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${data.niveau_acces === n.val ? n.btn + ' text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            {n.icon}
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">{n.label}</p>
                                            <p className="text-xs text-slate-500 mt-0.5 mb-3">{n.desc}</p>

                                            {/* Permissions */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                                {n.perms.map((p, i) => (
                                                    <div key={i} className="flex items-center gap-1.5">
                                                        {p.ok ? (
                                                            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                                                                </svg>
                                                            </div>
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-2.5 h-2.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <span className={`text-xs ${p.ok ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{p.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {data.niveau_acces === n.val && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                                </svg>
                                            </div>
                                        )}
                                    </label>
                                ))}
                                {errors.niveau_acces && <p className="text-xs text-red-500">{errors.niveau_acces}</p>}
                            </div>
                        </div>

                        {/* 4 — Consentement */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                    </svg>
                                </div>
                                <h2 className="text-sm font-bold text-slate-900">Consentement RGPD</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                                    En ajoutant cet aidant, le voyageur concerné recevra une notification et devra confirmer
                                    son accord. L'accès sera activé uniquement après validation par le voyageur. L'aidant peut
                                    être révoqué à tout moment depuis le profil du voyageur.
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                                            ${data.consentement ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 group-hover:border-emerald-400'}`}
                                        onClick={() => setData('consentement', !data.consentement)}
                                    >
                                        {data.consentement && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                            </svg>
                                        )}
                                    </div>
                                    <input type="checkbox" checked={data.consentement}
                                        onChange={e => setData('consentement', e.target.checked)}
                                        className="sr-only"/>
                                    <span className="text-sm text-slate-700 leading-relaxed">
                                        Je confirme que l'aidant a été informé et a consenti au traitement de ses données
                                        personnelles dans le cadre de la plateforme hs liberty. <span className="text-red-500">*</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* ── RÉCAPITULATIF ── */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden sticky top-24">
                            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="text-sm font-bold text-slate-900">Récapitulatif</h3>
                            </div>
                            <div className="p-5 space-y-4">

                                {/* Voyageur */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Voyageur</p>
                                    {selVoyageur ? (
                                        <div className="flex items-center gap-2.5 p-3 bg-violet-50 rounded-xl">
                                            <div className="w-8 h-8 rounded-lg bg-violet-200 flex items-center justify-center text-xs font-black text-violet-800">
                                                {selVoyageur.initials}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{selVoyageur.nom}</p>
                                                <p className="text-xs text-slate-500 capitalize">{selVoyageur.type}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non sélectionné</p>
                                    )}
                                </div>

                                {/* Aidant */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Aidant</p>
                                    {(data.prenom || data.nom) ? (
                                        <div className="p-3 bg-sky-50 rounded-xl">
                                            <p className="text-sm font-semibold text-slate-900">{data.prenom} {data.nom}</p>
                                            {data.lien_parente && <p className="text-xs text-slate-500 mt-0.5">{data.lien_parente}</p>}
                                            {data.email && <p className="text-xs text-slate-400">{data.email}</p>}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non renseigné</p>
                                    )}
                                </div>

                                {/* Niveau */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Niveau d'accès</p>
                                    {selNiveau ? (
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${selNiveau.badge}`}>
                                            {selNiveau.label}
                                        </span>
                                    ) : (
                                        <p className="text-sm text-slate-300 italic p-3 bg-slate-50 rounded-xl">Non sélectionné</p>
                                    )}
                                </div>

                                <div className="border-t border-slate-100 pt-3">
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Une invitation sera envoyée à l'aidant par email. L'accès sera activé après confirmation du voyageur.
                                    </p>
                                </div>
                            </div>

                            {/* Boutons */}
                            <div className="px-5 pb-5 space-y-2">
                                <button type="submit" disabled={processing || !canSubmit}
                                    className="w-full py-3 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {processing && (
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                        </svg>
                                    )}
                                    Envoyer l'invitation
                                </button>
                                <Link href="/aidants"
                                    className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-xl transition-colors flex items-center justify-center">
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