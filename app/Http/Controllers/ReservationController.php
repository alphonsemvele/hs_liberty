<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    private function reservations(): array
    {
        return [
            ['id'=>1,'ref'=>'HS-2026-0001','initials'=>'KD','voyageur'=>'Kofi Diarra','hebergement'=>'Hôtel Azur Accessible — Dakar','date_arrivee'=>'12/04/2026','date_depart'=>'18/04/2026','nb_nuits'=>6,'statut'=>'Confirmée','montant'=>'186 000 F','devise'=>'XOF','created_at'=>'01/04/2026'],
            ['id'=>2,'ref'=>'HS-2026-0002','initials'=>'AM','voyageur'=>'Amina Mbaye','hebergement'=>'Résidence PMR Casablanca Centre','date_arrivee'=>'15/04/2026','date_depart'=>'20/04/2026','nb_nuits'=>5,'statut'=>'En attente','montant'=>'94 500 F','devise'=>'XOF','created_at'=>'03/04/2026'],
            ['id'=>3,'ref'=>'HS-2026-0003','initials'=>'JB','voyageur'=>'Jean-Baptiste Essomba','hebergement'=>'Villa Accessibilité Plus — Abidjan','date_arrivee'=>'08/04/2026','date_depart'=>'14/04/2026','nb_nuits'=>6,'statut'=>'Terminée','montant'=>'210 000 F','devise'=>'XOF','created_at'=>'28/03/2026'],
            ['id'=>4,'ref'=>'HS-2026-0004','initials'=>'FT','voyageur'=>'Fatou Touré','hebergement'=>'Hôtel Liberté — Lomé','date_arrivee'=>'20/04/2026','date_depart'=>'25/04/2026','nb_nuits'=>5,'statut'=>'Confirmée','montant'=>'78 000 F','devise'=>'XOF','created_at'=>'08/04/2026'],
            ['id'=>5,'ref'=>'HS-2026-0005','initials'=>'ON','voyageur'=>'Oumar Ndiaye','hebergement'=>'Appart PMR Nairobi Est','date_arrivee'=>'02/04/2026','date_depart'=>'07/04/2026','nb_nuits'=>5,'statut'=>'Annulée','montant'=>'132 000 F','devise'=>'XOF','created_at'=>'22/03/2026'],
            ['id'=>6,'ref'=>'HS-2026-0006','initials'=>'SE','voyageur'=>'Sophie Eteki','hebergement'=>'Riad Accessible — Marrakech','date_arrivee'=>'25/04/2026','date_depart'=>'30/04/2026','nb_nuits'=>5,'statut'=>'En attente','montant'=>'155 000 F','devise'=>'XOF','created_at'=>'10/04/2026'],
            ['id'=>7,'ref'=>'HS-2026-0007','initials'=>'DK','voyageur'=>'Danielle Kanga','hebergement'=>'Hôtel Grand Confort PMR — Accra','date_arrivee'=>'01/05/2026','date_depart'=>'07/05/2026','nb_nuits'=>6,'statut'=>'Confirmée','montant'=>'175 000 F','devise'=>'XOF','created_at'=>'14/04/2026'],
            ['id'=>8,'ref'=>'HS-2026-0008','initials'=>'MB','voyageur'=>'Mamadou Baldé','hebergement'=>'Hôtel Azur Accessible — Dakar','date_arrivee'=>'10/05/2026','date_depart'=>'16/05/2026','nb_nuits'=>6,'statut'=>'En attente','montant'=>'192 000 F','devise'=>'XOF','created_at'=>'15/04/2026'],
        ];
    }
 
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/reservations/index', [
            'reservations' => $this->reservations(),
            'stats' => [
                'total'       => 8,
                'confirmees'  => 3,
                'en_attente'  => 3,
                'terminees'   => 1,
                'annulees'    => 1,
                'ce_mois'     => 127,
                'revenus_mois'=> '1 222 500 F',
            ],
        ]);
    }
 
    public function create(): \Inertia\Response
    {
        return Inertia::render('dashboard/reservations/create');
    }
 
    public function store(Request $request)
    {
        return redirect()->route('reservations.index');
    }
 
    public function show(int $id): \Inertia\Response
    {
        $resa = collect($this->reservations())->firstWhere('id', $id)
            ?? $this->reservations()[0];
        return Inertia::render('dashboard/reservations/show', ['reservation' => $resa]);
    }
 
    public function updateStatut(Request $request, int $id)
    {
        return redirect()->route('reservations.index');
    }
}
 