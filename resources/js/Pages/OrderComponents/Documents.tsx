import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Order, AppState } from "../../types";
import { Printer, XCircle, Bus, Phone } from "lucide-react";

interface DocumentsProps {
    order: Order;
    onClose: () => void;
    state: AppState;
}

const Documents: React.FC<DocumentsProps> = ({ order, onClose, state }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
    });

    const year = new Date().getFullYear();

    const assignedBuses = order.assignments
        .map((as) => {
            const bus = state.armada.find((b) => b.id === as.armadaId);
            return as.assetType === "Internal" ? bus?.plateNumber : as.platLuar;
        })
        .filter(Boolean)
        .join(", ");

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl h-full max-h-[95vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
                {/* Header Controls (Hanya di layar) */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white relative z-10 no-print">
                    <button
                        onClick={handlePrint}
                        className="bg-[#004262] text-white px-6 py-2.5 rounded-xl flex items-center space-x-2 text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md"
                    >
                        <Printer size={16} />{" "}
                        <span>Download / Cetak PDF (1 Halaman)</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                        <XCircle size={32} />
                    </button>
                </div>

                {/* Document Content */}
                <div className="flex-1 overflow-y-auto print:overflow-visible p-4 bg-slate-50/30 print:p-0 print:bg-white">
                    <div
                        ref={printRef}
                        className="bg-white w-[210mm] h-[297mm] mx-auto shadow-2xl print:shadow-none relative overflow-hidden font-sans text-slate-800 print:m-0"
                    >
                        {/* 🎯 Lengkungan Biru Atas (BAWAAN ASLI) */}
                        <div
                            className="absolute top-0 left-0 w-full h-16 bg-[#004262]"
                            style={{ clipPath: "ellipse(80% 60% at 20% 0%)" }}
                        ></div>

                        {/* 🎯 Aksen Lingkaran (BAWAAN ASLI) */}
                        <div className="absolute -left-16 top-40 w-32 h-32 bg-sky-100 rounded-full opacity-50"></div>

                        {/* Header Context - pt-24 di-pres jadi pt-16 */}
                        <div className="relative pt-16 px-12 flex justify-between items-start z-10">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-orange-500 p-2">
                                    <Bus size={32} className="text-[#004262]" />
                                </div>
                                <h1 className="text-3xl font-black italic tracking-tighter text-[#004262] leading-none">
                                    <span className="text-orange-500">
                                        Arjuna
                                    </span>
                                    <br />
                                    <span className="text-sky-600">Trans</span>
                                </h1>
                            </div>
                            <div className="text-right">
                                <h2 className="text-6xl font-black text-[#004262] tracking-tight leading-none mb-1">
                                    INVOICE
                                </h2>
                                <p className="text-sm font-black text-[#004262] uppercase">
                                    PESAN SEWA BUS & SURAT JALAN
                                </p>
                                <div className="mt-2 bg-sky-200 px-6 py-2 rounded-xl inline-block">
                                    <span className="text-xs font-black mr-4 italic">
                                        No.
                                    </span>
                                    <span className="font-mono font-bold">
                                        {order.id.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="px-12 mt-6 relative z-10">
                            <h3 className="text-2xl font-serif italic text-indigo-800 mb-1">
                                Wisata, Privat Trip, Tour dan Rombongan
                            </h3>
                            <h4 className="text-xl font-black text-slate-800">
                                Arjuna Trans
                            </h4>
                            <div className="text-xs font-bold text-slate-500">
                                <p>
                                    RT 01 RW 01 Dsn Pesanan, Ds Bicak, Kec
                                    Trowulan - Kab. Mojokerto
                                </p>
                                <p>Telp : 081938845765 / 083877345649</p>
                            </div>
                        </div>

                        {/* Vehicle & Details - Ukuran gambar w-300 jadi w-260 */}
                        <div className="px-12 mt-4 relative z-10 flex justify-between items-start gap-8">
                            <div className="flex-1 space-y-2">
                                <div className="bg-sky-200 px-6 py-2 rounded-xl inline-block mb-2">
                                    <span className="text-xs font-black mr-4 italic text-[#004262]">
                                        NOPOL :
                                    </span>
                                    <span className="font-mono font-bold text-[#004262]">
                                        {assignedBuses || "- - - - - -"}
                                    </span>
                                </div>

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
                                        value: order.route || order.destination,
                                    },
                                    {
                                        label: "Tanggal Pakai",
                                        value:
                                            new Date(
                                                order.departureTime,
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }) +
                                            " (Jam: " +
                                            new Date(
                                                order.departureTime,
                                            ).toLocaleTimeString("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }) +
                                            ")",
                                    },
                                    {
                                        label: "Pemberangkatan",
                                        value: order.pickupAddress,
                                    },
                                    {
                                        label: "Jumlah Bus",
                                        value: order.fleetRequirements
                                            .map((r) => `${r.count} ${r.type}`)
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
                                        label: "Lain-lain",
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
                                        <div className="flex items-baseline space-x-2 border-b border-slate-300 pb-0.5">
                                            <span className="text-sm font-bold">
                                                :
                                            </span>
                                            <span
                                                className={`text-sm font-black uppercase ${item.highlight ? "text-red-500" : ""}`}
                                            >
                                                {item.value}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="w-[260px] shrink-0 pt-6">
                                <img
                                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2017&auto=format&fit=crop"
                                    className="w-full h-auto rounded-3xl shadow-xl transform rotate-3"
                                    alt="Bus"
                                />
                            </div>
                        </div>

                        {/* T&C - mt-12 jadi mt-6 */}
                        <div className="px-12 mt-6">
                            <div className="bg-sky-50 p-4 rounded-3xl border border-sky-100">
                                <ol className="text-[10px] font-bold text-slate-600 list-decimal pl-4 space-y-0.5">
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
                                        sebelumnya.
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

                        {/* Bank Info - Rapat mendatar */}
                        <div className="mt-4 p-2 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-row justify-between items-center mx-12 relative z-10 gap-4">
                            <div className="max-w-[40%]">
                                <h4 className="text-[9px] font-black text-slate-800 uppercase">
                                    INFORMASI PEMBAYARAN RESMI PO. ARJUNA TRANS
                                </h4>
                                <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">
                                    Transfer hanya ke rekening resmi perusahaan
                                </p>
                            </div>
                            <div className="flex flex-row items-center gap-3">
                                <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 min-w-[120px]">
                                    <p className="text-[8px] font-black text-blue-800 uppercase">
                                        MANDIRI
                                    </p>
                                    <p className="font-mono font-black text-[10px]">
                                        1420012345678
                                    </p>
                                </div>
                                <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 min-w-[120px]">
                                    <p className="text-[8px] font-black text-teal-600 uppercase">
                                        BCA
                                    </p>
                                    <p className="font-mono font-black text-[10px]">
                                        8290123456
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Signature Area - Area sakral yang Mas mau (mb-24 dipangkas) */}
                        <div className="px-12 mt-6 mb-10 relative z-10 flex justify-between items-end">
                            <div className="w-72 text-center flex flex-col justify-between h-[120px]">
                                <p></p>
                                <p className="text-xs font-black uppercase">
                                    Pemesanan
                                </p>
                                <div className="w-full py-2">
                                    <p className="text-lg font-black uppercase bg-slate-50 px-4 py-1 rounded-2xl border border-slate-200 inline-block shadow-sm">
                                        {order.customerName}
                                    </p>
                                </div>
                                <div className="border-b-2 border-slate-900 w-full mb-4"></div>
                            </div>

                            <div className="w-72 text-center relative">
                                <p className="text-xs font-black uppercase mb-1">
                                    Mojokerto,{" "}
                                    {new Date().toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                                <p className="text-xs font-black uppercase mb-16">
                                    PENGURUS ARJUNA TRANS
                                </p>
                                <img
                                    src="/uploads/stempel_arjuna.png"
                                    className="absolute bottom-0 left-[20%] w-36 h-auto opacity-90 mix-blend-multiply z-20"
                                    alt="Stempel"
                                />
                                <div className="border-b-2 border-slate-900 w-full mb-1"></div>
                                <p className="text-[10px] font-black uppercase">
                                    ( DESSY ISTUNING TYAS )
                                </p>
                            </div>
                        </div>

                        {/* Catatan */}
                        <div className="absolute bottom-4 left-12 right-12 z-20">
                            <p className="text-[9px] font-bold italic text-red-500 leading-tight">
                                Catatan : Biaya Tol, Parkir, dan Fee Sopir
                                menjadi tanggung jawab penyewa.
                            </p>
                        </div>

                        {/* Footer Biru */}
                        <div
                            className="bottom-0 left-0 w-full h-6 bg-[#004262] "
                            style={{
                                clipPath:
                                    "polygon(0 50%, 100% 0, 100% 100%, 0 100%)",
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { size: A4; margin: 0; }
                    body { margin: 0; background: white; -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    /* 🎯 Paksa 1 Halaman jika masih ada sisa sedikit di bawah */
                    .bg-white.w-\\[210mm\\] { transform: scale(1); transform-origin: top center; }
                }
            `}</style>
        </div>
    );
};

export default Documents;
