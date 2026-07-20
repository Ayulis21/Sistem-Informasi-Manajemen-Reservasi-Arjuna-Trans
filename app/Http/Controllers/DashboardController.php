<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $statusSah = ['Disetujui', 'Terjadwal', 'Selesai'];

        // 1. DATA PESANAN & PIUTANG (LOGIKA BONGKAR JSON)
        $pesananSah = DB::table('pesanan')->whereIn('status_pesanan', $statusSah)->get();
        $totalSewaAktif = $pesananSah->sum('harga_sewa');

        $riwayatPembayaran = DB::table('riwayat_pembayaran')
            ->whereIn('id_pesanan', $pesananSah->pluck('id_pesanan'))
            ->get();

        $totalDuitMasukACC = 0;
        $allPendingPayments = [];

        foreach ($riwayatPembayaran as $rp) {
            $json = json_decode($rp->catatan_pembayaran, true);
            if (is_array($json)) {
                foreach ($json as $item) {
                    // Hitung Duit yang sudah ACC (Untuk sisa piutang 9.5jt)
                    if (isset($item['paymentStatus']) && $item['paymentStatus'] === 'Disetujui') {
                        $totalDuitMasukACC += floatval($item['amount'] ?? 0);
                    }

                    // Kumpulkan yang Pending untuk Tabel Verifikasi
                    if (isset($item['paymentStatus']) && $item['paymentStatus'] === 'Pending' && ($item['amount'] ?? 0) > 0) {
                        // Cari nama pemesan untuk tampilan tabel
                        $p = $pesananSah->firstWhere('id_pesanan', $rp->id_pesanan);
                        $allPendingPayments[] = [
                            'id' => $rp->id_pembayaran,
                            'customerName' => $p->nama_pemesan ?? 'Pelanggan',
                            'amount' => (int)($item['amount'] ?? 0),
                            'type' => $item['type'] ?? 'Bayar'
                        ];
                    }
                }
            }
        }

        $totalPiutang = $totalSewaAktif - $totalDuitMasukACC;

        // 2. DATA GRAFIK PENDAPATAN (6 BULAN TERAKHIR)
        $revenueData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $totalBulanIni = 0;

            foreach ($riwayatPembayaran as $rp) {
                // Gunakan tgl_bayar asli dari MySQL atau dari JSON jika ada
                if (Carbon::parse($rp->tgl_bayar)->isSameMonth($month)) {
                    $json = json_decode($rp->catatan_pembayaran, true);
                    if (is_array($json)) {
                        foreach ($json as $item) {
                            if (($item['paymentStatus'] ?? '') === 'Disetujui') {
                                $totalBulanIni += floatval($item['amount'] ?? 0);
                            }
                        }
                    }
                }
            }
            $revenueData[] = ['day' => $month->format('M'), 'total' => (int)$totalBulanIni];
        }

        // 3. DATA TABEL: PESANAN BELUM PLOTTING
        $unplottedOrders = DB::table('pesanan')
            ->where('status_pesanan', 'Disetujui')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))->from('penugasan')->whereRaw('penugasan.id_pesanan = pesanan.id_pesanan');
            })
            ->orderBy('tgl_berangkat', 'asc')
            ->limit(5)->get()->map(function ($order) {
                return [
                    'id' => $order->id_pesanan,
                    'customerName' => $order->nama_pemesan,
                    'destination' => $order->tujuan_main,
                    'daysLeft' => Carbon::now()->diffInDays(Carbon::parse($order->tgl_berangkat), false)
                ];
            });

        // 4. DATA PIE CHART ARMADA
        $onTrip = DB::table('armada')->where('status_ketersediaan', 'Perjalanan')->count();
        $armadaStats = [
            ['name' => 'Ready', 'value' => DB::table('armada')->where('status_ketersediaan', 'Tersedia')->count(), 'color' => '#10b981'],
            ['name' => 'On Trip', 'value' => $onTrip, 'color' => '#6366f1'],
            ['name' => 'Maintenance', 'value' => DB::table('armada')->where('status_ketersediaan', 'Perbaikan')->count(), 'color' => '#ef4444'],
        ];

        // 5. RETURN KE REACT
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalPiutang' => $totalPiutang, // 🎯 HASIL: Rp 9.5jt
                'totalMasuk' => $totalDuitMasukACC, // Rp 2.5jt
                'needPlotting' => $unplottedOrders->count(),
                'onTrip' => $onTrip,
                'pendingVerify' => count($allPendingPayments),
            ],
            'revenueData' => $revenueData,
            'unplottedOrders' => $unplottedOrders,
            'pendingPayments' => $allPendingPayments,
            'armadaStats' => $armadaStats
        ]);
    }
}
