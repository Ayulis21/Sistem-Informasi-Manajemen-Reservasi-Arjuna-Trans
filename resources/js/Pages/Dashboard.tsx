import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Cell,
    PieChart,
    Pie,
} from "recharts";
// import { AppState } from "../types";
import {
    Truck,
    AlertCircle,
    BarChart3,
    CheckCircle2,
    Calendar,
} from "lucide-react";

const Dashboard: React.FC = () => {
    const state = {
        armada: [
            { id: "A001", status: "Ready" },
            { id: "A002", status: "Ready" },
            { id: "A003", status: "On Trip" },
            { id: "A004", status: "Maintenance" },
            { id: "A005", status: "Ready" },
        ],

        orders: [
            {
                status: "Pending",
                departureTime: "2026-07-10",
                returnTime: "2026-07-12",
                assignments: [],
            },
            {
                status: "Approved",
                departureTime: "2026-07-15",
                returnTime: "2026-07-18",
                assignments: [],
            },
            {
                status: "Completed",
                departureTime: "2026-07-01",
                returnTime: "2026-07-03",
                assignments: [],
            },
        ],
    };
    const [checkDates, setCheckDates] = useState({
        start: "",
        end: "",
    });

    const [availableResult, setAvailableResult] = useState<{
        total: number;
        ready: number;
    } | null>(null);

    const handleCheckAvailability = () => {
        setAvailableResult({
            total: state.armada.length,
            ready: 3,
        });
    };
    const readyBuses = state.armada.filter((a) => a.status === "Ready").length;
    const onTripBuses = state.armada.filter(
        (a) => a.status === "On Trip",
    ).length;

    const maintenanceBuses = state.armada.filter(
        (a) => a.status === "Maintenance",
    ).length;

    const pendingCount = state.orders.filter(
        (o) => o.status === "Pending",
    ).length;

    const approvedCount = state.orders.filter(
        (o) => o.status === "Approved",
    ).length;

    const completedCount = state.orders.filter(
        (o) => o.status === "Completed",
    ).length;

    const orderData = [
        { name: "Baru", value: pendingCount, color: "#f59e0b" },
        { name: "Disetujui", value: approvedCount, color: "#6366f1" },
        { name: "Selesai", value: completedCount, color: "#10b981" },
    ];

    const revenueHistory = [
        { day: "Sen", total: 12000000 },
        { day: "Sel", total: 9000000 },
        { day: "Rab", total: 18000000 },
        { day: "Kam", total: 15000000 },
        { day: "Jum", total: 21000000 },
        { day: "Sab", total: 27000000 },
        { day: "Min", total: 31000000 },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                    Ringkasan Operasional
                                </h2>
                            </div>
                            <p className="text-slate-500 text-sm italic">
                                Status real-time {state.armada.length} armada
                                dan antrean pesanan.
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-slate-400 pl-2">
                                    Cek Slot Tanggal
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="date"
                                        className="bg-slate-50 border-none rounded-xl px-3 py-2 text-[10px] font-bold"
                                        value={checkDates.start}
                                        onChange={(e) =>
                                            setCheckDates({
                                                ...checkDates,
                                                start: e.target.value,
                                            })
                                        }
                                    />
                                    <span className="text-slate-300 text-[10px]">
                                        s/d
                                    </span>
                                    <input
                                        type="date"
                                        className="bg-slate-50 border-none rounded-xl px-3 py-2 text-[10px] font-bold"
                                        value={checkDates.end}
                                        onChange={(e) =>
                                            setCheckDates({
                                                ...checkDates,
                                                end: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCheckAvailability}
                                className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                            >
                                Check
                            </button>
                            {availableResult !== null && (
                                <div className="bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl border border-emerald-100 animate-in zoom-in-95">
                                    <p className="text-[10px] font-black uppercase">
                                        {availableResult.ready} Unit Tersedia
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Armada"
                        value={state.armada.length.toString()}
                        icon={Truck}
                        color="bg-indigo-600"
                        trend="Semua Unit"
                        subColor="bg-slate-100 text-slate-600"
                    />
                    <StatCard
                        title="Unit Ready"
                        value={readyBuses.toString()}
                        icon={CheckCircle2}
                        color="bg-emerald-500"
                        trend="Tersedia"
                        subColor="bg-emerald-50 text-emerald-600"
                    />
                    <StatCard
                        title="On Trip"
                        value={onTripBuses.toString()}
                        icon={Calendar}
                        color="bg-indigo-500"
                        trend="Sedang Jalan"
                        subColor="bg-indigo-50 text-indigo-600"
                    />
                    <StatCard
                        title="Maintenance"
                        value={maintenanceBuses.toString()}
                        icon={AlertCircle}
                        color="bg-red-500"
                        trend="Dalam Servis"
                        subColor="bg-red-50 text-red-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-slate-50">
                            <BarChart3 size={100} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-black mb-8 flex items-center text-slate-800 uppercase tracking-widest">
                                <Calendar
                                    className="mr-3 text-indigo-500"
                                    size={20}
                                />
                                Arus Kas Mingguan
                            </h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueHistory}>
                                        <defs>
                                            <linearGradient
                                                id="colorRevenue"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#6366f1"
                                                    stopOpacity={0.15}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#6366f1"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#f1f5f9"
                                        />
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: "#94a3b8",
                                                fontSize: 11,
                                            }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: "#94a3b8",
                                                fontSize: 11,
                                            }}
                                            tickFormatter={(val) =>
                                                `Rp${val / 1000000}M`
                                            }
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: "20px",
                                                border: "none",
                                                boxShadow:
                                                    "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                                padding: "15px",
                                            }}
                                            formatter={(value: any) =>
                                                `Rp ${Number(value).toLocaleString()}`
                                            }
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#6366f1"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-black mb-8 text-slate-800 uppercase tracking-widest">
                                Status Booking
                            </h3>
                            <div className="h-60 flex flex-col justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={orderData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={10}
                                            dataKey="value"
                                            animationBegin={0}
                                            animationDuration={1500}
                                            stroke="none"
                                        >
                                            {orderData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: "20px",
                                                border: "none",
                                                boxShadow:
                                                    "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="space-y-4 mt-6">
                            {orderData.map((d) => (
                                <div
                                    key={d.name}
                                    className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest"
                                >
                                    <div className="flex items-center">
                                        <div
                                            className="w-3 h-3 rounded-full mr-3 shadow-sm"
                                            style={{ backgroundColor: d.color }}
                                        ></div>
                                        <span className="text-slate-500">
                                            {d.name}
                                        </span>
                                    </div>
                                    <span className="text-slate-800">
                                        {d.value} Pesanan
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    subColor,
}: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
        <div className="absolute -right-4 -bottom-4 p-8 text-slate-50 transition-transform group-hover:scale-110 duration-500">
            <Icon size={80} />
        </div>
        <div className="relative z-10 flex items-start justify-between">
            <div>
                <div
                    className={`px-2 py-1 rounded-lg ${subColor} text-[8px] font-black uppercase tracking-[0.2em] mb-3 w-fit`}
                >
                    {trend}
                </div>
                <h4 className="text-3xl font-black text-slate-800 tracking-tighter">
                    {value}
                </h4>
                <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-tight">
                    {title}
                </p>
            </div>
            <div
                className={`${color} p-4 rounded-2xl text-white shadow-lg shadow-indigo-100`}
            >
                <Icon size={24} />
            </div>
        </div>
    </div>
);

export default Dashboard;
