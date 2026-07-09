<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Professionnel extends Model
{
    use SoftDeletes;

    protected $table = 'professionnels';

    protected $fillable = [
        'user_id', 'specialite', 'specialite_autre',
        'numero_rpps', 'tarif_horaire', 'devise', 'bio',
        'diplome_valide', 'diplome_fichier',
        'assurance_rc', 'rc_pro_fichier', 'rc_pro_expiration',
        'certifie',
    ];

    protected $casts = [
        'certifie'        => 'boolean',
        'diplome_valide'  => 'boolean',
        'assurance_rc'    => 'boolean',
        'tarif_horaire'   => 'float',
        'note_moyenne'    => 'float',
        'rc_pro_expiration'=> 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function prestations(): HasMany
    {
        return $this->hasMany(PrestationSoin::class, 'professionnel_id');
    }
}