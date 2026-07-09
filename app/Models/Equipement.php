<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Equipement extends Model
{
    public $timestamps = false;

    protected $table = 'equipements';

    protected $fillable = ['code', 'libelle', 'categorie'];

    public function hebergements(): BelongsToMany
    {
        return $this->belongsToMany(
            Hebergement::class,
            'equipement_hebergement',
            'equipement_id',
            'hebergement_id'
        );
    }

    public function voyageurs(): BelongsToMany
    {
        return $this->belongsToMany(
            Voyageur::class,
            'equipement_voyageur',
            'equipement_id',
            'voyageur_id'
        );
    }
}