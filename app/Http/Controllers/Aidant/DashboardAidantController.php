<?php

namespace App\Http\Controllers\Aidant;

use App\Http\Controllers\Controller;
use App\Models\Aidant;
use App\Models\SuiviAidant;
use App\Models\Urgence;
use Inertia\Inertia;
use Inertia\Response;

class DashboardAidantController extends Controller
{
    public function index(): Response
    {
        $user   = auth()->user();
        $aidant = Aidant::where('user_id', $user->id)->first();

        // Pas encore de profil aidant → dashboard vide
        if (!$aidant) {
            return Inertia::render('aidant/index', [
                'aidant'           => [
                    'prenom' => $user->prenom ?? $user->name ?? 'Aidant',
                    'nom'    => $user->nom ?? '',
                ],
                'voyageurs'        => [],
                'nb_voyageurs'     => 0,
                'urgences_actives' => 0,
            ]);
        }

        $voyageurs = SuiviAidant::where('aidant_id', $aidant->id)
            ->with([
                'voyageur.user',
                'voyageur.reservations' => fn($q) => $q
                    ->where('statut', 'confirmee')
                    ->orderBy('date_arrivee')
                    ->with('hebergement'),
            ])
            ->get()
            ->map(fn ($s) => [
                'id'                => $s->voyageur_id,
                'suivi_id'          => $s->id,
                'nom'               => trim(optional($s->voyageur?->user)->prenom . ' ' . optional($s->voyageur?->user)->nom) ?: 'Inconnu',
                'initials'          => strtoupper(
                    substr(optional($s->voyageur?->user)->prenom ?? '?', 0, 1) .
                    substr(optional($s->voyageur?->user)->nom    ?? '?', 0, 1)
                ),
                'type_handicap'     => $s->voyageur?->type_handicap ?? '—',
                'niveau_dependance' => $s->voyageur?->niveau_dependance ?? 1,
                'statut_suivi'      => $s->statut ?? 'actif',
                'prochain_sejour'   => $s->voyageur?->reservations->first()?->date_arrivee?->format('d/m/Y') ?? null,
                'hebergement'       => $s->voyageur?->reservations->first()?->hebergement?->nom ?? null,
                'urgence_active'    => Urgence::where('voyageur_id', $s->voyageur_id)
                                        ->whereIn('statut', ['declenche', 'en_traitement'])
                                        ->exists(),
            ]);

        return Inertia::render('aidant/index', [
            'aidant' => [
                'prenom' => $user->prenom ?? $user->name ?? 'Aidant',
                'nom'    => $user->nom ?? '',
            ],
            'voyageurs'        => $voyageurs,
            'nb_voyageurs'     => $voyageurs->count(),
            'urgences_actives' => $voyageurs->where('urgence_active', true)->count(),
        ]);
    }
}