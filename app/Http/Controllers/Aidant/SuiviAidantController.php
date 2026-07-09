<?php

namespace App\Http\Controllers\Aidant;

use App\Http\Controllers\Controller;
use App\Models\Aidant;
use App\Models\SuiviAidant;
use App\Models\Voyageur;
use App\Models\Reservation;
use App\Models\Urgence;
use Inertia\Inertia;
use Inertia\Response;

class SuiviAidantController extends Controller
{
    public function show(int $voyageurId): Response
    {
        $aidant = Aidant::where('user_id', auth()->id())->firstOrFail();

        // Vérifier que l'aidant suit bien ce voyageur
        $suivi = SuiviAidant::where('aidant_id', $aidant->id)
            ->where('voyageur_id', $voyageurId)
            ->firstOrFail();

        $voyageur = Voyageur::with([
            'user',
            'reservations.hebergement',
            'reservations.transports',
        ])->findOrFail($voyageurId);

        $reservationEnCours = $voyageur->reservations
            ->whereIn('statut', ['confirmee', 'en_attente'])
            ->sortBy('date_arrivee')
            ->first();

        $urgences = Urgence::where('voyageur_id', $voyageurId)
            ->orderByDesc('declenchee_le')
            ->take(5)
            ->get()
            ->map(fn ($u) => [
                'id'           => $u->id,
                'type'         => $u->type_urgence,
                'statut'       => $u->statut,
                'declenchee_le'=> $u->declenchee_le?->format('d/m/Y H:i') ?? $u->created_at->format('d/m/Y H:i'),
                'depuis'       => $u->declenchee_le?->diffForHumans() ?? $u->created_at->diffForHumans(),
            ]);

        return Inertia::render('aidant/suivi', [
            'voyageur' => [
                'id'                => $voyageur->id,
                'nom'               => trim(optional($voyageur->user)->prenom . ' ' . optional($voyageur->user)->nom) ?: 'Inconnu',
                'initials'          => strtoupper(
                    substr(optional($voyageur->user)->prenom ?? '?', 0, 1) .
                    substr(optional($voyageur->user)->nom    ?? '?', 0, 1)
                ),
                'email'             => optional($voyageur->user)->email ?? '',
                'type_handicap'     => $voyageur->type_handicap ?? '—',
                'niveau_dependance' => $voyageur->niveau_dependance ?? 1,
                'besoins'           => $voyageur->besoins_specifiques ?? '',
                'statut_suivi'      => $suivi->statut ?? 'actif',
            ],
            'reservation_en_cours' => $reservationEnCours ? [
                'id'          => $reservationEnCours->id,
                'reference'   => $reservationEnCours->reference,
                'hebergement' => optional($reservationEnCours->hebergement)->nom ?? '',
                'ville'       => optional($reservationEnCours->hebergement)->ville ?? '',
                'date_arrivee'=> $reservationEnCours->date_arrivee->format('d/m/Y'),
                'date_depart' => $reservationEnCours->date_depart->format('d/m/Y'),
                'statut'      => $reservationEnCours->statut,
            ] : null,
            'urgences_recentes' => $urgences,
            'suivi_id'          => $suivi->id,
        ]);
    }
}