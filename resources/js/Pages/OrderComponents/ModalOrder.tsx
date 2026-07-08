import React from "react";
import { X } from "lucide-react";

interface ModalOrderProps {
    isOpen: boolean;
    onClose: () => void;
    isEditMode: boolean;
    formData: any;
    children: React.ReactNode;
}

const ModalOrder: React.FC<ModalOrderProps> = ({
    isOpen,
    onClose,
    isEditMode,
    formData,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* 🎯 KUNCI UTAMA: Menggunakan max-w-5xl agar boks modal melebar penuh ke samping sesuai gambar */}
            <div className="bg-white rounded-[2rem] w-full max-w-5xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden max-h-[95vh] flex flex-col">
                {/* HEADER KEPALA MODAL ASLI */}
                <div className="flex justify-between items-center border-b border-slate-100 p-6 bg-white flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-[#5346F1] rounded-full"></div>
                        <div className="text-left">
                            <h3 className="text-sm font-black text-[#5346F1] uppercase tracking-wider leading-none">
                                {formData?.id_pesanan
                                    ? "EDIT DETAIL PESANAN"
                                    : "TAMBAH PESANAN BARU"}
                            </h3>
                            <span className="text-[10px] font-black text-slate-400 uppercase block mt-1 tracking-wider">
                                {formData?.id_pesanan || "ORD-XXXXXXXXXX"}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-300 hover:text-slate-500 transition-colors p-1 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* AREA JALUR ISI FORMULIR */}
                <div className="p-6 overflow-y-auto flex-1 bg-white scrollbar-thin">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalOrder;
