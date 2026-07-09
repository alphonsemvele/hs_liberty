import { Link, router } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Aidant {
    id: number; initials: string; nom: string; email: string; telephone: string;
    lien_parente: string; voyageur_suivi: string; voyageur_id: number;
    niveau_acces: 'lecture' | 'ecriture' | 'urgence';
    actif_depuis: string; sejours_suivis: number;
}
interface SejourSuivi { ref: string; destination: string; dates: string; statut: string; urgences: number; }
interface Props { aidant: Aidant; sejours: SejourSuivi[]; }

const NIVEAU_CONF = {
    ecriture: {
        label: 'Écriture', desc: 'Peut consulter et modifier le programme de séjour, la checklist, et contacter les professionnels.',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon_bg: 'bg-emerald-500', dot: 'bg-emerald-500',
        banniere: 'from-emerald-700 via-emerald-600 to-teal-600',
        permissions: [
            { label: 'Consulter le programme séjour',         ok: true  },
            { label: 'Modifier la checklist de préparation',  ok: true  },
            { label: 'Contacter les professionnels de santé', ok: true  },
            { label: 'Voir le profil médical complet',        ok: false },
            { label: 'Accès protocole urgence',               ok: false },
        ],
    },
    lecture: {
        label: 'Lecture seule', desc: "Peut uniquement consulter le programme de séjour et l'historique des interventions.",
        badge: 'bg-sky-50 text-sky-700 border-sky-200', icon_bg: 'bg-sky-500', dot: 'bg-sky-400',
        banniere: 'from-sky-700 via-sky-600 to-blue-600',
        permissions: [
            { label: 'Consulter le programme séjour',         ok: true  },
            { label: 'Modifier la checklist de préparation',  ok: false },
            { label: 'Contacter les professionnels de santé', ok: false },
            { label: 'Voir le profil médical complet',        ok: false },
            { label: 'Accès protocole urgence',               ok: false },
        ],
    },
    urgence: {
        label: 'Urgence uniquement', desc: "Accès exclusivement au protocole médical d'urgence.",
        badge: 'bg-red-50 text-red-600 border-red-200', icon_bg: 'bg-red-500', dot: 'bg-red-400',
        banniere: 'from-red-700 via-red-600 to-orange-600',
        permissions: [
            { label: 'Consulter le programme séjour',         ok: false },
            { label: 'Modifier la checklist de préparation',  ok: false },
            { label: 'Contacter les professionnels de santé', ok: false },
            { label: 'Voir le profil médical complet',        ok: false },
            { label: 'Accès protocole urgence',               ok: true  },
        ],
    },
};

const STATUT_BADGE: Record<string, string> = {
    'confirmee':  'bg-emerald-50 text-emerald-700 border-emerald-100',
    'en_attente': 'bg-amber-50 text-amber-600 border-amber-100',
    'terminee':   'bg-slate-100 text-slate-500 border-slate-200',
    'annulee':    'bg-red-50 text-red-600 border-red-100',
    'En cours':   'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Terminé':    'bg-slate-100 text-slate-500 border-slate-200',
    'À venir':    'bg-sky-50 text-sky-700 border-sky-100',
};

export default function AidantShow({ aidant, sejours = [] }: Partial<Props>) {
    const a = aidant!;
    if (!a) return null;
    const cfg = NIVEAU_CONF[a.niveau_acces];

    const handleRevoquer = () => {
        if (confirm(`Révoquer les accès de ${a.nom} ?`)) {
            router.delete(`/aidants/${a.id}`);
        }
    };

    return (
        <DashboardLayout title={a.nom} subtitle="Profil aidant">
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/aidants" className="text-slate-400 hover:text-emerald-600 transition-colors">Aidants</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">{a.nom}</span>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">

                    {/* Hero */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className={`h-28 bg-gradient-to-br ${cfg.banniere} relative`}>
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 40%, white 0%, transparent 55%)' }}/>
                            <div className="absolute bottom-3 right-4">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 text-white border border-white/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"/>
                                    Accès {cfg.label}
                                </span>
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <div className="flex items-end gap-4 -mt-8 mb-5">
                                <div className={`w-16 h-16 rounded-2xl ${cfg.icon_bg} border-4 border-white shadow-lg flex items-center justify-center text-xl font-black text-white flex-shrink-0`}>
                                    {a.initials}
                                </div>
                                <div className="mb-1">
                                    <h1 className="text-xl font-black text-slate-900">{a.nom}</h1>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {a.lien_parente} de{' '}
                                        <Link href={`/voyageurs/${a.voyageur_id}`} className="text-emerald-600 font-semibold hover:underline">
                                            {a.voyageur_suivi}
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-2xl font-black text-slate-900">{a.sejours_suivis}</p>
                                    <p className="text-xs text-slate-400 mt-1">Séjours suivis</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-sm font-black text-slate-900">{a.actif_depuis}</p>
                                    <p className="text-xs text-slate-400 mt-1">Aidant depuis</p>
                                </div>
                                <div className={`text-center p-4 rounded-2xl border ${cfg.badge}`}>
                                    <p className="text-sm font-black">{cfg.label}</p>
                                    <p className="text-xs opacity-70 mt-1">Niveau d'accès</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <a href={`mailto:${a.email}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all group">
                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    <span className="text-sm text-slate-700 group-hover:text-emerald-700 truncate">{a.email}</span>
                                </a>
                                <a href={`tel:${a.telephone}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all group">
                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                    <span className="text-sm text-slate-700 group-hover:text-emerald-700">{a.telephone}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Permissions */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl ${cfg.icon_bg} flex items-center justify-center`}>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Niveau d'accès — {cfg.label}</h3>
                                <p className="text-xs text-slate-400">{cfg.desc}</p>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {cfg.permissions.map((p, i) => (
                                <div key={i} className="flex items-center justify-between px-6 py-3.5">
                                    <span className={`text-sm ${p.ok ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>{p.label}</span>
                                    {p.ok
                                        ? <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg></div>
                                        : <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></div>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Séjours */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Séjours suivis <span className="text-slate-400 font-normal">({sejours.length})</span></h3>
                            <Link href="/reservations" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Voir tout →</Link>
                        </div>
                        {sejours.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {sejours.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                        <div>
                                            <span className="text-[10px] font-mono text-slate-400">{s.ref}</span>
                                            <p className="text-sm font-semibold text-slate-900">{s.destination}</p>
                                            <p className="text-xs text-slate-400">{s.dates}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${STATUT_BADGE[s.statut] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {s.statut}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center text-sm text-slate-400">Aucun séjour suivi</div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            Modifier le niveau d'accès
                        </button>
                        <button onClick={handleRevoquer} className="w-full flex items-center gap-3 px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-500 rounded-xl text-sm font-medium transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                            Révoquer les accès
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-900">Fiche</h3></div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { l: 'Lien familial',   v: a.lien_parente    },
                                { l: 'Voyageur suivi',  v: a.voyageur_suivi  },
                                { l: "Niveau d'accès",  v: cfg.label         },
                                { l: 'Aidant depuis',   v: a.actif_depuis    },
                                { l: 'Séjours suivis',  v: String(a.sejours_suivis) },
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