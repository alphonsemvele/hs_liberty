<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfessionnelController extends Controller
{
    private function professionnels(): array
    {
        return [
            ['id'=>1,'initials'=>'FS','nom'=>'Dr. Fatima Sow','email'=>'f.sow@email.com','specialite'=>'Infirmière','pays'=>['SN','MA'],'tarif'=>'15 000 F/h','note'=>4.9,'diplome_valide'=>true,'assurance_rc'=>true,'prestations'=>18,'inscription'=>'05/01/2026'],
            ['id'=>2,'initials'=>'MB','nom'=>'Mohamed Benali','email'=>'m.benali@email.com','specialite'=>'Kinésithérapeute','pays'=>['MA','DZ'],'tarif'=>'20 000 F/h','note'=>4.7,'diplome_valide'=>true,'assurance_rc'=>true,'prestations'=>12,'inscription'=>'10/01/2026'],
            ['id'=>3,'initials'=>'AK','nom'=>'Alice Koffi','email'=>'a.koffi@email.com','specialite'=>'Auxiliaire de vie','pays'=>['CI','SN'],'tarif'=>'8 000 F/h','note'=>4.8,'diplome_valide'=>true,'assurance_rc'=>true,'prestations'=>24,'inscription'=>'15/01/2026'],
            ['id'=>4,'initials'=>'JO','nom'=>'James Ochieng','email'=>'j.ochieng@email.com','specialite'=>'Aide-soignant','pays'=>['KE','TZ'],'tarif'=>'12 000 F/h','note'=>4.5,'diplome_valide'=>true,'assurance_rc'=>false,'prestations'=>9,'inscription'=>'20/02/2026'],
            ['id'=>5,'initials'=>'MN','nom'=>'Marie Nkoue','email'=>'m.nkoue@email.com','specialite'=>'Infirmière','pays'=>['CM','GA'],'tarif'=>'14 000 F/h','note'=>4.6,'diplome_valide'=>true,'assurance_rc'=>true,'prestations'=>15,'inscription'=>'01/03/2026'],
            ['id'=>6,'initials'=>'YT','nom'=>'Youssef Tahiri','email'=>'y.tahiri@email.com','specialite'=>'Kinésithérapeute','pays'=>['MA'],'tarif'=>'18 000 F/h','note'=>0,'diplome_valide'=>false,'assurance_rc'=>false,'prestations'=>0,'inscription'=>'01/04/2026'],
        ];
    }
 
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/professionnels/index', [
            'professionnels' => $this->professionnels(),
            'stats' => ['total'=>6,'certifies'=>5,'en_attente_validation'=>1,'prestations_mois'=>12],
        ]);
    }
 
    public function show(int $id): \Inertia\Response
    {
        $p = collect($this->professionnels())->firstWhere('id', $id) ?? $this->professionnels()[0];
        return Inertia::render('dashboard/professionnels/show', [
            'professionnel' => $p,
            'prestations_recentes' => [
                ['voyageur'=>'Kofi Diarra','type'=>'Soins infirmiers','date'=>'13/04/2026','duree'=>'1h','montant'=>'15 000 F','statut'=>'realise'],
                ['voyageur'=>'Fatou Touré','type'=>'Soins infirmiers','date'=>'21/04/2026','duree'=>'1h','montant'=>'15 000 F','statut'=>'planifie'],
            ],
        ]);
    }
}