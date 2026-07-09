<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Urgence extends Model
{
    protected $table = 'urgences';

    protected $fillable = [
        'reference', 'voyageur_id', 'reservation_id', 'user_id',
        'latitude', 'longitude', 'adresse_approximative',
        'statut', 'type_urgence', 'description',
        'notes_resolution', 'declenchee_le',
        'prise_en_charge_le', 'resolue_le',
    ];

    protected $casts = [
        'latitude'           => 'float',
        'longitude'          => 'float',
        'declenchee_le'      => 'datetime',
        'prise_en_charge_le' => 'datetime',
        'resolue_le'         => 'datetime',
    ];

    public function voyageur(): BelongsTo
    {
        return $this->belongsTo(Voyageur::class, 'voyageur_id');
    }

    public function operateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class, 'reservation_id');
    }
}