import { Link } from '@inertiajs/react';
import DashboardLayout from './layout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
    hebergements_certifies:   number;
    reservations_en_cours:    number;
    reservations_ce_mois:     number;
    voyageurs_inscrits:       number;
    professionnels_certifies: number;
    urgences_actives:         number;
    taux_satisfaction:        number;
    certifications_expirees:  number;
}

interface ReservationRecente {
    id:           number;
    initials:     string;
    voyageur:     string;
    hebergement:  string;
    date_arrivee: string;
    date_depart:  string;
    statut:       'Confirmée' | 'En attente' | 'Terminée' | 'Annulée';
    montant:      string;
}

interface UrgenceActive {
    id:           number;
    voyageur:     string;
    localisation: string;
    type:         'medical' | 'securite' | 'autre';
    statut:       'declenche' | 'en_traitement';
    depuis:       string;
}

interface Props {
    stats:                  Stats;
    reservations_recentes:  ReservationRecente[];
    urgences_actives:       UrgenceActive[];
}

// ─── Defaults statiques ───────────────────────────────────────────────────────

const DEFAULT_STATS: Stats = {
    hebergements_certifies:   248,
    reservations_en_cours:    34,
    reservations_ce_mois:     127,
    voyageurs_inscrits:       1842,
    professionnels_certifies: 312,
    urgences_actives:         2,
    taux_satisfaction:        94,
    certifications_expirees:  7,
};

const DEFAULT_RESERVATIONS: ReservationRecente[] = [
    { id: 1, initials: 'KD', voyageur: 'Kofi Diarra',          hebergement: 'Hôtel Azur Accessible — Dakar',          date_arrivee: '12/04/2026', date_depart: '18/04/2026', statut: 'Confirmée',  montant: '186 000 F' },
    { id: 2, initials: 'AM', voyageur: 'Amina Mbaye',           hebergement: 'Résidence PMR Casablanca Centre',         date_arrivee: '15/04/2026', date_depart: '20/04/2026', statut: 'En attente', montant: '94 500 F'  },
    { id: 3, initials: 'JB', voyageur: 'Jean-Baptiste Essomba', hebergement: 'Villa Accessibilité Plus — Abidjan',      date_arrivee: '08/04/2026', date_depart: '14/04/2026', statut: 'Terminée',   montant: '210 000 F' },
    { id: 4, initials: 'FT', voyageur: 'Fatou Touré',           hebergement: 'Hôtel Liberté — Lomé',                   date_arrivee: '20/04/2026', date_depart: '25/04/2026', statut: 'Confirmée',  montant: '78 000 F'  },
    { id: 5, initials: 'ON', voyageur: 'Oumar Ndiaye',          hebergement: 'Appart PMR Nairobi Est',                 date_arrivee: '02/04/2026', date_depart: '07/04/2026', statut: 'Annulée',    montant: '132 000 F' },
    { id: 6, initials: 'SE', voyageur: 'Sophie Eteki',          hebergement: 'Riad Accessible — Marrakech',            date_arrivee: '25/04/2026', date_depart: '30/04/2026', statut: 'En attente', montant: '155 000 F' },
];

const DEFAULT_URGENCES: UrgenceActive[] = [
    { id: 1, voyageur: 'Kofi Diarra',  localisation: 'Dakar, Sénégal',     type: 'medical',  statut: 'en_traitement', depuis: '14 min' },
    { id: 2, voyageur: 'Marie ', localisation: 'Casablanca, Maroc',   type: 'securite', statut: 'declenche',     depuis: '3 min'  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard({
    stats               = DEFAULT_STATS,
    reservations_recentes = DEFAULT_RESERVATIONS,
    urgences_actives    = DEFAULT_URGENCES,
}: Partial<Props>) {

    const s = stats ?? DEFAULT_STATS;

    return (
        <DashboardLayout
            title="Tableau de bord"
            subtitle="Bienvenue sur votre espace hs liberty"
        >
            {/* ── URGENCES BANNER ── */}
            {urgences_actives.length > 0 && (
                <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-700">
                                {urgences_actives.length} urgence{urgences_actives.length > 1 ? 's' : ''} active{urgences_actives.length > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-red-500">
                                {urgences_actives.map(u => u.voyageur).join(' · ')}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/urgences"
                        className="flex-shrink-0 text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-colors"
                    >
                        Gérer →
                    </Link>
                </div>
            )}

            {/* ── KPI CARDS ── */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
                <KpiCard
                    label="Hébergements certifiés"
                    value={s.hebergements_certifies}
                    sub="ISO 21902 · 3 niveaux"
                    icon={<BuildingKpiIcon />}
                    accent="emerald"
                />
                <KpiCard
                    label="Réservations ce mois"
                    value={s.reservations_ce_mois}
                    sub={`${s.reservations_en_cours} en cours`}
                    subUp
                    icon={<CalendarKpiIcon />}
                    accent="sky"
                />
                <KpiCard
                    label="Voyageurs inscrits"
                    value={s.voyageurs_inscrits.toLocaleString('fr-FR')}
                    sub={`${s.professionnels_certifies} professionnels`}
                    subUp
                    icon={<UsersKpiIcon />}
                    accent="violet"
                />
                <KpiCard
                    label="Taux de satisfaction"
                    value={`${s.taux_satisfaction}%`}
                    sub={s.certifications_expirees > 0 ? `${s.certifications_expirees} certif. à renouveler` : 'Certifications à jour'}
                    subUp={s.certifications_expirees === 0}
                    icon={<StarKpiIcon />}
                    accent="amber"
                    progress={s.taux_satisfaction}
                />
            </div>

            {/* ── BODY ── */}
            <div className="grid gap-6 xl:grid-cols-5">

                {/* Réservations récentes — 3 cols */}
                <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Réservations récentes</h2>
                            <p className="text-xs text-slate-400 mt-0.5">{reservations_recentes.length} réservation(s)</p>
                        </div>
                        <Link href="/reservations" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                            Voir tout
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {reservations_recentes.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                            {reservations_recentes.map(r => (
                                <ReservationRow key={r.id} {...r} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">Aucune réservation</p>
                            <p className="text-xs text-slate-400 mb-4">Les réservations apparaîtront ici</p>
                            <Link href="/reservations/create" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/>
                                </svg>
                                Nouvelle réservation
                            </Link>
                        </div>
                    )}
                </div>

                {/* Colonne droite — 2 cols */}
                <div className="xl:col-span-2 flex flex-col gap-6">

                    {/* Urgences actives */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <h2 className="text-sm font-bold text-slate-900">Urgences actives</h2>
                            </div>
                            <Link href="/urgences" className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                                Gérer →
                            </Link>
                        </div>
                        {urgences_actives.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {urgences_actives.map(u => (
                                    <UrgenceRow key={u.id} {...u} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center px-5">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <p className="text-xs font-semibold text-slate-500">Aucune urgence active</p>
                            </div>
                        )}
                    </div>

                    {/* Actions rapides */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h2 className="text-sm font-bold text-slate-900">Actions rapides</h2>
                        </div>
                        <div className="p-3 space-y-1">
                            <QuickAction href="/hebergements/create"  icon={<BuildingKpiIcon />} label="Ajouter un hébergement"     color="bg-emerald-50 text-emerald-600" />
                            <QuickAction href="/reservations/create"  icon={<CalendarKpiIcon />} label="Nouvelle réservation"        color="bg-sky-50 text-sky-600" />
                            <QuickAction href="/certifications"       icon={<BadgeQAIcon />}     label="Voir les certifications"     color="bg-teal-50 text-teal-600" />
                            <QuickAction href="/voyageurs"            icon={<UsersKpiIcon />}    label="Gérer les voyageurs"         color="bg-violet-50 text-violet-600" />
                            <QuickAction href="/professionnels"       icon={<HeartQAIcon />}     label="Professionnels de santé"     color="bg-pink-50 text-pink-600" />
                            <QuickAction href="/rapports"             icon={<ChartQAIcon />}     label="Voir les rapports"           color="bg-amber-50 text-amber-600" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

const accentMap: Record<string, { bg: string; text: string; bar: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500' },
    sky:     { bg: 'bg-sky-50',     text: 'text-sky-600',     bar: 'bg-sky-500'     },
    violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  bar: 'bg-violet-500'  },
    amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   bar: 'bg-amber-500'   },
};

function KpiCard({ label, value, sub, subUp = false, icon, accent = 'emerald', progress }: {
    label: string; value: string | number; sub: string; subUp?: boolean;
    icon: React.ReactNode; accent?: string; progress?: number;
}) {
    const a = accentMap[accent] ?? accentMap.emerald;
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={a.text}>{icon}</span>
                </div>
                {progress !== undefined && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.bg} ${a.text}`}>{progress}%</span>
                )}
            </div>
            <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
            {progress !== undefined && (
                <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${a.bar} transition-all`} style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
            )}
            <p className={`mt-2 text-xs font-medium ${subUp ? 'text-emerald-600' : 'text-slate-400'}`}>{sub}</p>
        </div>
    );
}

// ─── Reservation Row ──────────────────────────────────────────────────────────

function ReservationRow({ initials, voyageur, hebergement, date_arrivee, date_depart, statut, montant }: Omit<ReservationRecente, 'id'>) {
    const statusStyle: Record<string, string> = {
        'Confirmée':  'bg-emerald-50 text-emerald-700 border-emerald-100',
        'En attente': 'bg-amber-50 text-amber-700 border-amber-100',
        'Terminée':   'bg-slate-100 text-slate-500 border-slate-200',
        'Annulée':    'bg-red-50 text-red-600 border-red-100',
    };
    const dotColor: Record<string, string> = {
        'Confirmée':  'bg-emerald-500',
        'En attente': 'bg-amber-500',
        'Terminée':   'bg-slate-400',
        'Annulée':    'bg-red-400',
    };
    return (
        <div className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors group">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-xs font-black text-emerald-700 flex-shrink-0">
                {initials}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                    {voyageur}
                </p>
                <p className="text-xs text-slate-400 truncate">
                    {hebergement} · {date_arrivee} → {date_depart}
                </p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusStyle[statut]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor[statut]}`} />
                    {statut}
                </span>
                <span className="text-xs font-semibold text-slate-500">{montant}</span>
            </div>
        </div>
    );
}

// ─── Urgence Row ──────────────────────────────────────────────────────────────

function UrgenceRow({ voyageur, localisation, type, statut, depuis }: Omit<UrgenceActive, 'id'>) {
    const typeLabel: Record<string, string> = { medical: 'Médical', securite: 'Sécurité', autre: 'Autre' };
    const isNew = statut === 'declenche';
    return (
        <div className={`flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors ${isNew ? 'bg-red-50/50' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isNew ? 'bg-red-500 animate-pulse' : 'bg-orange-100'}`}>
                <svg className={`w-4 h-4 ${isNew ? 'text-white' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{voyageur}</p>
                <p className="text-xs text-slate-400 truncate">{localisation}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isNew ? 'bg-red-100 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                    {typeLabel[type]}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">il y a {depuis}</p>
            </div>
        </div>
    );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────

function QuickAction({ href, icon, label, color }: {
    href: string; icon: React.ReactNode; label: string; color: string;
}) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                {icon}
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
            <svg className="w-4 h-4 text-slate-300 ml-auto group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
        </Link>
    );
}

// ─── Icons (KPI + Quick Actions) ──────────────────────────────────────────────
function BuildingKpiIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h1M9 11h1M9 15h1M14 7h1M14 11h1M14 15h1"/></svg>; }
function CalendarKpiIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function UsersKpiIcon()    { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>; }
function StarKpiIcon()     { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function BadgeQAIcon()     { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>; }
function HeartQAIcon()     { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>; }
function ChartQAIcon()     { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>; }