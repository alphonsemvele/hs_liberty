<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ParametreController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/parametres/index', [
            'parametres' => [
                'plateforme' => [
                    'nom'            => 'hs liberty',
                    'email_contact'  => 'contact@hs-liberty.com',
                    'telephone'      => '+221 33 123 45 67',
                    'langue_defaut'  => 'fr',
                    'devise_defaut'  => 'XOF',
                    'fuseau_horaire' => 'Africa/Dakar',
                ],
                'notifications' => [
                    'email_nouvelles_reservations' => true,
                    'email_urgences'               => true,
                    'email_certifications_expir'   => true,
                    'sms_urgences'                 => true,
                ],
                'securite' => [
                    'mfa_obligatoire'       => true,
                    'duree_session_heures'  => 8,
                    'ip_whitelist_active'   => false,
                ],
            ],
        ]);
    }
 
    public function update(Request $request)
    {
        return redirect()->route('parametres.index')->with('success', 'Paramètres sauvegardés.');
    }
}