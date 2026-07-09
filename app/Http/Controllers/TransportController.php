<?php

namespace App\Http\Controllers;

use App\Models\TransportAdapte;
use App\Models\Voyageur;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransportController extends Controller
{
    // GET /transports
    public function index(): Response
    {
        $transports = TransportAdapte::with(['voyageur.user'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($t) => [
                'id'            => $t->id,
                'reference'     => $t->reference,
                'voyageur'      => trim(optional($t->voyageur?->user)->prenom . ' ' . optional($t->voyageur?->user)->nom) ?: 'Inconnu',
                'initials'      => strtoupper(
                    substr(optional($t->voyageur?->user)->prenom ?? '?', 0, 1) .
                    substr(optional($t->voyageur?->user)->nom    ?? '?', 0, 1)
                ),
                'type_vehicule' => $t->type_vehicule,
                'ville_depart'  => $t->ville_depart,
                'ville_arrivee' => $t->ville_arrivee,
                'date_depart'   => $t->date_heure?->format('d/m/Y H:i') ?? '—',
                'statut'        => $t->statut,
                'montant'       => $t->montant > 0 ? number_format($t->montant, 0, ',', ' ') . ' ' . $t->devise : '—',
            ]);

        return Inertia::render('dashboard/transports/index', [
            'transports' => $transports,
            'stats' => [
                'total'     => TransportAdapte::count(),
                'planifies' => TransportAdapte::where('statut', 'en_attente')->count(),
                'en_cours'  => TransportAdapte::where('statut', 'en_cours')->count(),
                'termines'  => TransportAdapte::where('statut', 'termine')->count(),
            ],
        ]);
    }

    // GET /transports/create
    public function create(): Response
    {
        return Inertia::render('dashboard/transports/create', [
            'voyageurs' => Voyageur::with('user')->whereNull('deleted_at')->get()->map(fn ($v) => [
                'id'               => $v->id,
                'nom'              => trim(optional($v->user)->prenom . ' ' . optional($v->user)->nom) ?: 'Inconnu',
                'type_handicap'    => $v->type_handicap,
                'niveau_dependance'=> $v->niveau_dependance,
            ]),
        ]);
    }

    // POST /transports
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id_voyageur'    => 'required|integer|exists:voyageurs,id',
            'type_vehicule'  => 'required|in:berline,van,minibus,ambulance_legere',
            'ville_depart'   => 'required|string|max:150',
            'adresse_depart' => 'required|string|max:500',
            'ville_arrivee'  => 'required|string|max:150',
            'adresse_arrivee'=> 'required|string|max:500',
            'date_heure'     => 'required|date',
            'equipements'    => 'nullable|array',
            'instructions'   => 'nullable|string|max:2000',
            'montant'        => 'nullable|numeric|min:0',
            'devise'         => 'nullable|string|max:3',
        ]);

        $voyageur = Voyageur::with('user')->findOrFail($request->id_voyageur);

        TransportAdapte::create([
            'reference'        => 'TR-' . date('Y') . '-' . str_pad(TransportAdapte::count() + 1, 4, '0', STR_PAD_LEFT),
            'voyageur_id'      => $voyageur->id,
            'user_id'          => $voyageur->user_id,
            'type_vehicule'    => $request->type_vehicule,
            'ville_depart'     => $request->ville_depart,
            'adresse_depart'   => $request->adresse_depart,
            'ville_arrivee'    => $request->ville_arrivee,
            'adresse_arrivee'  => $request->adresse_arrivee,
            'date_heure'       => $request->date_heure,
            'equipements_json' => $request->equipements ?? [],
            'instructions'     => $request->instructions,
            'montant'          => $request->montant ?? 0,
            'devise'           => $request->devise ?? 'XOF',
            'statut'           => 'en_attente',
        ]);

        return redirect()
            ->route('transports.index')
            ->with('success', 'Transport réservé.');
    }

    // PATCH /transports/{id}/statut
    public function updateStatut(Request $request, int $id): RedirectResponse
    {
        $request->validate(['statut' => 'required|in:en_attente,confirme,en_cours,termine,annule']);
        TransportAdapte::findOrFail($id)->update(['statut' => $request->statut]);

        return redirect()->route('transports.index')->with('success', 'Statut mis à jour.');
    }
}