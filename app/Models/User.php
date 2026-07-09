<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'prenom',
        'nom',
        'email',
        'email_verified_at',
        'password',
        'role',
        'actif',
        'mfa_secret',
        'mfa_active',
        'consentement_rgpd',
        'consentement_le',
        'suppression_demandee_le',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'mfa_secret',
    ];

    protected $casts = [
        'email_verified_at'       => 'datetime',
        'consentement_le'         => 'datetime',
        'suppression_demandee_le' => 'datetime',
        'actif'                   => 'boolean',
        'mfa_active'              => 'boolean',
        'consentement_rgpd'       => 'boolean',
        'password'                => 'hashed',
    ];

    // ── Relations ─────────────────────────────────────────────

    public function voyageur(): HasOne
    {
        return $this->hasOne(Voyageur::class, 'user_id');
    }

    public function aidant(): HasOne
    {
        return $this->hasOne(Aidant::class, 'user_id');
    }

    public function professionnel(): HasOne
    {
        return $this->hasOne(Professionnel::class, 'user_id');
    }

    // ── Helpers ───────────────────────────────────────────────

    public function getNomCompletAttribute(): string
    {
        return trim($this->prenom . ' ' . $this->nom);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isVoyageur(): bool
    {
        return $this->role === 'voyageur';
    }
}