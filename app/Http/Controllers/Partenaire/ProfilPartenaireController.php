<?php

namespace App\Http\Controllers\Partenaire;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfilPartenaireController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        return Inertia::render('partenaire/profil', [
            'profil' => [
                'prenom'    => $user->prenom ?? '',
                'nom'       => $user->nom ?? '',
                'email'     => $user->email ?? '',
                'telephone' => $user->telephone ?? '',
                'ville'     => $user->ville ?? '',
                'pays'      => $user->pays ?? '',
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'prenom'    => 'required|string|max:100',
            'nom'       => 'required|string|max:100',
            'telephone' => 'nullable|string|max:30',
            'ville'     => 'nullable|string|max:100',
            'pays'      => 'nullable|string|max:100',
        ]);

        auth()->user()->update([
            'prenom' => $request->prenom,
            'nom'    => $request->nom,
            'name'   => $request->prenom . ' ' . $request->nom,
        ]);

        return back()->with('success', 'Profil mis à jour.');
    }
}