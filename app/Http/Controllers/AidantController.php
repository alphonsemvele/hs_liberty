<?php

namespace App\Http\Controllers;

use App\Models\Aidant;
use App\Models\Voyageur;
use App\Models\SuiviAidant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AidantController extends Controller
{
    // ─────────────────────────────────────────────────────────
    // GET /aidants
    // ─────────────────────────────────────────────────────────
    public function index(): Response
    {
        $aidants = Aidant::with(['user', 'voyageurs.user'])
            ->get()
            ->map(fn ($a) => [
                'id'             => $a->id,
                'initials'       => strtoupper(
                    substr(optional($a->user)->prenom ?? '?', 0, 1) .
                    substr(optional($a->user)->nom    ?? '?', 0, 1)
                ),
                'nom'            => trim(optional($a->user)->prenom . ' ' . optional($a->user)->nom) ?: 'Inconnu',
                'email'          => optional($a->user)->email ?? '',
                'telephone'      => $a->telephone ?? '',
                'lien_parente'   => $a->lien_parente ?? '',
                'voyageur_suivi' => $this->premierVoyageurNom($a),
                'voyageur_id'    => $a->voyageurs->first()?->id ?? 0,
                'niveau_acces'   => $a->voyageurs->first()?->pivot?->niveau_acces ?? 'lecture',
                'actif_depuis'   => $a->created_at->format('d/m/Y'),
                'sejours_suivis' => $a->voyageurs->sum(fn ($v) => $v->reservations()->count()),
            ]);

        return Inertia::render('dashboard/aidants/index', [
            'aidants' => $aidants,
            'stats'   => [
                'total'          => Aidant::count(),
                'acces_ecriture' => SuiviAidant::where('niveau_acces', 'ecriture')->where('actif', true)->count(),
                'acces_lecture'  => SuiviAidant::where('niveau_acces', 'lecture')->where('actif', true)->count(),
                'acces_urgence'  => SuiviAidant::where('niveau_acces', 'urgence')->where('actif', true)->count(),
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────
    // GET /aidants/create
    // ─────────────────────────────────────────────────────────
    public function create(): Response
    {
        return Inertia::render('dashboard/aidants/create', [
            'voyageurs' => Voyageur::with('user')
                ->whereNull('deleted_at')
                ->get()
                ->map(fn ($v) => [
                    'id'               => $v->id,
                    'initials'         => strtoupper(
                        substr(optional($v->user)->prenom ?? '?', 0, 1) .
                        substr(optional($v->user)->nom    ?? '?', 0, 1)
                    ),
                    'nom'              => trim(optional($v->user)->prenom . ' ' . optional($v->user)->nom) ?: 'Inconnu',
                    'type_handicap'    => $v->type_handicap,
                    'niveau_dependance'=> $v->niveau_dependance,
                ]),
        ]);
    }

    // ─────────────────────────────────────────────────────────
    // POST /aidants
    // ─────────────────────────────────────────────────────────
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_voyageur'  => 'required|integer|exists:voyageurs,id',
            'prenom'       => 'required|string|max:100',
            'nom'          => 'required|string|max:100',
            'email'        => 'required|email|max:255|unique:users,email',
            'telephone'    => 'required|string|max:30',
            'lien_parente' => 'required|string|max:100',
            'niveau_acces' => 'required|in:lecture,ecriture,urgence',
            'consentement' => 'accepted',
        ]);

        // 1. Créer le compte user
        $user = User::create([
            'name'    => $validated['prenom'] . ' ' . $validated['nom'],
            'prenom'  => $validated['prenom'],
            'nom'     => $validated['nom'],
            'email'   => $validated['email'],
            'password'=> Hash::make(\Illuminate\Support\Str::random(16)),
            'role'    => 'aidant',
            'actif'   => true,
        ]);

        // 2. Créer le profil aidant
        $aidant = Aidant::create([
            'user_id'      => $user->id,
            'telephone'    => $validated['telephone'],
            'lien_parente' => $validated['lien_parente'],
        ]);

        // 3. Lier le voyageur avec le niveau d'accès
        SuiviAidant::create([
            'aidant_id'              => $aidant->id,
            'voyageur_id'            => $validated['id_voyageur'],
            'niveau_acces'           => $validated['niveau_acces'],
            'consentement_voyageur'  => false, // en attente de validation
            'actif'                  => true,
            'consentement_le'        => now(),
        ]);

        return redirect()
            ->route('aidants.show', $aidant->id)
            ->with('success', 'Invitation envoyée à ' . $validated['prenom'] . ' ' . $validated['nom'] . '.');
    }

    // ─────────────────────────────────────────────────────────
    // GET /aidants/{id}
    // ─────────────────────────────────────────────────────────
    public function show(int $id): Response
    {
        $a = Aidant::with(['user', 'voyageurs.user', 'voyageurs.reservations.hebergement'])
            ->findOrFail($id);

        $premierVoyageur = $a->voyageurs->first();
        $niveauAcces     = $premierVoyageur?->pivot?->niveau_acces ?? 'lecture';

        $sejours = collect();
        foreach ($a->voyageurs as $v) {
            foreach ($v->reservations as $r) {
                $sejours->push([
                    'ref'         => $r->reference,
                    'destination' => optional($r->hebergement)->nom ?? 'Inconnu',
                    'dates'       => $r->date_arrivee->format('d M') . '–' . $r->date_depart->format('d M Y'),
                    'statut'      => ucfirst($r->statut),
                    'urgences'    => 0,
                ]);
            }
        }

        return Inertia::render('dashboard/aidants/show', [
            'aidant' => [
                'id'             => $a->id,
                'initials'       => strtoupper(
                    substr(optional($a->user)->prenom ?? '?', 0, 1) .
                    substr(optional($a->user)->nom    ?? '?', 0, 1)
                ),
                'nom'            => trim(optional($a->user)->prenom . ' ' . optional($a->user)->nom) ?: 'Inconnu',
                'email'          => optional($a->user)->email ?? '',
                'telephone'      => $a->telephone ?? '',
                'lien_parente'   => $a->lien_parente ?? '',
                'voyageur_suivi' => $this->premierVoyageurNom($a),
                'voyageur_id'    => $premierVoyageur?->id ?? 0,
                'niveau_acces'   => $niveauAcces,
                'actif_depuis'   => $a->created_at->format('d/m/Y'),
                'sejours_suivis' => $sejours->count(),
            ],
            'sejours' => $sejours->values(),
        ]);
    }

    // ─────────────────────────────────────────────────────────
    // PATCH /aidants/{id}/niveau
    // ─────────────────────────────────────────────────────────
    public function updateNiveau(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'niveau_acces' => 'required|in:lecture,ecriture,urgence',
        ]);

        $aidant = Aidant::with('voyageurs')->findOrFail($id);
        $voyageurId = $aidant->voyageurs->first()?->id;

        if ($voyageurId) {
            SuiviAidant::where('aidant_id', $id)
                ->where('voyageur_id', $voyageurId)
                ->update(['niveau_acces' => $request->niveau_acces]);
        }

        return redirect()
            ->route('aidants.show', $id)
            ->with('success', 'Niveau d\'accès mis à jour.');
    }

    // ─────────────────────────────────────────────────────────
    // DELETE /aidants/{id}
    // ─────────────────────────────────────────────────────────
    public function destroy(int $id): RedirectResponse
    {
        $aidant = Aidant::findOrFail($id);
        SuiviAidant::where('aidant_id', $id)->delete();
        optional($aidant->user)->update(['actif' => false]);

        return redirect()
            ->route('aidants.index')
            ->with('success', 'Accès révoqué avec succès.');
    }

    // ── Helpers ───────────────────────────────────────────────
    private function premierVoyageurNom(Aidant $a): string
    {
        $v = $a->voyageurs->first();
        if (!$v) return '';
        return trim(optional($v->user)->prenom . ' ' . optional($v->user)->nom) ?: 'Inconnu';
    }
}