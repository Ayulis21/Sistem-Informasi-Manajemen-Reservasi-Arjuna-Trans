import React from "react";
import { UserCheck, Edit2, Trash2, Award } from "lucide-react";

interface CrewGridProps {
    crewList: any[];
    onEditTrigger: (item: any) => void;
    onDeleteTrigger: (id: number, namaKru: string) => void;
}

const CrewGrid: React.FC<CrewGridProps> = ({
    crewList,
    onEditTrigger,
    onDeleteTrigger,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300 text-left">
            {crewList.map((c, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-[2.5rem] border border-slate-100/90 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-6 space-y-4 flex flex-col justify-between min-h-[220px]"
                >
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-emerald-50 border border-emerald-100/50 rounded-2xl flex items-center justify-center text-emerald-500">
                            <UserCheck size={20} />
                        </div>
                        <div className="flex gap-1.5 text-slate-300">
                            <button
                                type="button"
                                onClick={() => onEditTrigger(c)}
                                className="p-1.5 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors"
                            >
                                <Edit2 size={13} />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onDeleteTrigger(
                                        c.id_kru || (c as any).id,
                                        c.nama_kru || c.name,
                                    )
                                }
                                className="p-1.5 hover:bg-slate-50 hover:text-red-500 rounded-lg transition-colors"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <h4 className="text-base font-black text-slate-800 tracking-tight leading-none">
                            {c.nama_kru || c.name || "Nama Tidak Terdaftar"}
                        </h4>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            {c.peran === "Driver"
                                ? "SOPIR UTAMA (DRIVER)"
                                : c.peran === "Helper"
                                  ? "KONDEKTUR (HELPER)"
                                  : c.role || "KRU"}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 italic">
                            WhatsApp: {c.no_telp || c.phone || "-"}
                        </p>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-400 tracking-wider pt-2 border-t border-slate-50">
                        <Award size={12} className="text-amber-500" />
                        <span>
                            Jam Terbang:{" "}
                            <strong className="text-slate-700">
                                {Number(
                                    c.totalKm || c.total_km || 0,
                                ).toLocaleString()}{" "}
                                KM
                            </strong>
                        </span>
                    </div>

                    <div>
                        <span
                            className={`inline-block px-3 py-1 border rounded-lg text-[8px] font-black uppercase tracking-wider ${
                                c.status === "READY" ||
                                c.status === "Ready" ||
                                c.status_tugas === "Ready" ||
                                c.status_ketersediaan === "Ready"
                                    ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                                    : "bg-amber-50 text-amber-500 border-amber-100"
                            }`}
                        >
                            {c.status_ketersediaan || c.status || "Ready"}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CrewGrid;
