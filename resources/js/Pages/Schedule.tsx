import React, { useState, useMemo } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    MapPin,
    Bus,
} from "lucide-react";

interface ScheduleProps {
    dbOrders: any[];
    totalFleet: number;
}

const Schedule: React.FC<ScheduleProps> = ({
    dbOrders = [],
    totalFleet = 0,
}) => {
    // 1. STATE MANAGEMENT (Navigasi Tanggal)
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number>(
        new Date().getDate(),
    );

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate
        .toLocaleString("id-ID", { month: "long" })
        .toUpperCase();

    // 2. LOGIKA GENERATE KALENDER
    const { days, firstDayOfMonth } = useMemo(() => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const arr = [];
        for (let i = 0; i < firstDay; i++) arr.push(null);
        for (let i = 1; i <= daysInMonth; i++) arr.push(i);
        return { days: arr, firstDayOfMonth: firstDay };
    }, [year, month]);

    // 3. LOGIKA FILTER PESANAN PER HARI (Support Multi-Day)
    const getOrdersForDay = (day: number) => {
        return dbOrders.filter((o) => {
            const dateToCheck = new Date(year, month, day).getTime();
            const start = new Date(o.tgl_berangkat.substring(0, 10)).getTime();
            const end = new Date(o.tgl_selesai.substring(0, 10)).getTime();
            return dateToCheck >= start && dateToCheck <= end;
        });
    };

    const selectedOrders = getOrdersForDay(selectedDay);

    // Hitung armada yang jalan di hari yang dipilih
    const activeBusesCount = selectedOrders.reduce(
        (sum, o) => sum + (o.buses?.length || 0),
        0,
    );

    const changeMonth = (offset: number) => {
        setViewDate(new Date(year, month + offset, 1));
        setSelectedDay(1);
    };

    return (
        <AdminLayout>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start text-left">
                {/* --- BAGIAN KIRI: KALENDER --- */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[650px]">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-[#5346F1] text-white">
                            <div className="flex items-center space-x-4">
                                <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <CalendarIcon size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black italic">
                                        {monthName} {year}
                                    </h2>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">
                                        Jadwal Perjalanan Armada
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => changeMonth(-1)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => changeMonth(1)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 border-b border-slate-100 bg-white font-black text-[9px] uppercase tracking-widest text-slate-400 text-center py-4">
                            {[
                                "Min",
                                "Sen",
                                "Sel",
                                "Rab",
                                "Kam",
                                "Jum",
                                "Sab",
                            ].map((h) => (
                                <div key={h}>{h}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 flex-1 bg-slate-50/20">
                            {days.map((day, idx) => {
                                const orders = day ? getOrdersForDay(day) : [];
                                const isSelected = selectedDay === day;
                                const isToday =
                                    day === new Date().getDate() &&
                                    month === new Date().getMonth() &&
                                    year === new Date().getFullYear();

                                return (
                                    <div
                                        key={idx}
                                        onClick={() =>
                                            day && setSelectedDay(day)
                                        }
                                        className={`border-b border-r border-slate-100/70 p-2 min-h-[110px] flex flex-col transition-all relative ${day ? "cursor-pointer hover:bg-indigo-50/30 bg-white" : "bg-slate-50/40"} ${isSelected ? "ring-2 ring-inset ring-[#5346F1] bg-indigo-50/10 z-10" : ""}`}
                                    >
                                        {day && (
                                            <>
                                                <span
                                                    className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-[#5346F1] text-white" : "text-slate-700"}`}
                                                >
                                                    {day}
                                                </span>
                                                <div className="flex-1 flex flex-col justify-end space-y-0.5 mt-2 mb-2 overflow-hidden">
                                                    {orders
                                                        .slice(0, 3)
                                                        .map((o, bIdx) => (
                                                            <p
                                                                key={bIdx}
                                                                className="text-[7px] font-black text-slate-400 uppercase truncate pl-1 bg-slate-50 rounded-sm py-0.5 border-l-2 border-indigo-400"
                                                            >
                                                                {o.nama_pemesan}
                                                            </p>
                                                        ))}
                                                    {orders.length > 3 && (
                                                        <p className="text-[6px] font-black text-indigo-400">
                                                            +{orders.length - 3}{" "}
                                                            LAINNYA
                                                        </p>
                                                    )}
                                                </div>
                                                {orders.length > 0 && (
                                                    <div className="h-1 w-4 bg-emerald-400 rounded-full mx-1"></div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN KANAN: PANEL MONITOR --- */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 flex flex-col space-y-5 h-full">
                        <div>
                            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Agenda Operasional
                            </h3>
                            <p className="text-2xl font-black text-slate-800 uppercase">
                                {selectedDay} {monthName}
                            </p>
                            <div className="h-0.5 w-10 bg-indigo-600 mt-2 rounded-full"></div>
                        </div>

                        <div className="bg-[#5346F1] rounded-3xl p-5 text-white shadow-lg shadow-indigo-100/30">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase opacity-80 mb-4">
                                <span>Kapasitas Garasi</span>
                                <span className="text-lg italic">
                                    {totalFleet} Unit
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center bg-white/10 p-3 rounded-2xl border border-white/10">
                                <div className="border-r border-white/10">
                                    <p className="text-[8px] font-black text-emerald-400">
                                        READY
                                    </p>
                                    <p className="text-sm font-black">
                                        {totalFleet - activeBusesCount}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-amber-400">
                                        JALAN
                                    </p>
                                    <p className="text-sm font-black">
                                        {activeBusesCount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] custom-scrollbar pr-1">
                            {selectedOrders.length > 0 ? (
                                selectedOrders.map((o) => (
                                    <div
                                        key={o.id_pesanan}
                                        className="p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] space-y-3"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-[8px] font-black text-slate-400">
                                                #
                                                {o.id_pesanan.substring(
                                                    o.id_pesanan.length - 5,
                                                )}
                                            </span>
                                            <span className="text-[7px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded uppercase">
                                                {o.status_pesanan}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-800 uppercase leading-none">
                                                {o.nama_pemesan}
                                            </h4>
                                            <p className="text-[9px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                                                <MapPin size={10} />{" "}
                                                {o.tujuan_main}
                                            </p>
                                        </div>
                                        <div className="pt-2 border-t border-slate-200">
                                            <p className="text-[7px] font-black text-slate-400 uppercase mb-1.5">
                                                Armada:
                                            </p>
                                            <div className="space-y-1">
                                                {o.buses?.map(
                                                    (b: string, i: number) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center gap-2 text-[8px] font-black uppercase text-slate-600 bg-white p-1.5 rounded-lg border border-slate-100"
                                                        >
                                                            <Bus
                                                                size={10}
                                                                className="text-indigo-500"
                                                            />{" "}
                                                            {b}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-slate-300 italic text-xs">
                                    Tidak ada jadwal jalan.
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
