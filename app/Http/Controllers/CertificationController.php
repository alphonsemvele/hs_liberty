<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificationController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/certifications/index', [
            'certifications' => [
                ['id'=>1,'hebergement'=>'Hôtel Azur Accessible','ville'=>'Dakar','niveau'=>'Excellence','score'=>92,'auditeur'=>'Dr. Mbodj','date_obtention'=>'15/01/2026','date_expiration'=>'15/01/2027','statut'=>'valide'],
                ['id'=>2,'hebergement'=>'Résidence PMR Casablanca','ville'=>'Casablanca','niveau'=>'Accessible Plus','score'=>78,'auditeur'=>'Mme Alami','date_obtention'=>'08/02/2026','date_expiration'=>'08/02/2027','statut'=>'valide'],
                ['id'=>3,'hebergement'=>'Villa Accessibilité Plus','ville'=>'Abidjan','niveau'=>'Accessible','score'=>65,'auditeur'=>'M. Koné','date_obtention'=>'10/01/2025','date_expiration'=>'10/01/2026','statut'=>'expire'],
                ['id'=>4,'hebergement'=>'Hôtel Liberté','ville'=>'Lomé','niveau'=>'Excellence','score'=>96,'auditeur'=>'Dr. Agbo','date_obtention'=>'20/02/2026','date_expiration'=>'20/02/2027','statut'=>'valide'],
                ['id'=>5,'hebergement'=>'Riad Accessible','ville'=>'Marrakech','niveau'=>'Accessible','score'=>61,'auditeur'=>'M. Tahiri','date_obtention'=>'05/12/2024','date_expiration'=>'05/12/2025','statut'=>'expire'],
                ['id'=>6,'hebergement'=>'Hôtel Grand Confort PMR','ville'=>'Accra','niveau'=>'Accessible','score'=>67,'auditeur'=>'Mme Asante','date_obtention'=>'22/03/2026','date_expiration'=>'22/03/2027','statut'=>'valide'],
                ['id'=>7,'hebergement'=>'Appart PMR Nairobi Est','ville'=>'Nairobi','niveau'=>'Accessible Plus','score'=>74,'auditeur'=>'M. Ochieng','date_obtention'=>'10/02/2025','date_expiration'=>'10/02/2026','statut'=>'expire'],
            ],
            'stats' => ['total'=>7,'valides'=>4,'expirees'=>3,'a_renouveler'=>2],
        ]);
    }
 
    public function show(int $id): \Inertia\Response
    {
        return Inertia::render('dashboard/certifications/show', [
            'certification' => [
                'id'=>$id,'hebergement'=>'Hôtel Azur Accessible','ville'=>'Dakar',
                'niveau'=>'Excellence','score'=>92,'auditeur'=>'Dr. Mbodj',
                'date_audit'=>'12/01/2026','date_obtention'=>'15/01/2026',
                'date_expiration'=>'15/01/2027','statut'=>'valide',
                'rapport_url'=>null,
                'criteres'=>[
                    ['nom'=>'Entrée principale PMR','note'=>19,'max'=>20],
                    ['nom'=>'Chambre adaptée','note'=>18,'max'=>20],
                    ['nom'=>'Salle de bain accessible','note'=>17,'max'=>20],
                    ['nom'=>'Ascenseur / rampe','note'=>20,'max'=>20],
                    ['nom'=>'Parking handicapé','note'=>18,'max'=>20],
                ],
            ],
        ]);
    }
}