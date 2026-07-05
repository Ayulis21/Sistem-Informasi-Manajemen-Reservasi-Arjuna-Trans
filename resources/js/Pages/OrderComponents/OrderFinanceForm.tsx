import React, { useState } from "react";
import { Calendar, FileText, Upload, Eye } from "lucide-react";
import axios from "axios";

interface OrderFinanceFormProps {
    formData: any;
    setFormData: (data: any) => void;
}

const OrderFinanceForm: React.FC<OrderFinanceFormProps> = ({
    formData,
    setFormData,
}) => {
    // Kalkulasi nilai sisa piutang secara dinamis (Total Sewa dikurangi Uang Masuk)
    const sisaTagihan =
        Number(formData.totalPrice || 0) - Number(formData.paidAmount || 0);
    // State lokal khusus untuk memunculkan popup melayang foto struk di dalam form
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Fungsi lokal untuk menembak status verifikasi pembayaran lurus ke Laravel
    const handleVerifyPayment = async (statusBaru: string) => {
        const idPesanan = formData.id_pesanan || formData.id;
        if (!idPesanan) {
            alert(
                "⚠️ Keterangan: ID Pesanan tidak terdeteksi dalam mode tambah baru.",
            );
            return;
        }

        if (
            confirm(
                `Apakah Anda yakin ingin menandai bukti transfer ini sebagai ${statusBaru.toUpperCase()}?`,
            )
        ) {
            try {
                const response = await axios.put(
                    `/api/admin/pembayaran/verifikasi/${idPesanan}`,
                    {
                        status_pembayaran: statusBaru,
                    },
                );
                alert("✨ Sukses: " + response.data.message);

                // Memperbarui status pembayaran di state form agar visual ikut berubah
                setFormData({ ...formData, paymentStatus: statusBaru });
            } catch (error) {
                alert("❌ Gagal memperbarui status bukti pembayaran.");
            }
        }
    };
    return (
        <div className="space-y-4 text-[10px] font-black uppercase tracking-widest text-[#94A3B8] text-left">
            <h4 className="flex items-center gap-1.5 text-slate-500 border-b border-slate-50 pb-1.5">
                <FileText size={13} /> Keuangan
            </h4>

            {/* 1. INPUT TOTAL SEWA */}
            <div className="space-y-1">
                <label className="pl-1">Total Sewa (Rp)</label>
                <input
                    type="number"
                    value={formData.totalPrice || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            totalPrice: parseFloat(e.target.value) || 0,
                        })
                    }
                    className="w-full p-3 bg-indigo-50/50 text-[#5346F1] border-none rounded-xl font-black text-xs outline-none"
                />
            </div>

            {/* 2. INPUT JATUH TEMPO KALENDER */}
            <div className="space-y-1">
                <label className="pl-1">Jatuh Tempo</label>
                <input
                    type="date"
                    value={formData.dueDate || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none text-xs"
                />
            </div>

            {/* AREA INPUT TERMIN PEMBAYARAN DP / PELUNASAN */}
            <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-[8px] text-slate-400">
                        Pembayaran Awal
                    </span>
                    <span className="text-[7px] text-indigo-600 font-bold cursor-pointer">
                        TERIKAT DB
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={formData.paymentType || "DP"}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                paymentType: e.target.value,
                            })
                        }
                        className="p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer text-xs"
                    >
                        <option value="DP">DP</option>
                        <option value="Cicil">Cicil</option>
                        <option value="Lunas">Lunas</option>
                    </select>

                    {/* REVISI UNGU: Mengubah tombol menjadi pembungkus input file asli agar bisa klik pilih foto */}
                    <label className="flex-1 py-2 bg-[#5346F1] hover:bg-[#4338CA] text-white text-[8px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm">
                        <Upload size={10} />
                        <span>
                            {formData.evidenceFile
                                ? "Foto Terpilih ✓"
                                : "Upload Bukti"}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden" // Menyembunyikan tampilan kaku asli browser agar estetika ungu Anda tetap terjaga
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setFormData({
                                        ...formData,
                                        evidenceFile: e.target.files[0],
                                    });
                                }
                            }}
                        />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[8px]">
                    {/* TANGGAL BAYAR KALENDER */}
                    <div className="space-y-1">
                        <label>Tanggal Bayar</label>
                        <input
                            type="date"
                            value={formData.paymentDate || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    paymentDate: e.target.value,
                                })
                            }
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs"
                        />
                    </div>

                    {/* NOMINAL UANG MASUK */}
                    <div className="space-y-1">
                        <label>Nominal (Rp)</label>
                        <input
                            type="number"
                            value={formData.paidAmount || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    paidAmount: parseFloat(e.target.value) || 0,
                                })
                            }
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs"
                        />
                    </div>
                </div>
                {/* INPUT BARU: CATATAN PEMBAYARAN TEKS */}
                <div className="space-y-1 pt-1">
                    <label className="text-[7px]">
                        Catatan / Keterangan Bayar
                    </label>
                    <input
                        type="text"
                        placeholder="Misal: DP Sewa Bus Pariwisata"
                        value={formData.paymentNotes || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                paymentNotes: e.target.value,
                            })
                        }
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs outline-none"
                    />
                </div>
                {/* AREA STATUS BUKTI OPERASIONAL DI PANEL PEMBAYARAN KANAN ANDA */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-slate-400">
                        <span>Status Bukti</span>
                        <span
                            className={`px-1.5 py-0.5 rounded text-[8px] ${
                                formData.paymentStatus === "Disetujui"
                                    ? "bg-emerald-50 text-emerald-500"
                                    : "bg-amber-50 text-amber-500"
                            }`}
                        >
                            {formData.paymentStatus || "Pending"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {/* ========================================================================= */}
                        {/* KUNCI SAKRAL PREVIEW: MENAMPILKAN FOTO REAL DARI SEBELUM & SESUDAH SIMPAN */}
                        {/* ========================================================================= */}
                        <button
                            type="button"
                            onClick={() => {
                                // KONDISI 1: Jika admin baru saja klik upload file gambar baru dari laptop (Preview Berjalan Mulus)
                                if (
                                    formData.evidenceFile &&
                                    typeof formData.evidenceFile !== "string"
                                ) {
                                    setPreviewUrl(
                                        URL.createObjectURL(
                                            formData.evidenceFile,
                                        ),
                                    );
                                }
                                // KONDISI 2: Jika data sudah disimpan, baca file fisiknya dari folder publik upload Laravel Anda!
                                else if (
                                    formData.bukti_transfer &&
                                    formData.bukti_transfer !==
                                        "bukti_default.jpg"
                                ) {
                                    setPreviewUrl(
                                        `/uploads/bukti_transfer/${formData.bukti_transfer}`,
                                    );
                                }
                                // KONDISI 3: Fallback darurat jika data struk di database masih kosong polos bawaan sistem
                                else {
                                    const svgString = `<svg xmlns="http://w3.org" width="300" height="400" viewBox="0 0 300 400"><rect width="100%" height="100%" fill="#F8FAFC"/><text x="50%" y="45%" font-family="sans-serif" font-weight='bold' font-size='14' fill='#64748B' text-anchor='middle'>STRUK BELUM DIUPLOAD</text><text x='50%' y='53%' font-family='sans-serif' font-size='10' fill='%2394A3B8' text-anchor='middle'>PO. ARJUNA TRANS</text></svg>`;
                                    setPreviewUrl(
                                        `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`,
                                    );
                                }
                            }}
                            className="p-2 bg-indigo-50 text-[#5346F1] rounded-xl hover:bg-indigo-100 transition-all flex items-center justify-center"
                        >
                            <Eye size={12} />
                        </button>

                        {/* 2. TOMBOL SESUAI HIJAU MEWAH ANDA */}
                        <button
                            type="button"
                            onClick={() => handleVerifyPayment("Disetujui")}
                            className="flex-1 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all text-center"
                        >
                            Sesuai
                        </button>

                        {/* 3. TOMBOL TOLAK MERAH MUDA ANDA */}
                        <button
                            type="button"
                            onClick={() => handleVerifyPayment("Ditolak")}
                            className="flex-1 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all text-center"
                        >
                            Tolak
                        </button>
                    </div>
                </div>

                {/* OVERLAY POPUP MELAYANG PREVIEW FOTO STRUK DARI DALAM FORM KANAN */}
                {previewUrl && (
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        onClick={() => setPreviewUrl(null)}
                    >
                        <div
                            className="bg-white p-3 rounded-[2rem] max-w-sm w-full relative shadow-2xl animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* KUNCI SAKRAL UTAMA: Pastikan tag src membaca variabel 'previewUrl' lokal Anda! */}
                            <img
                                src={previewUrl} // ← KUNCI PENYEMBUHAN MUTLAK GAMBAR KELUAR
                                alt="Struk Transfer PO Arjuna Trans"
                                className="w-full h-auto rounded-[1.5rem] object-contain max-h-[60vh]"
                            />

                            <button
                                type="button"
                                onClick={() => setPreviewUrl(null)}
                                className="mt-3 w-full py-2 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest"
                            >
                                Tutup Struk
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* BOKS HITAM GENDUT SISA TAGIHAN (OTOMATIS BERKURANG REAL-TIME) */}
            <div className="bg-slate-950 rounded-2xl p-4 flex items-center justify-between text-white shadow-md shadow-slate-900/10">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                    Sisa Piutang:
                </span>
                <span
                    className={`text-sm font-black ${sisaTagihan <= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                    Rp {sisaTagihan.toLocaleString("id-ID")}
                </span>
            </div>
        </div>
    );
};

export default OrderFinanceForm;
