<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportAdapte extends Model
{
    protected $table = 'transport_adaptes';

    protected $fillable = [
        'reference', 'voyageur_id', 'user_id', 'reservation_id',
        'type_vehicule', 'ville_depart', 'adresse_depart',
        'ville_arrivee', 'adresse_arrivee', 'date_heure',
        'equipements_json', 'instructions', 'montant', 'devise', 'statut',
    ];

    protected $casts = [
        'date_heure'       => 'datetime',
        'equipements_json' => 'array',
        'montant'          => 'float',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class, 'reservation_id');
    }

    public function voyageur(): BelongsTo
    {
        return $this->belongsTo(Voyageur::class, 'voyageur_id');
    }
}