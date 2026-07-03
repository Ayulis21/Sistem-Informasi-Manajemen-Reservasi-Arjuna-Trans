import React from "react";
import { User, Phone, MapPin, Calendar, Bus } from "lucide-react";

interface BookingFieldsProps {
    formData: any;
    setFormData: (data: any) => void;
}

const BookingFields: React.FC<BookingFieldsProps> = ({
    formData,
    setFormData,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[9px] font-black uppercase tracking-widest text-[#94A3B8]">
            {/* ========================================================================= */}
            {/* KOLOM SEBELAH KIRI: INFORMASI KONTAK                                      */}
            {/* ========================================================================= */}
            <div className="space-y-4">
                <h4 className="text-[#5346F1] font-black tracking-wider text-[10px] pb-1 border-b border-slate-50">
                    Informasi Kontak
                </h4>

                <div className="space-y-1.5">
                    <label className="pl-1">Nama Lengkap</label>
                    <div className="relative">
                        <User
                            size={13}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                        />
                        <input
                            type="text"
                            placeholder="Contoh: Pak Andi"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="pl-1">WhatsApp (Utama)</label>
                    <div className="relative">
                        <Phone
                            size={13}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                        />
                        <input
                            type="text"
                            placeholder="Contoh: 081234567890"
                            value={formData.whatsapp}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    whatsapp: e.target.value,
                                })
                            }
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="pl-1">Alamat Domisili</label>
                    <textarea
                        rows={4}
                        placeholder="Alamat penagihan..."
                        value={formData.address}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                address: e.target.value,
                            })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none text-xs leading-relaxed"
                        required
                    />
                </div>
            </div>

            {/* ========================================================================= */}
            {/* KOLOM SEBELAH KANAN: DETAIL PERJALANAN                                    */}
            {/* ========================================================================= */}
            <div className="space-y-4">
                <h4 className="text-[#5346F1] font-black tracking-wider text-[10px] pb-1 border-b border-slate-50">
                    Detail Perjalanan
                </h4>

                {/* Baris Tanggal Berangkat & Pulang Sejajar */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="pl-1">Keberangkatan</label>
                        <input
                            type="date"
                            value={formData.departDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    departDate: e.target.value,
                                })
                            }
                            className="w-full p-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 outline-none cursor-pointer"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="pl-1">Pulang</label>
                        <input
                            type="date"
                            value={formData.returnDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    returnDate: e.target.value,
                                })
                            }
                            className="w-full p-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 outline-none cursor-pointer"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="pl-1">Titik Jemput</label>
                    <input
                        type="text"
                        placeholder="Jl. Raya No. 123..."
                        value={formData.pickup}
                        onChange={(e) =>
                            setFormData({ ...formData, pickup: e.target.value })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="pl-1">Tujuan Utama</label>
                    <input
                        type="text"
                        placeholder="Contoh: Pantai Pangandaran"
                        value={formData.destination}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                destination: e.target.value,
                            })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="pl-1">Rute Perjalanan</label>
                    <textarea
                        rows={2}
                        placeholder="Sebutkan rute yang akan dilewati (Contoh: Cilacap - Bandung - Lembang - Cilacap)"
                        value={formData.routeNotes}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                routeNotes: e.target.value,
                            })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none text-xs leading-relaxed"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingFields;
