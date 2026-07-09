<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reservation extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'reservations';

    protected $fillable = [
        'reference',
        'voyageur_id',
        'hebergement_id',
        'date_arrivee',
        'date_depart',
        'nb_nuits',
        'nb_voyageurs',
        'montant_total',
        'devise',
        'statut',
        'paiement_statut',
        'paiement_intent_id',
        'besoins_speciaux',
        'notes_admin',
    ];

    protected $casts = [
        'date_arrivee'  => 'date',
        'date_depart'   => 'date',
        'montant_total' => 'float',
        'deleted_at'    => 'datetime',
    ];

    public function voyageur(): BelongsTo
    {
        return $this->belongsTo(Voyageur::class, 'voyageur_id');
    }

    public function hebergement(): BelongsTo
    {
        return $this->belongsTo(Hebergement::class, 'hebergement_id');
    }

    public function avis(): HasOne
    {
        return $this->hasOne(Avis::class, 'reservation_id');
    }

    public function programme(): HasOne
    {
        return $this->hasOne(ProgrammeSejour::class, 'reservation_id');
    }

    public function prestation_soins(): HasMany
    {
        return $this->hasMany(PrestationSoin::class, 'reservation_id');
    }

    // Génère une référence unique ex: HS-2026-00001
    public static function genererReference(): string
    {
        $annee    = date('Y');
        $derniere = static::withTrashed()
            ->whereYear('created_at', $annee)
            ->count();
        return 'HS-' . $annee . '-' . str_pad($derniere + 1, 5, '0', STR_PAD_LEFT);
    }
}