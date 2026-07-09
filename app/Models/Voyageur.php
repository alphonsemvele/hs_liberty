<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Voyageur extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'voyageurs';

    protected $fillable = [
        'user_id',
        'date_naissance',
        'nationalite',
        'pays_residence',
        'telephone',
        'type_handicap',
        'niveau_dependance',
        'contact_urgence_nom',
        'contact_urgence_tel',
        'contact_urgence_lien',
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'deleted_at'     => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function equipements(): BelongsToMany
    {
        return $this->belongsToMany(
            Equipement::class,
            'equipement_voyageur',
            'voyageur_id',
            'equipement_id'
        );
    }

    public function aidants(): BelongsToMany
    {
        return $this->belongsToMany(
            Aidant::class,
            'suivi_aidants',
            'voyageur_id',
            'aidant_id'
        )->withPivot('niveau_acces', 'consentement_voyageur', 'actif');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'voyageur_id');
    }

    public function profilMedical(): HasOne
    {
        return $this->hasOne(ProfilMedical::class, 'voyageur_id')
                    ->where('est_courant', true)
                    ->latestOfMany('version');
    }

    public function urgences(): HasMany
    {
        return $this->hasMany(Urgence::class, 'voyageur_id');
    }
}