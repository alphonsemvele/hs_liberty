import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Aidant {
    id: number;
    initials: string;
    nom: string;
    email: string;
    telephone: string;
    lien_parente: string;
    voyageur_suivi: string;
    voyageur_id: number;
    niveau_acces: 'lecture' | 'ecriture' | 'urgence';
    actif_depuis: string;
    sejours_suivis: number;
}

interface SejourSuivi {
    ref: string;
    destination: string;
    dates: string;
    statut: 'Terminé' | 'En cours' | 'À venir';
    urgences: number;
}

interface Props {
    aidant: Aidant;
    sejours: SejourSuivi[];
}

// ── Données statiques par défaut ─────────────────────────────────
const DEFAUT_AIDANT: Aidant = {
    id: 1,
    initials: 'AD',
    nom: 'Adja Diarra',
    email: 'adja.d@email.com',
    telephone: '+221 77 987 65 43',
    lien_parente: 'Épouse',
    voyageur_suivi: 'Kofi Diarra',
    voyageur_id: 1,
    niveau_acces: 'ecriture',
    actif_depuis: '10/01/2026',
    sejours_suivis: 4,
};

const DEFAUT_SEJOURS: SejourSuivi[] = [
    { ref: 'HS-2026-0001', destination: 'Hôtel Azur Accessible — Dakar',     dates: '12–18 avr 2026', statut: 'Terminé',  urgences: 0 },
    { ref: 'HS-2026-0007', destination: 'Hôtel Grand Confort PMR — Accra',   dates: '01–07 mai 2026', statut: 'En cours', urgences: 0 },
    { ref: 'HS-2026-0012', destination: 'Résidence PMR Casablanca Centre',   dates: '15–20 juin 2026',statut: 'À venir',  urgences: 0 },
    { ref: 'HS-2026-0003', destination: 'Villa Accessibilité Plus — Abidjan',dates: '08–14 avr 2026', statut: 'Terminé',  urgences: 0 },
];

// ── Config niveaux d'accès ───────────────────────────────────────
const NIVEAU_CONF = {
    ecriture: {
        label:       'Écriture',
        desc:        'Peut consulter et modifier le programme de séjour, la checklist, et contacter les professionnels de santé.',
        badge:       'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon_bg:     'bg-emerald-500',
        dot:         'bg-emerald-500',
        permissions: [
            { label: 'Consulter le programme séjour',         ok: true  },
            { label: 'Modifier la checklist de préparation',  ok: true  },
            { label: 'Contacter les professionnels de santé', ok: true  },
            { label: 'Voir le profil médical complet',        ok: false },
            { label: 'Accès protocole urgence',               ok: false },
        ],
    },
    lecture: {
        label:       'Lecture seule',
        desc:        'Peut uniquement consulter le programme de séjour et l\'historique des interventions. Aucune modification possible.',
        badge:       'bg-sky-50 text-sky-700 border-sky-200',
        icon_bg:     'bg-sky-500',
        dot:         'bg-sky-400',
        permissions: [
            { label: 'Consulter le programme séjour',         ok: true  },
            { label: 'Modifier la checklist de préparation',  ok: false },
            { label: 'Contacter les professionnels de santé', ok: false },
            { label: 'Voir le profil médical complet',        ok: false },
            { label: 'Accès protocole urgence',               ok: false },
        ],
    },
    urgence: {
        label:       'Urgence uniquement',
        desc:        'Accès exclusivement au protocole médical d\'urgence. Aucune autre donnée n\'est accessible.',
        badge:       'bg-red-50 text-red-600 border-red-200',
        icon_bg:     'bg-red-500',
        dot:         'bg-red-400',
        permissions: [
            { label: 'Consulter le programme séjour',         ok: false },
            { label: 'Modifier la checklist de préparation',  ok: false },
            { label: 'Contacter les professionnels de santé', ok: false },
            { label: 'Voir le profil médical complet',        ok: false },
            { label: 'Accès protocole urgence',               ok: true  },
        ],
    },
};

const STATUT_BADGE: Record<string, string> = {
    'En cours': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Terminé':  'bg-slate-100 text-slate-500 border-slate-200',
    'À venir':  'bg-sky-50 text-sky-700 border-sky-100',
};

const BANNIERES: Record<string, string> = {
    ecriture: 'from-emerald-700 via-emerald-600 to-teal-600',
    lecture:  'from-sky-700 via-sky-600 to-blue-600',
    urgence:  'from-red-700 via-red-600 to-orange-600',
};

export default function AidantShow({ aidant = DEFAUT_AIDANT, sejours = DEFAUT_SEJOURS }: Partial<Props>) {
    const a   = aidant ?? DEFAUT_AIDANT;
    const cfg = NIVEAU_CONF[a.niveau_acces];

    return (
        <DashboardLayout title={a.nom} subtitle="Profil aidant">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/aidants" className="text-slate-400 hover:text-emerald-600 transition-colors">
                    Aidants
                </Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                <span className="text-slate-600 font-medium">{a.nom}</span>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">

                {/* ══════════════════════════════════════════
                    COLONNE PRINCIPALE
                ══════════════════════════════════════════ */}
                <div className="xl:col-span-2 space-y-6">

                    {/* ── Carte profil ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">

                        {/* Bannière couleur selon niveau */}
                        <div className={`h-28 bg-gradient-to-br ${BANNIERES[a.niveau_acces]} relative`}>
                            <div className="absolute inset-0 opacity-10"
                                style={{ backgroundImage: 'radial-gradient(circle at 80% 40%, white 0%, transparent 55%), radial-gradient(circle at 10% 80%, white 0%, transparent 40%)' }}
                            />
                            {/* Niveau badge dans la bannière */}
                            <div className="absolute bottom-3 right-4">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 text-white border border-white/30`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"/>
                                    Accès {cfg.label}
                                </span>
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            {/* Avatar + identité */}
                            <div className="flex items-end gap-4 -mt-8 mb-5">
                                <div className={`w-16 h-16 rounded-2xl ${cfg.icon_bg} border-4 border-white shadow-lg flex items-center justify-center text-xl font-black text-white flex-shrink-0`}>
                                    {a.initials}
                                </div>
                                <div className="mb-1">
                                    <h1 className="text-xl font-black text-slate-900">{a.nom}</h1>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {a.lien_parente} de{' '}
                                        <Link
                                            href={`/voyageurs/${a.voyageur_id}`}
                                            className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors"
                                        >
                                            {a.voyageur_suivi}
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Stats rapides */}
                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-2xl font-black text-slate-900">{a.sejours_suivis}</p>
                                    <p className="text-xs text-slate-400 mt-1">Séjours suivis</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-sm font-black text-slate-900">{a.actif_depuis}</p>
                                    <p className="text-xs text-slate-400 mt-1">Aidant depuis</p>
                                </div>
                                <div className={`text-center p-4 rounded-2xl ${cfg.badge}`}>
                                    <p className="text-sm font-black">{cfg.label}</p>
                                    <p className="text-xs opacity-70 mt-1">Niveau d'accès</p>
                                </div>
                            </div>

                            {/* Contacts */}
                            <div className="grid md:grid-cols-2 gap-3">
                                <a href={`mailto:${a.email}`}
                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all group">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-200">
                                        <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Email</p>
                                        <p className="text-sm text-slate-700 group-hover:text-emerald-700 truncate">{a.email}</p>
                                    </div>
                                </a>
                                <a href={`tel:${a.telephone}`}
                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all group">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-200">
                                        <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Téléphone</p>
                                        <p className="text-sm text-slate-700 group-hover:text-emerald-700">{a.telephone}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ── Niveau d'accès détaillé ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl ${cfg.icon_bg} flex items-center justify-center`}>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Niveau d'accès — {cfg.label}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">{cfg.desc}</p>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {cfg.permissions.map((perm, i) => (
                                <div key={i} className="flex items-center justify-between px-6 py-3.5">
                                    <span className={`text-sm ${perm.ok ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                                        {perm.label}
                                    </span>
                                    {perm.ok ? (
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Séjours suivis ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Séjours suivis</h3>
                                <p className="text-xs text-slate-400 mt-0.5">{sejours.length} séjour(s) au total</p>
                            </div>
                            <Link href="/reservations" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                Voir tout →
                            </Link>
                        </div>

                        {sejours.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {sejours.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group">
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[10px] font-mono font-semibold text-slate-400">{s.ref}</span>
                                                {s.urgences > 0 && (
                                                    <span className="text-[10px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">
                                                        {s.urgences} urgence
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                                {s.destination}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">{s.dates}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${STATUT_BADGE[s.statut] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {s.statut}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center">
                                <p className="text-sm text-slate-400">Aucun séjour suivi pour l'instant</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ══════════════════════════════════════════
                    COLONNE DROITE
                ══════════════════════════════════════════ */}
                <div className="space-y-6">

                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                                Modifier le niveau d'accès
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-600 hover:text-sky-700 rounded-xl text-sm font-medium transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                </svg>
                                Envoyer un message
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-xl text-sm font-medium transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                                </svg>
                                Révoquer les accès
                            </button>
                        </div>
                    </div>

                    {/* Fiche récap */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Fiche</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { l: 'Lien familial',    v: a.lien_parente },
                                { l: 'Voyageur suivi',   v: a.voyageur_suivi },
                                { l: 'Niveau d\'accès',  v: cfg.label },
                                { l: 'Aidant depuis',    v: a.actif_depuis },
                                { l: 'Séjours suivis',   v: String(a.sejours_suivis) },
                            ].map(item => (
                                <div key={item.l} className="flex items-center justify-between px-5 py-3">
                                    <span className="text-xs text-slate-400 font-medium">{item.l}</span>
                                    <span className="text-sm font-semibold text-slate-900">{item.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Zone RGPD */}
                    <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
                        <div className="flex items-start gap-2.5 mb-3">
                            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Consentement RGPD</p>
                        </div>
                        <p className="text-xs text-amber-600 mb-3 leading-relaxed">
                            Cet aidant a reçu une invitation et y a explicitement consenti. Le voyageur peut révoquer cet accès à tout moment.
                        </p>
                        <p className="text-xs text-amber-500">Consentement donné le {a.actif_depuis}</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}