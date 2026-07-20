<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // 1. Tentukan status pesanan yang dianggap SAH untuk masuk laporan
        // Kita buang status 'Pending' dan 'Batal'
        $statusSah = ['Disetujui', 'Terjadwal', 'Selesai'];

        // 2. LAPORAN PEMBAYARAN & PIUTANG
        $payments = DB::table('pesanan')
            ->leftJoin('riwayat_pembayaran', 'pesanan.id_pesanan', '=', 'riwayat_pembayaran.id_pesanan')
            ->select(
                'pesanan.id_pesanan as id',
                'pesanan.nama_pemesan as customerName',
                'pesanan.harga_sewa as totalPrice',
                'pesanan.jatuh_tempo as dueDate',
                'riwayat_pembayaran.catatan_pembayaran'
            )
            // 🎯 KUNCI: Saring hanya pesanan yang sudah disetujui/jalan/selesai
            ->whereIn('pesanan.status_pesanan', $statusSah)
            ->get()
            ->map(function ($p) {
                $totalBayarValid = 0;

                // Bongkar JSON untuk menghitung pembayaran yang SUDAH DI-ACC saja
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
                    'catatan_pembayaran' => $p->catatan_pembayaran,
                ];
            });

        // 3. LAPORAN KINERJA KRU (Tetap gunakan filter 'Selesai' untuk jam terbang)
        $crew = DB::table('kru')
            ->where('status', 'Aktif')
            ->get()
            ->map(function ($c) {
                $stats = DB::table('penugasan')
                    ->join('pesanan', 'penugasan.id_pesanan', '=', 'pesanan.id_pesanan')
                    ->where('pesanan.status_pesanan', 'Selesai') // Kru hanya dapat KM jika sudah selesai
                    ->where(function ($query) use ($c) {
                        $query->where('penugasan.id_driver', $c->id_kru)
                            ->orWhere('penugasan.id_helper', $c->id_kru);
                    })
                    ->select(
                        DB::raw('COUNT(pesanan.id_pesanan) as total_trips'),
                        DB::raw('SUM(pesanan.estimasi_jarak) as total_km')
                    )
                    ->first();

                $lastOrder = DB::table('penugasan')
                    ->join('pesanan', 'penugasan.id_pesanan', '=', 'pesanan.id_pesanan')
                    ->where('pesanan.status_pesanan', 'Selesai')
                    ->where(function ($query) use ($c) {
                        $query->where('penugasan.id_driver', $c->id_kru)
                            ->orWhere('penugasan.id_helper', $c->id_kru);
                    })
                    ->orderBy('pesanan.tgl_berangkat', 'desc')
                    ->select('pesanan.tujuan_main')
                    ->first();

                return [
                    'id' => $c->id_kru,
                    'name' => $c->nama_kru,
                    'role' => $c->peran === 'Driver' ? 'SOPIR' : 'KERNET',
                    'trips' => (int)($stats->total_trips ?? 0),
                    'totalKm' => (int)($stats->total_km ?? 0),
                    'lastRoute' => $lastOrder->tujuan_main ?? 'Belum ada perjalanan',
                ];
            });

        return Inertia::render('Reports', [
            'dbPayments' => $payments,
            'dbCrew' => $crew
        ]);
    }
}
