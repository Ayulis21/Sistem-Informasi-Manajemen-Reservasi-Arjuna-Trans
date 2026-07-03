import React from "react";
import { UserCheck, Route, Navigation2 } from "lucide-react";

interface CrewReportProps {
    crewData: any[];
}

const CrewReport: React.FC<CrewReportProps> = ({ crewData }) => {
    return (
        <div className="space-y-3.5 text-left mt-2">
            {crewData.map((c, i) => (
                <div
                    key={i}
                    className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden transition-all hover:border-indigo-100"
                >
                    {/* Sisi Kiri: Profil & Peran Kru */}
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-100/40 shrink-0">
                            <UserCheck size={20} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none">
                                    {c.name}
                                </h4>
                                <span
                                    className={`text-[8px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                                        c.role.includes("SOPIR")
                                            ? "bg-indigo-50 text-indigo-600 border-indigo-100/60"
                                            : "bg-slate-50 text-slate-500 border-slate-200/60"
                                    }`}
                                >
                                    {c.role}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                <Navigation2
                                    size={11}
                                    className="text-slate-300"
                                />
                                <span>
                                    Terakhir:{" "}
                                    <strong className="text-slate-500">
                                        {c.lastRoute}
                                    </strong>
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Sisi Kanan: Hanya Metrik Utama Riil (KM & Total Trips) */}
                    <div className="flex flex-wrap items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t border-slate-50 pt-3 md:pt-0 md:border-none text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {/* Kolom Total Trips */}
                        <div className="text-left md:text-center min-w-[80px]">
                            <p className="text-[8px] mb-0.5">Total Trips</p>
                            <p className="text-sm font-black text-slate-800">
                                {c.trips} × Jalan
                            </p>
                        </div>

                        {/* Kolom Akumulasi KM */}
                        <div className="text-left md:text-right min-w-[100px] border-l border-slate-100 pl-4 md:pl-2">
                            <p className="text-[8px] mb-0.5">Jarak Tempuh</p>
                            <p className="text-sm font-black text-indigo-600 flex items-center gap-1 justify-start md:justify-end">
                                <Route size={13} className="text-indigo-400" />
                                {c.totalKm.toLocaleString("id-ID")} KM
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CrewReport;
