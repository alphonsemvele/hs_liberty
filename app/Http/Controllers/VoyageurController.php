<?php

namespace App\Http\Controllers;

use App\Models\Voyageur;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class VoyageurController extends Controller
{
    public function index(): Response
    {
        $voyageurs = Voyageur::with('user')
            ->withCount('reservations')
            ->whereNull('deleted_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($v) => [
                'id'               => $v->id,
                'initials'         => strtoupper(
                    substr(optional($v->user)->prenom ?? '?', 0, 1) .
                    substr(optional($v->user)->nom    ?? '?', 0, 1)
                ),
                'nom'              => trim(optional($v->user)->prenom . ' ' . optional($v->user)->nom) ?: 'Inconnu',
                'email'            => optional($v->user)->email ?? '',
                'telephone'        => $v->telephone ?? '',
                'type_handicap'    => $v->type_handicap,
                'niveau_dependance'=> $v->niveau_dependance,
                'reservations'     => $v->reservations_count,
                'inscription'      => $v->created_at->format('d/m/Y'),
                'actif'            => (bool) optional($v->user)->actif,
            ]);

        return Inertia::render('dashboard/voyageurs/index', [
            'voyageurs' => $voyageurs,
            'stats' => [
                'total'               => Voyageur::whereNull('deleted_at')->count(),
                'actifs'              => Voyageur::whereNull('deleted_at')
                                            ->whereHas('user', fn($q) => $q->where('actif', true))
                                            ->count(),
                'inactifs'            => Voyageur::whereNull('deleted_at')
                                            ->whereHas('user', fn($q) => $q->where('actif', false))
                                            ->count(),
                'avec_profil_medical' => 0,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('dashboard/voyageurs/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'prenom'               => 'required|string|max:100',
            'nom'                  => 'required|string|max:100',
            'email'                => 'required|email|max:255|unique:users,email',
            'telephone'            => 'required|string|max:30',
            'date_naissance'       => 'nullable|date',
            'nationalite'          => 'nullable|string|max:2',
            'pays_residence'       => 'required|string|max:2',
            'type_handicap'        => 'required|in:moteur,sensoriel,cognitif,polyhandicap,psychiatrique,autre',
            'niveau_dependance'    => 'required|integer|min:1|max:5',
            'equipements'          => 'nullable|array',
            'contact_urgence_nom'  => 'required|string|max:200',
            'contact_urgence_tel'  => 'required|string|max:30',
            'contact_urgence_lien' => 'nullable|string|max:100',
            'consentement_rgpd'    => 'accepted',
        ]);

        $nomComplet = $validated['prenom'] . ' ' . $validated['nom'];

        // 1. Créer le compte user
        $user = User::create([
            'name'              => $nomComplet,
            'prenom'            => $validated['prenom'],
            'nom'               => $validated['nom'],
            'email'             => $validated['email'],
            'password'          => Hash::make(\Illuminate\Support\Str::random(16)),
            'role'              => 'voyageur',
            'actif'             => true,
            'consentement_rgpd' => true,
            'consentement_le'   => now(),
        ]);

        // 2. Créer le profil voyageur
        $voyageur = Voyageur::create([
            'user_id'              => $user->id,
            'telephone'            => $validated['telephone'],
            'date_naissance'       => $validated['date_naissance'] ?? null,
            'nationalite'          => $validated['nationalite'] ?? null,
            'pays_residence'       => strtoupper($validated['pays_residence']),
            'type_handicap'        => $validated['type_handicap'],
            'niveau_dependance'    => $validated['niveau_dependance'],
            'contact_urgence_nom'  => $validated['contact_urgence_nom'],
            'contact_urgence_tel'  => $validated['contact_urgence_tel'],
            'contact_urgence_lien' => $validated['contact_urgence_lien'] ?? null,
        ]);

        // 3. Lier équipements — IDs uniquement (ignorer les libellés texte)
        if (!empty($validated['equipements'])) {
            $ids = array_values(array_map('intval',
                array_filter($validated['equipements'], 'is_numeric')
            ));
            if (!empty($ids)) {
                $voyageur->equipements()->sync($ids);
            }
        }

        return redirect()
            ->route('voyageurs.show', $voyageur->id)
            ->with('success', 'Profil créé — ' . $nomComplet);
    }

    public function show(int $id): Response
    {
        $v = Voyageur::with([
            'user',
            'reservations.hebergement',
            'aidants.user',
        ])->findOrFail($id);

        return Inertia::render('dashboard/voyageurs/show', [
            'voyageur' => [
                'id'               => $v->id,
                'initials'         => strtoupper(
                    substr(optional($v->user)->prenom ?? '?', 0, 1) .
                    substr(optional($v->user)->nom    ?? '?', 0, 1)
                ),
                'nom'              => trim(optional($v->user)->prenom . ' ' . optional($v->user)->nom) ?: 'Inconnu',
                'email'            => optional($v->user)->email ?? '',
                'telephone'        => $v->telephone ?? '',
                'type_handicap'    => $v->type_handicap,
                'niveau_dependance'=> $v->niveau_dependance,
                'reservations'     => $v->reservations()->count(),
                'inscription'      => $v->created_at->format('d/m/Y'),
                'actif'            => (bool) optional($v->user)->actif,
            ],
            'reservations' => $v->reservations->map(fn ($r) => [
                'ref'         => $r->reference,
                'hebergement' => optional($r->hebergement)->nom ?? 'Inconnu',
                'dates'       => $r->date_arrivee->format('d M') . '–' . $r->date_depart->format('d M Y'),
                'statut'      => ucfirst($r->statut),
                'montant'     => number_format($r->montant_total, 0, ',', ' ') . ' ' . $r->devise,
            ]),
            'aidants' => $v->aidants->map(fn ($a) => [
                'nom'       => trim(optional($a->user)->prenom . ' ' . optional($a->user)->nom) ?: 'Inconnu',
                'lien'      => $a->lien_parente ?? '',
                'telephone' => $a->telephone ?? '',
            ]),
        ]);
    }

    public function edit(int $id): Response
    {
        $v = Voyageur::with('user')->findOrFail($id);

        return Inertia::render('dashboard/voyageurs/edit', [
            'voyageur' => [
                'id'                   => $v->id,
                'prenom'               => optional($v->user)->prenom ?? '',
                'nom'                  => optional($v->user)->nom ?? '',
                'email'                => optional($v->user)->email ?? '',
                'telephone'            => $v->telephone ?? '',
                'date_naissance'       => $v->date_naissance?->format('Y-m-d'),
                'nationalite'          => $v->nationalite ?? '',
                'pays_residence'       => $v->pays_residence ?? '',
                'type_handicap'        => $v->type_handicap,
                'niveau_dependance'    => $v->niveau_dependance,
                'contact_urgence_nom'  => $v->contact_urgence_nom ?? '',
                'contact_urgence_tel'  => $v->contact_urgence_tel ?? '',
                'contact_urgence_lien' => $v->contact_urgence_lien ?? '',
            ],
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $v = Voyageur::with('user')->findOrFail($id);

        $validated = $request->validate([
            'prenom'               => 'required|string|max:100',
            'nom'                  => 'required|string|max:100',
            'telephone'            => 'required|string|max:30',
            'date_naissance'       => 'nullable|date',
            'nationalite'          => 'nullable|string|max:2',
            'pays_residence'       => 'required|string|max:2',
            'type_handicap'        => 'required|in:moteur,sensoriel,cognitif,polyhandicap,psychiatrique,autre',
            'niveau_dependance'    => 'required|integer|min:1|max:5',
            'contact_urgence_nom'  => 'required|string|max:200',
            'contact_urgence_tel'  => 'required|string|max:30',
            'contact_urgence_lien' => 'nullable|string|max:100',
        ]);

        optional($v->user)->update([
            'name'   => $validated['prenom'] . ' ' . $validated['nom'],
            'prenom' => $validated['prenom'],
            'nom'    => $validated['nom'],
        ]);

        $v->update([
            'telephone'            => $validated['telephone'],
            'date_naissance'       => $validated['date_naissance'] ?? null,
            'nationalite'          => $validated['nationalite'] ?? null,
            'pays_residence'       => strtoupper($validated['pays_residence']),
            'type_handicap'        => $validated['type_handicap'],
            'niveau_dependance'    => $validated['niveau_dependance'],
            'contact_urgence_nom'  => $validated['contact_urgence_nom'],
            'contact_urgence_tel'  => $validated['contact_urgence_tel'],
            'contact_urgence_lien' => $validated['contact_urgence_lien'] ?? null,
        ]);

        return redirect()
            ->route('voyageurs.show', $v->id)
            ->with('success', 'Profil mis à jour.');
    }

    public function toggleActif(int $id): RedirectResponse
    {
        $v = Voyageur::with('user')->findOrFail($id);
        optional($v->user)->update(['actif' => !optional($v->user)->actif]);

        return redirect()
            ->route('voyageurs.show', $v->id)
            ->with('success', 'Statut mis à jour.');
    }
}