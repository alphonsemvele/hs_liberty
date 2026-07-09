import { Link, router } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Voyageur {
    id: number; initials: string; nom: string; email: string; telephone: string;
    type_handicap: string; niveau_dependance: number; reservations: number;
    inscription: string; actif: boolean;
}
interface ResaItem { ref: string; hebergement: string; dates: string; statut: string; montant: string; }
interface AidantItem { nom: string; lien: string; telephone: string; }
interface Props { voyageur: Voyageur; reservations: ResaItem[]; aidants: AidantItem[]; }

const TYPE_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
    moteur:       { bg: 'from-blue-600 to-blue-700',    text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700'   },
    sensoriel:    { bg: 'from-purple-600 to-purple-700', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700'},
    cognitif:     { bg: 'from-orange-600 to-orange-700', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700'},
    polyhandicap: { bg: 'from-red-600 to-red-700',       text: 'text-red-700',    badge: 'bg-red-100 text-red-700'     },
    psychiatrique:{ bg: 'from-pink-600 to-pink-700',     text: 'text-pink-700',   badge: 'bg-pink-100 text-pink-700'   },
    autre:        { bg: 'from-slate-600 to-slate-700',   text: 'text-slate-700',  badge: 'bg-slate-100 text-slate-700' },
};

const STATUT_RESA: Record<string, string> = {
    'Confirmee':  'bg-emerald-50 text-emerald-700 border-emerald-100',
    'En_attente': 'bg-amber-50 text-amber-700 border-amber-100',
    'Terminee':   'bg-slate-100 text-slate-500 border-slate-200',
    'Annulee':    'bg-red-50 text-red-600 border-red-100',
    'Confirmée':  'bg-emerald-50 text-emerald-700 border-emerald-100',
    'En attente': 'bg-amber-50 text-amber-700 border-amber-100',
    'Terminée':   'bg-slate-100 text-slate-500 border-slate-200',
    'Annulée':    'bg-red-50 text-red-600 border-red-100',
};

export default function VoyageurShow({ voyageur, reservations = [], aidants = [] }: Partial<Props>) {
    const v  = voyageur!;
    const tc = TYPE_COLORS[v?.type_handicap] ?? TYPE_COLORS.autre;

    const handleToggleActif = () => {
        if (confirm(`${v.actif ? 'Désactiver' : 'Réactiver'} le compte de ${v.nom} ?`)) {
            router.patch(`/voyageurs/${v.id}/toggle-actif`);
        }
    };

    if (!v) return null;

    return (
        <DashboardLayout title={v.nom} subtitle="Profil voyageur">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/voyageurs" className="text-slate-400 hover:text-emerald-600 transition-colors">Voyageurs</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">{v.nom}</span>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">

                    {/* Hero */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className={`h-28 bg-gradient-to-br ${tc.bg} relative`}>
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }}/>
                        </div>
                        <div className="px-6 pb-6">
                            <div className="flex items-end gap-4 -mt-8 mb-5">
                                <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg bg-violet-700 flex items-center justify-center text-xl font-black text-white flex-shrink-0">
                                    {v.initials}
                                </div>
                                <div className="mb-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h1 className="text-xl font-black text-slate-900">{v.nom}</h1>
                                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${v.actif ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${v.actif ? 'bg-emerald-500' : 'bg-slate-300'}`}/>
                                            {v.actif ? 'Actif' : 'Inactif'}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${tc.badge}`}>{v.type_handicap}</span>
                                </div>
                            </div>

                            {/* KPIs */}
                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-2xl font-black text-slate-900">{v.reservations}</p>
                                    <p className="text-xs text-slate-400 mt-1">Réservations</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <div className="flex justify-center gap-0.5 mb-1">
                                        {[1,2,3,4,5].map(n => (
                                            <div key={n} className={`w-3.5 h-3.5 rounded-sm ${n <= v.niveau_dependance ? 'bg-violet-500' : 'bg-slate-200'}`}/>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400">Niveau {v.niveau_dependance}/5</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-sm font-black text-slate-900">{v.inscription}</p>
                                    <p className="text-xs text-slate-400 mt-1">Inscription</p>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="grid md:grid-cols-2 gap-3">
                                <a href={`mailto:${v.email}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 border border-transparent transition-all group">
                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    <span className="text-sm text-slate-600 group-hover:text-emerald-700 truncate">{v.email}</span>
                                </a>
                                <a href={`tel:${v.telephone}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 border border-transparent transition-all group">
                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                    <span className="text-sm text-slate-600 group-hover:text-emerald-700">{v.telephone}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Réservations */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Historique des réservations</h3>
                            <Link href="/reservations/create" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">+ Nouvelle →</Link>
                        </div>
                        {reservations.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {reservations.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                        <div>
                                            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">{r.ref}</span>
                                            <p className="text-sm font-semibold text-slate-900 mt-1">{r.hebergement}</p>
                                            <p className="text-xs text-slate-400">{r.dates}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUT_RESA[r.statut] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>{r.statut}</span>
                                            <span className="text-sm font-bold text-slate-700">{r.montant}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center">
                                <p className="text-sm text-slate-400 mb-3">Aucune réservation</p>
                                <Link href="/reservations/create" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">+ Créer une réservation →</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                        <Link href="/reservations/create"
                            className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14"/></svg>
                            Créer une réservation
                        </Link>
                        <Link href={`/voyageurs/${v.id}/edit`}
                            className="w-full flex items-center gap-3 px-4 py-2.5 border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-600 hover:text-sky-700 rounded-xl text-sm font-medium transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            Modifier le profil
                        </Link>
                        <button onClick={handleToggleActif}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${v.actif ? 'border-red-200 hover:bg-red-50 text-red-500' : 'border-emerald-200 hover:bg-emerald-50 text-emerald-600'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.actif ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"}/></svg>
                            {v.actif ? 'Désactiver le compte' : 'Réactiver le compte'}
                        </button>
                    </div>

                    {/* Aidants */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Aidants liés</h3>
                            <Link href="/aidants" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Gérer →</Link>
                        </div>
                        {aidants.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {aidants.map((a, i) => (
                                    <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                                        <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-xs font-black text-sky-700 flex-shrink-0">
                                            {a.nom.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{a.nom}</p>
                                            <p className="text-xs text-slate-400">{a.lien} · {a.telephone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <p className="text-xs text-slate-400 mb-2">Aucun aidant lié</p>
                                <Link href="/aidants/create" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">+ Ajouter un aidant</Link>
                            </div>
                        )}
                    </div>

                    {/* Fiche */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Fiche</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { l: 'Handicap',    v: v.type_handicap       },
                                { l: 'Dépendance',  v: `Niveau ${v.niveau_dependance}/5` },
                                { l: 'Inscription', v: v.inscription         },
                                { l: 'Réservations',v: String(v.reservations)},
                                { l: 'Statut',      v: v.actif ? 'Actif' : 'Inactif' },
                            ].map(item => (
                                <div key={item.l} className="flex items-center justify-between px-5 py-3">
                                    <span className="text-xs text-slate-400 font-medium">{item.l}</span>
                                    <span className="text-sm font-semibold text-slate-900 capitalize">{item.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}