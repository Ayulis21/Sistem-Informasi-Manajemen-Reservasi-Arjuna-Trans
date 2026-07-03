import React from "react";
import { Order, AppState } from "../types";

interface InvoicePrintProps {
    order: Order;
    state: AppState;
    isPreview?: boolean;
}

const InvoicePrint: React.FC<InvoicePrintProps> = ({
    order,
    state,
    isPreview = false,
}) => {
    const selectedArmada = state.armada.filter((a) =>
        order.assignments.some((assignment) => assignment.armadaId === a.id),
    );
    const nopol = selectedArmada.map((a) => a.plateNumber).join(", ");
    const fleetSummary = order.fleetRequirements
        .map((item) => `${item.count} ${item.type}`)
        .join(", ");
    const totalBus = order.fleetRequirements.reduce(
        (sum, item) => sum + item.count,
        0,
    );

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return (
            d.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            }) + " WIB"
        );
    };

    return (
        <div
            className={`${isPreview ? "preview-mode" : "print-only invoice-to-print"} bg-white p-0 text-slate-900 font-serif relative`}
            style={{
                width: "210mm",
                minHeight: "297mm",
                margin: isPreview ? "0" : "0 auto",
                boxShadow: isPreview ? "none" : "0 0 20px rgba(0,0,0,0.1)",
            }}
        >
            {/* Header Section */}
            <div className="relative h-32 bg-[#003d5b] overflow-hidden flex items-center px-10">
                <div className="flex items-center space-x-4 z-10">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-500">
                        <svg viewBox="0 0 100 100" className="w-12 h-12">
                            <path
                                d="M20,50 Q50,10 80,50 T20,50"
                                fill="#003d5b"
                            />
                            <path
                                d="M20,60 Q50,20 80,60 T20,60"
                                fill="#f97316"
                            />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none">
                            Arjuna
                        </h1>
                        <p className="text-2xl font-bold text-orange-400 italic leading-none">
                            Trans
                        </p>
                    </div>
                </div>

                {/* Decorative Curve */}
                <div
                    className="absolute top-0 right-0 w-2/3 h-full bg-white"
                    style={{
                        clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)",
                    }}
                ></div>

                <div className="absolute top-8 right-10 text-right">
                    <h2 className="text-5xl font-black text-[#003d5b] tracking-tight">
                        INVOICE
                    </h2>
                    <p className="text-sm font-bold text-[#003d5b] uppercase tracking-widest">
                        PESAN SEWA BUS & SURAT JALAN
                    </p>
                </div>
            </div>

            {/* Invoice Number Bar */}
            <div className="px-10 mt-4">
                <div className="bg-sky-100 py-2 px-4 rounded-lg flex items-center">
                    <span className="font-bold italic text-slate-500 mr-4">
                        No.
                    </span>
                    <span className="font-mono font-bold text-slate-700">
                        {order.id.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Business Info */}
            <div className="px-10 mt-6 flex justify-between items-start">
                <div className="max-w-md">
                    <p className="text-indigo-800 italic font-bold text-xl mb-1">
                        Wisata, Privat Trip, Tour dan Rombongan
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 mb-1">
                        Arjuna Trans
                    </h3>
                    <p className="text-sm text-slate-600 leading-tight">
                        RT 01 RW 01 Dsn Pesanan, Ds Bicak, Kec Trowulan - Kab.
                        Mojokerto
                    </p>
                    <p className="text-sm text-slate-600">
                        Telp : 081938845765 / 083877345649
                    </p>
                </div>

                {/* Bus Image Placeholder */}
                <div className="w-64 h-32 relative">
                    <img
                        src="https://picsum.photos/seed/bus/400/200"
                        alt="Bus"
                        className="w-full h-full object-contain rounded-xl grayscale-[0.2]"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-sky-100 rounded-full -z-10 opacity-50"></div>
                </div>
            </div>

            {/* NOPOL Bar */}
            <div className="px-10 mt-8">
                <div className="bg-sky-100 py-2 px-4 rounded-lg flex items-center">
                    <span className="font-bold text-[#003d5b] mr-4 text-sm">
                        NOPOL :
                    </span>
                    <span className="font-bold text-slate-700 text-sm">
                        {nopol ||
                            "................................................................................"}
                    </span>
                </div>
            </div>

            {/* Form Fields */}
            <div className="px-10 mt-8 space-y-4">
                {[
                    { label: "Nama", value: order.customerName },
                    { label: "Alamat", value: order.customerAddress },
                    {
                        label: "Route",
                        value: `${order.pickupAddress} - ${order.destination} (Via: ${order.route || "-"})`,
                    },
                ].map((field, i) => (
                    <div key={i} className="flex items-end">
                        <span className="w-32 text-sm font-bold text-slate-700">
                            {field.label}
                        </span>
                        <span className="mx-2 text-sm font-bold">:</span>
                        <div className="flex-1 border-b border-slate-300 pb-1 text-sm font-medium text-slate-800">
                            {field.value}
                        </div>
                    </div>
                ))}

                <div className="flex space-x-8">
                    <div className="flex-1 flex items-end">
                        <span className="w-32 text-sm font-bold text-slate-700">
                            Tanggal Pakai
                        </span>
                        <span className="mx-2 text-sm font-bold">:</span>
                        <div className="flex-1 border-b border-slate-300 pb-1 text-sm font-medium text-slate-800">
                            {formatDate(order.departureTime)}
                        </div>
                    </div>
                    <div className="flex items-end">
                        <span className="text-sm font-bold text-slate-700 mr-2">
                            Jam :
                        </span>
                        <div className="w-32 border-b border-slate-300 pb-1 text-sm font-medium text-slate-800">
                            {formatTime(order.departureTime)}
                        </div>
                    </div>
                </div>

                {[
                    { label: "Pemberangkatan", value: order.pickupAddress },
                    { label: "Jumlah Bus", value: `${totalBus} Unit` },
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
                    },
                    { label: "Lain - lain", value: order.notes || "-" },
                ].map((field, i) => (
                    <div key={i} className="flex items-end">
                        <span className="w-32 text-sm font-bold text-slate-700">
                            {field.label}
                        </span>
                        <span className="mx-2 text-sm font-bold">:</span>
                        <div className="flex-1 border-b border-slate-300 pb-1 text-sm font-medium text-slate-800">
                            {field.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Terms and Conditions */}
            <div className="px-10 mt-10">
                <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                    <ol className="list-decimal list-inside text-[11px] text-slate-700 space-y-1 leading-relaxed">
                        <li>
                            Apabila terjadi keadaan darurat (Force Majeur)
                            penyewa tidak berhak mengajukan klaim.
                        </li>
                        <li>
                            Apabila mengalami kerusakan, dan bus pengantinya
                            tidak ada, maka uang sewa dikembalikan 100%.
                        </li>
                        <li>
                            Bila terjadi perubahan jadwal / pembatalan, harus
                            memberitahukan 1 bulan sebelumnya. Jika tidak, uang
                            tidak dapat diambil kembali.
                        </li>
                        <li>
                            Barang hilang di dalam bus, resiko Panitia
                            Rombongan.
                        </li>
                        <li>
                            Pelunasan pembayaran 3 hari sebelum bus berangkat.
                        </li>
                        <li>Apabila ada kenaikan BBM, tarif ikut naik.</li>
                    </ol>
                </div>
            </div>

            {/* Footer / Signatures */}
            <div className="px-10 mt-12">
                <p className="text-sm text-slate-700 text-right mb-4 mr-10">
                    Mojokerto,{" "}
                    {new Date().toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
                <div className="grid grid-cols-2 gap-20">
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-800 mb-20">
                            Pengurus Arjuna Trans
                        </p>
                        <div className="w-48 mx-auto border-b border-slate-400"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-800 mb-20">
                            Pemesan
                        </p>
                        <div className="w-48 mx-auto border-b border-slate-400"></div>
                        <p className="text-sm font-bold text-slate-800 mt-2">
                            {order.customerName}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-10 mt-10 text-center">
                <p className="text-xs italic text-red-600 font-bold">
                    Catatan : Biaya Tol, Parkir, dan Fee Sopir menjadi tanggung
                    jawab penyewa
                </p>
            </div>

            {/* Decorative Circles */}
            <div className="absolute bottom-20 -left-10 w-40 h-40 bg-sky-100 rounded-full opacity-50 -z-10"></div>
            <div className="absolute top-1/2 -right-10 w-32 h-32 bg-sky-100 rounded-full opacity-50 -z-10"></div>
        </div>
    );
};

export default InvoicePrint;
