import React from "react";
import { Calendar, ChevronRight } from "lucide-react";

interface PlottingLeftProps {
    orders: any[];
    selectedOrderId: string | null;
    setSelectedOrderId: (id: string) => void;
}
const PlottingLeft: React.FC<PlottingLeftProps> = ({
    orders = [],
    selectedOrderId,
    setSelectedOrderId,
}) => {
    const ordersAntreanPlotting = orders.filter((o: any) => {
        const statusSaringan = String(o.status_pesanan || o.status || "")
            .toLowerCase()
            .trim();

        // 🚀 FIX MUTLAK: Silakan tambahkan atau kurangi kata status di bawah ini sesuai kebutuhan operasional PO Arjuna Trans Anda!
        return (
            statusSaringan === "scheduled" ||
            statusSaringan === "pending" || // <── Status Pending otomatis diloloskan masuk antrean list kiri
            statusSaringan === "plotting" ||
            statusSaringan === "plotted" ||
            statusSaringan === "terjadwal" ||
            statusSaringan === "disetujui"
        );
    });

    console.log("=== RADAR PO ARJUNA TRANS ===");
    console.log("1. Data orders asli dari Laravel masuk:", orders);
    console.log(
        "2. Hasil orders setelah disaring filter:",
        ordersAntreanPlotting,
    );
    return (
        <div
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
            id="plotting-orders-list-card"
        >
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center mb-4">
                <Calendar size={18} className="mr-2 text-indigo-600" />
                Antrean Plotting ({orders.length} data masuk /{" "}
                {ordersAntreanPlotting.length} lolos)
            </h3>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {ordersAntreanPlotting.length === 0 ? (
                    <div className="text-center py-10 opacity-40 italic text-xs">
                        Belum ada pesanan disetujui.
                    </div>
                ) : (
                    ordersAntreanPlotting.map((o) => {
                        // PlottingLeft.tsx
                        const totalReq = React.useMemo(() => {
                            // Jika fleetRequirements ada dan isinya array
                            if (
                                o.fleetRequirements &&
                                Array.isArray(o.fleetRequirements) &&
                                o.fleetRequirements.length > 0
                            ) {
                                return o.fleetRequirements.reduce(
                                    (sum: number, item: { qty: any }) =>
                                        sum + Number(item.qty || 0),
                                    0,
                                );
                            }
                            // Jika data detail tidak ada, ambil dari kolom utama (sebagai backup)
                            return Number(o.jumlah_unit_diminta || 1);
                        }, [o.fleetRequirements, o.jumlah_unit_diminta]);

                        // Log untuk memastikan datanya masuk
                        if (o.id_pesanan === "ORD-20260711-CKMHK") {
                            console.log(
                                "ISI DATA FLEET TEST:",
                                o.fleetRequirements,
                            );
                        }

                        // 🎯 KUNCI PELACAK: Cek di Console (F12) saat halaman dibuka
                        if (o.id_pesanan === "ORD-20260711-CKMHK") {
                            // ID "test" Anda
                            console.log("CEK DATA TEST:", o.fleetRequirements);
                        }

                        const assignmentsLength = o.assignments?.length || 0;
                        const isFilled = assignmentsLength >= totalReq;

                        // 🚀 KUNCI INDUK 1: Mengunci nilai ID secara fleksibel dari id_pesanan atau id
                        const currentId = o.id_pesanan || o.id;
                        const currentName =
                            o.nama_pemesan || o.customerName || "Tanpa Nama";
                        const currentStatus = String(
                            o.status_pesanan || o.status || "",
                        ).toLowerCase();

                        return (
                            <button
                                key={currentId}
                                onClick={() => setSelectedOrderId(currentId)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                    String(selectedOrderId).trim() ===
                                    String(currentId).trim()
                                        ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100/30 -translate-y-1"
                                        : "bg-white border-slate-100 hover:border-indigo-300"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div
                                        className={`text-[8px] font-black uppercase tracking-widest ${String(selectedOrderId).trim() === String(currentId).trim() ? "text-indigo-200" : "text-slate-400"}`}
                                    >
                                        {currentId}
                                    </div>

                                    {/* 🎯 KUNCI PERBAIKAN: Gunakan isFilled, JANGAN gunakan currentStatus */}
                                    {isFilled && (
                                        <div className="bg-emerald-400 text-[6px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-widest animate-in fade-in zoom-in duration-300">
                                            PLOTTED
                                        </div>
                                    )}
                                </div>
                                {/* 🚀 KUNCI INDUK 2: Menampilkan nama pemesan asli database secara riil & kapital tebal */}
                                <p
                                    className={`font-black tracking-tight ${String(selectedOrderId).trim() === String(currentId).trim() ? "text-white" : "text-slate-800"}`}
                                >
                                    {currentName}
                                </p>

                                <div className="flex justify-between items-center mt-3">
                                    <div
                                        className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                            /* 🎯 Jika penuh = Hijau, Jika belum = Merah */
                                            isFilled
                                                ? "bg-emerald-400 text-white"
                                                : "bg-rose-400 text-white"
                                        }`}
                                    >
                                        {assignmentsLength} / {totalReq} Unit
                                    </div>
                                    <ChevronRight
                                        size={14}
                                        className={
                                            String(selectedOrderId).trim() ===
                                            String(currentId).trim()
                                                ? "text-white"
                                                : "text-slate-200"
                                        }
                                    />
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PlottingLeft;
