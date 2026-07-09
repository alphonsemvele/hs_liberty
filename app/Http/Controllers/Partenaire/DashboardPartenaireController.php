<?php

namespace App\Http\Controllers\Partenaire;

use App\Http\Controllers\Controller;
use App\Models\Hebergement;
use App\Models\Reservation;
use Inertia\Inertia;
use Inertia\Response;

class DashboardPartenaireController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $hebergements = Hebergement::where('user_id', $user->id)
            ->withCount(['reservations', 'reservations as reservations_actives_count' => fn($q) =>
                $q->whereIn('statut', ['confirmee','en_attente'])
            ])
            ->orderByDesc('created_at')
            ->get();

        $reservationsRecentes = Reservation::whereIn('hebergement_id', $hebergements->pluck('id'))
            ->with(['voyageur.user', 'hebergement'])
            ->whereIn('statut', ['confirmee','en_attente'])
            ->orderBy('date_arrivee')
            ->take(5)
            ->get()
            ->map(fn ($r) => [
                'id'          => $r->id,
                'voyageur'    => trim(optional($r->voyageur?->user)->prenom . ' ' . optional($r->voyageur?->user)->nom) ?: 'Inconnu',
                'initials'    => strtoupper(
                    substr(optional($r->voyageur?->user)->prenom ?? '?', 0, 1) .
                    substr(optional($r->voyageur?->user)->nom    ?? '?', 0, 1)
                ),
                'hebergement' => optional($r->hebergement)->nom ?? '',
                'date_arrivee'=> $r->date_arrivee->format('d/m/Y'),
                'date_depart' => $r->date_depart->format('d/m/Y'),
                'nb_nuits'    => $r->date_arrivee->diffInDays($r->date_depart),
                'statut'      => $r->statut,
                'montant'     => number_format($r->montant_total ?? 0, 0, ',', ' ') . ' ' . ($r->devise ?? 'XOF'),
            ]);

        $totalReservations = Reservation::whereIn('hebergement_id', $hebergements->pluck('id'))->count();
        $revenusMois       = Reservation::whereIn('hebergement_id', $hebergements->pluck('id'))
            ->whereMonth('created_at', now()->month)
            ->sum('montant_total');

        return Inertia::render('partenaire/index', [
            'partenaire' => [
                'prenom' => $user->prenom ?? $user->name ?? 'Partenaire',
                'nom'    => $user->nom ?? '',
            ],
            'hebergements'         => $hebergements->map(fn ($h) => [
                'id'                 => $h->id,
                'nom'                => $h->nom,
                'ville'              => $h->ville ?? '',
                'actif'              => (bool) $h->actif,
                'nb_reservations'    => $h->reservations_count ?? 0,
                'reservations_actives'=> $h->reservations_actives_count ?? 0,
                'note'               => $h->note_moyenne ?? 0,
            ]),
            'reservations_a_venir' => $reservationsRecentes,
            'stats' => [
                'nb_hebergements'   => $hebergements->count(),
                'hebergements_actifs'=> $hebergements->where('actif', true)->count(),
                'reservations_total'=> $totalReservations,
                'revenus_mois'      => number_format($revenusMois, 0, ',', ' '),
            ],
        ]);
    }
}