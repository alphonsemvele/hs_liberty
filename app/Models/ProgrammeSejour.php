<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProgrammeSejour extends Model
{
    protected $table = 'programme_sejours';

    protected $fillable = [
        'reservation_id', 'voyageur_id', 'titre',
        'statut', 'partage_aidants', 'checklist_json',
    ];

    protected $casts = [
        'partage_aidants' => 'boolean',
        'checklist_json'  => 'array',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class, 'reservation_id');
    }

    public function voyageur(): BelongsTo
    {
        return $this->belongsTo(Voyageur::class, 'voyageur_id');
    }

    public function etapes(): HasMany
    {
        return $this->hasMany(EtapeProgramme::class, 'programme_id')->orderBy('ordre');
    }
}