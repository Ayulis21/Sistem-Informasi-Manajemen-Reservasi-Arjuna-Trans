import React from "react";
import { Calendar, FileText, Upload } from "lucide-react";

interface OrderFinanceFormProps {
    formData: any;
    setFormData: (data: any) => void;
}

const OrderFinanceForm: React.FC<OrderFinanceFormProps> = ({
    formData,
    setFormData,
}) => {
    // Kalkulasi nilai sisa piutang secara dinamis
    const sisaTagihan = formData.totalPrice - formData.paidAmount;

    return (
        <div className="space-y-4 text-[10px] font-black uppercase tracking-widest text-[#94A3B8] text-left">
            <h4 className="flex items-center gap-1.5 text-slate-500 border-b border-slate-50 pb-1.5">
                <FileText size={13} /> Keuangan
            </h4>

            <div className="space-y-1">
                <label className="pl-1">Total Sewa (Rp)</label>
                <input
                    type="number"
                    value={formData.totalPrice}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            totalPrice: Number(e.target.value),
                        })
                    }
                    className="w-full p-3 bg-indigo-50/50 text-[#5346F1] border-none rounded-xl font-black text-xs outline-none"
                />
            </div>

            <div className="space-y-1">
                <label className="pl-1">Jatuh Tempo</label>
                <input
                    type="text"
                    value={formData.dueDate}
                    onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none"
                />
            </div>

            {/* Input Termin Pembayaran DP / Pelunasan */}
            <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-[8px] text-slate-400">
                        Pembayaran
                    </span>
                    <span className="text-[7px] text-indigo-600 font-bold cursor-pointer">
                        UPDATE +
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <select className="p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer">
                        <option>DP</option>
                        <option>Pelunasan</option>
                    </select>
                    <button
                        type="button"
                        className="flex-1 py-2 bg-[#5346F1] text-white text-[8px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-1"
                    >
                        <Upload size={10} /> Upload Bukti
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[8px]">
                    <div className="space-y-1">
                        <label>Tanggal Bayar</label>
                        <input
                            type="text"
                            defaultValue="06/22/2026"
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700"
                        />
                    </div>
                    <div className="space-y-1">
                        <label>Nominal (Rp)</label>
                        <input
                            type="number"
                            value={formData.paidAmount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    paidAmount: Number(e.target.value),
                                })
                            }
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700"
                        />
                    </div>
                </div>
            </div>

            {/*  BOKS HITAM GENDUT SISA TAGIHAN (100% KEMBAR PERSIS GAMBAR ANDA) */}
            <div className="bg-slate-950 rounded-2xl p-4 flex items-center justify-between text-white shadow-md shadow-slate-900/10">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                    Sisa:
                </span>
                <span className="text-sm font-black text-red-400">
                    Rp {sisaTagihan.toLocaleString("id-ID")}
                </span>
            </div>
        </div>
    );
};

export default OrderFinanceForm;
