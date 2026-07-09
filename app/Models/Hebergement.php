<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Hebergement extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'hebergements';

    protected $fillable = [
        'user_id',
        'nom',
        'description',
        'type',
        'adresse',
        'ville',
        'pays',
        'code_postal',
        'latitude',
        'longitude',
        'prix_nuit_min',
        'prix_nuit_max',
        'devise',
        'niveau_certification',
        'actif',
    ];

    protected $casts = [
        'latitude'      => 'float',
        'longitude'     => 'float',
        'prix_nuit_min' => 'float',
        'prix_nuit_max' => 'float',
        'note_moyenne'  => 'float',
        'actif'         => 'boolean',
        'deleted_at'    => 'datetime',
    ];

    // ── Relations ─────────────────────────────────────────────

    public function partenaire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function equipements(): BelongsToMany
    {
        return $this->belongsToMany(
            Equipement::class,
            'equipement_hebergement',
            'hebergement_id',
            'equipement_id'
        )->withPivot('commentaire');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'hebergement_id');
    }

    public function certifications(): HasMany
    {
        return $this->hasMany(Certification::class, 'hebergement_id');
    }

    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class, 'hebergement_id');
    }

    public function disponibilites(): HasMany
    {
        return $this->hasMany(Disponibilite::class, 'hebergement_id');
    }

    // ── Scopes ────────────────────────────────────────────────

    public function scopeActif($query)
    {
        return $query->where('actif', true);
    }

    public function scopeCertifie($query)
    {
        return $query->where('niveau_certification', '!=', 'non_certifie');
    }

    /** Recherche full-text MySQL FULLTEXT */
    public function scopeSearch($query, string $terme)
    {
        return $query->whereRaw(
            'MATCH(nom, ville, adresse) AGAINST(? IN BOOLEAN MODE)',
            [$terme . '*']
        );
    }

    /** Recherche par proximité GPS — formule Haversine */
    public function scopeProximite($query, float $lat, float $lng, float $rayonKm = 50)
    {
        return $query->selectRaw("
            *,
            (6371 * ACOS(
                COS(RADIANS(?)) * COS(RADIANS(latitude))
                * COS(RADIANS(longitude) - RADIANS(?))
                + SIN(RADIANS(?)) * SIN(RADIANS(latitude))
            )) AS distance_km
        ", [$lat, $lng, $lat])
        ->whereNotNull('latitude')
        ->whereNotNull('longitude')
        ->having('distance_km', '<=', $rayonKm)
        ->orderBy('distance_km');
    }
}