<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AidantController extends Controller
{
    private function aidants(): array
    {
        return [
            [
                'id'             => 1,
                'initials'       => 'AD',
                'nom'            => 'Adja Diarra',
                'email'          => 'adja.d@email.com',
                'telephone'      => '+221 77 987 65 43',
                'lien_parente'   => 'Épouse',
                'voyageur_suivi' => 'Kofi Diarra',
                'voyageur_id'    => 1,
                'niveau_acces'   => 'ecriture',
                'actif_depuis'   => '10/01/2026',
                'sejours_suivis' => 4,
            ],
            [
                'id'             => 2,
                'initials'       => 'CM',
                'nom'            => 'Céline Mbaye',
                'email'          => 'celine.m@email.com',
                'telephone'      => '+212 6 98 76 54 32',
                'lien_parente'   => 'Fille',
                'voyageur_suivi' => 'Amina Mbaye',
                'voyageur_id'    => 2,
                'niveau_acces'   => 'lecture',
                'actif_depuis'   => '15/01/2026',
                'sejours_suivis' => 2,
            ],
            [
                'id'             => 3,
                'initials'       => 'PE',
                'nom'            => 'Pierre Essomba',
                'email'          => 'pierre.e@email.com',
                'telephone'      => '+225 07 98 76 54',
                'lien_parente'   => 'Frère',
                'voyageur_suivi' => 'Jean-Baptiste Essomba',
                'voyageur_id'    => 3,
                'niveau_acces'   => 'urgence',
                'actif_depuis'   => '08/02/2026',
                'sejours_suivis' => 3,
            ],
            [
                'id'             => 4,
                'initials'       => 'IT',
                'nom'            => 'Ibrahim Touré',
                'email'          => 'ibrahim.t@email.com',
                'telephone'      => '+228 90 98 76 54',
                'lien_parente'   => 'Père',
                'voyageur_suivi' => 'Fatou Touré',
                'voyageur_id'    => 4,
                'niveau_acces'   => 'ecriture',
                'actif_depuis'   => '20/02/2026',
                'sejours_suivis' => 6,
            ],
            [
                'id'             => 5,
                'initials'       => 'SN',
                'nom'            => 'Seynabou Ndiaye',
                'email'          => 'seynabou.n@email.com',
                'telephone'      => '+254 712 987 654',
                'lien_parente'   => 'Mère',
                'voyageur_suivi' => 'Oumar Ndiaye',
                'voyageur_id'    => 5,
                'niveau_acces'   => 'lecture',
                'actif_depuis'   => '01/03/2026',
                'sejours_suivis' => 1,
            ],
        ];
    }

    private function sejoursParAidant(int $aidantId): array
    {
        $map = [
            1 => [
                ['ref' => 'HS-2026-0001', 'destination' => 'Hôtel Azur Accessible — Dakar',     'dates' => '12–18 avr 2026', 'statut' => 'Terminé',  'urgences' => 0],
                ['ref' => 'HS-2026-0007', 'destination' => 'Hôtel Grand Confort PMR — Accra',   'dates' => '01–07 mai 2026', 'statut' => 'En cours',  'urgences' => 0],
                ['ref' => 'HS-2026-0012', 'destination' => 'Résidence PMR Casablanca Centre',   'dates' => '15–20 juin 2026','statut' => 'À venir',   'urgences' => 0],
                ['ref' => 'HS-2026-0004', 'destination' => 'Villa Accessibilité Plus — Abidjan','dates' => '08–14 avr 2026', 'statut' => 'Terminé',   'urgences' => 0],
            ],
            2 => [
                ['ref' => 'HS-2026-0002', 'destination' => 'Résidence PMR Casablanca Centre',   'dates' => '15–20 avr 2026', 'statut' => 'Terminé',  'urgences' => 0],
                ['ref' => 'HS-2026-0009', 'destination' => 'Riad Accessible — Marrakech',       'dates' => '10–15 mai 2026', 'statut' => 'À venir',   'urgences' => 0],
            ],
            3 => [
                ['ref' => 'HS-2026-0003', 'destination' => 'Villa Accessibilité Plus — Abidjan','dates' => '08–14 avr 2026', 'statut' => 'Terminé',  'urgences' => 0],
                ['ref' => 'HS-2026-0010', 'destination' => 'Hôtel Liberté — Lomé',              'dates' => '20–25 mai 2026', 'statut' => 'À venir',   'urgences' => 0],
                ['ref' => 'HS-2026-0005', 'destination' => 'Appart PMR Nairobi Est',             'dates' => '02–07 avr 2026', 'statut' => 'Terminé',   'urgences' => 1],
            ],
        ];

        return $map[$aidantId] ?? [];
    }

    // ─────────────────────────────────────────────────────────────
    // GET /aidants
    // ─────────────────────────────────────────────────────────────
    public function index(): \Inertia\Response
    {
        $aidants = $this->aidants();
        $niveaux = array_column($aidants, 'niveau_acces');

        return Inertia::render('dashboard/aidants/index', [
            'aidants' => $aidants,
            'stats'   => [
                'total'          => count($aidants),
                'acces_ecriture' => count(array_filter($niveaux, fn ($n) => $n === 'ecriture')),
                'acces_lecture'  => count(array_filter($niveaux, fn ($n) => $n === 'lecture')),
                'acces_urgence'  => count(array_filter($niveaux, fn ($n) => $n === 'urgence')),
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // GET /aidants/create
    // ─────────────────────────────────────────────────────────────
    public function create(): \Inertia\Response
    {
        return Inertia::render('dashboard/aidants/create');
    }

    // ─────────────────────────────────────────────────────────────
    // POST /aidants
    // ─────────────────────────────────────────────────────────────
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'id_voyageur'  => 'required|integer',
            'prenom'       => 'required|string|max:100',
            'nom'          => 'required|string|max:100',
            'email'        => 'required|email|max:255',
            'telephone'    => 'required|string|max:30',
            'lien_parente' => 'required|string|max:100',
            'niveau_acces' => 'required|in:lecture,ecriture,urgence',
            'consentement' => 'accepted',
        ]);

        // TODO: créer l'aidant en base + envoyer email d'invitation
        // $aidant = Aidant::create([...]);
        // Mail::to($request->email)->send(new InvitationAidant($aidant));

        return redirect()
            ->route('aidants.index')
            ->with('success', 'Invitation envoyée à ' . $request->prenom . ' ' . $request->nom . '.');
    }

    // ─────────────────────────────────────────────────────────────
    // GET /aidants/{id}
    // ─────────────────────────────────────────────────────────────
    public function show(int $id): \Inertia\Response
    {
        $a = collect($this->aidants())->firstWhere('id', $id)
            ?? $this->aidants()[0];

        return Inertia::render('dashboard/aidants/show', [
            'aidant'  => $a,
            'sejours' => $this->sejoursParAidant($id),
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // PATCH /aidants/{id}/niveau
    // ─────────────────────────────────────────────────────────────
    public function updateNiveau(Request $request, int $id): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'niveau_acces' => 'required|in:lecture,ecriture,urgence',
        ]);

        // TODO: mettre à jour le niveau en base
        return redirect()
            ->route('aidants.show', $id)
            ->with('success', 'Niveau d\'accès mis à jour.');
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE /aidants/{id}
    // ─────────────────────────────────────────────────────────────
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        // TODO: révoquer les accès et supprimer la liaison en base
        return redirect()
            ->route('aidants.index')
            ->with('success', 'Accès révoqué avec succès.');
    }
}