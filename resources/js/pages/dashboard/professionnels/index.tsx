import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface ProfItem {
    id: number;
    initials: string;
    nom: string;
    email: string;
    specialite: string;
    pays: string[];
    tarif: string;
    note: number;
    diplome_valide: boolean;
    assurance_rc: boolean;
    prestations: number;
    inscription: string;
}

const SPEC_COLORS: Record<string, string> = {
    'Infirmière':        'bg-sky-50 text-sky-700',
    'Infirmier':         'bg-sky-50 text-sky-700',
    'Kinésithérapeute':  'bg-violet-50 text-violet-700',
    'Auxiliaire de vie': 'bg-teal-50 text-teal-700',
    'Aide-soignant':     'bg-pink-50 text-pink-700',
    'Médecin':           'bg-emerald-50 text-emerald-700',
    'Ergothérapeute':    'bg-amber-50 text-amber-700',
};

export default function ProfessionnelsIndex({
    professionnels = [],
    stats = { total: 0, certifies: 0, en_attente_validation: 0, prestations_mois: 0 },
}: {
    professionnels?: ProfItem[];
    stats?: any;
}) {
    return (
        <DashboardLayout title="Professionnels de santé" subtitle="Réseau certifié à destination">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { l: 'Total',               v: stats.total,                 c: 'text-slate-900'  },
                    { l: 'Certifiés',           v: stats.certifies,             c: 'text-emerald-600'},
                    { l: 'En validation',       v: stats.en_attente_validation, c: 'text-amber-600'  },
                    { l: 'Prestations / mois',  v: stats.prestations_mois,      c: 'text-sky-600'    },
                ].map(s => (
                    <div key={s.l} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.l}</p>
                        <p className={`text-2xl font-extrabold ${s.c}`}>{s.v}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input
                        placeholder="Nom, spécialité…"
                        className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-64"
                    />
                </div>

                <Link
                    href="/professionnels/create"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/>
                    </svg>
                    Nouveau professionnel
                </Link>
            </div>

            {/* Alerte profils en attente */}
            {stats.en_attente_validation > 0 && (
                <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <p className="text-sm text-amber-700 font-medium">
                        {stats.en_attente_validation} profil(s) en attente de validation — diplôme ou RC Pro manquant(e).
                    </p>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {['Professionnel', 'Spécialité', 'Pays', 'Tarif', 'Note', 'Diplôme', 'RC Pro', 'Prestations', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {professionnels.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">

                                    {/* Professionnel */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-xs font-black text-sky-700 flex-shrink-0">
                                                {p.initials}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{p.nom}</p>
                                                <p className="text-xs text-slate-400">{p.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Spécialité */}
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${SPEC_COLORS[p.specialite] ?? 'bg-slate-100 text-slate-600'}`}>
                                            {p.specialite}
                                        </span>
                                    </td>

                                    {/* Pays */}
                                    <td className="px-5 py-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {(p.pays ?? []).map(c => (
                                                <span key={c} className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Tarif */}
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                                        {p.tarif}
                                    </td>

                                    {/* Note */}
                                    <td className="px-5 py-4">
                                        {p.note > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                                <span className="text-sm font-semibold text-slate-700">{p.note}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-300">—</span>
                                        )}
                                    </td>

                                    {/* Diplôme */}
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.diplome_valide ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {p.diplome_valide ? '✓ Vérifié' : '⏳ En attente'}
                                        </span>
                                    </td>

                                    {/* RC Pro */}
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.assurance_rc ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                                            {p.assurance_rc ? '✓' : '✗ Manquante'}
                                        </span>
                                    </td>

                                    {/* Prestations */}
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                                        {p.prestations}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/professionnels/${p.id}`}
                                                className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors"
                                            >
                                                Voir →
                                            </Link>
                                            {!p.diplome_valide && (
                                                <button className="text-xs font-medium text-amber-500 hover:text-amber-700 transition-colors">
                                                    Valider
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {professionnels.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Aucun professionnel enregistré</p>
                        <p className="text-xs text-slate-400 mb-4">Ajoutez le premier professionnel de santé du réseau</p>
                        <Link
                            href="/professionnels/create"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/>
                            </svg>
                            Nouveau professionnel
                        </Link>
                    </div>
                )}

                {professionnels.length > 0 && (
                    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-400">{professionnels.length} professionnel(s)</p>
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