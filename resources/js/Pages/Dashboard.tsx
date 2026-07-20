import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Cell,
    PieChart,
    Pie,
} from "recharts";
import {
    Truck,
    AlertCircle,
    BarChart3,
    CheckCircle2,
    Calendar,
    ArrowRight,
} from "lucide-react";

interface DashboardProps {
    stats: {
        totalMasuk: number;
        totalPiutang: number;
        needPlotting: number;
        onTrip: number;
        pendingVerify: number;
    };
    revenueData: any[];
    unplottedOrders: any[];
    pendingPayments: any[];
    armadaStats: any[];
}

const Dashboard: React.FC<DashboardProps> = ({
    stats,
    revenueData,
    unplottedOrders,
    pendingPayments,
    armadaStats,
}) => {
    return (
        <AdminLayout>
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                            KONTROL OPERASIONAL
                        </h2>
                        <p className="text-slate-400 text-xs font-bold italic mt-1">
                            Ringkasan aktivitas PO Arjuna Trans hari ini.
                        </p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            Server Time
                        </p>
                        <p className="text-xs font-bold text-indigo-600">
                            {new Date().toLocaleDateString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                {/* ROW 1: CORE METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Tagihan Aktif"
                        value={`Rp ${(stats.totalPiutang / 1000000).toFixed(1)}jt`} // Tampil 11.0jt
                        icon={AlertCircle}
                        color="bg-rose-500"
                        trend="Sisa Piutang"
                        subColor="bg-rose-50 text-rose-600"
                    />
                    <StatCard
                        title="Perlu Plotting"
                        value={stats.needPlotting.toString()}
                        icon={Calendar}
                        color="bg-amber-500"
                        trend="Segera Berangkat"
                        subColor="bg-amber-50 text-amber-600"
                    />
                    <StatCard
                        title="Bus di Jalan"
                        value={stats.onTrip.toString()}
                        icon={Truck}
                        color="bg-indigo-600"
                        trend="Sedang Operasional"
                        subColor="bg-indigo-50 text-indigo-600"
                    />
                    <StatCard
                        title="Verifikasi Bayar"
                        // Menampilkan angka '2' (Jumlah transaksi yang BELUM di-ACC)
                        value={stats.pendingVerify.toString()}
                        // Ganti ikon ke AlertCircle agar terasa seperti "Tugas/Warning"
                        icon={AlertCircle}
                        // Ganti warna ke AMBER (Kuning/Oranye) karena ini status "Action Required"
                        color="bg-amber-500"
                        trend="Perlu Check"
                        subColor="bg-amber-50 text-amber-600"
                    />
                    {/* <StatCard
                        title="Uang Masuk (Riil)"
                        value={`Rp ${(stats.totalMasuk / 1000000).toFixed(1)}jt`}
                        icon={CheckCircle2}
                        color="bg-emerald-500"
                        trend="Sudah ACC"
                        subColor="bg-emerald-50 text-emerald-600"
                    />

                    <StatCard
                        title="Sisa Piutang"
                        value={`Rp ${(stats.totalPiutang / 1000000).toFixed(1)}jt`}
                        icon={AlertCircle}
                        color="bg-rose-500"
                        trend="Belum Bayar"
                        subColor="bg-rose-50 text-rose-600"
                    /> */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* CHART REVENUE */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-slate-50/50">
                            <BarChart3 size={100} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-sm font-black mb-8 flex items-center text-slate-800 uppercase tracking-widest">
                                <BarChart3
                                    className="mr-3 text-indigo-500"
                                    size={18}
                                />
                                Tren Pendapatan (6 Bulan)
                            </h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient
                                                id="colorRevenue"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#6366f1"
                                                    stopOpacity={0.15}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#6366f1"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#f1f5f9"
                                        />
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: "#94a3b8",
                                                fontSize: 11,
                                            }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: "#94a3b8",
                                                fontSize: 11,
                                            }}
                                            // 🎯 KUNCI: Paksa skala minimal dari 0 sampai 10 Juta agar labelnya tidak "Rp 1, Rp 2"
                                            domain={[0, 10000000]}
                                            // Menentukan kelipatan label yang muncul (0, 5jt, 10jt)
                                            ticks={[
                                                0, 2500000, 5000000, 7500000,
                                                10000000,
                                            ]}
                                            tickFormatter={(val) => {
                                                if (val === 0) return "Rp 0";
                                                return `Rp ${(val / 1000000).toFixed(1)}jt`;
                                            }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: "20px",
                                                border: "none",
                                                boxShadow:
                                                    "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                                padding: "15px",
                                            }}
                                            // 🎯 FORMATTER TOOLTIP BIAR MUNCUL RUPIAH ASLI
                                            formatter={(value: any) =>
                                                new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                    minimumFractionDigits: 0,
                                                }).format(value)
                                            }
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#6366f1"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* URGENT ACTION: BELUM PLOTTING */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-black mb-6 text-slate-800 uppercase tracking-widest flex items-center">
                            <AlertCircle
                                className="mr-2 text-rose-500"
                                size={18}
                            />{" "}
                            ⚠️ Belum Plotting
                        </h3>
                        <div className="space-y-4">
                            {unplottedOrders.length > 0 ? (
                                unplottedOrders.map((ord) => (
                                    <div
                                        key={ord.id}
                                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
                                                    {ord.customerName}
                                                </p>
                                                <p className="text-[9px] text-slate-400 mt-0.5">
                                                    {ord.destination}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-[8px] font-black px-1.5 py-0.5 rounded ${ord.daysLeft <= 2 ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"}`}
                                            >
                                                H-{ord.daysLeft}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                (window.location.href = `/plotting?id=${ord.id}`)
                                            }
                                            className="w-full mt-3 py-2 bg-white border border-slate-200 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all"
                                        >
                                            Pasang Armada{" "}
                                            <ArrowRight size={10} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] font-bold text-slate-400 text-center py-10 italic">
                                    Semua pesanan sudah di-plotting.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ROW 3: RECENT PAYMENTS VERIFICATION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <h3 className="text-sm font-black mb-6 text-slate-800 uppercase tracking-widest flex items-center">
                            <CheckCircle2
                                className="mr-2 text-emerald-500"
                                size={18}
                            />{" "}
                            Daftar Pembayaran Terbaru
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <td className="pb-4">Pelanggan</td>
                                        <td className="pb-4">Nominal</td>
                                        <td className="pb-4">Tipe</td>
                                        <td className="pb-4 text-right">
                                            Aksi
                                        </td>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] font-bold text-slate-600">
                                    {pendingPayments.map((pay) => (
                                        <tr
                                            key={pay.id}
                                            className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="py-4">
                                                {pay.customerName}
                                            </td>
                                            <td className="py-4 text-slate-800">
                                                Rp{" "}
                                                {pay.amount.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </td>
                                            <td className="py-4">
                                                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[9px] uppercase font-black">
                                                    {pay.type}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        (window.location.href = `/orders?search=${pay.customerName}`)
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-800 flex items-center justify-end gap-1 ml-auto"
                                                >
                                                    Cek <ArrowRight size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-black mb-8 text-slate-800 uppercase tracking-widest">
                            Status Armada
                        </h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={armadaStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {armadaStats.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 mt-4">
                            {armadaStats.map((d) => (
                                <div
                                    key={d.name}
                                    className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest"
                                >
                                    <div className="flex items-center">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full mr-3"
                                            style={{ backgroundColor: d.color }}
                                        ></div>
                                        <span className="text-slate-400">
                                            {d.name}
                                        </span>
                                    </div>
                                    <span className="text-slate-800">
                                        {d.value} Unit
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

// --- KOMPONEN STATCARD (Didefinisikan di sini untuk memperbaiki error) ---
const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    subColor,
}: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
        <div className="absolute -right-4 -bottom-4 p-8 text-slate-50 transition-transform group-hover:scale-110 duration-500">
            <Icon size={80} />
        </div>
        <div className="relative z-10 flex items-start justify-between">
            <div>
                <div
                    className={`px-2 py-1 rounded-lg ${subColor} text-[8px] font-black uppercase tracking-[0.2em] mb-3 w-fit`}
                >
                    {trend}
                </div>
                <h4 className="text-3xl font-black text-slate-800 tracking-tighter">
                    {value}
                </h4>
                <p className="mt-1 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                    {title}
                </p>
            </div>
            <div
                className={`${color} p-4 rounded-2xl text-white shadow-lg shadow-indigo-100`}
            >
                <Icon size={24} />
            </div>
        </div>
    </div>
);

export default Dashboard;
