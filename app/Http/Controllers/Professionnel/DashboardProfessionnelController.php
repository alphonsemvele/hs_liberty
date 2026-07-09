<?php

namespace App\Http\Controllers\Professionnel;

use App\Http\Controllers\Controller;
use App\Models\Professionnel;
use App\Models\PrestationSoin;
use Inertia\Inertia;
use Inertia\Response;

class DashboardProfessionnelController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $prof = Professionnel::where('user_id', $user->id)->first();

        if (!$prof) {
            return Inertia::render('professionnel/index', [
                'professionnel'      => [
                    'prenom'      => $user->prenom ?? $user->name ?? 'Professionnel',
                    'nom'         => $user->nom ?? '',
                    'specialite'  => null,
                    'certifie'    => false,
                    'tarif'       => null,
                    'devise'      => 'XOF',
                    'note'        => 0,
                    'nb_avis'     => 0,
                ],
                'interventions_recentes' => [],
                'stats' => ['total' => 0, 'ce_mois' => 0, 'en_attente' => 0, 'revenus' => '0'],
            ]);
        }

        $interventions = PrestationSoin::where('professionnel_id', $prof->id)
            ->with('voyageur.user')
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(fn ($p) => [
                'id'       => $p->id,
                'voyageur' => trim(optional($p->voyageur?->user)->prenom . ' ' . optional($p->voyageur?->user)->nom) ?: 'Inconnu',
                'initials' => strtoupper(
                    substr(optional($p->voyageur?->user)->prenom ?? '?', 0, 1) .
                    substr(optional($p->voyageur?->user)->nom    ?? '?', 0, 1)
                ),
                'type'     => $p->type_soin ?? '—',
                'date'     => $p->created_at->format('d/m/Y'),
                'statut'   => $p->statut ?? 'realise',
                'montant'  => $p->montant ? number_format($p->montant, 0, ',', ' ') . ' ' . ($p->devise ?? 'XOF') : '—',
            ]);

        $total    = PrestationSoin::where('professionnel_id', $prof->id)->count();
        $ceMois   = PrestationSoin::where('professionnel_id', $prof->id)
                        ->whereMonth('created_at', now()->month)->count();
        $enAttente= PrestationSoin::where('professionnel_id', $prof->id)
                        ->where('statut', 'planifie')->count();
        $revenus  = PrestationSoin::where('professionnel_id', $prof->id)
                        ->whereMonth('created_at', now()->month)
                        ->sum('montant');

        return Inertia::render('professionnel/index', [
            'professionnel' => [
                'prenom'     => $user->prenom ?? $user->name ?? 'Professionnel',
                'nom'        => $user->nom ?? '',
                'specialite' => $prof->specialite_autre ?: $prof->specialite,
                'certifie'   => (bool) $prof->certifie,
                'tarif'      => $prof->tarif_horaire,
                'devise'     => $prof->devise ?? 'XOF',
                'note'       => (float) ($prof->note_moyenne ?? 0),
                'nb_avis'    => $prof->nb_avis ?? 0,
            ],
            'interventions_recentes' => $interventions,
            'stats' => [
                'total'     => $total,
                'ce_mois'   => $ceMois,
                'en_attente'=> $enAttente,
                'revenus'   => number_format($revenus, 0, ',', ' '),
            ],
        ]);
    }
}