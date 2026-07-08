import React from "react";
import { User, MapPin, Bus, FileText } from "lucide-react";

interface OrderMainFormProps {
    formData: any;
    setFormData: (data: any) => void;
}

const OrderMainForm: React.FC<OrderMainFormProps> = ({
    formData,
    setFormData,
}) => {
    const armadaArray = formData?.fleetRequirements;
    const armadaUtama =
        Array.isArray(armadaArray) && armadaArray.length > 0
            ? armadaArray[0]
            : { type: "Bus", qty: 1 };

    return (
        <div className="space-y-5">
            {/* GRID BARIS ATAS: DATA UTAMA, LOKASI, LOGISTIK */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* 1. DATA UTAMA */}
                <div className="space-y-3 text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#5346F1] flex items-center gap-1.5 pb-1 border-b border-slate-50">
                        <User size={12} className="text-[#5346F1]" /> 1. Data
                        Utama
                    </span>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                            ID Pesanan
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={formData.id_pesanan || ""}
                            placeholder="ORD-XXXXXXXXXX"
                            className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-500 text-xs outline-none select-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                            Nama Pelanggan
                        </label>
                        <input
                            type="text"
                            placeholder="Masukkan nama pelanggan..."
                            value={formData.customerName || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    customerName: e.target.value,
                                })
                            }
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                            WhatsApp
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: 0812..."
                            value={formData.whatsapp || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    whatsapp: e.target.value,
                                })
                            }
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none"
                        />
                    </div>
                </div>

                {/* 2. LOKASI */}
                <div className="space-y-3 text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#5346F1] flex items-center gap-1.5 pb-1 border-b border-slate-50">
                        <MapPin size={12} className="text-[#5346F1]" /> 2.
                        Lokasi
                    </span>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                            Tujuan Utama
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: Yogyakarta"
                            value={formData.destination || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    destination: e.target.value,
                                })
                            }
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                            Titik Jemput
                        </label>
                        <input
                            type="text"
                            placeholder="Masukkan lokasi penjemputan..."
                            value={formData.pickup || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    pickup: e.target.value,
                                })
                            }
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                            Jarak Tempuh (KM)
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Contoh: 150"
                            value={formData.distance || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    distance: e.target.value.replace(
                                        /[^0-9]/g,
                                        "",
                                    ),
                                })
                            }
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none"
                        />
                    </div>
                </div>

                {/* 3. LOGISTIK PERJALANAN */}
                <div className="space-y-3 text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#5346F1] flex items-center gap-1.5 pb-1 border-b border-slate-50">
                        <Bus size={12} className="text-[#5346F1]" /> 3. Logistik
                        Perjalanan
                    </span>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                            Kebutuhan Armada
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={armadaUtama.type || "Bus"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        fleetRequirements: [
                                            {
                                                type: e.target.value,
                                                qty: armadaUtama.qty || 1,
                                            },
                                        ],
                                    })
                                }
                                className="flex-1 p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none cursor-pointer"
                            >
                                <option value="Bus">Bus</option>
                                <option value="Medium Bus">Medium Bus</option>
                                <option value="Hiace">Hiace</option>
                            </select>
                            <input
                                type="number"
                                min="1"
                                value={armadaUtama.qty || 1}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        fleetRequirements: [
                                            {
                                                type: armadaUtama.type || "Bus",
                                                qty:
                                                    parseInt(e.target.value) ||
                                                    1,
                                            },
                                        ],
                                    })
                                }
                                className="w-12 p-1.5 bg-slate-50 border border-slate-100 rounded-xl font-black text-slate-800 text-xs text-center outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                            Waktu Berangkat
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.departureDate || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    departureDate: e.target.value,
                                })
                            }
                            className="w-full h-8 p-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs outline-none cursor-pointer"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                            Waktu Pulang
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.returnDate || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    returnDate: e.target.value,
                                })
                            }
                            className="w-full h-8 p-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs outline-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* 4. RUTE PERJALANAN & KETERANGAN (MEMANJANG FULL DI TENGAH) */}
            <div className="space-y-1 text-left pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#5346F1] flex items-center gap-1.5 mb-1.5">
                    <FileText size={12} className="text-[#5346F1]" /> 4. Rute
                    Perjalanan & Keterangan
                </span>
                <textarea
                    rows={2}
                    placeholder="Ketik rute lengkap (Contoh: Cilacap - Yogyakarta - Cilacap)..."
                    value={formData.routeNotes || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, routeNotes: e.target.value })
                    }
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 text-xs outline-none resize-none focus:bg-white focus:border-indigo-100 transition-all"
                />
            </div>
        </div>
    );
};

export default OrderMainForm;
