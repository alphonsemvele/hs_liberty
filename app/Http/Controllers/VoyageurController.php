<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class VoyageurController extends Controller
{
    private function voyageurs(): array
    {
        return [
            ['id'=>1,'initials'=>'KD','nom'=>'Kofi Diarra','email'=>'kofi.d@email.com','telephone'=>'+221 77 123 45 67','type_handicap'=>'moteur','niveau_dependance'=>3,'reservations'=>4,'inscription'=>'10/01/2026','actif'=>true],
            ['id'=>2,'initials'=>'AM','nom'=>'Amina Mbaye','email'=>'amina.m@email.com','telephone'=>'+212 6 12 34 56 78','type_handicap'=>'sensoriel','niveau_dependance'=>2,'reservations'=>2,'inscription'=>'15/01/2026','actif'=>true],
            ['id'=>3,'initials'=>'JB','nom'=>'Jean-Baptiste Essomba','email'=>'jb.essomba@email.com','telephone'=>'+225 07 12 34 56','type_handicap'=>'polyhandicap','niveau_dependance'=>5,'reservations'=>3,'inscription'=>'08/02/2026','actif'=>true],
            ['id'=>4,'initials'=>'FT','nom'=>'Fatou Touré','email'=>'fatou.t@email.com','telephone'=>'+228 90 12 34 56','type_handicap'=>'moteur','niveau_dependance'=>2,'reservations'=>6,'inscription'=>'20/02/2026','actif'=>true],
            ['id'=>5,'initials'=>'ON','nom'=>'Oumar Ndiaye','email'=>'oumar.n@email.com','telephone'=>'+254 712 345 678','type_handicap'=>'cognitif','niveau_dependance'=>3,'reservations'=>1,'inscription'=>'01/03/2026','actif'=>true],
            ['id'=>6,'initials'=>'SE','nom'=>'Sophie Eteki','email'=>'sophie.e@email.com','telephone'=>'+237 6 12 34 56 78','type_handicap'=>'moteur','niveau_dependance'=>4,'reservations'=>2,'inscription'=>'05/03/2026','actif'=>true],
            ['id'=>7,'initials'=>'DK','nom'=>'Danielle Kanga','email'=>'d.kanga@email.com','telephone'=>'+233 24 123 4567','type_handicap'=>'sensoriel','niveau_dependance'=>1,'reservations'=>1,'inscription'=>'10/03/2026','actif'=>true],
            ['id'=>8,'initials'=>'MB','nom'=>'Mamadou Baldé','email'=>'m.balde@email.com','telephone'=>'+224 620 12 34 56','type_handicap'=>'moteur','niveau_dependance'=>3,'reservations'=>0,'inscription'=>'01/04/2026','actif'=>false],
        ];
    }
 
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/voyageurs/index', [
            'voyageurs' => $this->voyageurs(),
            'stats' => ['total'=>8,'actifs'=>7,'inactifs'=>1,'avec_profil_medical'=>6],
        ]);
    }
 
    public function show(int $id): \Inertia\Response
    {
        $v = collect($this->voyageurs())->firstWhere('id', $id) ?? $this->voyageurs()[0];
        return Inertia::render('dashboard/voyageurs/show', [
            'voyageur'  => $v,
            'reservations' => [
                ['ref'=>'HS-2026-0001','hebergement'=>'Hôtel Azur Accessible — Dakar','dates'=>'12–18 avr 2026','statut'=>'Terminée','montant'=>'186 000 F'],
                ['ref'=>'HS-2026-0007','hebergement'=>'Hôtel Grand Confort PMR — Accra','dates'=>'1–7 mai 2026','statut'=>'Confirmée','montant'=>'175 000 F'],
            ],
            'aidants' => [
                ['nom'=>'Adja Diarra','lien'=>'Épouse','telephone'=>'+221 77 987 65 43'],
            ],
        ]);
    }
}
