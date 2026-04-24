<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class VoyageurController extends Controller
{
    private function voyageurs(): array
    {
        return [
            [
                'id'                => 1,
                'initials'          => 'KD',
                'nom'               => 'Kofi Diarra',
                'email'             => 'kofi.d@email.com',
                'telephone'         => '+221 77 123 45 67',
                'type_handicap'     => 'moteur',
                'niveau_dependance' => 3,
                'reservations'      => 4,
                'inscription'       => '10/01/2026',
                'actif'             => true,
            ],
            [
                'id'                => 2,
                'initials'          => 'AM',
                'nom'               => 'Amina Mbaye',
                'email'             => 'amina.m@email.com',
                'telephone'         => '+212 6 12 34 56 78',
                'type_handicap'     => 'sensoriel',
                'niveau_dependance' => 2,
                'reservations'      => 2,
                'inscription'       => '15/01/2026',
                'actif'             => true,
            ],
            [
                'id'                => 3,
                'initials'          => 'JB',
                'nom'               => 'Jean-Baptiste Essomba',
                'email'             => 'jb.essomba@email.com',
                'telephone'         => '+225 07 12 34 56',
                'type_handicap'     => 'polyhandicap',
                'niveau_dependance' => 5,
                'reservations'      => 3,
                'inscription'       => '08/02/2026',
                'actif'             => true,
            ],
            [
                'id'                => 4,
                'initials'          => 'FT',
                'nom'               => 'Fatou Touré',
                'email'             => 'fatou.t@email.com',
                'telephone'         => '+228 90 12 34 56',
                'type_handicap'     => 'moteur',
                'niveau_dependance' => 2,
                'reservations'      => 6,
                'inscription'       => '20/02/2026',
                'actif'             => true,
            ],
            [
                'id'                => 5,
                'initials'          => 'ON',
                'nom'               => 'Oumar Ndiaye',
                'email'             => 'oumar.n@email.com',
                'telephone'         => '+254 712 345 678',
                'type_handicap'     => 'cognitif',
                'niveau_dependance' => 3,
                'reservations'      => 1,
                'inscription'       => '01/03/2026',
                'actif'             => true,
            ],
            [
                'id'                => 6,
                'initials'          => 'SE',
                'nom'               => 'Sophie Eteki',
                'email'             => 'sophie.e@email.com',
                'telephone'         => '+237 6 12 34 56 78',
                'type_handicap'     => 'moteur',
                'niveau_dependance' => 4,
                'reservations'      => 2,
                'inscription'       => '05/03/2026',
                'actif'             => true,
            ],
            [
                'id'                => 7,
                'initials'          => 'DK',
                'nom'               => 'Danielle Kanga',
                'email'             => 'd.kanga@email.com',
                'telephone'         => '+233 24 123 4567',
                'type_handicap'     => 'sensoriel',
                'niveau_dependance' => 1,
                'reservations'      => 1,
                'inscription'       => '10/03/2026',
                'actif'             => true,
            ],
            [
                'id'                => 8,
                'initials'          => 'MB',
                'nom'               => 'Mamadou Baldé',
                'email'             => 'm.balde@email.com',
                'telephone'         => '+224 620 12 34 56',
                'type_handicap'     => 'moteur',
                'niveau_dependance' => 3,
                'reservations'      => 0,
                'inscription'       => '01/04/2026',
                'actif'             => false,
            ],
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // GET /voyageurs
    // ─────────────────────────────────────────────────────────────
    public function index(): \Inertia\Response
    {
        $voyageurs = $this->voyageurs();
        $actifs    = array_filter($voyageurs, fn ($v) => $v['actif']);
        $inactifs  = array_filter($voyageurs, fn ($v) => !$v['actif']);

        return Inertia::render('dashboard/voyageurs/index', [
            'voyageurs' => $voyageurs,
            'stats'     => [
                'total'                => count($voyageurs),
                'actifs'               => count($actifs),
                'inactifs'             => count($inactifs),
                'avec_profil_medical'  => 6, // statique — à connecter Eloquent
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // GET /voyageurs/create
    // ─────────────────────────────────────────────────────────────
    public function create(): \Inertia\Response
    {
        return Inertia::render('dashboard/voyageurs/create');
    }

    // ─────────────────────────────────────────────────────────────
    // POST /voyageurs
    // ─────────────────────────────────────────────────────────────
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'prenom'              => 'required|string|max:100',
            'nom'                 => 'required|string|max:100',
            'email'               => 'required|email|max:255',
            'telephone'           => 'required|string|max:30',
            'pays_residence'      => 'required|string|max:5',
            'type_handicap'       => 'required|string|max:50',
            'niveau_dependance'   => 'required|integer|min:1|max:5',
            'contact_urgence_nom' => 'required|string|max:100',
            'contact_urgence_tel' => 'required|string|max:30',
            'consentement_rgpd'   => 'accepted', // doit être true
        ]);

        // TODO: enregistrer en base de données
        // $voyageur = Voyageur::create([...]);

        return redirect()
            ->route('voyageurs.index')
            ->with('success', 'Profil voyageur créé avec succès.');
    }

    // ─────────────────────────────────────────────────────────────
    // GET /voyageurs/{id}
    // ─────────────────────────────────────────────────────────────
    public function show(int $id): \Inertia\Response
    {
        $v = collect($this->voyageurs())->firstWhere('id', $id)
            ?? $this->voyageurs()[0];

        return Inertia::render('dashboard/voyageurs/show', [
            'voyageur'     => $v,
            'reservations' => [
                [
                    'ref'          => 'HS-2026-0001',
                    'hebergement'  => 'Hôtel Azur Accessible — Dakar',
                    'dates'        => '12–18 avr 2026',
                    'statut'       => 'Terminée',
                    'montant'      => '186 000 F',
                ],
                [
                    'ref'          => 'HS-2026-0007',
                    'hebergement'  => 'Hôtel Grand Confort PMR — Accra',
                    'dates'        => '1–7 mai 2026',
                    'statut'       => 'Confirmée',
                    'montant'      => '175 000 F',
                ],
            ],
            'aidants' => [
                [
                    'nom'       => 'Adja Diarra',
                    'lien'      => 'Épouse',
                    'telephone' => '+221 77 987 65 43',
                ],
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // GET /voyageurs/{id}/edit
    // ─────────────────────────────────────────────────────────────
    public function edit(int $id): \Inertia\Response
    {
        $v = collect($this->voyageurs())->firstWhere('id', $id)
            ?? $this->voyageurs()[0];

        return Inertia::render('dashboard/voyageurs/edit', [
            'voyageur' => $v,
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // PUT /voyageurs/{id}
    // ─────────────────────────────────────────────────────────────
    public function update(Request $request, int $id): \Illuminate\Http\RedirectResponse
    {
        // TODO: valider et mettre à jour en base
        return redirect()
            ->route('voyageurs.show', $id)
            ->with('success', 'Profil mis à jour.');
    }

    // ─────────────────────────────────────────────────────────────
    // PATCH /voyageurs/{id}/toggle-actif
    // ─────────────────────────────────────────────────────────────
    public function toggleActif(int $id): \Illuminate\Http\RedirectResponse
    {
        // TODO: basculer actif/inactif en base
        return redirect()
            ->route('voyageurs.show', $id)
            ->with('success', 'Statut du voyageur mis à jour.');
    }
}


/*
|--------------------------------------------------------------------------
| ROUTES À COPIER DANS web.php
|--------------------------------------------------------------------------
|
| ⚠️  La route /voyageurs/create DOIT être placée AVANT /voyageurs/{id}
|     sinon Laravel traite "create" comme un identifiant numérique.
|
*/

// ── Voyageurs ─────────────────────────────────────────────────────────────────
// Route::get('/voyageurs',                      [VoyageurController::class, 'index'])       ->name('voyageurs.index');
// Route::get('/voyageurs/create',               [VoyageurController::class, 'create'])      ->name('voyageurs.create');
// Route::post('/voyageurs',                     [VoyageurController::class, 'store'])       ->name('voyageurs.store');
// Route::get('/voyageurs/{id}',                 [VoyageurController::class, 'show'])        ->name('voyageurs.show');
// Route::get('/voyageurs/{id}/edit',            [VoyageurController::class, 'edit'])        ->name('voyageurs.edit');
// Route::put('/voyageurs/{id}',                 [VoyageurController::class, 'update'])      ->name('voyageurs.update');
// Route::patch('/voyageurs/{id}/toggle-actif',  [VoyageurController::class, 'toggleActif'])->name('voyageurs.toggle-actif');