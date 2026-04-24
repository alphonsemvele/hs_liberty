import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Aidant {
    id: number;
    initials: string;
    nom: string;
    email: string;
    telephone: string;
    lien_parente: string;
    voyageur_suivi: string;
    voyageur_id: number;
    niveau_acces: 'lecture' | 'ecriture' | 'urgence';
    actif_depuis: string;
    sejours_suivis: number;
}

interface Stats {
    total: number;
    acces_ecriture: number;
    acces_lecture: number;
    acces_urgence: number;
}

interface Props { aidants: Aidant[]; stats: Stats; }

const DEFAUT_AIDANTS: Aidant[] = [
    { id:1, initials:'AD', nom:'Adja Diarra',      email:'adja.d@email.com',     telephone:'+221 77 987 65 43', lien_parente:'Épouse', voyageur_suivi:'Kofi Diarra',           voyageur_id:1, niveau_acces:'ecriture', actif_depuis:'10/01/2026', sejours_suivis:4 },
    { id:2, initials:'CM', nom:'Céline Mbaye',      email:'celine.m@email.com',   telephone:'+212 6 98 76 54 32',lien_parente:'Fille',  voyageur_suivi:'Amina Mbaye',           voyageur_id:2, niveau_acces:'lecture',  actif_depuis:'15/01/2026', sejours_suivis:2 },
    { id:3, initials:'PE', nom:'Pierre Essomba',    email:'pierre.e@email.com',   telephone:'+225 07 98 76 54',  lien_parente:'Frère',  voyageur_suivi:'Jean-Baptiste Essomba', voyageur_id:3, niveau_acces:'urgence',  actif_depuis:'08/02/2026', sejours_suivis:3 },
    { id:4, initials:'IT', nom:'Ibrahim Touré',     email:'ibrahim.t@email.com',  telephone:'+228 90 98 76 54',  lien_parente:'Père',   voyageur_suivi:'Fatou Touré',           voyageur_id:4, niveau_acces:'ecriture', actif_depuis:'20/02/2026', sejours_suivis:6 },
    { id:5, initials:'SN', nom:'Seynabou Ndiaye',   email:'seynabou.n@email.com', telephone:'+254 712 987 654',  lien_parente:'Mère',   voyageur_suivi:'Oumar Ndiaye',          voyageur_id:5, niveau_acces:'lecture',  actif_depuis:'01/03/2026', sejours_suivis:1 },
];

const DEFAUT_STATS: Stats = { total:5, acces_ecriture:2, acces_lecture:2, acces_urgence:1 };

const NIVEAU_CONFIG = {
    ecriture: {
        label: 'Écriture',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        dot:   'bg-emerald-500',
        desc:  'Peut modifier le programme et la checklist',
    },
    lecture: {
        label: 'Lecture',
        badge: 'bg-sky-50 text-sky-700 border-sky-100',
        dot:   'bg-sky-500',
        desc:  "Consultation du programme et de l'historique",
    },
    urgence: {
        label: 'Urgence seulement',
        badge: 'bg-red-50 text-red-600 border-red-100',
        dot:   'bg-red-400',
        desc:  "Accès au protocole d'urgence uniquement",
    },
};

export default function AidantsIndex({
    aidants = DEFAUT_AIDANTS,
    stats   = DEFAUT_STATS,
}: Partial<Props>) {
    return (
        <DashboardLayout title="Aidants & Accompagnants" subtitle="Proches et structures habilités à suivre un voyageur">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total aidants',   value: stats.total,           color: 'text-slate-900'   },
                    { label: 'Accès écriture',  value: stats.acces_ecriture,  color: 'text-emerald-600' },
                    { label: 'Accès lecture',   value: stats.acces_lecture,   color: 'text-sky-600'     },
                    { label: 'Urgence seul',    value: stats.acces_urgence,   color: 'text-red-500'     },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Légende niveaux */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Niveaux d'accès</p>
                <div className="grid md:grid-cols-3 gap-3">
                    {Object.entries(NIVEAU_CONFIG).map(([key, cfg]) => (
                        <div key={key} className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.badge}`}>
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`}/>
                            <div>
                                <p className="text-xs font-bold">{cfg.label}</p>
                                <p className="text-xs opacity-70 mt-0.5">{cfg.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input
                        placeholder="Nom, email, voyageur…"
                        className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-60"
                    />
                </div>

                <Link
                    href="/aidants/create"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/>
                    </svg>
                    Ajouter un aidant
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {['Aidant', 'Lien', 'Voyageur suivi', "Niveau d'accès", 'Séjours', 'Depuis', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {aidants.map(a => {
                                const cfg = NIVEAU_CONFIG[a.niveau_acces];
                                return (
                                    <tr key={a.id} className="hover:bg-slate-50 transition-colors group">

                                        {/* Aidant */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-xs font-black text-sky-700 flex-shrink-0">
                                                    {a.initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                                        {a.nom}
                                                    </p>
                                                    <p className="text-xs text-slate-400">{a.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Lien */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-slate-600">{a.lien_parente}</span>
                                        </td>

                                        {/* Voyageur suivi */}
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/voyageurs/${a.voyageur_id}`}
                                                className="text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
                                            >
                                                {a.voyageur_suivi}
                                            </Link>
                                        </td>

                                        {/* Niveau */}
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
                                                {cfg.label}
                                            </span>
                                        </td>

                                        {/* Séjours */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-semibold text-slate-700">{a.sejours_suivis}</span>
                                        </td>

                                        {/* Depuis */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-slate-500">{a.actif_depuis}</span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={`/aidants/${a.id}`}
                                                    className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors"
                                                >
                                                    Voir →
                                                </Link>
                                                <button className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors">
                                                    Révoquer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* État vide */}
                {aidants.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Aucun aidant enregistré</p>
                        <p className="text-xs text-slate-400 mb-4">Ajoutez le premier aidant de la plateforme</p>
                        <Link
                            href="/aidants/create"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/>
                            </svg>
                            Ajouter un aidant
                        </Link>
                    </div>
                )}

                {/* Footer */}
                {aidants.length > 0 && (
                    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-400">{aidants.length} aidant(s)</p>
                        <div className="flex gap-1">
                            <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Préc.</button>
                            <button className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg">1</button>
                            <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Suiv.</button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}