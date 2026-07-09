<?php

namespace App\Http\Controllers\Voyageur;

use App\Http\Controllers\Controller;
use App\Models\Voyageur;
use App\Models\ProgrammeSejour;
use Inertia\Inertia;
use Inertia\Response;

class ProgrammeVoyageurController extends Controller
{
    public function index(): Response
    {
        $v = Voyageur::where('user_id', auth()->id())->first();
        if (!$v) return Inertia::render('voyageur/programmes', ['programmes' => []]);

        $programmes = ProgrammeSejour::where('voyageur_id', $v->id)
            ->with(['reservation.hebergement', 'etapes'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($p) => [
                'id'          => $p->id,
                'titre'       => $p->titre,
                'destination' => optional($p->reservation?->hebergement)->ville ?? '—',
                'date_debut'  => optional($p->reservation)->date_arrivee?->format('d/m/Y') ?? '—',
                'date_fin'    => optional($p->reservation)->date_depart?->format('d/m/Y') ?? '—',
                'statut'      => $p->statut,
                'nb_etapes'   => $p->etapes->count(),
            ]);

        return Inertia::render('voyageur/programmes', [
            'programmes' => $programmes,
        ]);
    }

    public function show(int $id): Response
    {
        $v = Voyageur::where('user_id', auth()->id())->first();
        if (!$v) return Inertia::render('voyageur/programmes', ['programmes' => []]);

        $p = ProgrammeSejour::where('voyageur_id', $v->id)
            ->with(['reservation.hebergement', 'etapes'])
            ->findOrFail($id);

        return Inertia::render('voyageur/programme', [
            'programme' => [
                'id'          => $p->id,
                'titre'       => $p->titre,
                'destination' => optional($p->reservation?->hebergement)->ville ?? '—',
                'date_debut'  => optional($p->reservation)->date_arrivee?->format('d/m/Y') ?? '—',
                'date_fin'    => optional($p->reservation)->date_depart?->format('d/m/Y') ?? '—',
                'statut'      => $p->statut,
                'etapes'      => $p->etapes->sortBy('ordre')->map(fn ($e) => [
                    'ordre'       => $e->ordre,
                    'type'        => $e->type,
                    'titre'       => $e->titre,
                    'heure'       => $e->date_heure
                        ? \Carbon\Carbon::parse($e->date_heure)->format('H:i')
                        : '—',
                    'description' => $e->description ?? '',
                    'lieu'        => $e->lieu ?? '',
                ])->values(),
                'checklist' => array_map(fn ($c) => [
                    'item' => $c['item'] ?? '',
                    'fait' => (bool) ($c['fait'] ?? false),
                ], (array) $p->checklist_json),
            ],
        ]);
    }
}