<?php

namespace App\Http\Controllers\Transporteur;

use App\Http\Controllers\Controller;
use App\Models\TransportAdapte;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseTransporteurController extends Controller
{
    public function index(): Response
    {
        $courses = TransportAdapte::where('user_id', auth()->id())
            ->with('voyageur.user')
            ->orderByDesc('date_heure')
            ->get()
            ->map(fn ($t) => [
                'id'             => $t->id,
                'reference'      => $t->reference,
                'voyageur'       => trim(optional($t->voyageur?->user)->prenom . ' ' . optional($t->voyageur?->user)->nom) ?: 'Inconnu',
                'initials'       => strtoupper(
                    substr(optional($t->voyageur?->user)->prenom ?? '?', 0, 1) .
                    substr(optional($t->voyageur?->user)->nom    ?? '?', 0, 1)
                ),
                'type_vehicule'  => $t->type_vehicule,
                'ville_depart'   => $t->ville_depart,
                'adresse_depart' => $t->adresse_depart,
                'ville_arrivee'  => $t->ville_arrivee,
                'adresse_arrivee'=> $t->adresse_arrivee,
                'date_heure'     => $t->date_heure?->format('d/m/Y H:i') ?? '—',
                'statut'         => $t->statut,
                'montant'        => $t->montant > 0 ? number_format($t->montant, 0, ',', ' ') . ' ' . $t->devise : '—',
                'instructions'   => $t->instructions ?? '',
                'equipements'    => is_array($t->equipements_json) ? $t->equipements_json : [],
            ]);

        return Inertia::render('transporteur/courses', [
            'courses' => $courses,
        ]);
    }

    public function updateStatut(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'statut' => 'required|in:confirme,en_cours,termine,annule',
        ]);

        TransportAdapte::where('user_id', auth()->id())
            ->findOrFail($id)
            ->update(['statut' => $request->statut]);

        return back()->with('success', 'Statut mis à jour.');
    }
}