<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrderStatusController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ArmadaController;
use App\Http\Controllers\KruController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\PlottingController;
use App\Models\Armada;
use App\Models\Kru;


// Rute Halaman Portal Pelanggan Arjuna Trans
Route::get('/order-status', [OrderStatusController::class, 'index'])->name('order.status');

// Rute API: Pencarian Pesanan via ID / WhatsApp (Form Pencarian)
Route::post('/api/order/search', [OrderStatusController::class, 'search']);

// Rute API: Aksi Kirim Bukti Transfer Pelanggan (Tombol Kirim Bukti Pembayaran)
Route::post('/api/order/upload-payment', [OrderStatusController::class, 'uploadBuktiBayar']);

// Rute API: Mengambil Data Jadwal Bus Aktif (Kalender Pelanggan)
Route::get('/api/customer-schedule', [ScheduleController::class, 'getSchedule']);

// agar sinkron 100% dengan link klik sidebar asli bawaan laptop Anda!
Route::get('/master-data', function () {
    return Inertia::render('MasterData', [
        'armadaFromBackend' => \App\Models\Armada::orderBy('created_at', 'desc')->get(),
        'crewFromBackend'   => \App\Models\Kru::orderBy('created_at', 'desc')->get()
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

// Rute API Internal Admin: Kelola Transaksi Pesanan Masuk Arjuna Trans
Route::get('/orders', function () {
    return Inertia::render('Orders', [
        'orders' => \App\Models\Pesanan::orderBy('created_at', 'desc')->get(),
        'armada' => \App\Models\Armada::orderBy('nama_armada', 'asc')->get()
    ]);
})->name('orders');
Route::get('/api/admin/pesanan', [PesananController::class, 'index']);
Route::post('/api/admin/pesanan/store', [PesananController::class, 'store']);
Route::put('/api/admin/pesanan/update-full/{id}', [PesananController::class, 'updateFull'])->where('id', '.*');
Route::post('/api/admin/pesanan/update-full/{id}', [PesananController::class, 'updateFull'])->where('id', '.*');
Route::put('/api/admin/pembayaran/verifikasi/{id}', [PesananController::class, 'verifikasiPembayaran'])->where('id', '.*');
Route::put('/api/admin/pesanan/update-status/{id}', [PesananController::class, 'updateStatus'])->where('id', '.*');
Route::get('/api/admin/pesanan', [\App\Http\Controllers\PesananController::class, 'getPesananData']);

Route::get('/plotting', [\App\Http\Controllers\PlottingController::class, 'index'])->name('admin.plotting');
Route::get('/admin/plotting', [\App\Http\Controllers\PlottingController::class, 'index'])->name('admin.plotting');
Route::post('/api/admin/plotting/store', [\App\Http\Controllers\PlottingController::class, 'store'])->name('admin.plotting.store');
Route::post('/api/admin/plotting/save', [PlottingController::class, 'savePlotting']);

Route::get('/schedule', [App\Http\Controllers\ScheduleController::class, 'index'])->name('schedule');














// =========================================================================
// 1. JALUR UMUM / PELANGGAN (Bisa diakses siapa saja tanpa login)
// =========================================================================

// Halaman Utama / Landing Page
Route::get('/', function () {
    return Inertia::render('Landing');
});

// // Jalur Tombol Halaman Login Admin Anda
Route::get('/login-admin', function () {
    return Inertia::render('Login');
})->name('login.admin');

// // 3 Menu Pelanggan dari Landing Page (Dikeluarkan dari penguncian)
Route::get('/customer-order', function () {
    return Inertia::render('CustomerOrder');
})->name('customer-order');
Route::get('/booking-success', function () {
    return Inertia::render('OrderSuccess');
})->name('booking.success');
Route::get('/order-status', function () {
    return Inertia::render('OrderStatus');
})->name('order-status');
// Route::get('/schedule', function () {
//     return Inertia::render('CustomerSchedule');
// })->name('schedule');

//admin route
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');
// Route::get('/plotting', function () {
//     return Inertia::render('Plotting');
// })->name('plotting');
// Untuk admin di dalam
// Route::get('/reports', function () {
//     return Inertia::render('Reports');
// })->name('reports');




// =========================================================================
// 2. JALUR BACKOFFICE / ADMIN (Wajib Login Baru Bisa Diakses)
// =========================================================================
Route::middleware(['auth', 'verified'])->group(function () {

    // Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('dashboard');

    // Route::get('/catalog', function () {
    //     return Inertia::render('Catalog');
    // })->name('catalog');

    // Route::get('/documents', function () {
    //     return Inertia::render('Documents');
    // })->name('documents');

    // // Route::get('/master-data', function () {
    // //     return Inertia::render('MasterData');
    // // })->name('master-data');

    // // Route::get('/orders', function () {
    // //     return Inertia::render('Orders');
    // // })->name('orders');

    // // Route::get('/plotting', function () {
    // //     return Inertia::render('Plotting');
    // // })->name('plotting');

    // // Route::get('/reports', function () {
    // //     return Inertia::render('Reports');
    // // })->name('reports');

    // // Profil Akun Admin
    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
