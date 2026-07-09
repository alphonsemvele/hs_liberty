<?php

namespace App\Http\Controllers;

use App\Models\ProgrammeSejour;
use App\Models\EtapeProgramme;
use App\Models\Reservation;
use App\Models\Voyageur;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProgrammeController extends Controller
{
    public function index(): Response
    {
        $programmes = ProgrammeSejour::with(['voyageur.user', 'reservation.hebergement', 'etapes'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($p) => [
                'id'               => $p->id,
                'titre'            => $p->titre,
                'voyageur'         => trim(optional($p->voyageur?->user)->prenom . ' ' . optional($p->voyageur?->user)->nom) ?: 'Inconnu',
                'voyageur_initials'=> strtoupper(
                    substr(optional($p->voyageur?->user)->prenom ?? '?', 0, 1) .
                    substr(optional($p->voyageur?->user)->nom    ?? '?', 0, 1)
                ),
                'destination'      => optional($p->reservation?->hebergement)->ville ?? '—',
                'pays'             => optional($p->reservation?->hebergement)->pays  ?? '',
                'date_debut'       => optional($p->reservation)->date_arrivee?->format('d/m/Y') ?? '—',
                'date_fin'         => optional($p->reservation)->date_depart?->format('d/m/Y')  ?? '—',
                'nb_nuits'         => optional($p->reservation)->nb_nuits ?? 0,
                'nb_etapes'        => $p->etapes->count(),
                'checklist_total'  => count((array) $p->checklist_json),
                'checklist_faites' => count(array_filter((array) $p->checklist_json, fn ($c) => $c['fait'] ?? false)),
                'statut'           => $p->statut,
                'partage_aidants'  => (bool) $p->partage_aidants,
                'urgences'         => 0,
            ]);

        return Inertia::render('dashboard/programme/index', [
            'programmes' => $programmes,
            'stats' => [
                'total'    => ProgrammeSejour::count(),
                'en_cours' => ProgrammeSejour::where('statut', 'en_cours')->count(),
                'a_venir'  => ProgrammeSejour::where('statut', 'a_venir')->count(),
                'termines' => ProgrammeSejour::where('statut', 'termine')->count(),
            ],
        ]);
    }

    public function show(int $id): Response
    {
        $p = ProgrammeSejour::with(['voyageur.user', 'reservation.hebergement', 'etapes'])
            ->findOrFail($id);

        $checklist = (array) $p->checklist_json;

        return Inertia::render('dashboard/programme/show', [
            'programme' => [
                'id'              => $p->id,
                'titre'           => $p->titre,
                'voyageur'        => trim(optional($p->voyageur?->user)->prenom . ' ' . optional($p->voyageur?->user)->nom) ?: 'Inconnu',
                'destination'     => optional($p->reservation?->hebergement)->ville ?? '—',
                'date_debut'      => optional($p->reservation)->date_arrivee?->format('d/m/Y') ?? '—',
                'date_fin'        => optional($p->reservation)->date_depart?->format('d/m/Y')  ?? '—',
                'statut'          => $p->statut,
                'partage_aidants' => (bool) $p->partage_aidants,
                'etapes'          => $p->etapes->sortBy('ordre')->map(fn ($e) => [
                    'ordre'   => $e->ordre,
                    'type'    => $e->type,
                    'titre'   => $e->titre,
                    'heure'   => $e->date_heure ? \Carbon\Carbon::parse($e->date_heure)->format('H:i') : '—',
                    'details' => $e->description ?? '',
                ])->values(),
                'checklist' => array_map(fn ($c) => [
                    'item' => $c['item'] ?? '',
                    'fait' => (bool) ($c['fait'] ?? false),
                ], $checklist),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('dashboard/programme/create', [
            'voyageurs' => Voyageur::with('user')->whereNull('deleted_at')->get()->map(fn ($v) => [
                'id'  => $v->id,
                'nom' => trim(optional($v->user)->prenom . ' ' . optional($v->user)->nom) ?: 'Inconnu',
            ]),
            'reservations' => Reservation::with('hebergement')
                ->whereIn('statut', ['confirmee', 'en_attente'])
                ->orderByDesc('created_at')
                ->get()
                ->map(fn ($r) => [
                    'id'          => $r->id,
                    'ref'         => $r->reference,
                    'hebergement' => optional($r->hebergement)->nom ?? 'Inconnu',
                    'ville'       => optional($r->hebergement)->ville ?? '',
                    'date_arrivee'=> $r->date_arrivee->format('d/m/Y'),
                    'date_depart' => $r->date_depart->format('d/m/Y'),
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'voyageur_id'    => 'required|integer|exists:voyageurs,id',
            'reservation_id' => 'required|integer|exists:reservations,id',
            'titre'          => 'required|string|max:300',
        ]);

        $p = ProgrammeSejour::create([
            'voyageur_id'     => $validated['voyageur_id'],
            'reservation_id'  => $validated['reservation_id'],
            'titre'           => $validated['titre'],
            'statut'          => 'brouillon',
            'partage_aidants' => false,
            'checklist_json'  => [],
        ]);

        return redirect()->route('programme.show', $p->id)->with('success', 'Programme créé.');
    }

    // ─────────────────────────────────────────────────────────
    // POST /programme/{id}/etapes
    // ─────────────────────────────────────────────────────────
    public function storeEtape(Request $request, int $id): RedirectResponse
    {
        ProgrammeSejour::findOrFail($id);

        $validated = $request->validate([
            'type'        => 'required|in:transport,hebergement,loisir,soin,autre',
            'titre'       => 'required|string|max:300',
            'date_heure'  => 'nullable|string',
            'description' => 'nullable|string|max:500',
            'lieu'        => 'nullable|string|max:300',
        ]);

        $ordre = EtapeProgramme::where('programme_id', $id)->max('ordre') + 1;

        EtapeProgramme::create([
            'programme_id' => $id,
            'ordre'        => $ordre,
            'type'         => $validated['type'],
            'titre'        => $validated['titre'],
            'date_heure'   => !empty($validated['date_heure'])
                ? '2000-01-01 ' . $validated['date_heure'] . ':00'
                : null,
            'description'  => $validated['description'] ?? null,
            'lieu'         => $validated['lieu'] ?? null,
        ]);

        return redirect()
            ->route('programme.show', $id)
            ->with('success', 'Étape ajoutée.');
    }
}