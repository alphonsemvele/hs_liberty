<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgrammeController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/programme/index', [
            'programmes' => [
                ['id'=>1,'titre'=>'Séjour détente Dakar','voyageur'=>'Kofi Diarra','destination'=>'Dakar, Sénégal','date_debut'=>'12/04/2026','date_fin'=>'18/04/2026','statut'=>'en_cours','partage_aidants'=>true,'nb_etapes'=>5],
                ['id'=>2,'titre'=>'Vacances Casablanca','voyageur'=>'Amina Mbaye','destination'=>'Casablanca, Maroc','date_debut'=>'15/04/2026','date_fin'=>'20/04/2026','statut'=>'a_venir','partage_aidants'=>true,'nb_etapes'=>4],
                ['id'=>3,'titre'=>'Congrès Abidjan','voyageur'=>'Jean-Baptiste Essomba','destination'=>'Abidjan, CI','date_debut'=>'08/04/2026','date_fin'=>'14/04/2026','statut'=>'termine','partage_aidants'=>false,'nb_etapes'=>6],
                ['id'=>4,'titre'=>'Voyage famille Lomé','voyageur'=>'Fatou Touré','destination'=>'Lomé, Togo','date_debut'=>'20/04/2026','date_fin'=>'25/04/2026','statut'=>'a_venir','partage_aidants'=>true,'nb_etapes'=>3],
            ],
        ]);
    }
 
    public function show(int $id): \Inertia\Response
    {
        return Inertia::render('dashboard/programme/show', [
            'programme' => [
                'id'=>$id,'titre'=>'Séjour détente Dakar','voyageur'=>'Kofi Diarra',
                'destination'=>'Dakar, Sénégal','date_debut'=>'12/04/2026','date_fin'=>'18/04/2026',
                'statut'=>'en_cours','partage_aidants'=>true,
                'etapes' => [
                    ['ordre'=>1,'type'=>'transport','titre'=>'Vol Douala → Dakar','heure'=>'08:00','details'=>'Air Sénégal — Siège accessible'],
                    ['ordre'=>2,'type'=>'hebergement','titre'=>'Check-in Hôtel Azur','heure'=>'14:00','details'=>'Chambre PMR niveau 2'],
                    ['ordre'=>3,'type'=>'loisir','titre'=>'Visite île de Gorée','heure'=>'10:00','details'=>'Itinéraire PMR disponible'],
                    ['ordre'=>4,'type'=>'soin','titre'=>'Séance kinésithérapie','heure'=>'16:00','details'=>'Dr. Fatima Sow — sur site'],
                    ['ordre'=>5,'type'=>'transport','titre'=>'Retour Douala','heure'=>'11:00','details'=>'Vol Air Sénégal'],
                ],
                'checklist' => [
                    ['item'=>'Ordonnances et médicaments','fait'=>true],
                    ['item'=>'Fauteuil roulant de voyage','fait'=>true],
                    ['item'=>'Assurance rapatriement','fait'=>false],
                    ['item'=>'Contact médecin local','fait'=>true],
                    ['item'=>'Numéro SOS enregistré','fait'=>false],
                ],
            ],
        ]);
    }
}