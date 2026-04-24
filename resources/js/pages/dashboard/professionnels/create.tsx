import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../layout';

const SPECIALITES = [
    { val: 'infirmiere',       label: 'Infirmier(ère)',          icon: '🩺', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    { val: 'kinesitherapeute', label: 'Kinésithérapeute',        icon: '💪', color: 'bg-violet-50 text-violet-700 border-violet-200' },
    { val: 'auxiliaire',       label: 'Auxiliaire de vie',       icon: '🤝', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { val: 'aide_soignant',    label: 'Aide-soignant(e)',        icon: '❤️', color: 'bg-pink-50 text-pink-700 border-pink-200' },
    { val: 'medecin',          label: 'Médecin généraliste',     icon: '👨‍⚕️', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { val: 'ergotherapeute',   label: 'Ergothérapeute',          icon: '♿', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { val: 'orthophoniste',    label: 'Orthophoniste',           icon: '🗣️', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { val: 'autre',            label: 'Autre spécialité',        icon: '➕', color: 'bg-slate-100 text-slate-600 border-slate-200' },
];

const PAYS_DISPO = [
    ['SN','Sénégal'], ['MA','Maroc'], ['CI',"Côte d'Ivoire"], ['CM','Cameroun'],
    ['TG','Togo'], ['KE','Kenya'], ['GH','Ghana'], ['GA','Gabon'],
    ['DZ','Algérie'], ['TN','Tunisie'], ['ML','Mali'], ['BJ','Bénin'],
    ['FR','France'], ['BE','Belgique'], ['ES','Espagne'], ['DE','Allemagne'],
];

const LANGUES = ['Français','Anglais','Arabe','Espagnol','Portugais','Wolof','Dioula','Haoussa'];

const TYPES_HANDICAP = ['Moteur','Sensoriel','Cognitif','Polyhandicap','Psychiatrique'];

export default function ProfessionnelCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nom:              '',
        prenom:           '',
        email:            '',
        telephone:        '',
        specialite:       '',
        specialite_autre: '',
        numero_rpps:      '',
        pays:             [] as string[],
        langues:          [] as string[],
        handicaps:        [] as string[],
        tarif_horaire:    '',
        devise:           'XOF',
        disponible:       true,
        bio:              '',
        // Documents uploadés (noms des fichiers)
        diplome_fichier:  '',
        rc_pro_fichier:   '',
    });

    const [step, setStep] = useState<1 | 2 | 3>(1);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/professionnels');
    };

    const toggle = (key: 'pays' | 'langues' | 'handicaps', val: string) => {
        const curr = data[key] as string[];
        setData(key, curr.includes(val) ? curr.filter(v => v !== val) : [...curr, val]);
    };

    const inputCls = (err?: string) =>
        `w-full px-4 py-3 text-sm border-2 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-300
         focus:outline-none focus:bg-white transition-all
         ${err ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-emerald-400 focus:shadow-sm focus:shadow-emerald-100'}`;

    const Field = ({ label, error, hint, children }: {
        label: string; error?: string; hint?: string; children: React.ReactNode;
    }) => (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
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

    const SectionCard = ({ title, icon, children, accent = 'emerald' }: {
        title: string; icon: React.ReactNode; children: React.ReactNode; accent?: string;
    }) => {
        const accentMap: Record<string, string> = {
            emerald: 'bg-emerald-50', sky: 'bg-sky-50', violet: 'bg-violet-50',
            amber: 'bg-amber-50', teal: 'bg-teal-50',
        };
        return (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${accentMap[accent] ?? accentMap.emerald} flex items-center justify-center`}>
                        {icon}
                    </div>
                    <h2 className="text-sm font-bold text-slate-900">{title}</h2>
                </div>
                <div className="p-6">{children}</div>
            </div>
        );
    };

    // ── Stepper ──────────────────────────────────────────────────
    const STEPS = [
        { n: 1, label: 'Identité'       },
        { n: 2, label: 'Spécialité'     },
        { n: 3, label: 'Documents'      },
    ];

    const selSpec = SPECIALITES.find(s => s.val === data.specialite);

    return (
        <DashboardLayout title="Nouveau professionnel" subtitle="Ajouter un professionnel de santé au réseau">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/professionnels" className="text-slate-400 hover:text-emerald-600 transition-colors">Professionnels</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">Nouveau professionnel</span>
            </div>

            {/* Stepper */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
                <div className="flex items-center gap-0">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.n}>
                            <button
                                type="button"
                                onClick={() => setStep(s.n as 1|2|3)}
                                className="flex items-center gap-2.5 group"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                    ${step === s.n
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                        : step > s.n
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {step > s.n
                                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                                        : s.n
                                    }
                                </div>
                                <span className={`text-sm font-semibold hidden sm:block transition-colors
                                    ${step === s.n ? 'text-emerald-700' : step > s.n ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {s.label}
                                </span>
                            </button>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all ${step > s.n ? 'bg-emerald-300' : 'bg-slate-200'}`}/>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <form onSubmit={submit}>
                <div className="max-w-3xl space-y-6">

                    {/* ════════════════════════
                        ÉTAPE 1 — IDENTITÉ
                    ════════════════════════ */}
                    {step === 1 && (
                        <>
                            <SectionCard
                                title="Informations personnelles"
                                icon={<svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}
                            >
                                <div className="grid md:grid-cols-2 gap-5">
                                    <Field label="Prénom *" error={errors.prenom}>
                                        <input value={data.prenom} onChange={e => setData('prenom', e.target.value)}
                                            placeholder="ex: Fatima" className={inputCls(errors.prenom)}/>
                                    </Field>
                                    <Field label="Nom *" error={errors.nom}>
                                        <input value={data.nom} onChange={e => setData('nom', e.target.value)}
                                            placeholder="ex: Sow" className={inputCls(errors.nom)}/>
                                    </Field>
                                    <Field label="Email professionnel *" error={errors.email}>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                            placeholder="prenom.nom@email.com" className={inputCls(errors.email)}/>
                                    </Field>
                                    <Field label="Téléphone *" error={errors.telephone}>
                                        <input value={data.telephone} onChange={e => setData('telephone', e.target.value)}
                                            placeholder="+221 77 123 45 67" className={inputCls(errors.telephone)}/>
                                    </Field>
                                    <div className="md:col-span-2">
                                        <Field label="Présentation / Bio" hint="Décrivez votre expérience auprès des personnes en situation de handicap.">
                                            <textarea value={data.bio} onChange={e => setData('bio', e.target.value)}
                                                rows={4} placeholder="Ex : Infirmière diplômée avec 8 ans d'expérience en soins à domicile auprès de patients PMR…"
                                                className={inputCls()}/>
                                        </Field>
                                    </div>
                                </div>
                            </SectionCard>

                            <SectionCard
                                title="Pays d'intervention *"
                                icon={<svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                                accent="sky"
                            >
                                <p className="text-xs text-slate-400 mb-3">Sélectionnez tous les pays où vous êtes disponible pour intervenir.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {PAYS_DISPO.map(([code, nom]) => {
                                        const checked = data.pays.includes(code);
                                        return (
                                            <label key={code} onClick={() => toggle('pays', code)}
                                                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all
                                                    ${checked ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                                                    ${checked ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                                                    {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-mono font-bold text-slate-500">{code}</span>
                                                    <p className="text-xs font-medium text-slate-700 leading-tight">{nom}</p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                                {data.pays.length > 0 && (
                                    <p className="text-xs text-emerald-600 font-semibold mt-3">
                                        {data.pays.length} pays sélectionné(s) : {data.pays.join(', ')}
                                    </p>
                                )}
                            </SectionCard>

                            <SectionCard
                                title="Langues parlées"
                                icon={<svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>}
                                accent="teal"
                            >
                                <div className="flex flex-wrap gap-2">
                                    {LANGUES.map(l => {
                                        const checked = data.langues.includes(l);
                                        return (
                                            <label key={l} onClick={() => toggle('langues', l)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all
                                                    ${checked ? 'border-teal-300 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                                                    ${checked ? 'bg-teal-600 border-teal-600' : 'border-slate-300'}`}>
                                                    {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                                </div>
                                                <span className="text-sm font-medium">{l}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </SectionCard>
                        </>
                    )}

                    {/* ════════════════════════
                        ÉTAPE 2 — SPÉCIALITÉ
                    ════════════════════════ */}
                    {step === 2 && (
                        <>
                            <SectionCard
                                title="Spécialité médicale *"
                                icon={<svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>}
                                accent="violet"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                    {SPECIALITES.map(sp => (
                                        <label key={sp.val}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all text-center
                                                ${data.specialite === sp.val
                                                    ? 'border-emerald-400 bg-emerald-50'
                                                    : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                            <input type="radio" name="specialite" value={sp.val}
                                                checked={data.specialite === sp.val}
                                                onChange={e => setData('specialite', e.target.value)}
                                                className="sr-only"/>
                                            <span className="text-2xl">{sp.icon}</span>
                                            <span className="text-xs font-semibold text-slate-700 leading-tight">{sp.label}</span>
                                            {data.specialite === sp.val && (
                                                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                                {data.specialite === 'autre' && (
                                    <Field label="Préciser la spécialité">
                                        <input value={data.specialite_autre} onChange={e => setData('specialite_autre', e.target.value)}
                                            placeholder="ex: Psychomotricien, Pédicure-podologue…"
                                            className={inputCls()}/>
                                    </Field>
                                )}
                            </SectionCard>

                            <SectionCard
                                title="Tarif horaire"
                                icon={<svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                                accent="amber"
                            >
                                <div className="grid md:grid-cols-2 gap-5">
                                    <Field label="Tarif / heure *" error={errors.tarif_horaire}>
                                        <div className="relative">
                                            <input value={data.tarif_horaire} onChange={e => setData('tarif_horaire', e.target.value)}
                                                placeholder="ex: 15000" type="number" min="0"
                                                className={inputCls(errors.tarif_horaire) + ' pr-16'}/>
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                                {data.devise}/h
                                            </span>
                                        </div>
                                    </Field>
                                    <Field label="Devise *">
                                        <select value={data.devise} onChange={e => setData('devise', e.target.value)} className={inputCls()}>
                                            {[['XOF','Franc CFA (XOF)'],['EUR','Euro (EUR)'],['USD','Dollar USD'],['MAD','Dirham (MAD)'],['KES','Shilling (KES)'],['GHS','Cedi (GHS)']].map(([c,l]) => (
                                                <option key={c} value={c}>{l}</option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>
                            </SectionCard>

                            <SectionCard
                                title="Types de handicap pris en charge"
                                icon={<svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
                                accent="teal"
                            >
                                <div className="flex flex-wrap gap-2">
                                    {TYPES_HANDICAP.map(t => {
                                        const checked = data.handicaps.includes(t);
                                        return (
                                            <label key={t} onClick={() => toggle('handicaps', t)}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all
                                                    ${checked ? 'border-teal-300 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                                                    ${checked ? 'bg-teal-600 border-teal-600' : 'border-slate-300'}`}>
                                                    {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                                </div>
                                                <span className="text-sm font-semibold">{t}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </SectionCard>

                            <SectionCard
                                title="Numéro professionnel"
                                icon={<svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"/></svg>}
                            >
                                <Field label="N° RPPS / Ordre professionnel" hint="Numéro d'identification national ou équivalent selon votre pays.">
                                    <input value={data.numero_rpps} onChange={e => setData('numero_rpps', e.target.value)}
                                        placeholder="ex: 10012345678" className={inputCls()}/>
                                </Field>
                            </SectionCard>
                        </>
                    )}

                    {/* ════════════════════════
                        ÉTAPE 3 — DOCUMENTS
                    ════════════════════════ */}
                    {step === 3 && (
                        <>
                            {/* Récap avant envoi */}
                            {(data.prenom || data.nom) && (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-sm font-black text-emerald-700">
                                        {`${data.prenom.charAt(0)}${data.nom.charAt(0)}`.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">{data.prenom} {data.nom}</p>
                                        {selSpec && (
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${selSpec.color}`}>
                                                {selSpec.icon} {selSpec.label}
                                            </span>
                                        )}
                                        {data.pays.length > 0 && (
                                            <p className="text-xs text-emerald-600 mt-1">{data.pays.join(' · ')}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <SectionCard
                                title="Diplôme professionnel *"
                                icon={<svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>}
                            >
                                <p className="text-xs text-slate-400 mb-4">
                                    Téléchargez votre diplôme ou attestation professionnelle. Formats acceptés : PDF, JPG, PNG. Taille max : 5 Mo.
                                    L'équipe hs liberty vérifiera le document sous 48h.
                                </p>
                                <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                                        <svg className="w-6 h-6 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700">Cliquer pour uploader le diplôme</p>
                                        <p className="text-xs text-slate-400 mt-1">PDF, JPG ou PNG · Max 5 Mo</p>
                                    </div>
                                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                                        onChange={e => setData('diplome_fichier', e.target.files?.[0]?.name ?? '')}/>
                                </label>
                                {data.diplome_fichier && (
                                    <div className="mt-3 flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        <span className="text-xs font-semibold text-emerald-700">{data.diplome_fichier}</span>
                                    </div>
                                )}
                            </SectionCard>

                            <SectionCard
                                title="Assurance RC Pro *"
                                icon={<svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                                accent="sky"
                            >
                                <p className="text-xs text-slate-400 mb-4">
                                    L'attestation d'assurance Responsabilité Civile Professionnelle en cours de validité est obligatoire pour intervenir sur la plateforme.
                                </p>
                                <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-sky-400 hover:bg-sky-50 transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center transition-colors">
                                        <svg className="w-6 h-6 text-slate-400 group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-slate-700 group-hover:text-sky-700">Cliquer pour uploader l'attestation RC Pro</p>
                                        <p className="text-xs text-slate-400 mt-1">PDF, JPG ou PNG · Max 5 Mo</p>
                                    </div>
                                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                                        onChange={e => setData('rc_pro_fichier', e.target.files?.[0]?.name ?? '')}/>
                                </label>
                                {data.rc_pro_fichier && (
                                    <div className="mt-3 flex items-center gap-2 p-3 bg-sky-50 rounded-xl border border-sky-100">
                                        <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        <span className="text-xs font-semibold text-sky-700">{data.rc_pro_fichier}</span>
                                    </div>
                                )}
                            </SectionCard>

                            {/* Notice validation */}
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3">
                                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <div>
                                    <p className="text-sm font-bold text-amber-800 mb-1">Validation sous 48h ouvrées</p>
                                    <p className="text-xs text-amber-600 leading-relaxed">
                                        L'équipe hs liberty vérifiera vos documents avant activation. Vous recevrez un email de confirmation dès que votre profil sera validé et visible des voyageurs.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Navigation entre étapes ── */}
                    <div className="flex items-center justify-between pt-2">
                        {step > 1 ? (
                            <button type="button" onClick={() => setStep((step - 1) as 1|2|3)}
                                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                                Étape précédente
                            </button>
                        ) : (
                            <Link href="/professionnels" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                                Annuler
                            </Link>
                        )}

                        {step < 3 ? (
                            <button type="button"
                                onClick={() => setStep((step + 1) as 1|2|3)}
                                disabled={
                                    (step === 1 && (!data.prenom || !data.nom || !data.email || !data.telephone || data.pays.length === 0)) ||
                                    (step === 2 && (!data.specialite || !data.tarif_horaire))
                                }
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                Étape suivante
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </button>
                        ) : (
                            <button type="submit" disabled={processing}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                                Soumettre le profil
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}