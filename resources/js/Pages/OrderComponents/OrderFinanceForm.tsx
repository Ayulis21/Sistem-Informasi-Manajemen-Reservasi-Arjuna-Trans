import React from "react";
import { Eye, Plus, Upload, ShieldCheck, Trash2 } from "lucide-react";

interface OrderFinanceFormProps {
    formData: any;
    setFormData: (data: any) => void;
    setPreviewUrl: any;
}

const OrderFinanceForm: React.FC<OrderFinanceFormProps> = ({
    formData,
    setFormData,
    setPreviewUrl,
}) => {
    const opsiBayar = [
        { id: "DP", label: "DP" },
        { id: "Cicil", label: "Cicilan" },
        { id: "Lunas", label: "Pelunasan" },
    ];
    const totalHarga = Number(formData.totalPrice || 0);
    const totalBayar = (formData.payments || []).reduce(
        (acc: number, curr: any) => {
            // Uang sewa HANYA berkurang jika status pembayaran BENAR-BENAR sudah "Disetujui"
            const apakahSahDiacc = curr.paymentStatus === "Disetujui";
            return acc + (apakahSahDiacc ? Number(curr.amount || 0) : 0);
        },
        0,
    );
    const sisaTagihan = totalHarga - totalBayar;

    return (
        <div className="space-y-4 border-t border-slate-100 pt-4">
            {/* HEADER JUDUL KEUANGAN & TOMBOL AKSI TAMBAH */}
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#5346F1]">
                <label className="flex items-center gap-1">
                    5. Informasi Keuangan & Rincian Pembayaran
                </label>
                <button
                    type="button"
                    onClick={() =>
                        setFormData({
                            ...formData,
                            payments: [
                                ...(formData.payments || []),
                                {
                                    type: "Cicil",
                                    date: new Date()
                                        .toISOString()
                                        .substring(0, 10),
                                    amount: 0,
                                    notes: "",
                                    evidenceFile: null,
                                    bukti_transfer: "bukti_default.jpg",
                                    paymentStatus: "Pending",
                                    rejection_reason: "",
                                },
                            ],
                        })
                    }
                    className="text-[#5346F1] hover:text-[#4338CA] transition-colors font-black text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                    <Plus size={10} /> Tambah Rincian Bayar
                </button>
            </div>

            {/* BOKS INPUT UTAMA KEUANGAN SEJAJAR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 items-center text-left">
                <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                        Total Sewa (Rp)
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={
                            formData.totalPrice
                                ? Number(formData.totalPrice).toLocaleString(
                                      "id-ID",
                                  )
                                : ""
                        }
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                totalPrice:
                                    parseFloat(
                                        e.target.value.replace(/[^0-9]/g, ""),
                                    ) || 0,
                            })
                        }
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                        Jatuh Tempo Pembayaran
                    </label>
                    <input
                        type="date"
                        value={
                            formData.dueDate
                                ? String(formData.dueDate)
                                      .trim()
                                      .substring(0, 10)
                                : ""
                        }
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                dueDate: e.target.value,
                            })
                        }
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none cursor-pointer"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1">
                        Sisa Tagihan
                    </label>
                    <div className="bg-slate-950 p-2 rounded-xl flex justify-between items-center text-white h-[38px] px-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                            Sisa:
                        </span>
                        <span
                            className={`text-xs font-black uppercase tracking-wider ${sisaTagihan <= 0 ? "text-emerald-400" : "text-rose-400"}`}
                        >
                            {sisaTagihan <= 0
                                ? "LUNAS"
                                : `Rp ${sisaTagihan.toLocaleString("id-ID")}`}
                        </span>
                    </div>
                </div>
            </div>

            {/* TABEL LEBAR HORIZONTAL */}
            {(formData.payments || []).length > 0 && (
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <div className="max-h-[220px] overflow-y-auto w-full scrollbar-thin">
                        <table className="w-full text-left border-collapse text-[10px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase tracking-wider text-[8px]">
                                    <th className="p-3 text-center w-12">No</th>
                                    <th className="p-3 w-28">Jenis Bayar</th>
                                    <th className="p-3 w-32">Tanggal Bayar</th>
                                    <th className="p-3 w-36">Nominal (Rp)</th>
                                    <th className="p-3">
                                        Catatan / Keterangan
                                    </th>
                                    <th className="p-3 w-28 text-center">
                                        Bukti
                                    </th>
                                    <th className="p-3 w-24 text-center">
                                        Status
                                    </th>
                                    <th className="p-3 w-32 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(formData.payments || []).map(
                                    (p: any, index: number) => {
                                        const isApproved =
                                            p.paymentStatus === "Disetujui";
                                        return (
                                            <tr key={index} className="...">
                                                <td className="p-2 text-center text-slate-400">
                                                    {index + 1}
                                                </td>
                                                <td className="p-2">
                                                    {/* 🎯 DROPDOWN DINAMIS */}
                                                    <select
                                                        value={p.type || "DP"}
                                                        disabled={isApproved}
                                                        onChange={(e) => {
                                                            const u = [
                                                                ...formData.payments,
                                                            ];
                                                            u[index].type =
                                                                e.target.value;
                                                            setFormData({
                                                                ...formData,
                                                                payments: u,
                                                            });
                                                        }}
                                                        className="w-full p-1 bg-white border border-slate-200 rounded-lg text-[11px] outline-none cursor-pointer font-bold"
                                                    >
                                                        {opsiBayar.map(
                                                            (opsi) => (
                                                                <option
                                                                    key={
                                                                        opsi.id
                                                                    }
                                                                    value={
                                                                        opsi.id
                                                                    }
                                                                >
                                                                    {opsi.label}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="date"
                                                        value={p.date || ""}
                                                        disabled={isApproved}
                                                        onChange={(e) => {
                                                            const u = [
                                                                ...formData.payments,
                                                            ];
                                                            u[index].date =
                                                                e.target.value;
                                                            setFormData({
                                                                ...formData,
                                                                payments: u,
                                                            });
                                                        }}
                                                        className="w-full p-1 bg-white border border-slate-200 rounded-lg text-[11px]"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                        value={
                                                            p.amount
                                                                ? Number(
                                                                      p.amount,
                                                                  ).toLocaleString(
                                                                      "id-ID",
                                                                  )
                                                                : ""
                                                        }
                                                        disabled={isApproved}
                                                        onChange={(e) => {
                                                            const u = [
                                                                ...formData.payments,
                                                            ];
                                                            u[index].amount =
                                                                parseFloat(
                                                                    e.target.value.replace(
                                                                        /[^0-9]/g,
                                                                        "",
                                                                    ),
                                                                ) || 0;
                                                            setFormData({
                                                                ...formData,
                                                                payments: u,
                                                            });
                                                        }}
                                                        className="w-full p-1 bg-white border border-slate-200 rounded-lg text-[11px]"
                                                    />
                                                </td>
                                                <td className="p-2 space-y-1">
                                                    <input
                                                        type="text"
                                                        placeholder="Masukkan catatan..."
                                                        value={p.notes || ""}
                                                        disabled={isApproved}
                                                        onChange={(e) => {
                                                            const u = [
                                                                ...formData.payments,
                                                            ];
                                                            u[index].notes =
                                                                e.target.value;
                                                            if (index === 0) {
                                                                setFormData({
                                                                    ...formData,
                                                                    payments: u,
                                                                    catatan_pembayaran:
                                                                        e.target
                                                                            .value,
                                                                });
                                                            } else {
                                                                setFormData({
                                                                    ...formData,
                                                                    payments: u,
                                                                });
                                                            }
                                                        }}
                                                        className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-[11px] outline-none"
                                                    />
                                                    {p.paymentStatus ===
                                                        "Ditolak" &&
                                                        p.rejection_reason && (
                                                            <div
                                                                className="text-[8px] text-red-500 font-medium pl-1 text-left bg-red-50 rounded p-1 max-w-xs truncate"
                                                                title={
                                                                    p.rejection_reason
                                                                }
                                                            >
                                                                ❌ Alasan:{" "}
                                                                {
                                                                    p.rejection_reason
                                                                }
                                                            </div>
                                                        )}
                                                </td>

                                                {/* KOLOM BUKTI UPLOAD */}
                                                <td className="p-2 text-center">
                                                    <label className="p-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-[#5346F1] rounded-lg text-[8px] uppercase tracking-wider font-black flex items-center justify-center gap-0.5 cursor-pointer transition-colors mx-auto max-w-[80px]">
                                                        <Upload size={8} />{" "}
                                                        Upload
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            disabled={
                                                                isApproved
                                                            }
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .files &&
                                                                    e.target
                                                                        .files
                                                                        .length >
                                                                        0
                                                                ) {
                                                                    const fileTunggal =
                                                                        e.target
                                                                            .files[0];
                                                                    if (
                                                                        fileTunggal.size >
                                                                        2 *
                                                                            1024 *
                                                                            1024
                                                                    ) {
                                                                        alert(
                                                                            "❌ GAGAL: Ukuran gambar terlalu besar! Maksimal 2MB. Silakan gunakan gambar yang lebih kecil agar server tidak lemot.",
                                                                        );
                                                                        e.target.value =
                                                                            ""; // Reset agar inputan bersih kembali
                                                                        return;
                                                                    }
                                                                    const u = [
                                                                        ...formData.payments,
                                                                    ];
                                                                    u[
                                                                        index
                                                                    ].evidenceFile =
                                                                        fileTunggal;
                                                                    u[
                                                                        index
                                                                    ].previewLocalUrl =
                                                                        URL.createObjectURL(
                                                                            fileTunggal,
                                                                        ); // 🎯 BEBAS EROR 2345 (100% TEMBUS NYALA!)
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            payments:
                                                                                u,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </td>

                                                {/* KOLOM STATUS */}
                                                <td className="p-2 text-center">
                                                    <span
                                                        className={`text-[7px] font-black uppercase px-2 py-0.5 rounded block text-center mx-auto max-w-[70px] ${p.paymentStatus === "Disetujui" ? "bg-emerald-50 text-emerald-600" : p.paymentStatus === "Ditolak" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"}`}
                                                    >
                                                        {p.paymentStatus ||
                                                            "Pending"}
                                                    </span>
                                                </td>

                                                {/* KOLOM AKSI */}
                                                <td className="p-2 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {/* TOMBOL INTIP MATA BUKTI */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                // 1. Membaca link biner lokal jika admin baru saja klik tombol Upload gambar dari laptop
                                                                // 2. Jika tidak ada, membaca nama berkas gambar dari database (p.bukti_transfer)
                                                                // 3. Jika kosong semua, ambil backup default dari form induk
                                                                const jalurGambarFinal =
                                                                    p.previewLocalUrl ||
                                                                    p.bukti_transfer ||
                                                                    formData.bukti_transfer ||
                                                                    "bukti_default.jpg";

                                                                // Mengalirkan jalurnya ke popup melayang di file induk Orders.tsx
                                                                setPreviewUrl(
                                                                    jalurGambarFinal,
                                                                );
                                                            }}
                                                            className="p-1 text-slate-400 hover:text-[#5346F1] hover:bg-slate-100 rounded transition-all cursor-pointer flex items-center justify-center"
                                                            title="Lihat Bukti Struk"
                                                        >
                                                            <Eye size={12} />
                                                        </button>
                                                        {p.paymentStatus ===
                                                        "Pending" ? (
                                                            <div className="flex items-center gap-1 border-l border-slate-100 pl-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const u =
                                                                            [
                                                                                ...formData.payments,
                                                                            ];
                                                                        u[
                                                                            index
                                                                        ].paymentStatus =
                                                                            "Disetujui";
                                                                        u[
                                                                            index
                                                                        ].rejection_reason =
                                                                            "";
                                                                        setFormData(
                                                                            {
                                                                                ...formData,
                                                                                payments:
                                                                                    u,
                                                                            },
                                                                        );
                                                                    }}
                                                                    className="p-0.5 text-emerald-500 hover:bg-emerald-50 rounded transition-colors"
                                                                >
                                                                    <ShieldCheck
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const r =
                                                                            prompt(
                                                                                "Masukkan alasan penolakan:",
                                                                            );
                                                                        if (
                                                                            r ===
                                                                            null
                                                                        )
                                                                            return;
                                                                        if (
                                                                            !r.trim()
                                                                        ) {
                                                                            alert(
                                                                                "Wajib isi alasan!",
                                                                            );
                                                                            return;
                                                                        }
                                                                        const u =
                                                                            [
                                                                                ...formData.payments,
                                                                            ];
                                                                        u[
                                                                            index
                                                                        ].paymentStatus =
                                                                            "Ditolak";
                                                                        u[
                                                                            index
                                                                        ].rejection_reason =
                                                                            r;
                                                                        setFormData(
                                                                            {
                                                                                ...formData,
                                                                                payments:
                                                                                    u,
                                                                            },
                                                                        );
                                                                    }}
                                                                    className="p-0.5 text-red-400 hover:bg-red-50 rounded transition-colors text-[9px]"
                                                                >
                                                                    ❌
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[7px] font-black text-slate-300 tracking-wider uppercase select-none border-l border-slate-100 pl-1">
                                                                🔒 Locked
                                                            </span>
                                                        )}
                                                        <div className="border-l border-slate-100 pl-1">
                                                            {index > 0 ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setFormData(
                                                                            {
                                                                                ...formData,
                                                                                payments:
                                                                                    formData.payments.filter(
                                                                                        (
                                                                                            _: any,
                                                                                            i: number,
                                                                                        ) =>
                                                                                            i !==
                                                                                            index,
                                                                                    ),
                                                                            },
                                                                        )
                                                                    }
                                                                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            11
                                                                        }
                                                                    />
                                                                </button>
                                                            ) : (
                                                                <span className="text-slate-200 select-none text-[8px] font-black"></span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderFinanceForm;
