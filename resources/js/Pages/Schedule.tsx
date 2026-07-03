import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    MapPin,
    Bus,
    Briefcase,
} from "lucide-react";

// 1. DATA STATIS INTERNAL JADWAL (DISAMAKAN 100% DENGAN GAMBAR MOCKUP ANDA)
const staticState = {
    totalFleet: 8,
    orders: [
        {
            id: "ORD10",
            customerName: "GATHERING KOMUNITAS KOPI SEDUH",
            destination: "Lembang Bandung (Farmhouse & Orchid Forest)",
            departureTime: "2026-07-16T06:00:00",
            returnTime: "2026-07-16T22:00:00",
            status: "DISETUJUI",
            day: 16,
            buses: ["HIACE PREMIO LUXURY", "ARMADA LUAR"],
        },
        {
            id: "ORD_X1",
            customerName: "Rombongan Ziarah",
            destination: "Wali Songo",
            departureTime: "2026-07-02T06:00:00",
            returnTime: "2026-07-04T22:00:00",
            status: "DISETUJUI",
            day: 2,
            buses: ["JETBUS 5 PLUS SUPER HIGH DECK"],
        },
        {
            id: "ORD_X2",
            customerName: "Rombongan Wali",
            destination: "Wali Songo",
            departureTime: "2026-07-03T06:00:00",
            returnTime: "2026-07-04T22:00:00",
            status: "DISETUJUI",
            day: 3,
            buses: ["JETBUS 5 PLUS SUPER HIGH DECK"],
        },
        {
            id: "ORD_X3",
            customerName: "Rombongan Nikah",
            destination: "Solo Gedung Saba",
            departureTime: "2026-07-04T06:00:00",
            returnTime: "2026-07-04T22:00:00",
            status: "DISETUJUI",
            day: 4,
            buses: ["JETBUS 5 PLUS SUPER HIGH DECK"],
        },
        {
            id: "ORD_X4",
            customerName: "Tour Wali",
            destination: "Muria",
            departureTime: "2026-07-05T06:00:00",
            returnTime: "2026-07-06T22:00:00",
            status: "DISETUJUI",
            day: 5,
            buses: ["ARMADA LUAR", "ARMADA LUAR"],
        },
        {
            id: "ORD_X5",
            customerName: "Tour Wali",
            destination: "Muria",
            departureTime: "2026-07-06T06:00:00",
            returnTime: "2026-07-06T22:00:00",
            status: "DISETUJUI",
            day: 6,
            buses: ["ARMADA LUAR", "ARMADA LUAR"],
        },
        {
            id: "ORD_X6",
            customerName: "Study Tour",
            destination: "Ancol",
            departureTime: "2026-07-10T06:00:00",
            returnTime: "2026-07-12T22:00:00",
            status: "DISETUJUI",
            day: 10,
            buses: ["JETBUS 3 HDD EXECUTIVE"],
        },
        {
            id: "ORD_X7",
            customerName: "Study Tour",
            destination: "Ancol",
            departureTime: "2026-07-11T06:00:00",
            returnTime: "2026-07-12T22:00:00",
            status: "DISETUJUI",
            day: 11,
            buses: ["JETBUS 3 HDD EXECUTIVE"],
        },
        {
            id: "ORD_X8",
            customerName: "Study Tour",
            destination: "Ancol",
            departureTime: "2026-07-12T06:00:00",
            returnTime: "2026-07-12T22:00:00",
            status: "DISETUJUI",
            day: 12,
            buses: ["JETBUS 3 HDD EXECUTIVE"],
        },
        {
            id: "ORD_X9",
            customerName: "Family Trip",
            destination: "Malang Batu",
            departureTime: "2026-07-15T06:00:00",
            returnTime: "2026-07-16T22:00:00",
            status: "DISETUJUI",
            day: 15,
            buses: ["HIACE PREMIO LUXURY", "ARMADA LUAR"],
        },
    ],
};

const Schedule: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Mengunci ke Juli 2026 sesuai mockup
    const [selectedDay, setSelectedDay] = useState<number>(16); // Default mengunci ke tanggal 16 Juli

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const getOrdersForDay = (day: number) => {
        return staticState.orders.filter((o) => o.day === day);
    };

    const selectedOrders = staticState.orders.filter(
        (o) => o.day === selectedDay,
    );
    const activeBusesCount =
        selectedOrders.length > 0 ? selectedOrders[0].buses.length : 0;

    return (
        <AdminLayout>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start text-left">
                {/* ========================================================================= */}
                {/* 1. KOTAK UTAMA GRID KALENDER JALAN RINGKAS (3 KOLOM DARI 4)               */}
                {/* ========================================================================= */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col min-h-[640px]">
                        {/* Header Biru Ungu */}
                        <div className="p-6 md:p-7 border-b border-slate-50 flex items-center justify-between bg-[#5346F1] text-white">
                            <div className="flex items-center space-x-4">
                                <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                                    <CalendarIcon size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight leading-none uppercase italic">
                                        JULI 2026
                                    </h2>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mt-1">
                                        JADWAL PERJALANAN ARMADA
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    type="button"
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Nama Hari */}
                        <div className="grid grid-cols-7 border-b border-slate-100 bg-white font-black text-[9px] uppercase tracking-widest text-slate-400 text-center py-4">
                            <div>Min</div>
                            <div>Sen</div>
                            <div>Sel</div>
                            <div>Rab</div>
                            <div>Kam</div>
                            <div>Jum</div>
                            <div>Sab</div>
                        </div>

                        {/* Grid Render Angka Tanggal Konten Bus */}
                        <div className="grid grid-cols-7 flex-1 bg-slate-50/20">
                            {days.map((day, idx) => {
                                const ordersForDay = day
                                    ? getOrdersForDay(day)
                                    : [];
                                const hasOrders = ordersForDay.length > 0;
                                const isSelected = selectedDay === day;

                                return (
                                    <div
                                        key={idx}
                                        onClick={() =>
                                            day && setSelectedDay(day)
                                        }
                                        className={`border-b border-r border-slate-100/70 p-2.5 min-h-[105px] flex flex-col justify-between transition-all relative select-none ${
                                            day
                                                ? "cursor-pointer hover:bg-indigo-50/20 bg-white"
                                                : "bg-slate-50/40"
                                        } ${isSelected ? "border-2 border-[#5346F1] rounded-xl z-10 shadow-sm bg-indigo-50/10" : ""}`}
                                    >
                                        {day ? (
                                            <>
                                                {/* BARIS HITUNGAN MANDIRI AGAR BEBAS ERROR ISTODAY */}
                                                {(() => {
                                                    const isToday =
                                                        day ===
                                                            new Date().getDate() &&
                                                        month ===
                                                            new Date().getMonth() &&
                                                        year ===
                                                            new Date().getFullYear();
                                                    return (
                                                        <span
                                                            className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full transition-all ${
                                                                isToday
                                                                    ? "bg-[#5346F1] text-white shadow-sm shadow-indigo-500/20"
                                                                    : "text-slate-700"
                                                            }`}
                                                        >
                                                            {day}
                                                        </span>
                                                    );
                                                })()}

                                                {/* Baris Tengah Kotak: Daftar Bus */}
                                                <div className="flex-1 flex flex-col justify-end space-y-0.5 mt-2 mb-2 overflow-hidden">
                                                    {ordersForDay.length > 0 &&
                                                        ordersForDay[0].buses.map(
                                                            (
                                                                busName: string,
                                                                bIdx: number,
                                                            ) => (
                                                                <p
                                                                    key={bIdx}
                                                                    className="text-[7px] font-black text-slate-400 uppercase tracking-tight truncate pl-1 bg-slate-50/50 rounded-sm py-0.5"
                                                                >
                                                                    {busName}
                                                                </p>
                                                            ),
                                                        )}
                                                </div>

                                                {/* Baris Dasar Kotak: Garis Hijau Neon Penanda Jadwal */}
                                                {hasOrders && (
                                                    <div className="h-0.5 w-4 bg-emerald-400 rounded-full mx-1"></div>
                                                )}
                                            </>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* 2. SISI KANAN: PANEL MONITOR TUGAS & KRU DETIL (1 KOLOM DARI 4)          */}
                {/* ========================================================================= */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 min-h-[500px] flex flex-col space-y-5">
                        {/* Header Atas Panel Kanan */}
                        <div>
                            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                Agenda Operasional
                            </h3>
                            <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                                {selectedDay} JULI
                            </p>
                            <div className="h-0.5 w-10 bg-indigo-600 mt-2 rounded-full"></div>
                        </div>

                        {/* Kotak Biru Statistik Kapasitas Garasi */}
                        <div className="bg-[#5346F1] rounded-3xl p-5 text-white relative overflow-hidden shadow-lg shadow-indigo-100/30">
                            <div className="absolute top-0 right-0 w-20 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest opacity-80">
                                    <span>Total Armada</span>
                                    <span className="text-lg italic font-black">
                                        {staticState.totalFleet}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-center bg-white/5 p-2.5 rounded-2xl border border-white/10 text-white">
                                    <div className="border-r border-white/10 pr-1">
                                        <p className="text-[8px] font-black uppercase tracking-wider text-emerald-400">
                                            Tersedia
                                        </p>
                                        <p className="text-sm font-black">
                                            {staticState.totalFleet -
                                                activeBusesCount}{" "}
                                            Unit
                                        </p>
                                    </div>
                                    <div className="pl-1">
                                        <p className="text-[8px] font-black uppercase tracking-wider text-amber-400">
                                            Beroperasi
                                        </p>
                                        <p className="text-sm font-black">
                                            {activeBusesCount} Unit
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detail Manajerial Kontrak Jalan */}
                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
                            {selectedOrders.length > 0 ? (
                                selectedOrders.map((o) => (
                                    <div
                                        key={o.id}
                                        className="space-y-4 text-xs font-bold text-slate-600 animate-in fade-in duration-300"
                                    >
                                        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                                            <span className="text-[9px] font-black text-slate-400 tracking-widest">
                                                {o.id}
                                            </span>
                                            <span className="text-[8px] font-black bg-emerald-50 text-emerald-500 px-2 py-0.5 border border-emerald-100 rounded-md uppercase tracking-wider">
                                                {o.status}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black text-slate-800 leading-tight tracking-tight uppercase">
                                                {o.customerName}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 font-medium flex items-start gap-1 leading-relaxed mt-1">
                                                <MapPin
                                                    size={12}
                                                    className="text-indigo-500 shrink-0 mt-0.5"
                                                />
                                                <span>{o.destination}</span>
                                            </p>
                                        </div>

                                        {/* Daftar Tugasan Unit */}
                                        <div className="space-y-2 pt-2 border-t border-slate-50">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                Unit Ditugaskan:
                                            </p>
                                            <div className="space-y-1.5 text-[9px] font-black uppercase tracking-wider">
                                                {o.buses.map(
                                                    (busName, bIdx) => (
                                                        <div
                                                            key={bIdx}
                                                            className="flex items-center gap-2 bg-slate-50 border border-slate-100/80 p-2.5 rounded-xl text-slate-700"
                                                        >
                                                            <Bus
                                                                size={12}
                                                                className="text-indigo-500 shrink-0"
                                                            />
                                                            <span className="truncate">
                                                                {busName}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 text-slate-400 space-y-2 border border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center">
                                    <CalendarIcon
                                        size={24}
                                        className="text-slate-200"
                                    />
                                    <p className="text-[10px] font-black uppercase tracking-wider">
                                        Monitor Unit
                                    </p>
                                    <p className="text-[9px] font-normal leading-relaxed text-slate-300 italic px-2">
                                        Klik pada tanggal di kalender untuk
                                        melihat daftar armada yang bertugas
                                        serta sisa kapasitas garasi.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Schedule;
