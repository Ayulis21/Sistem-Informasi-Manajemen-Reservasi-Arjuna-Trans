<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ArmadaController;
use App\Http\Controllers\KruController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\OrderStatusController;
use App\Http\Controllers\PlottingController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ProfileController;
use App\Models\Armada;
use App\Models\Kru;
use App\Models\Pesanan;


// Halaman Utama / Landing Page
Route::get('/', function () {
    return Inertia::render('Landing');
});

// Route::get('/customer-order', function () {
//     return Inertia::render('CustomerComponents/CustomerOrder');
// })->name('customer-order');
Route::get('/customer-order', [PesananController::class, 'showOrderForm'])->name('customer-order');


// Route untuk proses simpan (API)
Route::post('/api/customer/booking', [PesananController::class, 'storePublic']);

Route::get('/booking-success/{id}', function ($id) {
    return Inertia::render('CustomerComponents/OrderSuccess', [
        'id' => $id
    ]);
})->name('booking.success');

// Portal Pelanggan
Route::get('/order-status', function () {
    return Inertia::render('CustomerComponents/OrderStatus');
})->name('order-status');

// API Pencarian & Upload (Public)
Route::post('/api/order/search', [OrderStatusController::class, 'search']);
Route::post('/api/order/upload-payment', [OrderStatusController::class, 'uploadBuktiBayar']);


Route::get('/jadwal-bus', function () {
    return Inertia::render('CustomerComponents/CustomerSchedule');
})->name('customer.schedule');
Route::get('/api/public-schedule', [App\Http\Controllers\ScheduleController::class, 'getPublicSchedule']);

Route::get('/booking', [PesananController::class, 'showOrderForm']);







// route login
Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login')->middleware('guest');
Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'login'])->middleware('guest');
Route::middleware(['auth'])->group(function () {
    // route dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // route master data
    Route::get('/master-data', function () {
        return Inertia::render('MasterData', [
            'armadaFromBackend' => Armada::orderBy('created_at', 'desc')->get(),
            'crewFromBackend'   => Kru::orderBy('created_at', 'desc')->get()
        ]);
    })->name('master-data');
    Route::get('/api/admin/armada', [ArmadaController::class, 'index']);
    Route::post('/api/admin/armada/store', [ArmadaController::class, 'store']);
    Route::put('/api/admin/armada/update/{id}', [ArmadaController::class, 'update']);
    Route::delete('/api/admin/armada/delete/{id}', [ArmadaController::class, 'destroy']);
    Route::get('/api/admin/kru', [KruController::class, 'index']);
    Route::post('/api/admin/kru/store', [KruController::class, 'store']);
    Route::put('/api/admin/kru/update/{id}', [KruController::class, 'update']);
    Route::delete('/api/admin/kru/delete/{id}', [KruController::class, 'destroy']);

    // route kelola pesanan
    Route::get('/orders', function () {
        return Inertia::render('Orders', [
            'orders' => Pesanan::orderBy('created_at', 'desc')->get(),
            'armada' => Armada::orderBy('nama_armada', 'asc')->get()
        ]);
    })->name('orders');
    Route::get('/api/admin/pesanan', [PesananController::class, 'index']);
    Route::post('/api/admin/pesanan/store', [PesananController::class, 'store']);
    Route::get('/api/admin/pesanan', [PesananController::class, 'getPesananData']);
    Route::put('/api/admin/pesanan/update-full/{id}', [PesananController::class, 'updateFull'])->where('id', '.*');
    Route::post('/api/admin/pesanan/update-full/{id}', [PesananController::class, 'updateFull'])->where('id', '.*');
    Route::put('/api/admin/pesanan/update-status/{id}', [PesananController::class, 'updateStatus'])->where('id', '.*');
    Route::put('/api/admin/pembayaran/verifikasi/{id}', [PesananController::class, 'verifikasiPembayaran'])->where('id', '.*');

    // route plotting
    Route::get('/plotting', [PlottingController::class, 'index'])->name('admin.plotting');
    Route::get('/admin/plotting', [PlottingController::class, 'index'])->name('admin.plotting');
    Route::post('/api/admin/plotting/store', [PlottingController::class, 'store'])->name('admin.plotting.store');
    Route::post('/api/admin/plotting/save', [PlottingController::class, 'savePlotting']);

    // route kalender jalan
    Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule');

    // route laporan
    Route::get('/reports', [ReportController::class, 'index'])->name('report');

    // route logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});
