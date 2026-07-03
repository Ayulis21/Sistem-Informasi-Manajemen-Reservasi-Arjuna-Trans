import React from "react";
import { Link } from "@inertiajs/react";
import {
    Check,
    Search,
    MessageSquare,
    ArrowRight,
    Home,
    Copy,
} from "lucide-react";

const OrderSuccess: React.FC = () => {
    const trackingCode = "ORD-1234-AT";

    const handleCopyCode = () => {
        navigator.clipboard.writeText(trackingCode);
        alert("Kode tracking berhasil disalin ke memori perangkat!");
    };

    const handleWhatsAppRedirect = () => {
        // Teks template pembuka menggunakan backtick (``) di ujungnya
        const message = encodeURIComponent(
            `Halo Admin Arjuna Trans, saya ingin mengonfirmasi pemesanan armada bus pariwisata dengan Kode Tracking: ${trackingCode}. Mohon panduan instruksi pembayaran selanjutnya.`,
        );
        // KUNCI PERBAIKAN: Wajib menggunakan tanda backtick (``) di awal dan akhir link url!
        window.open(`https://wa.me/6282143130060?text=${message}`, "_blank");
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none animate-in fade-in duration-500">
            {/* Frame Utama Putih Melayang Vertikal (Persis Skala Gambar Anda) */}
            <div className="bg-white w-full max-w-[420px] rounded-[3rem] border border-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.01)] p-6 md:p-10 space-y-6 flex flex-col items-center">
                {/* 1. BULATAN CENTANG HIJAU BESAR */}
                <div className="w-16 h-16 bg-[#10B981] text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100 animate-in zoom-in duration-300">
                    <Check size={32} strokeWidth={3} />
                </div>

                {/* 2. HEADER TEXT */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                        Pesanan Terkirim!
                    </h2>
                    <p className="text-slate-400 text-[11px] font-semibold leading-relaxed px-4">
                        Data reservasi Anda telah kami terima dan sedang di
                        proses oleh admin.
                    </p>
                </div>

                {/* 3. BOKS HITAM KODE TRACKING (100% PERSIS SEPERTI GAMBAR) */}
                <div className="w-full bg-[#0B0F19] rounded-[1.75rem] p-6 text-white relative overflow-hidden text-center shadow-xl shadow-slate-950/10">
                    {/* Siluet Kaca Pembesar Raksasa di Latar Belakang */}
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 p-2 text-slate-800/40 pointer-events-none scale-[2.2]">
                        <Search size={40} strokeWidth={1.5} />
                    </div>

                    <div className="relative z-10 space-y-2.5">
                        <span className="text-[8px] font-black text-[#5346F1] bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md tracking-widest uppercase block w-fit mx-auto">
                            Kode Tracking Anda
                        </span>
                        <h3 className="text-2xl font-black tracking-wide text-white leading-none">
                            {trackingCode}
                        </h3>
                        {/* Tombol Salin Kecil */}
                        <button
                            onClick={handleCopyCode}
                            type="button"
                            className="flex items-center gap-1 text-[8px] font-black tracking-wider text-slate-400 uppercase mx-auto pt-1 hover:text-white transition-colors bg-white/5 px-2.5 py-1 rounded-lg border border-white/5"
                        >
                            <Copy size={9} /> Klik Untuk Salin Kode
                        </button>
                    </div>
                </div>

                {/* 4. TOMBOL WHATSAPP HIJAU (WAJIB KONFIRMASI) */}
                <button
                    onClick={handleWhatsAppRedirect}
                    type="button"
                    className="w-full py-3.5 bg-[#00BFA5] hover:bg-[#00A894] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-teal-100 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                    <MessageSquare size={13} fill="currentColor" /> Konfirmasi
                    Sekarang (Wajib)
                </button>

                {/* 5. BOKS PERHATIAN KUNING ORANJE */}
                <div className="w-full bg-amber-50/40 border border-amber-100 rounded-2xl p-4 text-left space-y-1">
                    <p className="text-[8px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1">
                        ⚠️ Perhatian Penting
                    </p>
                    <p className="text-[9px] font-semibold text-amber-600/90 leading-normal italic normal-case tracking-wide">
                        Status pesanan Anda saat ini masih{" "}
                        <strong className="font-black text-amber-700">
                            PENDING
                        </strong>
                        . Anda{" "}
                        <strong className="font-black text-amber-700">
                            WAJIB
                        </strong>{" "}
                        klik tombol WhatsApp diatas untuk negosiasi harga dan
                        mendapatkan Rekening Pembayaran. Pesanan akan otomatis
                        dibatalkan jika tidak ada konfirmasi dalam 1 x 24 jam.
                    </p>
                </div>

                {/* 6. BARISAN DUA TOMBOL AKSI SEJAJAR BAWAH */}
                {/* 6. BARISAN DUA TOMBOL AKSI SEJAJAR BAWAH */}
                <div className="grid grid-cols-2 gap-3 w-full text-[9px] font-black uppercase tracking-widest pt-2">
                    {/* KUNCI ALUR: Menggunakan rute /order-status bawaan web.php Anda */}
                    <Link
                        href="/order-status"
                        className="w-full py-3 bg-indigo-50/60 hover:bg-indigo-100/80 text-[#5346F1] rounded-xl flex items-center justify-center gap-1 transition-all border border-indigo-100/20 no-underline"
                    >
                        Cek Proses <ArrowRight size={11} strokeWidth={2.5} />
                    </Link>

                    <Link
                        href="/"
                        className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl flex items-center justify-center gap-1 transition-all border border-slate-100/50 no-underline"
                    >
                        <Home size={11} /> Ke Beranda
                    </Link>
                </div>

                {/* Teks Catatan Kaki Samar Paling Bawah */}
                <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest pt-2">
                    Simpan kode ini untuk memantau progres reservasi Anda secara
                    real-time
                </p>
            </div>
        </div>
    );
};

export default OrderSuccess;
