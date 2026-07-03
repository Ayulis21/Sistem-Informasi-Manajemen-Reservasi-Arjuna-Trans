import React from "react";
import { Bus, Edit2, Trash2, Users } from "lucide-react";

interface ArmadaGridProps {
    armadaList: any[];
}

const ArmadaGrid: React.FC<ArmadaGridProps> = ({ armadaList }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300 text-left">
            {armadaList.map((item, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-[2.5rem] border border-slate-100/90 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-6 space-y-4 relative flex flex-col justify-between min-h-[220px]"
                >
                    {/* Baris Atas: Ikon Bus & Tombol Aksi */}
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100/50 rounded-2xl flex items-center justify-center text-[#5346F1]">
                            <Bus size={20} />
                        </div>
                        <div className="flex gap-1.5 text-slate-300">
                            <button
                                type="button"
                                className="p-1.5 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors"
                            >
                                <Edit2 size={13} />
                            </button>
                            <button
                                type="button"
                                className="p-1.5 hover:bg-slate-50 hover:text-red-500 rounded-lg transition-colors"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Baris Tengah: Nama & Pelat Nomor */}
                    <div className="space-y-0.5">
                        <h4 className="text-base font-black text-slate-800 tracking-tight leading-snug">
                            {item.name}
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {item.plate}
                        </p>
                    </div>

                    {/* Baris Tag Fasilitas */}
                    <div className="flex flex-wrap gap-1.5 text-[8px] font-black uppercase tracking-wider text-slate-400">
                        {item.facilities.map((fac: string, fIdx: number) => (
                            <span
                                key={fIdx}
                                className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md"
                            >
                                {fac}
                            </span>
                        ))}
                    </div>

                    {/* Baris Informasi Seat & Tipe */}
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-400 tracking-wider pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700">
                            <Users size={12} className="text-slate-400" />
                            <span>{item.seats} Seat</span>
                        </div>
                        <span className="text-[#5346F1]">{item.type}</span>
                    </div>

                    {/* Status Badge Bawah */}
                    <div className="pt-2">
                        <span
                            className={`inline-block px-3 py-1 border rounded-lg text-[8px] font-black uppercase tracking-wider ${
                                item.status === "READY"
                                    ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                                    : "bg-blue-50 text-blue-500 border-blue-100"
                            }`}
                        >
                            {item.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArmadaGrid;
