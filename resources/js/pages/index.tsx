import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Welcome() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeModule, setActiveModule] = useState<number | null>(null);
    const [countDone, setCountDone] = useState(false);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setCountDone(true); },
            { threshold: 0.3 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    const modules = [
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            ),
            num: '01',
            title: 'Hébergements certifiés',
            short: 'Audités sur site, labellisés ISO 21902',
            desc: 'Chaque établissement est inspecté physiquement selon une grille de 40 critères. 3 niveaux de label, renouvelés chaque année. Aucune fiche non vérifiée.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            ),
            num: '02',
            title: 'Professionnels de santé',
            short: 'Réseau certifié à destination',
            desc: 'Infirmiers, kinésithérapeutes, auxiliaires de vie disponibles dans votre ville de séjour. Diplômes vérifiés, agenda en ligne, messagerie sécurisée.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
            ),
            num: '03',
            title: 'Planification sur mesure',
            short: 'Séjour généré selon votre profil médical',
            desc: 'L\'assistant crée votre programme complet : transport adapté, checklist médicale, partage avec vos aidants, rappels automatiques. Mode hors-ligne inclus.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
            ),
            num: '04',
            title: 'Urgence & SOS 24/7',
            short: 'Bouton SOS avec protocole médical',
            desc: 'Géolocalisation instantanée, transmission automatique de votre protocole d\'urgence aux secours locaux, opérateur multilingue disponible en moins de 30 secondes.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
            ),
            num: '05',
            title: 'Espace aidants',
            short: 'Suivi en temps réel du séjour',
            desc: 'Tableau de bord multi-profils, messagerie avec soignants à destination, historique des soins. Vos proches restent informés, à n\'importe quelle distance.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
            ),
            num: '06',
            title: 'Données médicales sécurisées',
            short: 'Chiffrement AES-256, conformité RGPD',
            desc: 'Base dédiée isolée, chiffrement de bout en bout, accès limité aux seuls professionnels autorisés par vous. Audit trail complet, droit à l\'effacement garanti.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
            ),
            num: '07',
            title: 'Application mobile',
            short: 'iOS & Android, mode hors-ligne',
            desc: 'Accès complet sans connexion, traduction temps réel avec les prestataires locaux, notifications push intelligentes. Votre séjour dans votre poche.',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
            ),
            num: '08',
            title: 'Sports & Loisirs',
            short: 'Activités adaptées à destination',
            desc: 'Base de données des équipements sportifs accessibles, événements et compétitions adaptés, guides touristiques avec itinéraires PMR détaillés.',
        },
    ];

    const roles = [
        { letter: 'V', label: 'Voyageur handicapé', desc: 'Moteur · Sensoriel · Cognitif · Polyhandicap', color: 'bg-emerald-600' },
        { letter: 'A', label: 'Aidant familial', desc: 'Suivi · Planning · Communication', color: 'bg-sky-600' },
        { letter: 'S', label: 'Professionnel de santé', desc: 'Agenda · Dossier · Facturation', color: 'bg-violet-600' },
        { letter: 'H', label: 'Partenaire hébergement', desc: 'Fiche · Réservations · Certification', color: 'bg-amber-600' },
        { letter: 'T', label: 'Transporteur adapté', desc: 'Réservations · Disponibilités', color: 'bg-rose-600' },
        { letter: 'I', label: 'Inspecteur auditeur', desc: 'Audit · Label · Rapport', color: 'bg-teal-600' },
        { letter: 'M', label: 'Structure médico-sociale', desc: 'Groupe · Reporting · Admin', color: 'bg-indigo-600' },
        { letter: 'G', label: 'Administrateur', desc: 'Modération · Analytics · Config', color: 'bg-slate-600' },
    ];

    const phases = [
        { year: 'An 1', zone: 'Europe', pays: 'France · Espagne · Italie · Allemagne · UK', target: '5 000 héberg.' },
        { year: 'An 2', zone: 'Amér. Nord', pays: 'États-Unis · Canada', target: '15 000 héberg.' },
        { year: 'An 3', zone: 'Asie', pays: 'Japon · Australie · Singapour', target: '30 000 héberg.' },
        { year: 'An 4', zone: 'Amér. Latine', pays: 'Brésil · Mexique · Argentine', target: '40 000 héberg.' },
        { year: 'An 5', zone: 'Afrique', pays: 'Maroc · Kenya · Sénégal · Afrique du Sud', target: '50 000 héberg.' },
    ];

    return (
        <>
            <Head title="hs liberty — La liberté de voyager pour tous" />

            <div className="min-h-screen bg-white text-slate-900 antialiased">

                {/* ══════════════════════════════════════════
                    NAVBAR
                ══════════════════════════════════════════ */}
                <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
                    <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">

                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-9 h-9 bg-emerald-600 rounded-xl rotate-6 absolute inset-0" />
                                <div className="w-9 h-9 bg-emerald-700 rounded-xl relative flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <span className="font-black text-slate-900 text-lg tracking-tight leading-none">hs liberty</span>
                                <div className="text-[10px] text-emerald-600 font-semibold tracking-widest uppercase leading-none mt-0.5">Voyage accessible</div>
                            </div>
                        </div>

                        {/* Desktop links */}
                        <div className="hidden lg:flex items-center gap-8">
                            {[['Modules', '#modules'], ['Qui en bénéficie', '#roles'], ['Déploiement', '#deploiement']].map(([l, h]) => (
                                <a key={l} href={h} className="text-sm text-slate-500 hover:text-emerald-600 transition-colors font-medium">{l}</a>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-3">
                            <a href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-4 py-2">Se connecter</a>
                            <a href="/login" className="text-sm font-semibold bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors">
                                Demander une démo
                            </a>
                        </div>

                        {/* Mobile burger */}
                        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {menuOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>

                    {/* Mobile menu */}
                    {menuOpen && (
                        <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
                            {[['Modules', '#modules'], ['Qui en bénéficie', '#roles'], ['Déploiement', '#deploiement']].map(([l, h]) => (
                                <a key={l} href={h} onClick={() => setMenuOpen(false)} className="block text-sm text-slate-600 py-2">{l}</a>
                            ))}
                            <a href="#demo" className="block text-sm font-semibold bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-center mt-2">Demander une démo</a>
                        </div>
                    )}
                </nav>

                {/* ══════════════════════════════════════════
                    HERO
                ══════════════════════════════════════════ */}
                <section className="relative min-h-screen flex flex-col overflow-hidden">

                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950" />
                    <div className="absolute inset-0 opacity-30"
                        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.15) 0%, transparent 40%)' }} />
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

                    <div className="relative flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 pt-28 pb-16">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">

                            {/* Left */}
                            <div>
                                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-wide">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Plateforme SaaS internationale · Version 2.0
                                </div>

                                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.02] tracking-tight">
                                    Voyager<br />
                                    <span className="text-emerald-400">librement.</span><br />
                                    <span className="text-white/40 font-light italic text-4xl lg:text-5xl">pour tous.</span>
                                </h1>

                                <p className="mt-8 text-lg text-slate-400 leading-relaxed max-w-lg font-light">
                                    hs liberty connecte les personnes en situation de handicap avec des hébergements certifiés, des soignants qualifiés et une assistance disponible partout dans le monde — 24h/24.
                                </p>

                                <div className="flex flex-wrap gap-4 mt-10">
                                    <a href="#modules" className="group inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-7 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/40">
                                        Découvrir la plateforme
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </a>
                                    <a href="#demo" className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium px-7 py-4 rounded-xl transition-all">
                                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Voir la démo
                                    </a>
                                </div>

                                {/* Trust */}
                                <div className="mt-12 flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {['#059669','#0284c7','#7c3aed','#dc2626'].map((c, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                                                {['V','A','S','H'][i]}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        <span className="text-white font-semibold">8 profils d'utilisateurs</span> · 60 pays cibles · 1M d'utilisateurs visés
                                    </p>
                                </div>
                            </div>

                            {/* Right — Comment ça marche */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-6">Comment ça fonctionne</p>
                                <div className="space-y-0">
                                    {[
                                        { n: '01', t: 'Créez votre profil de mobilité', d: 'Type de handicap, équipements requis, protocole médical. Chiffré AES-256, accessible uniquement à vos soignants autorisés.' },
                                        { n: '02', t: 'Trouvez et réservez en confiance', d: 'Chaque hébergement est audité sur site et certifié ISO 21902. Avis vérifiés par des voyageurs en situation de handicap uniquement.' },
                                        { n: '03', t: 'Voyagez avec un filet de sécurité', d: 'Bouton SOS, traduction en temps réel, professionnel de santé à destination. Vous n\'êtes jamais seul.' },
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-5 py-6 border-b border-white/5 last:border-0">
                                            <div className="text-3xl font-black text-white/10 leading-none min-w-[2.5rem]">{step.n}</div>
                                            <div>
                                                <h3 className="font-semibold text-white mb-1.5">{step.t}</h3>
                                                <p className="text-sm text-slate-400 leading-relaxed font-light">{step.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats bar */}
                    <div ref={statsRef} className="relative border-t border-white/5">
                        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
                            {[
                                { n: '50 000+', l: 'Hébergements certifiés' },
                                { n: '20 000+', l: 'Professionnels de santé' },
                                { n: '200 000', l: 'Utilisateurs actifs / mois' },
                                { n: '60', l: 'Pays couverts' },
                            ].map((s, i) => (
                                <div key={i} className="py-6 px-6 border-r border-white/5 last:border-r-0 first:pl-0">
                                    <div className={`text-2xl font-black text-emerald-400 transition-all duration-700 ${countDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                        style={{ transitionDelay: `${i * 100}ms` }}>
                                        {s.n}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 font-medium">{s.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════
                    TRUST BAR
                ══════════════════════════════════════════ */}
                <div className="bg-slate-50 border-y border-slate-100 py-5 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto flex items-center gap-8 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap shrink-0">Ils nous font confiance</span>
                        <div className="flex gap-10 flex-wrap">
                            {['Université de Douala', 'Ministère Santé', 'EHPAD Maroc', 'Orange CI', 'BancAfrique', 'Centre Rééducation Paris'].map(o => (
                                <span key={o} className="text-sm font-semibold text-slate-300">{o}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════
                    MODULES
                ══════════════════════════════════════════ */}
                <section id="modules" className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-10 border-b border-slate-100">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                                    <span className="w-4 h-px bg-emerald-600" />Modules fonctionnels
                                </p>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                                    8 modules.<br />Un seul voyage serein.
                                </h2>
                            </div>
                            <p className="text-slate-500 max-w-sm leading-relaxed text-base font-light">
                                Chaque module a été pensé pour une personne en situation de handicap — pas adapté après coup.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                            {modules.map((m, i) => (
                                <div
                                    key={i}
                                    className={`bg-white p-7 cursor-pointer transition-all duration-200 ${activeModule === i ? 'bg-emerald-50 ring-2 ring-inset ring-emerald-200' : 'hover:bg-slate-50'}`}
                                    onMouseEnter={() => setActiveModule(i)}
                                    onMouseLeave={() => setActiveModule(null)}
                                >
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors ${activeModule === i ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        {m.icon}
                                    </div>
                                    <div className={`text-xs font-bold tracking-widest mb-2 ${activeModule === i ? 'text-emerald-600' : 'text-slate-300'}`}>{m.num}</div>
                                    <h3 className="font-bold text-slate-900 mb-1.5 text-[15px]">{m.title}</h3>
                                    <p className={`text-sm leading-relaxed transition-all duration-200 ${activeModule === i ? 'text-slate-600' : 'text-slate-400'}`}>
                                        {activeModule === i ? m.desc : m.short}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════
                    ROLES
                ══════════════════════════════════════════ */}
                <section id="roles" className="py-24 px-6 bg-slate-950">
                    <div className="max-w-7xl mx-auto">

                        <div className="grid lg:grid-cols-2 gap-20 items-start">
                            <div className="lg:sticky top-24">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2">
                                    <span className="w-4 h-px bg-emerald-500" />Qui en bénéficie
                                </p>
                                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                                    Une plateforme,<br /><span className="text-emerald-400">8 profils.</span>
                                </h2>
                                <p className="text-slate-400 leading-relaxed text-base font-light mb-10">
                                    Chaque utilisateur dispose d'un espace dédié avec des fonctionnalités adaptées à son rôle. Du voyageur à l'administrateur, personne n'est oublié.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { n: '> 4.6/5', l: 'Satisfaction cible' },
                                        { n: '> 75%', l: 'Taux de complétion' },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                            <div className="text-2xl font-black text-emerald-400">{s.n}</div>
                                            <div className="text-xs text-slate-500 mt-1">{s.l}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {roles.map((r, i) => (
                                    <div key={i} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all cursor-default">
                                        <div className={`w-10 h-10 ${r.color} rounded-xl flex items-center justify-center text-white font-black text-base mb-4`}>
                                            {r.letter}
                                        </div>
                                        <h4 className="font-semibold text-white text-sm mb-1">{r.label}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════
                    DEPLOIEMENT
                ══════════════════════════════════════════ */}
                <section id="deploiement" className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">

                        <div className="text-center mb-16">
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4 flex items-center justify-center gap-2">
                                <span className="w-4 h-px bg-emerald-600" />Déploiement mondial<span className="w-4 h-px bg-emerald-600" />
                            </p>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">5 ans. 5 continents.</h2>
                            <p className="text-slate-500 mt-4 max-w-md mx-auto font-light">Un déploiement progressif pour garantir la qualité sur chaque marché avant de passer au suivant.</p>
                        </div>

                        <div className="relative">
                            {/* Timeline line */}
                            <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-slate-100" />
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {phases.map((p, i) => (
                                    <div key={i} className="relative">
                                        <div className="hidden lg:flex justify-center mb-0 relative">
                                            <div className={`w-4 h-4 rounded-full border-2 relative z-10 ${i === 0 ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-200'}`} />
                                        </div>
                                        <div className={`mt-6 p-6 rounded-2xl border transition-all ${i === 0 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 hover:border-emerald-100 hover:bg-slate-50'}`}>
                                            <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${i === 0 ? 'text-emerald-600' : 'text-slate-400'}`}>{p.year}</div>
                                            <h3 className="font-black text-slate-900 text-lg mb-2">{p.zone}</h3>
                                            <p className="text-xs text-slate-400 leading-relaxed mb-3">{p.pays}</p>
                                            <div className={`text-xs font-semibold ${i === 0 ? 'text-emerald-600' : 'text-slate-400'}`}>{p.target}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════
                    SÉCURITÉ
                ══════════════════════════════════════════ */}
                <section className="py-24 px-6 bg-slate-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2">
                                    <span className="w-4 h-px bg-emerald-600" />Sécurité & Conformité
                                </p>
                                <h2 className="text-4xl font-black text-slate-900 leading-tight mb-6">
                                    Vos données médicales méritent le meilleur niveau de protection.
                                </h2>
                                <p className="text-slate-500 leading-relaxed font-light mb-8">
                                    Les données médicales sont séparées des données commerciales dans une base dédiée. L'accès est limité aux seuls professionnels explicitement autorisés par le voyageur.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        ['Chiffrement AES-256', 'Données médicales chiffrées au repos et en transit'],
                                        ['Conformité RGPD & HIPAA', 'Normes européennes et américaines respectées'],
                                        ['Audit trail complet', 'Chaque accès aux données médicales est tracé'],
                                        ['Droit à l\'effacement', 'Suppression sécurisée garantie sous 30 jours'],
                                    ].map(([t, d], i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 text-sm">{t}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{d}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: '🔐', label: 'AES-256', sub: 'Chiffrement' },
                                    { icon: '🇪🇺', label: 'RGPD', sub: 'Europe' },
                                    { icon: '🏥', label: 'HIPAA', sub: 'USA' },
                                    { icon: '♿', label: 'WCAG 2.1 AA', sub: 'Accessibilité' },
                                    { icon: '🌍', label: 'ISO 21902', sub: 'Tourisme accessible' },
                                    { icon: '⚡', label: '99.9%', sub: 'Disponibilité' },
                                ].map((b, i) => (
                                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-emerald-200 hover:shadow-sm transition-all">
                                        <div className="text-2xl mb-2">{b.icon}</div>
                                        <div className="font-black text-slate-900 text-sm">{b.label}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{b.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════
                    CTA FINAL
                ══════════════════════════════════════════ */}
                <section id="demo" className="py-24 px-6 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <div className="relative bg-slate-950 rounded-3xl overflow-hidden p-14 lg:p-20 text-center">
                            <div className="absolute inset-0 opacity-40"
                                style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.3) 0%, transparent 60%)' }} />
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-wide">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    Accès gratuit · Aucune carte bancaire
                                </div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                                    Prêt à voyager<br /><span className="text-emerald-400">librement ?</span>
                                </h2>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto mb-10 font-light">
                                    Rejoignez la plateforme qui rend le voyage possible pour des millions de personnes en situation de handicap, partout dans le monde.
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-4">
                                    <a href="#" className="group inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/40 text-base">
                                        Rejoindre hs liberty
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </a>
                                    <a href="#" className="inline-flex items-center gap-2 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-8 py-4 rounded-xl transition-all text-base font-medium">
                                        Contacter l'équipe
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════
                    FOOTER
                ══════════════════════════════════════════ */}
                <footer className="border-t border-slate-100 bg-white px-6 py-14">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-5 gap-10 pb-10 border-b border-slate-100">

                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative">
                                        <div className="w-8 h-8 bg-emerald-600 rounded-xl rotate-6 absolute inset-0" />
                                        <div className="w-8 h-8 bg-emerald-700 rounded-xl relative flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-black text-slate-900 text-base">hs liberty</span>
                                        <div className="text-[10px] text-emerald-600 font-semibold tracking-widest uppercase leading-none">Voyage accessible</div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 max-w-xs leading-relaxed font-light">
                                    La liberté de voyager, pour toute personne en situation de handicap ou de dépendance.
                                </p>
                                <div className="flex gap-2 mt-5">
                                    {['RGPD', 'HIPAA', 'ISO 21902', 'WCAG 2.1'].map(b => (
                                        <span key={b} className="text-[10px] font-semibold text-slate-400 border border-slate-200 px-2 py-1 rounded">{b}</span>
                                    ))}
                                </div>
                            </div>

                            {[
                                { h: 'Plateforme', links: ['Modules', 'Certification', 'Application mobile', 'API partenaires'] },
                                { h: 'Utilisateurs', links: ['Voyageurs', 'Aidants', 'Professionnels', 'Partenaires'] },
                                { h: 'Ressources', links: ['Documentation', 'Conformité RGPD', 'Accessibilité', 'Contact'] },
                            ].map(col => (
                                <div key={col.h}>
                                    <h5 className="font-bold text-slate-900 mb-4 text-sm">{col.h}</h5>
                                    <ul className="space-y-2.5">
                                        {col.links.map(l => (
                                            <li key={l}>
                                                <a href="#" className="text-sm text-slate-400 hover:text-emerald-600 transition-colors font-light">{l}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-sm text-slate-400">
                            <p>© 2026 hs liberty. Tous droits réservés.</p>
                            <div className="flex gap-6">
                                {['Confidentialité', 'CGU', 'Cookies'].map(l => (
                                    <a key={l} href="#" className="hover:text-emerald-600 transition-colors">{l}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}