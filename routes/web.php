<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── Controllers Admin ─────────────────────────────────────────────────────────
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

// ── Controllers Espace Voyageur ───────────────────────────────────────────────
use App\Http\Controllers\Voyageur\DashboardVoyageurController;
use App\Http\Controllers\Voyageur\ReservationVoyageurController;
use App\Http\Controllers\Voyageur\ProgrammeVoyageurController;
use App\Http\Controllers\Voyageur\SosVoyageurController;
use App\Http\Controllers\Voyageur\ProfilVoyageurController;

// ── Controllers Espace Aidant ─────────────────────────────────────────────────
use App\Http\Controllers\Aidant\DashboardAidantController;
use App\Http\Controllers\Aidant\SuiviAidantController;
use App\Http\Controllers\Aidant\ChecklistAidantController;
use App\Http\Controllers\Aidant\ProfilAidantController;

// ─── Page d'accueil publique ──────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('index');
})->name('home');

// ─── Auth ─────────────────────────────────────────────────────────────────────
require __DIR__ . '/auth.php';

// ─── Admin ────────────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Hébergements
    Route::get   ('/hebergements',                   [HebergementController::class, 'index'])      ->name('hebergements.index');
    Route::get   ('/hebergements/create',            [HebergementController::class, 'create'])     ->name('hebergements.create');
    Route::post  ('/hebergements',                   [HebergementController::class, 'store'])      ->name('hebergements.store');
    Route::get   ('/hebergements/{id}',              [HebergementController::class, 'show'])       ->name('hebergements.show');
    Route::get   ('/hebergements/{id}/edit',         [HebergementController::class, 'edit'])       ->name('hebergements.edit');
    Route::put   ('/hebergements/{id}',              [HebergementController::class, 'update'])     ->name('hebergements.update');
    Route::patch ('/hebergements/{id}/toggle-actif', [HebergementController::class, 'toggleActif'])->name('hebergements.toggle-actif');
    Route::delete('/hebergements/{id}',              [HebergementController::class, 'destroy'])    ->name('hebergements.destroy');

    // Certifications
    Route::get('/certifications',      [CertificationController::class, 'index'])->name('certifications.index');
    Route::get('/certifications/{id}', [CertificationController::class, 'show']) ->name('certifications.show');

    // Avis
    Route::get   ('/avis',      [AvisController::class, 'index'])  ->name('avis.index');
    Route::delete('/avis/{id}', [AvisController::class, 'destroy'])->name('avis.destroy');

    // Réservations
    Route::get ('/reservations',             [ReservationController::class, 'index'])       ->name('reservations.index');
    Route::get ('/reservations/create',      [ReservationController::class, 'create'])      ->name('reservations.create');
    Route::post('/reservations',             [ReservationController::class, 'store'])       ->name('reservations.store');
    Route::get ('/reservations/{id}',        [ReservationController::class, 'show'])        ->name('reservations.show');
    Route::put ('/reservations/{id}/statut', [ReservationController::class, 'updateStatut'])->name('reservations.statut');

    // Voyageurs (admin)
    Route::get   ('/voyageurs',                   [VoyageurController::class, 'index'])      ->name('voyageurs.index');
    Route::get   ('/voyageurs/create',            [VoyageurController::class, 'create'])     ->name('voyageurs.create');
    Route::post  ('/voyageurs',                   [VoyageurController::class, 'store'])      ->name('voyageurs.store');
    Route::get   ('/voyageurs/{id}',              [VoyageurController::class, 'show'])       ->name('voyageurs.show');
    Route::get   ('/voyageurs/{id}/edit',         [VoyageurController::class, 'edit'])       ->name('voyageurs.edit');
    Route::put   ('/voyageurs/{id}',              [VoyageurController::class, 'update'])     ->name('voyageurs.update');
    Route::patch ('/voyageurs/{id}/toggle-actif', [VoyageurController::class, 'toggleActif'])->name('voyageurs.toggle-actif');

    // Aidants (admin)
    Route::get   ('/aidants',             [AidantController::class, 'index'])       ->name('aidants.index');
    Route::get   ('/aidants/create',      [AidantController::class, 'create'])      ->name('aidants.create');
    Route::post  ('/aidants',             [AidantController::class, 'store'])       ->name('aidants.store');
    Route::get   ('/aidants/{id}',        [AidantController::class, 'show'])        ->name('aidants.show');
    Route::patch ('/aidants/{id}/niveau', [AidantController::class, 'updateNiveau'])->name('aidants.niveau');
    Route::delete('/aidants/{id}',        [AidantController::class, 'destroy'])     ->name('aidants.destroy');

    // Professionnels
    Route::get   ('/professionnels',                  [ProfessionnelController::class, 'index'])     ->name('professionnels.index');
    Route::get   ('/professionnels/create',           [ProfessionnelController::class, 'create'])    ->name('professionnels.create');
    Route::post  ('/professionnels',                  [ProfessionnelController::class, 'store'])     ->name('professionnels.store');
    Route::get   ('/professionnels/{id}',             [ProfessionnelController::class, 'show'])      ->name('professionnels.show');
    Route::get   ('/professionnels/{id}/edit',        [ProfessionnelController::class, 'edit'])      ->name('professionnels.edit');
    Route::put   ('/professionnels/{id}',             [ProfessionnelController::class, 'update'])    ->name('professionnels.update');
    Route::patch ('/professionnels/{id}/valider',     [ProfessionnelController::class, 'valider'])   ->name('professionnels.valider');
    Route::patch ('/professionnels/{id}/toggle',      [ProfessionnelController::class, 'toggleActif'])->name('professionnels.toggle');
    Route::patch ('/professionnels/{id}/suspendre',   [ProfessionnelController::class, 'suspendre']) ->name('professionnels.suspendre');

    // Programmes
    Route::get ('/programme',              [ProgrammeController::class, 'index'])     ->name('programme.index');
    Route::get ('/programme/create',       [ProgrammeController::class, 'create'])    ->name('programme.create');
    Route::post('/programme',              [ProgrammeController::class, 'store'])     ->name('programme.store');
    Route::get ('/programme/{id}',         [ProgrammeController::class, 'show'])      ->name('programme.show');
    Route::post('/programme/{id}/etapes',  [ProgrammeController::class, 'storeEtape'])->name('programme.etapes.store');

    // Transports
    Route::get   ('/transports',             [TransportController::class, 'index'])       ->name('transports.index');
    Route::get   ('/transports/create',      [TransportController::class, 'create'])      ->name('transports.create');
    Route::post  ('/transports',             [TransportController::class, 'store'])       ->name('transports.store');
    Route::get   ('/transports/{id}',        [TransportController::class, 'show'])        ->name('transports.show');
    Route::patch ('/transports/{id}/statut', [TransportController::class, 'updateStatut'])->name('transports.statut');
    Route::delete('/transports/{id}',        [TransportController::class, 'destroy'])     ->name('transports.destroy');

    // Urgences
    Route::get  ('/urgences',              [UrgenceController::class, 'index'])       ->name('urgences.index');
    Route::get  ('/urgences/{id}',         [UrgenceController::class, 'show'])        ->name('urgences.show');
    Route::patch('/urgences/{id}/statut',  [UrgenceController::class, 'updateStatut'])->name('urgences.statut');

    // Rapports & Paramètres
    Route::get('/rapports',  [RapportController::class,  'index']) ->name('rapports.index');
    Route::get('/parametres',[ParametreController::class,'index']) ->name('parametres.index');
    Route::put('/parametres',[ParametreController::class,'update'])->name('parametres.update');
});

// ─── Espace Voyageur ──────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:voyageur'])->prefix('mon-espace')->group(function () {
    Route::get  ('/',                 [DashboardVoyageurController::class,  'index'])        ->name('voyageur.index');
    Route::get  ('/reservations',     [ReservationVoyageurController::class,'index'])        ->name('voyageur.reservations');
    Route::get  ('/programmes',       [ProgrammeVoyageurController::class,  'index'])        ->name('voyageur.programmes');
    Route::get  ('/programme/{id}',   [ProgrammeVoyageurController::class,  'show'])         ->name('voyageur.programme');
    Route::post ('/sos',              [SosVoyageurController::class,        'store'])         ->name('voyageur.sos');
    Route::get  ('/profil',           [ProfilVoyageurController::class,     'index'])        ->name('voyageur.profil');
    Route::patch('/profil',           [ProfilVoyageurController::class,     'update'])       ->name('voyageur.profil.update');
    Route::patch('/profil/password',  [ProfilVoyageurController::class,     'updatePassword'])->name('voyageur.profil.password');
});

// ─── Espace Aidant ────────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:aidant'])->prefix('aidant')->group(function () {
    Route::get  ('/',                        [DashboardAidantController::class,  'index']) ->name('aidant.index');
    Route::get  ('/suivi/{voyageur_id}',     [SuiviAidantController::class,      'show'])  ->name('aidant.suivi');
    Route::get  ('/checklist/{voyageur_id}', [ChecklistAidantController::class,  'show'])  ->name('aidant.checklist');
    Route::patch('/checklist/{voyageur_id}', [ChecklistAidantController::class,  'update'])->name('aidant.checklist.update');
    Route::get  ('/profil',                  [ProfilAidantController::class,     'index']) ->name('aidant.profil');
    Route::patch('/profil',                  [ProfilAidantController::class,     'update'])->name('aidant.profil.update');
});

// ─── Espace Professionnel de santé ───────────────────────────────────────────
use App\Http\Controllers\Professionnel\DashboardProfessionnelController;
use App\Http\Controllers\Professionnel\InterventionProfessionnelController;
use App\Http\Controllers\Professionnel\PlanningProfessionnelController;
use App\Http\Controllers\Professionnel\ProfilProfessionnelController;

Route::middleware(['auth', 'role:professionnel_sante'])->prefix('professionnel')->group(function () {
    Route::get  ('/',               [DashboardProfessionnelController::class,   'index']) ->name('professionnel.index');
    Route::get  ('/interventions',  [InterventionProfessionnelController::class,'index']) ->name('professionnel.interventions');
    Route::get  ('/planning',       [PlanningProfessionnelController::class,    'index']) ->name('professionnel.planning');
    Route::get  ('/profil',         [ProfilProfessionnelController::class,      'index']) ->name('professionnel.profil');
    Route::patch('/profil',         [ProfilProfessionnelController::class,      'update'])->name('professionnel.profil.update');
});

// ─── Espace Partenaire hébergement ───────────────────────────────────────────
use App\Http\Controllers\Partenaire\DashboardPartenaireController;
use App\Http\Controllers\Partenaire\HebergementPartenaireController;
use App\Http\Controllers\Partenaire\DisponibilitePartenaireController;
use App\Http\Controllers\Partenaire\ProfilPartenaireController;

Route::middleware(['auth', 'role:partenaire_hebergement'])->prefix('partenaire')->group(function () {
    Route::get  ('/',                          [DashboardPartenaireController::class,    'index'])      ->name('partenaire.index');
    Route::get  ('/hebergements',              [HebergementPartenaireController::class,  'index'])      ->name('partenaire.hebergements');
    Route::get  ('/hebergements/{id}',         [HebergementPartenaireController::class,  'show'])       ->name('partenaire.hebergement');
    Route::patch('/hebergements/{id}/toggle',  [HebergementPartenaireController::class,  'toggleActif'])->name('partenaire.hebergement.toggle');
    Route::get  ('/disponibilites',            [DisponibilitePartenaireController::class,'index'])      ->name('partenaire.disponibilites');
    Route::get  ('/profil',                    [ProfilPartenaireController::class,       'index'])      ->name('partenaire.profil');
    Route::patch('/profil',                    [ProfilPartenaireController::class,       'update'])     ->name('partenaire.profil.update');
});

// ─── Espace Transporteur ─────────────────────────────────────────────────────
use App\Http\Controllers\Transporteur\DashboardTransporteurController;
use App\Http\Controllers\Transporteur\CourseTransporteurController;
use App\Http\Controllers\Transporteur\ProfilTransporteurController;

Route::middleware(['auth', 'role:transporteur'])->prefix('transporteur')->group(function () {
    Route::get  ('/',                          [DashboardTransporteurController::class, 'index'])        ->name('transporteur.index');
    Route::get  ('/courses',                   [CourseTransporteurController::class,    'index'])        ->name('transporteur.courses');
    Route::patch('/courses/{id}/statut',       [CourseTransporteurController::class,    'updateStatut']) ->name('transporteur.courses.statut');
    Route::get  ('/profil',                    [ProfilTransporteurController::class,    'index'])        ->name('transporteur.profil');
    Route::patch('/profil',                    [ProfilTransporteurController::class,    'update'])       ->name('transporteur.profil.update');
});