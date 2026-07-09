import { Head, Link, usePage, router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface DashboardLayoutProps { children: ReactNode; title: string; subtitle?: string; }

interface User { id: number; name?: string | null; prenom?: string | null; nom?: string | null; email: string; role?: string; }

interface PageProps extends InertiaPageProps { auth: { user: User }; }

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
    const { url, props } = usePage<PageProps>();
    const { auth } = props;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path: string) => {
        const current = url.split('?')[0].replace(/\/$/, '');
        const clean   = path.replace(/\/$/, '');
        const exactRoutes = [
            '/dashboard', '/hebergements', '/hebergements/create',
            '/reservations', '/voyageurs', '/professionnels',
            '/certifications', '/urgences', '/aidants',
            '/transports', '/avis', '/programme', '/rapports', '/parametres',
        ];
        if (exactRoutes.includes(clean)) return current === clean;
        return current === clean || current.startsWith(clean + '/');
    };

    const handleLogout = () => router.post('/logout');

    // ── Null-safe : accepte name null/undefined ─────────────────
    const getDisplayName = (user: User): string => {
        if (user.name) return user.name;
        const full = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim();
        return full || 'Utilisateur';
    };

    const getInitials = (user: User): string => {
        const name = getDisplayName(user);
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
    };

    const navItems = [
        {
            section: null,
            links: [{ href: '/dashboard', label: 'Tableau de bord', icon: <HomeIcon /> }],
        },
        {
            section: 'Hébergement',
            links: [
                { href: '/hebergements',        label: 'Hébergements',     icon: <BuildingIcon /> },
                { href: '/hebergements/create',  label: 'Ajouter',          icon: <PlusCircleIcon /> },
                { href: '/avis',                 label: 'Avis & Notations', icon: <StarIcon /> },
            ],
        },
        {
            section: 'Voyageurs',
            links: [
                { href: '/reservations', label: 'Réservations',      icon: <CalendarIcon /> },
                { href: '/voyageurs',    label: 'Voyageurs',          icon: <UserIcon /> },
                { href: '/aidants',      label: 'Aidants',            icon: <UsersIcon /> },
                { href: '/programme',    label: 'Programmes séjour',  icon: <MapIcon /> },
            ],
        },
        {
            section: 'Services',
            links: [
                { href: '/professionnels', label: 'Professionnels santé', icon: <HeartIcon /> },
                { href: '/transports',     label: 'Transports adaptés',   icon: <TruckIcon /> },
                { href: '/urgences',       label: 'Urgences & SOS',        icon: <AlertIcon />, danger: true },
            ],
        },
        {
            section: 'Gestion',
            links: [
                { href: '/rapports',   label: 'Rapports',   icon: <ChartIcon /> },
                { href: '/parametres', label: 'Paramètres', icon: <CogIcon /> },
                { href: '#logout',     label: 'Se déconnecter', icon: <LogoutIcon />, logout: true },
            ],
        },
    ];

    return (
        <>
            <Head title={`${title} — hs liberty`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen bg-slate-50">

                {/* SIDEBAR */}
                <aside className={`fixed left-0 top-0 z-40 h-screen w-64 bg-slate-950 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

                    {/* Logo */}
                    <div className="flex h-16 items-center gap-3 px-5 border-b border-white/5 flex-shrink-0">
                        <div className="relative flex-shrink-0">
                            <div className="w-8 h-8 bg-emerald-600 rounded-xl rotate-6 absolute inset-0"/>
                            <div className="w-8 h-8 bg-emerald-700 rounded-xl relative flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-black text-white leading-none">hs liberty</div>
                            <div className="text-[9px] text-emerald-500 font-bold tracking-widest uppercase leading-none mt-0.5">Voyage accessible</div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {navItems.map((group, gi) => (
                            <div key={gi} className={gi > 0 ? 'pt-4' : ''}>
                                {group.section && (
                                    <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                        {group.section}
                                    </p>
                                )}
                                <ul className="space-y-0.5">
                                    {group.links.map(link => {
                                        const active = isActive(link.href);
                                        return (
                                            <li key={link.href}>
                                                {'logout' in link && link.logout ? (
                                                    <button onClick={handleLogout}
                                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
                                                        <span className="text-red-400">{link.icon}</span>
                                                        {link.label}
                                                    </button>
                                                ) : (
                                                    <Link href={link.href} onClick={() => setSidebarOpen(false)}
                                                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${'danger' in link && link.danger && !active ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' : active ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                                                        <span className={'danger' in link && link.danger && !active ? 'text-red-400' : active ? 'text-white' : 'text-slate-500'}>
                                                            {link.icon}
                                                        </span>
                                                        {link.label}
                                                        {'danger' in link && link.danger && (
                                                            <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">2</span>
                                                        )}
                                                    </Link>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    {/* User footer */}
                    {auth?.user && (
                        <div className="border-t border-white/5 p-3 flex-shrink-0">
                            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1">
                                <div className="h-8 w-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                                    {getInitials(auth.user)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-white truncate">{getDisplayName(auth.user)}</p>
                                    <p className="text-[10px] text-slate-500 truncate capitalize">{auth.user.role ?? 'Administrateur'}</p>
                                </div>
                            </div>
                            <button onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors">
                                <LogoutIcon/>
                                Se déconnecter
                            </button>
                        </div>
                    )}
                </aside>

                {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}/>}

                {/* MAIN */}
                <div className="lg:ml-64 flex-1 flex flex-col min-w-0">

                    {/* Header */}
                    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-8 flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <div>
                                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">{title}</h1>
                                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href="/reservations/create" className="hidden md:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/></svg>
                                Nouvelle réservation
                            </Link>
                            <Link href="/urgences" className="relative w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">2</span>
                            </Link>
                            <button className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500"/>
                            </button>

                            {auth?.user && (
                                <div className="relative">
                                    <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 hover:border-emerald-200 transition-all">
                                        <div className="h-7 w-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white text-xs font-black">
                                            {getInitials(auth.user)}
                                        </div>
                                        <span className="hidden md:block text-sm font-semibold text-slate-900">{getDisplayName(auth.user)}</span>
                                        <svg className={`h-4 w-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                                    </button>

                                    {showUserMenu && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}/>
                                            <div className="absolute right-0 mt-2 w-60 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-100 overflow-hidden">
                                                <div className="p-4 border-b border-slate-100 bg-slate-50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white text-sm font-black">
                                                            {getInitials(auth.user)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-slate-900 truncate">{getDisplayName(auth.user)}</p>
                                                            <p className="text-xs text-slate-400 truncate">{auth.user.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-2">
                                                    {[
                                                        { href: '/profile',    label: 'Mon profil',  icon: <UserIcon /> },
                                                        { href: '/parametres', label: 'Paramètres',  icon: <CogIcon /> },
                                                    ].map(item => (
                                                        <Link key={item.href} href={item.href} onClick={() => setShowUserMenu(false)}
                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                                                            <span className="text-slate-400">{item.icon}</span>
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                    <div className="my-1 h-px bg-slate-100"/>
                                                    <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
                                                        <LogoutIcon/>
                                                        Se déconnecter
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </>
    );
}

function HomeIcon()       { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function BuildingIcon()   { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h1M9 11h1M9 15h1M14 7h1M14 11h1M14 15h1"/></svg>; }
function PlusCircleIcon() { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>; }
function StarIcon()       { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function CalendarIcon()   { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function UserIcon()       { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function UsersIcon()      { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>; }
function MapIcon()        { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>; }
function HeartIcon()      { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>; }
function TruckIcon()      { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>; }
function AlertIcon()      { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
function ChartIcon()      { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>; }
function CogIcon()        { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>; }
function LogoutIcon()     { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>; }