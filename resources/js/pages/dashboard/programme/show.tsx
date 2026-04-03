import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';

interface Etape {
    ordre: number; type: 'transport' | 'hebergement' | 'loisir' | 'soin' | 'autre';
    titre: string; heure: string; details: string;
}
interface CheckItem { item: string; fait: boolean; }
interface Programme {
    id: number; titre: string; voyageur: string; destination: string;
    date_debut: string; date_fin: string; statut: string;
    partage_aidants: boolean; etapes: Etape[]; checklist: CheckItem[];
}
interface Props { programme: Programme; }

const TYPE_STYLE: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    transport:    { bg: 'bg-sky-100',    text: 'text-sky-700',    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> },
    hebergement:  { bg: 'bg-emerald-100',text: 'text-emerald-700',icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18"/></svg> },
    loisir:       { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    soin:         { bg: 'bg-pink-100',   text: 'text-pink-700',   icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg> },
    autre:        { bg: 'bg-slate-100',  text: 'text-slate-600',  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
};

const STATUT: Record<string, string> = {
    en_cours: 'bg-emerald-100 text-emerald-700',
    a_venir:  'bg-sky-100 text-sky-700',
    termine:  'bg-slate-100 text-slate-500',
};

const STATUT_LABEL: Record<string, string> = {
    en_cours: 'En cours', a_venir: 'À venir', termine: 'Terminé',
};

export default function ProgrammeShow({ programme }: Partial<Props>) {
    const prog = programme ?? {
        id: 1, titre: 'Séjour détente Dakar', voyageur: 'Kofi Diarra',
        destination: 'Dakar, Sénégal', date_debut: '12/04/2026', date_fin: '18/04/2026',
        statut: 'en_cours', partage_aidants: true,
        etapes: [
            { ordre:1, type:'transport',   titre:'Vol Douala → Dakar',        heure:'08:00', details:'Air Sénégal — Siège accessible' },
            { ordre:2, type:'hebergement', titre:'Check-in Hôtel Azur',         heure:'14:00', details:'Chambre PMR niveau 2' },
            { ordre:3, type:'loisir',      titre:'Visite île de Gorée',         heure:'10:00', details:'Itinéraire PMR disponible' },
            { ordre:4, type:'soin',        titre:'Séance kinésithérapie',       heure:'16:00', details:'Dr. Fatima Sow — sur site' },
            { ordre:5, type:'transport',   titre:'Retour Douala',               heure:'11:00', details:'Vol Air Sénégal' },
        ],
        checklist: [
            { item:'Ordonnances et médicaments', fait:true },
            { item:'Fauteuil roulant de voyage',  fait:true },
            { item:'Assurance rapatriement',      fait:false },
            { item:'Contact médecin local',       fait:true },
            { item:'Numéro SOS enregistré',       fait:false },
        ],
    };

    const checkFait  = prog.checklist.filter(c => c.fait).length;
    const checkTotal = prog.checklist.length;
    const pct = Math.round((checkFait / checkTotal) * 100);

    return (
        <DashboardLayout title={prog.titre} subtitle={`Programme de ${prog.voyageur}`}>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/programme" className="text-slate-400 hover:text-emerald-600 transition-colors">Programmes</Link>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-slate-600 font-medium">{prog.titre}</span>
            </div>

            {/* Header info */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-black text-slate-900">{prog.titre}</h1>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUT[prog.statut]}`}>{STATUT_LABEL[prog.statut]}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                {prog.voyageur}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                {prog.destination}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                {prog.date_debut} → {prog.date_fin}
                            </span>
                            {prog.partage_aidants && (
                                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    Partagé avec aidants
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-xl hover:border-slate-300 text-slate-600 transition-all">
                            Modifier
                        </button>
                        <button className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors">
                            Télécharger PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">

                {/* ── TIMELINE ── */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Programme du séjour</h3>
                            <span className="text-xs text-slate-400">{prog.etapes.length} étapes</span>
                        </div>
                        <div className="p-6">
                            <div className="relative">
                                {/* Ligne verticale */}
                                <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-slate-100" />

                                <div className="space-y-4">
                                    {prog.etapes.map((e, i) => {
                                        const ts = TYPE_STYLE[e.type];
                                        return (
                                            <div key={i} className="relative flex gap-4">
                                                {/* Dot */}
                                                <div className={`relative z-10 w-11 h-11 rounded-2xl ${ts.bg} flex items-center justify-center flex-shrink-0 ${ts.text}`}>
                                                    {ts.icon}
                                                </div>
                                                {/* Content */}
                                                <div className={`flex-1 p-4 rounded-2xl border transition-all hover:shadow-sm ${prog.statut === 'en_cours' && i === 1 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-black text-slate-300 tracking-widest">ÉTAPE {e.ordre}</span>
                                                            {prog.statut === 'en_cours' && i === 1 && (
                                                                <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full animate-pulse">EN COURS</span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-lg flex-shrink-0">{e.heure}</span>
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 mb-1">{e.titre}</h4>
                                                    <p className="text-sm text-slate-500">{e.details}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── DROITE ── */}
                <div className="space-y-6">

                    {/* Checklist */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-slate-900">Checklist de préparation</h3>
                                <span className="text-xs font-bold text-slate-500">{checkFait}/{checkTotal}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${pct}%` }}/>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {prog.checklist.map((c, i) => (
                                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${c.fait ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                        {c.fait && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                    </div>
                                    <span className={`text-sm ${c.fait ? 'text-slate-500 line-through' : 'text-slate-900 font-medium'}`}>{c.item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-100">
                            <button className="w-full text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                + Ajouter un élément
                            </button>
                        </div>
                    </div>

                    {/* Légende types */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Types d'étapes</p>
                        <div className="space-y-2">
                            {Object.entries(TYPE_STYLE).filter(([k]) => k !== 'autre').map(([type, ts]) => (
                                <div key={type} className="flex items-center gap-3">
                                    <div className={`w-7 h-7 rounded-lg ${ts.bg} ${ts.text} flex items-center justify-center flex-shrink-0`}>{ts.icon}</div>
                                    <span className="text-sm text-slate-600 capitalize">{type}</span>
                                    <span className="text-xs text-slate-400 ml-auto">{prog.etapes.filter(e => e.type === type).length}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                            Ajouter une étape
                        </button>
                        <button className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${prog.partage_aidants ? 'border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-500' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {prog.partage_aidants ? 'Arrêter le partage' : 'Partager avec aidants'}
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}