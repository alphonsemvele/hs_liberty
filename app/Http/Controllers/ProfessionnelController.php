<?php

namespace App\Http\Controllers;

use App\Models\Professionnel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ProfessionnelController extends Controller
{
    // GET /professionnels
    public function index(): Response
    {
        $profs = Professionnel::with('user')
            ->whereNull('deleted_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($p) => [
                'id'         => $p->id,
                'initials'   => strtoupper(
                    substr(optional($p->user)->prenom ?? '?', 0, 1) .
                    substr(optional($p->user)->nom    ?? '?', 0, 1)
                ),
                'nom'        => trim(optional($p->user)->prenom . ' ' . optional($p->user)->nom) ?: 'Inconnu',
                'email'      => optional($p->user)->email ?? '',
                'telephone'  => optional($p->user)->telephone ?? '',
                'specialite' => $p->specialite_autre ?: $p->specialite,
                'pays'       => '',  // stocké dans professionnel_pays
                'certifie'   => (bool) $p->certifie,
                'actif'      => (bool) optional($p->user)->actif,
                'nb_soins'   => $p->prestations()->count(),
                'note'       => (float) ($p->note_moyenne ?? 0),
                'created_at' => $p->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('dashboard/professionnels/index', [
            'professionnels' => $profs,
            'stats' => [
                'total'       => $profs->count(),
                'certifies'   => $profs->where('certifie', true)->count(),
                'actifs'      => $profs->where('actif', true)->count(),
                'specialites' => $profs->pluck('specialite')->filter()->unique()->count(),
            ],
        ]);
    }

    // GET /professionnels/create
    public function create(): Response
    {
        return Inertia::render('dashboard/professionnels/create');
    }

    // POST /professionnels
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'prenom'          => 'required|string|max:100',
            'nom'             => 'required|string|max:100',
            'email'           => 'required|email|max:255|unique:users,email',
            'telephone'       => 'required|string|max:30',
            'specialite'      => 'required|in:infirmiere,kinesitherapeute,auxiliaire_vie,aide_soignant,medecin,ergotherapeute,orthophoniste,autre',
            'specialite_autre'=> 'nullable|string|max:100',
            'numero_rpps'     => 'nullable|string|max:50',
            'tarif_horaire'   => 'nullable|numeric|min:0',
            'devise'          => 'nullable|string|max:3',
            'bio'             => 'nullable|string|max:5000',
        ]);

        // 1. Créer le compte user (telephone stocké sur users via le formulaire)
        $user = User::create([
            'name'     => $request->prenom . ' ' . $request->nom,
            'prenom'   => $request->prenom,
            'nom'      => $request->nom,
            'email'    => $request->email,
            'password' => Hash::make(\Illuminate\Support\Str::random(16)),
            'role'     => 'professionnel_sante',
            'actif'    => true,
        ]);

        // 2. Créer le profil professionnel avec les colonnes qui existent
        $prof = Professionnel::create([
            'user_id'          => $user->id,
            'specialite'       => $request->specialite,
            'specialite_autre' => $request->specialite_autre,
            'numero_rpps'      => $request->numero_rpps,
            'tarif_horaire'    => $request->tarif_horaire ?? 0,
            'devise'           => $request->devise ?? 'XOF',
            'bio'              => $request->bio,
            'certifie'         => false,
            'diplome_valide'   => false,
            'assurance_rc'     => false,
        ]);

        return redirect()
            ->route('professionnels.show', $prof->id)
            ->with('success', 'Profil créé — ' . $request->prenom . ' ' . $request->nom);
    }

    // GET /professionnels/{id}
    public function show(int $id): Response
    {
        $p = Professionnel::with(['user', 'prestations.voyageur.user'])
            ->findOrFail($id);

        $prestations = $p->prestations()
            ->with('voyageur.user')
            ->orderByDesc('created_at')
            ->take(10)
            ->get()
            ->map(fn ($s) => [
                'id'       => $s->id,
                'voyageur' => trim(optional($s->voyageur?->user)->prenom . ' ' . optional($s->voyageur?->user)->nom) ?: 'Inconnu',
                'type'     => $s->type_soin ?? '',
                'date'     => $s->created_at->format('d/m/Y'),
                'statut'   => $s->statut ?? 'realise',
            ]);

        return Inertia::render('dashboard/professionnels/show', [
            'professionnel' => [
                'id'              => $p->id,
                'initials'        => strtoupper(
                    substr(optional($p->user)->prenom ?? '?', 0, 1) .
                    substr(optional($p->user)->nom    ?? '?', 0, 1)
                ),
                'nom'             => trim(optional($p->user)->prenom . ' ' . optional($p->user)->nom) ?: 'Inconnu',
                'email'           => optional($p->user)->email ?? '',
                'telephone'       => optional($p->user)->telephone ?? '',
                'specialite'      => $p->specialite_autre ?: $p->specialite,
                'pays_exercice'   => '',
                'numero_ordre'    => $p->numero_rpps ?? '',
                'certifie'        => (bool) $p->certifie,
                'diplome_valide'  => (bool) $p->diplome_valide,
                'assurance_rc'    => (bool) $p->assurance_rc,
                'tarif_horaire'   => $p->tarif_horaire,
                'devise'          => $p->devise,
                'bio'             => $p->bio ?? '',
                'actif'           => (bool) optional($p->user)->actif,
                'note'            => (float) ($p->note_moyenne ?? 0),
                'nb_soins'        => $p->prestations()->count(),
                'created_at'      => $p->created_at->format('d/m/Y'),
            ],
            'prestations_recentes' => $prestations,
        ]);
    }

    // PATCH /professionnels/{id}/toggle
    public function toggleActif(int $id): RedirectResponse
    {
        $p = Professionnel::with('user')->findOrFail($id);
        optional($p->user)->update(['actif' => !optional($p->user)->actif]);

        return redirect()->route('professionnels.show', $id)
            ->with('success', 'Statut mis à jour.');
    }
}