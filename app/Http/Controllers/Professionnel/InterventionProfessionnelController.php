<?php

namespace App\Http\Controllers\Professionnel;

use App\Http\Controllers\Controller;
use App\Models\Professionnel;
use App\Models\PrestationSoin;
use Inertia\Inertia;
use Inertia\Response;

class InterventionProfessionnelController extends Controller
{
    public function index(): Response
    {
        $prof = Professionnel::where('user_id', auth()->id())->first();

        if (!$prof) {
            return Inertia::render('professionnel/interventions', ['interventions' => []]);
        }

        $interventions = PrestationSoin::where('professionnel_id', $prof->id)
            ->with('voyageur.user')
            ->orderByDesc('created_at')
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
                'heure'    => $p->created_at->format('H:i'),
                'statut'   => $p->statut ?? 'realise',
                'duree'    => $p->duree_minutes ? $p->duree_minutes . ' min' : '—',
                'montant'  => $p->montant ? number_format($p->montant, 0, ',', ' ') . ' ' . ($p->devise ?? 'XOF') : '—',
                'notes'    => $p->notes ?? '',
            ]);

        return Inertia::render('professionnel/interventions', [
            'interventions' => $interventions,
        ]);
    }
}