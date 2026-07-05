<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrderStatusController;
use App\Http\Controllers\CustomerScheduleController;
use App\Http\Controllers\ArmadaController;
use App\Http\Controllers\KruController;
use App\Http\Controllers\PesananController;
use App\Models\Armada;
use App\Models\Kru;


// Rute Halaman Portal Pelanggan Arjuna Trans
Route::get('/order-status', [OrderStatusController::class, 'index'])->name('order.status');

// Rute API: Pencarian Pesanan via ID / WhatsApp (Form Pencarian)
Route::post('/api/order/search', [OrderStatusController::class, 'search']);

// Rute API: Aksi Kirim Bukti Transfer Pelanggan (Tombol Kirim Bukti Pembayaran)
Route::post('/api/order/upload-payment', [OrderStatusController::class, 'uploadBuktiBayar']);

// Rute API: Mengambil Data Jadwal Bus Aktif (Kalender Pelanggan)
Route::get('/api/customer-schedule', [CustomerScheduleController::class, 'getSchedule']);

// Rute API Internal Admin: Kelola Master Data Armada Bus
Route::get('/api/admin/armada', [ArmadaController::class, 'index']);
Route::post('/api/admin/armada/store', [ArmadaController::class, 'store']);

// Rute API Internal Admin: Kelola Master Data Kru (Sopir & Kernet)
Route::get('/api/admin/kru', [KruController::class, 'index']);
Route::post('/api/admin/kru/store', [KruController::class, 'store']);


// Ubah rute Master Data Admin Anda menjadi seperti ini:
Route::get('/admin/master-data', function () {
    return Inertia::render('MasterData', [
        // KUNCI UTAMA: Data ditarik dari DB sejak admin klik menu, langsung dikirim ke React
        'armadaFromBackend' => Armada::orderBy('created_at', 'desc')->get(),
        'crewFromBackend' => Kru::orderBy('created_at', 'desc')->get()
    ]);
});

// Rute API Internal Admin: Update Data Master Armada Bus
Route::put('/api/admin/armada/update/{id}', [ArmadaController::class, 'update']);
// Rute API Internal Admin: Hapus Aset Master Data Armada Bus
Route::delete('/api/admin/armada/delete/{id}', [ArmadaController::class, 'destroy']);
// Rute API Internal Admin: Simpan Data Master Kru Lapangan
Route::post('/api/admin/kru/store', [KruController::class, 'store']);
// Rute API Internal Admin: Update dan Hapus Data Master Kru Lapangan
Route::put('/api/admin/kru/update/{id}', [KruController::class, 'update']);
Route::delete('/api/admin/kru/delete/{id}', [KruController::class, 'destroy']);

// Rute API Internal Admin: Kelola Transaksi Pesanan Masuk Arjuna Trans
Route::get('/api/admin/pesanan', [PesananController::class, 'index']);
// Rute API Internal Admin: Simpan Data Reservasi/Pesanan Baru ke Database
Route::post('/api/admin/pesanan/store', [PesananController::class, 'store']);
// REVISI SAKRAL ROUTE: Menambahkan saringan regex agar string ID ORD-... tidak memicu error 404 lagi!
Route::put('/api/admin/pesanan/update-full/{id}', [PesananController::class, 'updateFull'])->where('id', '.*');












// =========================================================================
// 1. JALUR UMUM / PELANGGAN (Bisa diakses siapa saja tanpa login)
// =========================================================================

// Halaman Utama / Landing Page
Route::get('/', function () {
    return Inertia::render('Landing');
});

// Jalur Tombol Halaman Login Admin Anda
Route::get('/login-admin', function () {
    return Inertia::render('Login');
})->name('login.admin');

// 3 Menu Pelanggan dari Landing Page (Dikeluarkan dari penguncian)
Route::get('/customer-order', function () {
    return Inertia::render('CustomerOrder');
})->name('customer-order');
Route::get('/booking-success', function () {
    return Inertia::render('OrderSuccess');
})->name('booking.success');
Route::get('/order-status', function () {
    return Inertia::render('OrderStatus');
})->name('order-status');
Route::get('/schedule', function () {
    return Inertia::render('CustomerSchedule');
})->name('schedule'); // Untuk luar

//admin route
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');
Route::get('/orders', function () {
    return Inertia::render('Orders');
})->name('orders');
Route::get('/plotting', function () {
    return Inertia::render('Plotting');
})->name('plotting');
Route::get('/admin-schedule', function () {
    return Inertia::render('Schedule');
})->name('admin.schedule'); // Untuk admin di dalam
Route::get('/master-data', function () {
    return Inertia::render('MasterData');
})->name('master-data');
Route::get('/reports', function () {
    return Inertia::render('Reports');
})->name('reports');




// =========================================================================
// 2. JALUR BACKOFFICE / ADMIN (Wajib Login Baru Bisa Diakses)
// =========================================================================
Route::middleware(['auth', 'verified'])->group(function () {

    // Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('dashboard');
    Route::get('/catalog', function () {
        return Inertia::render('Catalog');
    })->name('catalog');
    Route::get('/documents', function () {
        return Inertia::render('Documents');
    })->name('documents');
    // Route::get('/master-data', function () {
    //     return Inertia::render('MasterData');
    // })->name('master-data');
    // Route::get('/orders', function () {
    //     return Inertia::render('Orders');
    // })->name('orders');
    // Route::get('/plotting', function () {
    //     return Inertia::render('Plotting');
    // })->name('plotting');
    // Route::get('/reports', function () {
    //     return Inertia::render('Reports');
    // })->name('reports');

    // Profil Akun Admin
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
