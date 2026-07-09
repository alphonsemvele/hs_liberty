<?php

namespace App\Http\Controllers\Transporteur;

use App\Http\Controllers\Controller;
use App\Models\TransportAdapte;
use Inertia\Inertia;
use Inertia\Response;

class DashboardTransporteurController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $courses = TransportAdapte::where('user_id', $user->id)
            ->with('voyageur.user')
            ->orderByDesc('date_heure')
            ->get();

        $aVenir = $courses->whereIn('statut', ['en_attente', 'confirme'])
            ->sortBy('date_heure')
            ->take(5)
            ->map(fn ($t) => $this->format($t));

        return Inertia::render('transporteur/index', [
            'transporteur' => [
                'prenom' => $user->prenom ?? $user->name ?? 'Transporteur',
                'nom'    => $user->nom ?? '',
            ],
            'courses_a_venir' => $aVenir->values(),
            'stats' => [
                'total'      => $courses->count(),
                'a_venir'    => $courses->whereIn('statut', ['en_attente','confirme'])->count(),
                'en_cours'   => $courses->where('statut', 'en_cours')->count(),
                'terminees'  => $courses->where('statut', 'termine')->count(),
            ],
        ]);
    }

    private function format(TransportAdapte $t): array
    {
        return [
            'id'            => $t->id,
            'reference'     => $t->reference,
            'voyageur'      => trim(optional($t->voyageur?->user)->prenom . ' ' . optional($t->voyageur?->user)->nom) ?: 'Inconnu',
            'initials'      => strtoupper(
                substr(optional($t->voyageur?->user)->prenom ?? '?', 0, 1) .
                substr(optional($t->voyageur?->user)->nom    ?? '?', 0, 1)
            ),
            'type_vehicule' => $t->type_vehicule,
            'ville_depart'  => $t->ville_depart,
            'ville_arrivee' => $t->ville_arrivee,
            'adresse_depart'=> $t->adresse_depart,
            'adresse_arrivee'=> $t->adresse_arrivee,
            'date_heure'    => $t->date_heure?->format('d/m/Y H:i') ?? '—',
            'statut'        => $t->statut,
            'montant'       => $t->montant > 0 ? number_format($t->montant, 0, ',', ' ') . ' ' . $t->devise : '—',
        ];
    }
}