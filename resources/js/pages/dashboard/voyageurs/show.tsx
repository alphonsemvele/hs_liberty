import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Voyageur {
    id: number; initials: string; nom: string; email: string; telephone: string;
    type_handicap: string; niveau_dependance: number; reservations: number;
    inscription: string; actif: boolean;
}
interface ResaItem { ref: string; hebergement: string; dates: string; statut: string; montant: string; }
interface AidantItem { nom: string; lien: string; telephone: string; }
interface Props {
    voyageur: Voyageur;
    reservations: ResaItem[];
    aidants: AidantItem[];
}

const TYPE_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
    moteur:       { bg: 'from-blue-600 to-blue-700',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700' },
    sensoriel:    { bg: 'from-purple-600 to-purple-700', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
    cognitif:     { bg: 'from-orange-600 to-orange-700', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
    polyhandicap: { bg: 'from-red-600 to-red-700',      text: 'text-red-700',    badge: 'bg-red-100 text-red-700' },
    autre:        { bg: 'from-slate-600 to-slate-700',  text: 'text-slate-700',  badge: 'bg-slate-100 text-slate-700' },
};

const STATUT_RESA: Record<string, string> = {
    'Confirmée':  'bg-emerald-50 text-emerald-700 border-emerald-100',
    'En attente': 'bg-amber-50 text-amber-700 border-amber-100',
    'Terminée':   'bg-slate-100 text-slate-500 border-slate-200',
    'Annulée':    'bg-red-50 text-red-600 border-red-100',
};

export default function VoyageurShow({ voyageur, reservations = [], aidants = [] }: Partial<Props>) {
    const v = voyageur ?? {
        id: 1, initials: 'KD', nom: 'Kofi Diarra', email: 'kofi.d@email.com',
        telephone: '+221 77 123 45 67', type_handicap: 'moteur', niveau_dependance: 3,
        reservations: 4, inscription: '10/01/2026', actif: true,
    };
    const tc = TYPE_COLORS[v.type_handicap] ?? TYPE_COLORS.autre;

    return (
        <DashboardLayout title={v.nom} subtitle="Profil voyageur">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/voyageurs" className="text-slate-400 hover:text-emerald-600 transition-colors">Voyageurs</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">{v.nom}</span>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">

                {/* ── GAUCHE ── */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Profile hero */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        {/* Banner */}
                        <div className={`h-28 bg-gradient-to-br ${tc.bg} relative`}>
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }}/>
                        </div>
                        <div className="px-6 pb-6">
                            <div className="flex items-end gap-4 -mt-8 mb-5">
                                <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg bg-violet-700 flex items-center justify-center text-xl font-black text-white">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <a href={`mailto:${v.email}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 hover:border-emerald-100 border border-transparent transition-all group">
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

                    {/* Profil médical */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">Profil médical</h3>
                            </div>
                            <span className="text-xs font-bold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-100">
                                🔒 Accès restreint
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-100 rounded-2xl mb-4">
                                <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                <p className="text-sm text-purple-700">Les données médicales sont chiffrées AES-256. Seuls les professionnels de santé autorisés par le voyageur peuvent y accéder.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { l:'Type de handicap', v: v.type_handicap, colored: true },
                                    { l:'Niveau de dépendance', v:`${v.niveau_dependance}/5` },
                                    { l:'Protocole urgence', v:'✓ Renseigné' },
                                    { l:'Groupe sanguin', v:'Masqué' },
                                    { l:'Allergies', v:'Masqué' },
                                    { l:'Traitements', v:'Masqué' },
                                ].map(item => (
                                    <div key={item.l} className="p-3 bg-slate-50 rounded-xl">
                                        <p className="text-xs text-slate-400 font-medium mb-0.5">{item.l}</p>
                                        <p className={`text-sm font-bold capitalize ${item.colored ? tc.text : 'text-slate-700'}`}>{item.v}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Réservations */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Historique des réservations</h3>
                            <Link href="/reservations" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Voir tout →</Link>
                        </div>
                        {reservations.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {reservations.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-xs font-mono font-semibold text-slate-400">{r.ref}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900">{r.hebergement}</p>
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
                            <div className="py-10 text-center text-sm text-slate-400">Aucune réservation</div>
                        )}
                    </div>
                </div>

                {/* ── DROITE ── */}
                <div className="space-y-6">

                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                        <Link href="/reservations/create" className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/></svg>
                            Créer une réservation
                        </Link>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-600 hover:text-sky-700 rounded-xl text-sm font-medium transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                            Contacter le voyageur
                        </button>
                        <button className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${v.actif ? 'border-red-200 hover:bg-red-50 text-red-500' : 'border-emerald-200 hover:bg-emerald-50 text-emerald-600'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.actif ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"}/></svg>
                            {v.actif ? 'Désactiver le compte' : 'Réactiver le compte'}
                        </button>
                    </div>

                    {/* Aidants */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Aidants liés</h3>
                            <Link href="/aidants" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Gérer →</Link>
                        </div>
                        {aidants.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {aidants.map((a, i) => (
                                    <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                                        <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-xs font-black text-sky-700 flex-shrink-0">
                                            {a.nom.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{a.nom}</p>
                                            <p className="text-xs text-slate-400">{a.lien} · {a.telephone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <p className="text-xs text-slate-400">Aucun aidant lié</p>
                                <button className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">+ Ajouter un aidant</button>
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
                                { l:'Handicap',    v: v.type_handicap },
                                { l:'Dépendance',  v: `Niveau ${v.niveau_dependance}/5` },
                                { l:'Inscription', v: v.inscription },
                                { l:'Réservations',v: String(v.reservations) },
                                { l:'Statut',      v: v.actif ? 'Actif' : 'Inactif' },
                            ].map(i => (
                                <div key={i.l} className="flex items-center justify-between px-5 py-3">
                                    <span className="text-xs text-slate-400 font-medium">{i.l}</span>
                                    <span className="text-sm font-semibold text-slate-900 capitalize">{i.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}