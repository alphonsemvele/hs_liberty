<?php

namespace App\Http\Controllers\Professionnel;

use App\Http\Controllers\Controller;
use App\Models\Professionnel;
use App\Models\PrestationSoin;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanningProfessionnelController extends Controller
{
    public function index(): Response
    {
        $prof = Professionnel::where('user_id', auth()->id())->first();

        if (!$prof) {
            return Inertia::render('professionnel/planning', ['semaine' => [], 'semaine_label' => '']);
        }

        // Interventions des 7 prochains jours
        $debut = now()->startOfWeek();
        $fin   = now()->endOfWeek();

        $interventions = PrestationSoin::where('professionnel_id', $prof->id)
            ->where('statut', 'planifie')
            ->with('voyageur.user')
            ->orderBy('created_at')
            ->get()
            ->map(fn ($p) => [
                'id'       => $p->id,
                'voyageur' => trim(optional($p->voyageur?->user)->prenom . ' ' . optional($p->voyageur?->user)->nom) ?: 'Inconnu',
                'initials' => strtoupper(
                    substr(optional($p->voyageur?->user)->prenom ?? '?', 0, 1) .
                    substr(optional($p->voyageur?->user)->nom    ?? '?', 0, 1)
                ),
                'type'     => $p->type_soin ?? '—',
                'date'     => $p->created_at->format('Y-m-d'),
                'jour'     => $p->created_at->locale('fr')->dayName,
                'heure'    => $p->created_at->format('H:i'),
                'duree'    => $p->duree_minutes ?? 60,
                'statut'   => $p->statut ?? 'planifie',
            ]);

        return Inertia::render('professionnel/planning', [
            'interventions'  => $interventions,
            'semaine_label'  => $debut->format('d') . ' – ' . $fin->format('d M Y'),
        ]);
    }
}