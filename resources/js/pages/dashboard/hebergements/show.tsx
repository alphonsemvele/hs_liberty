import { Link, router } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface HebergementDetail {
    id: number; nom: string; ville: string; pays: string;
    niveau_certif: string | null; note: number;
    reservations: number; actif: boolean; created_at: string;
}
interface Props {
    hebergement: HebergementDetail;
    equipements: string[];
    reservations_recentes: { voyageur: string; dates: string; statut: string; montant: string }[];
}

const NIVEAU_STYLE: Record<string, { badge: string }> = {
    'Excellence':      { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    'Accessible Plus': { badge: 'bg-sky-100 text-sky-700 border-sky-200'             },
    'Accessible':      { badge: 'bg-teal-100 text-teal-700 border-teal-200'           },
};

const STATUT_RESA: Record<string, string> = {
    'Confirmee':  'bg-emerald-50 text-emerald-700 border-emerald-100',
    'En_attente': 'bg-amber-50 text-amber-700 border-amber-100',
    'Terminee':   'bg-slate-100 text-slate-500 border-slate-200',
};

const Stars = ({ n }: { n: number }) => (
    <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
            <svg key={i} className={`w-4 h-4 ${i <= n ? 'text-amber-400' : 'text-slate-200'} fill-current`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
        ))}
    </div>
);

export default function HebergementShow({ hebergement, equipements = [], reservations_recentes = [] }: Partial<Props>) {
    const h = hebergement!;
    const niveau = h ? NIVEAU_STYLE[h.niveau_certif ?? ''] : undefined;

    const handleToggleActif = () => {
        router.patch(`/hebergements/${h.id}/toggle-actif`);
    };

    const handleDelete = () => {
        if (confirm('Confirmer la suppression ? Cette action est irréversible.')) {
            router.delete(`/hebergements/${h.id}`);
        }
    };

    if (!h) return null;

    return (
        <DashboardLayout title={h.nom} subtitle={`${h.ville} · ${h.pays}`}>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/hebergements" className="text-slate-400 hover:text-emerald-600 transition-colors">Hébergements</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">{h.nom}</span>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">

                    {/* Hero card */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="h-40 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 relative flex items-end p-6">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }}/>
                            <div className="relative z-10 flex items-end justify-between w-full">
                                <div>
                                    <h1 className="text-2xl font-black text-white">{h.nom}</h1>
                                    <p className="text-emerald-200 text-sm mt-1">{h.ville}, {h.pays}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${h.actif ? 'bg-white/20 text-white border-white/30' : 'bg-white/10 text-white/60 border-white/20'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${h.actif ? 'bg-white' : 'bg-white/40'}`}/>
                                    {h.actif ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                            <div className="p-5 text-center">
                                <p className="text-xs text-slate-400 font-medium mb-1">Note moyenne</p>
                                <div className="flex items-center justify-center gap-1.5">
                                    <p className="text-2xl font-black text-slate-900">{h.note}</p>
                                    <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                </div>
                                <Stars n={Math.round(h.note)} />
                            </div>
                            <div className="p-5 text-center">
                                <p className="text-xs text-slate-400 font-medium mb-1">Réservations</p>
                                <p className="text-2xl font-black text-slate-900">{h.reservations}</p>
                                <p className="text-xs text-emerald-600 font-medium">Total</p>
                            </div>
                            <div className="p-5 text-center">
                                <p className="text-xs text-slate-400 font-medium mb-1">Inscrit le</p>
                                <p className="text-sm font-bold text-slate-900">{h.created_at}</p>
                                <p className="text-xs text-slate-400">sur hs liberty</p>
                            </div>
                        </div>

                        {/* Certification */}
                        <div className="p-6">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Certification ISO 21902</p>
                            {h.niveau_certif ? (
                                <div className="flex items-center gap-4">
                                    <span className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border ${niveau?.badge}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                        {h.niveau_certif}
                                    </span>
                                    <Link href="/certifications" className="text-xs text-slate-400 hover:text-emerald-600 transition-colors">Voir le rapport d'audit →</Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                    <p className="text-xs text-amber-700 font-medium">Établissement non certifié. Un audit est nécessaire.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Équipements */}
                    {equipements.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900">Équipements PMR disponibles</h3>
                                <span className="text-xs font-semibold text-slate-400">{equipements.length} équipement(s)</span>
                            </div>
                            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                                {equipements.map(eq => (
                                    <div key={eq} className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                        </div>
                                        <span className="text-xs font-semibold text-emerald-800">{eq}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Réservations récentes */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Réservations récentes</h3>
                            <Link href="/reservations" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Voir tout →</Link>
                        </div>
                        {reservations_recentes.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {reservations_recentes.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{r.voyageur}</p>
                                            <p className="text-xs text-slate-400">{r.dates}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-slate-700">{r.montant}</span>
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUT_RESA[r.statut] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>{r.statut}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center text-sm text-slate-400">Aucune réservation pour cet établissement</div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                        <div className="space-y-2">
                            <Link href={`/hebergements/${h.id}/edit`} className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                Modifier
                            </Link>
                            <button onClick={handleToggleActif} className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${h.actif ? 'border-red-200 hover:bg-red-50 text-red-500' : 'border-emerald-200 hover:bg-emerald-50 text-emerald-600'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={h.actif ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"}/>
                                </svg>
                                {h.actif ? 'Désactiver' : 'Réactiver'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Informations</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { label: 'Ville',         value: h.ville },
                                { label: 'Pays',          value: h.pays },
                                { label: 'Statut',        value: h.actif ? 'Actif' : 'Inactif' },
                                { label: 'Certification', value: h.niveau_certif ?? 'Aucune' },
                                { label: 'Inscription',   value: h.created_at },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between px-5 py-3">
                                    <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                                    <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
                        <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Zone dangereuse</p>
                        <p className="text-xs text-red-500 mb-3">La suppression est irréversible.</p>
                        <button onClick={handleDelete} className="w-full px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-colors">
                            Supprimer l'hébergement
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}