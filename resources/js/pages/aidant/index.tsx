import { Link } from '@inertiajs/react';
import AidantLayout from './layout';

interface Voyageur {
    id: number; suivi_id: number; nom: string; initials: string;
    type_handicap: string; niveau_dependance: number;
    statut_suivi: string; prochain_sejour: string | null;
    hebergement: string | null; urgence_active: boolean;
}

export default function AidantIndex({
    aidant,
    voyageurs = [],
    nb_voyageurs = 0,
    urgences_actives = 0,
}: {
    aidant: { prenom: string; nom: string };
    voyageurs: Voyageur[];
    nb_voyageurs: number;
    urgences_actives: number;
}) {
    return (
        <AidantLayout title={`Bonjour, ${aidant.prenom} 👋`} subtitle="Tableau de bord aidant">

            {/* Urgence active */}
            {urgences_actives > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center animate-pulse flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-700">{urgences_actives} urgence(s) active(s) parmi vos voyageurs</p>
                        <p className="text-xs text-red-500">Intervention requise immédiatement</p>
                    </div>
                    <Link href="/urgences" className="text-xs font-bold text-white bg-red-500 px-3 py-1.5 rounded-xl hover:bg-red-600">Voir →</Link>
                </div>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <p className="text-xs text-slate-400 font-medium mb-1">Voyageurs suivis</p>
                    <p className="text-3xl font-extrabold text-teal-600">{nb_voyageurs}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <p className="text-xs text-slate-400 font-medium mb-1">Urgences actives</p>
                    <p className={`text-3xl font-extrabold ${urgences_actives > 0 ? 'text-red-500' : 'text-slate-900'}`}>{urgences_actives}</p>
                </div>
            </div>

            {/* Liste voyageurs */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">Mes voyageurs</h2>
                    <span className="text-xs text-slate-400">{nb_voyageurs} personne(s)</span>
                </div>

                {voyageurs.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {voyageurs.map(v => (
                            <div key={v.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors ${v.urgence_active ? 'bg-red-50/40' : ''}`}>
                                <div className="relative">
                                    <div className="w-11 h-11 rounded-2xl bg-teal-100 flex items-center justify-center text-sm font-black text-teal-700 flex-shrink-0">
                                        {v.initials}
                                    </div>
                                    {v.urgence_active && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white animate-pulse"/>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900">{v.nom}</p>
                                    <p className="text-xs text-slate-400 capitalize">
                                        {v.type_handicap} · Niveau {v.niveau_dependance}/5
                                    </p>
                                    {v.prochain_sejour && (
                                        <p className="text-xs text-teal-600 font-semibold mt-0.5">
                                            ✈️ {v.hebergement} · {v.prochain_sejour}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <Link href={`/aidant/suivi/${v.id}`}
                                        className="text-xs font-bold px-3 py-1.5 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 transition-colors">
                                        Suivi
                                    </Link>
                                    <Link href={`/aidant/checklist/${v.id}`}
                                        className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                                        Checklist
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-4xl mb-4">🤝</p>
                        <p className="text-sm font-bold text-slate-600 mb-1">Aucun voyageur assigné</p>
                        <p className="text-xs text-slate-400">Contactez l'administrateur pour être assigné à un voyageur</p>
                    </div>
                )}
            </div>
        </AidantLayout>
    );
}