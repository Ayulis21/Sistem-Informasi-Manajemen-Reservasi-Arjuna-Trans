import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import PaymentTable from "./ReportComponents/PaymentTable";
import CrewReport from "./ReportComponents/CrewReport";
import ModalHistory from "./ReportComponents/ModalHistory";
import { Search } from "lucide-react";

interface ReportsProps {
    dbPayments: any[];
    dbCrew: any[];
}

const Reports: React.FC<ReportsProps> = ({ dbPayments = [], dbCrew = [] }) => {
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

    // Filter Pencarian Pembayaran
    const filteredPayments = dbPayments.filter(
        (p) =>
            p.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            p.id?.toLowerCase().includes(search.toLowerCase()),
    );

    // Filter Pencarian Kru
    const filteredCrew = dbCrew.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <AdminLayout>
            <div className="space-y-6 text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            Pusat Laporan & Analitik
                        </h2>
                        <p className="text-slate-400 text-xs font-bold italic mt-1.5">
                            Monitoring sisa piutang dan produktivitas tim.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/60 p-1 rounded-full flex text-[10px] font-black uppercase tracking-widest shrink-0">
                        <button
                            onClick={() => setActiveTab("PEMBAYARAN")}
                            className={`px-5 py-2 rounded-full transition-all ${activeTab === "PEMBAYARAN" ? "bg-[#5346F1] text-white shadow-md" : "text-slate-400"}`}
                        >
                            Laporan Pembayaran
                        </button>
                        <button
                            onClick={() => setActiveTab("KRU")}
                            className={`px-5 py-2 rounded-full transition-all ${activeTab === "KRU" ? "bg-[#5346F1] text-white shadow-md" : "text-slate-400"}`}
                        >
                            Laporan Kinerja Kru
                        </button>
                    </div>
                </div>

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
                                : "Cari nama kru..."
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm text-xs font-bold outline-none"
                    />
                </div>

                <div className="pt-1">
                    {activeTab === "PEMBAYARAN" ? (
                        <PaymentTable
                            reportData={filteredPayments}
                            onOpenHistory={handleOpenHistory}
                        />
                    ) : (
                        <CrewReport crewData={filteredCrew} />
                    )}
                </div>

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
