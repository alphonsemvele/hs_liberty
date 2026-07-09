<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EtapeProgramme extends Model
{
    protected $table = 'etape_programmes';

    protected $fillable = [
        'programme_id', 'ordre', 'type',
        'titre', 'description', 'date_heure', 'lieu',
    ];

    protected $casts = [
        'date_heure' => 'datetime',
    ];

    public function programme(): BelongsTo
    {
        return $this->belongsTo(ProgrammeSejour::class, 'programme_id');
    }
}