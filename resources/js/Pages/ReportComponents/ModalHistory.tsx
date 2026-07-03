import React from "react";
import { Banknote, X } from "lucide-react";

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

    const sisaPiutang = selectedRow.totalPrice - selectedRow.paidAmount;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Box Putih Melayang Sesuai Mockup */}
            <div className="bg-white w-full max-w-[440px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-8 space-y-6 text-left border border-slate-100 animate-in zoom-in-95 duration-200">
                {/* Header Modal */}
                <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-[#5346F1] rounded-full"></div>
                        <div>
                            <h3 className="text-base font-black text-slate-800 uppercase tracking-wider leading-none">
                                Riwayat Cicilan
                            </h3>
                            <span className="text-[9px] font-black text-slate-400 uppercase block mt-1.5">
                                {selectedRow.customerName}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Baris List Cicilan Masuk (Ikon Tiket/Duit Hijau) */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-200/40">
                            <Banknote size={18} />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-black text-slate-800">
                                Rp{" "}
                                {selectedRow.paidAmount.toLocaleString("id-ID")}
                            </h4>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                15/6/2026
                            </p>
                        </div>
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic bg-white border px-2 py-1 rounded-lg">
                        DP Booking Awal
                    </span>
                </div>

                {/* Footer Bawah Sisa Piutang & Tombol Tutup Hitam */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <div className="space-y-0.5">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">
                            Sisa Piutang
                        </span>
                        <h4 className="text-sm font-black text-red-500">
                            Rp {sisaPiutang.toLocaleString("id-ID")}
                        </h4>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="bg-slate-950 hover:bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalHistory;
