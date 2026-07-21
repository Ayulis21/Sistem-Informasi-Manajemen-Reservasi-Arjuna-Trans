import React, { useState, useMemo } from "react";
import { Calendar, ChevronRight, MapPin, Search } from "lucide-react";

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
    // 🎯 1. STATE UNTUK SEARCH & FILTER
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"BELUM" | "SUDAH" | "SEMUA">(
        "BELUM",
    );

    // 🎯 2. LOGIKA FILTERING & SORTING (useMemo agar Cepat)
    const filteredOrders = useMemo(() => {
        return orders
            .filter((o: any) => {
                // Filter Awal: Hanya status yang boleh di-plot
                const status = String(
                    o.status_pesanan || o.status || "",
                ).toLowerCase();
                const isValidStatus = [
                    "pending",
                    "plotting",
                    "plotted",
                    "terjadwal",
                    "disetujui",
                ].includes(status);
                if (!isValidStatus) return false;

                // Hitung kebutuhan vs keterisian
                const fleetReq = o.fleetRequirements || [];
                const totalReq =
                    Array.isArray(fleetReq) && fleetReq.length > 0
                        ? fleetReq.reduce(
                              (sum: number, item: any) =>
                                  sum + Number(item.qty || 0),
                              0,
                          )
                        : Number(o.jumlah_unit_diminta || 1);
                const filled = o.assignments?.length || 0;
                const isPlotted = filled >= totalReq;

                // Search
                const keyword = searchTerm.toLowerCase();
                const matchesSearch =
                    o.nama_pemesan?.toLowerCase().includes(keyword) ||
                    o.id_pesanan?.toLowerCase().includes(keyword) ||
                    o.tujuan_main?.toLowerCase().includes(keyword);

                // Filter Tab
                let matchesTab = true;
                if (activeTab === "BELUM") matchesTab = !isPlotted;
                if (activeTab === "SUDAH") matchesTab = isPlotted;

                return matchesSearch && matchesTab;
            })
            .sort((a, b) => {
                // Sorting: Tanggal berangkat terdekat di atas
                return (
                    new Date(a.tgl_berangkat).getTime() -
                    new Date(b.tgl_berangkat).getTime()
                );
            });
    }, [orders, searchTerm, activeTab]);

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-[85vh]">
            {/* HEADER & JUDUL */}
            <div className="mb-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
                    <Calendar size={18} className="mr-2 text-indigo-600" />
                    Antrean Plotting
                </h3>
            </div>

            {/* BOKS PENCARIAN */}
            <div className="relative mb-4">
                <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    type="text"
                    placeholder="Cari Nama / ID / Tujuan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
            </div>

            {/* TAB FILTER */}
            <div className="flex bg-slate-50 p-1 rounded-xl gap-1 mb-4 text-[9px] font-black uppercase tracking-wider">
                <button
                    onClick={() => setActiveTab("BELUM")}
                    className={`flex-1 py-2 rounded-lg transition-all ${activeTab === "BELUM" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
                >
                    Belum Lengkap
                </button>
                <button
                    onClick={() => setActiveTab("SUDAH")}
                    className={`flex-1 py-2 rounded-lg transition-all ${activeTab === "SUDAH" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}
                >
                    Selesai
                </button>
                <button
                    onClick={() => setActiveTab("SEMUA")}
                    className={`flex-1 py-2 rounded-lg transition-all ${activeTab === "SEMUA" ? "bg-white text-slate-600 shadow-sm" : "text-slate-400"}`}
                >
                    Semua
                </button>
            </div>

            {/* LIST ANTREAN (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-10 opacity-30 italic text-xs font-bold">
                        Tidak ada data.
                    </div>
                ) : (
                    filteredOrders.map((o: any) => {
                        const currentId = o.id_pesanan || o.id;
                        const isSelected =
                            String(selectedOrderId).trim() ===
                            String(currentId).trim();
                        const filled = o.assignments?.length || 0;

                        // Hitung ulang totalReq untuk label progress
                        const fleetReq = o.fleetRequirements || [];
                        const totalReq =
                            Array.isArray(fleetReq) && fleetReq.length > 0
                                ? fleetReq.reduce(
                                      (sum: number, item: any) =>
                                          sum + Number(item.qty || 0),
                                      0,
                                  )
                                : Number(o.jumlah_unit_diminta || 1);

                        return (
                            <button
                                key={currentId}
                                onClick={() => setSelectedOrderId(currentId)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                    isSelected
                                        ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200/50 -translate-y-1"
                                        : "bg-white border-slate-100 hover:border-indigo-300"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span
                                        className={`text-[8px] font-black uppercase ${isSelected ? "text-indigo-200" : "text-slate-400"}`}
                                    >
                                        {currentId}
                                    </span>
                                    {filled >= totalReq && (
                                        <div className="bg-emerald-400 text-[6px] font-black text-white px-1.5 py-0.5 rounded uppercase">
                                            TERJADWAL
                                        </div>
                                    )}
                                </div>

                                <p
                                    className={`font-black uppercase text-xs truncate ${isSelected ? "text-white" : "text-slate-800"}`}
                                >
                                    {o.nama_pemesan || "Tanpa Nama"}
                                </p>

                                <div
                                    className={`flex items-center gap-2 text-[7px] font-bold uppercase mt-1 ${isSelected ? "text-indigo-200" : "text-slate-400"}`}
                                >
                                    <MapPin size={8} />{" "}
                                    <span className="truncate">
                                        {o.tujuan_main || "-"}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {o.tgl_berangkat?.substring(8, 10)}/
                                        {o.tgl_berangkat?.substring(5, 7)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mt-3">
                                    <div
                                        className={`px-2 py-0.5 rounded text-[8px] font-black ${
                                            filled >= totalReq
                                                ? "bg-emerald-400 text-white"
                                                : filled > 0
                                                  ? "bg-amber-400 text-white"
                                                  : "bg-rose-400 text-white"
                                        }`}
                                    >
                                        {filled} / {totalReq} Unit
                                    </div>
                                    <ChevronRight
                                        size={14}
                                        className={
                                            isSelected
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
