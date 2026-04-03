interface ParamProps { parametres?: { plateforme: any; notifications: any; securite: any } }
 

import { Link } from '@inertiajs/react';
import DashboardLayout from '../layout';
export default function ParametresIndex({ parametres }: ParamProps) {
    const p = parametres ?? { plateforme:{ nom:'hs liberty', email_contact:'contact@hs-liberty.com', telephone:'+221 33 123 45 67', langue_defaut:'fr', devise_defaut:'XOF', fuseau_horaire:'Africa/Dakar' }, notifications:{ email_nouvelles_reservations:true, email_urgences:true, email_certifications_expir:true, sms_urgences:true }, securite:{ mfa_obligatoire:true, duree_session_heures:8, ip_whitelist_active:false } };
 
    return (
        <DashboardLayout title="Paramètres" subtitle="Configuration de la plateforme">
            <div className="max-w-3xl space-y-6">
 
                {/* Infos plateforme */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">Informations générales</h3>
                        <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Modifier</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {Object.entries(p.plateforme).map(([k,v]) => (
                            <div key={k} className="flex items-center justify-between px-6 py-3.5">
                                <span className="text-xs font-semibold text-slate-500 capitalize">{k.replace(/_/g,' ')}</span>
                                <span className="text-sm font-semibold text-slate-900">{String(v)}</span>
                            </div>
                        ))}
                    </div>
                </div>
 
                {/* Notifications */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {[
                            { key: 'email_nouvelles_reservations', label: 'Email — Nouvelles réservations' },
                            { key: 'email_urgences',               label: 'Email — Alertes urgences' },
                            { key: 'email_certifications_expir',   label: 'Email — Certifications expirées' },
                            { key: 'sms_urgences',                 label: 'SMS — Urgences SOS' },
                        ].map(item => (
                            <div key={item.key} className="flex items-center justify-between px-6 py-3.5">
                                <span className="text-sm text-slate-700">{item.label}</span>
                                <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${(p.notifications as any)[item.key] ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${(p.notifications as any)[item.key] ? 'translate-x-5' : 'translate-x-1'}`}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
 
                {/* Sécurité */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900">Sécurité</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                        <div className="flex items-center justify-between px-6 py-3.5">
                            <span className="text-sm text-slate-700">Authentification double facteur (MFA)</span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.securite.mfa_obligatoire ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{p.securite.mfa_obligatoire ? 'Activé' : 'Désactivé'}</span>
                        </div>
                        <div className="flex items-center justify-between px-6 py-3.5">
                            <span className="text-sm text-slate-700">Durée de session</span>
                            <span className="text-sm font-semibold text-slate-900">{p.securite.duree_session_heures}h</span>
                        </div>
                        <div className="flex items-center justify-between px-6 py-3.5">
                            <span className="text-sm text-slate-700">Liste blanche IP</span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.securite.ip_whitelist_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{p.securite.ip_whitelist_active ? 'Activée' : 'Désactivée'}</span>
                        </div>
                    </div>
                </div>
 
                <div className="flex justify-end">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors">
                        Sauvegarder les paramètres
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}