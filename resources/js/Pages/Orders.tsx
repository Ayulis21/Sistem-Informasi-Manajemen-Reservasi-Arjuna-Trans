import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ModalOrder from "./OrderComponents/ModalOrder";
import {
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    Bus,
    Phone,
    Edit2,
    Trash2,
    Printer,
    Plus,
    Filter,
    Check,
    ChevronRight,
    MapPin,
    Calendar,
} from "lucide-react";

const Orders: React.FC = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [activeOrder, setActiveOrder] = useState({
        id: "ORD4",
        customerName: "Karang Taruna",
        destination: "Anyer",
        totalPrice: 11500000,
        paidAmount: 5000000,
    });
    // DATA STATIS MURNI: 100% PERSIS SEPERTI DATA DI GAMBAR ANDA
    const [orders, setOrders] = useState([
        {
            id: "ORD7",
            title: "Rombongan Arisan Ibu-ibu Komplek Anggrek",
            rute: "CIWIDEY BANDUNG (KAWAH PUTIH & KEBUN TEH)",
            date: "1/7/2026",
            price: 3800000,
            badge: "BARU",
            status: "Pending",
            type: "arisan",
        },
        {
            id: "ORD-8323-WEB",
            title: "test",
            rute: "TEST",
            date: "4/7/2026",
            price: 0,
            badge: "BARU",
            status: "Pending",
            type: "test",
        },
        {
            id: "ORD8",
            title: "Rombongan Pernikahan Rian & Siska",
            rute: "KOTA SOLO (GEDUNG GRAHA SABA BUANA)",
            date: "26/6/2026",
            price: 9000000,
            badge: "ORD8",
            status: "Approved",
            type: "nikah",
        },
        {
            id: "ORD5",
            title: "Jamaah Majelis Taklim Al-Ikhsan (Ziarah Wali)",
            rute: "SURABAYA & MADURA (ZIARAH WALI SONGO)",
            date: "15/6/2026",
            price: 19000000,
            badge: "ORD5",
            status: "Ziarah",
            type: "ziarah",
        },
        {
            id: "ORD6",
            title: "PT Nusantara Jaya (Tour Dewata Bali)",
            rute: "PULAU BALI (KUTA, BEDUGUL, ULUWATU)",
            date: "24/6/2026",
            price: 28000000,
            badge: "ORD6",
            status: "Completed",
            type: "pt",
        },
        {
            id: "ORD3",
            title: "Study Tour SD Merdeka Baru",
            rute: "TAMAN MINI INDONESIA INDAH (TMII) & ANCOL",
            date: "20/6/2026",
            price: 7500000,
            badge: "LUNAS",
            status: "Completed",
            type: "school",
        },
        {
            id: "ORD4",
            title: "Gathering Karang Taruna RW 04",
            rute: "PANTAI ANYER (COTTAGE & WATERSPORT)",
            date: "28/6/2026",
            price: 11500000,
            badge: "ORD4",
            status: "Completed",
            type: "taruna",
        },
        {
            id: "ORD2",
            title: "Rombongan SMK Pariwisata Harapan",
            rute: "PANGANDARAN (PANTAI BARAT & GREEN CANYON)",
            date: "10/7/2026",
            price: 8500000,
            badge: "ORD2",
            status: "Plotting",
            type: "smk",
        },
        {
            id: "ORD1",
            title: "PT Maju Jaya Sentosa (Outing Kantor)",
            rute: "BANDUNG (LEMBANG & DUSUN BAMBU)",
            date: "5/7/2026",
            price: 12000000,
            badge: "ORD1",
            status: "Plotting",
            type: "pt2",
        },
    ]);

    const [search, setSearch] = useState("");

    const getLeftIcon = (status: string) => {
        switch (status) {
            case "Pending":
                return (
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center border border-amber-100">
                        <Clock size={18} />
                    </div>
                );
            case "Approved":
                return (
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center border border-indigo-100">
                        <Bus size={18} />
                    </div>
                );
            case "Ziarah":
                return (
                    <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center border border-slate-200">
                        <XCircle size={18} />
                    </div>
                );
            case "Completed":
                return (
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center border border-blue-100">
                        <CheckCircle2 size={18} />
                    </div>
                );
            case "Plotting":
                return (
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100">
                        <CheckCircle2 size={18} />
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
                        <Clock size={18} />
                    </div>
                );
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* ========================================================================= */}
                {/* TOOLBAR ATAS: JUDUL & TOMBOL KEBIJAKAN                                    */}
                {/* ========================================================================= */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">
                            Kelola Reservasi
                        </h2>
                        <p className="text-slate-400 text-xs font-bold italic">
                            Verifikasi pesanan masuk dan atur detail pembayaran.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider w-full sm:w-auto">
                        <button className="bg-white border border-slate-200/60 px-4 py-2 rounded-xl text-slate-500 shadow-sm flex items-center gap-1.5">
                            <Printer size={12} /> Semua Bayar ▾
                        </button>
                        <button className="bg-white border border-slate-200/60 px-4 py-2 rounded-xl text-slate-500 shadow-sm flex items-center gap-1.5">
                            <Filter size={12} /> Semua Status ▾
                        </button>
                        <button
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 hover:bg-slate-800 transition-colors "
                            onClick={() => setIsOpenModal(true)}
                        >
                            <Plus size={14} /> Tambah
                        </button>
                    </div>
                </div>

                {/* BAR PENCARIAN PANJANG */}
                <div className="relative group">
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari pelanggan atau tujuan..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-xs font-bold outline-none placeholder:font-normal placeholder:text-slate-400"
                    />
                </div>

                {/* ========================================================================= */}
                {/* LIST CARD RESERVASI BERJEJER (100% PERSIS SEPERTI GAMBAR)               */}
                {/* ========================================================================= */}
                <div className="space-y-3">
                    {orders.map((o, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden transition-all hover:border-indigo-100"
                        >
                            {/* Sisi Kiri: Ikon & Detail Rute */}
                            <div className="flex items-start gap-4 flex-1">
                                {getLeftIcon(o.status)}
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h4 className="text-sm font-black text-slate-800 tracking-tight leading-tight">
                                            {o.title}
                                        </h4>
                                        <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-md border border-slate-200/40 uppercase tracking-widest">
                                            {o.id}
                                        </span>
                                        {o.badge === "BARU" && (
                                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-red-100 text-red-500 rounded-md uppercase tracking-wider">
                                                BARU
                                            </span>
                                        )}
                                        {o.badge === "LUNAS" && (
                                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-500 text-white rounded-md uppercase tracking-wider">
                                                LUNAS
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 text-[10px] font-bold text-slate-400">
                                        <p className="flex items-center gap-1">
                                            <MapPin
                                                size={10}
                                                className="text-slate-300"
                                            />{" "}
                                            {o.rute}
                                        </p>
                                        <span className="hidden sm:inline text-slate-200">
                                            |
                                        </span>
                                        <p className="flex items-center gap-1">
                                            <Calendar
                                                size={10}
                                                className="text-slate-300"
                                            />{" "}
                                            {o.date}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sisi Kanan: Harga & Tombol Aksi Operasional */}
                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t border-slate-50 pt-3 md:pt-0 md:border-none">
                                <div className="text-left md:text-right">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                        Total Sewa
                                    </p>
                                    <p className="text-sm font-black text-slate-800">
                                        Rp {o.price.toLocaleString("id-ID")}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {/* Mini Actions */}
                                    <button className="p-2 hover:bg-slate-50 text-slate-300 hover:text-slate-500 rounded-xl transition-colors">
                                        <Phone size={12} />
                                    </button>
                                    <button
                                        className="p-2 hover:bg-slate-50 text-slate-300 hover:text-slate-500 rounded-xl transition-colors"
                                        onClick={() => setIsOpenModal(true)}
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button className="p-2 hover:bg-slate-50 text-slate-300 hover:text-red-500 rounded-xl transition-colors">
                                        <Trash2 size={12} />
                                    </button>
                                    <button className="p-2 bg-slate-900 text-white rounded-xl shadow-sm">
                                        <Printer size={12} />
                                    </button>

                                    {/*  PERBAIKAN SINTAKS PENUTUP TOMBOL AKSI OPERASIONAL */}
                                    {o.status === "Pending" && (
                                        <>
                                            <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all flex items-center gap-1">
                                                <Check
                                                    size={10}
                                                    strokeWidth={3}
                                                />{" "}
                                                SETUJUI
                                            </button>
                                            <button className="px-3 py-2 bg-white border border-red-200 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 transition-colors">
                                                × TOLAK
                                            </button>
                                        </>
                                    )}
                                    {o.status === "Approved" && (
                                        <>
                                            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all flex items-center gap-1">
                                                → JALAN
                                            </button>
                                            <span className="text-[9px] font-bold text-slate-400 ml-2 cursor-pointer hover:text-indigo-600 uppercase tracking-widest">
                                                Ubah Plot
                                            </span>
                                        </>
                                    )}
                                    {o.status === "Ziarah" && (
                                        <button className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl opacity-90 cursor-default">
                                            ARSIP
                                        </button>
                                    )}
                                    {o.status === "Completed" && (
                                        <button className="px-4 py-2 bg-[#5346F1] text-white text-[9px] font-black uppercase tracking-widest rounded-xl opacity-90 cursor-default flex items-center gap-1">
                                            <Check size={10} strokeWidth={3} />{" "}
                                            SELESAI
                                        </button>
                                    )}
                                    {o.status === "Plotting" && (
                                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all flex items-center gap-1">
                                            ⊞ PLOTTING
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ModalOrder
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                formData={activeOrder}
                setFormData={setActiveOrder}
                onSave={(e) => {
                    e.preventDefault();
                    setIsOpenModal(false);
                }}
            />
        </AdminLayout>
    );
};

export default Orders;
