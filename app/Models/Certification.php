<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certification extends Model
{
    protected $table = 'certifications';

    protected $fillable = [
        'hebergement_id', 'user_id', 'reference',
        'score', 'niveau', 'criteres_json',
        'date_audit', 'date_expiration', 'actif',
    ];

    protected $casts = [
        'date_audit'      => 'date',
        'date_expiration' => 'date',
        'criteres_json'   => 'array',
        'actif'           => 'boolean',
    ];

    public function hebergement(): BelongsTo
    {
        return $this->belongsTo(Hebergement::class, 'hebergement_id');
    }

    public function inspecteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}