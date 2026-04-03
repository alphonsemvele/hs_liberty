<?php
// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLERS hs liberty — Données statiques (BDD à connecter plus tard)
// Chaque controller est dans son propre fichier dans App\Http\Controllers\
// ═══════════════════════════════════════════════════════════════════════════════
 
// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/Http/Controllers/HebergementController.php
// ─────────────────────────────────────────────────────────────────────────────
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
 
class HebergementController extends Controller
{
    private function hebergements(): array
    {
        return [
            ['id'=>1,'nom'=>'Hôtel Azur Accessible','ville'=>'Dakar','pays'=>'SN','niveau_certif'=>'Excellence','note'=>4.8,'reservations'=>24,'actif'=>true,'created_at'=>'12/01/2026'],
            ['id'=>2,'nom'=>'Résidence PMR Casablanca Centre','ville'=>'Casablanca','pays'=>'MA','niveau_certif'=>'Accessible Plus','note'=>4.5,'reservations'=>18,'actif'=>true,'created_at'=>'08/02/2026'],
            ['id'=>3,'nom'=>'Villa Accessibilité Plus','ville'=>'Abidjan','pays'=>'CI','niveau_certif'=>'Accessible','note'=>4.2,'reservations'=>31,'actif'=>true,'created_at'=>'15/01/2026'],
            ['id'=>4,'nom'=>'Hôtel Liberté','ville'=>'Lomé','pays'=>'TG','niveau_certif'=>'Excellence','note'=>4.9,'reservations'=>12,'actif'=>true,'created_at'=>'20/02/2026'],
            ['id'=>5,'nom'=>'Appart PMR Nairobi Est','ville'=>'Nairobi','pays'=>'KE','niveau_certif'=>'Accessible Plus','note'=>4.3,'reservations'=>8,'actif'=>false,'created_at'=>'05/03/2026'],
            ['id'=>6,'nom'=>'Riad Accessible','ville'=>'Marrakech','pays'=>'MA','niveau_certif'=>'Accessible','note'=>4.1,'reservations'=>15,'actif'=>true,'created_at'=>'10/03/2026'],
            ['id'=>7,'nom'=>'Gîte Inclusion Douala','ville'=>'Douala','pays'=>'CM','niveau_certif'=>null,'note'=>0,'reservations'=>0,'actif'=>false,'created_at'=>'01/04/2026'],
            ['id'=>8,'nom'=>'Hôtel Grand Confort PMR','ville'=>'Accra','pays'=>'GH','niveau_certif'=>'Accessible','note'=>4.0,'reservations'=>7,'actif'=>true,'created_at'=>'22/03/2026'],
        ];
    }
 
    public function index(): \Inertia\Response
    {
        return Inertia::render('dashboard/hebergements/index', [
            'hebergements' => $this->hebergements(),
            'stats' => [
                'total'       => 8,
                'certifies'   => 6,
                'non_certifies'=> 2,
                'inactifs'    => 2,
            ],
        ]);
    }
 
    public function create(): \Inertia\Response
    {
        return Inertia::render('dashboard/hebergements/create');
    }
 
    public function store(Request $request)
    {
        // TODO: valider et sauvegarder
        return redirect()->route('hebergements.index');
    }
 
    public function show(int $id): \Inertia\Response
    {
        $heb = collect($this->hebergements())->firstWhere('id', $id)
            ?? $this->hebergements()[0];
 
        return Inertia::render('dashboard/hebergements/show', [
            'hebergement' => $heb,
            'equipements' => [
                'Fauteuil roulant de prêt','Lit médicalisé','Barre d\'appui salle de bain',
                'Douche à l\'italienne','Ascenseur PMR','Parking handicapé',
            ],
            'reservations_recentes' => [
                ['voyageur'=>'Kofi Diarra','dates'=>'12–18 avr 2026','statut'=>'Confirmée','montant'=>'186 000 F'],
                ['voyageur'=>'Fatou Touré','dates'=>'20–25 avr 2026','statut'=>'Confirmée','montant'=>'78 000 F'],
            ],
        ]);
    }
 
    public function edit(int $id): \Inertia\Response
    {
        $heb = collect($this->hebergements())->firstWhere('id', $id)
            ?? $this->hebergements()[0];
        return Inertia::render('dashboard/hebergements/edit', ['hebergement' => $heb]);
    }
 
    public function update(Request $request, int $id)
    {
        return redirect()->route('hebergements.index');
    }
 
    public function destroy(int $id)
    {
        return redirect()->route('hebergements.index');
    }
}