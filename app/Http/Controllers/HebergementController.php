<?php

namespace App\Http\Controllers;

use App\Models\Hebergement;
use App\Models\Equipement;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HebergementController extends Controller
{
    public function index(): Response
    {
        $hebergements = Hebergement::withCount('reservations')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($h) => [
                'id'           => $h->id,
                'nom'          => $h->nom,
                'ville'        => $h->ville,
                'pays'         => $h->pays,
                'niveau_certif'=> $h->niveau_certification !== 'non_certifie'
                                    ? ucwords(str_replace('_', ' ', $h->niveau_certification))
                                    : null,
                'note'         => (float) $h->note_moyenne,
                'reservations' => $h->reservations_count,
                'actif'        => (bool) $h->actif,
                'created_at'   => $h->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('dashboard/hebergements/index', [
            'hebergements' => $hebergements,
            'stats' => [
                'total'         => Hebergement::count(),
                'certifies'     => Hebergement::where('niveau_certification', '!=', 'non_certifie')->count(),
                'non_certifies' => Hebergement::where('niveau_certification', 'non_certifie')->count(),
                'inactifs'      => Hebergement::where('actif', false)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('dashboard/hebergements/create', [
            'equipements_dispo' => Equipement::orderBy('categorie')
                ->orderBy('libelle')
                ->get(['id', 'code', 'libelle', 'categorie']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nom'           => 'required|string|max:300',
            'adresse'       => 'required|string|max:500',
            'ville'         => 'required|string|max:150',
            'pays'          => 'required|string|min:2|max:2',
            'code_postal'   => 'nullable|string|max:20',
            // ← nullable|string au lieu de numeric — on nettoie manuellement
            'latitude'      => 'nullable|string',
            'longitude'     => 'nullable|string',
            'description'   => 'nullable|string',
            'type'          => 'nullable|string',
            'prix_nuit_min' => 'nullable|numeric|min:0',
            'prix_nuit_max' => 'nullable|numeric|min:0',
            'devise'        => 'nullable|string|max:3',
            'niveau_certif' => 'nullable|string',
            'equipements'   => 'nullable|array',
            'equipements.*' => 'integer|exists:equipements,id',
        ]);

        $niveauMap = [
            'accessible'      => 'accessible',
            'accessible_plus' => 'accessible_plus',
            'excellence'      => 'excellence',
            'Accessible'      => 'accessible',
            'Accessible Plus' => 'accessible_plus',
            'Excellence'      => 'excellence',
        ];

        // Latitude/longitude : on garde null si la valeur n'est pas numérique
        $latitude  = is_numeric($validated['latitude']  ?? null) ? (float) $validated['latitude']  : null;
        $longitude = is_numeric($validated['longitude'] ?? null) ? (float) $validated['longitude'] : null;

        $hebergement = Hebergement::create([
            'user_id'             => auth()->id(),
            'nom'                 => $validated['nom'],
            'adresse'             => $validated['adresse'],
            'ville'               => $validated['ville'],
            'pays'                => strtoupper(trim($validated['pays'])),
            'code_postal'         => $validated['code_postal'] ?? null,
            'latitude'            => $latitude,
            'longitude'           => $longitude,
            'description'         => $validated['description'] ?? null,
            'type'                => $validated['type'] ?? 'hotel',
            'prix_nuit_min'       => $validated['prix_nuit_min'] ?? 0,
            'prix_nuit_max'       => $validated['prix_nuit_max'] ?? 0,
            'devise'              => $validated['devise'] ?? 'XOF',
            'niveau_certification'=> $niveauMap[$validated['niveau_certif'] ?? ''] ?? 'non_certifie',
            'actif'               => true,
        ]);

        if (!empty($validated['equipements'])) {
            $hebergement->equipements()->sync($validated['equipements']);
        }

        return redirect()
            ->route('hebergements.index')
            ->with('success', 'Hébergement créé avec succès.');
    }

    public function show(int $id): Response
    {
        $h = Hebergement::with('equipements')->findOrFail($id);

        return Inertia::render('dashboard/hebergements/show', [
            'hebergement' => [
                'id'           => $h->id,
                'nom'          => $h->nom,
                'ville'        => $h->ville,
                'pays'         => $h->pays,
                'niveau_certif'=> $h->niveau_certification !== 'non_certifie'
                                    ? ucwords(str_replace('_', ' ', $h->niveau_certification))
                                    : null,
                'note'         => (float) $h->note_moyenne,
                'reservations' => $h->reservations()->count(),
                'actif'        => (bool) $h->actif,
                'created_at'   => $h->created_at->format('d/m/Y'),
            ],
            'equipements'           => $h->equipements->pluck('libelle')->toArray(),
            'reservations_recentes' => [],
        ]);
    }

    public function edit(int $id): Response
    {
        $h = Hebergement::with('equipements')->findOrFail($id);

        return Inertia::render('hebergements/edit', [
            'hebergement' => [
                'id'            => $h->id,
                'nom'           => $h->nom,
                'adresse'       => $h->adresse,
                'ville'         => $h->ville,
                'pays'          => $h->pays,
                'code_postal'   => $h->code_postal,
                'latitude'      => $h->latitude,
                'longitude'     => $h->longitude,
                'description'   => $h->description,
                'type'          => $h->type,
                'prix_nuit_min' => $h->prix_nuit_min,
                'prix_nuit_max' => $h->prix_nuit_max,
                'devise'        => $h->devise,
                'niveau_certif' => $h->niveau_certification,
                'actif'         => $h->actif,
                'equipements'   => $h->equipements->pluck('id')->toArray(),
            ],
            'equipements_dispo' => Equipement::orderBy('categorie')
                ->orderBy('libelle')
                ->get(['id', 'code', 'libelle', 'categorie']),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $h = Hebergement::findOrFail($id);

        $validated = $request->validate([
            'nom'           => 'required|string|max:300',
            'adresse'       => 'required|string|max:500',
            'ville'         => 'required|string|max:150',
            'pays'          => 'required|string|min:2|max:2',
            'code_postal'   => 'nullable|string|max:20',
            'latitude'      => 'nullable|string',
            'longitude'     => 'nullable|string',
            'description'   => 'nullable|string',
            'type'          => 'nullable|string',
            'prix_nuit_min' => 'nullable|numeric|min:0',
            'prix_nuit_max' => 'nullable|numeric|min:0',
            'devise'        => 'nullable|string|max:3',
            'niveau_certif' => 'nullable|string',
            'equipements'   => 'nullable|array',
            'equipements.*' => 'integer|exists:equipements,id',
        ]);

        $niveauMap = [
            'accessible'      => 'accessible',
            'accessible_plus' => 'accessible_plus',
            'excellence'      => 'excellence',
            'Accessible'      => 'accessible',
            'Accessible Plus' => 'accessible_plus',
            'Excellence'      => 'excellence',
        ];

        $latitude  = is_numeric($validated['latitude']  ?? null) ? (float) $validated['latitude']  : null;
        $longitude = is_numeric($validated['longitude'] ?? null) ? (float) $validated['longitude'] : null;

        $h->update([
            'nom'                 => $validated['nom'],
            'adresse'             => $validated['adresse'],
            'ville'               => $validated['ville'],
            'pays'                => strtoupper(trim($validated['pays'])),
            'code_postal'         => $validated['code_postal'] ?? null,
            'latitude'            => $latitude,
            'longitude'           => $longitude,
            'description'         => $validated['description'] ?? null,
            'type'                => $validated['type'] ?? $h->type,
            'prix_nuit_min'       => $validated['prix_nuit_min'] ?? $h->prix_nuit_min,
            'prix_nuit_max'       => $validated['prix_nuit_max'] ?? $h->prix_nuit_max,
            'devise'              => $validated['devise'] ?? $h->devise,
            'niveau_certification'=> $niveauMap[$validated['niveau_certif'] ?? ''] ?? $h->niveau_certification,
        ]);

        $h->equipements()->sync($validated['equipements'] ?? []);

        return redirect()
            ->route('hebergements.show', $h->id)
            ->with('success', 'Hébergement mis à jour.');
    }

    public function toggleActif(int $id): RedirectResponse
    {
        $h = Hebergement::findOrFail($id);
        $h->update(['actif' => !$h->actif]);

        return redirect()->route('hebergements.show', $h->id);
    }

    public function destroy(int $id): RedirectResponse
    {
        Hebergement::findOrFail($id)->delete();

        return redirect()->route('hebergements.index');
    }
}