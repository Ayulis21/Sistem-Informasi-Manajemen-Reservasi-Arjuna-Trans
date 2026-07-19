<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // 1. LAPORAN PEMBAYARAN (Tetap seperti commit sebelumnya yang stabil)
        $payments = DB::table('pesanan')
            ->leftJoin('riwayat_pembayaran', 'pesanan.id_pesanan', '=', 'riwayat_pembayaran.id_pesanan')
            ->select(
                'pesanan.id_pesanan as id',
                'pesanan.nama_pemesan as customerName',
                'pesanan.harga_sewa as totalPrice',
                'pesanan.jatuh_tempo as dueDate',
                'riwayat_pembayaran.catatan_pembayaran'
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
                    'catatan_pembayaran' => $p->catatan_pembayaran,
                ];
            });

        // 2. LAPORAN KINERJA KRU (DEVELOPMENT MODUL)
        $crew = DB::table('kru')
            ->where('status', 'Aktif')
            ->get()
            ->map(function ($c) {
                // Hitung Statistik berdasarkan Pesanan yang statusnya 'Selesai'
                $stats = DB::table('penugasan')
                    ->join('pesanan', 'penugasan.id_pesanan', '=', 'pesanan.id_pesanan')
                    ->where('pesanan.status_pesanan', 'Selesai')
                    ->where(function ($query) use ($c) {
                        $query->where('penugasan.id_driver', $c->id_kru)
                            ->orWhere('penugasan.id_helper', $c->id_kru);
                    })
                    ->select(
                        DB::raw('COUNT(pesanan.id_pesanan) as total_trips'),
                        DB::raw('SUM(pesanan.estimasi_jarak) as total_km')
                    )
                    ->first();

                // Ambil Rute Terakhir yang pernah dijalani
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
