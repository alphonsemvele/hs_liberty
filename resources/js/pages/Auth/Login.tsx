import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const PROFILS_TEST = [
    { role: 'Admin',               email: 'admin@hsliberty.com',        couleur: 'bg-slate-800 text-white',          icon: '⚙️'  },
    { role: 'Voyageur',            email: 'voyageur@hsliberty.com',     couleur: 'bg-emerald-600 text-white',        icon: '✈️'  },
    { role: 'Aidant',              email: 'aidant@hsliberty.com',       couleur: 'bg-teal-600 text-white',           icon: '🤝'  },
    { role: 'Professionnel santé', email: 'pro@hsliberty.com',          couleur: 'bg-pink-600 text-white',           icon: '🩺'  },
    { role: 'Partenaire',          email: 'partenaire@hsliberty.com',   couleur: 'bg-sky-600 text-white',            icon: '🏨'  },
    { role: 'Transporteur',        email: 'transporteur@hsliberty.com', couleur: 'bg-violet-600 text-white',         icon: '🚐'  },
];

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email:    '',
        password: '',
        remember: false,
    });

    const [showPass, setShowPass]   = useState(false);
    const [focused,  setFocused]    = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    const loginAs = (email: string) => {
        setData(d => ({ ...d, email, password: 'password' }));
    };

    return (
        <>
            <Head title="Connexion — hs liberty" />
            <div className="min-h-screen flex overflow-hidden">

                {/* ── GAUCHE — Formulaire ── */}
                <div className="flex-1 flex flex-col bg-white relative z-10">

                    {/* Top bar */}
                    <div className="flex items-center justify-between px-10 py-7 border-b border-slate-100">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-8 h-8 bg-emerald-600 rounded-xl rotate-6 absolute inset-0 transition-transform group-hover:rotate-12"/>
                                <div className="w-8 h-8 bg-emerald-700 rounded-xl relative flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <span className="font-black text-slate-900 text-base leading-none">hs liberty</span>
                                <div className="text-[9px] text-emerald-600 font-bold tracking-widest uppercase leading-none mt-0.5">Voyage accessible</div>
                            </div>
                        </Link>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-10 py-8 overflow-y-auto">
                        <div className="w-full max-w-[420px]">

                            {/* Header */}
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-4">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/>
                                    Accès sécurisé
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    Bon retour<br/>
                                    <span className="text-emerald-600">sur hs liberty.</span>
                                </h1>
                            </div>

                            {/* ── Connexion rapide (dev) ── */}
                            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <span>🧪</span> Connexion rapide (test)
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {PROFILS_TEST.map(p => (
                                        <button key={p.email} type="button"
                                            onClick={() => loginAs(p.email)}
                                            className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 hover:shadow-md ${p.couleur}
                                                ${data.email === p.email ? 'ring-2 ring-offset-1 ring-amber-400 scale-105' : ''}`}>
                                            <span className="text-lg">{p.icon}</span>
                                            <span className="leading-tight text-center">{p.role}</span>
                                        </button>
                                    ))}
                                </div>
                                {data.email && (
                                    <p className="text-xs text-amber-600 mt-2 text-center font-medium">
                                        ✓ {data.email} · mot de passe : <span className="font-mono font-bold">password</span>
                                    </p>
                                )}
                            </div>

                            {status && (
                                <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                    </div>
                                    <p className="text-sm text-emerald-700 font-medium">{status}</p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
                                    <div className={`relative flex items-center rounded-2xl border-2 transition-all ${focused === 'email' ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-100' : errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                                        <div className={`pl-4 ${focused === 'email' ? 'text-emerald-500' : 'text-slate-300'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                        </div>
                                        <input id="email" type="email" value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                                            placeholder="votre@email.com" autoComplete="email"
                                            className="flex-1 bg-transparent px-3 py-4 text-slate-900 text-sm placeholder-slate-300 focus:outline-none"/>
                                    </div>
                                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Mot de passe</label>
                                        <a href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Oublié ?</a>
                                    </div>
                                    <div className={`relative flex items-center rounded-2xl border-2 transition-all ${focused === 'password' ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-100' : errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                                        <div className={`pl-4 ${focused === 'password' ? 'text-emerald-500' : 'text-slate-300'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                        </div>
                                        <input id="password" type={showPass ? 'text' : 'password'} value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                                            placeholder="••••••••••"
                                            className="flex-1 bg-transparent px-3 py-4 text-slate-900 text-sm placeholder-slate-300 focus:outline-none"/>
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="pr-4 text-slate-300 hover:text-slate-500" tabIndex={-1}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {showPass
                                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                                    : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                                                }
                                            </svg>
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
                                </div>

                                {/* Remember */}
                                <label className="flex items-center gap-3 cursor-pointer select-none group py-1">
                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.remember ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 group-hover:border-emerald-400'}`}
                                        onClick={() => setData('remember', !data.remember)}>
                                        {data.remember && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                    </div>
                                    <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="sr-only"/>
                                    <span className="text-sm text-slate-500 font-light">Rester connecté pendant 30 jours</span>
                                </label>

                                {/* Submit */}
                                <button type="submit" disabled={processing}
                                    className="w-full relative overflow-hidden group bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-200 disabled:transform-none disabled:cursor-not-allowed mt-2">
                                    <span className={`flex items-center justify-center gap-2 transition-opacity ${processing ? 'opacity-0' : 'opacity-100'}`}>
                                        Se connecter
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                                    </span>
                                    {processing && (
                                        <span className="absolute inset-0 flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                            Connexion…
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="px-10 py-5 border-t border-slate-100 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-600 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                            Retour à l'accueil
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                            TLS 1.3 · RGPD conforme
                        </div>
                    </div>
                </div>

                {/* ── DROITE — Illustration ── */}
                <div className="hidden lg:flex w-[46%] relative overflow-hidden flex-col">
                    <div className="absolute inset-0 bg-slate-950"/>
                    <div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(circle at 30% 70%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.08) 0%, transparent 40%)' }}/>
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize:'60px 60px' }}/>
                    <div className="relative flex-1 flex flex-col justify-between p-16">
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 w-fit px-4 py-2 rounded-full">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>
                            <span className="text-emerald-400 text-xs font-semibold tracking-wide">Plateforme active · 60 pays</span>
                        </div>
                        <div>
                            <div className="w-12 h-1 bg-emerald-500 rounded-full mb-8"/>
                            <blockquote className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-8">
                                La liberté de voyager<br/>n'est pas un privilège.<br/>
                                <span className="text-emerald-400">C'est un droit.</span>
                            </blockquote>
                            <p className="text-slate-400 text-base leading-relaxed max-w-sm font-light">
                                hs liberty certifie, connecte et protège. Pour que chaque personne en situation de handicap puisse explorer le monde en toute dignité.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[{n:'50K',l:'Hébergements',sub:'certifiés ISO 21902'},{n:'20K',l:'Soignants',sub:'diplômes vérifiés'},{n:'60',l:'Pays',sub:'couverts en 5 ans'}].map((s,i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                    <div className="text-2xl font-black text-emerald-400 leading-none">{s.n}</div>
                                    <div className="text-white text-sm font-semibold mt-1">{s.l}</div>
                                    <div className="text-slate-500 text-xs mt-0.5">{s.sub}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex gap-1 mb-3">{[...Array(5)].map((_,i) => <svg key={i} className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                            <p className="text-slate-300 text-sm leading-relaxed font-light italic">"Pour la première fois en 8 ans, j'ai pu réserver un séjour sans passer 3 semaines à vérifier si l'hôtel était vraiment accessible."</p>
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xs font-black">KD</div>
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