<?php

namespace App\Http\Controllers\Aidant;

use App\Http\Controllers\Controller;
use App\Models\Aidant;
use App\Models\SuiviAidant;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ChecklistAidantController extends Controller
{
    public function show(int $voyageurId): Response
    {
        $aidant = Aidant::where('user_id', auth()->id())->firstOrFail();

        $suivi = SuiviAidant::where('aidant_id', $aidant->id)
            ->where('voyageur_id', $voyageurId)
            ->firstOrFail();

        $checklist = (array) ($suivi->checklist_json ?? $this->checklistDefaut());

        return Inertia::render('aidant/checklist', [
            'voyageur_id' => $voyageurId,
            'suivi_id'    => $suivi->id,
            'checklist'   => $checklist,
        ]);
    }

    public function update(Request $request, int $voyageurId): RedirectResponse
    {
        $request->validate([
            'checklist'         => 'required|array',
            'checklist.*.item'  => 'required|string',
            'checklist.*.fait'  => 'boolean',
        ]);

        $aidant = Aidant::where('user_id', auth()->id())->firstOrFail();

        SuiviAidant::where('aidant_id', $aidant->id)
            ->where('voyageur_id', $voyageurId)
            ->firstOrFail()
            ->update(['checklist_json' => $request->checklist]);

        return back()->with('success', 'Checklist mise à jour.');
    }

    private function checklistDefaut(): array
    {
        return [
            ['item' => 'Vérifier les documents de voyage (passeport, visa)', 'fait' => false, 'categorie' => 'documents'],
            ['item' => 'Confirmer la réservation hébergement accessible',    'fait' => false, 'categorie' => 'hebergement'],
            ['item' => 'Préparer les médicaments et ordonnances',            'fait' => false, 'categorie' => 'sante'],
            ['item' => 'Vérifier le transport adapté (aller)',               'fait' => false, 'categorie' => 'transport'],
            ['item' => 'Vérifier le transport adapté (retour)',              'fait' => false, 'categorie' => 'transport'],
            ['item' => 'Contacter l\'hébergement pour besoins spécifiques',  'fait' => false, 'categorie' => 'hebergement'],
            ['item' => 'Préparer le matériel médical (fauteuil, oxygène…)', 'fait' => false, 'categorie' => 'sante'],
            ['item' => 'Partager les numéros d\'urgence locaux',             'fait' => false, 'categorie' => 'securite'],
            ['item' => 'Sauvegarder les contacts de l\'équipe hs liberty',   'fait' => false, 'categorie' => 'securite'],
            ['item' => 'Vérifier l\'assurance voyage et rapatriement',       'fait' => false, 'categorie' => 'documents'],
        ];
    }
}