<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Aidant extends Model
{
    use HasFactory;

    protected $table = 'aidants';

    protected $fillable = ['user_id', 'telephone', 'lien_parente'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function voyageurs(): BelongsToMany
    {
        return $this->belongsToMany(
            Voyageur::class,
            'suivi_aidants',
            'aidant_id',
            'voyageur_id'
        )->withPivot('niveau_acces', 'consentement_voyageur', 'actif', 'consentement_le');
    }
}