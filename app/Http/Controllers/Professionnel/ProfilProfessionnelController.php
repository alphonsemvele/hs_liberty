<?php

namespace App\Http\Controllers\Professionnel;

use App\Http\Controllers\Controller;
use App\Models\Professionnel;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfilProfessionnelController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $prof = Professionnel::where('user_id', $user->id)->first();

        return Inertia::render('professionnel/profil', [
            'profil' => [
                'prenom'          => $user->prenom ?? '',
                'nom'             => $user->nom ?? '',
                'email'           => $user->email ?? '',
                'specialite'      => $prof?->specialite ?? '',
                'specialite_autre'=> $prof?->specialite_autre ?? '',
                'numero_rpps'     => $prof?->numero_rpps ?? '',
                'tarif_horaire'   => $prof?->tarif_horaire ?? '',
                'devise'          => $prof?->devise ?? 'XOF',
                'bio'             => $prof?->bio ?? '',
                'certifie'        => (bool) ($prof?->certifie ?? false),
                'diplome_valide'  => (bool) ($prof?->diplome_valide ?? false),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'prenom'          => 'required|string|max:100',
            'nom'             => 'required|string|max:100',
            'specialite'      => 'nullable|string|max:200',
            'specialite_autre'=> 'nullable|string|max:200',
            'numero_rpps'     => 'nullable|string|max:100',
            'tarif_horaire'   => 'nullable|numeric|min:0',
            'devise'          => 'nullable|string|max:3',
            'bio'             => 'nullable|string|max:2000',
        ]);

        $user = auth()->user();
        $user->update([
            'prenom' => $request->prenom,
            'nom'    => $request->nom,
            'name'   => $request->prenom . ' ' . $request->nom,
        ]);

        Professionnel::updateOrCreate(
            ['user_id' => $user->id],
            [
                'specialite'       => $request->specialite,
                'specialite_autre' => $request->specialite_autre,
                'numero_rpps'      => $request->numero_rpps,
                'tarif_horaire'    => $request->tarif_horaire ?? 0,
                'devise'           => $request->devise ?? 'XOF',
                'bio'              => $request->bio,
            ]
        );

        return back()->with('success', 'Profil mis à jour.');
    }
}