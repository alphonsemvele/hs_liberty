<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HebergementController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\AvisController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\VoyageurController;
use App\Http\Controllers\AidantController;
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\ProfessionnelController;
use App\Http\Controllers\TransportController;
use App\Http\Controllers\UrgenceController;
use App\Http\Controllers\RapportController;
use App\Http\Controllers\ParametreController;

// ─── Page d'accueil publique ───────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('index');
})->name('home');

// ─── Auth (login, register, logout, password…) ────────────────────────────────
require __DIR__ . '/auth.php';

// ─── Routes protégées ─────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Hébergements ──────────────────────────────────────────────────────────
    Route::get('/hebergements',              [HebergementController::class, 'index'])  ->name('hebergements.index');
    Route::get('/hebergements/create',       [HebergementController::class, 'create']) ->name('hebergements.create');
    Route::post('/hebergements',             [HebergementController::class, 'store'])  ->name('hebergements.store');
    Route::get('/hebergements/{id}',         [HebergementController::class, 'show'])   ->name('hebergements.show');
    Route::get('/hebergements/{id}/edit',    [HebergementController::class, 'edit'])   ->name('hebergements.edit');
    Route::put('/hebergements/{id}',         [HebergementController::class, 'update']) ->name('hebergements.update');
    Route::delete('/hebergements/{id}',      [HebergementController::class, 'destroy'])->name('hebergements.destroy');

    // ── Certifications ────────────────────────────────────────────────────────
    Route::get('/certifications',            [CertificationController::class, 'index'])  ->name('certifications.index');
    Route::get('/certifications/{id}',       [CertificationController::class, 'show'])   ->name('certifications.show');

    // ── Avis ──────────────────────────────────────────────────────────────────
    Route::get('/avis',                      [AvisController::class, 'index'])           ->name('avis.index');
    Route::delete('/avis/{id}',              [AvisController::class, 'destroy'])         ->name('avis.destroy');

    // ── Réservations ──────────────────────────────────────────────────────────
    Route::get('/reservations',              [ReservationController::class, 'index'])  ->name('reservations.index');
    Route::get('/reservations/create',       [ReservationController::class, 'create']) ->name('reservations.create');
    Route::post('/reservations',             [ReservationController::class, 'store'])  ->name('reservations.store');
    Route::get('/reservations/{id}',         [ReservationController::class, 'show'])   ->name('reservations.show');
    Route::put('/reservations/{id}/statut',  [ReservationController::class, 'updateStatut'])->name('reservations.statut');

   // ── Voyageurs ────────────────────────────────────────────────────────
Route::get('/voyageurs',                     [VoyageurController::class, 'index'])      ->name('voyageurs.index');
Route::get('/voyageurs/create',              [VoyageurController::class, 'create'])     ->name('voyageurs.create');
Route::post('/voyageurs',                    [VoyageurController::class, 'store'])      ->name('voyageurs.store');
Route::get('/voyageurs/{id}',                [VoyageurController::class, 'show'])       ->name('voyageurs.show');
Route::get('/voyageurs/{id}/edit',           [VoyageurController::class, 'edit'])       ->name('voyageurs.edit');
Route::put('/voyageurs/{id}',                [VoyageurController::class, 'update'])     ->name('voyageurs.update');
Route::patch('/voyageurs/{id}/toggle-actif', [VoyageurController::class, 'toggleActif'])->name('voyageurs.toggle-actif');

  // ── Aidants ──────────────────────────────────────────────────────────────────
Route::get('/aidants',                   [AidantController::class, 'index'])       ->name('aidants.index');
Route::get('/aidants/create',            [AidantController::class, 'create'])      ->name('aidants.create');
Route::post('/aidants',                  [AidantController::class, 'store'])       ->name('aidants.store');
Route::get('/aidants/{id}',              [AidantController::class, 'show'])        ->name('aidants.show');
Route::patch('/aidants/{id}/niveau',     [AidantController::class, 'updateNiveau'])->name('aidants.niveau');
Route::delete('/aidants/{id}',           [AidantController::class, 'destroy'])     ->name('aidants.destroy');

    // ── Programmes de séjour ──────────────────────────────────────────────────
    Route::get('/programme',                 [ProgrammeController::class, 'index'])    ->name('programme.index');
    Route::get('/programme/{id}',            [ProgrammeController::class, 'show'])     ->name('programme.show');

      // ── Professionnels de santé ───────────────────────────────────────────────
    Route::get('/professionnels',                    [ProfessionnelController::class, 'index'])    ->name('professionnels.index');
    Route::get('/professionnels/create',             [ProfessionnelController::class, 'create'])   ->name('professionnels.create');
    Route::post('/professionnels',                   [ProfessionnelController::class, 'store'])    ->name('professionnels.store');
    Route::get('/professionnels/{id}',               [ProfessionnelController::class, 'show'])     ->name('professionnels.show');
    Route::get('/professionnels/{id}/edit',          [ProfessionnelController::class, 'edit'])     ->name('professionnels.edit');
    Route::put('/professionnels/{id}',               [ProfessionnelController::class, 'update'])   ->name('professionnels.update');
    Route::patch('/professionnels/{id}/valider',     [ProfessionnelController::class, 'valider'])  ->name('professionnels.valider');
    Route::patch('/professionnels/{id}/suspendre',   [ProfessionnelController::class, 'suspendre'])->name('professionnels.suspendre');

    // ── Transports ────────────────────────────────────────────────────────────
    Route::get('/transports',                [TransportController::class, 'index'])    ->name('transports.index');
    Route::get('/transports/create',                [TransportController::class, 'create'])    ->name('transports.create');


    // ── Urgences ──────────────────────────────────────────────────────────────
    Route::get('/urgences',                  [UrgenceController::class, 'index'])      ->name('urgences.index');
    Route::put('/urgences/{id}/statut',      [UrgenceController::class, 'updateStatut'])->name('urgences.statut');

    // ── Rapports ──────────────────────────────────────────────────────────────
    Route::get('/rapports',                  [RapportController::class, 'index'])      ->name('rapports.index');

    // ── Paramètres ────────────────────────────────────────────────────────────
    Route::get('/parametres',                [ParametreController::class, 'index'])    ->name('parametres.index');
    Route::put('/parametres',                [ParametreController::class, 'update'])   ->name('parametres.update');

});