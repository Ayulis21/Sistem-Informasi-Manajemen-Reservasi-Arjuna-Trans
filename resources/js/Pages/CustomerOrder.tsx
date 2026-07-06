import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import BookingFields from "./CustomerComponents/BookingFields";
import { ArrowLeft, Navigation2, X } from "lucide-react";

interface FleetRow {
    id: string;
    type: string;
    count: number;
}

const CustomerOrder: React.FC = () => {
    // State Pengendali Form Isian Pelanggan
    const [bookingData, setBookingData] = useState({
        name: "",
        whatsapp: "",
        address: "",
        departDate: "",
        returnDate: "",
        pickup: "",
        destination: "",
        routeNotes: "",
    });

    // Mengubah kebutuhan armada menjadi array dinamis (Mula-mula berisi 1 baris default)
    const [fleets, setFleets] = useState<FleetRow[]>([
        { id: `row-${Date.now()}`, type: "Bus Pariwisata", count: 1 },
    ]);

    const handleAddFleetRow = () => {
        const newRow: FleetRow = {
            id: `row-${Date.now()}-${Math.random()}`,
            type: "Bus Pariwisata",
            count: 1,
        };
        setFleets([...fleets, newRow]);
    };

    const handleRemoveFleetRow = (id: string) => {
        if (fleets.length === 1) {
            return;
        }
        setFleets(fleets.filter((row) => row.id !== id));
    };

    const handleUpdateFleetRow = (id: string, updates: Partial<FleetRow>) => {
        setFleets(
            fleets.map((row) => (row.id === id ? { ...row, ...updates } : row)),
        );
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = "/booking-success";
    };
    const handleWhatsAppRedirect = () => {
        const trackingCode = "N/A";
        const message = encodeURIComponent(
            `Halo Admin Arjuna Trans, saya ingin mengonfirmasi pemesanan armada bus pariwisata dengan Kode Tracking: ${trackingCode}. Mohon panduan instruksi pembayaran selanjutnya.`,
        );
        window.open(`https://wa.me/6282143130060?text=${message}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-slate-50/30 font-sans flex flex-col items-center justify-center p-4 sm:p-8 text-left animate-in fade-in duration-500">
            <div className="w-full max-w-4xl mx-auto px-4 relative mb-5">
                <div className="flex items-center w-full min-h-[36px]">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-3 text-[10px] font-black uppercase text-[#94A3B8] tracking-widest hover:text-[#5346F1] transition-all no-underline z-10"
                    >
                        <div className="w-9 h-9 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-[#94A3B8] shadow-sm transition-all group-hover:bg-[#5346F1] group-hover:text-white group-hover:scale-105">
                            <ArrowLeft size={14} strokeWidth={3} />
                        </div>
                        <span>Kembali</span>
                    </Link>
                    <span className="absolute left-1/2 -translate-x-1/2 text-base font-black text-slate-700 italic tracking-tight pointer-events-none whitespace-nowrap">
                        ArjunaTrans
                    </span>
                </div>
            </div>
            <div className="bg-white w-full max-w-4xl rounded-[3rem] border border-slate-100 shadow-[0_15px_60px_rgba(0,0,0,0.01)] p-6 md:p-10 space-y-6 relative overflow-hidden">
                <div className="text-center space-y-2 pb-2">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                        Booking Perjalanan
                    </h2>
                    <p className="text-slate-400 text-xs font-medium italic mt-1">
                        Isi form di bawah untuk mendapatkan penawaran harga
                        terbaik.
                    </p>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <BookingFields
                        formData={bookingData}
                        setFormData={setBookingData}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-2 border-t border-slate-50">
                        <div></div>{" "}
                        <div className="space-y-3 text-[9px] font-black uppercase tracking-widest text-[#94A3B8]">
                            <div className="flex justify-between items-center pb-0.5">
                                <label className="text-slate-400 text-[10px] font-bold">
                                    Kebutuhan Armada
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddFleetRow}
                                    className="text-[8px] text-[#5346F1] font-black bg-indigo-50 border border-indigo-100/40 px-2 py-0.5 rounded-md hover:bg-indigo-100 transition-colors uppercase"
                                >
                                    TAMBAH +
                                </button>
                            </div>
                            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                                {fleets.map((row) => (
                                    <div
                                        key={row.id}
                                        className="bg-white border border-slate-100 rounded-[1.5rem] p-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] animate-in fade-in duration-200"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="flex-1 space-y-1">
                                                <span className="text-[7px] text-slate-300 font-black block tracking-wider">
                                                    TIPE
                                                </span>
                                                <select
                                                    value={row.type}
                                                    onChange={(e) =>
                                                        handleUpdateFleetRow(
                                                            row.id,
                                                            {
                                                                type: e.target
                                                                    .value,
                                                            },
                                                        )
                                                    }
                                                    className="w-full p-2 bg-slate-50/80 border-none rounded-xl font-bold text-slate-700 outline-none text-xs cursor-pointer"
                                                >
                                                    <option value="Bus Pariwisata">
                                                        Bus Pariwisata
                                                    </option>
                                                    <option value="Medium Bus">
                                                        Medium Bus
                                                    </option>
                                                    <option value="Mini Bus / Elf">
                                                        Mini Bus / Elf
                                                    </option>
                                                    <option value="Toyota Hiace">
                                                        Toyota Hiace
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="space-y-1 text-center">
                                                <span className="text-[7px] text-slate-300 font-black block tracking-wider">
                                                    UNIT
                                                </span>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={row.count}
                                                    onChange={(e) =>
                                                        handleUpdateFleetRow(
                                                            row.id,
                                                            {
                                                                count: Number(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            },
                                                        )
                                                    }
                                                    className="w-14 p-2 bg-slate-50/80 border-none rounded-xl font-bold text-slate-700 text-center outline-none text-xs"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleRemoveFleetRow(row.id)
                                            }
                                            type="button"
                                            className="ml-4 text-red-400 hover:text-red-600 p-1.5 border border-red-100 bg-red-50/30 rounded-full transition-all active:scale-90 shrink-0"
                                        >
                                            <X size={13} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 text-[9px] font-bold text-amber-600 leading-normal italic tracking-wide normal-case rounded-[1.25rem]">
                                * Estimasi harga akan dikalkulasi oleh Admin
                                Arjuna Trans berdasarkan rute dan ketersediaan
                                unit. Konfirmasi final akan dikirim melalui
                                WhatsApp.
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 text-center">
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#5346F1] hover:bg-[#4338CA] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                        >
                            <Navigation2
                                size={13}
                                fill="currentColor"
                                className="rotate-90"
                            />{" "}
                            Kirim Permintaan Booking Sekarang
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerOrder;
