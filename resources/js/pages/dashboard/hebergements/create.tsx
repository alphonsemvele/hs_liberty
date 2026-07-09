import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../layout';

interface EquipementDispo { id: number; code: string; libelle: string; categorie: string; }

export default function HebergementCreate({ equipements_dispo = [] }: { equipements_dispo?: EquipementDispo[] }) {
    const { data, setData, post, processing, errors } = useForm({
        nom: '', adresse: '', ville: '', pays: 'SN', // ← valeur par défaut non vide
        code_postal: '', latitude: '', longitude: '',
        description: '', type: 'hotel',
        prix_nuit_min: '', prix_nuit_max: '', devise: 'XOF',
        niveau_certif: '',
        equipements: [] as number[],
    });

    const submit: FormEventHandler = (e) => { e.preventDefault(); post('/hebergements'); };

    const toggleEq = (id: number) => {
        const curr = data.equipements;
        setData('equipements', curr.includes(id) ? curr.filter(v => v !== id) : [...curr, id]);
    };

    const inp = (err?: string) =>
        `w-full px-4 py-3 text-sm border-2 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:bg-white transition-all ${err ? 'border-red-300' : 'border-slate-200 focus:border-emerald-400'}`;

    const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            {children}
            {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{error}</p>}
        </div>
    );

    const Section = ({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }) => (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">{icon}</div>
                <div><h2 className="text-sm font-bold text-slate-900">{title}</h2>{subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}</div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );

    const PAYS: [string, string][] = [
        ['SN','Sénégal'],['MA','Maroc'],['CI',"Côte d'Ivoire"],['CM','Cameroun'],
        ['TG','Togo'],['KE','Kenya'],['GH','Ghana'],['GA','Gabon'],
        ['DZ','Algérie'],['TN','Tunisie'],['ML','Mali'],['BJ','Bénin'],
        ['FR','France'],['BE','Belgique'],['ES','Espagne'],['DE','Allemagne'],
    ];

    const TYPES: [string, string][] = [
        ['hotel',"Hôtel"],['residence','Résidence'],['villa','Villa'],
        ['appartement','Appartement'],['chambre_hotes',"Chambre d'hôtes"],
        ['camping_adapte','Camping adapté'],['autre','Autre'],
    ];

    const CERTIFS = [
        { val: 'accessible',      label: 'Accessible',     score: '60–74'  },
        { val: 'accessible_plus', label: 'Accessible Plus', score: '75–89'  },
        { val: 'excellence',      label: 'Excellence',      score: '90–100' },
    ];

    const categoriesEq = equipements_dispo.reduce((acc, eq) => {
        if (!acc[eq.categorie]) acc[eq.categorie] = [];
        acc[eq.categorie].push(eq);
        return acc;
    }, {} as Record<string, EquipementDispo[]>);

    return (
        <DashboardLayout title="Ajouter un hébergement" subtitle="Nouvel établissement sur la plateforme">

            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/hebergements" className="text-slate-400 hover:text-emerald-600 transition-colors">Hébergements</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">Nouvel hébergement</span>
            </div>

            <form onSubmit={submit}>
                <div className="max-w-4xl space-y-6">

                    {/* Informations générales */}
                    <Section
                        icon={<svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h1M9 11h1M9 15h1M14 7h1M14 11h1M14 15h1"/></svg>}
                        title="Informations générales"
                    >
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <Field label="Nom de l'établissement *" error={errors.nom}>
                                    <input value={data.nom} onChange={e => setData('nom', e.target.value)} placeholder="ex: Hôtel Azur Accessible" className={inp(errors.nom)}/>
                                </Field>
                            </div>
                            <Field label="Type d'établissement">
                                <select value={data.type} onChange={e => setData('type', e.target.value)} className={inp()}>
                                    {TYPES.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                                </select>
                            </Field>
                            <Field label="Devise">
                                <select value={data.devise} onChange={e => setData('devise', e.target.value)} className={inp()}>
                                    {[['XOF','Franc CFA (XOF)'],['EUR','Euro (EUR)'],['MAD','Dirham (MAD)'],['KES','Shilling (KES)'],['USD','Dollar (USD)']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                                </select>
                            </Field>
                            <Field label="Prix nuit min">
                                <input type="number" min="0" value={data.prix_nuit_min} onChange={e => setData('prix_nuit_min', e.target.value)} placeholder="ex: 50000" className={inp()}/>
                            </Field>
                            <Field label="Prix nuit max">
                                <input type="number" min="0" value={data.prix_nuit_max} onChange={e => setData('prix_nuit_max', e.target.value)} placeholder="ex: 150000" className={inp()}/>
                            </Field>
                            <div className="md:col-span-2">
                                <Field label="Description">
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Décrivez l'établissement…" rows={4} className={inp()}/>
                                </Field>
                            </div>
                        </div>
                    </Section>

                    {/* Localisation */}
                    <Section
                        icon={<svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
                        title="Localisation"
                        subtitle="Adresse complète et coordonnées GPS"
                    >
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <Field label="Adresse complète *" error={errors.adresse}>
                                    <input value={data.adresse} onChange={e => setData('adresse', e.target.value)} placeholder="Numéro, rue, quartier…" className={inp(errors.adresse)}/>
                                </Field>
                            </div>
                            <Field label="Ville *" error={errors.ville}>
                                <input value={data.ville} onChange={e => setData('ville', e.target.value)} placeholder="ex: Dakar" className={inp(errors.ville)}/>
                            </Field>
                            <Field label="Code postal">
                                <input value={data.code_postal} onChange={e => setData('code_postal', e.target.value)} placeholder="ex: 12500" className={inp()}/>
                            </Field>
                            <Field label="Pays *" error={errors.pays}>
                                <select
                                    value={data.pays}
                                    onChange={e => setData('pays', e.target.value)}
                                    className={inp(errors.pays)}
                                >
                                    {PAYS.map(([code, label]) => (
                                        <option key={code} value={code}>{label}</option>
                                    ))}
                                </select>
                            </Field>
                            <div/>
                            <Field label="Latitude">
                                <input value={data.latitude} onChange={e => setData('latitude', e.target.value)} placeholder="ex: 14.693700" className={inp()}/>
                            </Field>
                            <Field label="Longitude">
                                <input value={data.longitude} onChange={e => setData('longitude', e.target.value)} placeholder="ex: -17.444100" className={inp()}/>
                            </Field>
                        </div>
                    </Section>

                    {/* Certification */}
                    <Section
                        icon={<svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                        title="Certification ISO 21902"
                        subtitle="Laisser vide si l'audit n'a pas encore eu lieu"
                    >
                        <div className="grid md:grid-cols-3 gap-4">
                            {CERTIFS.map(opt => (
                                <label key={opt.val} className={`flex flex-col gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${data.niveau_certif === opt.val ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <input type="radio" name="niveau_certif" value={opt.val} checked={data.niveau_certif === opt.val} onChange={e => setData('niveau_certif', e.target.value)} className="sr-only"/>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-900">{opt.label}</span>
                                        <span className="text-xs text-slate-400 font-mono">{opt.score}</span>
                                    </div>
                                    {data.niveau_certif === opt.val && (
                                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                                            Sélectionné
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                        {data.niveau_certif && (
                            <button type="button" onClick={() => setData('niveau_certif', '')} className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                                ✕ Retirer la certification
                            </button>
                        )}
                    </Section>

                    {/* Équipements */}
                    <Section
                        icon={<svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>}
                        title="Équipements PMR"
                        subtitle={`${data.equipements.length} sélectionné(s)`}
                    >
                        {Object.keys(categoriesEq).length > 0 ? (
                            Object.entries(categoriesEq).map(([cat, eqs]) => (
                                <div key={cat} className="mb-5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 capitalize">{cat}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {eqs.map(eq => (
                                            <label key={eq.id} onClick={() => toggleEq(eq.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${data.equipements.includes(eq.id) ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${data.equipements.includes(eq.id) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                                                    {data.equipements.includes(eq.id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                                </div>
                                                <span className="text-sm text-slate-700 font-medium leading-tight">{eq.libelle}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 italic">Aucun équipement en base.</p>
                        )}
                    </Section>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                        <Link href="/hebergements" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || !data.nom || !data.adresse || !data.ville || !data.pays}
                            className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                            Publier l'hébergement
                        </button>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}