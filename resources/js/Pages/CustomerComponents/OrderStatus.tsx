import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import ModalSuccessPayment from "../ReportComponents/ModalSuccessPayment";
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
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OrderStatus: React.FC = () => {
    // STATE MANAGEMENT DYNAMIC CONTROL
    const [searchTab, setSearchTab] = useState<"ID" | "WA">("ID");
    const [inputValue, setInputValue] = useState("");
    const [showList, setShowResultList] = useState(false);
    const [showDetail, setShowResultDetail] = useState(false);
    const [paymentTab, setPaymentTab] = useState<
        "DP" | "CICILAN" | "PELUNASAN"
    >("DP");
    const [isWAConfirmOpen, setIsWAConfirmOpen] = useState(false);
    const [isSuccessUploadOpen, setIsSuccessUploadOpen] = useState(false);

    // KUNCI SAKRAL 2: Gunakan satu nama penampung database dinamis 'dynamicOrder'
    const [dynamicOrder, setDynamicOrder] = useState<any>(null);
    const [dynamicList, setDynamicList] = useState<any[]>([]);

    // State form upload bukti transfer pelanggan
    const [inputTanggal, setInputTanggal] = useState("");
    const [inputNominal, setInputNominal] = useState("1200000");
    const [buktiFile, setBuktiFile] = useState<File | null>(null);

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
        if (!buktiFile) {
            alert("Silakan pilih file bukti transfer terlebih dahulu!");
            return;
        }

        const formData = new FormData();
        formData.append("id_pesanan", dynamicOrder?.id_pesanan);
        formData.append("nominal", inputNominal.replace(/,/g, ""));
        formData.append("tgl_bayar", inputTanggal);
        formData.append(
            "tipe_keterangan",
            paymentTab === "CICILAN"
                ? "Cicil"
                : paymentTab === "PELUNASAN"
                  ? "Lunas"
                  : "DP",
        );
        formData.append("bukti_transfer", buktiFile);
        try {
            await axios.post("/api/order/upload-payment", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setIsSuccessUploadOpen(true);
            const refresh = await axios.post("/api/order/search", {
                type: "ID",
                value: dynamicOrder?.id_pesanan,
            });
            setDynamicOrder(refresh.data.data);
        } catch (error) {
            console.error("Gagal kirim pembayaran:", error);
            alert("Gagal mengunggah berkas.");
        }
    };

    const executeWAOpen = () => {
        const currentId = dynamicOrder?.id_pesanan || backupOrder.id;
        const message = encodeURIComponent(
            `Halo Admin Arjuna Trans, saya ingin melakukan Konfirmasi & Nego untuk pesanan dengan ID: ${currentId}.`,
        );
        window.open(`https://wa.me{message}`, "_blank");
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
                                setShowResultList(false);
                                setShowResultDetail(false);
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
                                        ? "ORD-8392-WEB"
                                        : "Contoh: 081234567890"
                                }
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
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
                        Daftar Pesanan Anda (1)
                    </span>
                    <div
                        onClick={() => setShowResultDetail(!showDetail)}
                        className={`bg-white rounded-[1.75rem] border p-5 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md ${showDetail ? "border-indigo-500 ring-2 ring-indigo-500/10" : "border-slate-100"}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-indigo-600 font-black text-xs rounded-xl flex items-center justify-center">
                                ORD
                            </div>
                            <div className="text-left">
                                <h4 className="text-sm font-black text-slate-800 leading-none">
                                    {staticOrder.customerName}
                                </h4>
                                <span className="text-[9px] font-bold text-slate-400 block mt-1">
                                    {staticOrder.id}
                                </span>
                            </div>
                        </div>
                        <ArrowRight
                            size={14}
                            className={`text-slate-300 transition-transform ${showDetail ? "rotate-90" : ""}`}
                        />
                    </div>
                </div>
            )}
            {showDetail && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 animate-in slide-in-from-bottom-6 duration-500">
                    <div
                        id="invoice-print-area"
                        className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100/90 shadow-sm space-y-6"
                    >
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
                                <button
                                    onClick={handlePrint}
                                    type="button"
                                    className="w-8 h-8 bg-slate-950 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
                                >
                                    <Printer size={13} strokeWidth={2.5} />
                                </button>
                                <button
                                    onClick={() => setIsWAConfirmOpen(true)}
                                    type="button"
                                    className="bg-[#00BFA5] text-white text-[8px] font-black uppercase px-3 py-2 rounded-xl shadow-md"
                                >
                                    Konfirmasi & Nego (WA)
                                </button>
                            </div>
                        </div>
                        <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 text-left space-y-1">
                            <p className="text-[8px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1">
                                ⚠️ PENTING: KONFIRMASI WHATSAPP DIPERLUKAN!
                            </p>
                            <p className="text-[9px] font-semibold text-amber-600/90 leading-relaxed italic">
                                Pesanan Anda telah kami terima dengan status
                                Baru (Pending). Silakan klik tombol "Konfirmasi
                                & Nego (WA)" di atas untuk mendiskusikan harga
                                sewa, ketersediaan unit, dan detail penawaran
                                armada dari admin kami.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-3">
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
                                </div>
                            </div>
                            <div className="space-y-3 bg-slate-50/50 p-5 rounded-[1.75rem] border border-slate-100/80">
                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b pb-1.5 flex items-center gap-1">
                                    <Receipt size={11} /> DETAIL PEMBAYARAN
                                </h4>
                                <div className="space-y-1.5 text-xs font-bold text-slate-500">
                                    <div className="flex justify-between">
                                        <span>Total Sewa</span>
                                        <span className="text-slate-800 font-black">
                                            Rp{" "}
                                            {staticOrder.totalPrice.toLocaleString(
                                                "id-ID",
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span>DP Dibayar</span>
                                        <span className="text-indigo-600 font-bold">
                                            Rp{" "}
                                            {staticOrder.downPayment.toLocaleString(
                                                "id-ID",
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-slate-800 shadow-sm mt-2">
                                    <span className="text-[10px] font-black uppercase text-slate-600">
                                        SISA PIUTANG
                                    </span>
                                    <span className="text-lg font-black text-red-500">
                                        Rp{" "}
                                        {staticOrder.remainingBalance.toLocaleString(
                                            "id-ID",
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 space-y-4 text-left">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                                        Aksi Pembayaran
                                    </h4>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        UNGGAH BUKTI TRANSFER ANDA DI BAWAH INI
                                    </p>
                                </div>
                                <div className="bg-white border border-slate-200 p-0.5 rounded-lg flex text-[8px] font-black uppercase tracking-wider">
                                    {["DP", "CICILAN", "PELUNASAN"].map(
                                        (tab) => (
                                            <button
                                                key={tab}
                                                onClick={() =>
                                                    setPaymentTab(tab as any)
                                                }
                                                type="button"
                                                className={`px-3 py-1 rounded-md transition-colors ${paymentTab === tab ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                            >
                                                {tab}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                <div className="space-y-1.5">
                                    <label className="pl-1">
                                        TANGGAL PEMBAYARAN
                                    </label>
                                    <div className="relative">
                                        <Calendar
                                            size={13}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            className="w-full pl-10 pr-4 py-3 bg-[#F1F5F9]/50 border-2 border-slate-100 rounded-xl font-bold text-slate-400 outline-none"
                                            value={inputTanggal}
                                            onChange={(e) =>
                                                setInputTanggal(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="pl-1">NOMINAL</label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 font-black text-[11px]">
                                            Rp
                                        </span>
                                        <input
                                            type="text"
                                            defaultValue="1,200,000"
                                            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#5346F1]/20 rounded-xl font-black text-[11px] text-indigo-600 outline-none"
                                            value={inputNominal}
                                            onChange={(e) =>
                                                setInputNominal(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="pl-1">
                                        KETERANGAN PEMBAYARAN
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Transfer via m-banking Mandiri an. Ahmad / Pembayaran Tunai di Garasi"
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-300 text-xs normal-case tracking-normal"
                                    />
                                </div>
                            </div>
                            <div
                                onClick={() =>
                                    document
                                        .getElementById("hidden-file-input")
                                        ?.click()
                                }
                                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/30 flex flex-col items-center justify-center space-y-1.5 cursor-pointer hover:bg-slate-50 relative"
                            >
                                <div className="w-9 h-9 bg-white text-indigo-600 border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                                    <UploadCloud size={16} />
                                </div>
                                <input
                                    id="hidden-file-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (
                                            e.target.files &&
                                            e.target.files[0]
                                        ) {
                                            setBuktiFile(e.target.files[0]);
                                            // Opsional: memberi tahu pengguna bahwa file sudah tersangkut di sistem
                                            alert(
                                                `Berkas ${e.target.files[0].name} berhasil terlampir!`,
                                            );
                                        }
                                    }}
                                />
                                <p className="text-[9px] font-black text-[#5346F1] uppercase tracking-wider mt-1">
                                    {buktiFile
                                        ? `BERKAS TERPILIH: ${buktiFile.name.toUpperCase()}`
                                        : `LAMPIRKAN BUKTI ${paymentTab}`}
                                </p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                    Format: JPG, PNG (Maks 5MB)
                                </p>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    onClick={() => setIsSuccessUploadOpen(true)}
                                    className="w-full py-4 bg-[#5346F1] hover:bg-[#4338CA] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-500/10 text-center transition-all active:scale-[0.98]"
                                >
                                    Kirim Bukti Pembayaran
                                </button>
                            </div>
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                                    <span>RIWAYAT PEMBAYARAN</span>
                                    <span>Total 1 Record</span>
                                </div>
                                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs font-bold text-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-slate-50 border border-slate-100 text-slate-800 rounded-xl flex items-center justify-center">
                                            <span className="font-bold text-slate-400 text-sm">
                                                $
                                            </span>
                                        </div>
                                        <div className="space-y-0.5 text-left">
                                            <p className="text-[11px] font-black text-slate-800">
                                                DP{" "}
                                                <span className="w-1 h-1 bg-slate-300 rounded-full inline-block mx-1"></span>{" "}
                                                <span className="text-indigo-600">
                                                    1,200,000
                                                </span>
                                            </p>
                                            <p className="text-[8px] font-black text-amber-500 uppercase flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>{" "}
                                                PENDING{" "}
                                                <span className="text-slate-300 font-bold ml-1">
                                                    dd/mm/yyyy
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#5346F1] rounded-[1.75rem] p-5 text-white text-left space-y-3 shadow-md shadow-indigo-100">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-90 flex items-center gap-1.5">
                                    <Bus size={12} /> ARMADA & SUPIR DITUGASKAN
                                </h4>
                                <div className="flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-wider">
                                    {staticOrder?.fleets?.map(
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
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* <ModalConfirmWA
                isOpen={isWAConfirmOpen}
                onClose={() => setIsWAConfirmOpen(false)}
                onConfirm={executeWAOpen}
                customerName={staticOrder.customerName}
                orderId={staticOrder.id}
            /> */}
            <ModalSuccessPayment
                isOpen={isSuccessUploadOpen}
                onClose={() => setIsSuccessUploadOpen(false)}
            />
        </div>
    );
};

export default OrderStatus;
