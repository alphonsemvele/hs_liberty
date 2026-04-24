<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TransportController extends Controller
{
    private function transports(): array
    {
        return [
            [
                'id'               => 1,
                'ref'              => 'TR-2026-001',
                'voyageur'         => 'Kofi Diarra',
                'voyageur_initials'=> 'KD',
                'type_vehicule'    => 'Minibus PMR',
                'equipements'      => ['Rampe électrique', 'Ceinture fauteuil'],
                'prestataire'      => 'AccessMobil Dakar',
                'ville_depart'     => 'Aéroport LSS — Dakar',
                'ville_arrivee'    => 'Hôtel Azur Accessible',
                'date_heure'       => '12/04/2026 14:30',
                'statut'           => 'Terminé',
                'montant'          => '12 000 F',
            ],
            [
                'id'               => 2,
                'ref'              => 'TR-2026-002',
                'voyageur'         => 'Amina Mbaye',
                'voyageur_initials'=> 'AM',
                'type_vehicule'    => 'Berline adaptée',
                'equipements'      => ['Siège pivotant', 'Poignée de maintien'],
                'prestataire'      => 'Maroc Accessible',
                'ville_depart'     => 'Aéroport CMN — Casablanca',
                'ville_arrivee'    => 'Résidence PMR Casablanca',
                'date_heure'       => '15/04/2026 16:00',
                'statut'           => 'Confirmé',
                'montant'          => '18 000 F',
            ],
            [
                'id'               => 3,
                'ref'              => 'TR-2026-003',
                'voyageur'         => 'Fatou Touré',
                'voyageur_initials'=> 'FT',
                'type_vehicule'    => 'Van PMR',
                'equipements'      => ['Lève-personne', 'Rampe', 'Brancard'],
                'prestataire'      => 'Lomé Mobilité Plus',
                'ville_depart'     => 'Gare ferroviaire — Lomé',
                'ville_arrivee'    => 'Hôtel Liberté',
                'date_heure'       => '20/04/2026 10:15',
                'statut'           => 'En attente',
                'montant'          => '8 500 F',
            ],
            [
                'id'               => 4,
                'ref'              => 'TR-2026-004',
                'voyageur'         => 'Sophie Eteki',
                'voyageur_initials'=> 'SE',
                'type_vehicule'    => 'Berline adaptée',
                'equipements'      => ['Siège pivotant'],
                'prestataire'      => 'Atlas Transport PMR',
                'ville_depart'     => 'Aéroport RAK — Marrakech',
                'ville_arrivee'    => 'Riad Accessible',
                'date_heure'       => '25/04/2026 19:45',
                'statut'           => 'En attente',
                'montant'          => '22 000 F',
            ],
            [
                'id'               => 5,
                'ref'              => 'TR-2026-005',
                'voyageur'         => 'Jean-Baptiste Essomba',
                'voyageur_initials'=> 'JB',
                'type_vehicule'    => 'Minibus PMR',
                'equipements'      => ['Rampe électrique', 'Ceinture fauteuil', 'O₂'],
                'prestataire'      => 'CI Mobilité Adaptée',
                'ville_depart'     => 'Hôtel',
                'ville_arrivee'    => 'Aéroport ABJ — Abidjan',
                'date_heure'       => '14/04/2026 08:00',
                'statut'           => 'Terminé',
                'montant'          => '14 000 F',
            ],
            [
                'id'               => 6,
                'ref'              => 'TR-2026-006',
                'voyageur'         => 'Danielle Kanga',
                'voyageur_initials'=> 'DK',
                'type_vehicule'    => 'Van PMR',
                'equipements'      => ['Lève-personne', 'Fauteuil roulant de prêt'],
                'prestataire'      => 'GH AccessTransport',
                'ville_depart'     => 'Aéroport ACC — Accra',
                'ville_arrivee'    => 'Hôtel Grand Confort PMR',
                'date_heure'       => '01/05/2026 12:00',
                'statut'           => 'En cours',
                'montant'          => '19 500 F',
            ],
        ];
    }
 
    public function index(): \Inertia\Response
    {
        $transports = $this->transports();
        $statuts    = array_column($transports, 'statut');
 
        return Inertia::render('dashboard/transports/index', [
            'transports' => $transports,
            'stats'      => [
                'total'      => count($transports),
                'confirmes'  => count(array_filter($statuts, fn ($s) => $s === 'Confirmé')),
                'en_attente' => count(array_filter($statuts, fn ($s) => $s === 'En attente')),
                'en_cours'   => count(array_filter($statuts, fn ($s) => $s === 'En cours')),
                'termines'   => count(array_filter($statuts, fn ($s) => $s === 'Terminé')),
            ],
        ]);
    }
 
    public function create(): \Inertia\Response
    {
        return Inertia::render('dashboard/transports/create');
    }
 
    public function store(Request $request)
    {
        // TODO: valider et enregistrer en base de données
        return redirect()->route('transports.index');
    }
 
    public function show(int $id): \Inertia\Response
    {
        $transport = collect($this->transports())->firstWhere('id', $id)
            ?? $this->transports()[0];
 
        return Inertia::render('transports/show', [
            'transport' => $transport,
        ]);
    }
 
    public function updateStatut(Request $request, int $id)
    {
        // TODO: mettre à jour le statut en base
        return redirect()->route('transports.index');
    }
 
    public function destroy(int $id)
    {
        // TODO: annuler / supprimer
        return redirect()->route('transports.index');
    }
}