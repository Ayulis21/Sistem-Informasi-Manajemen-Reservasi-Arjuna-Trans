import React from "react";
import { useForm, Link } from "@inertiajs/react";
import BookingFields from "./BookingFields";
import { ArrowLeft, Send, Bus } from "lucide-react";

const CustomerOrder: React.FC = () => {
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

    return (
        <div className="bg-[#F1F3F6] min-h-screen py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Balik */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 mb-8 transition-all"
                >
                    <ArrowLeft size={14} /> Kembali ke Beranda
                </Link>

                <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-6">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
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
                        {/* 🎯 PANGGIL KOMPONEN FIELDS MAS DI SINI */}
                        <BookingFields formData={data} setFormData={setData} />

                        <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-[10px] text-slate-400 font-bold italic max-w-xs text-center md:text-left">
                                Dengan mengirim form ini, Anda akan dihubungi
                                oleh tim kami untuk negosiasi harga &
                                ketersediaan armada.
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
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
