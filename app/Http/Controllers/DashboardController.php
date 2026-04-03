<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // ── Stats statiques (à connecter plus tard) ───────────────────────────
        $stats = [
            'hebergements_certifies'   => 248,
            'reservations_en_cours'    => 34,
            'reservations_ce_mois'     => 127,
            'voyageurs_inscrits'       => 1_842,
            'professionnels_certifies' => 312,
            'urgences_actives'         => 2,
            'taux_satisfaction'        => 94,
            'certifications_expirees'  => 7,
        ];

        // ── Réservations récentes (statiques) ─────────────────────────────────
        $reservations_recentes = [
            [
                'id'           => 1,
                'initials'     => 'KD',
                'voyageur'     => 'Kofi Diarra',
                'hebergement'  => 'Hôtel Azur Accessible — Dakar',
                'date_arrivee' => '12/04/2026',
                'date_depart'  => '18/04/2026',
                'statut'       => 'Confirmée',
                'montant'      => '186 000 F',
            ],
            [
                'id'           => 2,
                'initials'     => 'AM',
                'voyageur'     => 'Amina Mbaye',
                'hebergement'  => 'Résidence PMR Casablanca Centre',
                'date_arrivee' => '15/04/2026',
                'date_depart'  => '20/04/2026',
                'statut'       => 'En attente',
                'montant'      => '94 500 F',
            ],
            [
                'id'           => 3,
                'initials'     => 'JB',
                'voyageur'     => 'Jean-Baptiste Essomba',
                'hebergement'  => 'Villa Accessibilité Plus — Abidjan',
                'date_arrivee' => '08/04/2026',
                'date_depart'  => '14/04/2026',
                'statut'       => 'Terminée',
                'montant'      => '210 000 F',
            ],
            [
                'id'           => 4,
                'initials'     => 'FT',
                'voyageur'     => 'Fatou Touré',
                'hebergement'  => 'Hôtel Liberté — Lomé',
                'date_arrivee' => '20/04/2026',
                'date_depart'  => '25/04/2026',
                'statut'       => 'Confirmée',
                'montant'      => '78 000 F',
            ],
            [
                'id'           => 5,
                'initials'     => 'ON',
                'voyageur'     => 'Oumar Ndiaye',
                'hebergement'  => 'Appart PMR Nairobi Est',
                'date_arrivee' => '02/04/2026',
                'date_depart'  => '07/04/2026',
                'statut'       => 'Annulée',
                'montant'      => '132 000 F',
            ],
            [
                'id'           => 6,
                'initials'     => 'SE',
                'voyageur'     => 'Sophie Eteki',
                'hebergement'  => 'Riad Accessible — Marrakech',
                'date_arrivee' => '25/04/2026',
                'date_depart'  => '30/04/2026',
                'statut'       => 'En attente',
                'montant'      => '155 000 F',
            ],
        ];

        // ── Urgences actives (statiques) ──────────────────────────────────────
        $urgences_actives = [
            [
                'id'         => 1,
                'voyageur'   => 'Kofi Diarra',
                'localisation' => 'Dakar, Sénégal',
                'type'       => 'medical',
                'statut'     => 'en_traitement',
                'depuis'     => '14 min',
            ],
            [
                'id'         => 2,
                'voyageur'   => 'Marie ',
                'localisation' => 'Casablanca, Maroc',
                'type'       => 'securite',
                'statut'     => 'declenche',
                'depuis'     => '3 min',
            ],
        ];

        return Inertia::render('dashboard/index', [
            'stats'                 => $stats,
            'reservations_recentes' => $reservations_recentes,
            'urgences_actives'      => $urgences_actives,
        ]);
    }
}