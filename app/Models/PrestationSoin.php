<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrestationSoin extends Model
{
    protected $table = 'prestation_soins';

    protected $fillable = [
        'professionnel_id', 'voyageur_id', 'reservation_id',
        'type_soin', 'statut', 'notes',
    ];

    public function professionnel(): BelongsTo
    {
        return $this->belongsTo(Professionnel::class, 'professionnel_id');
    }

    public function voyageur(): BelongsTo
    {
        return $this->belongsTo(Voyageur::class, 'voyageur_id');
    }
}