import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ModalOrder from "./OrderComponents/ModalOrder";
import OrderMainForm from "./OrderComponents/OrderMainForm";
import OrderFinanceForm from "./OrderComponents/OrderFinanceForm";
import Documents from "./OrderComponents/Documents";
import {
    Clock,
    MapPin,
    Calendar,
    Phone,
    Edit2,
    Printer,
    Trash2,
    Plus,
    Check,
    XCircle,
} from "lucide-react";
import axios from "axios";

const Orders: React.FC = () => {
    const { props } = usePage<any>();
    const armada = props.armada || []; // <── 🚀 SUNTIKKAN SAKRAL INDUK: Ambil data master armada dari Laravel!

    const [orders, setOrders] = useState<any[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<any | null>(
        null,
    );
    const [kataKunciPencarian, setKataKunciPencarian] = useState<string>("");
    const [statusFilterAktif, setStatusFilterAktif] = useState<string>("Semua");
    const [filterPembayaranAktif, setFilterPembayaranAktif] =
        useState<string>("Semua");

    const [formData, setFormData] = useState({
        id_pesanan: "",
        customerName: "",
        customerAddress: "",
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
        fleetRequirements: [
            {
                armada_id: "",
                qty: 1,
            },
        ],
        paymentType: "DP",
        paymentDate: new Date().toISOString().substring(0, 10),
        evidenceFile: null as File | null,
        bukti_transfer: "bukti_default.jpg",
        paymentStatus: "Pending",
        catatan_pembayaran: "",
        lain_lain: "",
        payments: [
            {
                type: "DP",
                date: new Date().toISOString().substring(0, 10),
                amount: 0,
                notes: "",
                evidenceFile: null,
                bukti_transfer: "bukti_default.jpg",
                paymentStatus: "Pending",
            },
        ],
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

    const handleSaveOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        const tglBerangkat = new Date(formData.departureDate);
        const tglPulang = new Date(formData.returnDate);

        // 🎯 KUNCI VALIDASI: Cek rincian pembayaran satu per satu
        const adaPembayaranTanpaBukti = formData.payments.some((p: any) => {
            const nominal = Number(p.amount || 0);
            // Jika nominal diisi (> 0) tapi file baru kosong DAN file lama juga default/kosong
            const belumAdaFileBaru = !p.evidenceFile;
            const belumAdaFileLama =
                !p.bukti_transfer || p.bukti_transfer === "bukti_default.jpg";

            return nominal > 0 && belumAdaFileBaru && belumAdaFileLama;
        });

        if (tglPulang < tglBerangkat) {
            alert(
                "❌ GAGAL: Tanggal Pulang tidak boleh mendahului Tanggal Berangkat!",
            );
            return;
        }

        if (adaPembayaranTanpaBukti) {
            alert(
                "❌ GAGAL SIMPAN: Terdapat rincian pembayaran yang nominalnya sudah diisi tapi BELUM UPLOAD bukti transfer. Harap lampirkan bukti terlebih dahulu!",
            );
            return; // Hentikan proses simpan
        }

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
        const nomorWA = formData.whatsapp.replace(/[^0-9]/g, "");
        if (nomorWA.length < 10) {
            alert(
                "❌ GAGAL: Nomor WhatsApp tidak valid (Minimal 10 digit angka)!",
            );
            return;
        }
        try {
            const dataBiner = new FormData();
            if (isEditMode) {
                dataBiner.append("id_pesanan", selectedId!);
            }
            dataBiner.append("customerName", formData.customerName);
            dataBiner.append("alamat", formData.customerAddress || "-");
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
            dataBiner.append("lain_lain", formData.lain_lain || "");
            const teksCatatanPolos =
                formData.catatan_pembayaran &&
                formData.catatan_pembayaran.trim().startsWith("{")
                    ? ""
                    : formData.catatan_pembayaran;
            dataBiner.append("catatan_pembayaran", teksCatatanPolos || "");

            if (formData.fleetRequirements) {
                dataBiner.append(
                    "fleetRequirements",
                    JSON.stringify(formData.fleetRequirements),
                );
            } else {
                dataBiner.append("fleetRequirements", JSON.stringify([]));
            }
            const arrayPembayaranBersih = (formData.payments || []).map(
                (p: any) => {
                    // 🎯 KUNCI 1: Mapping Nama ke ENUM Database agar tidak 500 (Internal Server Error)
                    let tipeEnum = p.type;
                    if (tipeEnum === "CICILAN" || tipeEnum === "Cicilan")
                        tipeEnum = "Cicil";
                    if (tipeEnum === "PELUNASAN" || tipeEnum === "Pelunasan")
                        tipeEnum = "Lunas";

                    return {
                        type: tipeEnum || "DP", // Pastikan masuk ke 'DP', 'Cicil', atau 'Lunas'
                        date:
                            p.date || new Date().toISOString().substring(0, 10),
                        amount: Number(p.amount || 0),
                        notes: String(p.notes || ""),
                        bukti_transfer: p.bukti_transfer || "bukti_default.jpg",
                        paymentStatus: p.paymentStatus || "Pending",
                    };
                    // 🎯 KUNCI 2: JANGAN masukkan 'evidenceFile' ke sini agar JSON tidak rusak/biner
                },
            );

            dataBiner.append(
                "paymentsData",
                JSON.stringify(arrayPembayaranBersih),
            );

            (formData.payments || []).forEach((p: any, index: number) => {
                if (p.evidenceFile) {
                    dataBiner.append(`evidenceFile_${index}`, p.evidenceFile);
                }
            });

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
            setFormData({
                id_pesanan: "",
                customerName: "",
                customerAddress: "",
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
                lain_lain: "",
                fleetRequirements: [
                    {
                        armada_id: "",
                        qty: 1,
                    },
                ],
                payments: [
                    {
                        type: "DP",
                        date: new Date().toISOString().substring(0, 10),
                        amount: 0,
                        notes: "",
                        evidenceFile: null,
                        bukti_transfer: "bukti_default.jpg",
                        paymentStatus: "Pending",
                    },
                ],
            });

            setIsOpenModal(false);
            setIsEditMode(false);
            fetchOrdersData();
        } catch (error) {
            console.error(error);
            alert("❌ Gagal: Masalah koneksi transmisi berkas data.");
        }
    };

    const ordersTersaring = React.useMemo(() => {
        // 1. Jaring pengaman data
        const dataMentah = Array.isArray(orders) ? orders : [];
        const sekarang = new Date();
        const kataKunci = kataKunciPencarian.toLowerCase().trim();

        return dataMentah.filter((o: any) => {
            // --- A. LOGIKA PENCARIAN (NAMA, ID, TUJUAN) ---
            const nama = String(
                o.nama_pemesan || o.customerName || "",
            ).toLowerCase();
            const id = String(o.id_pesanan || o.id || "").toLowerCase();
            const tujuan = String(
                o.tujuan_main || o.destination || "",
            ).toLowerCase();

            const cocokSearch =
                kataKunci === "" ||
                nama.includes(kataKunci) ||
                id.includes(kataKunci) ||
                tujuan.includes(kataKunci);

            // Jika tidak cocok pencarian, langsung buang
            if (!cocokSearch) return false;

            // --- B. LOGIKA STATUS VISUAL ---
            const dbStatus = String(o.status_pesanan || o.status || "");
            const tglBerangkat = o.tgl_berangkat
                ? new Date(o.tgl_berangkat)
                : null;
            const tglSelesai = o.tgl_selesai ? new Date(o.tgl_selesai) : null;

            let statusVisual = dbStatus;
            if (dbStatus === "Terjadwal" && tglBerangkat && tglSelesai) {
                if (sekarang >= tglBerangkat && sekarang <= tglSelesai) {
                    statusVisual = "Sedang Jalan";
                } else if (sekarang < tglBerangkat) {
                    statusVisual = "Terjadwal";
                } else if (sekarang > tglSelesai) {
                    statusVisual = "Menunggu Selesai";
                }
            }

            const cocokStatus =
                statusFilterAktif === "Semua" ||
                statusFilterAktif === "Semua Status" ||
                statusVisual === statusFilterAktif;

            // --- C. LOGIKA PEMBAYARAN ---
            const totalHarga = Number(o.harga_sewa || o.totalPrice || 0);
            let totalBayarRiil = 0;
            try {
                const catatan = o.catatan_pembayaran;
                if (
                    catatan &&
                    typeof catatan === "string" &&
                    catatan.trim().startsWith("[")
                ) {
                    JSON.parse(catatan).forEach((p: any) => {
                        if (p.paymentStatus === "Disetujui")
                            totalBayarRiil += Number(p.amount || 0);
                    });
                } else {
                    totalBayarRiil = Number(o.total_terbayar || o.nominal || 0);
                }
            } catch (e) {
                totalBayarRiil = 0;
            }

            let kategoriBayar = "Belum Bayar";
            if (totalHarga > 0) {
                if (totalBayarRiil >= totalHarga) kategoriBayar = "Lunas";
                else if (totalBayarRiil > 0) kategoriBayar = "DP";
            }

            const cocokPembayaran =
                filterPembayaranAktif === "Semua" ||
                filterPembayaranAktif === "Semua Pembayaran" ||
                kategoriBayar === filterPembayaranAktif;

            // HARUS LOLOS SEMUA FILTER
            return cocokStatus && cocokPembayaran;
        });
    }, [orders, kataKunciPencarian, statusFilterAktif, filterPembayaranAktif]);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const sekarang = new Date();

    return (
        <AdminLayout>
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-5 w-full">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
                            <div className="text-left">
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider leading-none">
                                    KELOLA PESANAN
                                </h2>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mt-1.5">
                                    MANAJEMEN TRANSAKSI BUS ARJUNA TRANS
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
                                <div className="relative">
                                    <select
                                        value={filterPembayaranAktif}
                                        onChange={(e) =>
                                            setFilterPembayaranAktif(
                                                e.target.value,
                                            )
                                        }
                                        className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-slate-200/70 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider text-slate-500 outline-none shadow-sm cursor-pointer min-w-[130px]"
                                    >
                                        <option value="Semua">
                                            Semua Pembayaran
                                        </option>
                                        <option value="Belum Bayar">
                                            Belum Bayar
                                        </option>
                                        <option value="DP">
                                            DP (Uang Muka)
                                        </option>
                                        <option value="Lunas">Lunas</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[8px]">
                                        ▼
                                    </div>
                                </div>
                                <div className="relative">
                                    <select
                                        value={statusFilterAktif}
                                        onChange={(e) =>
                                            setStatusFilterAktif(e.target.value)
                                        }
                                        className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-slate-200/70 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider text-slate-500 outline-none shadow-sm cursor-pointer min-w-[150px]"
                                    >
                                        <option value="Semua">
                                            Semua Status
                                        </option>
                                        <option value="Pending">
                                            Baru (Pending)
                                        </option>
                                        <option value="Disetujui">
                                            Disetujui
                                        </option>
                                        <option value="Terjadwal">
                                            Terjadwal (Mendatang)
                                        </option>
                                        <option value="Sedang Jalan">
                                            Sedang Jalan
                                        </option>
                                        {/* <option value="Menunggu Selesai">
                                            Menunggu Selesai
                                        </option> */}
                                        <option value="Selesai">
                                            Selesai (Tuntas)
                                        </option>
                                        <option value="Batal">Batal</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[8px]">
                                        ▼
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditMode(false);
                                        setFormData({
                                            id_pesanan: "",
                                            customerName: "",
                                            customerAddress: "",
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
                                            lain_lain: "",
                                            fleetRequirements: [
                                                {
                                                    armada_id: "",
                                                    qty: 1,
                                                },
                                            ],
                                            payments: [
                                                {
                                                    type: "DP",
                                                    date: new Date()
                                                        .toISOString()
                                                        .substring(0, 10),
                                                    amount: 0,
                                                    notes: "",
                                                    evidenceFile: null,
                                                    bukti_transfer:
                                                        "bukti_default.jpg",
                                                    paymentStatus: "Pending",
                                                },
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
                        <div className="relative w-full pt-1">
                            <input
                                type="text"
                                placeholder="Cari pelanggan atau tujuan..."
                                value={kataKunciPencarian}
                                onChange={(e) =>
                                    setKataKunciPencarian(e.target.value)
                                }
                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200/70 rounded-[1.5rem] text-xs font-bold text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 shadow-sm"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
                    {ordersTersaring.length > 0 ? (
                        ordersTersaring.map((o: any, idx: number) => {
                            // 🎯 1. DEFINISIKAN VARIABEL DASAR
                            const totalHarga = Number(o.harga_sewa || 0);
                            const statusSkrg = o.status_pesanan || o.status;
                            const tglBerangkat = new Date(o.tgl_berangkat);
                            const tglSelesai = new Date(o.tgl_selesai);

                            // 🎯 2. HITUNG PEMBAYARAN & PERLU ACC
                            let totalBayar = 0;
                            let adakahPembayaranBelumAcc = false;

                            try {
                                if (
                                    o.catatan_pembayaran &&
                                    typeof o.catatan_pembayaran === "string" &&
                                    o.catatan_pembayaran.trim().startsWith("[")
                                ) {
                                    const arrayJson = JSON.parse(
                                        o.catatan_pembayaran,
                                    );
                                    if (Array.isArray(arrayJson)) {
                                        arrayJson.forEach((p: any) => {
                                            if (
                                                p.paymentStatus === "Disetujui"
                                            ) {
                                                totalBayar += Number(
                                                    p.amount || 0,
                                                );
                                            }
                                            if (
                                                p.paymentStatus === "Pending" &&
                                                Number(p.amount || 0) > 0
                                            ) {
                                                adakahPembayaranBelumAcc = true;
                                            }
                                        });
                                    }
                                } else {
                                    totalBayar = Number(
                                        o.total_terbayar || o.nominal || 0,
                                    );
                                    if (
                                        o.status_pembayaran === "Pending" &&
                                        totalBayar > 0
                                    ) {
                                        adakahPembayaranBelumAcc = true;
                                    }
                                }
                            } catch (e) {
                                totalBayar = Number(
                                    o.total_terbayar || o.nominal || 0,
                                );
                            }

                            // 🎯 3. DEFINISIKAN isLunas (Agar error Ln 647 & 769 Hilang)
                            const isLunas =
                                totalHarga > 0 && totalBayar >= totalHarga;

                            // 🎯 4. LOGIKA LABEL KIRI (Baru, Perlu ACC, Selesai)
                            let labelKomponen = null; // (Agar error Ln 689 Hilang)
                            if (adakahPembayaranBelumAcc) {
                                labelKomponen = (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-amber-500 text-white rounded-md uppercase tracking-wider animate-pulse">
                                        Perlu ACC
                                    </span>
                                );
                            } else if (statusSkrg === "Pending") {
                                labelKomponen = (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-rose-100 text-rose-500 rounded-md uppercase tracking-wider">
                                        Baru
                                    </span>
                                );
                            } else if (statusSkrg === "Selesai") {
                                labelKomponen = (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded-md uppercase tracking-wider">
                                        Selesai
                                    </span>
                                );
                            }

                            // 🎯 5. LOGIKA BADGE KANAN (Status Operasional)
                            let badgeKanan = null;
                            if (statusSkrg === "Batal") {
                                badgeKanan = (
                                    <span className="px-3 py-1.5 bg-rose-50 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-rose-100">
                                        Batal
                                    </span>
                                );
                            } else if (statusSkrg === "Terjadwal") {
                                if (
                                    sekarang >= tglBerangkat &&
                                    sekarang <= tglSelesai
                                ) {
                                    badgeKanan = (
                                        <span className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                                            Sedang Jalan
                                        </span>
                                    );
                                } else if (sekarang > tglSelesai) {
                                    badgeKanan = (
                                        <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-xl text-[9px] font-black uppercase tracking-widest border border-amber-200">
                                            Menunggu Selesai
                                        </span>
                                    );
                                } else {
                                    badgeKanan = (
                                        <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200">
                                            Terjadwal
                                        </span>
                                    );
                                }
                            } else if (statusSkrg === "Disetujui") {
                                badgeKanan = (
                                    <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                                        Siap Plotting
                                    </span>
                                );
                            }
                            return (
                                <div
                                    key={o.id_pesanan || idx}
                                    className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden transition-all hover:border-indigo-100 will-change-transform transform-gpu"
                                >
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            let bgBoks = "bg-indigo-50";
                                            let warnaIkon = "text-indigo-600";
                                            let KomponenIkon = Clock;

                                            if (statusSkrg === "Batal") {
                                                bgBoks = "bg-rose-50";
                                                warnaIkon = "text-rose-500";
                                                KomponenIkon = XCircle;
                                            } else if (
                                                isLunas &&
                                                statusSkrg === "Terjadwal"
                                            ) {
                                                bgBoks = "bg-emerald-50/80";
                                                warnaIkon = "text-emerald-600";
                                                KomponenIkon = Check;
                                            } else if (
                                                adakahPembayaranBelumAcc &&
                                                statusSkrg === "Disetujui"
                                            ) {
                                                bgBoks = "bg-amber-50/80";
                                                warnaIkon = "text-amber-600";
                                                KomponenIkon = Clock;
                                            } else if (
                                                statusSkrg === "Pending"
                                            ) {
                                                bgBoks = "bg-amber-50/80";
                                                warnaIkon = "text-amber-600";
                                                KomponenIkon = Clock;
                                            }

                                            return (
                                                <div
                                                    className={`w-12 h-12 ${bgBoks} rounded-xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm`}
                                                >
                                                    <KomponenIkon
                                                        size={22}
                                                        className={`${warnaIkon} stroke-[2.5]`}
                                                    />
                                                </div>
                                            );
                                        })()}
                                        <div className="space-y-1 text-left">
                                            <div className="space-y-1 text-left">
                                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide leading-tight">
                                                    {o.nama_pemesan ||
                                                        o.title ||
                                                        "Pelanggan Tanpa Nama"}
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
                                                    {o.tujuan_main ||
                                                        o.rute ||
                                                        "-"}
                                                </p>
                                                <span className="hidden sm:inline text-slate-200">
                                                    |
                                                </span>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                                                        PERGI:{" "}
                                                        {o.tgl_berangkat
                                                            ? (() => {
                                                                  const [
                                                                      y,
                                                                      m,
                                                                      d,
                                                                  ] =
                                                                      o.tgl_berangkat
                                                                          .substring(
                                                                              0,
                                                                              10,
                                                                          )
                                                                          .split(
                                                                              "-",
                                                                          );
                                                                  return `${d}/${m}/${y}`;
                                                              })()
                                                            : "-"}
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                                                        PULANG:{" "}
                                                        {o.tgl_selesai
                                                            ? (() => {
                                                                  const [
                                                                      y,
                                                                      m,
                                                                      d,
                                                                  ] =
                                                                      o.tgl_selesai
                                                                          .substring(
                                                                              0,
                                                                              10,
                                                                          )
                                                                          .split(
                                                                              "-",
                                                                          );
                                                                  return `${d}/${m}/${y}`;
                                                              })()
                                                            : "-"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right min-w-[140px] space-y-1 border-t border-slate-50 md:border-none pt-2 md:pt-0">
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                Total Sewa
                                            </p>
                                            <p className="text-xs font-black text-slate-600 mt-0.5">
                                                Rp{" "}
                                                {totalHarga.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                Sisa Piutang
                                            </p>
                                            <p
                                                className={`text-xs font-black mt-0.5 ${
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
                                    <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
                                        {/* 1. TOMBOL EDIT (Paling Kiri) */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedId(o.id_pesanan);
                                                setIsEditMode(true);
                                                setFormData({ ...o });
                                                setIsOpenModal(true);
                                            }}
                                            className="p-2 text-slate-400 hover:text-indigo-600 transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>

                                        {/* 4. 🎯 TOMBOL TELEPON (Di Kanannya Status) */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                /* Logika WA */
                                            }}
                                            className="p-2 text-slate-400 hover:text-indigo-600 transition-all"
                                        >
                                            <Phone size={18} />
                                        </button>

                                        {/* 2. TOMBOL PRINT */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                /* Logika Print */
                                            }}
                                            className="w-10 h-10 bg-slate-950 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-all"
                                        >
                                            <Printer size={16} />
                                        </button>

                                        {/* 3. 🎯 BADGE STATUS (Sekarang di Kanannya Print) */}
                                        {statusSkrg === "Batal" && (
                                            <span className="px-3 py-1.5 bg-rose-50 text-rose-500 rounded-xl text-[9px] font-black uppercase border border-rose-100">
                                                Batal
                                            </span>
                                        )}
                                        {statusSkrg === "Disetujui" && (
                                            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase border border-indigo-100">
                                                Siap Plotting
                                            </span>
                                        )}
                                        {statusSkrg === "Terjadwal" &&
                                            sekarang >= tglBerangkat &&
                                            sekarang <= tglSelesai && (
                                                <span className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase shadow-sm">
                                                    Sedang Jalan
                                                </span>
                                            )}
                                        {statusSkrg === "Selesai" && (
                                            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-600 rounded-xl text-[9px] font-black uppercase border border-emerald-200">
                                                Selesai
                                            </span>
                                        )}
                                        {/* 5. TOMBOL AKSI UTAMA (Setujui / Plotting / Selesai / Ubah Plot) */}
                                        <div className="flex gap-1.5 ml-1">
                                            {statusSkrg === "Pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                o.id_pesanan,
                                                                "Disetujui",
                                                                o.nama_pemesan,
                                                            )
                                                        }
                                                        className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase"
                                                    >
                                                        Setujui
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                o.id_pesanan,
                                                                "Batal",
                                                                o.nama_pemesan,
                                                            )
                                                        }
                                                        className="px-3 py-2 bg-rose-50 text-rose-500 rounded-xl text-[9px] font-black uppercase"
                                                    >
                                                        Batal
                                                    </button>
                                                </>
                                            )}

                                            {statusSkrg === "Disetujui" && (
                                                <button
                                                    onClick={() =>
                                                        (window.location.href = `/plotting?id=${o.id_pesanan}`)
                                                    }
                                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase shadow-sm"
                                                >
                                                    Plotting
                                                </button>
                                            )}

                                            {statusSkrg === "Terjadwal" && (
                                                <>
                                                    {sekarang > tglSelesai ? (
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    o.id_pesanan,
                                                                    "Selesai",
                                                                    o.nama_pemesan,
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase shadow-md "
                                                        >
                                                            Selesaikan
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                // 🎯 LOGIKA PERINGATAN DARURAT
                                                                if (
                                                                    sekarang >=
                                                                        tglBerangkat &&
                                                                    sekarang <=
                                                                        tglSelesai
                                                                ) {
                                                                    if (
                                                                        confirm(
                                                                            "⚠️ PERINGATAN: Bus ini statusnya SEDANG JALAN. Mengubah plotting saat bus di jalan dapat memengaruhi perhitungan KM Kru. Yakin ingin melanjutkan?",
                                                                        )
                                                                    ) {
                                                                        window.location.href = `/plotting?id=${o.id_pesanan}`;
                                                                    }
                                                                } else {
                                                                    // Jika masih terjadwal biasa (belum jalan), langsung masuk tanpa alert
                                                                    window.location.href = `/plotting?id=${o.id_pesanan}`;
                                                                }
                                                            }}
                                                            className="px-3 py-2 bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase border border-slate-200/60 transition-all hover:bg-slate-100"
                                                        >
                                                            Ubah Plot
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="w-full p-12 text-center bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 text-xs my-4">
                            Data pesanan yang Anda cari tidak ditemukan.
                        </div>
                    )}
                </div>
            </div>
            <ModalOrder
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                isEditMode={isEditMode}
                formData={formData}
                armada={armada} // <── 🚀 SAKRAL INDUK: PASANG KEMBALI DI SINI AGAR ERROR TS(2741) MATI TOTAL!
            >
                <form onSubmit={handleSaveOrder} className="space-y-6">
                    <OrderMainForm
                        formData={formData}
                        setFormData={setFormData}
                        armada={armada}
                    />
                    <OrderFinanceForm
                        formData={formData}
                        setFormData={setFormData}
                        setPreviewUrl={setPreviewUrl}
                    />
                    {/* BARIS FOOTER AKSI SEJAJAR KAKU DI BAWAH */}
                    <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-100 flex-shrink-0 bg-white">
                        <button
                            type="button"
                            onClick={() => setIsOpenModal(false)}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 bg-[#5346F1] hover:bg-[#4338CA] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md text-center cursor-pointer shadow-indigo-600/10"
                        >
                            Simpan Detail Pesanan
                        </button>
                    </div>
                </form>
            </ModalOrder>
            {previewUrl && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewUrl(null)}
                >
                    <div
                        className="bg-white p-5 rounded-[2rem] max-w-sm w-full text-center shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={
                                previewUrl.startsWith("data:") ||
                                previewUrl.startsWith("blob:")
                                    ? previewUrl
                                    : `/uploads/bukti_transfer/${previewUrl}`
                            }
                            alt="Struk Transfer"
                            className="w-full h-auto rounded-xl object-contain max-h-[50vh] mb-3 border border-slate-100 bg-slate-50"
                        />

                        <button
                            type="button"
                            onClick={() => setPreviewUrl(null)}
                            className="w-full py-2 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer"
                        >
                            Tutup Struk
                        </button>
                    </div>
                </div>
            )}
            {activeInvoiceOrder && (
                <Documents
                    order={{
                        ...activeInvoiceOrder,
                        notes: activeInvoiceOrder.notes || "-",
                    }}
                    onClose={() => setActiveInvoiceOrder(null)}
                    state={{
                        orders: [],
                        crew: [],
                        armada: [
                            {
                                id: "0",
                                plateNumber: "S 7123 UA",
                                name:
                                    activeInvoiceOrder.fleetRequirements?.[0]
                                        ?.type || "Bus",
                                type:
                                    activeInvoiceOrder.fleetRequirements?.[0]
                                        ?.type === "Medium Bus"
                                        ? "Medium Bus"
                                        : "Big Bus",
                                capacity: 50,
                                facilities: ["AC", "TV", "Karaoke"],
                                status: "Ready",
                            },
                        ],
                    }}
                />
            )}
        </AdminLayout>
    );
};

export default Orders;
