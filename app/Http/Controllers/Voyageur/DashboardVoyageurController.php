<?php

namespace App\Http\Controllers\Voyageur;

use App\Http\Controllers\Controller;
use App\Models\Voyageur;
use App\Models\Reservation;
use App\Models\ProgrammeSejour;
use Inertia\Inertia;
use Inertia\Response;

class DashboardVoyageurController extends Controller
{
    public function index(): Response
    {
        $v = Voyageur::where('user_id', auth()->id())->first();

        // Profil voyageur pas encore créé → dashboard vide
        if (!$v) {
            return Inertia::render('voyageur/index', [
                'voyageur'              => [
                    'prenom'            => auth()->user()->prenom ?? auth()->user()->name ?? 'Voyageur',
                    'nom'               => auth()->user()->nom ?? '',
                    'type_handicap'     => null,
                    'niveau_dependance' => null,
                ],
                'prochaine_reservation' => null,
                'reservations_recentes' => [],
                'nb_reservations'       => 0,
                'nb_programmes'         => 0,
            ]);
        }

        $prochaineReservation = Reservation::where('voyageur_id', $v->id)
            ->where('statut', 'confirmee')
            ->where('date_arrivee', '>=', now())
            ->with('hebergement')
            ->orderBy('date_arrivee')
            ->first();

        $reservationsRecentes = Reservation::where('voyageur_id', $v->id)
            ->with('hebergement')
            ->orderByDesc('created_at')
            ->take(3)
            ->get()
            ->map(fn ($r) => [
                'id'          => $r->id,
                'reference'   => $r->reference,
                'hebergement' => optional($r->hebergement)->nom ?? 'Inconnu',
                'ville'       => optional($r->hebergement)->ville ?? '',
                'date_arrivee'=> $r->date_arrivee->format('d/m/Y'),
                'date_depart' => $r->date_depart->format('d/m/Y'),
                'statut'      => $r->statut,
                'montant'     => number_format($r->montant_total, 0, ',', ' ') . ' ' . ($r->devise ?? 'F'),
            ]);

        return Inertia::render('voyageur/index', [
            'voyageur' => [
                'prenom'            => optional($v->user)->prenom ?? 'Voyageur',
                'nom'               => optional($v->user)->nom ?? '',
                'type_handicap'     => $v->type_handicap,
                'niveau_dependance' => $v->niveau_dependance,
            ],
            'prochaine_reservation' => $prochaineReservation ? [
                'id'          => $prochaineReservation->id,
                'reference'   => $prochaineReservation->reference,
                'hebergement' => optional($prochaineReservation->hebergement)->nom ?? '',
                'ville'       => optional($prochaineReservation->hebergement)->ville ?? '',
                'pays'        => optional($prochaineReservation->hebergement)->pays ?? '',
                'date_arrivee'=> $prochaineReservation->date_arrivee->format('d/m/Y'),
                'date_depart' => $prochaineReservation->date_depart->format('d/m/Y'),
                'nb_nuits'    => $prochaineReservation->date_arrivee->diffInDays($prochaineReservation->date_depart),
                'dans'        => now()->diffInDays($prochaineReservation->date_arrivee) . ' jours',
            ] : null,
            'reservations_recentes' => $reservationsRecentes,
            'nb_reservations'       => Reservation::where('voyageur_id', $v->id)->count(),
            'nb_programmes'         => ProgrammeSejour::where('voyageur_id', $v->id)->count(),
        ]);
    }
}