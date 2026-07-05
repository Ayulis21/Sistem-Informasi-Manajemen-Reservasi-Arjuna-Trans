import React, { useState } from "react";
import { Calendar, FileText, Upload, Eye } from "lucide-react";
import axios from "axios";

interface OrderFinanceFormProps {
    formData: any;
    setFormData: (data: any) => void;
    fetchOrdersData: () => void;
}

const OrderFinanceForm: React.FC<OrderFinanceFormProps> = ({
    formData,
    setFormData,
}) => {
    // =========================================================================
    // REVISI RUMUS AKUNTANSI: JIKA STATUS 'DITOLAK', TAGIHAN TIDAK AKAN BERKURANG!
    // =========================================================================
    const totalSewa = Number(formData.totalPrice || 0);
    const uangMasuk = Number(formData.paidAmount || 0);

    // Jika status pembayaran ditolak admin, uang masuk otomatis dianggap Rp 0 (Batal/Tidak Sah)
    const uangSah = formData.paymentStatus === "Ditolak" ? 0 : uangMasuk;

    // Rumus final pengisi boks hitam gendut Anda
    const sisaTagihan = totalSewa - uangSah;

    // State lokal khusus untuk memunculkan popup melayang foto struk di dalam form
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleVerifyPayment = async (statusBaru: string) => {
        const idPesanan = formData.id_pesanan || formData.id;
        if (!idPesanan) {
            alert(
                "⚠️ Keterangan: ID Pesanan tidak terdeteksi dalam mode tambah baru.",
            );
            return;
        }

        const nominalUang = Number(formData.paidAmount || 0);
        if (nominalUang <= 0) {
            alert(
                "❌ Gagal Validasi: Nominal uang pembayaran (Rp) tidak boleh kosong atau Rp 0 untuk dapat disetujui/ditolak!",
            );
            return;
        }

        // =========================================================================
        // REVISI INPUT ALASAN: MEMINTA KETIKAN TEKS JIKA TOMBOL TOLAK DIKLIK
        // =========================================================================
        let catatanFinal =
            formData.catatan_pembayaran || "Pembayaran Reservasi Bus";

        if (statusBaru === "Ditolak") {
            const alasanInput = prompt(
                "❌ ALASAN PENOLAKAN:\nMohon ketik alasan mengapa bukti transfer pembayaran ini ditolak:",
            );

            // Jika admin menekan tombol 'Cancel' pada boks prompt, batalkan proses verifikasi
            if (alasanInput === null) return;

            // Jika admin mengosongkan teks ketikan alasan, kunci kaku agar wajib diisi
            if (alasanInput.trim() === "") {
                alert(
                    "❌ Gagal: Alasan penolakan bukti transfer wajib diketik dan tidak boleh kosong!",
                );
                return;
            }

            catatanFinal = `DITOLAK: ${alasanInput.trim()}`;
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
                        // Mengirimkan teks alasan penolakan baru secara instan menuju server Laravel
                        catatan_pembayaran: catatanFinal,
                    },
                );

                alert("✨ Sukses: " + response.data.message);

                // Sinkronisasikan isi teks boks catatan dan status di layar visual saat itu juga
                setFormData({
                    ...formData,
                    paymentStatus: statusBaru,
                    catatan_pembayaran: catatanFinal,
                });
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
                        // KUNCI SAKRAL: Diubah mengikat variabel catatan_pembayaran yang anti-bocor!
                        value={formData.catatan_pembayaran || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                catatan_pembayaran: e.target.value,
                            })
                        }
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs outline-none"
                    />
                </div>
                {/* ========================================================================= */}
                {/* REVISI PROTEKSI: ANTI-DUPLIKAT & LOCK STATUS JIKA SUDAH DISETUJUI / DITOLAK */}
                {/* ========================================================================= */}
                <div className="pt-3 border-t border-slate-200/60 space-y-2">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-slate-400">
                        <span>Status Bukti</span>
                        <span
                            className={`px-1.5 py-0.5 rounded text-[7px] ${
                                formData.paymentStatus === "Disetujui"
                                    ? "bg-emerald-50 text-emerald-500 border border-emerald-100"
                                    : formData.paymentStatus === "Ditolak"
                                      ? "bg-red-50 text-red-500 border border-red-100"
                                      : "bg-amber-50 text-amber-500 border border-amber-100"
                            }`}
                        >
                            {formData.paymentStatus || "Pending"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => {
                                // Kondisi 1: Jika admin baru saja klik upload file gambar baru dari laptop
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
                                // Kondisi 2: Jika data sudah disimpan dan memiliki file fisik asli di database MySQL
                                else if (
                                    formData.bukti_transfer &&
                                    formData.bukti_transfer !==
                                        "bukti_default.jpg"
                                ) {
                                    setPreviewUrl(
                                        `/uploads/bukti_transfer/${formData.bukti_transfer}`,
                                    );
                                }
                                // Kondisi 3: Jika belum ada gambar sama sekali, setel string penanda khusus
                                else {
                                    setPreviewUrl("BELUM_ADA_GAMBAR");
                                }
                            }}
                            className="p-2 bg-indigo-50 text-[#5346F1] rounded-xl hover:bg-indigo-100 transition-all flex items-center justify-center"
                            title="Lihat Bukti Transfer"
                        >
                            <Eye size={12} />
                        </button>

                        {/* JIKA STATUS MASIH PENDING, TAMPILKAN TOMBOL AKSI VERIFIKASI AKTIF */}
                        {!formData.paymentStatus ||
                        formData.paymentStatus === "Pending" ? (
                            <>
                                {/* 2. TOMBOL SESUAI - REVISI ANTI TRIGGER GANDA */}
                                <button
                                    type="button" // Mengunci tipe button kaku agar tidak memicu submit form utama
                                    onClick={(e) => {
                                        e.preventDefault(); // Memotong aksi bawaan browser
                                        e.stopPropagation(); // Menghentikan gelembung aksi naik ke form induk
                                        handleVerifyPayment("Disetujui");
                                    }}
                                    className="flex-1 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all text-center"
                                >
                                    Sesuai
                                </button>

                                {/* 3. TOMBOL TOLAK - REVISI ANTI TRIGGER GANDA */}
                                <button
                                    type="button" // Mengunci tipe button kaku agar tidak memicu submit form utama
                                    onClick={(e) => {
                                        e.preventDefault(); // Memotong aksi bawaan browser
                                        e.stopPropagation(); // Menghentikan gelembung aksi naik ke form induk
                                        handleVerifyPayment("Ditolak");
                                    }}
                                    className="flex-1 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all text-center"
                                >
                                    Tolak
                                </button>
                            </>
                        ) : (
                            // JIKA STATUS SUDAH 'DISETUJUI' ATAU 'DITOLAK', KUNCI MATI FORM & BERI LABEL NOTIFIKASI AMAN
                            <div className="flex-1 py-2 bg-slate-50 text-slate-400 rounded-xl text-[8px] font-black uppercase tracking-widest text-center border border-slate-100 cursor-not-allowed">
                                🔒 VERIFIKASI FINAL KUNCI
                            </div>
                        )}
                    </div>
                </div>
                {/* OVERLAY POPUP MELAYANG PREVIEW FOTO STRUK ARJUNA TRANS (100% KEMBAR PERSIS GAMBAR ANDA) */}
                {previewUrl && (
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setPreviewUrl(null)}
                    >
                        {/* Box Putih Melayang Lebar Melengkung Cantik Mengikuti Skala Gambar Anda */}
                        <div
                            className="bg-white p-6 rounded-[2.5rem] max-w-sm w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-center animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* KONDISI CEK GAMBAR DINAMIS */}
                            {previewUrl === "BELUM_ADA_GAMBAR" ? (
                                // TAMPILAN TEXT KETERANGAN JIKA BELUM ADA GAMBAR (DESAIN BERSIH & RAPI)
                                <div className="py-16 flex flex-col items-center justify-center space-y-2">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                        Belum Ada Berkas Gambar
                                    </p>
                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">
                                        Silakan Upload Bukti Transfer Terlebih
                                        Dahulu
                                    </span>
                                </div>
                            ) : (
                                // TAMPILAN GAMBAR FISIK STRUK / DENAH PLOT JIKA DATA SUDAH TERSEDIA NYATA
                                <img
                                    src={previewUrl}
                                    alt="Struk Transfer PO Arjuna Trans"
                                    className="w-full h-auto rounded-[1.5rem] object-contain max-h-[55vh] mb-4 border border-slate-50"
                                />
                            )}

                            {/* TOMBOL HITAM GENDUT SAKRAL "TUTUP STRUK" BAWAAN TEMPLATE ASLI ANDA */}
                            <button
                                type="button"
                                onClick={() => setPreviewUrl(null)}
                                className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md mt-2"
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
function fetchOrdersData() {
    throw new Error("Function not implemented.");
}
