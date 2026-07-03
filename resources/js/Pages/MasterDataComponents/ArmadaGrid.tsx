import React, { useState, useEffect } from "react";
import { Bus, Edit2, Trash2, Users } from "lucide-react";
// KUNCI SAKRAL: Mengimpor axios agar tidak memicu eror Cannot find name 'axios'
import axios from "axios";

interface ArmadaGridProps {
    armadaList: any[];
}

export const ArmadaGrid: React.FC<ArmadaGridProps> = ({ armadaList }) => {
    // =========================================================================
    // BACKEND CONTROL LOGIC: PENARIK DATA ARMADA RIIL DARI LARAVEL DATABASE
    // =========================================================================
    const [dbArmadaList, setDbArmadaList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArmadaData = async () => {
            try {
                // Menembak alamat URL API Route GET yang sudah didaftarkan di web.php
                const response = await axios.get("/api/admin/armada");
                setDbArmadaList(response.data.data);
            } catch (error) {
                console.error(
                    "Gagal menarik daftar armada dari database:",
                    error,
                );
            } finally {
                setLoading(false);
            }
        };
        fetchArmadaData();
    }, []);

    // KUNCI SAKRAL SINKRONISASI: Mengikat array ke database asli, sisa properti luar jadi cadangan
    const finalArmadaList =
        dbArmadaList.length > 0 ? dbArmadaList : armadaList || [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300 text-left">
            {/* KUNCI UTAMA: Mengubah dari armadaList menjadi finalArmadaList agar terhubung ke database */}
            {finalArmadaList.map((item: any, idx: number) => (
                <div
                    key={item.id_armada || idx}
                    className="bg-white rounded-[2.5rem] border border-slate-100/90 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-6 space-y-4 relative flex flex-col justify-between min-h-[220px]"
                >
                    {/* Baris Atas: Ikon Bus & Tombol Aksi */}
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100/50 rounded-2xl flex items-center justify-center text-[#5346F1]">
                            <Bus size={20} />
                        </div>
                        <div className="flex gap-1.5 text-slate-300">
                            <button
                                type="button"
                                className="p-1.5 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors"
                            >
                                <Edit2 size={13} />
                            </button>
                            <button
                                type="button"
                                className="p-1.5 hover:bg-slate-50 hover:text-red-500 rounded-lg transition-colors"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Baris Tengah: Nama & Pelat Nomor */}
                    <div className="space-y-0.5">
                        <h4 className="text-base font-black text-slate-800 tracking-tight leading-snug">
                            {/* KUNCI SINKRONISASI: Membaca kolom database nama_armada atau data mockup .name */}
                            {item.nama_armada || item.name}
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {/* KUNCI SINKRONISASI: Membaca kolom database nopol atau data mockup .plate */}
                            {item.nopol || item.plate}
                        </p>
                    </div>

                    {/* Baris Tag Fasilitas */}
                    {/* ========================================================================= */}
                    {/* REVISI PENYELAMAT KALIBRASI TAG FASILITAS (100% ANTI BLANK & ANTI CRASH)   */}
                    {/* ========================================================================= */}
                    <div className="flex flex-wrap gap-1.5 text-[8px] font-black uppercase tracking-wider text-slate-400">
                        {(() => {
                            // 1. Jika aslinya sudah berupa Array bawaan template, langsung pakai
                            if (Array.isArray(item.facilities))
                                return item.facilities;
                            if (Array.isArray(item.fasilitas))
                                return item.fasilitas;

                            // 2. Jika berupa teks string dari database, kita split dengan aman memakai tipe data kaku
                            if (
                                typeof item.fasilitas === "string" &&
                                item.fasilitas.trim() !== ""
                            ) {
                                return item.fasilitas.split(",");
                            }
                            if (
                                typeof item.facilities === "string" &&
                                item.facilities.trim() !== ""
                            ) {
                                return item.facilities.split(",");
                            }

                            // 3. Jaring Pengaman Akhir: Jika data null atau kosong, tampilkan opsi default ini agar web tidak blank
                            return ["Full AC", "Audio", "Karaoke"];
                        })().map((fac: string, fIdx: number) => (
                            <span
                                key={fIdx}
                                className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md"
                            >
                                {String(fac).trim()}
                            </span>
                        ))}
                    </div>

                    {/* Baris Informasi Seat & Tipe */}
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-400 tracking-wider pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700">
                            <Users size={12} className="text-slate-400" />
                            <span>{item.kapasitas || item.seats} Seat</span>
                        </div>
                        <span className="text-[#5346F1]">
                            {item.tipe_armada || item.type}
                        </span>
                    </div>

                    {/* Status Badge Bawah */}
                    <div className="pt-2">
                        <span
                            className={`inline-block px-3 py-1 border rounded-lg text-[8px] font-black uppercase tracking-wider ${
                                item.status_ketersediaan === "Tersedia" ||
                                item.status === "READY"
                                    ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                                    : "bg-blue-50 text-blue-500 border-blue-100"
                            }`}
                        >
                            {item.status_ketersediaan || item.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArmadaGrid;
