import React from "react";
import { User, Phone, MapPin, Calendar, FileText } from "lucide-react";

interface BookingFieldsProps {
    formData: any;
    setFormData: (data: any) => void;
}

const BookingFields: React.FC<BookingFieldsProps> = ({
    formData,
    setFormData,
}) => {
    // Gaya CSS Signature Admin Arjuna Trans
    const labelStyle =
        "text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1";
    const inputStyle =
        "w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none focus:border-[#5346F1] transition-all shadow-sm";
    const headerStyle =
        "text-[10px] font-black uppercase tracking-widest text-[#5346F1] flex items-center gap-1.5 pb-1 border-b border-slate-50";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. INFORMASI KONTAK */}
            <div className="space-y-4 text-left">
                <h4 className={headerStyle}>
                    <User size={12} /> 1. Informasi Kontak
                </h4>

                <div className="space-y-1">
                    <label className={labelStyle}>Nama Lengkap</label>
                    <input
                        type="text"
                        placeholder="Masukkan nama sesuai KTP..."
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className={inputStyle}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className={labelStyle}>WhatsApp (Wajib Aktif)</label>
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
                        className={inputStyle}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className={labelStyle}>Alamat Domisili</label>
                    <textarea
                        rows={3}
                        placeholder="Alamat lengkap untuk penagihan..."
                        value={formData.address}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                address: e.target.value,
                            })
                        }
                        className={`${inputStyle} resize-none`}
                        required
                    />
                </div>
            </div>

            {/* 2. DETAIL PERJALANAN */}
            <div className="space-y-4 text-left">
                <h4 className={headerStyle}>
                    <MapPin size={12} /> 2. Detail Perjalanan
                </h4>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className={labelStyle}>
                            Tgl & Jam Berangkat
                        </label>
                        <input
                            type="datetime-local"
                            lang="id-ID" // 🎯 KUNCI: Memancing format 24 Jam di browser
                            value={formData.departDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    departDate: e.target.value,
                                })
                            }
                            className={inputStyle}
                            required
                        />
                        <p className="text-[7px] text-slate-400 italic pl-1">
                            *Cek kembali Jam Keberangkatan
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className={labelStyle}>Tgl & Jam Pulang</label>
                        <input
                            type="datetime-local"
                            lang="id-ID" // 🎯 KUNCI: Memancing format 24 Jam di browser
                            value={formData.returnDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    returnDate: e.target.value,
                                })
                            }
                            className={inputStyle}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className={labelStyle}>Titik Penjemputan</label>
                    <input
                        type="text"
                        placeholder="Lokasi jemput (Sekolah/Kantor/Rumah)..."
                        value={formData.pickup}
                        onChange={(e) =>
                            setFormData({ ...formData, pickup: e.target.value })
                        }
                        className={inputStyle}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className={labelStyle}>Tujuan Utama</label>
                    <input
                        type="text"
                        placeholder="Contoh: Pantai Pangandaran / Bali"
                        value={formData.destination}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                destination: e.target.value,
                            })
                        }
                        className={inputStyle}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className={labelStyle}>
                        Rute Perjalanan & Catatan Khusus
                    </label>
                    <textarea
                        rows={2}
                        placeholder="Contoh: Lewat jalur selatan, Minta unit bus terbaru..."
                        value={formData.routeNotes}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                routeNotes: e.target.value,
                            })
                        }
                        className={`${inputStyle} resize-none`}
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingFields;
