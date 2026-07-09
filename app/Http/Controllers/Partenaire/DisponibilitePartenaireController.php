<?php

namespace App\Http\Controllers\Partenaire;

use App\Http\Controllers\Controller;
use App\Models\Hebergement;
use App\Models\Reservation;
use Inertia\Inertia;
use Inertia\Response;

class DisponibilitePartenaireController extends Controller
{
    public function index(): Response
    {
        $user         = auth()->user();
        $hebergements = Hebergement::where('user_id', $user->id)->get();

        $reservations = Reservation::whereIn('hebergement_id', $hebergements->pluck('id'))
            ->whereIn('statut', ['confirmee','en_attente'])
            ->with('hebergement')
            ->orderBy('date_arrivee')
            ->get()
            ->map(fn ($r) => [
                'id'           => $r->id,
                'hebergement'  => optional($r->hebergement)->nom ?? '',
                'hebergement_id'=> $r->hebergement_id,
                'date_arrivee' => $r->date_arrivee->format('Y-m-d'),
                'date_depart'  => $r->date_depart->format('Y-m-d'),
                'label_arrivee'=> $r->date_arrivee->format('d/m/Y'),
                'label_depart' => $r->date_depart->format('d/m/Y'),
                'nb_nuits'     => $r->date_arrivee->diffInDays($r->date_depart),
                'statut'       => $r->statut,
            ]);

        return Inertia::render('partenaire/disponibilites', [
            'hebergements' => $hebergements->map(fn ($h) => [
                'id'  => $h->id,
                'nom' => $h->nom,
                'actif'=> (bool) $h->actif,
            ]),
            'reservations' => $reservations,
        ]);
    }
}