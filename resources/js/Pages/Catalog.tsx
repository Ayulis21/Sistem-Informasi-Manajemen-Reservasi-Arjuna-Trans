import React from "react";
import { Link } from "react-router-dom";
import { AppState } from "../types";
import { Bus, Users, Star, CheckCircle2, ArrowLeft } from "lucide-react";

const Catalog: React.FC<{ state: AppState }> = ({ state }) => {
    const activeFleet = state.armada.filter((a) => a.status !== "Maintenance");
    const isAdminRoute = window.location.hash.includes("/admin");

    return (
        <div
            className={`space-y-8 animate-in fade-in duration-500 pb-20 ${!isAdminRoute ? "max-w-6xl mx-auto" : ""}`}
        >
            {!isAdminRoute && (
                <div className="flex items-center justify-between px-6 py-6 border-b border-slate-50 mb-8 sticky top-0 bg-white/80 backdrop-blur-md z-30">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">
                            Kembali
                        </span>
                    </Link>
                    <span className="text-2xl font-black text-slate-800 italic">
                        ArjunaTrans
                    </span>
                    <div className="w-10"></div>
                </div>
            )}

            <div className="text-center max-w-2xl mx-auto space-y-4 px-6">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none">
                    Pilihan Armada Kami
                </h2>
                <p className="text-slate-500 italic">
                    Temukan pilihan bus terbaik untuk perjalanan rombongan Anda
                    dengan fasilitas terlengkap.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeFleet.map((bus) => (
                    <div
                        key={bus.id}
                        className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col"
                    >
                        <div className="h-56 bg-slate-200 relative overflow-hidden">
                            <img
                                src={`https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800`}
                                alt={bus.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-white shadow-sm">
                                    {bus.type}
                                </span>
                            </div>
                            {bus.status === "On Trip" && (
                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                                    <span className="bg-amber-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs animate-pulse shadow-xl">
                                        Sedang Beroperasi
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-black text-slate-800 leading-tight">
                                        {bus.name}
                                    </h3>
                                    <div className="flex items-center text-amber-500 font-bold">
                                        <Star
                                            size={16}
                                            fill="currentColor"
                                            className="mr-1"
                                        />
                                        <span className="text-sm">4.9</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-slate-400 text-xs font-bold mb-6 uppercase tracking-widest">
                                    <Bus size={14} className="mr-2" />
                                    {bus.plateNumber}
                                </div>

                                <div className="flex items-center space-x-6 pb-6 border-b border-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                                            Kapasitas
                                        </span>
                                        <div className="flex items-center text-slate-800 font-black text-lg">
                                            <Users
                                                size={18}
                                                className="mr-2 text-indigo-500"
                                            />
                                            {bus.capacity} Seat
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                                            Status
                                        </span>
                                        <div
                                            className={`text-xs font-black uppercase tracking-widest ${bus.status === "Ready" ? "text-emerald-500" : "text-amber-500"}`}
                                        >
                                            {bus.status === "Ready"
                                                ? "Siap Dijadwalkan"
                                                : "Dipesan"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                    Fasilitas Utama
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {bus.facilities.map((f, i) => (
                                        <span
                                            key={i}
                                            className="flex items-center bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-slate-100"
                                        >
                                            <CheckCircle2
                                                size={12}
                                                className="mr-1.5 text-indigo-500"
                                            />
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl shadow-xl transition-all hover:bg-indigo-600 hover:shadow-indigo-200 hover:-translate-y-1">
                                Booking Armada Ini
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
