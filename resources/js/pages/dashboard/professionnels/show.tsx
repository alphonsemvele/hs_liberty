import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Professionnel {
    id: number; initials: string; nom: string; email: string; specialite: string;
    pays: string[] | string; tarif: string; note: number; diplome_valide: boolean;
    assurance_rc: boolean; prestations: number; inscription: string;
    telephone?: string; numero_rpps?: string;
}
interface PrestationItem { voyageur: string; type: string; date: string; duree: string; montant: string; statut: string; }
interface Props { professionnel: Professionnel; prestations_recentes: PrestationItem[]; }

const SPEC_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
    'Infirmière':       { bg: 'bg-sky-100',    text: 'text-sky-700',    icon: 'text-sky-600' },
    'Infirmier':        { bg: 'bg-sky-100',    text: 'text-sky-700',    icon: 'text-sky-600' },
    'Kinésithérapeute': { bg: 'bg-violet-100', text: 'text-violet-700', icon: 'text-violet-600' },
    'Auxiliaire de vie':{ bg: 'bg-teal-100',   text: 'text-teal-700',   icon: 'text-teal-600' },
    'Aide-soignant':    { bg: 'bg-pink-100',   text: 'text-pink-700',   icon: 'text-pink-600' },
};

const Stars = ({ n }: { n: number }) => (
    <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
            <svg key={i} className={`w-4 h-4 ${i <= n ? 'text-amber-400 fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
        ))}
    </div>
);

export default function ProfessionnelShow({ professionnel, prestations_recentes = [] }: Partial<Props>) {
    const p = professionnel ?? { id:1, initials:'FS', nom:'Dr. Fatima Sow', email:'f.sow@email.com', specialite:'Infirmière', pays:['SN','MA'], tarif:'15 000 F/h', note:4.9, diplome_valide:true, assurance_rc:true, prestations:18, inscription:'05/01/2026', telephone:'+221 77 123 45 67', numero_rpps:'12345678' };
    const spec = SPEC_COLORS[p.specialite] ?? { bg: 'bg-slate-100', text: 'text-slate-700', icon: 'text-slate-600' };

    return (
        <DashboardLayout title={p.nom} subtitle={p.specialite}>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/professionnels" className="text-slate-400 hover:text-emerald-600 transition-colors">Professionnels</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">{p.nom}</span>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">

                {/* ── GAUCHE ── */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Profile card */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className={`h-28 ${spec.bg.replace('100','700').replace('bg-', 'bg-')} relative`}
                            style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0B6E6E 100%)' }}>
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 40%)' }}/>
                        </div>
                        <div className="px-6 pb-6">
                            <div className="flex items-end gap-4 -mt-8 mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-teal-700 border-4 border-white flex items-center justify-center text-xl font-black text-white shadow-lg">
                                    {p.initials}
                                </div>
                                <div className="mb-1">
                                    <h2 className="text-xl font-black text-slate-900">{p.nom}</h2>
                                    <span className={`inline-flex text-xs font-bold px-2.5 py-1 rounded-full ${spec.bg} ${spec.text}`}>{p.specialite}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-2xl font-black text-slate-900">{p.note}</span>
                                        <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    </div>
                                    <Stars n={Math.round(p.note)} />
                                    <p className="text-xs text-slate-400 mt-1">Note moyenne</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-2xl font-black text-slate-900">{p.prestations}</p>
                                    <p className="text-xs text-slate-400 mt-1">Prestations</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-lg font-black text-emerald-600">{p.tarif}</p>
                                    <p className="text-xs text-slate-400 mt-1">Tarif horaire</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vérifications */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Vérifications & Certifications</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`flex items-center gap-4 p-4 rounded-2xl border ${p.diplome_valide ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.diplome_valide ? 'bg-emerald-500' : 'bg-amber-400'}`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${p.diplome_valide ? 'text-emerald-800' : 'text-amber-800'}`}>Diplôme professionnel</p>
                                    <p className={`text-xs ${p.diplome_valide ? 'text-emerald-600' : 'text-amber-600'}`}>{p.diplome_valide ? 'Vérifié par hs liberty' : 'En attente de vérification'}</p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-4 p-4 rounded-2xl border ${p.assurance_rc ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.assurance_rc ? 'bg-emerald-500' : 'bg-red-400'}`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${p.assurance_rc ? 'text-emerald-800' : 'text-red-700'}`}>Assurance RC Pro</p>
                                    <p className={`text-xs ${p.assurance_rc ? 'text-emerald-600' : 'text-red-500'}`}>{p.assurance_rc ? 'Valide et vérifiée' : 'Non renseignée — requis'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"/></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">N° RPPS / ID Professionnel</p>
                                    <p className="text-xs text-slate-500 font-mono">{p.numero_rpps ?? 'Non renseigné'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Pays d'exercice</p>
                                    <div className="flex gap-1.5 mt-1">
                                        {(Array.isArray(p.pays) && p.pays.length > 0)
                                            ? p.pays.map(c => <span key={c} className="text-xs font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-semibold">{c}</span>)
                                            : <span className="text-xs text-slate-400">—</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prestations récentes */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Prestations récentes</h3>
                            <span className="text-xs text-slate-400">{p.prestations} au total</span>
                        </div>
                        {prestations_recentes.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {prestations_recentes.map((pr, i) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{pr.voyageur}</p>
                                            <p className="text-xs text-slate-400">{pr.type} · {pr.date} · {pr.duree}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-slate-700">{pr.montant}</span>
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${pr.statut === 'realise' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-sky-50 text-sky-700 border-sky-100'}`}>
                                                {pr.statut === 'realise' ? 'Réalisé' : 'Planifié'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center text-sm text-slate-400">Aucune prestation enregistrée</div>
                        )}
                    </div>
                </div>

                {/* ── DROITE ── */}
                <div className="space-y-6">

                    {/* Contact */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Contact</h3>
                        </div>
                        <div className="p-5 space-y-3">
                            <a href={`mailto:${p.email}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors group">
                                <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <span className="text-sm text-slate-700 group-hover:text-emerald-700">{p.email}</span>
                            </a>
                            {p.telephone && (
                                <a href={`tel:${p.telephone}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors group">
                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                    <span className="text-sm text-slate-700 group-hover:text-emerald-700">{p.telephone}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                            Envoyer un message
                        </button>
                        {!p.diplome_valide && (
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                Valider le diplôme
                            </button>
                        )}
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl text-sm font-medium transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                            Suspendre le compte
                        </button>
                    </div>

                    {/* Infos */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Fiche</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { l: 'Spécialité', v: p.specialite },
                                { l: 'Tarif', v: p.tarif },
                                { l: 'Inscription', v: p.inscription },
                                { l: 'Prestations', v: `${p.prestations} au total` },
                            ].map(i => (
                                <div key={i.l} className="flex items-center justify-between px-5 py-3">
                                    <span className="text-xs text-slate-400 font-medium">{i.l}</span>
                                    <span className="text-sm font-semibold text-slate-900">{i.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}