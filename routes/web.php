<?php

use App\Http\Controllers\VacancyController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return redirect()->route('vacancies.withcharter');
});
Route::get('/withcharter', [VacancyController::class, 'index'])->name('vacancies.withcharter');
Route::get('/withoutcharter', [VacancyController::class, 'index'])->name('vacancies.withoutcharter');
