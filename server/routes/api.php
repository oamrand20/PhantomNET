<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CodeController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\MessageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public Routes
Route::post('/login', [UserController::class, 'login']); //
Route::get('/category/dropMenu', [CategoryController::class, 'dropMenu']);
Route::get('/category/{id}', [CategoryController::class, 'categoryData']);
Route::get('/category/products/{id}', [CategoryController::class, 'categoriesProduct']);
Route::get('/products/similar/{id}', [CategoryController::class, 'similarProducts']); //
Route::get('/categories/cards', [CategoryController::class, 'cards']);
Route::get('/categories/main', [CategoryController::class, 'showMain']);
Route::post('/client/message', [MessageController::class, 'store']);
Route::get('/locations', [LocationController::class, 'locations']);
Route::post('/files/upload', [FileController::class, 'upload']);
// Middleware for Authenticated Users
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'user']); //done

    // Category Routes
    Route::post('/categories/add', [CategoryController::class, 'store']); //
    Route::put('/categories/edit/{id}', [CategoryController::class, 'update']); //
    Route::delete('/categories/delete/{id}', [CategoryController::class, 'destroy']); //
    Route::get('/categories', [CategoryController::class, 'index']); //
    Route::post('/admin/search/categories', [CategoryController::class, 'searchAdmin']); //
    Route::get('/categories/{id}', [CategoryController::class, 'show']); //


    // User Management Routes
    Route::get('/users', [UserController::class, 'allUsers']); //d
    Route::post('/search/users', [UserController::class, 'search']); //d
    Route::get('/user/admin/{id}', [UserController::class, 'showOne']); //d
    Route::post('/user/admin/add', [UserController::class, 'addUserAdmin']); //d
    Route::get('/user/makeSuper/{id}', [UserController::class, 'makeSuperAdmin']); //d
    Route::get('/user/makeNormalAdmin/{id}', [UserController::class, 'makeNormalAdmin']); //d
    Route::get('/user/banAdmin/{id}', [UserController::class, 'banAdmin']); //d
    Route::delete('/user/delete/{id}', [UserController::class, 'destroy']); //d
    Route::put('/user/profile/{id}', [UserController::class, 'updateProfile']); //d
    Route::put('/user/password/{id}', [UserController::class, 'passwordUpdate']); //d
    Route::put('/user/location/{id}', [UserController::class, 'addLocation']); //d
    //section _\|/_ AdminData (done)
    Route::get('/adminData', [UserController::class, 'adminData']); //
    Route::get('/earnings', [UserController::class, 'earnings']); //
    Route::post('/yearEearnings', [UserController::class, 'yearEearnings']); //
    Route::post('/periodEearnings', [UserController::class, 'periodEearnings']); //

    // Code Routes
    Route::get('/commands', [CodeController::class, 'commands']); //
    Route::post('/code/add', [CodeController::class, 'store']); //
    Route::get('/codes', [CodeController::class, 'index']); //
    Route::post('/search/codes', [CodeController::class, 'search']); //
    Route::get('/code/{id}', [CodeController::class, 'show']); //
    Route::get('/admin/code/{id}', [CodeController::class, 'details']); //
    Route::get('/code/toggle/{id}', [CodeController::class, 'toggle']); //
    Route::delete('/code/{id}', [CodeController::class, 'destroy']);

    //section _\|/_ history (done)
    Route::get('/history', [HistoryController::class, 'index']); //done
    Route::post('/search/history', [HistoryController::class, 'search']); //done
    //section _\|/_ Locations (done)


    //section _\|/_ Messages (done)
    Route::get('/messages', [MessageController::class, 'index']); //ok
    Route::post('/search/messages', [MessageController::class, 'search']); //ok
    Route::get('/messages/update/{id}', [MessageController::class, 'update']); //ok

    //section _\|/_ Files ()
    Route::get('/files', [FileController::class, 'index']); //
    Route::get('/files/search', [FileController::class, 'search']); //

    Route::get('/files/{id}', [FileController::class, 'show']); //
    Route::delete('/files/delete/{id}', [FileController::class, 'destroy']); //

});
