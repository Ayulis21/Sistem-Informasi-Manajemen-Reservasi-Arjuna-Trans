<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB; // 🚀 FIX: Impor gerbang database SQL
use Inertia\Inertia;                // 🚀 FIX: Impor gerbang transmisi React Inertia

class PlottingController extends Controller
{
    public function index(Request $request)
    {
        $orders = DB::table('pesanan')
            ->orderBy('id_pesanan', 'desc')
            ->get();
        $armada = DB::table('armada')->get();
        $crew = DB::table('kru')->get();

        return Inertia::render('Plotting', [
            'orders'       => $orders,
            'armada'       => $armada,
            'crew'         => $crew,
            'urlIdPesanan' => $request->query('id')
        ]);
    }
}
