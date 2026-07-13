import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
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
                    return {
                        type: p.type || "DP",
                        date: p.date || "",
                        amount: Number(p.amount || 0),
                        notes:
                            p.notes && p.notes.trim().startsWith("{")
                                ? ""
                                : p.notes || "",
                        bukti_transfer: p.bukti_transfer || "bukti_default.jpg",
                        paymentStatus: p.paymentStatus || "Pending",
                    };
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
        const dataMentahBiner = orders || [];
        if (!Array.isArray(dataMentahBiner) || dataMentahBiner.length === 0)
            return [];
        if (
            kataKunciPencarian === "" &&
            statusFilterAktif === "Semua" &&
            filterPembayaranAktif === "Semua"
        ) {
            return dataMentahBiner;
        }

        return dataMentahBiner.filter((o: any) => {
            // 1. Saringan Boks Pencarian Kata Kunci
            const kataKunci = kataKunciPencarian.toLowerCase().trim();
            const cocokKataKunci =
                kataKunci === "" ||
                String(o.nama_pemesan || "")
                    .toLowerCase()
                    .includes(kataKunci) ||
                String(o.id_pesanan || "")
                    .toLowerCase()
                    .includes(kataKunci) ||
                String(o.tujuan_main || "")
                    .toLowerCase()
                    .includes(kataKunci);

            // 2. Saringan Dropdown Status Pesanan (Disetujui, Terjadwal, Pending, Batal)
            const cocokStatus =
                statusFilterAktif === "Semua" ||
                String(o.status_pesanan) === statusFilterAktif;
            let statusPelunasanKartu = "Belum Bayar";

            if (String(o.status_pesanan).toLowerCase() === "disetujui") {
                statusPelunasanKartu = "DP";
            } else if (String(o.status_pesanan).toLowerCase() === "terjadwal") {
                statusPelunasanKartu = "Lunas";
            } else if (String(o.status_pesanan).toLowerCase() === "batal") {
                statusPelunasanKartu = "Belum Bayar";
            } else {
                statusPelunasanKartu = "Belum Bayar";
            }

            // 🚀 SINKRONISASI DROPDOWN ATAS: Mencocokkan nilai value dropdown monitor Anda
            const cocokPembayaran =
                filterPembayaranAktif === "Semua" ||
                filterPembayaranAktif === "Semua Pembayaran" ||
                (filterPembayaranAktif === "Belum Bayar" &&
                    statusPelunasanKartu === "Belum Bayar") ||
                (filterPembayaranAktif === "DP" &&
                    statusPelunasanKartu === "DP") ||
                (filterPembayaranAktif === "Lunas" &&
                    statusPelunasanKartu === "Lunas");

            return cocokKataKunci && cocokStatus && cocokPembayaran;
        });
    }, [orders, kataKunciPencarian, statusFilterAktif, filterPembayaranAktif]);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
                                <div className="relative ">
                                    <select
                                        value={statusFilterAktif}
                                        onChange={(e) =>
                                            setStatusFilterAktif(e.target.value)
                                        }
                                        className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-slate-200/70 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider text-slate-500 outline-none shadow-sm cursor-pointer min-w-[130px]"
                                    >
                                        <option value="Semua">
                                            Semua Status
                                        </option>
                                        <option value="Disetujui">
                                            Disetujui
                                        </option>
                                        <option value="Terjadwal">
                                            Terjadwal
                                        </option>
                                        <option value="Pending">Pending</option>
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
                            const totalHarga = Number(
                                o.harga_sewa || o.total_harga || 0,
                            );
                            const statusSkrg = o.status_pesanan || o.status;
                            let adakahPembayaranBelumAcc = false;
                            let totalBayar = 0;
                            try {
                                if (
                                    o.catatan_pembayaran &&
                                    o.catatan_pembayaran.trim().startsWith("[")
                                ) {
                                    const arrayJson = JSON.parse(
                                        o.catatan_pembayaran,
                                    );
                                    if (Array.isArray(arrayJson)) {
                                        const kantongPaymentsLokal = arrayJson;
                                        arrayJson.forEach((p: any) => {
                                            // Nominal sewa luar HANYA terakumulasi jika statusnya "Disetujui"
                                            if (
                                                p.paymentStatus === "Disetujui"
                                            ) {
                                                totalBayar += Number(
                                                    p.amount || 0,
                                                );
                                            }

                                            // Label kuning Perlu ACC menyala jika status pending DAN nominal uang diisi > 0
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
                            // --- CARI BAGIAN INI DI Orders.tsx ---
                            const isLunas =
                                totalHarga > 0 && totalBayar >= totalHarga;
                            let labelKomponen = null;

                            // 🎯 PERBAIKAN: Urutkan dari yang paling penting (Pembayaran & Pembatalan)
                            if (statusSkrg === "Batal") {
                                labelKomponen = (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-red-100 text-red-500 rounded-md uppercase tracking-wider">
                                        Batal
                                    </span>
                                );
                            } else if (adakahPembayaranBelumAcc) {
                            /* 1. CEK: Apakah ada pembayaran yang butuh konfirmasi? (Paling Prioritas) */
                                labelKomponen = (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-amber-100 text-amber-500 rounded-md uppercase tracking-wider animate-pulse">
                                        Perlu ACC
                                    </span>
                                );
                            } else if (isLunas && statusSkrg === "Terjadwal") {
                            /* 2. CEK: Apakah sudah lunas? */
                                labelKomponen = (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-500 rounded-md uppercase tracking-wider">
                                        Lunas
                                    </span>
                                );
                            } else if (statusSkrg === "Pending") {
                            /* 3. CEK: Apakah pesanan masih baru (Pending)? */
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
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (o.no_telp) {
                                                    const nomorBersih = String(
                                                        o.no_telp,
                                                    ).replace(/[^0-9]/g, "");
                                                    const nomorFormatWA =
                                                        nomorBersih.startsWith(
                                                            "0",
                                                        )
                                                            ? "62" +
                                                              nomorBersih.slice(
                                                                  1,
                                                              )
                                                            : nomorBersih;
                                                    window.open(
                                                        `https://wa.me/${nomorFormatWA}`,
                                                        "_blank",
                                                    );
                                                } else {
                                                    alert(
                                                        "📱 Pemberitahuan: Nomor telepon WhatsApp untuk pelanggan ini tidak ditemukan.",
                                                    );
                                                }
                                            }}
                                            className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                            title="Hubungi WhatsApp"
                                        >
                                            <Phone
                                                size={18}
                                                className="stroke-[2.5]"
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                let teksCatatanUtama = "";
                                                let tanggalJatuhTempo = "";
                                                let kantongPayments: any[] = [];

                                                try {
                                                    if (
                                                        o.catatan_pembayaran &&
                                                        o.catatan_pembayaran
                                                            .trim()
                                                            .startsWith("[")
                                                    ) {
                                                        const arrayJson =
                                                            JSON.parse(
                                                                o.catatan_pembayaran,
                                                            );
                                                        if (
                                                            Array.isArray(
                                                                arrayJson,
                                                            ) &&
                                                            arrayJson.length > 0
                                                        ) {
                                                            kantongPayments =
                                                                arrayJson;
                                                            teksCatatanUtama =
                                                                arrayJson[0]
                                                                    .notes ||
                                                                "";
                                                            tanggalJatuhTempo =
                                                                arrayJson[0]
                                                                    .date || "";
                                                        }
                                                    } else if (
                                                        o.catatan_pembayaran &&
                                                        o.catatan_pembayaran
                                                            .trim()
                                                            .startsWith("{")
                                                    ) {
                                                        const objekJson =
                                                            JSON.parse(
                                                                o.catatan_pembayaran,
                                                            );
                                                        if (
                                                            objekJson.riwayat &&
                                                            Array.isArray(
                                                                objekJson.riwayat,
                                                            )
                                                        ) {
                                                            kantongPayments =
                                                                objekJson.riwayat;
                                                            teksCatatanUtama =
                                                                objekJson
                                                                    .riwayat[0]
                                                                    ?.notes ||
                                                                "";
                                                        } else {
                                                            teksCatatanUtama =
                                                                objekJson.notes ||
                                                                "";
                                                        }
                                                    } else {
                                                        teksCatatanUtama =
                                                            o.catatan_pembayaran ||
                                                            "";
                                                        kantongPayments = [
                                                            {
                                                                type:
                                                                    o.tipe_keterangan ||
                                                                    "DP",
                                                                date: o.tgl_bayar
                                                                    ? o.tgl_bayar.substring(
                                                                          0,
                                                                          10,
                                                                      )
                                                                    : new Date()
                                                                          .toISOString()
                                                                          .substring(
                                                                              0,
                                                                              10,
                                                                          ),
                                                                amount: Number(
                                                                    o.total_terbayar ||
                                                                        o.nominal ||
                                                                        0,
                                                                ),
                                                                notes:
                                                                    o.catatan_pembayaran ||
                                                                    "",
                                                                evidenceFile:
                                                                    null,
                                                                bukti_transfer:
                                                                    o.bukti_transfer ||
                                                                    "bukti_default.jpg",
                                                                paymentStatus:
                                                                    o.status_pembayaran ||
                                                                    "Pending",
                                                            },
                                                        ];
                                                    }
                                                } catch (e) {
                                                    teksCatatanUtama =
                                                        o.catatan_pembayaran ||
                                                        "";
                                                    kantongPayments = [
                                                        {
                                                            type:
                                                                o.tipe_keterangan ||
                                                                "DP",
                                                            date: o.tgl_bayar
                                                                ? o.tgl_bayar.substring(
                                                                      0,
                                                                      10,
                                                                  )
                                                                : new Date()
                                                                      .toISOString()
                                                                      .substring(
                                                                          0,
                                                                          10,
                                                                      ),
                                                            amount: Number(
                                                                o.total_terbayar ||
                                                                    o.nominal ||
                                                                    0,
                                                            ),
                                                            notes:
                                                                o.catatan_pembayaran ||
                                                                "",
                                                            evidenceFile: null,
                                                            bukti_transfer:
                                                                o.bukti_transfer ||
                                                                "bukti_default.jpg",
                                                            paymentStatus:
                                                                o.status_pembayaran ||
                                                                "Pending",
                                                        },
                                                    ];
                                                }
                                                setSelectedId(
                                                    o.id_pesanan || o.id,
                                                );
                                                setIsEditMode(true);
                                                setFormData({
                                                    id_pesanan:
                                                        o.id_pesanan || "",
                                                    customerName:
                                                        o.nama_pemesan || "",
                                                    customerAddress:
                                                        o.alamat || "",
                                                    whatsapp: o.no_telp || "",
                                                    destination:
                                                        o.tujuan_main || "",
                                                    pickup:
                                                        o.alamat_penjemputan ||
                                                        "",
                                                    distance: String(
                                                        o.estimasi_jarak || 0,
                                                    ),
                                                    departureDate:
                                                        o.tgl_berangkat
                                                            ? o.tgl_berangkat
                                                                  .replace(
                                                                      " ",
                                                                      "T",
                                                                  )
                                                                  .substring(
                                                                      0,
                                                                      16,
                                                                  )
                                                            : "",
                                                    returnDate: o.tgl_selesai
                                                        ? o.tgl_selesai
                                                              .replace(" ", "T")
                                                              .substring(0, 16)
                                                        : "",
                                                    routeNotes: o.rute || "",
                                                    totalPrice: Number(
                                                        o.harga_sewa || 0,
                                                    ),
                                                    paidAmount: totalBayar,
                                                    dueDate: o.jatuh_tempo
                                                        ? o.jatuh_tempo.substring(
                                                              0,
                                                              10,
                                                          )
                                                        : tanggalJatuhTempo
                                                          ? tanggalJatuhTempo.substring(
                                                                0,
                                                                10,
                                                            )
                                                          : "",
                                                    paymentType:
                                                        o.tipe_keterangan ||
                                                        "DP",
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
                                                    evidenceFile: null,
                                                    lain_lain:
                                                        o.lain_lain || "",
                                                    fleetRequirements:
                                                        Array.isArray(
                                                            o.fleetRequirements,
                                                        ) &&
                                                        o.fleetRequirements
                                                            .length > 0
                                                            ? o.fleetRequirements.map(
                                                                  (
                                                                      fr: any,
                                                                  ) => ({
                                                                      armada_id:
                                                                          String(
                                                                              fr.armada_id,
                                                                          ),
                                                                      qty: Number(
                                                                          fr.qty,
                                                                      ),
                                                                  }),
                                                              )
                                                            : [
                                                                  {
                                                                      armada_id:
                                                                          "",
                                                                      qty: 1,
                                                                  },
                                                              ],
                                                    paymentStatus:
                                                        o.status_pembayaran ||
                                                        "Pending",
                                                    catatan_pembayaran:
                                                        teksCatatanUtama,
                                                    payments: kantongPayments,
                                                });
                                                setIsOpenModal(true);
                                            }}
                                            className="p-2 text-slate-400 hover:text-[#5346F1] hover:bg-indigo-50/50 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                            title="Edit Cepat Detail Pesanan"
                                        >
                                            <Edit2
                                                size={18}
                                                className="stroke-[2.5]"
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                let kantongSaringanBiner: any[] =
                                                    [];
                                                try {
                                                    if (
                                                        o.catatan_pembayaran &&
                                                        String(
                                                            o.catatan_pembayaran,
                                                        )
                                                            .trim()
                                                            .startsWith("[")
                                                    ) {
                                                        const hasilBongkar =
                                                            JSON.parse(
                                                                o.catatan_pembayaran,
                                                            );
                                                        if (
                                                            Array.isArray(
                                                                hasilBongkar,
                                                            )
                                                        ) {
                                                            kantongSaringanBiner =
                                                                hasilBongkar;
                                                        }
                                                    }
                                                } catch (e) {
                                                    kantongSaringanBiner = [];
                                                }

                                                const payloadOrderMurni = {
                                                    id: o.id_pesanan || "",
                                                    customerName:
                                                        o.nama_pemesan ||
                                                        "Tanpa Nama",
                                                    customerAddress:
                                                        o.alamat || "-",
                                                    route:
                                                        o.rute ||
                                                        o.tujuan_main ||
                                                        "-",
                                                    destination:
                                                        o.tujuan_main || "-",
                                                    departureTime:
                                                        o.tgl_berangkat ||
                                                        new Date().toISOString(),
                                                    pickupAddress:
                                                        o.alamat_penjemputan ||
                                                        "-",
                                                    totalPrice: Number(
                                                        o.harga_sewa || 0,
                                                    ),
                                                    downPayment: Number(
                                                        kantongSaringanBiner.find(
                                                            (p: any) =>
                                                                p.type ===
                                                                    "DP" &&
                                                                p.paymentStatus ===
                                                                    "Disetujui",
                                                        )?.amount || 0,
                                                    ),
                                                    remainingBalance:
                                                        Number(
                                                            o.harga_sewa || 0,
                                                        ) - totalBayar,
                                                    fleetRequirements:
                                                        o.tipe_unit_diminta
                                                            ? [
                                                                  {
                                                                      type: o.tipe_unit_diminta,
                                                                      count: Number(
                                                                          o.jumlah_unit_diminta ||
                                                                              1,
                                                                      ),
                                                                  },
                                                              ]
                                                            : [
                                                                  {
                                                                      type: "Bus",
                                                                      count: 1,
                                                                  },
                                                              ],
                                                    assignments: [
                                                        {
                                                            armadaId: "0",
                                                            assetType:
                                                                "Internal",
                                                            plateNumber:
                                                                "S 7123 UA",
                                                        },
                                                    ],
                                                    notes: o.lain_lain || "-",
                                                };
                                                setActiveInvoiceOrder(
                                                    payloadOrderMurni,
                                                );
                                            }}
                                            className="w-10 h-10 bg-slate-950 text-white rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-slate-900 transition-colors print:hidden"
                                            title="Buka Lembar Invoice"
                                        >
                                            <Printer size={16} />
                                        </button>

                                        {(o.status_pesanan === "Pending" ||
                                            o.status === "Baru") && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            o.id_pesanan ||
                                                                o.id,
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
                                                            o.id_pesanan ||
                                                                o.id,
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
