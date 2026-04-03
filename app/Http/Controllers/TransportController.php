<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TransportController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/transports/index', [
            'transports' => [
                ['id'=>1,'ref'=>'TR-0001','voyageur'=>'Kofi Diarra','type_vehicule'=>'Minibus PMR','prestataire'=>'AccessMobil Dakar','depart'=>'Aéroport LSS','arrivee'=>'Hôtel Azur','date_heure'=>'12/04/2026 14:30','statut'=>'Confirmé','montant'=>'12 000 F'],
                ['id'=>2,'ref'=>'TR-0002','voyageur'=>'Amina Mbaye','type_vehicule'=>'Berline adaptée','prestataire'=>'Maroc Accessible','depart'=>'Aéroport CMN','arrivee'=>'Résidence PMR','date_heure'=>'15/04/2026 16:00','statut'=>'Confirmé','montant'=>'18 000 F'],
                ['id'=>3,'ref'=>'TR-0003','voyageur'=>'Fatou Touré','type_vehicule'=>'Van PMR','prestataire'=>'Lomé Mobilité','depart'=>'Gare ferroviaire','arrivee'=>'Hôtel Liberté','date_heure'=>'20/04/2026 10:15','statut'=>'En attente','montant'=>'8 500 F'],
                ['id'=>4,'ref'=>'TR-0004','voyageur'=>'Sophie Eteki','type_vehicule'=>'Berline adaptée','prestataire'=>'Atlas Transport','depart'=>'Aéroport RAK','arrivee'=>'Riad Accessible','date_heure'=>'25/04/2026 19:45','statut'=>'En attente','montant'=>'22 000 F'],
                ['id'=>5,'ref'=>'TR-0005','voyageur'=>'Jean-Baptiste Essomba','type_vehicule'=>'Minibus PMR','prestataire'=>'CI Mobilité','depart'=>'Hôtel','arrivee'=>'Aéroport ABJ','date_heure'=>'14/04/2026 08:00','statut'=>'Terminé','montant'=>'14 000 F'],
            ],
            'stats' => ['total'=>5,'confirmes'=>2,'en_attente'=>2,'termines'=>1],
        ]);
    }
}