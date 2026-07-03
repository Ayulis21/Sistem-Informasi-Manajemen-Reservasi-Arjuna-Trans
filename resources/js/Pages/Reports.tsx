import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import PaymentTable from "./ReportComponents/PaymentTable";
import CrewReport from "./ReportComponents/CrewReport"; // Memanggil komponen performa kru baru kita
import ModalHistory from "./ReportComponents/ModalHistory";
import { Search, Printer } from "lucide-react";

const staticState = {
    payments: [
        {
            id: "ORD1",
            customerName: "Keluarga Pak Jaka (Family Gathering)",
            totalPrice: 9500000,
            paidAmount: 2500000,
            dueDate: "29/6/2026",
        },
        {
            id: "ORD2",
            customerName: "PT Maju Jaya Sentosa (Outing Kantor)",
            totalPrice: 12000000,
            paidAmount: 0,
            dueDate: "2/7/2026",
        },
        {
            id: "ORD3",
            customerName: "Rombongan SMK Pariwisata Harapan",
            totalPrice: 8500000,
            paidAmount: 1500000,
            dueDate: "7/7/2026",
        },
        {
            id: "ORD5",
            customerName: "Study Tour SD Merdeka Baru",
            totalPrice: 7500000,
            paidAmount: 7500000,
            dueDate: "17/6/2026",
        },
    ],
    // DATA DATA RIIL KINERJA KRU LAPANGAN ARJUNA TRANS
    crewPerformance: [
        {
            name: "Pak Slamet Hariyadi",
            role: "DRIVER",
            trips: 28,
            totalKm: 24500,
            lastRoute: "Batu Malang - BNS",
        },
        {
            name: "Pak Bambang Tri",
            role: "DRIVER",
            trips: 14,
            totalKm: 12800,
            lastRoute: "Bandung - Lembang",
        },
        {
            name: "Mas Agus Santoso",
            role: "HELPER",
            trips: 35,
            totalKm: 31000,
            lastRoute: "Bali - Pantai Kuta",
        },
    ],
};

const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"PEMBAYARAN" | "KRU">(
        "PEMBAYARAN",
    );
    const [search, setSearch] = useState("");

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<any>(null);

    const handleOpenHistory = (row: any) => {
        setSelectedRowData(row);
        setIsHistoryOpen(true);
    };

    const filteredPayments = staticState.payments.filter(
        (p) =>
            p.customerName.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase()),
    );

    // Memfilter pencarian data kru lapangan
    const filteredCrew = staticState.crewPerformance.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.role.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <AdminLayout>
            <div className="space-y-6 text-left">
                {/* Header Menu */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                            Pusat Laporan & Analitik
                        </h2>
                        <p className="text-slate-400 text-xs font-bold italic mt-1.5">
                            Monitoring sisa piutang pelanggan dan produktivitas
                            tim.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/60 p-1 rounded-full flex shadow-sm text-[10px] font-black uppercase tracking-widest shrink-0 w-full sm:w-auto justify-end">
                        <button
                            onClick={() => setActiveTab("PEMBAYARAN")}
                            type="button"
                            className={`px-5 py-2 rounded-full transition-all duration-300 ${activeTab === "PEMBAYARAN" ? "bg-[#5346F1] text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            Laporan Pembayaran
                        </button>
                        <button
                            onClick={() => setActiveTab("KRU")}
                            type="button"
                            className={`px-5 py-2 rounded-full transition-all duration-300 ${activeTab === "KRU" ? "bg-[#5346F1] text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            Laporan Kinerja Kru
                        </button>
                    </div>
                </div>

                {/* Bar Pencarian */}
                <div className="relative group">
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={
                            activeTab === "PEMBAYARAN"
                                ? "Cari nama pelanggan..."
                                : "Cari nama kru lapangan..."
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm text-xs font-bold outline-none placeholder:font-normal placeholder:text-slate-400"
                    />
                </div>

                {/* Switch Tab Konten Dinamis */}
                <div className="pt-1">
                    {activeTab === "PEMBAYARAN" ? (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left mt-2">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                                            <th className="py-4 px-6">
                                                Pelanggan & Jatuh Tempo
                                            </th>
                                            <th className="py-4 px-6">
                                                Total Sewa
                                            </th>
                                            <th className="py-4 px-6">
                                                Dibayar
                                            </th>
                                            <th className="py-4 px-6">
                                                Sisa Piutang
                                            </th>
                                            <th className="py-4 px-6 text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-600">
                                        {filteredPayments.map((r, i) => (
                                            <tr
                                                key={i}
                                                className="hover:bg-slate-50/30 transition-colors"
                                            >
                                                <td className="py-5 px-6">
                                                    <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none">
                                                        {r.customerName}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-2 text-[9px] font-black uppercase tracking-wider">
                                                        <span className="text-slate-400">
                                                            {r.id}
                                                        </span>
                                                        <span className="text-slate-200">
                                                            |
                                                        </span>
                                                        <span className="text-red-500 font-bold">
                                                            DUE: {r.dueDate}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 font-bold text-slate-700">
                                                    Rp{" "}
                                                    {r.totalPrice.toLocaleString(
                                                        "id-ID",
                                                    )}
                                                </td>
                                                <td className="py-5 px-6 font-bold text-emerald-500">
                                                    Rp{" "}
                                                    {r.paidAmount.toLocaleString(
                                                        "id-ID",
                                                    )}
                                                </td>
                                                <td className="py-5 px-6 font-bold text-red-500">
                                                    Rp{" "}
                                                    {(
                                                        r.totalPrice -
                                                        r.paidAmount
                                                    ).toLocaleString("id-ID")}
                                                </td>
                                                <td className="py-5 px-6 text-center">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <button
                                                            onClick={() =>
                                                                handleOpenHistory(
                                                                    r,
                                                                )
                                                            }
                                                            type="button"
                                                            className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-all active:scale-95"
                                                        >
                                                            Riwayat
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                alert(
                                                                    "Mencetak Nota Faktur...",
                                                                )
                                                            }
                                                            type="button"
                                                            className="w-8 h-8 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                                                        >
                                                            <Printer
                                                                size={12}
                                                                strokeWidth={
                                                                    2.5
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* MODIFIKASI: Memanggil komponen pecahan kru yang baru saja dibuat */
                        <CrewReport crewData={filteredCrew} />
                    )}
                </div>

                {/* Modal History */}
                <ModalHistory
                    isOpen={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                    selectedRow={selectedRowData}
                />
            </div>
        </AdminLayout>
    );
};

export default Reports;
