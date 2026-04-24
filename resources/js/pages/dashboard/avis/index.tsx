import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Avis {
    id: number;
    initials: string;
    voyageur: string;
    hebergement: string;
    note_globale: number;
    note_accessibilite: number;
    note_equipements: number;
    commentaire: string;
    date: string;
    verifie: boolean;
    reponse_partenaire: string | null;
}

interface Stats {
    total: number;
    note_moyenne: number;
    taux_5_etoiles: number;
    en_attente_moderation: number;
    avis_ce_mois: number;
}

interface Props { avis: Avis[]; stats: Stats; }

const DEFAUT_AVIS: Avis[] = [
    { id:1, initials:'KD', voyageur:'Kofi Diarra',           hebergement:'Hôtel Azur Accessible — Dakar',        note_globale:5, note_accessibilite:5, note_equipements:4, commentaire:'Parfait pour mon fauteuil roulant. Personnel formé et très attentionné. Je recommande vivement.',                           date:'18/04/2026', verifie:true,  reponse_partenaire:'Merci infiniment Kofi, c\'est notre priorité !' },
    { id:2, initials:'AM', voyageur:'Amina Mbaye',            hebergement:'Résidence PMR Casablanca Centre',       note_globale:4, note_accessibilite:4, note_equipements:4, commentaire:'Très bon séjour, quelques détails à améliorer dans la salle de bain mais l\'ensemble est excellent.',                 date:'21/04/2026', verifie:true,  reponse_partenaire:null },
    { id:3, initials:'JB', voyageur:'Jean-Baptiste Essomba',  hebergement:'Villa Accessibilité Plus — Abidjan',    note_globale:4, note_accessibilite:3, note_equipements:4, commentaire:'Bien dans l\'ensemble, mais l\'ascenseur était en panne un jour. Sinon tout était très bien organisé.',              date:'14/04/2026', verifie:true,  reponse_partenaire:'Nous nous excusons pour l\'ascenseur, problème résolu.' },
    { id:4, initials:'FT', voyageur:'Fatou Touré',            hebergement:'Hôtel Liberté — Lomé',                  note_globale:5, note_accessibilite:5, note_equipements:5, commentaire:'Le meilleur hôtel accessible que j\'ai jamais visité. Tout était parfait, du parking à la chambre.',                  date:'26/04/2026', verifie:true,  reponse_partenaire:null },
    { id:5, initials:'SE', voyageur:'Sophie Eteki',           hebergement:'Riad Accessible — Marrakech',           note_globale:3, note_accessibilite:3, note_equipements:3, commentaire:'Correct mais pas au niveau annoncé. La rampe d\'accès était trop raide pour mon fauteuil électrique.',               date:'02/05/2026', verifie:true,  reponse_partenaire:null },
    { id:6, initials:'ON', voyageur:'Oumar Ndiaye',           hebergement:'Appart PMR Nairobi Est',                 note_globale:4, note_accessibilite:4, note_equipements:3, commentaire:'Bon rapport qualité prix. La barre d\'appui de la douche était bien positionnée. Manque de lève-personne.',           date:'08/05/2026', verifie:true,  reponse_partenaire:null },
];

const DEFAUT_STATS: Stats = { total:6, note_moyenne:4.2, taux_5_etoiles:33, en_attente_moderation:0, avis_ce_mois:6 };

function Stars({ n, size = 'sm' }: { n: number; size?: 'sm' | 'md' }) {
    return (
        <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
                <svg key={i} className={`${size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} ${i <= n ? 'text-amber-400 fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            ))}
        </div>
    );
}

export default function AvisIndex({ avis = DEFAUT_AVIS, stats = DEFAUT_STATS }: Partial<Props>) {
    return (
        <DashboardLayout title="Avis & Notations" subtitle="Évaluations vérifiées par les voyageurs">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {[
                    { label: 'Total avis',          value: stats.total,                    color: 'text-slate-900' },
                    { label: 'Note moyenne',         value: `${stats.note_moyenne}/5`,      color: 'text-amber-500' },
                    { label: 'Avis 5 étoiles',       value: `${stats.taux_5_etoiles}%`,    color: 'text-emerald-600' },
                    { label: 'Ce mois',              value: stats.avis_ce_mois,             color: 'text-sky-600' },
                    { label: 'En modération',        value: stats.en_attente_moderation,    color: stats.en_attente_moderation > 0 ? 'text-red-500' : 'text-slate-400' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Barre visuelle note globale */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Note globale plateforme</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-slate-900">{stats.note_moyenne}</span>
                        <Stars n={Math.round(stats.note_moyenne)} size="md" />
                    </div>
                </div>
                <div className="space-y-2">
                    {[
                        { label: 'Accessibilité', note: 4.3 },
                        { label: 'Équipements',   note: 4.0 },
                        { label: 'Accueil',       note: 4.5 },
                    ].map(item => (
                        <div key={item.label} className="flex items-center gap-4">
                            <span className="text-xs text-slate-500 w-24">{item.label}</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(item.note / 5) * 100}%` }}/>
                            </div>
                            <span className="text-xs font-bold text-slate-700 w-8">{item.note}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input placeholder="Hébergement, voyageur…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-400 w-56"/>
                </div>
                <div className="flex gap-1.5">
                    {['Tous', '5 ★', '4 ★', '3 ★ et -'].map(f => (
                        <button key={f} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${f === 'Tous' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <label className="flex items-center gap-2 ml-auto cursor-pointer">
                    <div className="w-4 h-4 rounded border-2 border-emerald-400 bg-emerald-400 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Séjours vérifiés uniquement</span>
                </label>
            </div>

            {/* Liste des avis */}
            <div className="space-y-4">
                {avis.map(a => (
                    <div key={a.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-emerald-100 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                {/* Avatar */}
                                <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-sm font-black text-emerald-700 flex-shrink-0">
                                    {a.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    {/* Header */}
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <p className="text-sm font-bold text-slate-900">{a.voyageur}</p>
                                        {a.verifie && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                Séjour vérifié
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mb-3">{a.hebergement} · {a.date}</p>

                                    {/* Notes */}
                                    <div className="flex flex-wrap gap-4 mb-3">
                                        {[
                                            { label: 'Global',         note: a.note_globale },
                                            { label: 'Accessibilité',  note: a.note_accessibilite },
                                            { label: 'Équipements',    note: a.note_equipements },
                                        ].map(n => (
                                            <div key={n.label}>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">{n.label}</p>
                                                <div className="flex items-center gap-1.5">
                                                    <Stars n={n.note} />
                                                    <span className="text-xs font-bold text-slate-600">{n.note}/5</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Commentaire */}
                                    <p className="text-sm text-slate-600 leading-relaxed italic">"{a.commentaire}"</p>

                                    {/* Réponse partenaire */}
                                    {a.reponse_partenaire && (
                                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Réponse du partenaire</p>
                                            <p className="text-xs text-slate-600 italic">{a.reponse_partenaire}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 flex-shrink-0">
                                {!a.reponse_partenaire && (
                                    <button className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors whitespace-nowrap">
                                        Répondre
                                    </button>
                                )}
                                <button className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}