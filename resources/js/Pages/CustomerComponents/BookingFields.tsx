import React from "react";
import {
    User,
    Phone,
    MapPin,
    Bus,
    Plus,
    Trash2,
    Calendar,
    FileText,
} from "lucide-react";

interface MasterArmada {
    tipe_armada: string;
    kapasitas: number;
}

interface BookingFieldsProps {
    formData: any;
    setFormData: (key: string, value: any) => void;
    masterArmada: MasterArmada[];
}

const BookingFields: React.FC<BookingFieldsProps> = ({
    formData,
    setFormData,
    masterArmada = [],
}) => {
    // 🎨 CSS SIGNATURE ADMIN ARJUNA TRANS
    const headerStyle =
        "text-[10px] font-black uppercase tracking-widest text-[#5346F1] flex items-center gap-1.5 pb-1 border-b border-slate-50";
    const labelStyle =
        "text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1";
    const inputStyle =
        "w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none focus:border-[#5346F1] transition-all shadow-sm";

    // LOGIKA MULTI-ARMADA
    const addFleetRow = () => {
        setFormData("fleetRequirements", [
            ...formData.fleetRequirements,
            { type: "", qty: "" },
        ]);
    };

    const removeFleetRow = (index: number) => {
        const update = formData.fleetRequirements.filter(
            (_: any, i: number) => i !== index,
        );
        setFormData("fleetRequirements", update);
    };

    const updateFleetRow = (index: number, field: string, value: any) => {
        const update = [...formData.fleetRequirements];
        update[index][field] = value;
        setFormData("fleetRequirements", update);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-left">
                <h4 className={headerStyle}>
                    <User size={12} /> 1. Informasi Kontak
                </h4>

                <div className="space-y-1">
                    <label className={labelStyle}>Nama Pelanggan</label>
                    <input
                        type="text"
                        placeholder="Masukkan nama pelanggan..."
                        value={formData.name}
                        onChange={(e) => setFormData("name", e.target.value)}
                        className={inputStyle}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className={labelStyle}>WhatsApp</label>
                    <input
                        type="text"
                        placeholder="Contoh: 0812..."
                        value={formData.whatsapp}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, ""); // Buang yang bukan angka
                            if (val.length <= 15) {
                                setFormData("whatsapp", val);
                            }
                        }}
                        className={inputStyle}
                        maxLength={15}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className={labelStyle}>Alamat</label>
                    <textarea
                        rows={3}
                        placeholder="Masukkan alamat rumah..."
                        value={formData.address}
                        onChange={(e) => setFormData("address", e.target.value)}
                        className={`${inputStyle} resize-none`}
                        required
                    />
                </div>
            </div>
            <div className="space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#5346F1] flex items-center gap-1.5">
                        <Bus size={12} /> 2. Logistik Perjalanan
                    </h4>
                    <button
                        type="button"
                        onClick={addFleetRow}
                        className="text-[#5346F1] hover:text-[#4338CA] font-black text-[8px] uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                    >
                        <Plus size={9} /> Tambah
                    </button>
                </div>

                {/* DAFTAR INPUT ARMADA (GAYA ADMIN) */}
                <div className="space-y-2 max-h-[110px] overflow-y-auto pr-0.5 scrollbar-thin">
                    {formData.fleetRequirements.map((f: any, index: number) => (
                        <div
                            key={index}
                            className="space-y-1 border-b border-slate-50 pb-1.5 last:border-none"
                        >
                            <div className="flex justify-between items-center text-[7px] font-black text-slate-400 uppercase tracking-wider">
                                <span>Tipe Armada Ke-{index + 1}</span>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeFleetRow(index)}
                                        className="text-red-500 font-bold flex items-center gap-0.5"
                                    >
                                        <Trash2 size={9} /> Hapus
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2 items-center">
                                <select
                                    value={f.type}
                                    onChange={(e) =>
                                        updateFleetRow(
                                            index,
                                            "type",
                                            e.target.value,
                                        )
                                    }
                                    className="flex-1 p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none cursor-pointer"
                                    required
                                >
                                    <option value="">-- Pilih Tipe --</option>

                                    {/* Pastikan masterArmada ada dan merupakan array sebelum di-map */}
                                    {masterArmada && masterArmada.length > 0 ? (
                                        masterArmada.map(
                                            (item: any, idx: number) => (
                                                <option
                                                    key={idx}
                                                    value={item.tipe_armada}
                                                >
                                                    {item.tipe_armada} |{" "}
                                                    {item.kapasitas} Seat
                                                </option>
                                            ),
                                        )
                                    ) : (
                                        <option disabled>
                                            Data armada tidak tersedia
                                        </option>
                                    )}
                                </select>
                                <input
                                    type="number"
                                    // min="1"
                                    value={f.qty}
                                    placeholder="0"
                                    onChange={(e) =>
                                        updateFleetRow(
                                            index,
                                            "qty",
                                            parseInt(e.target.value) || "",
                                        )
                                    }
                                    className="w-12 p-1.5 bg-slate-50 border border-slate-100 rounded-xl font-black text-slate-800 text-xs text-center outline-none"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* TANGGAL & TUJUAN */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                        <label className={labelStyle}>Waktu Berangkat</label>
                        <input
                            type="datetime-local"
                            value={formData.departDate}
                            onChange={(e) =>
                                setFormData("departDate", e.target.value)
                            }
                            className={inputStyle}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={labelStyle}>Waktu Pulang</label>
                        <input
                            type="datetime-local"
                            value={formData.returnDate}
                            onChange={(e) =>
                                setFormData("returnDate", e.target.value)
                            }
                            className={inputStyle}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* FULL WIDTH: RUTE & CATATAN */}
            {/* SECTION 3: RUTE & DETAIL */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                {/* Header - Full Width */}
                <div className="md:col-span-2">
                    <h4 className={headerStyle}>
                        <FileText size={12} /> 3. Rute & Detail Perjalanan
                    </h4>
                </div>

                {/* Kolom Kiri: Tujuan Utama */}
                <div className="space-y-1">
                    <label className={labelStyle}>Tujuan Utama</label>
                    <input
                        type="text"
                        placeholder="Contoh: Yogyakarta"
                        value={formData.destination}
                        onChange={(e) =>
                            setFormData("destination", e.target.value)
                        }
                        className={inputStyle}
                        required
                    />
                </div>

                {/* Kolom Kanan: Titik Penjemputan */}
                <div className="space-y-1">
                    <label className={labelStyle}>Titik Penjemputan</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Contoh: Depan Balai Desa / Alamat Rumah"
                            value={formData.pickup}
                            onChange={(e) =>
                                setFormData("pickup", e.target.value)
                            }
                            className={`${inputStyle} pl-8`}
                            required
                        />
                        <MapPin
                            size={14}
                            className="absolute left-2.5 top-3 text-slate-400"
                        />
                    </div>
                </div>
                <div className="space-y-1 text-left">
                    <label className={labelStyle}>Rute Perjalanan</label>
                    <textarea
                        rows={3}
                        placeholder="Contoh: Start Kediri - Solo - Yogyakarta..."
                        value={formData.routeNotes}
                        onChange={(e) =>
                            setFormData("routeNotes", e.target.value)
                        }
                        className={`${inputStyle} resize-none`}
                        required
                    />
                </div>

                {/* Kolom Kanan: Catatan Lain-lain */}
                <div className="space-y-1 text-left">
                    <label className={labelStyle}>
                        Catatan Lain-lain (Opsional)
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Contoh: Permintaan kursi depan, bawa bayi, dll..."
                        value={formData.lain_lain}
                        onChange={(e) =>
                            setFormData("lain_lain", e.target.value)
                        }
                        className={`${inputStyle} resize-none`}
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingFields;
