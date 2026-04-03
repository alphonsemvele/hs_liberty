<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RapportController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/rapports/index', [
            'kpis' => [
                'reservations_mois'      => 127,
                'revenus_mois'           => '6 540 000 F',
                'taux_occupation'        => 74,
                'taux_satisfaction'      => 94,
                'voyageurs_actifs'       => 1842,
                'urgences_mois'          => 4,
                'certifications_valides' => 4,
                'professionnels_actifs'  => 5,
            ],
            'reservations_par_mois' => [
                ['mois'=>'Oct 2025','count'=>42],
                ['mois'=>'Nov 2025','count'=>58],
                ['mois'=>'Dec 2025','count'=>74],
                ['mois'=>'Jan 2026','count'=>89],
                ['mois'=>'Feb 2026','count'=>103],
                ['mois'=>'Mar 2026','count'=>118],
                ['mois'=>'Avr 2026','count'=>127],
            ],
            'top_hebergements' => [
                ['nom'=>'Hôtel Azur Accessible','ville'=>'Dakar','reservations'=>24,'note'=>4.8],
                ['nom'=>'Villa Accessibilité Plus','ville'=>'Abidjan','reservations'=>31,'note'=>4.2],
                ['nom'=>'Hôtel Liberté','ville'=>'Lomé','reservations'=>12,'note'=>4.9],
                ['nom'=>'Résidence PMR Casablanca','ville'=>'Casablanca','reservations'=>18,'note'=>4.5],
            ],
            'repartition_handicap' => [
                ['type'=>'Moteur','count'=>64,'pct'=>48],
                ['type'=>'Sensoriel','count'=>28,'pct'=>21],
                ['type'=>'Cognitif','count'=>18,'pct'=>13],
                ['type'=>'Polyhandicap','count'=>24,'pct'=>18],
            ],
        ]);
    }
}