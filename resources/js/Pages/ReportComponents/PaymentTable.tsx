import React from "react";
import { Printer } from "lucide-react";

interface PaymentTableProps {
    reportData: any[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({ reportData }) => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] overflow-hidden text-left mt-2">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                            <th className="py-4 px-6">
                                Pelanggan & Jatuh Tempo
                            </th>
                            <th className="py-4 px-6">Total Sewa</th>
                            <th className="py-4 px-6">Dibayar</th>
                            <th className="py-4 px-6">Sisa Piutang</th>
                            <th className="py-4 px-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-600">
                        {reportData.map((r, i) => (
                            <tr
                                key={i}
                                className="hover:bg-slate-50/30 transition-colors"
                            >
                                {/* Kolom 1: Detail Identitas */}
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

                                {/* Kolom 2: Total Sewa */}
                                <td className="py-5 px-6 font-bold text-slate-700">
                                    Rp {r.totalPrice.toLocaleString("id-ID")}
                                </td>

                                {/* Kolom 3: Angka Hijau Dibayar */}
                                <td className="py-5 px-6 font-bold text-emerald-500">
                                    Rp {r.paidAmount.toLocaleString("id-ID")}
                                </td>

                                {/* Kolom 4: Angka Merah Sisa Piutang */}
                                <td
                                    className={`py-5 px-6 font-bold ${r.totalPrice - r.paidAmount > 0 ? "text-red-500" : "text-slate-400"}`}
                                >
                                    Rp{" "}
                                    {(
                                        r.totalPrice - r.paidAmount
                                    ).toLocaleString("id-ID")}
                                </td>

                                {/* Kolom 5: Tombol Riwayat & Cetak Hitam */}
                                <td className="py-5 px-6 text-center">
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            onClick={() =>
                                                alert(
                                                    `Membuka histori log bayar ${r.id}`,
                                                )
                                            }
                                            type="button"
                                            className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                                        >
                                            Riwayat
                                        </button>
                                        <button
                                            type="button"
                                            className="w-8 h-8 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-sm shadow-slate-950/10 transition-colors"
                                        >
                                            <Printer
                                                size={12}
                                                strokeWidth={2.5}
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
    );
};

export default PaymentTable;
