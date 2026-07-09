<?php

namespace App\Http\Controllers;

use App\Models\Avis;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AvisController extends Controller
{
    public function index(): Response
    {
        $avis = Avis::with(['voyageur.user', 'hebergement'])
            ->where('masque', false)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($a) => [
                'id'                => $a->id,
                'initials'          => strtoupper(
                    substr(optional($a->voyageur?->user)->prenom ?? '?', 0, 1) .
                    substr(optional($a->voyageur?->user)->nom    ?? '?', 0, 1)
                ),
                'voyageur'          => trim(optional($a->voyageur?->user)->prenom . ' ' . optional($a->voyageur?->user)->nom) ?: 'Inconnu',
                'hebergement'       => optional($a->hebergement)->nom ?? 'Inconnu',
                'note_globale'      => $a->note_globale,
                'note_accessibilite'=> $a->note_accessibilite,
                'note_equipements'  => $a->note_equipements,
                'commentaire'       => $a->commentaire ?? '',
                'date'              => $a->created_at->format('d/m/Y'),
                'verifie'           => (bool) $a->verifie,
                'reponse_partenaire'=> $a->reponse_partenaire,
            ]);

        $total      = Avis::where('masque', false)->count();
        $noteMoy    = $total > 0 ? round(Avis::where('masque', false)->avg('note_globale'), 1) : 0;
        $cinqEtoiles= $total > 0 ? round(Avis::where('masque', false)->where('note_globale', 5)->count() / $total * 100) : 0;
        $ceMois     = Avis::where('masque', false)->whereMonth('created_at', now()->month)->count();
        $moderation = Avis::where('masque', false)->where('verifie', false)->count();

        return Inertia::render('dashboard/avis/index', [
            'avis'  => $avis,
            'stats' => [
                'total'                 => $total,
                'note_moyenne'          => $noteMoy,
                'taux_5_etoiles'        => $cinqEtoiles,
                'avis_ce_mois'          => $ceMois,
                'en_attente_moderation' => $moderation,
            ],
        ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        Avis::findOrFail($id)->update(['masque' => true]);

        return redirect()
            ->route('avis.index')
            ->with('success', 'Avis masqué.');
    }
}