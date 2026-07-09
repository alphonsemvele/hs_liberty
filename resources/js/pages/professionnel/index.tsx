import { Link } from '@inertiajs/react';
import ProfessionnelLayout from './layout';

const SPECIALITE_LABEL: Record<string, string> = {
    infirmiere: 'Infirmier(ère)', kinesitherapeute: 'Kinésithérapeute',
    auxiliaire: 'Auxiliaire de vie', aide_soignant: 'Aide-soignant(e)',
    medecin: 'Médecin', ergotherapeute: 'Ergothérapeute', orthophoniste: 'Orthophoniste',
};

const STATUT_BADGE: Record<string, string> = {
    planifie: 'bg-amber-100 text-amber-700',
    realise:  'bg-emerald-100 text-emerald-700',
    annule:   'bg-red-100 text-red-600',
};

export default function ProfessionnelIndex({ professionnel, interventions_recentes = [], stats }: any) {
    const p = professionnel;
    const initials = ((p.prenom?.[0] ?? '?') + (p.nom?.[0] ?? '')).toUpperCase();

    return (
        <ProfessionnelLayout title={`Bonjour, ${p.prenom} 👋`} subtitle="Tableau de bord professionnel de santé">

            {/* Carte profil */}
            <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-3xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)'}}/>
                <div className="relative flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black text-white flex-shrink-0">{initials}</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-black text-white">{p.prenom} {p.nom}</h2>
                            {p.certifie && <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">✓ Certifié</span>}
                        </div>
                        <p className="text-pink-100 text-sm">{SPECIALITE_LABEL[p.specialite] ?? p.specialite ?? 'Spécialité non renseignée'}</p>
                        {p.tarif && (
                            <p className="text-white/80 text-xs mt-1 font-semibold">
                                {Number(p.tarif).toLocaleString('fr-FR')} {p.devise}/h
                            </p>
                        )}
                    </div>
                    {p.note > 0 && (
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">{p.note.toFixed(1)}</p>
                            <p className="text-xs text-pink-200">⭐ {p.nb_avis} avis</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label:'Total interventions', value: stats.total,      color:'text-slate-900'  },
                    { label:'Ce mois',             value: stats.ce_mois,    color:'text-pink-600'   },
                    { label:'En attente',          value: stats.en_attente, color:'text-amber-600'  },
                    { label:`Revenus (${new Date().toLocaleString('fr-FR',{month:'long'})})`, value: stats.revenus + ' ' + p.devise, color:'text-emerald-600' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Interventions récentes */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Interventions récentes</h3>
                    <Link href="/professionnel/interventions" className="text-xs font-semibold text-pink-600">Voir tout →</Link>
                </div>
                {interventions_recentes.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {interventions_recentes.map((i: any) => (
                            <div key={i.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50">
                                <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-xs font-black text-pink-700 flex-shrink-0">{i.initials}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900">{i.voyageur}</p>
                                    <p className="text-xs text-slate-400">{i.type} · {i.date}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUT_BADGE[i.statut] ?? 'bg-slate-100 text-slate-500'}`}>
                                        {i.statut}
                                    </span>
                                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{i.montant}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-12 text-center">
                        <p className="text-3xl mb-3">🩺</p>
                        <p className="text-sm font-semibold text-slate-500">Aucune intervention pour l'instant</p>
                    </div>
                )}
            </div>
        </ProfessionnelLayout>
    );
}