<?php

namespace App\Http\Controllers\Voyageur;

use App\Http\Controllers\Controller;
use App\Models\Voyageur;
use App\Models\Reservation;
use Inertia\Inertia;
use Inertia\Response;

class ReservationVoyageurController extends Controller
{
    public function index(): Response
    {
        $v = Voyageur::where('user_id', auth()->id())->first();
        if (!$v) return Inertia::render('voyageur/reservations', ['reservations' => []]);

        $reservations = Reservation::where('voyageur_id', $v->id)
            ->with('hebergement')
            ->orderByDesc('date_arrivee')
            ->get()
            ->map(fn ($r) => [
                'id'          => $r->id,
                'reference'   => $r->reference,
                'hebergement' => optional($r->hebergement)->nom ?? 'Inconnu',
                'ville'       => optional($r->hebergement)->ville ?? '',
                'pays'        => optional($r->hebergement)->pays ?? '',
                'date_arrivee'=> $r->date_arrivee->format('d/m/Y'),
                'date_depart' => $r->date_depart->format('d/m/Y'),
                'nb_nuits'    => $r->date_arrivee->diffInDays($r->date_depart),
                'statut'      => $r->statut,
                'montant'     => number_format($r->montant_total, 0, ',', ' ') . ' ' . ($r->devise ?? 'F'),
            ]);

        return Inertia::render('voyageur/reservations', [
            'reservations' => $reservations,
        ]);
    }
}