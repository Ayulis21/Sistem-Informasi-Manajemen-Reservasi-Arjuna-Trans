import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import ModalOrder from "./OrderComponents/ModalOrder";
import {
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    Bus,
    Phone,
    Edit2,
    Trash2,
    Printer,
    Plus,
    Filter,
    Check,
    ChevronRight,
    MapPin,
    Calendar,
} from "lucide-react";

const Orders: React.FC = () => {
    const [formData, setFormData] = useState({
        id_pesanan: "",
        customerName: "",
        whatsapp: "",
        destination: "",
        pickup: "",
        distance: "",
        departureDate: "",
        returnDate: "",
        routeNotes: "",
        totalPrice: 0,
        paidAmount: 0,
        dueDate: "",
        fleetRequirements: [{ type: "Bus", qty: 1 }],
        paymentType: "DP",
        paymentDate: new Date().toISOString().substring(0, 10),
        paymentNotes: "",
        evidenceFile: null as File | null,
        bukti_transfer: "bukti_default.jpg",
        paymentStatus: "Pending",
    });

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [activeOrder, setActiveOrder] = useState({});
    const [orders, setOrders] = useState<any[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null); // Menggunakan tipe string karena ID pesanan Anda memakai format teks ORD-...

    const [search, setSearch] = useState("");
    const fetchOrdersData = () => {
        axios
            .get("/api/admin/pesanan")
            .then((response) => {
                // Menyiram langsung seluruh baris data dari database MySQL ke state React
                setOrders(response.data);
            })
            .catch((error) => {
                console.error(
                    "Gagal memuat data pesanan dari database:",
                    error,
                );
            });
    };
    useEffect(() => {
        fetchOrdersData();
    }, []);

    const handleSaveOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.customerName.trim() ||
            !formData.destination.trim() ||
            !formData.departureDate.trim()
        ) {
            alert(
                "❌ Gagal Simpan: Mohon lengkapi Nama Pelanggan, Tujuan Utama, dan Waktu Berangkat!",
            );
            return;
        }

        try {
            // KUNCI BERKAS BINER: Membungkus seluruh inputan ke dalam FormData agar file gambar bisa lolos terkirim
            const dataBiner = new FormData();
            dataBiner.append("customerName", formData.customerName);
            dataBiner.append("whatsapp", formData.whatsapp);
            dataBiner.append("destination", formData.destination);
            dataBiner.append("pickup", formData.pickup);
            dataBiner.append("distance", formData.distance);
            dataBiner.append("departureDate", formData.departureDate);
            dataBiner.append("returnDate", formData.returnDate);
            dataBiner.append("routeNotes", formData.routeNotes);
            dataBiner.append("totalPrice", String(formData.totalPrice));
            dataBiner.append("paidAmount", String(formData.paidAmount));
            dataBiner.append("dueDate", formData.dueDate);
            dataBiner.append("paymentType", formData.paymentType);
            dataBiner.append("paymentDate", formData.paymentDate);
            dataBiner.append("paymentNotes", formData.paymentNotes);
            dataBiner.append(
                "fleetRequirements",
                JSON.stringify(formData.fleetRequirements),
            );

            // Jika admin memilih foto bukti transfer, selipkan filenya ke dalam muatan
            if (formData.evidenceFile) {
                dataBiner.append("evidenceFile", formData.evidenceFile);
            }

            // Jika dalam mode edit, tambahkan metode PUT spoofing agar didukung penuh oleh sistem upload Laravel
            if (isEditMode) {
                dataBiner.append("_method", "PUT");
            }

            let response;
            if (isEditMode) {
                // SINKRONISASI TRANSMISI: Langsung tembak POST murni ke gerbang baru Laravel tanpa spoofing _method
                response = await axios.post(
                    `/api/admin/pesanan/update-full/${selectedId}`,
                    dataBiner,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    },
                );
            } else {
                response = await axios.post(
                    "/api/admin/pesanan/store",
                    dataBiner,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    },
                );
            }

            alert("✨ Sukses: " + response.data.message);

            // Reset seluruh state kembali bersih kosong setelah berhasil
            setFormData({
                id_pesanan: "",
                customerName: "",
                whatsapp: "",
                destination: "",
                pickup: "",
                distance: "",
                departureDate: "",
                returnDate: "",
                routeNotes: "",
                totalPrice: 0,
                paidAmount: 0,
                dueDate: "",
                paymentType: "DP",
                paymentDate: new Date().toISOString().substring(0, 10),
                paymentNotes: "",
                evidenceFile: null,
                fleetRequirements: [{ type: "Bus", qty: 1 }],
                bukti_transfer: "bukti_default.jpg",
                paymentStatus: "Pending",
            });

            setIsOpenModal(false);
            setIsEditMode(false);
            fetchOrdersData();
        } catch (error) {
            console.error(error);
            alert("❌ Gagal: Masalah koneksi transmisi berkas data.");
        }
    };
    const handleVerifyPayment = async (
        idPesanan: string,
        statusBaru: string,
    ) => {
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
                fetchOrdersData(); // Segarkan data visual depan instan
            } catch (error) {
                alert("❌ Gagal memperbarui status bukti pembayaran.");
            }
        }
    };

    const handleUpdateStatus = async (
        idPesanan: number,
        statusBaru: string,
        namaPenyewa: string,
    ) => {
        const pesanKonfirmasi =
            statusBaru === "DISETUJUI"
                ? `Apakah Anda yakin ingin MENYETUJUI pemesanan atas nama "${namaPenyewa}"?`
                : `Apakah Anda yakin ingin MENOLAK pemesanan atas nama "${namaPenyewa}"?`;

        if (confirm(pesanKonfirmasi)) {
            try {
                // Menembak lurus ke gerbang PUT API PesananController Laravel Anda
                const response = await axios.put(
                    `/api/admin/pesanan/update-status/${idPesanan}`,
                    {
                        status_pesanan: statusBaru,
                    },
                );

                alert("✨ Sukses: " + response.data.message);

                // Menyegarkan isi tabel secara instan tanpa perlu reload total halaman!
                fetchOrdersData();
            } catch (error) {
                console.error("Gagal memperbarui status pesanan:", error);
                alert("❌ Gagal: Tidak dapat memperbarui status transaksi.");
            }
        }
    };

    const getLeftIcon = (status: string) => {
        switch (status) {
            case "Pending":
                return (
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center border border-amber-100">
                        <Clock size={18} />
                    </div>
                );
            case "Approved":
                return (
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center border border-indigo-100">
                        <Bus size={18} />
                    </div>
                );
            case "Ziarah":
                return (
                    <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center border border-slate-200">
                        <XCircle size={18} />
                    </div>
                );
            case "Completed":
                return (
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center border border-blue-100">
                        <CheckCircle2 size={18} />
                    </div>
                );
            case "Plotting":
                return (
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100">
                        <CheckCircle2 size={18} />
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
                        <Clock size={18} />
                    </div>
                );
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* ========================================================================= */}
                {/* TOOLBAR ATAS: JUDUL & TOMBOL KEBIJAKAN                                    */}
                {/* ========================================================================= */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">
                            Kelola Reservasi
                        </h2>
                        <p className="text-slate-400 text-xs font-bold italic">
                            Verifikasi pesanan masuk dan atur detail pembayaran.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider w-full sm:w-auto">
                        <button className="bg-white border border-slate-200/60 px-4 py-2 rounded-xl text-slate-500 shadow-sm flex items-center gap-1.5">
                            <Printer size={12} /> Semua Bayar ▾
                        </button>
                        <button className="bg-white border border-slate-200/60 px-4 py-2 rounded-xl text-slate-500 shadow-sm flex items-center gap-1.5">
                            <Filter size={12} /> Semua Status ▾
                        </button>
                        <button
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 hover:bg-slate-800 transition-colors "
                            onClick={() => setIsOpenModal(true)}
                        >
                            <Plus size={14} /> Tambah
                        </button>
                    </div>
                </div>

                {/* BAR PENCARIAN PANJANG */}
                <div className="relative group">
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari pelanggan atau tujuan..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-xs font-bold outline-none placeholder:font-normal placeholder:text-slate-400"
                    />
                </div>

                {/* ========================================================================= */}
                {/* LIST CARD RESERVASI BERJEJER (100% PERSIS SEPERTI GAMBAR)               */}
                {/* ========================================================================= */}
                <div className="space-y-3">
                    {orders.map((o, idx) => (
                        <div
                            key={o.id_pesanan || idx}
                            className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden transition-all hover:border-indigo-100"
                        >
                            {/* Sisi Kiri: Ikon & Detail Rute */}
                            <div className="flex items-start gap-4 flex-1">
                                {/* Menyelaraskan fungsi icon agar membaca status database (PENDING / DISETUJUI / SELESAI) */}
                                {getLeftIcon(o.status_pesanan || o.status)}
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h4 className="text-sm font-black text-slate-800 tracking-tight leading-tight">
                                            {/* SINKRONISASI: Membaca nama pemesan dari database */}
                                            {o.nama_pemesan ||
                                                o.title ||
                                                "Tanpa Nama"}
                                        </h4>
                                        <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-md border border-slate-200/40 uppercase tracking-widest">
                                            #{o.id_pesanan || o.id}
                                        </span>
                                        {/* Kondisi Badge Dinamis */}
                                        {(o.status_pesanan === "PENDING" ||
                                            o.status === "Pending") && (
                                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-amber-100 text-amber-500 rounded-md uppercase tracking-wider">
                                                BARU
                                            </span>
                                        )}
                                        {(o.status_pesanan === "DISETUJUI" ||
                                            o.status === "Approved") && (
                                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-500 text-white rounded-md uppercase tracking-wider">
                                                LUNAS
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 text-[10px] font-bold text-slate-400">
                                        {/* 1. SINKRONISASI KOLOM RUTE/TUJUAN UTAMA */}
                                        <p className="flex items-center gap-1">
                                            <MapPin
                                                size={10}
                                                className="text-slate-300"
                                            />{" "}
                                            {o.tujuan_main || o.rute || "-"}
                                        </p>
                                        <span className="hidden sm:inline text-slate-200">
                                            |
                                        </span>
                                        {/* 2. SINKRONISASI KOLOM TANGGAL BERANGKAT DATABSE */}
                                        <p className="flex items-center gap-1">
                                            <Calendar
                                                size={10}
                                                className="text-slate-300"
                                            />{" "}
                                            {o.tgl_berangkat
                                                ? new Date(
                                                      o.tgl_berangkat,
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          day: "numeric",
                                                          month: "short",
                                                          year: "numeric",
                                                      },
                                                  )
                                                : "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sisi Kanan: Harga & Tombol Aksi Operasional */}
                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t border-slate-50 pt-3 md:pt-0 md:border-none">
                                <div className="text-left md:text-right">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                        Total Sewa
                                    </p>
                                    {/* 3. SINKRONISASI KOLOM HARGA SEWA DATABASE (MENGHILANGKAN Rp 0) */}
                                    <p className="text-sm font-black text-slate-800">
                                        Rp{" "}
                                        {Number(
                                            o.harga_sewa || o.total_harga || 0,
                                        ).toLocaleString("id-ID")}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {/* Mini Actions */}
                                    <button className="p-2 hover:bg-slate-50 text-slate-300 hover:text-slate-500 rounded-xl transition-colors">
                                        <Phone size={12} />
                                    </button>
                                    {/* KUNCI SAKRAL EDIT: Melengkapi struktur properti agar lolos sensor tipe data TypeScript */}
                                    {/* KUNCI SAKRAL PREVIEW: Menyuntikkan nama file foto dari database ke form modal */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedId(o.id_pesanan || o.id);
                                            setIsEditMode(true);

                                            setFormData({
                                                id_pesanan: o.id_pesanan || "",
                                                customerName:
                                                    o.nama_pemesan || "",
                                                whatsapp: o.no_telp || "",
                                                destination:
                                                    o.tujuan_main || "",
                                                pickup:
                                                    o.alamat_penjemputan || "",
                                                distance: String(
                                                    o.estimasi_jarak || 0,
                                                ),
                                                departureDate: o.tgl_berangkat
                                                    ? o.tgl_berangkat.substring(
                                                          0,
                                                          16,
                                                      )
                                                    : "",
                                                returnDate: o.tgl_selesai
                                                    ? o.tgl_selesai.substring(
                                                          0,
                                                          16,
                                                      )
                                                    : "",
                                                routeNotes: o.rute || "",
                                                totalPrice: Number(
                                                    o.harga_sewa || 0,
                                                ),
                                                paidAmount: Number(
                                                    o.total_terbayar ||
                                                        o.nominal ||
                                                        0,
                                                ),
                                                dueDate: o.jatuh_tempo || "",
                                                fleetRequirements:
                                                    o.tipe_unit_diminta
                                                        ? [
                                                              {
                                                                  type: o.tipe_unit_diminta,
                                                                  qty: Number(
                                                                      o.jumlah_unit_diminta ||
                                                                          1,
                                                                  ),
                                                              },
                                                          ]
                                                        : [
                                                              {
                                                                  type: "Bus",
                                                                  qty: 1,
                                                              },
                                                          ],
                                                paymentType:
                                                    o.tipe_keterangan || "DP",
                                                paymentDate: o.tgl_bayar
                                                    ? o.tgl_bayar.substring(
                                                          0,
                                                          10,
                                                      )
                                                    : new Date()
                                                          .toISOString()
                                                          .substring(0, 10),
                                                paymentNotes:
                                                    o.catatan_pembayaran ||
                                                    o.lain_lain ||
                                                    "",
                                                evidenceFile: null,

                                                // KUNCI SINKRONISASI PASCA-SIMPAN: Membaca data riwayat transfer asli database Anda
                                                bukti_transfer:
                                                    o.bukti_transfer ||
                                                    "bukti_default.jpg",
                                                paymentStatus:
                                                    o.status_pembayaran ||
                                                    "Pending",
                                            });

                                            setIsOpenModal(true);
                                        }}
                                        className="p-2 hover:bg-slate-50 text-slate-300 hover:text-slate-500 rounded-xl transition-colors"
                                    >
                                        <Edit2 size={12} />
                                    </button>

                                    {/* KUNCI UTAMA HAPUS DATA: Tembak API delete jika pesanan dibatalkan/dihapus */}
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (
                                                confirm(
                                                    `Apakah Anda yakin ingin menghapus data pesanan atas nama "${o.nama_pemesan || o.title}" secara permanen?`,
                                                )
                                            ) {
                                                try {
                                                    // Jika rute backend delete belum ada, kita bisa gunakan endpoint update status ke 'DIBATALKAN' atau buatkan API khusus nanti
                                                    const response =
                                                        await axios.put(
                                                            `/api/admin/pesanan/update-status/${o.id_pesanan || o.id}`,
                                                            {
                                                                status_pesanan:
                                                                    "DIBATALKAN",
                                                            },
                                                        );
                                                    alert(
                                                        "✨ Sukses: Status pesanan berhasil diubah menjadi DIBATALKAN.",
                                                    );
                                                    fetchOrdersData(); // Segarkan data tabel instan
                                                } catch (err) {
                                                    alert(
                                                        "❌ Gagal menghapus atau mengubah status pesanan.",
                                                    );
                                                }
                                            }
                                        }}
                                        className="p-2 hover:bg-slate-50 text-slate-300 hover:text-red-500 rounded-xl transition-colors"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                    <button className="p-2 bg-slate-900 text-white rounded-xl shadow-sm">
                                        <Printer size={12} />
                                    </button>

                                    {/* INTEGRASI STATUS AKSI TOMBOL OPERASIONAL ARJUNA TRANS */}
                                    {(o.status_pesanan === "PENDING" ||
                                        o.status === "Pending") && (
                                        <>
                                            {/* 1. TOMBOL SETUJUI (Mengubah status menjadi DISETUJUI / LUNAS) */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        o.id_pesanan || o.id,
                                                        "DISETUJUI",
                                                        o.nama_pemesan ||
                                                            o.title,
                                                    )
                                                }
                                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all flex items-center gap-1"
                                            >
                                                <Check
                                                    size={10}
                                                    strokeWidth={3}
                                                />{" "}
                                                SETUJUI
                                            </button>

                                            {/* 2. TOMBOL TOLAK (Mengubah status menjadi DIBATALKAN / TOLAK) */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        o.id_pesanan || o.id,
                                                        "DIBATALKAN",
                                                        o.nama_pemesan ||
                                                            o.title,
                                                    )
                                                }
                                                className="px-3 py-2 bg-white border border-red-200 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 transition-colors"
                                            >
                                                × TOLAK
                                            </button>
                                        </>
                                    )}
                                    {(o.status_pesanan === "DISETUJUI" ||
                                        o.status === "Approved") && (
                                        <>
                                            {/* KUNCI OPERASIONAL: Saat bus berangkat/selesai, klik tombol ini untuk mengubah status ke SELESAI */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        o.id_pesanan || o.id,
                                                        "SELESAI",
                                                        o.nama_pemesan ||
                                                            o.title,
                                                    )
                                                }
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all flex items-center gap-1"
                                            >
                                                → JALAN / SELESAI
                                            </button>
                                            <span className="text-[9px] font-bold text-slate-400 ml-2 cursor-pointer hover:text-indigo-600 uppercase tracking-widest">
                                                Ubah Plot
                                            </span>
                                        </>
                                    )}

                                    {(o.status_pesanan === "SELESAI" ||
                                        o.status === "Completed") && (
                                        <button className="px-4 py-2 bg-[#5346F1] text-white text-[9px] font-black uppercase tracking-widest rounded-xl opacity-90 cursor-default flex items-center gap-1">
                                            <Check size={10} strokeWidth={3} />{" "}
                                            SELESAI
                                        </button>
                                    )}
                                    {o.status === "Plotting" && (
                                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all flex items-center gap-1">
                                            ⊞ PLOTTING
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* ========================================================================= */}
            {/* KUNCI SAKRAL: MENGHUBUNGKAN STATE LUAR DENGAN PROPS JEROAN MODAL ASLI ANDA */}
            {/* ========================================================================= */}
            <ModalOrder
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                formData={formData}
                setFormData={setFormData}
                // Cukup ganti kata onSave menjadi onSubmit di baris ini!
                onSubmit={handleSaveOrder}
            />
        </AdminLayout>
    );
};

export default Orders;
