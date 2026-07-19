import React from "react";
import { Check, X } from "lucide-react";

interface ModalSuccessPaymentProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalSuccessPayment: React.FC<ModalSuccessPaymentProps> = ({
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Box Putih Melayang Proporsional */}
            <div className="bg-white w-full max-w-[360px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-8 space-y-5 text-center border border-slate-100 animate-in zoom-in-95 duration-200 relative">
                {/* Bulatan Centang Hijau Besar */}
                <div className="w-16 h-16 bg-[#10B981] text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100 mx-auto animate-in scale-in duration-300">
                    <Check size={32} strokeWidth={3} />
                </div>

                {/* Teks Judul & Deskripsi Sesuai Kalimat Anda */}
                <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider leading-none">
                        Bukti Terkirim!
                    </h4>
                    <p className="text-slate-500 text-[11px] font-semibold leading-relaxed px-2 normal-case tracking-normal">
                        Bukti transfer Anda berhasil diunggah!{" "}
                        <span className="block mt-1 font-bold text-[#5346F1] uppercase text-[9px] tracking-widest">
                            Menunggu verifikasi admin.
                        </span>
                    </p>
                </div>

                {/* Tombol Tutup Panjang Di Dasar */}
                <div className="pt-2 border-t border-slate-50">
                    <button
                        onClick={onClose}
                        type="button"
                        className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest rounded-xl text-center shadow-md transition-all active:scale-95"
                    >
                        Selesai
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalSuccessPayment;
