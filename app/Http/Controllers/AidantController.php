<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;


class AidantController extends Controller
{
    private function aidants(): array
    {
        return [
            ['id'=>1,'initials'=>'AD','nom'=>'Adja Diarra','email'=>'adja.d@email.com','lien_parente'=>'Épouse','voyageur_suivi'=>'Kofi Diarra','niveau_acces'=>'ecriture','actif_depuis'=>'10/01/2026'],
            ['id'=>2,'initials'=>'CM','nom'=>'Céline Mbaye','email'=>'celine.m@email.com','lien_parente'=>'Fille','voyageur_suivi'=>'Amina Mbaye','niveau_acces'=>'lecture','actif_depuis'=>'15/01/2026'],
            ['id'=>3,'initials'=>'PE','nom'=>'Pierre Essomba','email'=>'pierre.e@email.com','lien_parente'=>'Frère','voyageur_suivi'=>'Jean-Baptiste Essomba','niveau_acces'=>'urgence','actif_depuis'=>'08/02/2026'],
            ['id'=>4,'initials'=>'IT','nom'=>'Ibrahim Touré','email'=>'ibrahim.t@email.com','lien_parente'=>'Père','voyageur_suivi'=>'Fatou Touré','niveau_acces'=>'ecriture','actif_depuis'=>'20/02/2026'],
            ['id'=>5,'initials'=>'SN','nom'=>'Seynabou Ndiaye','email'=>'seynabou.n@email.com','lien_parente'=>'Mère','voyageur_suivi'=>'Oumar Ndiaye','niveau_acces'=>'lecture','actif_depuis'=>'01/03/2026'],
        ];
    }
 
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/aidants/index', [
            'aidants' => $this->aidants(),
            'stats'   => ['total'=>5,'acces_ecriture'=>2,'acces_lecture'=>2,'acces_urgence'=>1],
        ]);
    }
 
    public function show(int $id): \Inertia\Response
    {
        $a = collect($this->aidants())->firstWhere('id', $id) ?? $this->aidants()[0];
        return Inertia::render('dashboard/aidants/show', ['aidant' => $a]);
    }
}
