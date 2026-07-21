// import React from "react";
// import { Link } from "@inertiajs/react";
// import { Bus, Phone } from "lucide-react";
// import { AppState, Order } from "@/types";
// import InvoicePrint from "@/Components/InvoicePrint";

// interface AdminInvoiceDocumentProps {
//     order: Order;
//     state: AppState;
//     assignedBuses: string;
//     onClose: () => void;
// }

// export const AdminInvoiceDocument: React.FC<AdminInvoiceDocumentProps> = ({
//     order,
//     state,
//     assignedBuses,
// }) => {
//     const today = new Date();
//     const year = today.getFullYear();

//     return (
//         <div
//             className="bg-white w-[210mm] min-h-[297mm] mx-auto shadow-2xl print:shadow-none print:m-0 relative overflow-hidden font-sans text-slate-800"
//             id={`invoice-doc-${order.id}`}
//         >
//             {/* Top Curved Decoration */}
//             <div
//                 className="absolute top-0 left-0 w-full h-16 bg-[#004262] print:bg-[#004262]"
//                 style={{ clipPath: "ellipse(80% 60% at 20% 0%)" }}
//             ></div>

//             {/* Circular Accents */}
//             <div className="absolute -left-16 top-40 w-32 h-32 bg-sky-100 rounded-full opacity-50"></div>
//             <div className="absolute -right-16 bottom-40 w-32 h-32 bg-sky-100 rounded-full opacity-50"></div>

//             {/* Header Context */}
//             <div className="relative pt-24 px-12 flex justify-between items-start z-10">
//                 <div className="flex items-center space-x-4">
//                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-orange-500 overflow-hidden p-2">
//                         <div className="flex flex-col items-center">
//                             <Bus size={32} className="text-[#004262]" />
//                         </div>
//                     </div>
//                     <div className="pt-2">
//                         <h1 className="text-3xl font-black italic tracking-tighter text-[#004262]">
//                             <span className="text-orange-500">Arjuna</span>
//                             <br />
//                             <span className="text-sky-600">Trans</span>
//                         </h1>
//                     </div>
//                 </div>
//                 <div className="text-right">
//                     <h2 className="text-6xl font-black text-[#004262] tracking-tight leading-none mb-1">
//                         INVOICE
//                     </h2>
//                     <p className="text-sm font-black text-[#004262] uppercase tracking-[0.1em]">
//                         PESAN SEWA BUS & SURAT JALAN
//                     </p>
//                     <div className="mt-4 bg-sky-200 px-6 py-2 rounded-xl inline-block">
//                         <span className="text-xs font-black text-[#004262] uppercase mr-4 italic">
//                             No.
//                         </span>
//                         <span className="font-mono font-bold text-[#004262]">
//                             {order.id.toUpperCase()}
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             {/* Contact Information Section */}
//             <div className="px-12 mt-8 relative z-10">
//                 <h3 className="text-2xl font-serif italic text-indigo-800 mb-1">
//                     Wisata, Privat Trip, Tour dan Rombongan
//                 </h3>
//                 <h4 className="text-xl font-black text-slate-800 mb-2">
//                     Arjuna Trans
//                 </h4>
//                 <div className="text-xs font-bold text-slate-500 space-y-1">
//                     <p>
//                         RT 01 RW 01 Dsn Pesanan, Ds Bicak, Kec Trowulan - Kab.
//                         Mojokerto
//                     </p>
//                     <p className="flex items-center gap-2">
//                         <Phone size={12} className="text-sky-500" />
//                         Telp : 081938845765 / 083877345649
//                     </p>
//                 </div>
//             </div>

//             {/* Vehicle & Details Table Layout */}
//             <div className="px-12 mt-6 relative z-10">
//                 <div className="flex justify-between items-start gap-8">
//                     <div className="flex-1 space-y-3">
//                         {/* NOPOL Box */}
//                         <div className="bg-sky-200 px-6 py-2 rounded-xl inline-block mb-4">
//                             <span className="text-xs font-black text-[#004262] uppercase mr-4 italic">
//                                 NOPOL :
//                             </span>
//                             <span className="font-mono font-bold text-[#004262]">
//                                 {assignedBuses || "- - - - - -"}
//                             </span>
//                         </div>

//                         {/* Data Lines */}
//                         {[
//                             { label: "Nama", value: order.customerName },
//                             { label: "Alamat", value: order.customerAddress },
//                             {
//                                 label: "Route",
//                                 value: order.route || order.destination,
//                             },
//                         ].map((item) => (
//                             <div
//                                 key={item.label}
//                                 className="grid grid-cols-[120px_1fr] items-baseline"
//                             >
//                                 <span className="text-sm font-bold text-slate-600">
//                                     {item.label}
//                                 </span>
//                                 <div className="flex items-baseline space-x-2 border-b border-slate-300 pb-1">
//                                     <span className="text-sm font-bold">:</span>
//                                     <span className="text-sm font-black text-slate-800 uppercase tracking-tight">
//                                         {item.value}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}

//                         <div className="grid grid-cols-[120px_1fr_100px] items-baseline pt-2">
//                             <span className="text-sm font-bold text-slate-600">
//                                 Tanggal Pakai
//                             </span>
//                             <div className="flex items-baseline space-x-2 border-b border-slate-300 pb-1">
//                                 <span className="text-sm font-bold">:</span>
//                                 <span className="text-sm font-black text-slate-800">
//                                     {new Date(
//                                         order.departureTime,
//                                     ).toLocaleDateString("id-ID", {
//                                         day: "numeric",
//                                         month: "long",
//                                         year: "numeric",
//                                     })}
//                                 </span>
//                             </div>
//                             <div className="flex items-baseline space-x-2 border-b border-slate-300 pb-1 ml-4">
//                                 <span className="text-sm font-bold">Jam :</span>
//                                 <span className="text-sm font-black text-slate-800">
//                                     {new Date(
//                                         order.departureTime,
//                                     ).toLocaleTimeString("id-ID", {
//                                         hour: "2-digit",
//                                         minute: "2-digit",
//                                     })}
//                                 </span>
//                             </div>
//                         </div>

//                         {[
//                             {
//                                 label: "Pemberangkatan",
//                                 value: order.pickupAddress,
//                             },
//                             {
//                                 label: "Jumlah Bus",
//                                 value: order.fleetRequirements
//                                     .map(
//                                         (r: { count: any; type: any }) =>
//                                             `${r.count} ${r.type}`,
//                                     )
//                                     .join(", "),
//                             },
//                             {
//                                 label: "Harga Sewa",
//                                 value: `Rp ${order.totalPrice.toLocaleString()}`,
//                             },
//                             {
//                                 label: "Uang Muka",
//                                 value: `Rp ${order.downPayment.toLocaleString()}`,
//                             },
//                             {
//                                 label: "Sisa Ongkos",
//                                 value: `Rp ${order.remainingBalance.toLocaleString()}`,
//                                 highlight: true,
//                             },
//                             { label: "Lain - lain", value: "-" },
//                         ].map((item) => (
//                             <div
//                                 key={item.label}
//                                 className="grid grid-cols-[120px_1fr] items-baseline"
//                             >
//                                 <span className="text-sm font-bold text-slate-600">
//                                     {item.label}
//                                 </span>
//                                 <div className="flex items-baseline space-x-2 border-b border-slate-300 pb-1">
//                                     <span className="text-sm font-bold">:</span>
//                                     <span
//                                         className={`text-sm font-black tracking-tight ${item.highlight ? "text-red-500" : "text-slate-800"} uppercase`}
//                                     >
//                                         {item.value}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Vehicles Illustration Placeholder */}
//                     <div className="w-[300px] shrink-0 pt-10">
//                         <img
//                             src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2017&auto=format&fit=crop"
//                             alt="Bus Fleet"
//                             className="w-full h-auto rounded-3xl shadow-xl transform rotate-3"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Terms and Conditions Section */}
//             <div className="px-12 mt-12 relative z-10">
//                 <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100">
//                     <ol className="text-[11px] font-bold text-slate-600 list-decimal pl-4 space-y-1">
//                         <li>
//                             Apabila terjadi keadaan darurat (Force Majeur)
//                             penyewa tidak berhak mengajukan klaim.
//                         </li>
//                         <li>
//                             Apabila mengalami kerusakan, dan bus pengantinya
//                             tidak ada, maka uang sewa dikembalikan 100%.
//                         </li>
//                         <li>
//                             Bila terjadi perubahan jadwal / pembatalan, harus
//                             memberitahukan 1 bulan sebelumnya. Jika tidak, uang
//                             tidak dapat diambil kembali.
//                         </li>
//                         <li>
//                             Barang hilang di dalam bus, resiko Panitia
//                             Rombongan.
//                         </li>
//                         <li>
//                             Pelunasan pembayaran 3 hari sebelum bus berangkat.
//                         </li>
//                         <li>Apabila ada kenaikan BBM, tarif ikut naik.</li>
//                     </ol>
//                 </div>
//             </div>

//             {/* Footer / Signatures */}
//             <div className="px-12 mt-12 mb-24 relative z-10 flex justify-between items-start">
//                 <div className="w-72">
//                     <p className="text-xs font-black text-slate-800 uppercase tracking-widest">
//                         Mojokerto, .........................................{" "}
//                         {year}
//                     </p>
//                     <div className="mt-6 flex flex-col h-32 justify-between">
//                         <p className="text-xs font-black text-slate-800">
//                             Pengurus Arjuna Trans
//                         </p>
//                         <div className="border-b-2 border-slate-900 w-full"></div>
//                     </div>
//                 </div>
//                 <div className="w-72 mt-9">
//                     <div className="flex flex-col h-32 justify-between text-center">
//                         <p className="text-xs font-black text-slate-800 uppercase tracking-widest">
//                             Pemesanan
//                         </p>
//                         <div className="border-b-2 border-slate-900 w-full"></div>
//                     </div>
//                 </div>
//             </div>

//             {/* Bottom Note */}
//             <div className="px-12 pb-10 italic">
//                 <p className="text-[10px] font-bold text-red-500">
//                     Catatan : Biaya Tol, Parkir, dan Fee Sopir menjadi tanggung
//                     jawab penyewa
//                 </p>
//             </div>

//             {/* Footer Trim decoration */}
//             <div
//                 className="absolute bottom-0 left-0 w-full h-8 bg-[#004262] print:bg-[#004262]"
//                 style={{
//                     clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 100%)",
//                 }}
//             ></div>
//         </div>
//     );
// };
// export default InvoicePrint;
