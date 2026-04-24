import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../layout';

const TYPES_HANDICAP = [
    { val: 'moteur',       label: 'Moteur',       icon: '♿', color: 'bg-blue-50 text-blue-700 border-blue-200',     desc: 'Mobilité réduite, fauteuil roulant, prothèse' },
    { val: 'sensoriel',    label: 'Sensoriel',    icon: '👁️', color: 'bg-purple-50 text-purple-700 border-purple-200', desc: 'Déficience visuelle ou auditive' },
    { val: 'cognitif',     label: 'Cognitif',     icon: '🧠', color: 'bg-orange-50 text-orange-700 border-orange-200', desc: "Troubles cognitifs, mémoire, orientation" },
    { val: 'polyhandicap', label: 'Polyhandicap', icon: '🤲', color: 'bg-red-50 text-red-700 border-red-200',         desc: 'Combinaison de plusieurs handicaps' },
    { val: 'psychiatrique',label: 'Psychiatrique',icon: '💬', color: 'bg-pink-50 text-pink-700 border-pink-200',      desc: 'Troubles psychiques stabilisés' },
    { val: 'autre',        label: 'Autre',        icon: '➕', color: 'bg-slate-100 text-slate-600 border-slate-200',   desc: 'Autre type de handicap' },
];

const PAYS = [
    ['SN','Sénégal'], ['MA','Maroc'], ['CI',"Côte d'Ivoire"], ['CM','Cameroun'],
    ['TG','Togo'], ['KE','Kenya'], ['GH','Ghana'], ['GA','Gabon'],
    ['DZ','Algérie'], ['TN','Tunisie'], ['ML','Mali'], ['BJ','Bénin'],
    ['FR','France'], ['BE','Belgique'], ['ES','Espagne'], ['DE','Allemagne'],
];

const EQUIPEMENTS = [
    'Fauteuil roulant manuel',
    'Fauteuil roulant électrique',
    'Déambulateur / rollator',
    'Lève-personne',
    'Lit médicalisé',
    'Concentrateur O₂',
    'Pompe à perfusion',
    'Autre appareillage',
];

export default function VoyageurCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nom:                '',
        prenom:             '',
        email:              '',
        telephone:          '',
        date_naissance:     '',
        nationalite:        '',
        pays_residence:     '',
        type_handicap:      '',
        niveau_dependance:  3,
        equipements:        [] as string[],
        contact_urgence_nom:'',
        contact_urgence_tel:'',
        contact_urgence_lien:'',
        consentement_rgpd:  false,
    });

    const [step, setStep] = useState<1 | 2 | 3>(1);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/voyageurs');
    };

    const toggleEq = (eq: string) => {
        const curr = data.equipements;
        setData('equipements', curr.includes(eq) ? curr.filter(v => v !== eq) : [...curr, eq]);
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
        const bg: Record<string, string> = {
            emerald: 'bg-emerald-50', violet: 'bg-violet-50',
            sky: 'bg-sky-50', amber: 'bg-amber-50', red: 'bg-red-50',
        };
        return (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${bg[accent] ?? bg.emerald} flex items-center justify-center`}>
                        {icon}
                    </div>
                    <h2 className="text-sm font-bold text-slate-900">{title}</h2>
                </div>
                <div className="p-6">{children}</div>
            </div>
        );
    };

    const STEPS = [
        { n: 1, label: 'Identité'      },
        { n: 2, label: 'Handicap'      },
        { n: 3, label: 'Urgence & RGPD'},
    ];

    const selType = TYPES_HANDICAP.find(t => t.val === data.type_handicap);

    const canNext1 = data.prenom && data.nom && data.email && data.telephone && data.pays_residence;
    const canNext2 = !!data.type_handicap;
    const canSubmit = canNext1 && canNext2 && data.consentement_rgpd;

    return (
        <DashboardLayout title="Nouveau voyageur" subtitle="Créer un profil voyageur">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/voyageurs" className="text-slate-400 hover:text-emerald-600 transition-colors">Voyageurs</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                <span className="text-slate-600 font-medium">Nouveau voyageur</span>
            </div>

            {/* Stepper */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
                <div className="flex items-center gap-0">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.n}>
                            <button type="button" onClick={() => setStep(s.n as 1|2|3)} className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                    ${step === s.n
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                        : step > s.n
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-100 text-slate-400'}`}>
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
                                            placeholder="ex: Kofi" className={inputCls(errors.prenom)}/>
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
                                            placeholder="+221 77 123 45 67" className={inputCls(errors.telephone)}/>
                                    </Field>
                                    <Field label="Date de naissance">
                                        <input type="date" value={data.date_naissance} onChange={e => setData('date_naissance', e.target.value)}
                                            className={inputCls()}/>
                                    </Field>
                                    <Field label="Nationalité">
                                        <select value={data.nationalite} onChange={e => setData('nationalite', e.target.value)} className={inputCls()}>
                                            <option value="">Sélectionner…</option>
                                            {PAYS.map(([code, nom]) => <option key={code} value={code}>{nom}</option>)}
                                        </select>
                                    </Field>
                                    <div className="md:col-span-2">
                                        <Field label="Pays de résidence *" error={errors.pays_residence}>
                                            <select value={data.pays_residence} onChange={e => setData('pays_residence', e.target.value)} className={inputCls(errors.pays_residence)}>
                                                <option value="">Sélectionner…</option>
                                                {PAYS.map(([code, nom]) => <option key={code} value={code}>{nom}</option>)}
                                            </select>
                                        </Field>
                                    </div>
                                </div>
                            </SectionCard>
                        </>
                    )}

                    {/* ════════════════════════
                        ÉTAPE 2 — HANDICAP
                    ════════════════════════ */}
                    {step === 2 && (
                        <>
                            <SectionCard
                                title="Type de handicap *"
                                icon={<svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
                                accent="violet"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {TYPES_HANDICAP.map(t => (
                                        <label key={t.val}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all text-center
                                                ${data.type_handicap === t.val
                                                    ? 'border-emerald-400 bg-emerald-50'
                                                    : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                            <input type="radio" name="type_handicap" value={t.val}
                                                checked={data.type_handicap === t.val}
                                                onChange={e => setData('type_handicap', e.target.value)}
                                                className="sr-only"/>
                                            <span className="text-2xl">{t.icon}</span>
                                            <span className="text-xs font-bold text-slate-800">{t.label}</span>
                                            <span className="text-[10px] text-slate-400 leading-tight">{t.desc}</span>
                                            {data.type_handicap === t.val && (
                                                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center mt-1">
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </SectionCard>

                            <SectionCard
                                title="Niveau de dépendance"
                                icon={<svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>}
                                accent="violet"
                            >
                                <p className="text-xs text-slate-400 mb-4">Évaluez le niveau d'aide humaine nécessaire au quotidien (GIR).</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-2 flex-1">
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <button key={n} type="button" onClick={() => setData('niveau_dependance', n)}
                                                className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all
                                                    ${data.niveau_dependance === n
                                                        ? 'border-violet-400 bg-violet-50 text-violet-700'
                                                        : 'border-slate-200 text-slate-400 hover:border-violet-200'}`}>
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs text-slate-400">Autonome</span>
                                    <span className="text-xs text-slate-400">Dépendance totale</span>
                                </div>
                                <div className="mt-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
                                    <p className="text-xs text-violet-700 font-semibold">
                                        Niveau {data.niveau_dependance}/5 — {[
                                            'Totalement autonome',
                                            'Aide partielle occasionnelle',
                                            'Aide régulière nécessaire',
                                            'Aide importante au quotidien',
                                            'Dépendance totale — aide continue',
                                        ][data.niveau_dependance - 1]}
                                    </p>
                                </div>
                            </SectionCard>

                            <SectionCard
                                title="Équipements médicaux utilisés"
                                icon={<svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>}
                                accent="sky"
                            >
                                <div className="grid grid-cols-2 gap-2.5">
                                    {EQUIPEMENTS.map(eq => {
                                        const checked = data.equipements.includes(eq);
                                        return (
                                            <label key={eq} onClick={() => toggleEq(eq)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                                                    ${checked ? 'border-sky-300 bg-sky-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                                                    ${checked ? 'bg-sky-600 border-sky-600' : 'border-slate-300'}`}>
                                                    {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                                </div>
                                                <span className={`text-xs font-medium leading-tight ${checked ? 'text-sky-800' : 'text-slate-600'}`}>{eq}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </SectionCard>
                        </>
                    )}

                    {/* ════════════════════════
                        ÉTAPE 3 — URGENCE & RGPD
                    ════════════════════════ */}
                    {step === 3 && (
                        <>
                            {/* Récap */}
                            {(data.prenom || data.nom) && (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-sm font-black text-emerald-700 flex-shrink-0">
                                        {`${data.prenom.charAt(0)}${data.nom.charAt(0)}`.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">{data.prenom} {data.nom}</p>
                                        {selType && (
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 border ${selType.color}`}>
                                                {selType.icon} {selType.label} · Niveau {data.niveau_dependance}/5
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <SectionCard
                                title="Contact d'urgence"
                                icon={<svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>}
                                accent="red"
                            >
                                <p className="text-xs text-slate-400 mb-4">
                                    Cette personne sera contactée en priorité en cas d'urgence médicale pendant le séjour.
                                </p>
                                <div className="grid md:grid-cols-3 gap-5">
                                    <Field label="Nom complet *" error={errors.contact_urgence_nom}>
                                        <input value={data.contact_urgence_nom} onChange={e => setData('contact_urgence_nom', e.target.value)}
                                            placeholder="ex: Adja Diarra" className={inputCls(errors.contact_urgence_nom)}/>
                                    </Field>
                                    <Field label="Téléphone *" error={errors.contact_urgence_tel}>
                                        <input value={data.contact_urgence_tel} onChange={e => setData('contact_urgence_tel', e.target.value)}
                                            placeholder="+221 77 987 65 43" className={inputCls(errors.contact_urgence_tel)}/>
                                    </Field>
                                    <Field label="Lien de parenté">
                                        <select value={data.contact_urgence_lien} onChange={e => setData('contact_urgence_lien', e.target.value)} className={inputCls()}>
                                            <option value="">Sélectionner…</option>
                                            {['Époux/Épouse','Parent','Enfant','Frère/Sœur','Ami(e) proche','Tuteur légal','Autre'].map(l => (
                                                <option key={l} value={l}>{l}</option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>
                            </SectionCard>

                            <SectionCard
                                title="Consentement RGPD"
                                icon={<svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                            >
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                                        Les données personnelles et médicales collectées sont traitées conformément au RGPD.
                                        Elles sont chiffrées AES-256, hébergées dans une base isolée et accessibles uniquement
                                        aux professionnels de santé autorisés par le voyageur. Le droit à l'effacement peut
                                        être exercé à tout moment depuis les paramètres du compte.
                                    </div>

                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div
                                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                                                ${data.consentement_rgpd ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 group-hover:border-emerald-400'}`}
                                            onClick={() => setData('consentement_rgpd', !data.consentement_rgpd)}
                                        >
                                            {data.consentement_rgpd && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                                </svg>
                                            )}
                                        </div>
                                        <input type="checkbox" checked={data.consentement_rgpd}
                                            onChange={e => setData('consentement_rgpd', e.target.checked)}
                                            className="sr-only"/>
                                        <span className="text-sm text-slate-700 leading-relaxed">
                                            J'accepte que mes données personnelles et médicales soient traitées par hs liberty
                                            dans le cadre de la plateforme de voyage accessible, conformément à la politique
                                            de confidentialité. <span className="text-red-500">*</span>
                                        </span>
                                    </label>

                                    {!data.consentement_rgpd && (
                                        <p className="text-xs text-amber-600 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                            </svg>
                                            Le consentement est obligatoire pour créer un profil voyageur.
                                        </p>
                                    )}
                                </div>
                            </SectionCard>
                        </>
                    )}

                    {/* ── Navigation ── */}
                    <div className="flex items-center justify-between pt-2">
                        {step > 1 ? (
                            <button type="button" onClick={() => setStep((step - 1) as 1|2|3)}
                                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                                Étape précédente
                            </button>
                        ) : (
                            <Link href="/voyageurs" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                                Annuler
                            </Link>
                        )}

                        {step < 3 ? (
                            <button type="button"
                                onClick={() => setStep((step + 1) as 1|2|3)}
                                disabled={step === 1 ? !canNext1 : !canNext2}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                Étape suivante
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </button>
                        ) : (
                            <button type="submit" disabled={processing || !canSubmit}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                                Créer le profil voyageur
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}