<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    // app/Http/Controllers/ReportController.php

    public function index()
    {
        $payments = DB::table('pesanan')
            ->leftJoin('riwayat_pembayaran', 'pesanan.id_pesanan', '=', 'riwayat_pembayaran.id_pesanan')
            ->select(
                'pesanan.id_pesanan as id',
                'pesanan.nama_pemesan as customerName',
                'pesanan.harga_sewa as totalPrice',
                'pesanan.jatuh_tempo as dueDate',
                'riwayat_pembayaran.catatan_pembayaran' // 🎯 Ambil kolom JSON ini
            )
            ->where('pesanan.status_pesanan', '!=', 'Batal')
            ->get()
            ->map(function ($p) {
                $totalBayarValid = 0;

                if ($p->catatan_pembayaran && strpos($p->catatan_pembayaran, '[') === 0) {
                    $history = json_decode($p->catatan_pembayaran, true);
                    foreach ($history as $item) {
                        if (isset($item['paymentStatus']) && $item['paymentStatus'] === 'Disetujui') {
                            $totalBayarValid += floatval($item['amount'] ?? 0);
                        }
                    }
                }

                return [
                    'id' => $p->id,
                    'customerName' => $p->customerName,
                    'totalPrice' => (int)$p->totalPrice,
                    'paidAmount' => (int)$totalBayarValid,
                    'dueDate' => $p->dueDate,
                    // 🎯 KUNCI PERBAIKAN: Kirimkan data JSON ini ke React
                    'catatan_pembayaran' => $p->catatan_pembayaran,
                ];
            });

        $crew = DB::table('kru')->where('status', 'Aktif')->get();

        return Inertia::render('Reports', [
            'dbPayments' => $payments,
            'dbCrew' => $crew
        ]);
    }
}
