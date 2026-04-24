import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface VoyageurItem {
    id: number;
    initials: string;
    nom: string;
    email: string;
    telephone: string;
    type_handicap: string;
    niveau_dependance: number;
    reservations: number;
    inscription: string;
    actif: boolean;
}

const TYPE_STYLE: Record<string, string> = {
    moteur:       'bg-blue-50 text-blue-700',
    sensoriel:    'bg-purple-50 text-purple-700',
    cognitif:     'bg-orange-50 text-orange-700',
    polyhandicap: 'bg-red-50 text-red-700',
    psychiatrique:'bg-pink-50 text-pink-700',
    autre:        'bg-slate-100 text-slate-600',
};

export default function VoyageursIndex({
    voyageurs = [],
    stats = { total: 0, actifs: 0, inactifs: 0, avec_profil_medical: 0 },
}: {
    voyageurs?: VoyageurItem[];
    stats?: any;
}) {
    return (
        <DashboardLayout title="Voyageurs" subtitle="Tous les profils inscrits">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { l: 'Total inscrits',  v: stats.total,               c: 'text-slate-900'   },
                    { l: 'Actifs',          v: stats.actifs,              c: 'text-emerald-600' },
                    { l: 'Inactifs',        v: stats.inactifs,            c: 'text-slate-400'   },
                    { l: 'Profil médical',  v: stats.avec_profil_medical, c: 'text-violet-600'  },
                ].map(s => (
                    <div key={s.l} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.l}</p>
                        <p className={`text-2xl font-extrabold ${s.c}`}>{s.v}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input
                            placeholder="Nom, email…"
                            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-56"
                        />
                    </div>
                    <select className="text-sm border border-slate-200 rounded-xl bg-white px-3 py-2 focus:outline-none text-slate-600">
                        <option>Tous les handicaps</option>
                        <option>Moteur</option>
                        <option>Sensoriel</option>
                        <option>Cognitif</option>
                        <option>Polyhandicap</option>
                        <option>Psychiatrique</option>
                    </select>
                </div>

                <Link
                    href="/voyageurs/create"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/>
                    </svg>
                    Nouveau voyageur
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {['Voyageur', 'Handicap', 'Dépendance', 'Réservations', 'Inscription', 'Statut', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {voyageurs.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50 transition-colors group">

                                    {/* Voyageur */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-xs font-black text-violet-700 flex-shrink-0">
                                                {v.initials}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                                    {v.nom}
                                                </p>
                                                <p className="text-xs text-slate-400">{v.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Handicap */}
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${TYPE_STYLE[v.type_handicap] ?? 'bg-slate-100 text-slate-600'}`}>
                                            {v.type_handicap}
                                        </span>
                                    </td>

                                    {/* Dépendance */}
                                    <td className="px-5 py-4">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(n => (
                                                <div key={n} className={`w-3 h-3 rounded-sm ${n <= v.niveau_dependance ? 'bg-violet-500' : 'bg-slate-100'}`}/>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1">{v.niveau_dependance}/5</p>
                                    </td>

                                    {/* Réservations */}
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                                        {v.reservations}
                                    </td>

                                    {/* Inscription */}
                                    <td className="px-5 py-4 text-sm text-slate-500">
                                        {v.inscription}
                                    </td>

                                    {/* Statut */}
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border
                                            ${v.actif
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${v.actif ? 'bg-emerald-500' : 'bg-slate-300'}`}/>
                                            {v.actif ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <Link
                                            href={`/voyageurs/${v.id}`}
                                            className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors"
                                        >
                                            Profil →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {voyageurs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Aucun voyageur inscrit</p>
                        <p className="text-xs text-slate-400 mb-4">Créez le premier profil voyageur de la plateforme</p>
                        <Link
                            href="/voyageurs/create"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/>
                            </svg>
                            Nouveau voyageur
                        </Link>
                    </div>
                )}

                {voyageurs.length > 0 && (
                    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-400">{voyageurs.length} voyageur(s)</p>
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