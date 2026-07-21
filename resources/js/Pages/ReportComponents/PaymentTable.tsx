import React from "react";
import { Printer } from "lucide-react";

interface PaymentTableProps {
    reportData: any[];
    onOpenHistory: (row: any) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({
    reportData,
    onOpenHistory,
}) => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left mt-2">
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
                        {reportData.map((r: any, i: number) => {
                            const sisa = r.totalPrice - r.paidAmount;
                            const isLunas = sisa <= 0;

                            return (
                                <tr
                                    key={i}
                                    className="hover:bg-slate-50/30 transition-colors"
                                >
                                    <td className="py-5 px-6">
                                        <h4 className="text-sm font-black text-slate-800 uppercase leading-none">
                                            {r.customerName}
                                        </h4>
                                        <p className="text-[9px] font-black text-red-500 mt-2">
                                            DUE: {r.dueDate}
                                        </p>
                                    </td>
                                    <td className="py-5 px-6 font-bold">
                                        Rp{" "}
                                        {Number(r.totalPrice).toLocaleString()}
                                    </td>
                                    <td className="py-5 px-6 font-bold text-emerald-600">
                                        Rp{" "}
                                        {Number(r.paidAmount).toLocaleString()}
                                    </td>
                                    <td
                                        className={`py-5 px-6 font-black ${isLunas ? "text-slate-400" : "text-red-600"}`}
                                    >
                                        {isLunas
                                            ? "LUNAS"
                                            : `Rp ${sisa.toLocaleString()}`}
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => onOpenHistory(r)}
                                                className="text-[10px] font-black text-indigo-500 uppercase"
                                            >
                                                Riwayat
                                            </button>
                                            <button className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-sm">
                                                <Printer
                                                    size={12}
                                                    strokeWidth={2.5}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentTable;
