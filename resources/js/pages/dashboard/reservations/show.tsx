import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Reservation {
    id: number; ref: string; initials: string; voyageur: string; hebergement: string;
    date_arrivee: string; date_depart: string; nb_nuits: number;
    statut: 'Confirmée' | 'En attente' | 'Terminée' | 'Annulée';
    montant: string; devise: string; created_at: string; besoins_speciaux?: string;
}
interface Props { reservation: Reservation; }

const STATUT_CONF: Record<string, { badge: string; bar: string; label: string }> = {
    'Confirmée':  { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500',  label: '✓ Confirmée' },
    'En attente': { badge: 'bg-amber-100 text-amber-700 border-amber-200',       bar: 'bg-amber-400',   label: '⏳ En attente' },
    'Terminée':   { badge: 'bg-slate-100 text-slate-600 border-slate-200',       bar: 'bg-slate-400',   label: '✓ Terminée' },
    'Annulée':    { badge: 'bg-red-100 text-red-700 border-red-200',             bar: 'bg-red-400',     label: '✗ Annulée' },
};

export default function ReservationShow({ reservation }: Partial<Props>) {
    const r = reservation ?? {
        id: 1, ref: 'HS-2026-0001', initials: 'KD', voyageur: 'Kofi Diarra',
        hebergement: 'Hôtel Azur Accessible — Dakar', date_arrivee: '12/04/2026',
        date_depart: '18/04/2026', nb_nuits: 6, statut: 'Confirmée' as const,
        montant: '186 000 F', devise: 'XOF', created_at: '01/04/2026',
        besoins_speciaux: 'Fauteuil roulant électrique — nécessite prise 220V en chambre. Régime sans sel strict.',
    };
    const sc = STATUT_CONF[r.statut];

    const timeline = [
        { label: 'Réservation créée', date: r.created_at, done: true },
        { label: 'Confirmation hébergement', date: r.statut !== 'En attente' ? r.created_at : null, done: r.statut === 'Confirmée' || r.statut === 'Terminée' },
        { label: 'Arrivée voyageur', date: r.date_arrivee, done: r.statut === 'Terminée' },
        { label: 'Départ — séjour terminé', date: r.date_depart, done: r.statut === 'Terminée' },
    ];

    return (
        <DashboardLayout title={`Réservation ${r.ref}`} subtitle={r.voyageur}>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/reservations" className="text-slate-400 hover:text-emerald-600 transition-colors">Réservations</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-mono font-semibold">{r.ref}</span>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">

                {/* ── COLONNE PRINCIPALE ── */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Hero */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-start justify-between gap-4 mb-5">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{r.ref}</span>
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${sc.badge}`}>{sc.label}</span>
                                    </div>
                                    <h1 className="text-xl font-black text-slate-900">{r.hebergement}</h1>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-2xl font-black text-slate-900">{r.montant}</p>
                                    <p className="text-xs text-slate-400">{r.devise}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-xs text-slate-400 font-medium mb-1">Arrivée</p>
                                    <p className="text-base font-black text-slate-900">{r.date_arrivee}</p>
                                </div>
                                <div className="text-center p-4 bg-emerald-50 rounded-2xl">
                                    <p className="text-xs text-emerald-600 font-medium mb-1">Durée</p>
                                    <p className="text-2xl font-black text-emerald-600">{r.nb_nuits}</p>
                                    <p className="text-xs text-emerald-500">nuit{r.nb_nuits > 1 ? 's' : ''}</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-xs text-slate-400 font-medium mb-1">Départ</p>
                                    <p className="text-base font-black text-slate-900">{r.date_depart}</p>
                                </div>
                            </div>
                        </div>

                        {/* Voyageur */}
                        <div className="p-6 border-b border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Voyageur</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-base font-black text-violet-700 flex-shrink-0">
                                    {r.initials}
                                </div>
                                <div>
                                    <p className="text-base font-bold text-slate-900">{r.voyageur}</p>
                                    <Link href="/voyageurs/1" className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors font-semibold">
                                        Voir le profil complet →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Besoins spéciaux */}
                        {r.besoins_speciaux && (
                            <div className="p-6">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Besoins spéciaux / Instructions</p>
                                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    <p className="text-sm text-amber-800 leading-relaxed">{r.besoins_speciaux}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Suivi de la réservation</h3>
                        </div>
                        <div className="p-6">
                            <div className="relative">
                                <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-slate-100"/>
                                <div className="space-y-5">
                                    {timeline.map((step, i) => (
                                        <div key={i} className="relative flex items-center gap-4">
                                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                                {step.done ? (
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-slate-400"/>
                                                )}
                                            </div>
                                            <div className="flex-1 flex items-center justify-between">
                                                <p className={`text-sm font-semibold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                                                {step.date && <span className="text-xs text-slate-400 font-medium">{step.date}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── DROITE ── */}
                <div className="space-y-6">

                    {/* Actions statut */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Changer le statut</p>
                        <div className="space-y-2">
                            {r.statut === 'En attente' && (
                                <>
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        Confirmer la réservation
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-500 rounded-xl text-sm font-medium transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                                        Annuler la réservation
                                    </button>
                                </>
                            )}
                            {r.statut === 'Confirmée' && (
                                <>
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                                        Marquer comme terminée
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-500 rounded-xl text-sm font-medium transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                                        Annuler la réservation
                                    </button>
                                </>
                            )}
                            {(r.statut === 'Terminée' || r.statut === 'Annulée') && (
                                <p className="text-xs text-slate-400 text-center py-2 italic">Aucune action disponible</p>
                            )}
                        </div>
                    </div>

                    {/* Récapitulatif */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Récapitulatif</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { l: 'Référence',   v: r.ref,          mono: true },
                                { l: 'Voyageur',    v: r.voyageur },
                                { l: 'Arrivée',     v: r.date_arrivee },
                                { l: 'Départ',      v: r.date_depart },
                                { l: 'Durée',       v: `${r.nb_nuits} nuits` },
                                { l: 'Montant',     v: r.montant,       bold: true },
                                { l: 'Devise',      v: r.devise },
                                { l: 'Créée le',    v: r.created_at },
                            ].map(i => (
                                <div key={i.l} className="flex items-center justify-between px-5 py-3">
                                    <span className="text-xs text-slate-400 font-medium">{i.l}</span>
                                    <span className={`text-sm text-slate-900 ${i.mono ? 'font-mono text-xs' : ''} ${i.bold ? 'font-black' : 'font-semibold'}`}>{i.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Liens rapides */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Liens rapides</p>
                        <Link href="/voyageurs/1" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 hover:text-emerald-600 text-sm font-medium">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            Profil du voyageur
                        </Link>
                        <Link href="/hebergements/1" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 hover:text-emerald-600 text-sm font-medium">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18"/></svg>
                            Fiche hébergement
                        </Link>
                        <Link href="/programme" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 hover:text-emerald-600 text-sm font-medium">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                            Programme du séjour
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}