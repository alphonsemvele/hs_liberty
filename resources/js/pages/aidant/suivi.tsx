import { Link } from '@inertiajs/react';
import AidantLayout from './layout';

const STATUT_BADGE: Record<string, string> = {
    confirmee: 'bg-emerald-100 text-emerald-700',
    en_attente:'bg-amber-100 text-amber-700',
    terminee:  'bg-slate-100 text-slate-500',
    annulee:   'bg-red-100 text-red-600',
};
const STATUT_LABEL: Record<string, string> = {
    confirmee:'Confirmée', en_attente:'En attente', terminee:'Terminée', annulee:'Annulée',
};
const TYPE_URGENCE: Record<string, { label: string; icon: string; color: string }> = {
    medical:  { label:'Médical',  icon:'🏥', color:'text-red-600 bg-red-50'     },
    securite: { label:'Sécurité', icon:'🔒', color:'text-orange-600 bg-orange-50'},
    accident: { label:'Accident', icon:'⚠️', color:'text-amber-600 bg-amber-50'  },
    autre:    { label:'Autre',    icon:'📢', color:'text-slate-600 bg-slate-100' },
};

export default function AidantSuivi({
    voyageur,
    reservation_en_cours,
    urgences_recentes = [],
    suivi_id,
}: {
    voyageur: any;
    reservation_en_cours: any;
    urgences_recentes: any[];
    suivi_id: number;
}) {
    const v = voyageur;

    return (
        <AidantLayout title={`Suivi — ${v.nom}`} subtitle={`${v.type_handicap} · Niveau ${v.niveau_dependance}/5`}>

            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/aidant" className="text-slate-400 hover:text-teal-600 transition-colors">Tableau de bord</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">{v.nom}</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">

                    {/* Fiche voyageur */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="bg-gradient-to-br from-teal-600 to-teal-700 h-20 relative">
                            <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 80% 40%, white 0%, transparent 55%)'}}/>
                        </div>
                        <div className="px-6 pb-6">
                            <div className="flex items-end gap-4 -mt-7 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-teal-700 border-4 border-white shadow-lg flex items-center justify-center text-lg font-black text-white flex-shrink-0">
                                    {v.initials}
                                </div>
                                <div className="mb-1">
                                    <h2 className="text-xl font-black text-slate-900">{v.nom}</h2>
                                    <p className="text-xs text-slate-400">{v.email}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                                    <p className="text-xs text-slate-400 mb-1">Type de handicap</p>
                                    <p className="text-sm font-black text-slate-900 capitalize">{v.type_handicap}</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                                    <p className="text-xs text-slate-400 mb-1">Niveau de dépendance</p>
                                    <p className="text-sm font-black text-teal-600">{v.niveau_dependance}/5</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                                    <p className="text-xs text-slate-400 mb-1">Statut suivi</p>
                                    <p className="text-sm font-black text-slate-900 capitalize">{v.statut_suivi}</p>
                                </div>
                            </div>

                            {v.besoins && (
                                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                                    <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Besoins spécifiques</p>
                                    <p className="text-sm text-teal-800">{v.besoins}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Séjour en cours */}
                    {reservation_en_cours ? (
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-lg">🏨</div>
                                <h3 className="text-sm font-bold text-slate-900">Séjour en cours / à venir</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-base font-bold text-slate-900">{reservation_en_cours.hebergement}</p>
                                        <p className="text-sm text-slate-400 mt-1">📍 {reservation_en_cours.ville}</p>
                                        <p className="text-sm text-slate-500 mt-2">
                                            {reservation_en_cours.date_arrivee} → {reservation_en_cours.date_depart}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${STATUT_BADGE[reservation_en_cours.statut] ?? 'bg-slate-100 text-slate-500'}`}>
                                        {STATUT_LABEL[reservation_en_cours.statut] ?? reservation_en_cours.statut}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl p-5 text-center">
                            <p className="text-sm text-slate-400">Aucun séjour en cours ou à venir</p>
                        </div>
                    )}

                    {/* Urgences récentes */}
                    {urgences_recentes.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">Urgences récentes</h3>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {urgences_recentes.map(u => {
                                    const tc = TYPE_URGENCE[u.type] ?? TYPE_URGENCE.autre;
                                    return (
                                        <div key={u.id} className="flex items-center gap-4 px-6 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${tc.color}`}>
                                                {tc.icon} {tc.label}
                                            </span>
                                            <span className="text-xs text-slate-500 flex-1">{u.declenchee_le}</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.statut === 'resolu' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                                {u.statut === 'resolu' ? 'Résolue' : 'Active'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar actions */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                        <Link href={`/aidant/checklist/${v.id}`}
                            className="w-full flex items-center gap-3 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                            Voir la checklist
                        </Link>
                        <Link href="/aidant"
                            className="w-full flex items-center gap-3 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                            ← Retour
                        </Link>
                    </div>
                </div>
            </div>
        </AidantLayout>
    );
}