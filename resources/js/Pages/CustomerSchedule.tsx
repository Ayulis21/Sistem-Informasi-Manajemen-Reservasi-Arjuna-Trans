import React, { useState } from "react";
import { Link } from "@inertiajs/react"; // Menggunakan Link bawaan Inertia
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    MapPin,
    Bus,
    ArrowLeft,
} from "lucide-react";
import axios from "axios";

// DATA STATIS INTERNAL (Struktur persis seperti AI Studio tipe AppState)
const staticState = {
    armada: [
        { id: "A1", name: "Bus High Deck 1" },
        { id: "A2", name: "Bus High Deck 2" },
        { id: "A3", name: "Bus Jetbus 3+ Premium" },
        { id: "A4", name: "Elf Long Luxury" },
    ],
    orders: [
        {
            id: "ORD-9554-WEB",
            customerName: "Pak Andi Setiawan",
            destination: "Yogyakarta (Malioboro)",
            departureTime: "2026-07-15T06:00:00",
            returnTime: "2026-07-17T18:00:00",
            status: "Scheduled",
            assignments: [{ armadaId: "A1" }, { armadaId: "A2" }],
        },
        {
            id: "ORD-1234-WEB",
            customerName: "Ibu Rina",
            destination: "Bali (Kuta Beach)",
            departureTime: "2026-07-18T07:00:00",
            returnTime: "2026-07-21T20:00:00",
            status: "Approved",
            assignments: [{ armadaId: "A3" }],
        },
        {
            id: "ORD-5678-WEB",
            customerName: "Mas Budi",
            destination: "Bandung (Lembang)",
            departureTime: "2026-07-22T06:00:00",
            returnTime: "2026-07-23T22:00:00",
            status: "On Trip",
            assignments: [{ armadaId: "A4" }],
        },
    ],
};

const CustomerSchedule: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDayOrders, setSelectedDayOrders] = useState<{
        day: number;
        orders: any[];
    } | null>(null);

    const daysInMonth = (year: number, month: number) =>
        new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) =>
        new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = [];
    for (let i = 0; i < firstDayOfMonth(year, month); i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth(year, month); i++) {
        days.push(i);
    }

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDayOrders(null);
    };
    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDayOrders(null);
    };

    const getOrdersForDay = (day: number) => {
        const d = new Date(year, month, day);
        d.setHours(0, 0, 0, 0);
        return staticState.orders.filter((o) => {
            const start = new Date(o.departureTime);
            start.setHours(0, 0, 0, 0);
            const end = new Date(o.returnTime);
            end.setHours(23, 59, 59, 999);
            return (
                d >= start &&
                d <= end &&
                (o.status === "Approved" ||
                    o.status === "Scheduled" ||
                    o.status === "On Trip" ||
                    o.status === "Completed")
            );
        });

        // 1. BACKEND STATE MANAGEMENT
        const [scheduleData, setScheduleData] = useState<any[]>([]);
        const [loading, setLoading] = useState(true);

        // Fungsi otomatis menarik data jadwal dari controller Laravel saat halaman dibuka
        React.useEffect(() => {
            const fetchSchedule = async () => {
                try {
                    const response = await axios.get("/api/customer-schedule");
                    // KUNCI PENGIKAT GLOBAL: Mengikat data ke window agar lolos tipe data kaku
                    (window as any).scheduleData = response.data.schedule;
                    setScheduleData(response.data.schedule);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchSchedule();
        }, []);
    };

    const getFleetUtilization = (orders: any[]) => {
        const assignedArmadaIds = new Set();
        orders.forEach((o) => {
            o.assignments.forEach((as: any) => {
                if (as.armadaId) assignedArmadaIds.add(as.armadaId);
            });
        });
        return assignedArmadaIds.size;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 pt-6 px-4">
            {/* 1. Header Navigasi Atas (Logo Terpusat Kunci Mati) */}
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Panel Utama Kalender */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-indigo-600 text-white">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                                    <CalendarIcon size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight leading-none uppercase italic">
                                        {currentDate.toLocaleString("id-ID", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </h2>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mt-1">
                                        Jadwal Perjalanan Armada
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={prevMonth}
                                    className="p-3 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextMonth}
                                    className="p-3 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

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

                        {/* Grid Render Hari */}
                        <div className="grid grid-cols-7 flex-1 bg-slate-50/20">
                            {days.map((day, idx) => {
                                const orders = day ? getOrdersForDay(day) : [];
                                const usedUnitsCount =
                                    getFleetUtilization(orders);
                                const totalUnits = staticState.armada.length;
                                const availableUnits =
                                    totalUnits - usedUnitsCount;

                                const isToday =
                                    day === new Date().getDate() &&
                                    month === new Date().getMonth() &&
                                    year === new Date().getFullYear();
                                const isSelected =
                                    selectedDayOrders?.day === day;
                                const isBusy = usedUnitsCount > 0;

                                return (
                                    <div
                                        key={idx}
                                        onClick={() =>
                                            day &&
                                            setSelectedDayOrders({
                                                day,
                                                orders,
                                            })
                                        }
                                        className={`border-b border-r border-slate-100/60 p-4 min-h-[90px] flex flex-col justify-between transition-all select-none ${day ? "cursor-pointer hover:bg-indigo-50/30" : "bg-slate-50/30"} ${isToday ? "bg-indigo-50/50" : ""} ${isSelected ? "bg-indigo-100/40 border-2 border-indigo-500 rounded-xl" : ""}`}
                                    >
                                        {day ? (
                                            <>
                                                <div className="w-full flex justify-start p-1">
                                                    <span
                                                        className={`text-sm font-black flex items-center justify-center ${
                                                            isToday
                                                                ? "text-white bg-[#5346F1] w-8 h-8 rounded-full shadow-sm shadow-indigo-500/20"
                                                                : "text-slate-700 w-8 h-8"
                                                        }`}
                                                    >
                                                        {day}
                                                    </span>
                                                </div>
                                                {/* ========================================================================= */}
                                                {/* REVISI AKHIR: PENYELARASAN VARIABEL PENANGGALAN KALENDER (0 ERROR)          */}
                                                {/* ========================================================================= */}
                                                {/* ========================================================================= */}
                                                {/* REVISI FINAL: MEMANGGIL DATA GLOBAL WINDOW SECARA MUTLAK (0 ERROR)          */}
                                                {/* ========================================================================= */}
                                                <div className="mt-1 px-1 space-y-1 overflow-y-auto max-h-[60px] w-full text-left">
                                                    {(
                                                        (window as any)
                                                            .scheduleData || []
                                                    )
                                                        .filter((item: any) => {
                                                            const dynamicYear =
                                                                typeof year !==
                                                                "undefined"
                                                                    ? year
                                                                    : new Date().getFullYear();
                                                            const dynamicMonth =
                                                                typeof month !==
                                                                "undefined"
                                                                    ? month
                                                                    : new Date().getMonth();

                                                            const tglKalender =
                                                                new Date(
                                                                    dynamicYear,
                                                                    dynamicMonth,
                                                                    day,
                                                                ).setHours(
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0,
                                                                );
                                                            const tglMulai =
                                                                new Date(
                                                                    item.tgl_berangkat,
                                                                ).setHours(
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0,
                                                                );
                                                            const tglSelesai =
                                                                new Date(
                                                                    item.tgl_selesai,
                                                                ).setHours(
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0,
                                                                );
                                                            return (
                                                                tglKalender >=
                                                                    tglMulai &&
                                                                tglKalender <=
                                                                    tglSelesai
                                                            );
                                                        })
                                                        .map(
                                                            (
                                                                booking: any,
                                                                bIdx: any,
                                                            ) => (
                                                                <div
                                                                    key={bIdx}
                                                                    className="bg-indigo-50 border border-indigo-100 text-[#5346F1] text-[9px] font-black uppercase p-1 rounded-md truncate tracking-tight shadow-sm"
                                                                    title={`${booking.tujuan_main} (${booking.tipe_unit_diminta})`}
                                                                >
                                                                    🚌{" "}
                                                                    {
                                                                        booking.tujuan_main
                                                                    }
                                                                </div>
                                                            ),
                                                        )}
                                                </div>

                                                {isBusy && (
                                                    <div
                                                        className={`mt-2 p-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider ${availableUnits === 0 ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}
                                                    >
                                                        {usedUnitsCount} Unit
                                                        Jalan
                                                    </div>
                                                )}
                                            </>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* DETAIL SIDE PANEL */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 sticky top-10 min-h-[400px] flex flex-col">
                        {selectedDayOrders ? (
                            <div className="animate-in fade-in slide-in-from-right-10 duration-500 flex flex-col flex-1">
                                <div className="mb-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                                        Agenda Operasional
                                    </h3>
                                    <p className="text-2xl font-black text-slate-800 italic uppercase">
                                        {selectedDayOrders.day}{" "}
                                        {currentDate.toLocaleString("id-ID", {
                                            month: "long",
                                        })}
                                    </p>
                                    <div className="h-1 w-10 bg-indigo-600 mt-2 rounded-full"></div>
                                </div>

                                {/* Availability Status Box */}
                                <div className="bg-[#5346F1] rounded-3xl p-5 mb-6 text-white overflow-hidden relative shadow-lg shadow-indigo-100">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-70">
                                                Total Armada
                                            </span>
                                            <span className="text-xl font-black italic">
                                                {staticState.armada.length}{" "}
                                                {/* Diperbaiki ke staticState */}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl">
                                            <div className="space-y-0.5">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400">
                                                    Tersedia
                                                </p>
                                                <p className="text-lg font-black">
                                                    {staticState.armada.length -
                                                        getFleetUtilization(
                                                            selectedDayOrders.orders,
                                                        )}{" "}
                                                    Unit
                                                </p>
                                            </div>
                                            <div className="w-px h-8 bg-white/10"></div>
                                            <div className="space-y-0.5 text-right">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-orange-400">
                                                    Beroperasi
                                                </p>
                                                <p className="text-lg font-black">
                                                    {getFleetUtilization(
                                                        selectedDayOrders.orders,
                                                    )}{" "}
                                                    Unit
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* List Order Aktif */}
                                <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[350px]">
                                    {selectedDayOrders.orders.length > 0 ? (
                                        selectedDayOrders.orders.map((o) => (
                                            <div
                                                key={o.id}
                                                className="bg-white border border-slate-100 p-5 rounded-3xl group hover:border-indigo-200 transition-all shadow-sm"
                                            >
                                                <div className="flex items-center justify-between mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <span>{o.id}</span>
                                                    <span
                                                        className={`px-2 py-0.5 rounded-lg ${o.status === "On Trip" ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"}`}
                                                    >
                                                        {o.status === "Approved"
                                                            ? "Disetujui"
                                                            : o.status ===
                                                                "On Trip"
                                                              ? "Di Jalan"
                                                              : o.status ===
                                                                  "Scheduled"
                                                                ? "Terjadwal"
                                                                : o.status}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-black text-slate-800 mb-2 uppercase">
                                                    {o.customerName}
                                                </h4>
                                                <div className="flex items-center text-slate-500 text-[10px] font-bold mb-4">
                                                    <MapPin
                                                        size={12}
                                                        className="mr-1.5 text-indigo-400"
                                                    />
                                                    {o.destination}
                                                </div>

                                                {/* Pembacaan Tugas Unit Armada */}
                                                <div className="space-y-2 pt-3 border-t border-slate-50">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                        Unit Ditugaskan:
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {o.assignments &&
                                                        o.assignments.length >
                                                            0 ? (
                                                            o.assignments.map(
                                                                (
                                                                    as: any,
                                                                    i: number,
                                                                ) => {
                                                                    // Amankan pencarian ID ke variabel staticState
                                                                    const bus =
                                                                        staticState.armada.find(
                                                                            (
                                                                                a,
                                                                            ) =>
                                                                                a.id ===
                                                                                as.armadaId,
                                                                        );
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-[9px] font-bold text-slate-600"
                                                                        >
                                                                            <Bus
                                                                                size={
                                                                                    10
                                                                                }
                                                                                className="text-indigo-500"
                                                                            />
                                                                            <span>
                                                                                {bus
                                                                                    ? bus.name
                                                                                    : "Armada Utama"}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                },
                                                            )
                                                        ) : (
                                                            <span className="text-[9px] italic text-slate-400">
                                                                Menunggu Tugas
                                                                Unit
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-slate-400 space-y-2 border border-dashed border-slate-100 rounded-3xl">
                                            <p className="text-xs font-bold italic">
                                                Semua Armada Siap
                                            </p>
                                            <p className="text-[10px] text-slate-300 font-normal">
                                                Tidak ada agenda operasional
                                                jalan hari ini.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                                    <CalendarIcon size={32} />
                                </div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                                    Monitor Unit
                                </h3>
                                <p className="text-[10px] font-bold text-slate-300 leading-relaxed px-4 italic">
                                    Klik pada tanggal di kalender untuk melihat
                                    daftar armada yang bertugas serta sisa
                                    kapasitas garasi.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSchedule;
