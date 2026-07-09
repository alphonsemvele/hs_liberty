import { Link, router, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { useForm } from '@inertiajs/react';

interface Props { children: ReactNode; title: string; subtitle?: string; }

export default function VoyageurLayout({ children, title, subtitle }: Props) {
    const { url, props } = usePage<any>();
    const [sosOpen, setSosOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = props.auth?.user;
    const prenom = user?.prenom ?? user?.name?.split(' ')[0] ?? 'Voyageur';
    const nom    = user?.nom ?? '';
    const initials = ((user?.prenom?.[0] ?? '?') + (user?.nom?.[0] ?? '')).toUpperCase();

    const nav = [
        { href: '/mon-espace',               label: 'Mon espace',   icon: <HomeIcon />, color: 'text-emerald-600 bg-emerald-50'  },
        { href: '/mon-espace/reservations',  label: 'Réservations', icon: <CalIcon />,  color: 'text-sky-600 bg-sky-50'          },
        { href: '/mon-espace/programmes',    label: 'Programmes',   icon: <MapIcon />,  color: 'text-violet-600 bg-violet-50'    },
        { href: '/mon-espace/profil',        label: 'Mon profil',   icon: <UserIcon />, color: 'text-amber-600 bg-amber-50'      },
    ];

    const isActive = (path: string) => {
        const cur = url.split('?')[0].replace(/\/$/, '');
        const cln = path.replace(/\/$/, '');
        return cur === cln || (cln !== '/mon-espace' && cur.startsWith(cln));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* ── Sidebar desktop ── */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 fixed inset-y-0 left-0 z-30">

                {/* Logo */}
                <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100">
                    <div className="w-8 h-8 bg-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-900 leading-none">hs liberty</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Espace voyageur</p>
                    </div>
                </div>

                {/* Profil utilisateur */}
                <div className="px-4 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{prenom} {nom}</p>
                            <p className="text-xs text-slate-400">Voyageur</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {nav.map(item => {
                        const active = isActive(item.href);
                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                                    ${active
                                        ? item.color + ' font-bold'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}>
                                <span className={`p-1.5 rounded-lg ${active ? item.color : 'text-slate-400'}`}>{item.icon}</span>
                                {item.label}
                                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current"/>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bouton SOS */}
                <div className="px-4 py-3 border-t border-slate-100">
                    <button onClick={() => setSosOpen(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-black rounded-2xl transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        🚨 Urgence SOS
                    </button>
                </div>

                {/* Déconnexion */}
                <div className="px-4 pb-4">
                    <button
                        onClick={() => router.post('/logout')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* ── Overlay sidebar mobile ── */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}/>
                    <aside className="absolute left-0 inset-y-0 w-72 bg-white flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-700 rounded-xl flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                </div>
                                <p className="text-sm font-black text-slate-900">hs liberty</p>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <nav className="flex-1 px-3 py-4 space-y-1">
                            {nav.map(item => {
                                const active = isActive(item.href);
                                return (
                                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                                            ${active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                                        <span className={active ? 'text-emerald-600' : 'text-slate-400'}>{item.icon}</span>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="px-4 py-3 border-t border-slate-100 space-y-2">
                            <button onClick={() => setSosOpen(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white text-sm font-black rounded-2xl">
                                🚨 Urgence SOS
                            </button>
                            <button onClick={() => router.post('/logout')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                Déconnexion
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* ── Contenu principal ── */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

                {/* Header mobile */}
                <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-slate-100 h-14 flex items-center justify-between px-4">
                    <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
                    </button>
                    <p className="text-sm font-black text-slate-900">hs liberty</p>
                    <button onClick={() => setSosOpen(true)}
                        className="flex items-center gap-1 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-xl">
                        🚨 SOS
                    </button>
                </header>

                {/* Page title */}
                <div className="px-6 pt-8 pb-2">
                    <h1 className="text-2xl font-black text-slate-900">{title}</h1>
                    {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
                </div>

                {/* Content */}
                <main className="flex-1 px-6 py-6">
                    {children}
                </main>
            </div>

            {/* ── Modal SOS ── */}
            {sosOpen && <SosModal onClose={() => setSosOpen(false)} />}
        </div>
    );
}

// ── Modal SOS ─────────────────────────────────────────────────────────────────
function SosModal({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing } = useForm({
        type_urgence: 'medical',
        description:  '',
        latitude:     '',
        longitude:    '',
    });
    const [sent, setSent] = useState(false);

    const handleSos = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                setData(d => ({ ...d, latitude: String(pos.coords.latitude), longitude: String(pos.coords.longitude) }));
            }, () => {});
        }
        post('/mon-espace/sos', { onSuccess: () => setSent(true) });
    };

    if (sent) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                </div>
                <p className="text-lg font-black text-slate-900 mb-2">Alerte envoyée !</p>
                <p className="text-sm text-slate-500 mb-6">L'équipe hs liberty a été notifiée et va intervenir immédiatement.</p>
                <button onClick={onClose} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-2xl">Fermer</button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="bg-red-500 px-6 py-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                    <div>
                        <p className="text-lg font-black text-white">Urgence SOS</p>
                        <p className="text-xs text-red-100">Déclenchez une alerte immédiate</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Type d'urgence</p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { val:'medical',  label:'Médical',  icon:'🏥' },
                                { val:'securite', label:'Sécurité', icon:'🔒' },
                                { val:'accident', label:'Accident', icon:'⚠️' },
                                { val:'autre',    label:'Autre',    icon:'📢' },
                            ].map(t => (
                                <label key={t.val} className={`flex items-center gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all ${data.type_urgence === t.val ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}>
                                    <input type="radio" name="type" value={t.val} checked={data.type_urgence === t.val} onChange={e => setData('type_urgence', e.target.value)} className="sr-only"/>
                                    <span className="text-lg">{t.icon}</span>
                                    <span className="text-sm font-semibold text-slate-700">{t.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description (optionnel)</p>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                            rows={3} placeholder="Décrivez la situation…"
                            className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-red-300"/>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-2xl text-sm hover:bg-slate-50">Annuler</button>
                        <button onClick={handleSos} disabled={processing}
                            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                            🚨 ENVOYER SOS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HomeIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline strokeLinecap="round" strokeLinejoin="round" points="9 22 9 12 15 12 15 22"/></svg>; }
function CalIcon()  { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function MapIcon()  { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>; }
function UserIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }