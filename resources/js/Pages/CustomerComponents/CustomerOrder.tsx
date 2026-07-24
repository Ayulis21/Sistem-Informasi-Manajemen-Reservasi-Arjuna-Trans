import React from "react";
import { useForm, Link } from "@inertiajs/react";
import BookingFields from "./BookingFields";
import { ArrowLeft, Send, Bus } from "lucide-react";

interface MasterArmada {
    tipe_armada: string;
    kapasitas: number;
}

interface CustomerOrderProps {
    masterArmada: MasterArmada[];
    [key: string]: any;
}

// const CustomerOrder: React.FC<any> = ({ masterArmada }) => {
const CustomerOrder = (props: any) => {
    // 🎯 KUNCI: Inisialisasi data form yang akan dikirim ke Laravel
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        whatsapp: "",
        address: "",
        departDate: "",
        returnDate: "",
        pickup: "",
        destination: "",
        routeNotes: "",
        lain_lain: "",
        fleetRequirements: [{ type: "", qty: 1 }],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Kirim ke endpoint API booking pelanggan
        post("/api/customer/booking", {
            onSuccess: () =>
                alert(
                    "Pesanan berhasil dikirim! Silakan tunggu konfirmasi admin via WhatsApp.",
                ),
        });
    };
    // console.log("Data Armada dari Database:", masterArmada);
    console.log("SEMUA PROPS DARI LARAVEL:", props);

    // TEST 2: Lihat spesifik armada
    console.log("ISI ARMADA:", props.masterArmada);
    return (
        <div className="bg-[#F1F3F6] min-h-screen font-sans pb-20 text-left">
            {/* --- 🎯 1. HEADER NAVIGASI SERAGAM (Logo Tengah, Kembali Kiri) --- */}
            <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 relative">
                <div className="flex items-center w-full min-h-[40px]">
                    {/* Tombol Kembali */}
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-3 text-[10px] font-black uppercase text-[#94A3B8] tracking-widest hover:text-[#5346F1] transition-all no-underline z-10"
                    >
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#94A3B8] shadow-sm border border-slate-100 transition-all group-hover:bg-[#5346F1] group-hover:text-white">
                            <ArrowLeft size={14} strokeWidth={3} />
                        </div>
                        <span className="hidden sm:inline">Kembali</span>
                    </Link>

                    {/* Logo (Pusat Mati di Tengah) */}
                    <span className="absolute left-1/2 -translate-x-1/2 text-xl font-black text-slate-800 italic tracking-tighter pointer-events-none whitespace-nowrap">
                        ArjunaTrans
                    </span>
                </div>
            </div>

            {/* --- 🎯 2. KONTEN UTAMA --- */}
            <div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6">
                <div className="bg-white rounded-[3rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-6">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                            <Bus size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                                Formulir Sewa Bus
                            </h2>
                            <p className="text-slate-400 text-xs font-bold italic">
                                Lengkapi detail perjalanan Anda di bawah ini.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* PANGGIL KOMPONEN FIELDS */}
                        <BookingFields
                            formData={data}
                            setFormData={setData}
                            masterArmada={props.masterArmada}
                        />

                        <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* <div className="space-y-1">
                                <h4 className={headerStyle}>
                                    📝 Catatan Khusus
                                </h4> */}
                            <p className="text-[10px] italic text-amber-600 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-100 mt-1">
                                * Estimasi harga akan dikalkulasi oleh Admin
                                Arjuna Trans berdasarkan rute dan ketersediaan
                                unit.
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full md:w-auto px-10 py-4 bg-[#5346F1] hover:bg-[#4338CA] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {processing
                                    ? "Mengirim..."
                                    : "Kirim Pengajuan Sewa"}
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrder;
