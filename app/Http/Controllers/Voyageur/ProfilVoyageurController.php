<?php

namespace App\Http\Controllers\Voyageur;

use App\Http\Controllers\Controller;
use App\Models\Voyageur;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ProfilVoyageurController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $v    = Voyageur::where('user_id', $user->id)->first();

        return Inertia::render('voyageur/profil', [
            'profil' => [
                'prenom'            => $user->prenom ?? '',
                'nom'               => $user->nom ?? '',
                'email'             => $user->email ?? '',
                'type_handicap'     => $v?->type_handicap ?? '',
                'niveau_dependance' => $v?->niveau_dependance ?? 1,
                'besoins'           => $v?->besoins_specifiques ?? '',
                'telephone'         => $v?->telephone ?? '',
                'date_naissance'    => $v?->date_naissance?->format('Y-m-d') ?? '',
                'ville'             => $v?->ville ?? '',
                'pays'              => $v?->pays ?? '',
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'prenom'            => 'required|string|max:100',
            'nom'               => 'required|string|max:100',
            'telephone'         => 'nullable|string|max:30',
            'type_handicap'     => 'nullable|string|max:100',
            'niveau_dependance' => 'nullable|integer|min:1|max:5',
            'besoins'           => 'nullable|string|max:1000',
            'ville'             => 'nullable|string|max:100',
            'pays'              => 'nullable|string|max:100',
        ]);

        $user = auth()->user();

        // Mettre à jour users
        $user->update([
            'prenom' => $request->prenom,
            'nom'    => $request->nom,
            'name'   => $request->prenom . ' ' . $request->nom,
        ]);

        // Mettre à jour ou créer le profil voyageur
        Voyageur::updateOrCreate(
            ['user_id' => $user->id],
            [
                'telephone'          => $request->telephone,
                'type_handicap'      => $request->type_handicap,
                'niveau_dependance'  => $request->niveau_dependance ?? 1,
                'besoins_specifiques'=> $request->besoins,
                'ville'              => $request->ville,
                'pays'               => $request->pays,
            ]
        );

        return back()->with('success', 'Profil mis à jour.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => 'required',
            'password'         => 'required|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, auth()->user()->password)) {
            return back()->withErrors(['current_password' => 'Mot de passe actuel incorrect.']);
        }

        auth()->user()->update(['password' => Hash::make($request->password)]);

        return back()->with('success', 'Mot de passe mis à jour.');
    }
}