import React from "react";
import { Banknote, X, Calendar, Receipt } from "lucide-react";

interface ModalHistoryProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRow: any;
}

const ModalHistory: React.FC<ModalHistoryProps> = ({
    isOpen,
    onClose,
    selectedRow,
}) => {
    if (!isOpen || !selectedRow) return null;

    // 1. Ambil data rincian pembayaran dari kolom catatan_pembayaran
    let historyList: any[] = [];
    try {
        if (selectedRow.catatan_pembayaran) {
            historyList = JSON.parse(selectedRow.catatan_pembayaran);
        }
    } catch (e) {
        historyList = [];
    }

    // 2. Hitung Sisa Piutang Riil
    const totalSewa = Number(selectedRow.totalPrice || 0);
    const totalTerbayar = historyList.reduce((acc, curr) => {
        return (
            acc +
            (curr.paymentStatus === "Disetujui" ? Number(curr.amount || 0) : 0)
        );
    }, 0);
    const sisaPiutang = totalSewa - totalTerbayar;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-[480px] rounded-[2.5rem] shadow-2xl p-8 space-y-6 text-left border border-slate-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-[#5346F1] rounded-full"></div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">
                                Riwayat Pembayaran
                            </h3>
                            <span className="text-[10px] font-black text-slate-400 uppercase block mt-2 italic">
                                {selectedRow.customerName}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* LIST CICILAN*/}
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {historyList.length > 0 ? (
                        historyList.map((item, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                                    item.paymentStatus === "Disetujui"
                                        ? "bg-white border-slate-100 hover:border-indigo-100"
                                        : "bg-slate-50 border-slate-100 opacity-60"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                                            item.paymentStatus === "Disetujui"
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : "bg-slate-100 text-slate-400 border-slate-200"
                                        }`}
                                    >
                                        <Banknote size={18} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-xs font-black text-slate-800">
                                            Rp{" "}
                                            {Number(
                                                item.amount || 0,
                                            ).toLocaleString("id-ID")}
                                        </h4>
                                        <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1">
                                            <Calendar size={10} /> {item.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${
                                            item.paymentStatus === "Disetujui"
                                                ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                                                : "bg-amber-50 text-amber-500 border-amber-100"
                                        }`}
                                    >
                                        {item.type}{" "}
                                        {item.paymentStatus === "Disetujui"
                                            ? ""
                                            : `(${item.paymentStatus})`}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-300 italic text-xs">
                            Belum ada data pembayaran.
                        </div>
                    )}
                </div>

                {/* Footer Keuangan */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                            Sisa Piutang
                        </span>
                        <h4
                            className={`text-xl font-black ${sisaPiutang <= 0 ? "text-emerald-500" : "text-red-500"}`}
                        >
                            {sisaPiutang <= 0
                                ? "LUNAS"
                                : `Rp ${sisaPiutang.toLocaleString("id-ID")}`}
                        </h4>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-2xl transition-all shadow-lg active:scale-95"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalHistory;
