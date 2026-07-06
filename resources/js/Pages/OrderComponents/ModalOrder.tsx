import React from "react";
import { MapPin, Bus, Phone, Layers, FileText, Upload, X } from "lucide-react";
import OrderMainForm from "./OrderMainForm";
import OrderFinanceForm from "./OrderFinanceForm";

interface ModalOrderProps {
    isOpen: boolean;
    onClose: () => void;
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    fetchOrdersData: () => void;
}

const ModalOrder: React.FC<ModalOrderProps> = ({
    isOpen,
    onClose,
    formData,
    setFormData,
    onSubmit,
    fetchOrdersData,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <form
                onSubmit={onSubmit}
                className="bg-white w-full max-w-[1024px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 md:p-8 space-y-6 text-left animate-in zoom-in-95 duration-300 relative border border-slate-100 custom-scrollbar"
            >
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-[#5346F1] rounded-full"></div>
                        <div>
                            <h3 className="text-base font-black text-slate-800 uppercase tracking-wider leading-none">
                                {/* Otomatis berubah kapital kaku mengikuti ada atau tidaknya ID pesanan */}
                                {formData?.id_pesanan
                                    ? "EDIT DETAIL PESANAN"
                                    : "TAMBAH RESERVASI BARU"}
                            </h3>
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-md uppercase block mt-1 tracking-wider">
                                ID:{" "}
                                {formData?.id_pesanan || formData?.id || "BARU"}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-300 hover:text-slate-500 transition-colors p-1"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <OrderMainForm
                        formData={formData}
                        setFormData={setFormData}
                    />
                    <OrderFinanceForm
                        formData={formData}
                        setFormData={setFormData}
                        fetchOrdersData={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                    />
                </div>
                <div className="space-y-1.5 text-[10px] font-black uppercase tracking-widest text-[#94A3B8] pt-2 border-t border-slate-100">
                    <label className="pl-1">Rute Perjalanan & Keterangan</label>
                    <textarea
                        value={formData.routeNotes}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                routeNotes: e.target.value,
                            })
                        }
                        rows={3}
                        className="w-full p-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none text-xs leading-relaxed"
                    />
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-100 text-[10px] font-black uppercase tracking-widest">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3.5 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3.5 bg-[#5346F1] hover:bg-[#4338CA] text-white rounded-xl shadow-lg shadow-indigo-500/10 text-center transition-all"
                    >
                        Simpan Detail Pesanan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModalOrder;
