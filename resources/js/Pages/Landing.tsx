import React from "react";
import { Link } from "@inertiajs/react";
import {
    Bus,
    Calendar,
    Search,
    ClipboardCheck,
    User,
    ArrowRight,
    ShieldCheck,
    Phone,
} from "lucide-react";

// Perbaikan: Membuat parameter props opsional agar tidak crash saat dipanggil pertama kali oleh Laravel
const Landing: React.FC = () => {
    return (
        <div className="bg-white min-h-screen font-sans overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Bus size={20} />
                        </div>
                        <span className="text-xl font-black text-slate-800 tracking-tighter italic">
                            ArjunaTrans
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Perbaikan: Mengubah 'to' menjadi 'href' */}
                        <Link
                            href="/login"
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8] hover:text-slate-600 transition-colors"
                        >
                            <User size={18} />
                            ADMIN LOGIN
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-white to-slate-50">
                <div className="container mx-auto text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full mb-8">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        <span className=" font-black text-indigo-600 uppercase tracking-widest text-[8px] sm:text-[10px]">
                            Sewa Bus Pariwisata Terbaik
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                        Eksplorasi Tanpa Batas <br />
                        <span className="text-indigo-600 italic">
                            Bersama Kami.
                        </span>
                    </h1>
                    <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed italic">
                        Nikmati perjalanan yang aman, nyaman, dan berkesan
                        dengan armada bus pariwisata modern dari Arjuna Trans.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Perbaikan: Mengubah seluruh 'to' menjadi 'href' */}
                        <Link
                            href="/customer-order"
                            className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 hover:border-indigo-500 transition-all text-left relative overflow-hidden"
                        >
                            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
                                <ClipboardCheck size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">
                                Booking Armada
                            </h3>
                            <p className="text-slate-400 text-sm font-medium mb-4 italic">
                                Pesan armada untuk mencari perjalanan Anda
                                dengan mudah.
                            </p>
                            <div className="mt-auto flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest pt-4">
                                Mulai Pesan <ArrowRight size={14} />
                            </div>
                        </Link>

                        <Link
                            href="/order-status"
                            className="group bg-slate-950 p-8 rounded-[2.5rem] border border-slate-900 shadow-xl shadow-slate-950/20 hover:border-indigo-500 transition-all text-left relative overflow-hidden"
                        >
                            <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md group-hover:scale-110 transition-transform">
                                <Search size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">
                                Cek Pesanan
                            </h3>
                            <p className="text-slate-400 text-sm font-medium mb-4 italic">
                                Pantau status reservasi & pembayaran Anda cukup
                                dengan id.
                            </p>
                            <div className="mt-auto flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest pt-4 group-hover:text-white transition-colors">
                                Lacak Status <ArrowRight size={14} />
                            </div>
                        </Link>

                        <Link
                            href="/schedule"
                            className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 hover:border-indigo-500 transition-all text-left relative overflow-hidden sm:col-span-2 lg:col-span-1"
                        >
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Calendar size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">
                                Lihat Kalender
                            </h3>
                            <p className="text-slate-400 text-sm font-medium mb-4 italic">
                                Cek jadwal keberangkatan & ketersediaan armada
                                kami.
                            </p>
                            <div className="mt-auto flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest pt-4">
                                Buka Jadwal <ArrowRight size={14} />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-white border-y border-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div>
                            <p className="text-4xl font-black text-slate-800 mb-2">
                                12+
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                Armada Bus
                            </p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-slate-800 mb-2">
                                1k+
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                Happy Clients
                            </p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-slate-800 mb-2">
                                10+
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                Tujuan Utama
                            </p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-slate-800 mb-2">
                                24/7
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                Dukungan
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-12 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                        <div className="flex items-center gap-2 font-black text-slate-400 italic text-2xl">
                            ARJUNATRANS
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={20} />{" "}
                            <span className="font-bold">VERIFIED SAFETY</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bus size={20} />{" "}
                            <span className="font-bold">PREMIUM FLEET</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={20} />{" "}
                            <span className="font-bold">24/7 SUPPORT</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perbaikan: Menyempurnakan Footer yang terpotong */}
            <footer className="py-12 bg-indigo-600 text-white mt-auto">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                            <Bus size={16} />
                        </div>
                        <span className="text-lg font-black tracking-tighter italic">
                            ArjunaTrans
                        </span>
                    </div>
                    <p className="text-[11px] font-medium opacity-80">
                        &copy; {new Date().getFullYear()} Arjuna Trans. All
                        rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
