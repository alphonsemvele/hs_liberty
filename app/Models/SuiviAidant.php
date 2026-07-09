<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SuiviAidant extends Model
{
    protected $table = 'suivi_aidants';

    protected $fillable = [
        'aidant_id', 'voyageur_id', 'niveau_acces',
        'consentement_voyageur', 'consentement_le',
        'revoque_le', 'actif',
    ];

    protected $casts = [
        'consentement_voyageur' => 'boolean',
        'actif'                 => 'boolean',
        'consentement_le'       => 'datetime',
        'revoque_le'            => 'datetime',
    ];

    public function aidant(): BelongsTo
    {
        return $this->belongsTo(Aidant::class, 'aidant_id');
    }

    public function voyageur(): BelongsTo
    {
        return $this->belongsTo(Voyageur::class, 'voyageur_id');
    }
}