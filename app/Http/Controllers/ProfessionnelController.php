<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfessionnelController extends Controller
{
    private function professionnels(): array
    {
        return [
            [
                'id'            => 1,
                'initials'      => 'FS',
                'nom'           => 'Dr. Fatima Sow',
                'email'         => 'f.sow@email.com',
                'telephone'     => '+221 77 123 45 67',
                'specialite'    => 'Infirmière',
                'pays'          => ['SN', 'MA'],
                'tarif'         => '15 000 F/h',
                'note'          => 4.9,
                'diplome_valide'=> true,
                'assurance_rc'  => true,
                'prestations'   => 18,
                'inscription'   => '05/01/2026',
                'numero_rpps'   => '10012345678',
            ],
            [
                'id'            => 2,
                'initials'      => 'MB',
                'nom'           => 'Mohamed Benali',
                'email'         => 'm.benali@email.com',
                'telephone'     => '+212 6 12 34 56 78',
                'specialite'    => 'Kinésithérapeute',
                'pays'          => ['MA', 'DZ'],
                'tarif'         => '20 000 F/h',
                'note'          => 4.7,
                'diplome_valide'=> true,
                'assurance_rc'  => true,
                'prestations'   => 12,
                'inscription'   => '10/01/2026',
                'numero_rpps'   => '10098765432',
            ],
            [
                'id'            => 3,
                'initials'      => 'AK',
                'nom'           => 'Alice Koffi',
                'email'         => 'a.koffi@email.com',
                'telephone'     => '+225 07 12 34 56',
                'specialite'    => 'Auxiliaire de vie',
                'pays'          => ['CI', 'SN'],
                'tarif'         => '8 000 F/h',
                'note'          => 4.8,
                'diplome_valide'=> true,
                'assurance_rc'  => true,
                'prestations'   => 24,
                'inscription'   => '15/01/2026',
                'numero_rpps'   => '10011223344',
            ],
            [
                'id'            => 4,
                'initials'      => 'JO',
                'nom'           => 'James Ochieng',
                'email'         => 'j.ochieng@email.com',
                'telephone'     => '+254 712 345 678',
                'specialite'    => 'Aide-soignant',
                'pays'          => ['KE', 'TZ'],
                'tarif'         => '12 000 F/h',
                'note'          => 4.5,
                'diplome_valide'=> true,
                'assurance_rc'  => false,  // ⚠️ RC Pro manquante
                'prestations'   => 9,
                'inscription'   => '20/02/2026',
                'numero_rpps'   => null,
            ],
            [
                'id'            => 5,
                'initials'      => 'MN',
                'nom'           => 'Marie Nkoue',
                'email'         => 'm.nkoue@email.com',
                'telephone'     => '+237 6 12 34 56 78',
                'specialite'    => 'Infirmière',
                'pays'          => ['CM', 'GA'],
                'tarif'         => '14 000 F/h',
                'note'          => 4.6,
                'diplome_valide'=> true,
                'assurance_rc'  => true,
                'prestations'   => 15,
                'inscription'   => '01/03/2026',
                'numero_rpps'   => '10055443322',
            ],
            [
                'id'            => 6,
                'initials'      => 'YT',
                'nom'           => 'Youssef Tahiri',
                'email'         => 'y.tahiri@email.com',
                'telephone'     => '+212 6 98 76 54 32',
                'specialite'    => 'Kinésithérapeute',
                'pays'          => ['MA'],
                'tarif'         => '18 000 F/h',
                'note'          => 0,
                'diplome_valide'=> false, // ⏳ En attente de validation
                'assurance_rc'  => false,
                'prestations'   => 0,
                'inscription'   => '01/04/2026',
                'numero_rpps'   => null,
            ],
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // GET /professionnels
    // ─────────────────────────────────────────────────────────────
    public function index(): \Inertia\Response
    {
        $profs    = $this->professionnels();
        $certifes = array_filter($profs, fn ($p) => $p['diplome_valide'] && $p['assurance_rc']);
        $attente  = array_filter($profs, fn ($p) => !$p['diplome_valide'] || !$p['assurance_rc']);

        // Prestations totales ce mois (statique — à connecter Eloquent plus tard)
        $prestations_mois = array_sum(array_map(fn ($p) => $p['prestations'], $profs));

        return Inertia::render('dashboard/professionnels/index', [
            'professionnels' => $profs,
            'stats'          => [
                'total'                  => count($profs),
                'certifies'              => count($certifes),
                'en_attente_validation'  => count($attente),
                'prestations_mois'       => 12, // statique
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // GET /professionnels/create
    // ─────────────────────────────────────────────────────────────
    public function create(): \Inertia\Response
    {
        return Inertia::render('dashboard/professionnels/create');
    }

    // ─────────────────────────────────────────────────────────────
    // POST /professionnels
    // ─────────────────────────────────────────────────────────────
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'prenom'       => 'required|string|max:100',
            'nom'          => 'required|string|max:100',
            'email'        => 'required|email|max:255',
            'telephone'    => 'required|string|max:30',
            'specialite'   => 'required|string|max:100',
            'pays'         => 'required|array|min:1',
            'tarif_horaire'=> 'required|numeric|min:1',
            'devise'       => 'required|string|max:5',
        ]);

        // TODO: enregistrer en base de données + gérer l'upload des fichiers
        // $professionnel = Professionnel::create([...]);

        return redirect()
            ->route('professionnels.index')
            ->with('success', 'Profil soumis — en attente de validation (48h ouvrées).');
    }

    // ─────────────────────────────────────────────────────────────
    // GET /professionnels/{id}
    // ─────────────────────────────────────────────────────────────
    public function show(int $id): \Inertia\Response
    {
        $p = collect($this->professionnels())->firstWhere('id', $id)
            ?? $this->professionnels()[0];

        return Inertia::render('dashboard/professionnels/show', [
            'professionnel'        => $p,
            'prestations_recentes' => [
                [
                    'voyageur' => 'Kofi Diarra',
                    'type'     => 'Soins infirmiers',
                    'date'     => '13/04/2026',
                    'duree'    => '1h',
                    'montant'  => '15 000 F',
                    'statut'   => 'realise',
                ],
                [
                    'voyageur' => 'Fatou Touré',
                    'type'     => 'Soins infirmiers',
                    'date'     => '21/04/2026',
                    'duree'    => '1h',
                    'montant'  => '15 000 F',
                    'statut'   => 'planifie',
                ],
                [
                    'voyageur' => 'Amina Mbaye',
                    'type'     => 'Pansement + suivi plaie',
                    'date'     => '19/04/2026',
                    'duree'    => '45 min',
                    'montant'  => '11 250 F',
                    'statut'   => 'realise',
                ],
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // GET /professionnels/{id}/edit
    // ─────────────────────────────────────────────────────────────
    public function edit(int $id): \Inertia\Response
    {
        $p = collect($this->professionnels())->firstWhere('id', $id)
            ?? $this->professionnels()[0];

        return Inertia::render('professionnels/edit', [
            'professionnel' => $p,
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // PUT /professionnels/{id}
    // ─────────────────────────────────────────────────────────────
    public function update(Request $request, int $id): \Illuminate\Http\RedirectResponse
    {
        // TODO: valider et mettre à jour en base de données
        return redirect()
            ->route('professionnels.show', $id)
            ->with('success', 'Profil mis à jour.');
    }

    // ─────────────────────────────────────────────────────────────
    // PATCH /professionnels/{id}/valider
    // ─────────────────────────────────────────────────────────────
    public function valider(int $id): \Illuminate\Http\RedirectResponse
    {
        // TODO: marquer diplome_valide = true en base de données
        return redirect()
            ->route('professionnels.show', $id)
            ->with('success', 'Profil validé avec succès.');
    }

    // ─────────────────────────────────────────────────────────────
    // PATCH /professionnels/{id}/suspendre
    // ─────────────────────────────────────────────────────────────
    public function suspendre(int $id): \Illuminate\Http\RedirectResponse
    {
        // TODO: suspendre le compte en base de données
        return redirect()
            ->route('professionnels.index')
            ->with('success', 'Compte suspendu.');
    }
}