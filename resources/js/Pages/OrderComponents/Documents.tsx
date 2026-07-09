import React from "react";
import { Order, AppState } from "../../types";
import {
    Printer,
    XCircle,
    Bus,
    Users,
    MapPin,
    Receipt,
    Phone,
    ShieldCheck,
} from "lucide-react";

interface DocumentsProps {
    order: Order;
    onClose: () => void;
    state: AppState;
}

const Documents: React.FC<DocumentsProps> = ({ order, onClose, state }) => {
    const handlePrint = () => {
        window.print();
    };

    const today = new Date();
    const year = today.getFullYear();

    const assignedBuses = order.assignments
        .map((as) => {
            const bus = state.armada.find((b) => b.id === as.armadaId);
            return as.assetType === "Internal" ? bus?.plateNumber : as.platLuar;
        })
        .filter(Boolean)
        .join(", ");

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 lg:p-10 no-print">
            <div className="bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
                {/* Header Controls */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handlePrint}
                            className="bg-[#004262] text-white px-6 py-3 rounded-2xl flex items-center space-x-2 text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl border border-white/20"
                        >
                            <Printer size={16} />
                            <span>Download / Cetak PDF</span>
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                        <XCircle size={32} />
                    </button>
                </div>

                {/* Document Content */}
                <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30 print:p-0 print:bg-white print:overflow-visible custom-scrollbar">
                    {/* THE IMAGE-MATCHING INVOICE */}
                    <div className="bg-white w-[210mm] min-h-[297mm] mx-auto shadow-2xl print:shadow-none print:m-0 relative overflow-hidden font-sans text-slate-800">
                        {/* Top Curved Decoration */}
                        <div
                            className="absolute top-0 left-0 w-full h-16 bg-[#004262] print:bg-[#004262]"
                            style={{ clipPath: "ellipse(80% 60% at 20% 0%)" }}
                        ></div>

                        {/* Circular Accents */}
                        <div className="absolute -left-16 top-40 w-32 h-32 bg-sky-100 rounded-full opacity-50"></div>
                        <div className="absolute -right-16 bottom-40 w-32 h-32 bg-sky-100 rounded-full opacity-50"></div>

                        {/* Header Context */}
                        <div className="relative pt-24 px-12 flex justify-between items-start z-10">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-orange-500 overflow-hidden p-2">
                                    <div className="flex flex-col items-center">
                                        <Bus
                                            size={32}
                                            className="text-[#004262]"
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <h1 className="text-3xl font-black italic tracking-tighter text-[#004262]">
                                        <span className="text-orange-500">
                                            Arjuna
                                        </span>
                                        <br />
                                        <span className="text-sky-600">
                                            Trans
                                        </span>
                                    </h1>
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-6xl font-black text-[#004262] tracking-tight leading-none mb-1">
                                    INVOICE
                                </h2>
                                <p className="text-sm font-black text-[#004262] uppercase tracking-[0.1em]">
                                    PESAN SEWA BUS & SURAT JALAN
                                </p>
                                <div className="mt-4 bg-sky-200 px-6 py-2 rounded-xl inline-block">
                                    <span className="text-xs font-black text-[#004262] uppercase mr-4 italic">
                                        No.
                                    </span>
                                    <span className="font-mono font-bold text-[#004262]">
                                        {order.id.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="px-12 mt-8 relative z-10">
                            <h3 className="text-2xl font-serif italic text-indigo-800 mb-1">
                                Wisata, Privat Trip, Tour dan Rombongan
                            </h3>
                            <h4 className="text-xl font-black text-slate-800 mb-2">
                                Arjuna Trans
                            </h4>
                            <div className="text-xs font-bold text-slate-500 space-y-1">
                                <p>
                                    RT 01 RW 01 Dsn Pesanan, Ds Bicak, Kec
                                    Trowulan - Kab. Mojokerto
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone size={12} className="text-sky-500" />
                                    Telp : 081938845765 / 083877345649
                                </p>
                            </div>
                        </div>

                        {/* Vehicle & Details Table Layout */}
                        <div className="px-12 mt-6 relative z-10">
                            <div className="flex justify-between items-start gap-8">
                                <div className="flex-1 space-y-3">
                                    {/* NOPOL Box */}
                                    <div className="bg-sky-200 px-6 py-2 rounded-xl inline-block mb-4">
                                        <span className="text-xs font-black text-[#004262] uppercase mr-4 italic">
                                            NOPOL :
                                        </span>
                                        <span className="font-mono font-bold text-[#004262]">
                                            {assignedBuses || "- - - - - -"}
                                        </span>
                                    </div>

                                    {/* Data Lines */}
                                    {[
                                        {
                                            label: "Nama",
                                            value: order.customerName,
                                        },
                                        {
                                            label: "Alamat",
                                            value: order.customerAddress,
                                        },
                                        {
                                            label: "Route",
                                            value:
                                                order.route ||
                                                order.destination,
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="grid grid-cols-[120px_1fr] items-baseline"
                                        >
                                            <span className="text-sm font-bold text-slate-600">
                                                {item.label}
                                            </span>
                                            <div className="flex items-baseline space-x-2 border-b border-slate-300 pb-1">
                                                <span className="text-sm font-bold">
                                                    :
                                                </span>
                                                <span className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                                    {item.value}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="grid grid-cols-[120px_1fr_100px] items-baseline pt-2">
                                        <span className="text-sm font-bold text-slate-600">
                                            Tanggal Pakai
                                        </span>
                                        <div className="flex items-baseline space-x-2 border-b border-slate-300 pb-1">
                                            <span className="text-sm font-bold">
                                                :
                                            </span>
                                            <span className="text-sm font-black text-slate-800">
                                                {new Date(
                                                    order.departureTime,
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline space-x-2 border-b border-slate-300 pb-1 ml-4">
                                            <span className="text-sm font-bold">
                                                Jam :
                                            </span>
                                            <span className="text-sm font-black text-slate-800">
                                                {new Date(
                                                    order.departureTime,
                                                ).toLocaleTimeString("id-ID", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {[
                                        {
                                            label: "Pemberangkatan",
                                            value: order.pickupAddress,
                                        },
                                        {
                                            label: "Jumlah Bus",
                                            value: order.fleetRequirements
                                                .map(
                                                    (r) =>
                                                        `${r.count} ${r.type}`,
                                                )
                                                .join(", "),
                                        },
                                        {
                                            label: "Harga Sewa",
                                            value: `Rp ${order.totalPrice.toLocaleString()}`,
                                        },
                                        {
                                            label: "Uang Muka",
                                            value: `Rp ${order.downPayment.toLocaleString()}`,
                                        },
                                        {
                                            label: "Sisa Ongkos",
                                            value: `Rp ${order.remainingBalance.toLocaleString()}`,
                                            highlight: true,
                                        },
                                        {
                                            label: "Lain - lain",
                                            value: order?.notes || "-",
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="grid grid-cols-[120px_1fr] items-baseline"
                                        >
                                            <span className="text-sm font-bold text-slate-600">
                                                {item.label}
                                            </span>
                                            <div className="flex items-baseline space-x-2 border-b border-slate-300 pb-1">
                                                <span className="text-sm font-bold">
                                                    :
                                                </span>
                                                <span
                                                    className={`text-sm font-black tracking-tight ${item.highlight ? "text-red-500" : "text-slate-800"} uppercase`}
                                                >
                                                    {item.value}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Vehicles Illustration Placeholder */}
                                <div className="w-[300px] shrink-0 pt-10">
                                    <img
                                        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2017&auto=format&fit=crop"
                                        alt="Bus Fleet"
                                        className="w-full h-auto rounded-3xl shadow-xl transform rotate-3"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions Section */}
                        <div className="px-12 mt-12 relative z-10">
                            <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100">
                                <ol className="text-[11px] font-bold text-slate-600 list-decimal pl-4 space-y-1">
                                    <li>
                                        Apabila terjadi keadaan darurat (Force
                                        Majeur) penyewa tidak berhak mengajukan
                                        klaim.
                                    </li>
                                    <li>
                                        Apabila mengalami kerusakan, dan bus
                                        pengantinya tidak ada, maka uang sewa
                                        dikembalikan 100%.
                                    </li>
                                    <li>
                                        Bila terjadi perubahan jadwal /
                                        pembatalan, harus memberitahukan 1 bulan
                                        sebelumnya. Jika tidak, uang tidak dapat
                                        diambil kembali.
                                    </li>
                                    <li>
                                        Barang hilang di dalam bus, resiko
                                        Panitia Rombongan.
                                    </li>
                                    <li>
                                        Pelunasan pembayaran 3 hari sebelum bus
                                        berangkat.
                                    </li>
                                    <li>
                                        Apabila ada kenaikan BBM, tarif ikut
                                        naik.
                                    </li>
                                </ol>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-row justify-between items-center gap-4 text-left relative z-10 mx-12">
                            <div className="max-w-[45%]">
                                <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1">
                                    INFORMASI PEMBAYARAN RESMI PO. ARJUNA TRANS
                                </h4>
                                <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5 tracking-wide leading-tight">
                                    Mohon transfer murni hanya ke rekening resmi
                                    perusahaan di bawah ini:
                                </p>
                            </div>

                            {/* 🚀 FIX UTUT: Dipaksa kaku menggunakan flex-row dan items-center agar berjejer mendatar kesamping tanpa melar kebawah! */}
                            <div className="flex flex-row items-center gap-3">
                                {/* BANK 1: MANDIRI */}
                                <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm min-w-[125px]">
                                    <p className="text-[8px] font-black text-blue-800 uppercase tracking-wider">
                                        BANK MANDIRI
                                    </p>
                                    <p className="font-mono font-black text-slate-800 text-[10px] tracking-wide mt-0.5">
                                        1420012345678
                                    </p>
                                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wide">
                                        A.N PO ARJUNA TRANS
                                    </p>
                                </div>
                                {/* BANK 2: BCA */}
                                <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm min-w-[125px]">
                                    <p className="text-[8px] font-black text-teal-600 uppercase tracking-wider">
                                        BANK BCA
                                    </p>
                                    <p className="font-mono font-black text-slate-800 text-[10px] tracking-wide mt-0.5">
                                        8290123456
                                    </p>
                                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wide">
                                        A.N ARJUNA TRANS PO
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="px-12 mt-12 mb-24 relative z-10 flex justify-between items-end">
                            <div className="w-72 text-center flex flex-col justify-between h-[140px]">
                                <p className="text-xs font-black text-slate-800 uppercase tracking-widest">
                                    Pemesanan
                                </p>

                                {/* Nama pelanggan ukuran RAKSASA melayang tepat di tengah area kosong atas garis */}
                                <div className="w-full flex items-center justify-center flex-grow py-2">
                                    <p className="text-xl font-black text-slate-950 uppercase tracking-widest bg-slate-50/70 px-4 py-1.5 rounded-2xl border border-slate-200/40 shadow-sm">
                                        {order?.customerName ||
                                            "........................................."}
                                    </p>
                                </div>

                                <div className="w-full mt-auto">
                                    {/* Garis Underline Kanan - DIKUNCI MATI SEJAJAR 100% DENGAN GARIS KIRI */}
                                    <div className="border-b-2 border-slate-900 w-full"></div>

                                    {/* Boks Penyeimbang Tinggi String agar Garis Tetap Lurus Sejajar dengan Samping */}
                                    <p className="text-[10px] font-black text-transparent uppercase select-none mt-1">
                                        ( ARJUNA TRANS ADM )
                                    </p>
                                </div>
                            </div>
                            <div className="w-72 text-center relative">
                                <p className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">
                                    Mojokerto,{" "}
                                    {order?.departureTime
                                        ? (() => {
                                              const [tahun, bulan, tanggal] =
                                                  order.departureTime
                                                      .substring(0, 10)
                                                      .split("-");
                                              const daftarBulan = [
                                                  "Januari",
                                                  "Februari",
                                                  "Maret",
                                                  "April",
                                                  "Mei",
                                                  "Juni",
                                                  "Juli",
                                                  "Agustus",
                                                  "September",
                                                  "Oktoter",
                                                  "November",
                                                  "Desember",
                                              ];
                                              const namaBulan =
                                                  daftarBulan[
                                                      parseInt(bulan) - 1
                                                  ] || "Januari";
                                              return `${parseInt(tanggal)} ${namaBulan} ${tahun}`;
                                          })()
                                        : "......................................... " +
                                          year}
                                </p>

                                {/* 🚀 FIX 2: Menghapus kelas pl-1 bawaan lama agar teks fiks presisi di tengah */}
                                <p className="text-xs font-black text-slate-800">
                                    PENGURUS ARJUNA TRANS
                                </p>

                                {/* 🚀 FIX SAKRAL: Jarak dinaikkan menjadi mt-24 agar area tanda tangan melar luas memberi ruang kosong untuk stempel! */}
                                <div className="mt-24 relative w-full">
                                    {/* 🚀 FIX 3: Mengubah left-4 menjadi left-[25%] agar bulatan stempel ikut bergeser presisi melayang melayang di tengah-tengah garis hitam! */}
                                    <img
                                        src="/uploads/stempel_arjuna.png"
                                        alt="Stempel Resmi PO Arjuna Trans"
                                        className="absolute bottom-[-5px] left-[25%] w-28 h-auto opacity-95 pointer-events-none select-none mix-blend-multiply z-20"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                    {/* Garis Underline Tanda Tangan */}
                                    <div className="border-b-2 border-slate-900 w-full"></div>
                                </div>

                                {/* Nama Terang di Bawah Garis */}
                                {/* 🚀 FIX 4: Mengubah tracking-wide mt-1.5 pl-1 menjadi text-center tanpa pl-1 agar kurung pembuka-penutup sejajar rata tengah */}
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-wide mt-1.5 text-center">
                                    ( DESSY ISTUNING TYAS )
                                </p>
                            </div>

                            {/* KANAN: PEMESANAN / PELANGGAN (SINKRONISASI TINGGI SEJAJAR) */}
                        </div>
                        <div className="px-12 pb-10 italic">
                            <p className="text-[10px] font-bold text-red-500">
                                Catatan : Biaya Tol, Parkir, dan Fee Sopir
                                menjadi tanggung jawab penyewa
                            </p>
                        </div>
                        {/* Footer Trim decoration */}
                        <div
                            className="absolute bottom-0 left-0 w-full h-8 bg-[#004262] print:bg-[#004262]"
                            style={{
                                clipPath:
                                    "polygon(0 40%, 100% 0, 100% 100%, 0 100%)",
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .flex-1 {
            overflow: visible !important;
            height: auto !important;
            padding: 0 !important;
          }
          .max-w-5xl {
            max-width: none !important;
            box-shadow: none !important;
            border: none !important;
          }
          .fixed {
            position: static !important;
            display: block !important;
            background: none !important;
            backdrop-filter: none !important;
            padding: 0 !important;
          }
          .bg-white {
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Documents;
