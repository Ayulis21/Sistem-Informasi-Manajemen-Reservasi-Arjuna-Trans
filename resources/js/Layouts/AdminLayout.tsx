import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    BarChart3,
    Bus,
    ClipboardList,
    FileText,
    Calendar,
    MapPin,
    User,
    Menu,
    LogOut,
    LayoutDashboard,
    Layers,
    Route,
    FolderArchive,
} from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-white md:bg-[#F1F3F6] font-sans flex md:p-6 md:gap-6 overflow-hidden max-h-screen relative">
            {/* ========================================================================= */}
            {/* 1. SIDEBAR SAMPING (Otomatis Sembunyi 'hidden md:flex' di Layar HP)      */}
            {/* ========================================================================= */}
            <div
                className={`hidden md:flex bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-6 flex-col shrink-0 justify-between transition-all duration-300 ${
                    isSidebarOpen
                        ? "w-[260px] opacity-100"
                        : "w-0 p-0 opacity-0 border-none pointer-events-none"
                }`}
            >
                {isSidebarOpen && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="flex items-center gap-3 pl-2">
                            <div className="w-10 h-10 bg-[#5346F1] text-white rounded-xl flex items-center justify-center text-md font-black shadow-lg shadow-indigo-500/20">
                                <Bus size={20} />
                            </div>
                            <div>
                                <span className="text-md font-black text-slate-800 tracking-tight block">
                                    Arjuna
                                    <span className="text-[#5346F1] italic">
                                        Trans
                                    </span>
                                </span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block -mt-1">
                                    Pusat Kendali
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1 text-[11px] font-black uppercase tracking-widest text-[#94A3B8]">
                            <Link
                                href="/dashboard"
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${url === "/dashboard" ? "bg-[#5346F1] text-white shadow-lg" : "hover:bg-slate-50 hover:text-slate-600"}`}
                            >
                                <LayoutDashboard size={16} />{" "}
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                href="/orders"
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${url === "/orders" ? "bg-[#5346F1] text-white shadow-lg" : "hover:bg-slate-50 hover:text-slate-600"}`}
                            >
                                <ClipboardList size={16} />{" "}
                                <span>Kelola Pesanan</span>
                            </Link>
                            <Link
                                href="/plotting"
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${url === "/plotting" ? "bg-[#5346F1] text-white shadow-lg" : "hover:bg-slate-50 hover:text-slate-600"}`}
                            >
                                <MapPin size={16} />{" "}
                                <span>Plotting Armada</span>
                            </Link>
                            <Link
                                href="/schedule"
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${url === "/schedule" ? "bg-[#5346F1] text-white shadow-lg" : "hover:bg-slate-50 hover:text-slate-600"}`}
                            >
                                <Calendar size={16} />{" "}
                                <span>Kalender Jalan</span>
                            </Link>
                            <Link
                                href="/master-data"
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${url === "/master-data" ? "bg-[#5346F1] text-white shadow-lg" : "hover:bg-slate-50 hover:text-slate-600"}`}
                            >
                                <Bus size={16} /> <span>Data Master</span>
                            </Link>
                            <Link
                                href="/reports"
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${url === "/reports" ? "bg-[#5346F1] text-white shadow-lg" : "hover:bg-slate-50 hover:text-slate-600"}`}
                            >
                                <FileText size={16} /> <span>Laporan</span>
                            </Link>
                        </div>
                    </div>
                )}
                {isSidebarOpen && (
                    <div className="bg-slate-50 border border-slate-100/70 p-3.5 rounded-[1.5rem] flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xs">
                            TR
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[11px] font-black text-slate-800 truncate">
                                Administrator
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 truncate">
                                Sistem Management
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* AREA KANAN */}
            <div className="flex-1 flex flex-col overflow-hidden max-h-screen pb-24 md:pb-0">
                {/* NAVBAR ATAS */}
                <header className="h-16 flex items-center justify-between px-4 mb-2 md:mb-4 shrink-0">
                    <div
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center gap-2.5 text-slate-400 cursor-pointer hover:text-[#5346F1] transition-colors group p-2 rounded-xl hover:bg-slate-100 md:hover:bg-white shadow-sm shadow-transparent md:hover:shadow-slate-100/50"
                    >
                        <Menu
                            size={18}
                            className="text-slate-500 group-hover:rotate-180 transition-transform duration-300"
                        />
                        <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest select-none">
                            {isSidebarOpen
                                ? "Sembunyikan Menu"
                                : "Tampilkan Menu"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-2 shadow-sm">
                            <User size={12} className="text-[#5346F1]" />
                            <span className="text-[9px] md:text-[10px] font-black text-slate-700 uppercase">
                                Admin
                                <span className="text-emerald-500 font-bold ml-1 text-[8px] hidden sm:inline">
                                    ONLINE
                                </span>
                            </span>
                        </div>
                        <Link
                            href="/login-admin"
                            className="w-9 h-9 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl flex items-center justify-center"
                        >
                            <LogOut size={14} />
                        </Link>
                    </div>
                </header>

                {/* AREA KONTEN */}
                <div className="flex-1 overflow-y-auto px-4 md:px-0 pr-1 custom-scrollbar">
                    {children}
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. MENU BAWAH RESPONSIF - BENTUK KAPSUL PUTIH MELAYANG (100% PERSIS KANAN) */}
            {/* ========================================================================= */}
            <div className="md:hidden fixed bottom-6 left-4 right-4 bg-white rounded-full border border-slate-100/80 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.05)] px-4 py-3 flex items-center justify-between z-50">
                {/* Menu Dashboard */}
                <Link
                    href="/dashboard"
                    className="relative flex items-center justify-center flex-1 min-h-[44px]"
                >
                    <div
                        className={`rounded-xl transition-all duration-300 flex items-center justify-center ${
                            url === "/dashboard"
                                ? "bg-[#5346F1] text-white scale-110 w-11 h-11 absolute -translate-y-4 shadow-md"
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <LayoutDashboard size={18} strokeWidth={2.5} />
                    </div>
                    {url === "/dashboard" && <div className="w-11 h-11"></div>}
                </Link>

                {/* Menu Kelola Pesanan */}
                <Link
                    href="/orders"
                    className="relative flex items-center justify-center flex-1 min-h-[44px]"
                >
                    <div
                        className={`rounded-xl transition-all duration-300 flex items-center justify-center ${
                            url === "/orders"
                                ? "bg-[#5346F1] text-white scale-110 w-11 h-11 absolute -translate-y-4 shadow-md"
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <ClipboardList size={18} strokeWidth={2.5} />
                    </div>
                    {url === "/orders" && <div className="w-11 h-11"></div>}
                </Link>

                {/* Menu Plotting Armada */}
                <Link
                    href="/plotting"
                    className="relative flex items-center justify-center flex-1 min-h-[44px]"
                >
                    <div
                        className={`rounded-xl transition-all duration-300 flex items-center justify-center ${
                            url === "/plotting"
                                ? "bg-[#5346F1] text-white scale-110 w-11 h-11 absolute -translate-y-4 shadow-md"
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <MapPin size={18} strokeWidth={2.5} />
                    </div>
                    {url === "/plotting" && <div className="w-11 h-11"></div>}
                </Link>

                {/* Menu Kalender Jalan */}
                <Link
                    href="/schedule"
                    className="relative flex items-center justify-center flex-1 min-h-[44px]"
                >
                    <div
                        className={`rounded-xl transition-all duration-300 flex items-center justify-center ${
                            url === "/schedule"
                                ? "bg-[#5346F1] text-white  scale-110 w-11 h-11 absolute -translate-y-4 shadow-md"
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <Calendar size={18} strokeWidth={2.5} />
                    </div>
                    {url === "/schedule" && <div className="w-11 h-11"></div>}
                </Link>

                {/* Menu Data Master */}
                <Link
                    href="/master-data"
                    className="relative flex items-center justify-center flex-1 min-h-[44px]"
                >
                    <div
                        className={`rounded-xl transition-all duration-300 flex items-center justify-center ${
                            url === "/master-data"
                                ? "bg-[#5346F1] text-white scale-110 w-11 h-11 absolute -translate-y-4 shadow-md"
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <Bus size={18} strokeWidth={2.5} />
                    </div>
                    {url === "/master-data" && (
                        <div className="w-11 h-11"></div>
                    )}
                </Link>

                {/* Menu Laporan */}
                <Link
                    href="/reports"
                    className="relative flex items-center justify-center flex-1 min-h-[44px]"
                >
                    <div
                        className={`rounded-xl transition-all duration-300 flex items-center justify-center ${
                            url === "/reports"
                                ? "bg-[#5346F1] text-white scale-110 w-11 h-11 absolute -translate-y-4 shadow-md"
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <FileText size={18} strokeWidth={2.5} />
                    </div>
                    {url === "/reports" && <div className="w-11 h-11"></div>}
                </Link>
            </div>
        </div>
    );
};

export default AdminLayout;
