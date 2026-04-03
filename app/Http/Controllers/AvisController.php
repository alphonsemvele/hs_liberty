<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;


class AvisController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/avis/index', [
            'avis' => [
                ['id'=>1,'voyageur'=>'Kofi Diarra','initials'=>'KD','hebergement'=>'Hôtel Azur Accessible','note_globale'=>5,'note_accessibilite'=>5,'note_equipements'=>4,'commentaire'=>'Parfait pour mon fauteuil. Personnel formé et attentionné.','date'=>'18/04/2026','verifie'=>true],
                ['id'=>2,'voyageur'=>'Amina Mbaye','initials'=>'AM','hebergement'=>'Résidence PMR Casablanca','note_globale'=>4,'note_accessibilite'=>4,'note_equipements'=>4,'commentaire'=>'Très bon séjour, quelques détails à améliorer dans la salle de bain.','date'=>'21/04/2026','verifie'=>true],
                ['id'=>3,'voyageur'=>'Jean-Baptiste Essomba','initials'=>'JB','hebergement'=>'Villa Accessibilité Plus','note_globale'=>4,'note_accessibilite'=>3,'note_equipements'=>4,'commentaire'=>'Bien dans l\'ensemble mais l\'ascenseur était en panne 1 jour.','date'=>'14/04/2026','verifie'=>true],
                ['id'=>4,'voyageur'=>'Fatou Touré','initials'=>'FT','hebergement'=>'Hôtel Liberté','note_globale'=>5,'note_accessibilite'=>5,'note_equipements'=>5,'commentaire'=>'Le meilleur hôtel accessible que j\'ai jamais eu. Tout était parfait.','date'=>'26/04/2026','verifie'=>true],
                ['id'=>5,'voyageur'=>'Sophie Eteki','initials'=>'SE','hebergement'=>'Riad Accessible','note_globale'=>3,'note_accessibilite'=>3,'note_equipements'=>3,'commentaire'=>'Correct mais pas au niveau d\'un établissement 3 étoiles standard.','date'=>'02/05/2026','verifie'=>true],
            ],
            'stats' => ['total'=>5,'note_moyenne'=>4.2,'taux_5_etoiles'=>40,'en_attente_validation'=>0],
        ]);
    }
 
    public function destroy(int $id)
    {
        return redirect()->route('avis.index');
    }
}
 