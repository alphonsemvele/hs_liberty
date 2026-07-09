<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Hebergement;
use App\Models\Voyageur;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    // ─────────────────────────────────────────────────────────
    // GET /reservations
    // ─────────────────────────────────────────────────────────
    public function index(): Response
    {
        $reservations = Reservation::with(['voyageur.user', 'hebergement'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($r) => [
                'id'          => $r->id,
                'ref'         => $r->reference,
                'initials'    => strtoupper(
                    substr(optional($r->voyageur?->user)->prenom ?? '?', 0, 1) .
                    substr(optional($r->voyageur?->user)->nom    ?? '?', 0, 1)
                ),
                'voyageur'    => trim(
                    (optional($r->voyageur?->user)->prenom ?? '') . ' ' .
                    (optional($r->voyageur?->user)->nom    ?? '')
                ) ?: 'Inconnu',
                'hebergement' => optional($r->hebergement)->nom ?? 'Inconnu',
                'date_arrivee'=> $r->date_arrivee->format('d/m/Y'),
                'date_depart' => $r->date_depart->format('d/m/Y'),
                'nb_nuits'    => $r->nb_nuits,
                'statut'      => ucfirst($r->statut),
                'montant'     => number_format($r->montant_total, 0, ',', ' ') . ' ' . $r->devise,
                'devise'      => $r->devise,
                'created_at'  => $r->created_at->format('d/m/Y'),
            ]);

        $total    = Reservation::count();
        $revenus  = Reservation::whereIn('statut', ['confirmee', 'terminee'])->sum('montant_total');

        return Inertia::render('dashboard/reservations/index', [
            'reservations' => $reservations,
            'stats' => [
                'total'        => $total,
                'confirmees'   => Reservation::where('statut', 'confirmee')->count(),
                'en_attente'   => Reservation::where('statut', 'en_attente')->count(),
                'terminees'    => Reservation::where('statut', 'terminee')->count(),
                'annulees'     => Reservation::where('statut', 'annulee')->count(),
                'revenus_mois' => number_format($revenus, 0, ',', ' ') . ' XOF',
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────
    // GET /reservations/create
    // ─────────────────────────────────────────────────────────
    public function create(): Response
    {
        return Inertia::render('dashboard/reservations/create', [
            'hebergements' => Hebergement::where('actif', true)
                ->orderBy('nom')
                ->get(['id', 'nom', 'ville', 'pays', 'prix_nuit_min', 'prix_nuit_max', 'devise']),
            'voyageurs'    => Voyageur::with('user')
                ->whereNull('deleted_at')
                ->get()
                ->map(fn ($v) => [
                    'id'       => $v->id,
                    'nom'      => trim(optional($v->user)->prenom . ' ' . optional($v->user)->nom),
                    'initials' => strtoupper(
                        substr(optional($v->user)->prenom ?? '?', 0, 1) .
                        substr(optional($v->user)->nom    ?? '?', 0, 1)
                    ),
                    'type_handicap'    => $v->type_handicap,
                    'niveau_dependance'=> $v->niveau_dependance,
                ]),
        ]);
    }

    // ─────────────────────────────────────────────────────────
    // POST /reservations
    // ─────────────────────────────────────────────────────────
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'voyageur_id'     => 'required|integer|exists:voyageurs,id',
            'hebergement_id'  => 'required|integer|exists:hebergements,id',
            'date_arrivee'    => 'required|date|after_or_equal:today',
            'date_depart'     => 'required|date|after:date_arrivee',
            'nb_voyageurs'    => 'required|integer|min:1|max:20',
            'besoins_speciaux'=> 'nullable|string|max:1000',
            'devise'          => 'nullable|string|max:3',
        ]);

        $hebergement = Hebergement::findOrFail($validated['hebergement_id']);
        $arrivee     = \Carbon\Carbon::parse($validated['date_arrivee']);
        $depart      = \Carbon\Carbon::parse($validated['date_depart']);
        $nbNuits     = $arrivee->diffInDays($depart);
        $montant     = $nbNuits * $hebergement->prix_nuit_min;

        $reservation = Reservation::create([
            'reference'       => Reservation::genererReference(),
            'voyageur_id'     => $validated['voyageur_id'],
            'hebergement_id'  => $validated['hebergement_id'],
            'date_arrivee'    => $validated['date_arrivee'],
            'date_depart'     => $validated['date_depart'],
            'nb_nuits'        => $nbNuits,
            'nb_voyageurs'    => $validated['nb_voyageurs'],
            'montant_total'   => $montant,
            'devise'          => $validated['devise'] ?? $hebergement->devise,
            'statut'          => 'en_attente',
            'paiement_statut' => 'non_paye',
            'besoins_speciaux'=> $validated['besoins_speciaux'] ?? null,
        ]);

        return redirect()
            ->route('reservations.show', $reservation->id)
            ->with('success', 'Réservation créée — réf. ' . $reservation->reference);
    }

    // ─────────────────────────────────────────────────────────
    // GET /reservations/{id}
    // ─────────────────────────────────────────────────────────
    public function show(int $id): Response
    {
        $r = Reservation::with(['voyageur.user', 'hebergement.equipements'])->findOrFail($id);

        return Inertia::render('dashboard/reservations/show', [
            'reservation' => [
                'id'              => $r->id,
                'ref'             => $r->reference,
                'initials'        => strtoupper(
                    substr(optional($r->voyageur?->user)->prenom ?? '?', 0, 1) .
                    substr(optional($r->voyageur?->user)->nom    ?? '?', 0, 1)
                ),
                'voyageur'        => trim(optional($r->voyageur?->user)->prenom . ' ' . optional($r->voyageur?->user)->nom) ?: 'Inconnu',
                'voyageur_id'     => $r->voyageur_id,
                'hebergement'     => optional($r->hebergement)->nom ?? 'Inconnu',
                'hebergement_id'  => $r->hebergement_id,
                'ville'           => optional($r->hebergement)->ville ?? '',
                'pays'            => optional($r->hebergement)->pays ?? '',
                'date_arrivee'    => $r->date_arrivee->format('d/m/Y'),
                'date_depart'     => $r->date_depart->format('d/m/Y'),
                'nb_nuits'        => $r->nb_nuits,
                'nb_voyageurs'    => $r->nb_voyageurs,
                'statut'          => $r->statut,
                'paiement_statut' => $r->paiement_statut,
                'montant'         => number_format($r->montant_total, 0, ',', ' ') . ' ' . $r->devise,
                'montant_raw'     => $r->montant_total,
                'devise'          => $r->devise,
                'besoins_speciaux'=> $r->besoins_speciaux,
                'created_at'      => $r->created_at->format('d/m/Y'),
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────
    // PUT /reservations/{id}/statut
    // ─────────────────────────────────────────────────────────
    public function updateStatut(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'statut' => 'required|in:en_attente,confirmee,annulee,terminee,litige',
        ]);

        Reservation::findOrFail($id)->update(['statut' => $request->statut]);

        return redirect()
            ->route('reservations.show', $id)
            ->with('success', 'Statut mis à jour.');
    }
}