import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPass, setShowPass] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Connexion — hs liberty" />

            <div className="min-h-screen flex overflow-hidden">

                {/* ══════════════════════════════════════════
                    GAUCHE — FORMULAIRE
                ══════════════════════════════════════════ */}
                <div className="flex-1 flex flex-col bg-white relative z-10">

                    {/* Top bar */}
                    <div className="flex items-center justify-between px-10 py-7 border-b border-slate-100">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-8 h-8 bg-emerald-600 rounded-xl rotate-6 absolute inset-0 transition-transform group-hover:rotate-12" />
                                <div className="w-8 h-8 bg-emerald-700 rounded-xl relative flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <span className="font-black text-slate-900 text-base leading-none">hs liberty</span>
                                <div className="text-[9px] text-emerald-600 font-bold tracking-widest uppercase leading-none mt-0.5">Voyage accessible</div>
                            </div>
                        </Link>
                        <span className="text-sm text-slate-400">
                            Pas encore de compte ?{' '}
                            <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                S'inscrire
                            </a>
                        </span>
                    </div>

                    {/* Form area */}
                    <div className="flex-1 flex items-center justify-center px-10 py-12">
                        <div className="w-full max-w-[420px]">

                            {/* Header */}
                            <div className="mb-10">
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-5">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    Accès sécurisé
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    Bon retour<br />
                                    <span className="text-emerald-600">sur hs liberty.</span>
                                </h1>
                                <p className="text-slate-400 text-sm mt-3 font-light leading-relaxed">
                                    Connectez-vous pour accéder à votre espace de voyage accessible.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-emerald-700 font-medium">{status}</p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">

                                {/* Email field */}
                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                                        Adresse email
                                    </label>
                                    <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 ${
                                        focused === 'email'
                                            ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-100'
                                            : errors.email
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                                    }`}>
                                        <div className={`pl-4 transition-colors ${focused === 'email' ? 'text-emerald-500' : 'text-slate-300'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            onFocus={() => setFocused('email')}
                                            onBlur={() => setFocused(null)}
                                            placeholder="votre@email.com"
                                            autoFocus
                                            className="flex-1 bg-transparent px-3 py-4 text-slate-900 text-sm placeholder-slate-300 focus:outline-none"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password field */}
                                <div>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            Mot de passe
                                        </label>
                                        <a href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                            Mot de passe oublié ?
                                        </a>
                                    </div>
                                    <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 ${
                                        focused === 'password'
                                            ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-100'
                                            : errors.password
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                                    }`}>
                                        <div className={`pl-4 transition-colors ${focused === 'password' ? 'text-emerald-500' : 'text-slate-300'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            type={showPass ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            onFocus={() => setFocused('password')}
                                            onBlur={() => setFocused(null)}
                                            placeholder="••••••••••"
                                            className="flex-1 bg-transparent px-3 py-4 text-slate-900 text-sm placeholder-slate-300 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="pr-4 text-slate-300 hover:text-slate-500 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPass ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Remember me */}
                                <label className="flex items-center gap-3 cursor-pointer select-none group py-1">
                                    <div
                                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                                            data.remember
                                                ? 'bg-emerald-600 border-emerald-600'
                                                : 'border-slate-300 bg-white group-hover:border-emerald-400'
                                        }`}
                                        onClick={() => setData('remember', !data.remember)}
                                    >
                                        {data.remember && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="sr-only"
                                    />
                                    <span className="text-sm text-slate-500 font-light">Rester connecté pendant 30 jours</span>
                                </label>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full relative overflow-hidden group bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-200 disabled:transform-none disabled:cursor-not-allowed mt-2"
                                >
                                    <span className={`flex items-center justify-center gap-2 transition-all duration-200 ${processing ? 'opacity-0' : 'opacity-100'}`}>
                                        Se connecter
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                    {processing && (
                                        <span className="absolute inset-0 flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Connexion en cours…
                                        </span>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-slate-100" />
                                <span className="text-xs text-slate-300 font-medium">ou</span>
                                <div className="flex-1 h-px bg-slate-100" />
                            </div>

                            {/* Social / SSO */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    {
                                        label: 'Google',
                                        icon: (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                        ),
                                    },
                                    {
                                        label: 'Microsoft',
                                        icon: (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                <path fill="#F25022" d="M1 1h10v10H1z"/>
                                                <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                                                <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                                                <path fill="#FFB900" d="M13 13h10v10H13z"/>
                                            </svg>
                                        ),
                                    },
                                ].map((p) => (
                                    <button
                                        key={p.label}
                                        type="button"
                                        className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all text-sm font-medium text-slate-600"
                                    >
                                        {p.icon}
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="px-10 py-5 border-t border-slate-100 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-600 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour à l'accueil
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                            Connexion chiffrée TLS 1.3 · RGPD conforme
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════
                    DROITE — ILLUSTRATION / MANIFESTE
                ══════════════════════════════════════════ */}
                <div className="hidden lg:flex w-[46%] relative overflow-hidden flex-col">

                    {/* Dark background with texture */}
                    <div className="absolute inset-0 bg-slate-950" />
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.08) 0%, transparent 40%)',
                        }}
                    />

                    {/* Grid lines */}
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />

                    {/* Large decorative number */}
                    <div className="absolute right-8 top-8 text-[180px] font-black text-white/[0.03] leading-none select-none pointer-events-none">
                        ♿
                    </div>

                    {/* Content */}
                    <div className="relative flex-1 flex flex-col justify-between p-16">

                        {/* Top badge */}
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 w-fit px-4 py-2 rounded-full">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-emerald-400 text-xs font-semibold tracking-wide">Plateforme active · 60 pays</span>
                        </div>

                        {/* Main quote */}
                        <div>
                            <div className="w-12 h-1 bg-emerald-500 rounded-full mb-8" />
                            <blockquote className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-8">
                                La liberté de voyager<br />
                                n'est pas un privilège.<br />
                                <span className="text-emerald-400">C'est un droit.</span>
                            </blockquote>
                            <p className="text-slate-400 text-base leading-relaxed max-w-sm font-light">
                                hs liberty certifie, connecte et protège. Pour que chaque personne en situation de handicap puisse explorer le monde en toute dignité.
                            </p>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { n: '50K', l: 'Hébergements', sub: 'certifiés ISO 21902' },
                                { n: '20K', l: 'Soignants', sub: 'diplômes vérifiés' },
                                { n: '60', l: 'Pays', sub: 'couverts en 5 ans' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                    <div className="text-2xl font-black text-emerald-400 leading-none">{s.n}</div>
                                    <div className="text-white text-sm font-semibold mt-1">{s.l}</div>
                                    <div className="text-slate-500 text-xs mt-0.5">{s.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Testimonial */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed font-light italic">
                                "Pour la première fois en 8 ans, j'ai pu réserver un séjour sans passer 3 semaines à vérifier si l'hôtel était vraiment accessible."
                            </p>
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xs font-black">
                                    KD
                                </div>
                                <div>
                                    <div className="text-white text-xs font-semibold">Kofi Diarra</div>
                                    <div className="text-slate-500 text-xs">Utilisateur · Accra, Ghana</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
}