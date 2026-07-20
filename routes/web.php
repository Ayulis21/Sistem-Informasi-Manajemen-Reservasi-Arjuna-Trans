<?php



use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ArmadaController;
use App\Http\Controllers\KruController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\OrderStatusController;
use App\Http\Controllers\PlottingController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ProfileController;
use App\Models\Armada;
use App\Models\Kru;
use App\Models\Pesanan;

// routes/web.php

// Paling bawah file
Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login')->middleware('guest');
Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'login'])->middleware('guest');
// Route::post('/login', [LoginController::class, 'login'])->middleware('guest');
// Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

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

    Route::get('/orders', function () {
        return Inertia::render('Orders', [
            'orders' => Pesanan::orderBy('created_at', 'desc')->get(),
            'armada' => Armada::orderBy('nama_armada', 'asc')->get()
        ]);
    })->name('orders');
    Route::get('/api/admin/pesanan', [PesananController::class, 'index']);
    Route::post('/api/admin/pesanan/store', [PesananController::class, 'store']);
    Route::put('/api/admin/pesanan/update-full/{id}', [PesananController::class, 'updateFull'])->where('id', '.*');
    Route::post('/api/admin/pesanan/update-full/{id}', [PesananController::class, 'updateFull'])->where('id', '.*');
    Route::put('/api/admin/pembayaran/verifikasi/{id}', [PesananController::class, 'verifikasiPembayaran'])->where('id', '.*');
    Route::put('/api/admin/pesanan/update-status/{id}', [PesananController::class, 'updateStatus'])->where('id', '.*');
    Route::get('/api/admin/pesanan', [PesananController::class, 'getPesananData']);

    Route::get('/plotting', [PlottingController::class, 'index'])->name('admin.plotting');
    Route::get('/admin/plotting', [PlottingController::class, 'index'])->name('admin.plotting');
    Route::post('/api/admin/plotting/store', [PlottingController::class, 'store'])->name('admin.plotting.store');
    Route::post('/api/admin/plotting/save', [PlottingController::class, 'savePlotting']);

    Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule');

    Route::get('/reports', [ReportController::class, 'index'])->name('report');

    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});





// Rute Halaman Portal Pelanggan Arjuna Trans
// Route::get('/order-status', [OrderStatusController::class, 'index'])->name('order.status');

// Rute API: Pencarian Pesanan via ID / WhatsApp (Form Pencarian)
// Route::post('/api/order/search', [OrderStatusController::class, 'search']);

// Rute API: Aksi Kirim Bukti Transfer Pelanggan (Tombol Kirim Bukti Pembayaran)
// Route::post('/api/order/upload-payment', [OrderStatusController::class, 'uploadBuktiBayar']);

// Rute API: Mengambil Data Jadwal Bus Aktif (Kalender Pelanggan)
// Route::get('/api/customer-schedule', [ScheduleController::class, 'getSchedule']);

// Cara alternatif kalau ::class tetep rewel



// agar sinkron 100% dengan link klik sidebar asli bawaan laptop Anda!


// Rute API Internal Admin: Kelola Transaksi Pesanan Masuk Arjuna Trans









// Halaman Utama / Landing Page
Route::get('/', function () {
    return Inertia::render('Landing');
});
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


// require __DIR__ . '/auth.php';
