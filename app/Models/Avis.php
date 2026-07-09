<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Avis extends Model
{
    protected $table = 'avis';

    protected $fillable = [
        'reservation_id', 'hebergement_id', 'voyageur_id',
        'note_globale', 'note_accessibilite', 'note_equipements',
        'commentaire', 'verifie', 'signale', 'masque',
        'reponse_partenaire', 'reponse_le',
    ];

    protected $casts = [
        'verifie' => 'boolean',
        'signale' => 'boolean',
        'masque'  => 'boolean',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class, 'reservation_id');
    }

    public function hebergement(): BelongsTo
    {
        return $this->belongsTo(Hebergement::class, 'hebergement_id');
    }

    public function voyageur(): BelongsTo
    {
        return $this->belongsTo(Voyageur::class, 'voyageur_id');
    }
}