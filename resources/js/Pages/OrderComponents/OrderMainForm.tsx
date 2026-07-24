import React, { useState, useEffect } from "react";
import { User, MapPin, Bus, FileText, Plus, Trash2 } from "lucide-react";

interface OrderMainFormProps {
    formData: any;
    setFormData: (data: any) => void;
    armada: any[];
}

const OrderMainForm: React.FC<OrderMainFormProps> = ({
    formData,
    setFormData,
    armada,
}) => {
    // Memastikan fleetRequirements selalu bertipe array dinamis yang aman
    const armadaList = Array.isArray(formData?.fleetRequirements)
        ? formData.fleetRequirements
        : [
              {
                  armada_id: "",
                  qty: 1,
              },
          ];

    useEffect(() => {
        console.log(formData.fleetRequirements);
    }, [formData.fleetRequirements]);

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
                            Alamat
                        </label>
                        <input
                            type="text"
                            placeholder="Masukkan alamat rumah..."
                            value={formData.customerAddress || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    customerAddress: e.target.value,
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

                {/* 3. LOGISTIK PERJALANAN (DENGAN INPUT DATA ARMADA MULTI-KOLOM DINAMIS) */}
                <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center pb-1 border-b border-slate-50">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#5346F1] flex items-center gap-1.5">
                            <Bus size={12} className="text-[#5346F1]" /> 3.
                            Logistik Perjalanan
                        </span>
                        {/* BUTTON TAMBAH KOLOM ARMADA BARU */}
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    fleetRequirements: [
                                        ...armadaList,
                                        {
                                            armada_id: "",
                                            qty: 1,
                                        },
                                    ],
                                })
                            }
                            className="text-[#5346F1] hover:text-[#4338CA] font-black text-[8px] uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                        >
                            <Plus size={9} /> Tambah
                        </button>
                    </div>

                    {/* WADAH INPUT SCROLLING KECIL KHUSUS DAFTAR ARMADA MULTI-BARIS */}
                    <div className="space-y-2 max-h-[110px] overflow-y-auto pr-0.5 scrollbar-thin">
                        {armadaList.map((f: any, index: number) => (
                            <div
                                key={index}
                                className="space-y-1 border-b border-slate-50 pb-1.5 last:border-none"
                            >
                                <div className="flex justify-between items-center text-[7px] font-black text-slate-400 uppercase tracking-wider">
                                    <span>Tipe Armada Ke-{index + 1}</span>
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    fleetRequirements:
                                                        armadaList.filter(
                                                            (
                                                                _: any,
                                                                i: number,
                                                            ) => i !== index,
                                                        ),
                                                })
                                            }
                                            className="text-red-500 font-bold flex items-center gap-0.5"
                                        >
                                            <Trash2 size={9} /> Hapus
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <select
                                        // Gunakan tipe_armada (atau armada_id yang sekarang isinya string tipe)
                                        value={f.armada_id || ""}
                                        onChange={(e) => {
                                            const update = [...armadaList];
                                            update[index].armada_id =
                                                e.target.value;
                                            update[index].tipe_armada =
                                                e.target.value; // sinkronkan
                                            setFormData({
                                                ...formData,
                                                fleetRequirements: update,
                                            });
                                        }}
                                        className="flex-1 p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none cursor-pointer"
                                    >
                                        <option value="">
                                            -- Pilih Tipe --
                                        </option>

                                        {armada
                                            // Ambil list unik berdasarkan tipe_armada
                                            ?.filter(
                                                (obj, idx, self) =>
                                                    idx ===
                                                    self.findIndex(
                                                        (t) =>
                                                            t.tipe_armada ===
                                                            obj.tipe_armada,
                                                    ),
                                            )
                                            .map((a: any) => {
                                                // Logika cek apakah tipe ini sudah dipilih di baris lain
                                                const isTypeTaken =
                                                    armadaList.some(
                                                        (
                                                            item: any,
                                                            itemIdx: number,
                                                        ) =>
                                                            itemIdx !== index &&
                                                            item.armada_id ===
                                                                a.tipe_armada,
                                                    );

                                                return (
                                                    <option
                                                        key={a.tipe_armada} // Gunakan tipe sebagai key
                                                        value={a.tipe_armada} // Value adalah STRING "Big Bus", "Elf", dll
                                                        disabled={isTypeTaken}
                                                    >
                                                        {a.tipe_armada}{" "}
                                                        {isTypeTaken
                                                            ? "(SUDAH DIPILIH)"
                                                            : `| ${a.kapasitas} Seat`}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="0"
                                        value={f.qty === "" ? "" : f.qty || ""}
                                        onChange={(e) => {
                                            const hanyaAngka =
                                                e.target.value.replace(
                                                    /[^0-9]/g,
                                                    "",
                                                );

                                            const update = [...armadaList];
                                            update[index].qty =
                                                hanyaAngka === ""
                                                    ? 0
                                                    : parseInt(hanyaAngka);
                                            setFormData({
                                                ...formData,
                                                fleetRequirements: update,
                                            });
                                        }}
                                        className="w-12 p-1.5 bg-slate-50 border border-slate-100 rounded-xl font-black text-slate-800 text-xs text-center outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-1 pt-1">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {/* BOKS RUTE PERJALANAN (BAWAAN ASLI ANDA) */}
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#5346F1] flex items-center gap-1 mb-1">
                        <FileText size={12} /> 4. Rute Perjalanan & Keterangan
                    </span>
                    <textarea
                        rows={2}
                        placeholder="Ketik rute lengkap (Contoh: Cilacap - Yogyakarta - Cilacap)..."
                        value={formData.routeNotes || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                routeNotes: e.target.value,
                            })
                        }
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 text-xs outline-none resize-none focus:bg-white focus:border-indigo-100 transition-all"
                    />
                </div>

                {/* CATATAN OPERASIONAL LAIN-LAIN PO ARJUNA TRANS */}
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#5346F1] flex items-center gap-1 mb-1">
                        📝 Catatan Khusus / Lain-Lain
                    </span>
                    <textarea
                        rows={2}
                        placeholder="Contoh: Minta driver pak Bambang, Include Tol, bus wajib wangi..."
                        value={formData.lain_lain || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                lain_lain: e.target.value,
                            })
                        }
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 text-xs outline-none resize-none focus:bg-white focus:border-indigo-100 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderMainForm;
