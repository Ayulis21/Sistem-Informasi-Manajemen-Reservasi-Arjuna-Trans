import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ModalOrder from "./OrderComponents/ModalOrder";
import {
    Clock,
    MapPin,
    Calendar,
    Phone,
    Edit2,
    Printer,
    Trash2,
    Plus,
} from "lucide-react";
import axios from "axios"; // ← KUNCI PENYEMBUHAN 1: Memperbaiki typo dari ajax menjadi axios

const Orders: React.FC = () => {
    // 1. DAFTAR STATE UTAMA BAWAAN PROYEK ARJUNA TRANS ANDA
    const [orders, setOrders] = useState<any[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

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
        evidenceFile: null as File | null,
        bukti_transfer: "bukti_default.jpg",
        paymentStatus: "Pending",
        catatan_pembayaran: "",
    });

    // 2. FUNGSI PENYEGAR DATA DARI DATABASE MYSQL
    const fetchOrdersData = async () => {
        try {
            const response = await axios.get("/api/admin/pesanan");
            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Gagal menarik data pesanan:", error);
        }
    };

    useEffect(() => {
        fetchOrdersData();
    }, []);

    // 3. FUNGSI SAKRAL: MENGUBAH STATUS OPERASIONAL PESANAN (SETUJUI / BATAL)
    const handleUpdateStatus = async (
        idPesanan: string,
        statusBaru: string,
        namaPenyewa: string,
    ) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menandai pesanan atas nama ${namaPenyewa} sebagai ${statusBaru.toUpperCase()}?`,
            )
        ) {
            try {
                await axios.put(
                    `/api/admin/pesanan/update-status/${idPesanan}`,
                    {
                        status_pesanan: statusBaru,
                    },
                );
                alert(
                    `✨ Sukses: Status pesanan berhasil diperbarui menjadi ${statusBaru}!`,
                );
                fetchOrdersData();
            } catch (error) {
                alert("❌ Gagal memperbarui status operasional pesanan.");
            }
        }
    };

    // 4. FUNGSI AKSI AKHIR: EKSEKUSI TOMBOL UTAMA SIMPAN DETAIL PESANAN
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
            dataBiner.append("catatan_pembayaran", formData.catatan_pembayaran);
            dataBiner.append(
                "fleetRequirements",
                JSON.stringify(formData.fleetRequirements),
            );

            if (formData.evidenceFile) {
                dataBiner.append("evidenceFile", formData.evidenceFile);
            }

            let response;
            if (isEditMode) {
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

            // KUNCI SAKRAL PENYEMBUHAN: Menyuapi fleetRequirements utuh di baris reset state!
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
                evidenceFile: null,
                bukti_transfer: "bukti_default.jpg",
                paymentStatus: "Pending",
                catatan_pembayaran: "",
                fleetRequirements: [{ type: "Bus", qty: 1 }],
            });

            setIsOpenModal(false);
            setIsEditMode(false);
            fetchOrdersData();
        } catch (error) {
            console.error(error);
            alert("❌ Gagal: Masalah koneksi transmisi berkas data.");
        }
    };

    // 5. FUNSI PEMBANTU: MENAMPILKAN IKON KARTU ASLI BAWAAN TEMPLATE ANDA
    const getLeftIcon = (status: string) => {
        return <Clock size={16} />;
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6 space-y-6">
                {/* Bagian Atas Header Halaman */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-5 w-full">
                        {/* BARIS 1: JUDUL UTAMA DI KIRI --- FILTERS & TOMBOL TAMBAH DI KANAN */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
                            {/* Judul Utama Bawaan Aplikasi Anda */}
                            <div className="text-left">
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider leading-none">
                                    KELOLA PESANAN
                                </h2>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mt-1.5">
                                    MANAJEMEN TRANSAKSI BUS ARJUNA TRANS
                                </span>
                            </div>

                            {/* Barisan Filter & Tombol Tambah yang Terkunci Rapi di Sisi Kanan */}
                            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
                                {/* Dropdown Filter 1 */}
                                <div className="relative">
                                    <select className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-slate-200/70 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider text-slate-500 outline-none shadow-sm cursor-pointer min-w-[130px]">
                                        <option>$ SEMUA BAYAR</option>
                                        <option>LUNAS</option>
                                        <option>DP / PENDING</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[8px]">
                                        ▼
                                    </div>
                                </div>

                                {/* Dropdown Filter 2 */}
                                <div className="relative">
                                    <select className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-slate-200/70 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider text-slate-500 outline-none shadow-sm cursor-pointer min-w-[130px]">
                                        <option>SEMUA BAYAR</option>
                                        <option>BARU</option>
                                        <option>PERLU ACC</option>
                                        <option>PLOTTING</option>
                                        <option>TERJADWAL</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[8px]">
                                        ▼
                                    </div>
                                </div>

                                {/* Tombol Tambah Hitam Pekat Elegan Anda */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditMode(false);
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
                                            paymentDate: new Date()
                                                .toISOString()
                                                .substring(0, 10),
                                            evidenceFile: null,
                                            bukti_transfer: "bukti_default.jpg",
                                            paymentStatus: "Pending",
                                            catatan_pembayaran: "",
                                            fleetRequirements: [
                                                { type: "Bus", qty: 1 },
                                            ],
                                        });
                                        setIsOpenModal(true);
                                    }}
                                    className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-md transition-all"
                                >
                                    <Plus size={12} /> TAMBAH
                                </button>
                            </div>
                        </div>

                        {/* BARIS 2: BOX SEARCH BERDIRI MANDIRI MEMANJANG 100% LEBAR HALAMAN */}
                        <div className="relative w-full pt-1">
                            <input
                                type="text"
                                placeholder="Cari pelanggan atau tujuan..."
                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200/70 rounded-[1.5rem] text-xs font-bold text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 shadow-sm"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                {/* Ikon Pencarian Kaca Pembesar Luar */}
                                <svg
                                    xmlns="http://w3.org"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line
                                        x1="21"
                                        y1="21"
                                        x2="16.65"
                                        y2="16.65"
                                    ></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {orders.map((o: any, idx: number) => {
                        const totalHarga = Number(
                            o.harga_sewa || o.total_harga || 0,
                        );
                        const totalBayar = Number(
                            o.total_terbayar || o.nominal || 0,
                        );
                        const isLunas =
                            totalHarga > 0 && totalBayar >= totalHarga;

                        const statusSkrg = o.status_pesanan || o.status;
                        let labelKomponen = null;

                        if (statusSkrg === "Batal") {
                            // Alur 3: Jika tidak sepakat nego, beri label Batal
                            labelKomponen = (
                                <span className="text-[8px] font-black px-1.5 py-0.5 bg-red-100 text-red-500 rounded-md uppercase tracking-wider">
                                    Batal
                                </span>
                            );
                        } else if (isLunas && statusSkrg === "Terjadwal") {
                            // Alur Akhir: Jika tagihan sudah lunas terbayar penuh
                            labelKomponen = (
                                <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-500 rounded-md uppercase tracking-wider">
                                    Lunas
                                </span>
                            );
                        } else if (
                            o.status_pembayaran === "Pending" &&
                            totalBayar > 0 &&
                            statusSkrg === "Disetujui"
                        ) {
                            // Alur 5: Jika pelanggan sudah upload pembayaran (nominal > 0) tapi belum di-ACC admin
                            labelKomponen = (
                                <span className="text-[8px] font-black px-1.5 py-0.5 bg-amber-100 text-amber-500 rounded-md uppercase tracking-wider">
                                    Perlu ACC
                                </span>
                            );
                        } else if (statusSkrg === "Pending") {
                            // Alur 1: Pelanggan baru memesan, status awal wajib berlabel BARU
                            labelKomponen = (
                                <span className="text-[8px] font-black px-1.5 py-0.5 bg-rose-100 text-rose-500 rounded-md uppercase tracking-wider">
                                    Baru
                                </span>
                            );
                        }
                        return (
                            <div
                                key={o.id_pesanan || idx}
                                className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden transition-all hover:border-indigo-100"
                            >
                                {/* SISI KIRI: SINKRONISASI WARNA IKON 6 ALUR ARJUNA TRANS */}
                                <div className="flex items-start gap-4 flex-1">
                                    <div
                                        className={`p-3 rounded-full ${
                                            statusSkrg === "Pending"
                                                ? "bg-amber-50 text-amber-500 border border-amber-100" // Alur 1 & 2: Berwarna Kuning saat Baru/Nego
                                                : statusSkrg === "Disetujui"
                                                  ? "bg-emerald-50 text-emerald-500 border border-emerald-100" // Alur 4: Berwarna Hijau setelah klik Setujui
                                                  : statusSkrg === "Terjadwal"
                                                    ? "bg-indigo-50 text-indigo-500 border border-indigo-100" // Alur 6: Berwarna Biru setelah di-Plotting
                                                    : "bg-slate-50 text-slate-400"
                                        }`}
                                    >
                                        {getLeftIcon(statusSkrg)}
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="text-sm font-black text-slate-800 tracking-tight leading-tight">
                                                {o.nama_pemesan ||
                                                    o.title ||
                                                    "Tanpa Nama"}
                                            </h4>
                                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-md border border-slate-200/40 uppercase tracking-widest">
                                                #{o.id_pesanan || o.id}
                                            </span>
                                            {labelKomponen}
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 text-[10px] font-bold text-slate-400">
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
                                            <p className="flex items-center gap-1">
                                                <Calendar
                                                    size={10}
                                                    className="text-slate-300"
                                                />{" "}
                                                {o.tgl_berangkat || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sisi Tengah: Tampilan Harga Sewa */}
                                <div className="text-left md:text-right min-w-[140px] space-y-1 border-t border-slate-50 md:border-none pt-2 md:pt-0">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                            Total Sewa
                                        </p>
                                        <p className="text-xs font-black text-slate-600 mt-0.5">
                                            Rp{" "}
                                            {totalHarga.toLocaleString("id-ID")}
                                        </p>
                                    </div>

                                    {/* MENAMPILKAN SISA PIUTANG YANG AKAN MENYUSUT OTOMATIS JIKA DP DI-ACC ADMIN */}
                                    <div>
                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                            Sisa Piutang
                                        </p>
                                        <p
                                            className={`text-xs font-black mt-0.5 ${
                                                // Jika lunas berwarna hijau emerald, jika masih utuh/utang berwarna merah cabai
                                                isLunas
                                                    ? "text-emerald-500"
                                                    : "text-rose-500"
                                            }`}
                                        >
                                            Rp{" "}
                                            {(
                                                totalHarga - totalBayar
                                            ).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>

                                {/* Sisi Kanan: Barisan Tombol Kontrol Dinamis */}
                                <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(
                                                `https://wa.me{o.no_telp || o.whatsapp}`,
                                                "_blank",
                                            )
                                        }
                                        className="p-2 hover:bg-slate-50 text-slate-300 hover:text-slate-500 rounded-xl transition-colors"
                                    >
                                        <Phone size={12} />
                                    </button>
                                    {/* ========================================================================= */}
                                    {/* REVISI SAKRAL EDIT: PARSER BUKAN PHP DAN MENYUAPI FLEET (0 ERROR)          */}
                                    {/* ========================================================================= */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            let teksCatatan = "";
                                            let tanggalJatuhTempo = "";

                                            try {
                                                // Menggunakan standar baku JavaScript (JSON.parse) untuk membongkar data
                                                if (
                                                    o.catatan_pembayaran &&
                                                    o.catatan_pembayaran.startsWith(
                                                        "{",
                                                    )
                                                ) {
                                                    const objekJson =
                                                        JSON.parse(
                                                            o.catatan_pembayaran,
                                                        );
                                                    teksCatatan =
                                                        objekJson.notes || "";
                                                    tanggalJatuhTempo =
                                                        objekJson.dueDate || "";
                                                } else {
                                                    teksCatatan =
                                                        o.catatan_pembayaran ||
                                                        "";
                                                }
                                            } catch (e) {
                                                teksCatatan =
                                                    o.catatan_pembayaran || "";
                                            }

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
                                                bukti_transfer:
                                                    o.bukti_transfer ||
                                                    "bukti_default.jpg",
                                                paymentStatus:
                                                    o.status_pembayaran ||
                                                    "Pending",
                                                evidenceFile: null,
                                                dueDate: tanggalJatuhTempo
                                                    ? tanggalJatuhTempo.substring(
                                                          0,
                                                          10,
                                                      )
                                                    : "",
                                                catatan_pembayaran: teksCatatan,

                                                // SINKRONISASI TRANSMISI: Memasukkan kembali fleetRequirements wajib proyek Anda
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
                                            });
                                            setIsOpenModal(true);
                                        }}
                                        className="p-2 hover:bg-slate-50 text-slate-300 hover:text-slate-500 rounded-xl transition-colors"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2 bg-slate-950 text-white rounded-xl text-xs"
                                    >
                                        <Printer size={12} />
                                    </button>

                                    {/* URUTAN BADGE TOMBOL AKSI 6 KONDISI SAKRAL */}
                                    {(o.status_pesanan === "Pending" ||
                                        o.status === "Baru") && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        o.id_pesanan || o.id,
                                                        "Disetujui",
                                                        o.nama_pemesan ||
                                                            o.title ||
                                                            "",
                                                    )
                                                }
                                                className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-wider"
                                            >
                                                Setujui
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        o.id_pesanan || o.id,
                                                        "Batal",
                                                        o.nama_pemesan ||
                                                            o.title ||
                                                            "",
                                                    )
                                                }
                                                className="px-3 py-2 bg-rose-50 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-wider"
                                            >
                                                Batal
                                            </button>
                                        </>
                                    )}

                                    {(o.status_pesanan === "Disetujui" ||
                                        o.status === "Plotting") && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                (window.location.href = `/admin/plotting?id=${o.id_pesanan || o.id}`)
                                            }
                                            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm"
                                        >
                                            Plotting
                                        </button>
                                    )}

                                    {o.status_pesanan === "Terjadwal" && (
                                        <>
                                            <button
                                                type="button"
                                                disabled
                                                className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-not-allowed border border-slate-200/40"
                                            >
                                                Terjadwal
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    (window.location.href = `/admin/plotting?edit=true&id=${o.id_pesanan || o.id}`)
                                                }
                                                className="px-3 py-2 bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-wider border border-slate-200/60"
                                            >
                                                Ubah Plot
                                            </button>
                                        </>
                                    )}

                                    {(o.status_pesanan === "Batal" ||
                                        o.status === "Batal") && (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                if (
                                                    confirm(
                                                        "⚠️ Apakah Anda yakin ingin menghapus data pesanan batal ini secara permanen dari database?",
                                                    )
                                                ) {
                                                    try {
                                                        await axios.delete(
                                                            `/api/admin/pesanan/destroy/${o.id_pesanan || o.id}`,
                                                        );
                                                        alert(
                                                            "✨ Sukses: Data pesanan berhasil dihapus.",
                                                        );
                                                        fetchOrdersData();
                                                    } catch (error) {
                                                        alert(
                                                            "❌ Gagal menghapus data.",
                                                        );
                                                    }
                                                }
                                            }}
                                            className="p-2 bg-red-50 text-red-500 rounded-xl transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Jendela Modal Pembungkus */}
            <ModalOrder
                isOpen={isOpenModal}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSaveOrder}
                onClose={() => {
                    setIsOpenModal(false);
                    fetchOrdersData();
                }}
                fetchOrdersData={fetchOrdersData}
            />
        </AdminLayout>
    );
};

export default Orders;
