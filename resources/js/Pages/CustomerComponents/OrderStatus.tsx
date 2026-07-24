import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import ModalSuccessPayment from "../ReportComponents/ModalSuccessPayment";
import Documents from "../OrderComponents/Documents";
import axios from "axios";
import {
    ArrowLeft,
    Search,
    Info,
    Clock,
    Calendar,
    MessageSquare,
    Receipt,
    UploadCloud,
    ArrowRight,
    Printer,
    Phone,
    MapPin,
    Bus,
    Eye,
    AlertCircle,
    XCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OrderStatus: React.FC = () => {
    // STATE MANAGEMENT DYNAMIC CONTROL
    const [searchTab, setSearchTab] = useState<"ID" | "WA">("ID");
    const [inputValue, setInputValue] = useState("");
    const [showList, setShowResultList] = useState(false);
    const [showDetail, setShowResultDetail] = useState(false);
    const [paymentTab, setPaymentTab] = useState<string>("DP");
    const [isWAConfirmOpen, setIsWAConfirmOpen] = useState(false);
    const [isSuccessUploadOpen, setIsSuccessUploadOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

    // KUNCI SAKRAL 2: Gunakan satu nama penampung database dinamis 'dynamicOrder'
    const [dynamicOrder, setDynamicOrder] = useState<any>(null);
    const [dynamicList, setDynamicList] = useState<any[]>([]);

    // State form upload bukti transfer pelanggan
    const [inputTanggal, setInputTanggal] = useState("");
    const [inputNominal, setInputNominal] = useState("");
    const [inputCatatan, setInputCatatan] = useState("");
    const [buktiFile, setBuktiFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    // Dummy data cadangan aman agar link WA tidak putus saat inisialisasi awal
    const backupOrder = { id: "ORD", customerName: "Pelanggan" };
    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        try {
            const response = await axios.post("/api/order/search", {
                type: searchTab,
                value: inputValue,
            });

            const result = response.data.data;

            if (searchTab === "ID") {
                if (!result) {
                    alert("ID Pesanan tidak ditemukan di database!");
                    return;
                }
                setDynamicOrder(result);
                setShowResultList(false);
                setShowResultDetail(true);
            } else {
                if (!result || result.length === 0) {
                    alert(
                        "Tidak ada pesanan terdaftar dengan nomor WhatsApp ini!",
                    );
                    return;
                }
                setDynamicList(result);
                setShowResultDetail(false);
                setShowResultList(true);
            }
        } catch (error) {
            console.error("Gagal mencari data:", error);
            alert("Terjadi kesalahan koneksi sistem.");
        }
    };

    const handleUploadPembayaran = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Ambil data dasar
        const nominalInput = Number(
            String(inputNominal).replace(/[^0-9]/g, ""),
        );
        const totalHargaSewa = staticOrder.totalPrice || 0;
        const sisaPiutang = staticOrder.remainingBalance || 0;

        // --- 🎯 LOGIKA VALIDASI BISNIS (UNTUK BIMBINGAN) ---

        // A. Validasi Kelengkapan Dasar
        if (!inputTanggal) return alert("Silakan pilih tanggal transfer.");
        if (nominalInput <= 0) return alert("Nominal pembayaran tidak valid.");
        if (!buktiFile) return alert("Silakan lampirkan foto bukti transfer.");

        // B. Aturan DP (Minimal 30%)
        if (paymentTab === "DP") {
            const minDP = totalHargaSewa * 0.3;
            if (nominalInput < minDP) {
                alert(
                    `⚠️ PEMBAYARAN DITOLAK: \nMinimal DP adalah 30% dari total sewa (Rp ${minDP.toLocaleString("id-ID")}).`,
                );
                return;
            }
        }

        // C. Aturan CICILAN (Minimal 10% - Solusi pertanyaan dosen)
        if (paymentTab === "Ccilan") {
            const minCicil = totalHargaSewa * 0.1; // Minimal 10%
            if (nominalInput < minCicil) {
                alert(
                    `⚠️ PEMBAYARAN DITOLAK: \nCicilan minimal adalah 10% dari total sewa (Rp ${minCicil.toLocaleString("id-ID")}). \n\nJika ingin membayar sisa tagihan yang kecil, silakan pilih kategori 'PELUNASAN'.`,
                );
                return;
            }
        }

        // D. Cek Kelebihan Bayar (Pencegahan Error)
        if (nominalInput > sisaPiutang) {
            alert(
                `⚠️ NOMINAL BERLEBIH: \nNominal yang Anda masukkan (Rp ${nominalInput.toLocaleString("id-ID")}) melebihi sisa tagihan Anda (Rp ${sisaPiutang.toLocaleString("id-ID")}).`,
            );
            return;
        }

        // --- 🚀 PROSES KIRIM DATA (JALAN JIKA LOLOS VALIDASI) ---

        const targetId = dynamicOrder?.id_pesanan || dynamicOrder?.id;
        if (!targetId) return;

        const dataBiner = new FormData();
        dataBiner.append("id_pesanan", targetId);
        dataBiner.append("nominal", String(nominalInput));
        dataBiner.append("tgl_bayar", inputTanggal);
        dataBiner.append("tipe_keterangan", paymentTab);
        dataBiner.append("catatan", inputCatatan);
        dataBiner.append("bukti_transfer", buktiFile as File);

        try {
            const res = await axios.post(
                "/api/order/upload-payment",
                dataBiner,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );

            if (res.status === 200) {
                setIsSuccessUploadOpen(true);
                const refresh = await axios.post("/api/order/search", {
                    type: "ID",
                    value: targetId,
                });
                setDynamicOrder(refresh.data.data);
                setBuktiFile(null);
                setInputNominal("");
                setInputCatatan("");
            }
        } catch (err: any) {
            alert(
                "SISTEM ERROR: " + (err.response?.data?.message || err.message),
            );
        }
    };

    const executeWAOpen = () => {
        const currentId = dynamicOrder?.id_pesanan || backupOrder.id;
        const orderId = dynamicOrder?.id_pesanan || dynamicOrder?.id;
        const namaPelanggan = dynamicOrder?.customerName || "Pelanggan";
        const nomorAdmin = "6281938845765";
        const message = encodeURIComponent(
            `Halo Admin Arjuna Trans, saya ingin melakukan Konfirmasi & Nego untuk pesanan dengan\n\n` +
                `• ID Pesanan: ${orderId}\n` +
                `• Atas Nama: ${namaPelanggan}\n\n.`,
        );
        window.open(`https://wa.me/${nomorAdmin}?text=${message}`, "_blank");
        setIsWAConfirmOpen(false);
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById("arjuna-invoice-print-sheet");
        if (!element) {
            alert("Template dokumen cetak invoice tidak ditemukan!");
            return;
        }
        try {
            alert(
                "Sedang mengunduh dokumen Invoice resmi Arjuna Trans, mohon tunggu...",
            );
            element.style.display = "block";
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Invoice-ArjunaTrans-${staticOrder.id}.pdf`);
            element.style.display = "none";
        } catch (error) {
            console.error("Gagal cetak PDF resmi:", error);
        }
    };

    const handlePrint = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ): Promise<void> => {
        event.preventDefault();

        // KUNCI ASLI: Kita arahkan target jepretan ke ID invoice-print-area
        const element = document.getElementById("invoice-print-area");
        if (!element) {
            alert("Area dokumen invoice tidak ditemukan!");
            return;
        }
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Invoice-ArjunaTrans-${staticOrder.id}.pdf`);
        } catch (error) {
            console.error("Gagal cetak PDF:", error);
        }
    };
    const staticOrder: any = dynamicOrder || { fleets: [] };
    const isLunas =
        staticOrder.totalPrice > 0 && staticOrder.remainingBalance <= 0;
    const minDPPercent = 0.3;
    const minDPAmount = staticOrder.totalPrice * minDPPercent;
    const listKategoriBayar = [
        { id: "DP", label: "DP" },
        { id: "Cicil", label: "Cicilan" },
        { id: "Lunas", label: "Pelunasan" },
    ];

    return (
        <div className="bg-[#F8FAFC] min-h-screen font-sans pb-20 text-left select-none animate-in fade-in duration-500 relative">
            {/* 1. Header Navigasi Atas (Logo Terpusat Kunci Mati) */}
            <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 relative">
                <div className="flex items-center w-full min-h-[36px]">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-3 text-[10px] font-black uppercase text-[#94A3B8] tracking-widest hover:text-[#5346F1] transition-all no-underline z-10"
                    >
                        <div className="w-9 h-9 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-[#94A3B8] shadow-sm transition-all group-hover:bg-[#5346F1] group-hover:text-white">
                            <ArrowLeft size={14} strokeWidth={3} />
                        </div>
                        <span>Kembali</span>
                    </Link>
                    <span className="absolute left-1/2 -translate-x-1/2 text-base font-black text-slate-700 italic tracking-tight pointer-events-none whitespace-nowrap">
                        ArjunaTrans
                    </span>
                </div>
            </div>
            <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6">
                <div className="text-center space-y-2 mb-6">
                    <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">
                        Cek Pesanan
                    </h2>
                    <p className="text-slate-400 text-xs font-semibold">
                        Masukkan ID atau nomor WhatsApp Anda untuk melihat
                        perkembangan terbaru.
                    </p>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5">
                    <div className="bg-[#F5F3FF] border border-indigo-100 text-[#5346F1] rounded-2xl p-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-wider">
                        <Info size={14} className="shrink-0 text-indigo-500" />
                        <span>
                            LUPA ID? GUNAKAN FITUR VIA WHATSAPP MENGGUNAKAN
                            NOMOR TERDAFTAR.
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-widest text-center">
                        <button
                            onClick={() => {
                                setSearchTab("ID");
                                setDynamicOrder(null);
                                setShowResultList(false);
                                setShowResultDetail(false);
                                setInputValue("");
                            }}
                            type="button"
                            className={`py-3.5 rounded-2xl transition-all ${searchTab === "ID" ? "bg-[#5346F1] text-white" : "bg-slate-50 text-slate-400"}`}
                        >
                            Cek Via ID Pesanan
                        </button>
                        <button
                            onClick={() => {
                                setSearchTab("WA");
                                setShowResultList(false);
                                setShowResultDetail(false);
                            }}
                            type="button"
                            className={`py-3.5 rounded-2xl transition-all ${searchTab === "WA" ? "bg-[#5346F1] text-white" : "bg-slate-50 text-slate-400"}`}
                        >
                            Cek Via WhatsApp
                        </button>
                    </div>
                    <form onSubmit={handleSearchSubmit} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                            />
                            <input
                                type="text"
                                placeholder={
                                    searchTab === "ID"
                                        ? "Contoh: ORD-8392-WEB"
                                        : "Masukkan Nomor WhatsApp (Hanya Angka)"
                                }
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                // TAMBAHKAN INI:
                                inputMode={
                                    searchTab === "WA" ? "numeric" : "text"
                                }
                                onKeyPress={(e) => {
                                    if (
                                        searchTab === "WA" &&
                                        !/[0-9]/.test(e.key)
                                    ) {
                                        e.preventDefault(); // User gak akan bisa ngetik huruf kalau di tab WA
                                    }
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold text-slate-800 outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#5346F1] text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-2xl shadow-md"
                        >
                            CARI
                        </button>
                    </form>
                </div>
            </div>
            {showList && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-5 text-left space-y-2.5">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] pl-2 block">
                        Daftar Pesanan Anda ({dynamicList.length})
                    </span>

                    {/* KUNCI: Kita harus melakukan mapping/looping pada dynamicList */}
                    {dynamicList.map((item: any, idx: number) => (
                        <div
                            key={idx}
                            onClick={() => {
                                // 1. Masukkan data item yang diklik ke dalam dynamicOrder
                                setDynamicOrder(item);
                                // 2. Tampilkan area detail
                                setShowResultDetail(true);
                                // 3. (Opsional) Sembunyikan list agar fokus ke detail
                                setShowResultList(false);
                            }}
                            className="bg-white rounded-[1.75rem] border border-slate-100 p-5 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all mb-2"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-indigo-600 font-black text-xs rounded-xl flex items-center justify-center">
                                    ORD
                                </div>
                                <div className="text-left">
                                    <h4 className="text-sm font-black text-slate-800 leading-none uppercase">
                                        {item.customerName}
                                    </h4>
                                    <span className="text-[9px] font-bold text-slate-400 block mt-1">
                                        {item.id}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black px-2 py-1 bg-slate-100 text-slate-400 rounded-md uppercase">
                                    {item.status}
                                </span>
                                <ArrowRight
                                    size={14}
                                    className="text-slate-300"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* DETAIL PESANAN */}
            {showDetail && dynamicOrder && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 animate-in slide-in-from-bottom-6 duration-500">
                    <div
                        id="invoice-print-area"
                        className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100/90 shadow-sm space-y-6"
                    >
                        {/* --- 1. HEADER DETAIL (DESAIN ASLI) --- */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-black text-indigo-600 bg-slate-50 border px-2.5 py-1 rounded-xl">
                                    ORD
                                </span>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 uppercase leading-none">
                                        {staticOrder.customerName}
                                    </h4>
                                    <span className="text-[9px] font-bold text-slate-400 block mt-1">
                                        {staticOrder.id}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                {staticOrder.totalPrice > 0 && (
                                    <button
                                        onClick={() => setIsInvoiceOpen(true)}
                                        type="button"
                                        className="w-8 h-8 bg-slate-950 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
                                    >
                                        <Printer size={13} strokeWidth={2.5} />
                                    </button>
                                )}
                                <button
                                    onClick={executeWAOpen}
                                    type="button"
                                    className="bg-[#00BFA5] text-white text-[8px] font-black uppercase px-3 py-2 rounded-xl shadow-md"
                                >
                                    Konfirmasi & Nego (WA)
                                </button>
                            </div>
                        </div>

                        {/* --- 2. NOTIFIKASI PENTING (DESAIN ASLI) --- */}
                        <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 text-left space-y-1">
                            <p className="text-[11px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1">
                                ⚠️ PENTING: KONFIRMASI WHATSAPP DIPERLUKAN!
                            </p>
                            <p className="text-[12px] font-semibold text-amber-600/90 leading-relaxed italic">
                                Pesanan Anda telah kami terima dengan status
                                Baru (Pending). Silakan klik tombol "Konfirmasi
                                & Nego (WA)" di atas untuk mendiskusikan harga
                                sewa, ketersediaan unit, dan detail penawaran
                                armada dari admin kami.
                            </p>
                        </div>

                        {/* --- 3. GRID INFORMASI & PEMBAYARAN (DESAIN ASLI) --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-3 text-left">
                                <h4 className="text-[9px] font-black text-indigo-600 uppercase tracking-widest border-b pb-1.5">
                                    Informasi Perjalanan
                                </h4>
                                <div className="space-y-2 text-xs font-bold text-slate-700">
                                    <p className="flex items-center gap-1.5">
                                        <MapPin
                                            size={12}
                                            className="text-indigo-500"
                                        />{" "}
                                        {staticOrder.destination}
                                    </p>
                                    <p className="flex items-center gap-1.5">
                                        <Calendar
                                            size={12}
                                            className="text-indigo-500"
                                        />{" "}
                                        Berangkat: {staticOrder.departureTime}
                                    </p>
                                    <p className="flex items-center gap-1.5">
                                        <Phone
                                            size={12}
                                            className="text-indigo-500"
                                        />{" "}
                                        {staticOrder.whatsapp}
                                    </p>

                                    {/* Info armada yang dipesan */}
                                    <div className="pt-2 mt-2 border-t border-slate-50">
                                        {staticOrder.fleetRequirements?.map(
                                            (f: any, i: number) => (
                                                <p
                                                    key={i}
                                                    className="text-indigo-600 flex items-center gap-1.5"
                                                >
                                                    <Bus size={10} /> {f.qty}{" "}
                                                    {f.tipe_armada}
                                                </p>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-50/50 p-5 rounded-[1.75rem] border border-slate-100/80">
                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b pb-1.5 flex items-center gap-1">
                                    <Receipt size={11} /> DETAIL PEMBAYARAN
                                </h4>
                                <div className="space-y-1.5 text-xs font-bold text-slate-500 text-left">
                                    <div className="flex justify-between">
                                        <span>Total Sewa</span>
                                        <span className="text-slate-800 font-black">
                                            Rp{" "}
                                            {(
                                                staticOrder.totalPrice || 0
                                            ).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span>Terbayar</span>
                                        <span className="text-indigo-600 font-bold">
                                            Rp{" "}
                                            {(
                                                staticOrder.downPayment || 0
                                            ).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-slate-800 shadow-sm mt-2">
                                    <span className="text-[10px] font-black uppercase text-slate-600">
                                        SISA PIUTANG
                                    </span>
                                    <span className="text-lg font-black text-red-500">
                                        Rp{" "}
                                        {(
                                            staticOrder.remainingBalance || 0
                                        ).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* --- 4. AKSI PEMBAYARAN (DENGAN LOGIKA LUNAS) --- */}
                        <div className="pt-4 border-t border-slate-100 space-y-4 text-left">
                            <div className="flex items-center gap-2 pb-1 border-b border-slate-50">
                                <Receipt size={12} className="text-[#5346F1]" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#5346F1]">
                                    Aksi Pembayaran
                                </h4>
                            </div>

                            {isLunas ? (
                                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2rem] text-center space-y-2">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Receipt size={24} />
                                    </div>
                                    <h5 className="text-sm font-black text-emerald-800 uppercase">
                                        Tagihan Telah Lunas
                                    </h5>
                                    <p className="text-[10px] text-emerald-600/80 font-bold italic">
                                        Terima kasih, pembayaran pesanan ini
                                        sudah selesai.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-slate-400 uppercase pl-1">
                                                Jenis Pembayaran
                                            </label>
                                            <select
                                                value={paymentTab}
                                                onChange={(e) =>
                                                    setPaymentTab(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none focus:border-[#5346F1] shadow-sm"
                                            >
                                                {/* Mapping Dinamis dari variabel listKategoriBayar */}
                                                {listKategoriBayar.map(
                                                    (item) => (
                                                        <option
                                                            key={item.id}
                                                            value={item.id}
                                                        >
                                                            {item.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-slate-400 uppercase pl-1">
                                                Tanggal Transfer
                                            </label>
                                            <input
                                                type="date"
                                                value={inputTanggal}
                                                onChange={(e) =>
                                                    setInputTanggal(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none focus:border-[#5346F1] shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-slate-400 uppercase pl-1">
                                                Nominal (Rp)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={
                                                        inputNominal
                                                            ? Number(
                                                                  inputNominal,
                                                              ).toLocaleString(
                                                                  "id-ID",
                                                              )
                                                            : ""
                                                    }
                                                    onChange={(e) =>
                                                        setInputNominal(
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                "",
                                                            ),
                                                        )
                                                    }
                                                    className="w-full p-2.5 pl-8 bg-white border border-slate-200 rounded-xl font-black text-[#5346F1] text-xs outline-none focus:border-[#5346F1] shadow-sm"
                                                    placeholder="0"
                                                />
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">
                                                    Rp
                                                </span>
                                            </div>

                                            {/* --- PESAN PERINGATAN DINAMIS (KOREKSI) --- */}
                                            {staticOrder.totalPrice > 0 && (
                                                <div className="mt-1">
                                                    {/* 1. Jika pilih DP */}
                                                    {paymentTab === "DP" && (
                                                        <p className="text-[8px] text-amber-600 font-bold italic">
                                                            * Minimal DP (30%):
                                                            Rp{" "}
                                                            {(
                                                                staticOrder.totalPrice *
                                                                0.3
                                                            ).toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </p>
                                                    )}

                                                    {/* 2. Jika pilih Cicil (Sebelumnya "CICILAN") */}
                                                    {paymentTab === "Cicil" && (
                                                        <p className="text-[8px] text-amber-600 font-bold italic">
                                                            * Minimal Cicilan
                                                            (10%): Rp{" "}
                                                            {(
                                                                staticOrder.totalPrice *
                                                                0.1
                                                            ).toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </p>
                                                    )}

                                                    {/* 3. Jika pilih Lunas (Sebelumnya "PELUNASAN") */}
                                                    {paymentTab === "Lunas" && (
                                                        <p className="text-[8px] text-emerald-600 font-bold italic">
                                                            * Masukkan sisa
                                                            tagihan: Rp{" "}
                                                            {staticOrder.remainingBalance.toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-slate-400 uppercase pl-1">
                                            Keterangan Transfer
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Transfer Mandiri an. Ahmad"
                                            value={inputCatatan}
                                            onChange={(e) =>
                                                setInputCatatan(e.target.value)
                                            }
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs outline-none focus:border-[#5346F1] shadow-sm"
                                        />
                                    </div>
                                    <div
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    "hidden-file-input",
                                                )
                                                ?.click()
                                        }
                                        className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/30 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all"
                                    >
                                        <UploadCloud
                                            size={16}
                                            className="text-indigo-600 mb-1"
                                        />
                                        <input
                                            id="hidden-file-input"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                setBuktiFile(
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                        />
                                        <p className="text-[9px] font-black text-[#5346F1] uppercase">
                                            {buktiFile
                                                ? `BERKAS: ${buktiFile.name.toUpperCase()}`
                                                : `LAMPIRKAN BUKTI ${paymentTab}`}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleUploadPembayaran}
                                        className="w-full py-4 bg-[#5346F1] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg transition-all active:scale-95"
                                    >
                                        Kirim Bukti Pembayaran
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* --- 5. RIWAYAT PEMBAYARAN (DENGAN SCROLL) --- */}
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5">
                                    <Receipt size={12} /> Riwayat Pembayaran
                                </span>
                                <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                                    {staticOrder.paymentHistory?.filter(
                                        (p: any) => Number(p.nominal) > 0,
                                    ).length || 0}{" "}
                                    Transaksi
                                </span>
                            </div>

                            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                                {staticOrder.paymentHistory?.filter(
                                    (pay: any) => {
                                        return !(
                                            Number(pay.nominal) === 0 &&
                                            pay.status_pembayaran === "Pending"
                                        );
                                    },
                                ).length > 0 ? (
                                    staticOrder.paymentHistory
                                        .filter(
                                            (pay: any) =>
                                                !(
                                                    Number(pay.nominal) === 0 &&
                                                    pay.status_pembayaran ===
                                                        "Pending"
                                                ),
                                        )
                                        .map((pay: any, idx: number) => {
                                            const isDitolak =
                                                pay.status_pembayaran ===
                                                "Ditolak";
                                            return (
                                                <div
                                                    key={idx}
                                                    className="bg-white border border-slate-100 rounded-[1.5rem] p-5 shadow-sm mb-2 text-left"
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${pay.status_pembayaran === "Disetujui" ? "bg-emerald-50 text-emerald-500" : isDitolak ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"}`}
                                                            >
                                                                <Receipt
                                                                    size={20}
                                                                />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-xs font-black uppercase">
                                                                    {
                                                                        pay.tipe_keterangan
                                                                    }{" "}
                                                                    |{" "}
                                                                    <span className="text-[#5346F1]">
                                                                        Rp{" "}
                                                                        {(
                                                                            pay.nominal ||
                                                                            0
                                                                        ).toLocaleString(
                                                                            "id-ID",
                                                                        )}
                                                                    </span>
                                                                </p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase">
                                                                    {
                                                                        pay.tgl_bayar
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() =>
                                                                    setPreviewUrl(
                                                                        pay.bukti_transfer,
                                                                    )
                                                                }
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase transition-all"
                                                            >
                                                                <Eye
                                                                    size={12}
                                                                />{" "}
                                                                Bukti
                                                            </button>
                                                            <span
                                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${pay.status_pembayaran === "Disetujui" ? "bg-emerald-100 text-emerald-600" : isDitolak ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"}`}
                                                            >
                                                                {
                                                                    pay.status_pembayaran
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {isDitolak && (
                                                        <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2">
                                                            <AlertCircle
                                                                size={14}
                                                                className="text-rose-500 shrink-0 mt-0.5"
                                                            />
                                                            <p className="text-[11px] font-bold text-rose-400 italic">
                                                                "
                                                                {pay.alasan_admin ||
                                                                    "Mohon hubungi admin."}
                                                                "
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                ) : (
                                    <p className="text-center text-[10px] text-slate-300 py-6 italic uppercase font-black tracking-widest">
                                        Belum ada riwayat pembayaran
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* --- 6. ARMADA DITUGASKAN (DESAIN ASLI INDIGO) --- */}
                        <div className="bg-[#5346F1] rounded-[1.75rem] p-5 text-white text-left space-y-3 shadow-md shadow-indigo-100">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-90 flex items-center gap-1.5">
                                <Bus size={12} /> ARMADA & SUPIR DITUGASKAN
                            </h4>
                            <div className="flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-wider">
                                {staticOrder?.fleets?.length > 0 ? (
                                    staticOrder.fleets.map(
                                        (fleet: any, fIdx: any) => (
                                            <div
                                                key={fIdx}
                                                className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl min-w-[140px] space-y-1"
                                            >
                                                <p className="text-[11px] text-white font-black leading-none">
                                                    {fleet.name}
                                                </p>
                                                <p className="text-[8px] text-indigo-200 font-black tracking-widest pt-1">
                                                    {fleet.plate}
                                                </p>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <p className="text-[10px] italic opacity-60">
                                        Menunggu konfirmasi unit oleh admin...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* MODAL ZOOM GAMBAR - PASTI JALAN */}
            {previewUrl && (
                <div
                    className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[500] flex flex-col items-center justify-center p-4"
                    onClick={() => setPreviewUrl(null)}
                >
                    {/* Tombol Tutup Melayang di Atas */}
                    <button className="mb-4 text-white font-black uppercase text-[10px] flex items-center gap-2">
                        Tutup Preview <XCircle size={20} />
                    </button>

                    <div
                        className="bg-white p-3 rounded-[2.5rem] max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={`/uploads/bukti_transfer/${previewUrl}`}
                            className="w-full h-auto rounded-[1.5rem] shadow-sm max-h-[70vh] object-contain"
                            alt="Bukti Transfer"
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://placehold.co/400x600?text=Gambar+Tidak+Ditemukan";
                            }}
                        />
                        <div className="py-4 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Arsip Bukti Transfer Pelanggan
                            </p>
                            <p className="text-[9px] font-bold text-indigo-500 uppercase mt-1">
                                PO. Arjuna Trans Mojokerto
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isInvoiceOpen && dynamicOrder && (
                <Documents
                    onClose={() => setIsInvoiceOpen(false)}
                    order={{
                        ...dynamicOrder, // Ambil semua data dasar
                        fleetRequirements:
                            dynamicOrder.fleets?.map((f: any) => ({
                                type: f.name,
                                count: 1,
                            })) || [],
                        assignments:
                            dynamicOrder.fleets?.map((f: any) => ({
                                armadaId: "999",
                                assetType: "Rekanan",
                                platLuar: f.plate,
                            })) || [],

                        paymentHistory: dynamicOrder.paymentHistory || [],
                    }}
                    state={{
                        armada: [], // Biarkan kosong, tidak masalah karena sudah pakai trik 'Rekanan'
                        orders: [],
                        crew: [],
                    }}
                />
            )}
            <ModalSuccessPayment
                isOpen={isSuccessUploadOpen}
                onClose={() => setIsSuccessUploadOpen(false)}
            />
        </div>
    );
};

export default OrderStatus;
