import { Link, router, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';

interface Props { children: ReactNode; title: string; subtitle?: string; }

export default function PartenaireLayout({ children, title, subtitle }: Props) {
    const { url, props } = usePage<any>();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user     = props.auth?.user;
    const prenom   = user?.prenom ?? user?.name?.split(' ')[0] ?? 'Partenaire';
    const initials = ((user?.prenom?.[0] ?? '?') + (user?.nom?.[0] ?? '')).toUpperCase();

    const nav = [
        { href: '/partenaire',                  label: 'Tableau de bord', icon: <HomeIcon />,    color: 'text-sky-600 bg-sky-50'      },
        { href: '/partenaire/hebergements',     label: 'Mes hébergements',icon: <BuildingIcon />, color: 'text-emerald-600 bg-emerald-50'},
        { href: '/partenaire/disponibilites',   label: 'Disponibilités',  icon: <CalIcon />,     color: 'text-violet-600 bg-violet-50' },
        { href: '/partenaire/profil',           label: 'Mon profil',      icon: <UserIcon />,    color: 'text-amber-600 bg-amber-50'   },
    ];

    const isActive = (path: string) => {
        const cur = url.split('?')[0].replace(/\/$/, '');
        const cln = path.replace(/\/$/, '');
        return cur === cln || (cln !== '/partenaire' && cur.startsWith(cln));
    };

    const SidebarContent = () => (
        <>
            <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100 flex-shrink-0">
                <div className="w-8 h-8 bg-sky-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BuildingIcon />
                </div>
                <div>
                    <p className="text-sm font-black text-slate-900 leading-none">hs liberty</p>
                    <p className="text-[10px] text-sky-600 font-bold uppercase tracking-widest">Espace partenaire</p>
                </div>
            </div>

            <div className="px-4 py-4 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white text-sm font-black flex-shrink-0">{initials}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{prenom}</p>
                        <p className="text-xs text-slate-400">Partenaire hébergement</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {nav.map(item => {
                    const active = isActive(item.href);
                    return (
                        <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                                ${active ? item.color + ' font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                            <span className={`p-1.5 rounded-lg ${active ? item.color : 'text-slate-400'}`}>{item.icon}</span>
                            {item.label}
                            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current"/>}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 pb-4 flex-shrink-0">
                <button onClick={() => router.post('/logout')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                    <LogoutIcon /> Déconnexion
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 fixed inset-y-0 left-0 z-30">
                <SidebarContent />
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}/>
                    <aside className="absolute left-0 inset-y-0 w-72 bg-white flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
                            <p className="text-sm font-black text-slate-900">hs liberty</p>
                            <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-slate-100 h-14 flex items-center justify-between px-4">
                    <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
                    </button>
                    <p className="text-sm font-black text-slate-900">hs liberty · Partenaire</p>
                    <div className="w-9"/>
                </header>

                <div className="px-6 pt-8 pb-2">
                    <h1 className="text-2xl font-black text-slate-900">{title}</h1>
                    {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
                </div>
                <main className="flex-1 px-6 py-6">{children}</main>
            </div>
        </div>
    );
}

function HomeIcon()     { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function BuildingIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h1M9 11h1M9 15h1M14 7h1M14 11h1M14 15h1"/></svg>; }
function CalIcon()      { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function UserIcon()     { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function LogoutIcon()   { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>; }