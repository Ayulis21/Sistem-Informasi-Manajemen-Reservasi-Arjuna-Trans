import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    MapPin,
    Bus,
    ArrowLeft,
    Info,
} from "lucide-react";
import axios from "axios";

const CustomerSchedule: React.FC = () => {
    // STATE DATA DARI DATABASE
    const [orders, setOrders] = useState<any[]>([]);
    const [totalArmada, setTotalArmada] = useState(0);
    const [loading, setLoading] = useState(true);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDayOrders, setSelectedDayOrders] = useState<{
        day: number;
        orders: any[];
    } | null>(null);

    // FETCH DATA OTOMATIS
    useEffect(() => {
        axios.get("/api/public-schedule").then((res) => {
            setOrders(res.data.orders);
            setTotalArmada(res.data.totalArmadaCount);
            setLoading(false);
        });
    }, []);

    const daysInMonth = (y: number, m: number) =>
        new Date(y, m + 1, 0).getDate();
    const firstDayOfMonth = (y: number, m: number) =>
        new Date(y, m, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = [];
    for (let i = 0; i < firstDayOfMonth(year, month); i++) days.push(null);
    for (let i = 1; i <= daysInMonth(year, month); i++) days.push(i);

    const getOrdersForDay = (day: number) => {
        const target = new Date(year, month, day);
        target.setHours(0, 0, 0, 0);

        return orders.filter((o) => {
            const start = new Date(o.tgl_berangkat);
            start.setHours(0, 0, 0, 0);
            const end = new Date(o.tgl_selesai);
            end.setHours(23, 59, 59, 999);
            return target >= start && target <= end;
        });
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen font-sans pb-20 text-left select-none animate-in fade-in duration-500 relative">
            <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 relative">
                <div className="flex items-center w-full min-h-[36px]">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-3 text-[10px] font-black uppercase text-[#94A3B8] tracking-widest hover:text-[#5346F1] transition-all no-underline z-10"
                    >
                        <div className="w-9 h-9 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-[#94A3B8] shadow-sm transition-all group-hover:bg-[#5346F1] group-hover:text-white">
                            <ArrowLeft size={14} strokeWidth={3} />
                        </div>
                        <span>Kembali</span>
                    </Link>
                    <span className="absolute left-1/2 -translate-x-1/2 text-base font-black text-slate-700 italic tracking-tight pointer-events-none whitespace-nowrap">
                        ArjunaTrans
                    </span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto pt-10 px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* PANEL KALENDER */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                            {/* Toolbar Kalender */}
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-[#5346F1] text-white">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                                        <CalendarIcon size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight leading-none uppercase italic">
                                            {currentDate.toLocaleString(
                                                "id-ID",
                                                {
                                                    month: "long",
                                                    year: "numeric",
                                                },
                                            )}
                                        </h2>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mt-1">
                                            Jadwal Keberangkatan Bus
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() =>
                                            setCurrentDate(
                                                new Date(year, month - 1, 1),
                                            )
                                        }
                                        className="p-3 hover:bg-white/10 rounded-xl transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setCurrentDate(
                                                new Date(year, month + 1, 1),
                                            )
                                        }
                                        className="p-3 hover:bg-white/10 rounded-xl transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Nama Hari */}
                            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                                {[
                                    "Min",
                                    "Sen",
                                    "Sel",
                                    "Rab",
                                    "Kam",
                                    "Jum",
                                    "Sab",
                                ].map((d) => (
                                    <div
                                        key={d}
                                        className="py-4 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest"
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Grid Angka */}
                            <div className="grid grid-cols-7 flex-1 bg-slate-50/20">
                                {days.map((day, idx) => {
                                    const dayOrders = day
                                        ? getOrdersForDay(day)
                                        : [];
                                    const isBusy = dayOrders.length > 0;
                                    const isToday =
                                        day === new Date().getDate() &&
                                        month === new Date().getMonth() &&
                                        year === new Date().getFullYear();

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() =>
                                                day &&
                                                setSelectedDayOrders({
                                                    day,
                                                    orders: dayOrders,
                                                })
                                            }
                                            className={`border-b border-r border-slate-100/60 p-4 min-h-[100px] flex flex-col justify-between transition-all ${day ? "cursor-pointer hover:bg-indigo-50/30" : "bg-slate-50/30"} ${isToday ? "bg-indigo-50/50" : ""}`}
                                        >
                                            {day && (
                                                <>
                                                    <span
                                                        className={`text-sm font-black flex items-center justify-center w-8 h-8 rounded-full ${isToday ? "text-white bg-[#5346F1] shadow-md" : "text-slate-700"}`}
                                                    >
                                                        {day}
                                                    </span>
                                                    {isBusy && (
                                                        <div className="mt-2 p-1 bg-amber-50 border border-amber-100 text-amber-600 text-[8px] font-black uppercase text-center rounded-lg">
                                                            {dayOrders.length}{" "}
                                                            Pesanan
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* PANEL DETAIL (KANAN) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 sticky top-10 min-h-[500px]">
                            {selectedDayOrders ? (
                                <div className="animate-in fade-in slide-in-from-right-10 duration-500">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                        Operasional Hari Ini
                                    </h3>
                                    <p className="text-2xl font-black text-slate-800 uppercase italic">
                                        {selectedDayOrders.day}{" "}
                                        {currentDate.toLocaleString("id-ID", {
                                            month: "long",
                                        })}
                                    </p>
                                    <div className="h-1 w-10 bg-indigo-600 mt-2 mb-8 rounded-full"></div>

                                    <div className="space-y-4">
                                        {selectedDayOrders.orders.length > 0 ? (
                                            selectedDayOrders.orders.map(
                                                (o) => (
                                                    <div
                                                        key={o.id_pesanan}
                                                        className="bg-slate-50 p-4 rounded-3xl border border-slate-100"
                                                    >
                                                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">
                                                            {o.id_pesanan}
                                                        </p>
                                                        <h4 className="text-xs font-black text-slate-800 uppercase mb-3">
                                                            {o.nama_pemesan}
                                                        </h4>
                                                        <div className="flex items-center text-[10px] font-bold text-slate-500 mb-4">
                                                            <MapPin
                                                                size={12}
                                                                className="mr-1.5 text-indigo-400"
                                                            />{" "}
                                                            {o.tujuan_main}
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200">
                                                            {o.assignments.map(
                                                                (
                                                                    as: any,
                                                                    i: number,
                                                                ) => (
                                                                    <span
                                                                        key={i}
                                                                        className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-[8px] font-black text-slate-500 flex items-center gap-1"
                                                                    >
                                                                        <Bus
                                                                            size={
                                                                                10
                                                                            }
                                                                        />{" "}
                                                                        {as.type ||
                                                                            "Bus"}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <p className="text-xs italic text-slate-400">
                                                Pilih tanggal untuk melihat
                                                detail perjalanan.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                                    <CalendarIcon
                                        size={48}
                                        className="mb-4 text-slate-300"
                                    />
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                        Pilih Tanggal
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSchedule;
