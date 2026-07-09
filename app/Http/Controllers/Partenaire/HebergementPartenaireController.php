<?php

namespace App\Http\Controllers\Partenaire;

use App\Http\Controllers\Controller;
use App\Models\Hebergement;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HebergementPartenaireController extends Controller
{
    public function index(): Response
    {
        $hebergements = Hebergement::where('user_id', auth()->id())
            ->withCount('reservations')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($h) => [
                'id'              => $h->id,
                'nom'             => $h->nom,
                'ville'           => $h->ville ?? '',
                'pays'            => $h->pays ?? '',
                'type'            => $h->type ?? '',
                'actif'           => (bool) $h->actif,
                'nb_reservations' => $h->reservations_count,
                'note'            => (float) ($h->note_moyenne ?? 0),
                'nb_avis'         => $h->nb_avis ?? 0,
                'certifie'        => (bool) ($h->certifie ?? false),
                'created_at'      => $h->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('partenaire/hebergements', [
            'hebergements' => $hebergements,
        ]);
    }

    public function show(int $id): Response
    {
        $h = Hebergement::where('user_id', auth()->id())->findOrFail($id);

        $reservations = Reservation::where('hebergement_id', $h->id)
            ->with('voyageur.user')
            ->orderByDesc('date_arrivee')
            ->take(10)
            ->get()
            ->map(fn ($r) => [
                'id'          => $r->id,
                'reference'   => $r->reference,
                'voyageur'    => trim(optional($r->voyageur?->user)->prenom . ' ' . optional($r->voyageur?->user)->nom) ?: 'Inconnu',
                'date_arrivee'=> $r->date_arrivee->format('d/m/Y'),
                'date_depart' => $r->date_depart->format('d/m/Y'),
                'nb_nuits'    => $r->date_arrivee->diffInDays($r->date_depart),
                'statut'      => $r->statut,
                'montant'     => number_format($r->montant_total ?? 0, 0, ',', ' ') . ' ' . ($r->devise ?? 'XOF'),
            ]);

        return Inertia::render('partenaire/hebergement', [
            'hebergement' => [
                'id'          => $h->id,
                'nom'         => $h->nom,
                'ville'       => $h->ville ?? '',
                'pays'        => $h->pays ?? '',
                'adresse'     => $h->adresse ?? '',
                'type'        => $h->type ?? '',
                'description' => $h->description ?? '',
                'actif'       => (bool) $h->actif,
                'certifie'    => (bool) ($h->certifie ?? false),
                'note'        => (float) ($h->note_moyenne ?? 0),
                'nb_avis'     => $h->nb_avis ?? 0,
                'created_at'  => $h->created_at->format('d/m/Y'),
            ],
            'reservations' => $reservations,
        ]);
    }

    public function toggleActif(int $id): RedirectResponse
    {
        $h = Hebergement::where('user_id', auth()->id())->findOrFail($id);
        $h->update(['actif' => !$h->actif]);

        return back()->with('success', 'Statut mis à jour.');
    }
}