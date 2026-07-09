<?php

namespace App\Http\Controllers;

use App\Models\Hebergement;
use App\Models\Reservation;
use App\Models\Voyageur;
use App\Models\Professionnel;
use App\Models\Urgence;
use App\Models\Avis;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // ── Stats réelles ─────────────────────────────────────────────────────
        $totalAvis   = Avis::where('masque', false)->count();
        $positifs    = Avis::where('masque', false)->where('note_globale', '>=', 4)->count();

        $stats = [
            'hebergements_certifies'   => Hebergement::where('actif', true)->count(),
            'reservations_en_cours'    => Reservation::whereIn('statut', ['confirmee', 'en_attente'])->count(),
            'reservations_ce_mois'     => Reservation::whereMonth('created_at', now()->month)
                                              ->whereYear('created_at', now()->year)->count(),
            'voyageurs_inscrits'       => Voyageur::whereNull('deleted_at')->count(),
            'professionnels_certifies' => Professionnel::where('certifie', true)->count(),
            'urgences_actives'         => Urgence::whereIn('statut', ['declenche', 'en_traitement'])->count(),
            'taux_satisfaction'        => $totalAvis > 0 ? (int) round($positifs / $totalAvis * 100) : 0,
            'certifications_expirees'  => 0,
        ];

        // ── Réservations récentes ─────────────────────────────────────────────
        $reservations_recentes = Reservation::with(['voyageur.user', 'hebergement'])
            ->orderByDesc('created_at')
            ->take(6)
            ->get()
            ->map(fn ($r) => [
                'id'          => $r->id,
                'initials'    => strtoupper(
                    substr(optional($r->voyageur?->user)->prenom ?? '?', 0, 1) .
                    substr(optional($r->voyageur?->user)->nom    ?? '?', 0, 1)
                ),
                'voyageur'    => trim(optional($r->voyageur?->user)->prenom . ' ' . optional($r->voyageur?->user)->nom) ?: 'Inconnu',
                'hebergement' => optional($r->hebergement)->nom ?? 'Inconnu',
                'date_arrivee'=> $r->date_arrivee->format('d/m/Y'),
                'date_depart' => $r->date_depart->format('d/m/Y'),
                'statut'      => match($r->statut) {
                    'confirmee'  => 'Confirmée',
                    'en_attente' => 'En attente',
                    'terminee'   => 'Terminée',
                    'annulee'    => 'Annulée',
                    default      => ucfirst($r->statut),
                },
                'montant' => number_format($r->montant_total, 0, ',', ' ') . ' ' . ($r->devise ?? 'F'),
            ]);

        // ── Urgences actives ──────────────────────────────────────────────────
        $urgences_actives = Urgence::with('voyageur.user')
            ->whereIn('statut', ['declenche', 'en_traitement'])
            ->orderByDesc('declenchee_le')
            ->take(5)
            ->get()
            ->map(fn ($u) => [
                'id'          => $u->id,
                'voyageur'    => trim(optional($u->voyageur?->user)->prenom . ' ' . optional($u->voyageur?->user)->nom) ?: 'Inconnu',
                'localisation'=> $u->adresse_approximative ?? '—',
                'type'        => $u->type_urgence ?? 'autre',
                'statut'      => $u->statut,
                'depuis'      => $u->declenchee_le?->diffForHumans() ?? $u->created_at->diffForHumans(),
            ]);

        return Inertia::render('dashboard/index', [
            'stats'                 => $stats,
            'reservations_recentes' => $reservations_recentes,
            'urgences_actives'      => $urgences_actives,
        ]);
    }
}