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
        // 1. STATUS PESANAN YANG DIANGGAP "SAH" (Exclude Baru & Batal)
        $statusSah = ['Disetujui', 'Terjadwal', 'Selesai'];

        // 2. TOTAL HARGA SEWA (Hanya Pesanan Ayu: 12jt)
        $totalSewaAktif = DB::table('pesanan')
            ->whereIn('status_pesanan', $statusSah)
            ->sum('harga_sewa');

        // 3. TOTAL SEMUA PEMBAYARAN (Pending + ACC)
        // 🎯 KUNCI: Kita ambil dari tabel riwayat_pembayaran yang id_pesanannya ada di pesanan SAH
        $totalSemuaBayar = DB::table('riwayat_pembayaran')
            ->join('pesanan', 'riwayat_pembayaran.id_pesanan', '=', 'pesanan.id_pesanan')
            ->whereIn('pesanan.status_pesanan', $statusSah)
            ->where('riwayat_pembayaran.status_pembayaran', '!=', 'Ditolak')
            ->sum('riwayat_pembayaran.nominal');

        // 4. SISA PIUTANG (12jt - 1jt = 11jt)
        $totalPiutang = $totalSewaAktif - $totalSemuaBayar;

        // 5. TOTAL DUIT DI TANGAN (Hanya yang sudah di-ACC)
        $totalDuitACC = DB::table('riwayat_pembayaran')
            ->where('status_pembayaran', 'Disetujui')
            ->sum('nominal');

        // 6. LOGIKA OPERASIONAL (Label Perlu ACC, Plotting, dll)
        $pendingVerifyCount = DB::table('riwayat_pembayaran')
            ->join('pesanan', 'riwayat_pembayaran.id_pesanan', '=', 'pesanan.id_pesanan')
            ->whereIn('pesanan.status_pesanan', ['Disetujui', 'Terjadwal', 'Selesai']) // Hanya pesanan resmi
            ->where('riwayat_pembayaran.status_pembayaran', 'Pending') // Status kolom MySQL
            ->where('riwayat_pembayaran.nominal', '>', 0)
            ->count();
        $onTrip = DB::table('armada')->where('status_ketersediaan', 'Perjalanan')->count();
        $needPlotting = DB::table('pesanan')->where('status_pesanan', 'Disetujui')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))->from('penugasan')->whereRaw('penugasan.id_pesanan = pesanan.id_pesanan');
            })->count();

        // 7. DATA GRAFIK & LIST (Satukan semua di sini)
        $revenueData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $total = DB::table('riwayat_pembayaran')->where('status_pembayaran', 'Disetujui')
                ->whereMonth('tgl_bayar', $month->month)->whereYear('tgl_bayar', $month->year)->sum('nominal');
            $revenueData[] = ['day' => $month->format('M'), 'total' => (int) $total];
        }

        $unplottedOrders = DB::table('pesanan')->where('status_pesanan', 'Disetujui')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))->from('penugasan')->whereRaw('penugasan.id_pesanan = pesanan.id_pesanan');
            })->orderBy('tgl_berangkat', 'asc')->limit(5)->get()->map(function ($order) {
                return [
                    'id' => $order->id_pesanan,
                    'customerName' => $order->nama_pemesan,
                    'destination' => $order->tujuan_main,
                    'daysLeft' => Carbon::now()->diffInDays(Carbon::parse($order->tgl_berangkat), false)
                ];
            });

        $pendingPayments = DB::table('riwayat_pembayaran')
            ->join('pesanan', 'riwayat_pembayaran.id_pesanan', '=', 'pesanan.id_pesanan')
            ->where('riwayat_pembayaran.status_pembayaran', 'Pending')
            // 🎯 KUNCI: Buang data yang nominalnya 0 supaya tidak muncul di tabel Dashboard
            ->where('riwayat_pembayaran.nominal', '>', 0)
            ->select(
                'riwayat_pembayaran.id_pembayaran as id',
                'pesanan.nama_pemesan as customerName',
                'riwayat_pembayaran.nominal as amount',
                'riwayat_pembayaran.tipe_keterangan as type'
            )
            ->orderBy('riwayat_pembayaran.created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalPiutang' => $totalPiutang, // 🎯 PASTI JADI 11JT
                'totalMasuk' => $totalDuitACC,
                'needPlotting' => $needPlotting,
                'onTrip' => $onTrip,
                'pendingVerify' => $pendingVerifyCount,
            ],
            'revenueData' => $revenueData,
            'unplottedOrders' => $unplottedOrders,
            'pendingPayments' => $pendingPayments,
            'armadaStats' => [
                ['name' => 'Ready', 'value' => DB::table('armada')->where('status_ketersediaan', 'Tersedia')->count(), 'color' => '#10b981'],
                ['name' => 'On Trip', 'value' => $onTrip, 'color' => '#6366f1'],
                ['name' => 'Maintenance', 'value' => DB::table('armada')->where('status_ketersediaan', 'Perbaikan')->count(), 'color' => '#ef4444'],
            ]
        ]);
    }
}
