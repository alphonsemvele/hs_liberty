import { useForm, usePage } from '@inertiajs/react';
import PartenaireLayout from './layout';

const inputCls = 'w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-400 focus:bg-white transition-all';

export default function PartenaireProfil({ profil }: { profil: any }) {
    const { props } = usePage<any>();
    const flash = props.flash as any;
    const { data, setData, patch, processing } = useForm({ ...profil });
    const initials = ((profil.prenom?.[0] ?? '?') + (profil.nom?.[0] ?? '')).toUpperCase();

    return (
        <PartenaireLayout title="Mon profil" subtitle="Gérez vos informations">
            {flash?.success && (
                <div className="mb-5 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p className="text-sm font-semibold text-emerald-700">{flash.success}</p>
                </div>
            )}
            <div className="max-w-2xl space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-sky-600 flex items-center justify-center text-3xl font-black text-white flex-shrink-0">{initials}</div>
                    <div>
                        <p className="text-xl font-black text-slate-900">{profil.prenom} {profil.nom}</p>
                        <p className="text-sm text-slate-400 mt-1">{profil.email}</p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 mt-2">🏨 Partenaire hébergement</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-900">Informations</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Prénom / Raison sociale</label>
                                <input value={data.prenom} onChange={e => setData('prenom', e.target.value)} className={inputCls}/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nom</label>
                                <input value={data.nom} onChange={e => setData('nom', e.target.value)} className={inputCls}/>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Téléphone</label>
                                <input value={data.telephone ?? ''} onChange={e => setData('telephone', e.target.value)} className={inputCls} placeholder="+221 77 000 00 00"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ville</label>
                                <input value={data.ville ?? ''} onChange={e => setData('ville', e.target.value)} className={inputCls} placeholder="Dakar"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button onClick={() => patch('/partenaire/profil')} disabled={processing}
                        className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
                        {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                        Sauvegarder
                    </button>
                </div>
            </div>
        </PartenaireLayout>
    );
}