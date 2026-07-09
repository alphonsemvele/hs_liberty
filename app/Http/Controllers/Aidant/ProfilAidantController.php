<?php

namespace App\Http\Controllers\Aidant;

use App\Http\Controllers\Controller;
use App\Models\Aidant;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfilAidantController extends Controller
{
    public function index(): Response
    {
        $user   = auth()->user();
        $aidant = Aidant::where('user_id', $user->id)->first();

        return Inertia::render('aidant/profil', [
            'profil' => [
                'prenom'    => $user->prenom ?? '',
                'nom'       => $user->nom ?? '',
                'email'     => $user->email ?? '',
                'telephone' => $aidant?->telephone ?? '',
                'specialite'=> $aidant?->specialite ?? '',
                'ville'     => $aidant?->ville ?? '',
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'prenom'     => 'required|string|max:100',
            'nom'        => 'required|string|max:100',
            'telephone'  => 'nullable|string|max:30',
            'specialite' => 'nullable|string|max:200',
            'ville'      => 'nullable|string|max:100',
        ]);

        auth()->user()->update([
            'prenom' => $request->prenom,
            'nom'    => $request->nom,
            'name'   => $request->prenom . ' ' . $request->nom,
        ]);

        Aidant::updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'telephone'  => $request->telephone,
                'specialite' => $request->specialite,
                'ville'      => $request->ville,
            ]
        );

        return back()->with('success', 'Profil mis à jour.');
    }
}