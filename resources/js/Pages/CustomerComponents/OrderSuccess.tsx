import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Check,
    Search,
    MessageSquare,
    ArrowRight,
    Home,
    Copy,
} from "lucide-react";

const OrderSuccess: React.FC = () => {
    // 🎯 KUNCI 1: Ambil ID Pesanan asli yang dikirim dari URL Laravel
    const { id } = usePage<any>().props;
    const trackingCode = id || "ORD-XXXXX";

    // 🎯 KUNCI 2: Definisi fungsi Redirect WhatsApp (Sesuai error tadi)
    const handleWhatsAppRedirect = () => {
        const message = encodeURIComponent(
            `Halo Admin Arjuna Trans, saya ingin mengonfirmasi pemesanan bus pariwisata dengan Kode Tracking: ${trackingCode}. Mohon instruksi selanjutnya.`,
        );
        // Pastikan nomor HP admin sudah benar
        window.open(`https://wa.me/6282143130060?text=${message}`, "_blank");
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(trackingCode);
        alert("Kode tracking berhasil disalin!");
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="bg-white w-full max-w-[420px] rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-6 flex flex-col items-center">
                {/* Ikon Centang */}
                <div className="w-16 h-16 bg-[#10B981] text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                    <Check size={32} strokeWidth={3} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                        Pesanan Terkirim!
                    </h2>
                    <p className="text-slate-400 text-[11px] font-semibold leading-relaxed px-4">
                        Data reservasi Anda telah kami terima dan sedang
                        diproses oleh admin.
                    </p>
                </div>

                {/* Boks Kode Tracking */}
                <div className="w-full bg-[#0B0F19] rounded-[1.75rem] p-6 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-white/5 scale-[2.5]">
                        <Search size={40} />
                    </div>
                    <div className="relative z-10 space-y-2">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">
                            Kode Tracking Anda
                        </span>
                        <h3 className="text-2xl font-black tracking-widest">
                            {trackingCode}
                        </h3>
                        <button
                            onClick={handleCopyCode}
                            className="text-[8px] font-black text-slate-500 uppercase hover:text-white transition-colors flex items-center gap-1 mx-auto"
                        >
                            <Copy size={10} /> Salin Kode
                        </button>
                    </div>
                </div>

                {/* Tombol WA (Yang tadinya Error) */}
                <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full py-4 bg-[#00BFA5] hover:bg-[#00A894] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <MessageSquare size={14} fill="currentColor" /> Konfirmasi
                    Sekarang (Wajib)
                </button>

                {/* Warning Box */}
                <div className="w-full bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left">
                    <p className="text-[9px] font-semibold text-amber-700 italic leading-normal">
                        Status pesanan Anda saat ini masih{" "}
                        <strong className="font-black">PENDING</strong>. Anda{" "}
                        <strong className="font-black text-red-500">
                            WAJIB
                        </strong>{" "}
                        klik tombol WhatsApp di atas untuk negosiasi harga dan
                        mendapatkan rekening pembayaran.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                    <Link
                        href="/order-status"
                        className="py-3 bg-indigo-50 text-[#5346F1] rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-1"
                    >
                        Cek Proses <ArrowRight size={12} />
                    </Link>
                    <Link
                        href="/"
                        className="py-3 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-1"
                    >
                        <Home size={12} /> Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
