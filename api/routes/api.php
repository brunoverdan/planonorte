<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\LocationController;
use App\Http\Controllers\Api\V1\ProducerController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\UserContentController;
use App\Http\Controllers\Api\V1\VideoController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ---------- Público ----------
    Route::get('/home', [VideoController::class, 'home']);
    Route::get('/videos', [VideoController::class, 'index']);
    Route::get('/videos/{idOrSlug}', [VideoController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);
    Route::get('/regions', [LocationController::class, 'regions']);
    Route::get('/states', [LocationController::class, 'states']);
    Route::get('/cities', [LocationController::class, 'cities']);
    Route::get('/cities/{slug}', [LocationController::class, 'city']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{slug}', [EventController::class, 'show']);
    Route::get('/producers', [ProducerController::class, 'index']);
    Route::get('/producers/{slug}', [ProducerController::class, 'show']);
    Route::get('/search', SearchController::class);

    // ---------- Auth ----------
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // ---------- Autenticado ----------
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/me/list', [UserContentController::class, 'list']);
        Route::post('/videos/{video}/list', [UserContentController::class, 'toggleList']);
        Route::get('/me/history', [UserContentController::class, 'history']);
        Route::post('/videos/{video}/progress', [UserContentController::class, 'progress']);
        Route::post('/videos/{video}/like', [UserContentController::class, 'toggleLike']);
        Route::post('/videos/{video}/rating', [UserContentController::class, 'rate']);
        Route::post('/videos/{video}/report', [UserContentController::class, 'report']);
        Route::get('/me/recommendations', [UserContentController::class, 'recommendations']);

        // ---------- Admin ----------
        Route::prefix('admin')->middleware('can:admin')->group(function () {
            Route::get('/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/videos', [AdminController::class, 'videos']);
            Route::post('/videos', [AdminController::class, 'storeVideo']);
            Route::put('/videos/{video}', [AdminController::class, 'updateVideo']);
            Route::delete('/videos/{video}', [AdminController::class, 'destroyVideo']);
            Route::post('/videos/{video}/review', [AdminController::class, 'review']);
        });
    });
});
