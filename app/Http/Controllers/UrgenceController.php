<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UrgenceController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/urgences/index', [
            'urgences' => [
                ['id'=>1,'voyageur'=>'Kofi Diarra','initials'=>'KD','localisation'=>'Dakar, Sénégal','latitude'=>14.6937,'longitude'=>-17.4441,'type'=>'medical','statut'=>'en_traitement','operateur'=>'Agent Martin','depuis'=>'14 min','date_heure'=>'03/04/2026 11:42','notes'=>'Chute dans la chambre. Soins en cours. Médecin local contacté.'],
                ['id'=>2,'voyageur'=>'Marie ','initials'=>'MD','localisation'=>'Casablanca, Maroc','latitude'=>33.5731,'longitude'=>-7.5898,'type'=>'securite','statut'=>'declenche','operateur'=>null,'depuis'=>'3 min','date_heure'=>'03/04/2026 11:53','notes'=>null],
                ['id'=>3,'voyageur'=>'Paul Mbida','initials'=>'PM','localisation'=>'Abidjan, CI','latitude'=>5.3600,'longitude'=>-4.0083,'type'=>'medical','statut'=>'resolu','operateur'=>'Agent Koné','depuis'=>'Hier','date_heure'=>'02/04/2026 09:15','notes'=>'Malaise vagal. Prise en charge à l\'hôtel. Résolu.'],
                ['id'=>4,'voyageur'=>'Fatima Diop','initials'=>'FD','localisation'=>'Lomé, Togo','latitude'=>6.1375,'longitude'=>1.2123,'type'=>'autre','statut'=>'resolu','operateur'=>'Agent Agbo','depuis'=>'2 jours','date_heure'=>'01/04/2026 14:30','notes'=>'Panne fauteuil roulant. Remplacement organisé.'],
            ],
            'stats' => ['total'=>4,'actives'=>2,'resolues'=>2,'medicales'=>2,'securite'=>1,'autres'=>1],
        ]);
    }
 
    public function updateStatut(Request $request, int $id)
    {
        return redirect()->route('urgences.index');
    }
}