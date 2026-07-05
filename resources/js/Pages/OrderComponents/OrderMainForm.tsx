import React from "react";
import { MapPin, Calendar, Bus, Phone, Layers } from "lucide-react";

interface OrderMainFormProps {
    formData: any;
    setFormData: (data: any) => void;
}

const OrderMainForm: React.FC<OrderMainFormProps> = ({
    formData,
    setFormData,
}) => {
    return (
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">
            {/* PANEL SEBELAH KIRI: DATA UTAMA & LOKASI */}
            <div className="space-y-4">
                <h4 className="flex items-center gap-1.5 text-[#5346F1] border-b border-slate-50 pb-1.5">
                    <Layers size={13} /> Data Utama
                </h4>
                <div className="space-y-1">
                    <label className="pl-1">ID Pesanan</label>
                    <input
                        type="text"
                        disabled // ← KUNCI SAKRAL: Mengunci boks agar disable/read-only kaku tidak bisa diedit admin
                        value={formData?.id_pesanan || formData?.id || ""} // ← KUNCI UTAMA: Membaca id_pesanan database Anda
                        className="w-full p-2.5 bg-slate-50 border-none rounded-xl font-bold text-slate-400 cursor-not-allowed outline-none" // Ditambah text-slate-400 agar estetikanya pasif mengunci
                    />
                </div>
                <div className="space-y-1">
                    <label className="pl-1">Nama Pelanggan</label>
                    <input
                        type="text"
                        value={formData?.customerName || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                customerName: e.target.value,
                            })
                        }
                        className="w-full p-2.5 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none text-xs"
                    />
                </div>
                <div className="space-y-1">
                    <label className="pl-1">WhatsApp</label>
                    <div className="relative">
                        <Phone
                            size={12}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                        />
                        <input
                            type="text"
                            value={formData?.whatsapp || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    whatsapp: e.target.value,
                                })
                            }
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none text-xs"
                        />
                    </div>
                </div>
                <h4 className="flex items-center gap-1.5 text-slate-500 pt-2 border-b border-slate-50 pb-1.5">
                    <MapPin size={13} /> Lokasi
                </h4>
                <div className="space-y-1">
                    <label className="pl-1">Tujuan Utama</label>
                    <input
                        type="text"
                        value={formData?.destination || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                destination: e.target.value,
                            })
                        }
                        className="w-full p-2.5 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none text-xs"
                    />
                </div>
                <div className="space-y-1">
                    <label className="pl-1">Titik Jemput</label>
                    <input
                        type="text"
                        value={formData?.pickup || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, pickup: e.target.value })
                        }
                        className="w-full p-2.5 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none text-xs"
                    />
                </div>
                <div className="space-y-1">
                    <label className="pl-1">Jarak Tempuh (KM)</label>
                    <input
                        type="text"
                        placeholder="Contoh: 150"
                        value={formData?.distance || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                distance: e.target.value,
                            })
                        }
                        className="w-full p-2.5 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none text-xs"
                    />
                </div>
            </div>

            {/* PANEL TENGAH: LOGISTIK PERJALANAN & WAKTU */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                    <h4 className="flex items-center gap-1.5 text-slate-500">
                        <Bus size={13} /> Logistik Perjalanan
                    </h4>

                    {/* KUNCI PEMICU TAMBAH BARIS: Menyuntikkan pilihan armada baru saat diklik */}
                    <span
                        onClick={() => {
                            const currentFleet =
                                formData.fleetRequirements || [];
                            setFormData({
                                ...formData,
                                fleetRequirements: [
                                    ...currentFleet,
                                    { type: "Bus", qty: 1 },
                                ],
                            });
                        }}
                        className="text-[8px] text-indigo-600 font-black cursor-pointer hover:underline"
                    >
                        TAMBAH +
                    </span>
                </div>
                <div className="space-y-2">
                    <label className="pl-1">Kebutuhan Armada</label>

                    {/* PERBAIKAN: Mengganti kurung siku typo, dan menegaskan tipe data (fleet: any, index: number) */}
                    {(
                        formData.fleetRequirements || [{ type: "Bus", qty: 1 }]
                    ).map((fleet: any, index: number) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 animate-in fade-in duration-200"
                        >
                            <select
                                value={fleet.type}
                                onChange={(e) => {
                                    const updatedFleet = [
                                        ...formData.fleetRequirements,
                                    ];
                                    updatedFleet[index].type = e.target.value;
                                    setFormData({
                                        ...formData,
                                        fleetRequirements: updatedFleet,
                                    });
                                }}
                                className="flex-1 p-2 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none cursor-pointer text-xs"
                            >
                                <option value="Bus">Bus</option>
                                <option value="Medium Bus">Medium Bus</option>
                                <option value="Elf">Elf</option>
                                <option value="Mobil">Mobil</option>
                            </select>
                            <input
                                type="number"
                                min="1"
                                value={fleet.qty}
                                onChange={(e) => {
                                    const updatedFleet = [
                                        ...formData.fleetRequirements,
                                    ];
                                    updatedFleet[index].qty =
                                        parseInt(e.target.value) || 1;
                                    setFormData({
                                        ...formData,
                                        fleetRequirements: updatedFleet,
                                    });
                                }}
                                className="w-14 p-2 bg-slate-50 border-none rounded-xl font-bold text-slate-700 text-center outline-none text-xs"
                            />

                            {/* TOMBOL HAPUS BARIS: Menegaskan tipe data data filter (_: any, i: number) */}
                            {(formData.fleetRequirements || []).length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updatedFleet =
                                            formData.fleetRequirements.filter(
                                                (_: any, i: number) =>
                                                    i !== index,
                                            );
                                        setFormData({
                                            ...formData,
                                            fleetRequirements: updatedFleet,
                                        });
                                    }}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-black"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* REVISI: Mengubah tipe menjadi datetime-local agar memunculkan kalender & jam interaktif */}
                <div className="space-y-1.5 pt-2">
                    <label className="pl-1">Waktu Berangkat</label>
                    <input
                        type="datetime-local" // ← KUNCI WAKTU INTERAKTIF
                        value={formData.departureDate || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                departureDate: e.target.value,
                            })
                        }
                        className="w-full p-2.5 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="pl-1">Waktu Pulang</label>
                    <input
                        type="datetime-local" // ← KUNCI WAKTU INTERAKTIF
                        value={formData.returnDate || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                returnDate: e.target.value,
                            })
                        }
                        className="w-full p-2.5 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderMainForm;
