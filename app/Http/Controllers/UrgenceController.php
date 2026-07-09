<?php

namespace App\Http\Controllers;

use App\Models\Urgence;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UrgenceController extends Controller
{
    // GET /urgences
    public function index(): Response
    {
        $urgences = Urgence::with(['voyageur.user', 'operateur'])
            ->orderByDesc('declenchee_le')
            ->get()
            ->map(fn ($u) => $this->formatUrgence($u));

        return Inertia::render('dashboard/urgences/index', [
            'urgences' => $urgences,
            'stats' => [
                'total'          => Urgence::count(),
                'declenchees'    => Urgence::where('statut', 'declenche')->count(),
                'en_traitement'  => Urgence::where('statut', 'en_traitement')->count(),
                'resolues'       => Urgence::where('statut', 'resolu')->count(),
            ],
        ]);
    }

    // GET /urgences/{id}
    public function show(int $id): Response
    {
        $u = Urgence::with(['voyageur.user', 'reservation.hebergement', 'operateur'])
            ->findOrFail($id);

        return Inertia::render('dashboard/urgences/show', [
            'urgence' => array_merge($this->formatUrgence($u), [
                'description'        => $u->description ?? '',
                'notes_resolution'   => $u->notes_resolution ?? '',
                'adresse'            => $u->adresse_approximative ?? '',
                'latitude'           => $u->latitude,
                'longitude'          => $u->longitude,
                'prise_en_charge_le' => $u->prise_en_charge_le?->format('d/m/Y H:i'),
                'resolue_le'         => $u->resolue_le?->format('d/m/Y H:i'),
                'operateur'          => optional($u->operateur)->name ?? '—',
                'hebergement'        => optional($u->reservation?->hebergement)->nom ?? '—',
            ]),
        ]);
    }

    // PATCH /urgences/{id}/statut
    public function updateStatut(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'statut'           => 'required|in:declenche,en_traitement,resolu',
            'notes_resolution' => 'nullable|string|max:1000',
        ]);

        $u = Urgence::findOrFail($id);
        $data = ['statut' => $request->statut];

        if ($request->statut === 'en_traitement' && !$u->prise_en_charge_le) {
            $data['prise_en_charge_le'] = now();
        }
        if ($request->statut === 'resolu') {
            $data['resolue_le'] = now();
            if ($request->notes_resolution) {
                $data['notes_resolution'] = $request->notes_resolution;
            }
        }

        $u->update($data);

        return redirect()->route('urgences.show', $id)
            ->with('success', 'Statut mis à jour.');
    }

    // ── Helper ────────────────────────────────────────────────
    private function formatUrgence(Urgence $u): array
    {
        return [
            'id'           => $u->id,
            'reference'    => $u->reference ?? ('URG-' . $u->id),
            'voyageur'     => trim(optional($u->voyageur?->user)->prenom . ' ' . optional($u->voyageur?->user)->nom) ?: 'Inconnu',
            'initials'     => strtoupper(
                substr(optional($u->voyageur?->user)->prenom ?? '?', 0, 1) .
                substr(optional($u->voyageur?->user)->nom    ?? '?', 0, 1)
            ),
            'type'         => $u->type_urgence ?? 'autre',
            'statut'       => $u->statut ?? 'declenche',
            'localisation' => $u->adresse_approximative ?? '—',
            'declenchee_le'=> $u->declenchee_le?->format('d/m/Y H:i') ?? $u->created_at->format('d/m/Y H:i'),
            'depuis'       => $u->declenchee_le?->diffForHumans() ?? $u->created_at->diffForHumans(),
        ];
    }
}