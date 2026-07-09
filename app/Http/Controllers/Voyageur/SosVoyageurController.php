<?php

namespace App\Http\Controllers\Voyageur;

use App\Http\Controllers\Controller;
use App\Models\Voyageur;
use App\Models\Urgence;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class SosVoyageurController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'type_urgence' => 'required|in:medical,securite,accident,autre',
            'description'  => 'nullable|string|max:500',
            'latitude'     => 'nullable|numeric',
            'longitude'    => 'nullable|numeric',
            'adresse'      => 'nullable|string|max:300',
        ]);

        $v = Voyageur::where('user_id', auth()->id())->firstOrFail();

        Urgence::create([
            'voyageur_id'           => $v->id,
            'type_urgence'          => $request->type_urgence,
            'description'           => $request->description,
            'latitude'              => $request->latitude,
            'longitude'             => $request->longitude,
            'adresse_approximative' => $request->adresse,
            'statut'                => 'declenche',
            'declenchee_le'         => now(),
        ]);

        return back()->with('sos_envoye', true);
    }
}