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
    const totalHarga = Number(formData.totalPrice || 0);

    // Secara cerdas menjumlahkan berapapun nominal (amount) dari seluruh kolom pembayaran yang ditambah admin
    const totalUangMasuk = (formData.payments || []).reduce(
        (total: number, p: any) => {
            // Hanya menghitung nominal pembayaran yang valid dan tidak ditolak oleh admin
            const nominalBaris =
                p.paymentStatus === "Ditolak" ? 0 : Number(p.amount || 0);
            return total + nominalBaris;
        },
        0,
    );

    // Rumus final sisa piutang PO Arjuna Trans Anda
    const sisaTagihan = totalHarga - totalUangMasuk;

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
                        catatan_pembayaran: catatanFinal,
                    },
                );

                alert("✨ Sukses: " + response.data.message);

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

            {/* BARIS JUDUL TETAP STATIS DI ATAS (TIDAK IKUT TER-SCROLL) */}
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">
                <label>Pembayaran Awal</label>
                <button
                    type="button"
                    onClick={() => {
                        // KUNCI CETAKAN KOSONG: Menjamin baris baru lahir murni kosong melos tanpa copas data atas!
                        const barisBaruKosong = {
                            type: "Cicilan",
                            date: new Date().toISOString().substring(0, 10),
                            amount: 0,
                            notes: "",
                            evidenceFile: null,
                            bukti_transfer: "bukti_default.jpg",
                            paymentStatus: "Pending",
                        };

                        setFormData({
                            ...formData,
                            payments: [
                                ...(formData.payments || []),
                                barisBaruKosong,
                            ],
                        });
                    }}
                    className="text-[#5346F1] hover:text-[#4338CA] transition-colors font-black text-[9px] uppercase tracking-wider cursor-pointer"
                >
                    TAMBAH +
                </button>
            </div>

            {/* 📦 AWAL BUNGKUSAN SCROLL: Mengunci tinggi maksimal 230px dan memicu scroll otomatis */}
            <div className="max-h-[230px] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-3">
                    {/* ========================================================================= */}
                    {/* REVISI INTEGRASI PART 2: MENGIKAT VARIABEL KE INDEX MANDIRI (0 DUPLIKAT)  */}
                    {/* ========================================================================= */}
                    {(formData.payments || []).map((p: any, index: number) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-[1.5rem] border border-slate-100 space-y-3 relative mt-2 first:mt-0 text-left"
                        >
                            {/* Baris Urutan Judul & Tombol Hapus Baris */}
                            <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                <span>Pembayaran Ke-{index + 1}</span>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const saringan =
                                                formData.payments.filter(
                                                    (_: any, i: number) =>
                                                        i !== index,
                                                );
                                            setFormData({
                                                ...formData,
                                                payments: saringan,
                                            });
                                        }}
                                        className="text-red-500 hover:text-red-600 font-black text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>

                            {/* Dropdown Pilihan Tipe & Tombol Ungu Upload Bukti Per Baris Mandiri */}
                            <div className="flex items-center gap-2">
                                <select
                                    value={p.type || "DP"} // 🎯 KUNCI 1: Mengikat ke p.type, bukan formData.paymentType luar
                                    onChange={(e) => {
                                        const update = [...formData.payments];
                                        update[index].type = e.target.value;
                                        setFormData({
                                            ...formData,
                                            payments: update,
                                        });
                                    }}
                                    className="p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer text-xs"
                                >
                                    <option value="DP">DP</option>
                                    <option value="Cicil">Cicil</option>
                                    <option value="Lunas">Lunas</option>
                                </select>

                                <label className="flex-1 py-2 bg-[#5346F1] hover:bg-[#4338CA] text-white text-[8px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm">
                                    <Upload size={10} />
                                    <span>
                                        {p.evidenceFile // 🎯 KUNCI 2: Mengikat ke biner p.evidenceFile per baris index
                                            ? "Foto Terpilih ✓"
                                            : "Upload Bukti"}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (
                                                e.target.files &&
                                                e.target.files[0]
                                            ) {
                                                const update = [
                                                    ...formData.payments,
                                                ];
                                                update[index].evidenceFile =
                                                    e.target.files[0];
                                                setFormData({
                                                    ...formData,
                                                    payments: update,
                                                });
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            {/* ========================================================================= */}
                            {/* REVISI INTEGRASI PART 3: SINKRONISASI VALUE KE RIWAYAT INDEX (0 COPAS)     */}
                            {/* ========================================================================= */}
                            <div className="grid grid-cols-2 gap-2 text-[8px]">
                                <div className="space-y-1">
                                    <label>Tanggal Bayar</label>
                                    <input
                                        type="date"
                                        value={p.date || ""} // 🎯 KUNCI 1: Mengikat ke data lokal p.date per baris
                                        onChange={(e) => {
                                            const update = [
                                                ...formData.payments,
                                            ];
                                            update[index].date = e.target.value;
                                            setFormData({
                                                ...formData,
                                                payments: update,
                                            });
                                        }}
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label>Nominal (Rp)</label>
                                    <input
                                        type="text" // 🎯 KUNCI 1: Diubah ke text agar tombol panah spinner bawaan browser LENYAP TOTAL
                                        inputMode="numeric" // KUNCI 2: Memaksa keyboard HP agar tetap memunculkan tombol angka penuh
                                        pattern="[0-9]*" // KUNCI 3: Hanya mengizinkan input karakter angka suci 0-9
                                        value={p.amount || ""}
                                        onChange={(e) => {
                                            // Menyaring ketikan input agar murni hanya angka saja yang masuk ke database
                                            const nilaiBersih =
                                                e.target.value.replace(
                                                    /[^0-9]/g,
                                                    "",
                                                );
                                            const update = [
                                                ...formData.payments,
                                            ];
                                            update[index].amount =
                                                parseFloat(nilaiBersih) || 0;
                                            setFormData({
                                                ...formData,
                                                payments: update,
                                            });
                                        }}
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 pt-1">
                                <label className="text-[7px]">
                                    Catatan / Keterangan Bayar
                                </label>
                                <input
                                    type="text"
                                    placeholder="Misal: DP Sewa Bus Pariwisata"
                                    value={p.notes || ""} // 🎯 KUNCI 3: Mengikat ke teks catatan p.notes per baris
                                    onChange={(e) => {
                                        const update = [...formData.payments];
                                        update[index].notes = e.target.value;

                                        // Sinkronisasi data baris pertama ke variabel luar demi keamanan pembukuan utama
                                        if (index === 0) {
                                            setFormData({
                                                ...formData,
                                                payments: update,
                                                catatan_pembayaran:
                                                    e.target.value,
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                payments: update,
                                            });
                                        }
                                    }}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs outline-none"
                                />
                            </div>
                            <div className="pt-3 border-t border-slate-200/60 space-y-2">
                                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-slate-400">
                                    <span>Status Bukti</span>
                                    <span
                                        className={`px-1.5 py-0.5 rounded text-[7px] ${
                                            p.paymentStatus === "Disetujui" // 🎯 KUNCI 4: Mengikat badge status ke p.paymentStatus per baris
                                                ? "bg-emerald-50 text-emerald-500 border border-emerald-100"
                                                : p.paymentStatus === "Ditolak"
                                                  ? "bg-red-50 text-red-500 border border-red-100"
                                                  : "bg-amber-50 text-amber-500 border border-amber-100"
                                        }`}
                                    >
                                        {p.paymentStatus || "Pending"}
                                    </span>
                                </div>
                                {/* ========================================================================= */}
                                {/* REVISI INTEGRASI PART 4: TOMBOL MATA & VERIFIKASI PER BARIS (0 ERROR)     */}
                                {/* ========================================================================= */}
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // 🎯 KUNCI 1: Mengintip berkas foto struk per baris index p masing-masing!
                                            if (
                                                p.evidenceFile &&
                                                typeof p.evidenceFile !==
                                                    "string"
                                            ) {
                                                setPreviewUrl(
                                                    URL.createObjectURL(
                                                        p.evidenceFile,
                                                    ),
                                                );
                                            } else if (
                                                p.bukti_transfer &&
                                                p.bukti_transfer !==
                                                    "bukti_default.jpg"
                                            ) {
                                                setPreviewUrl(
                                                    `/uploads/bukti_transfer/${p.bukti_transfer}`,
                                                );
                                            } else if (
                                                formData.bukti_transfer &&
                                                formData.bukti_transfer !==
                                                    "bukti_default.jpg"
                                            ) {
                                                setPreviewUrl(
                                                    `/uploads/bukti_transfer/${formData.bukti_transfer}`,
                                                );
                                            } else {
                                                alert(
                                                    "⚠️ Keterangan: Berkas gambar bukti transfer fisik belum di-upload.",
                                                );
                                            }
                                        }}
                                        className="p-2 bg-indigo-50 text-[#5346F1] rounded-xl hover:bg-indigo-100 transition-all flex items-center justify-center cursor-pointer"
                                        title="Lihat Bukti Transfer"
                                    >
                                        <Eye size={12} />
                                    </button>

                                    {/* 🎯 KUNCI 2: Mengikat tombol verifikasi aksi langsung ke status p.paymentStatus baris ini */}
                                    {/* AREA TOMBOL AKSI VERIFIKASI INTERAKTIF PER BARIS */}
                                    {p.paymentStatus === "Pending" ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const update = [
                                                        ...formData.payments,
                                                    ];
                                                    update[
                                                        index
                                                    ].paymentStatus =
                                                        "Disetujui";
                                                    // Menghapus alasan jika sebelumnya sempat ditolak
                                                    update[
                                                        index
                                                    ].rejection_reason = "";
                                                    setFormData({
                                                        ...formData,
                                                        payments: update,
                                                    });

                                                    if (
                                                        typeof handleVerifyPayment ===
                                                            "function" &&
                                                        index === 0
                                                    ) {
                                                        handleVerifyPayment(
                                                            "Disetujui",
                                                        );
                                                    }
                                                }}
                                                className="flex-1 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-[8px] font-black uppercase tracking-wider text-center cursor-pointer"
                                            >
                                                Sesuai
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // 🎯 INTERAKSI PINTAR: Meminta alasan penolakan via pop-up prompt bawaan browser yang ringkas
                                                    const alasan = prompt(
                                                        "Masukkan Alasan Penolakan Pembayaran Ini:",
                                                    );
                                                    if (alasan === null) return; // Batal klik
                                                    if (!alasan.trim()) {
                                                        alert(
                                                            "❌ Gagal: Alasan penolakan wajib diisi!",
                                                        );
                                                        return;
                                                    }

                                                    const update = [
                                                        ...formData.payments,
                                                    ];
                                                    update[
                                                        index
                                                    ].paymentStatus = "Ditolak";
                                                    update[
                                                        index
                                                    ].rejection_reason = alasan; // Mengunci alasan tolak ke index array
                                                    setFormData({
                                                        ...formData,
                                                        payments: update,
                                                    });

                                                    if (
                                                        typeof handleVerifyPayment ===
                                                            "function" &&
                                                        index === 0
                                                    ) {
                                                        handleVerifyPayment(
                                                            "Ditolak",
                                                        );
                                                    }
                                                }}
                                                className="flex-1 py-1.5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl text-[8px] font-black uppercase tracking-wider text-center cursor-pointer"
                                            >
                                                Tolak
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex-1 space-y-2">
                                            <div className="py-1.5 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl text-[8px] font-black uppercase tracking-widest text-center cursor-not-allowed select-none">
                                                🔒 VERIFIKASI FINAL KUNCI (
                                                {p.paymentStatus})
                                            </div>

                                            {/* 🎯 TAMPILAN INFORMASI: Jika status ditolak, munculkan boks alasan kaku di bawahnya */}
                                            {p.paymentStatus === "Ditolak" && (
                                                <div className="p-2 bg-red-50/50 border border-red-100 text-red-500 rounded-lg text-[8px] font-bold text-left normal-case">
                                                    <span className="font-black block uppercase tracking-wider text-[7px] text-red-400 mb-0.5">
                                                        Alasan Penolakan:
                                                    </span>
                                                    {p.rejection_reason ||
                                                        "Tidak ada alasan spesifik."}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {previewUrl && (
                        <div
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setPreviewUrl(null)}
                        >
                            <div
                                className="bg-white p-6 rounded-[2.5rem] max-w-sm w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-center animate-in zoom-in-95 duration-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {previewUrl === "BELUM_ADA_GAMBAR" ? (
                                    <div className="py-16 flex flex-col items-center justify-center space-y-2">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                            Belum Ada Berkas Gambar
                                        </p>
                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">
                                            Silakan Upload Bukti Transfer
                                            Terlebih Dahulu
                                        </span>
                                    </div>
                                ) : (
                                    <img
                                        src={previewUrl}
                                        alt="Struk Transfer PO Arjuna Trans"
                                        className="w-full h-auto rounded-[1.5rem] object-contain max-h-[55vh] mb-4 border border-slate-50"
                                    />
                                )}
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
            </div>
            <div className="bg-slate-950 rounded-2xl p-4 flex items-center justify-between text-white shadow-md shadow-slate-900/10 mt-4">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                    Sisa Piutang:
                </span>
                <span
                    className={`text-sm font-black ${sisaTagihan <= 0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                    Rp {sisaTagihan.toLocaleString("id-ID")}
                </span>
            </div>
        </div>
    );
};

export default OrderFinanceForm;
