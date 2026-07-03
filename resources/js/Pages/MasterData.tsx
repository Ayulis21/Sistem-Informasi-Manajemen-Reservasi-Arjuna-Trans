import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ArmadaGrid from "./MasterDataComponents/ArmadaGrid";
import CrewGrid from "./MasterDataComponents/CrewGrid";
import ModalArmada from "./MasterDataComponents/ModalArmada"; // Panggil modal armada terpisah
import ModalCrew from "./MasterDataComponents/ModalCrew"; // Panggil modal kru terpisah
import { Plus } from "lucide-react";
import axios from "axios";

const MasterData: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"ARMADA" | "KRU">("ARMADA");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [armada, setArmada] = useState([]);

    const [crew, setCrew] = useState([]);

    const [busForm, setBusForm] = useState({
        nama_armada: "",
        nopol: "",
        tipe_armada: "",
        kapasitas: 50,
        fasilitas: "",
        status: "READY",
    });
    const [crewForm, setCrewForm] = useState({
        name: "",
        role: "Driver",
        phone: "",
        accountStatus: "Aktif",
        taskStatus: "Ready",
        trips: 0,
        totalKm: 0,
    });

    // =========================================================================
    // REVISI FINAL SAKRAL: MENGEMBALIKAN FORM INPUT UTUH & AMAN (0 ERROR)
    // =========================================================================
    // const handleSubmitArmada = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     // Jaring pengaman mutakhir: Langsung tembak properti bahasa Indonesia asli Anda
    //     const nama = busForm?.nama_armada;
    //     const tipe = busForm?.tipe_armada || "Bus";
    //     const pelat = busForm?.nopol;
    //     const kursi = busForm?.kapasitas;
    //     const fasilitas = busForm?.fasilitas || "-";

    //     if (!nama || !pelat || !kursi) {
    //         alert(
    //             "Silakan isi nama armada, plat nomor, dan kapasitas unit terlebih dahulu!",
    //         );
    //         return;
    //     }

    //     try {
    //         const response = await axios.post("/api/admin/armada/store", {
    //             nama_armada: nama,
    //             tipe_armada: tipe,
    //             nopol: pelat,
    //             kapasitas: Number(kursi),
    //             fasilitas: fasilitas,
    //         });

    //         alert(response.data.message);

    //         // KUNCI UTAMA: Biarkan form di-reset menjadi string kosong, tetapi gunakan 'as any'
    //         // agar compiler TypeScript tidak protes mengenai struktur kaku objek bawaan Anda
    //         setBusForm({
    //             nama_armada: "",
    //             nopol: "",
    //             tipe_armada: "",
    //             kapasitas: 0,
    //             fasilitas: "",
    //             status: "READY",
    //         } as any);

    //         if (typeof setIsModalOpen !== "undefined") setIsModalOpen(false);
    //         window.location.reload();
    //     } catch (error: any) {
    //         console.error("Gagal menyimpan:", error);
    //         alert(
    //             error.response?.data?.message ||
    //                 "Gagal menyimpan data unit baru. Pastikan NOPOL/Plat belum terdaftar!",
    //         );
    //     }
    // };
    // =========================================================================
    // REVISI VALIDASI DETAI L: INFORMATIF & TO THE POINT BERI TAHU SALAHNYA DI MANA
    // =========================================================================
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (activeTab === "ARMADA") {
            // Saringan menangkap data properti bahasa Indonesia maupun bahasa Inggris
            const nama = (busForm?.nama_armada || (busForm as any)?.name || "")
                .toString()
                .trim();
            const pelat = (busForm?.nopol || (busForm as any)?.plate || "")
                .toString()
                .trim();
            const kursiRaw =
                busForm?.kapasitas !== undefined
                    ? busForm.kapasitas
                    : (busForm as any)?.seats;
            const tipe =
                busForm?.tipe_armada || (busForm as any)?.type || "Big Bus";
            const fasilitas =
                busForm?.fasilitas || (busForm as any)?.facilities || "-";

            // 1. CEK SATU PER SATU BIAR USER TIDAK BINGUNG
            if (!nama) {
                alert("❌ Gagal Simpan: Kolom 'NAMA ARMADA' belum diisi!");
                return;
            }
            if (!pelat) {
                alert(
                    "❌ Gagal Simpan: Kolom 'NOMOR POLISI (NOPOL)' belum diisi!",
                );
                return;
            }

            // KUNCI SAKRAL DETEKSI RENTANG/KOSONG: Jika kursiRaw bernilai null, undefined, 0, atau mengandung karakter bukan angka murni
            if (
                kursiRaw === null ||
                kursiRaw === undefined ||
                kursiRaw === "" ||
                Number(kursiRaw) === 0
            ) {
                alert(
                    "⚠️ Peringatan Input: Kolom 'KAPASITAS (SEAT)' wajib diisi dengan ANGKA MURNI saja (Contoh: 50).\n\nJika Anda baru saja mengetik format rentang (seperti 40-59) atau huruf acak, browser otomatis memblokirnya karena bukan angka murni!",
                );
                return;
            }

            // Jaring pengaman akhir memastikan data berupa angka murni untuk MySQL Integer
            if (isNaN(Number(kursiRaw))) {
                alert(
                    "❌ Gagal Simpan: Format salah! Kolom kapasitas wajib berupa angka murni saja.",
                );
                return;
            }

            try {
                const response = await axios.post("/api/admin/armada/store", {
                    nama_armada: nama,
                    tipe_armada: tipe,
                    nopol: pelat,
                    kapasitas: Number(kursiRaw),
                    fasilitas: fasilitas,
                });

                alert("✨ Sukses: " + response.data.message);

                setBusForm({
                    nama_armada: "",
                    nopol: "",
                    tipe_armada: "Big Bus",
                    kapasitas: 50,
                    fasilitas: "AC, TV",
                    status: "READY",
                } as any);

                setIsModalOpen(false);
                window.location.reload();
            } catch (error: any) {
                console.error("Gagal menyimpan ke database:", error);

                // Menangkap eror validasi unik dari database Laravel MySQL
                if (error.response && error.response.status === 422) {
                    const dbErrors = error.response.data.errors;
                    if (dbErrors.nopol) {
                        alert(
                            `🚫 Gagal Database: Nomor Polisi/Plat Nomor '${pelat}' sudah pernah terdaftar di sistem Arjuna Trans! Gunakan nopol lain.`,
                        );
                        return;
                    }
                }
                alert(
                    error.response?.data?.message ||
                        "❌ Gagal menyimpan data unit baru ke database MySQL.",
                );
            }
        } else {
            // =========================================================================
            // VALIDASI SPESIFIK UNTUK MENU KELOLA DATA KRU
            // =========================================================================
            const namaKru = crewForm.name || "";
            const noTelp = crewForm.phone || "";

            if (!namaKru.trim()) {
                alert(
                    "❌ Gagal Simpan: Kolom 'NAMA LENGKAP KRU' tidak boleh kosong!",
                );
                return;
            }
            if (!noTelp.trim()) {
                alert(
                    "❌ Gagal Simpan: Kolom 'NOMOR TELEPON' wajib diisi untuk koordinasi lapangan!",
                );
                return;
            }

            try {
                const response = await axios.post("/api/admin/kru/store", {
                    nama_kru: namaKru,
                    no_telp: noTelp,
                    peran: crewForm.role === "Driver" ? "Driver" : "Helper",
                });

                alert("✨ Sukses: " + response.data.message);

                setCrewForm({
                    name: "",
                    role: "Driver",
                    phone: "",
                    accountStatus: "Aktif",
                    taskStatus: "Ready",
                    trips: 0,
                    totalKm: 0,
                });

                setIsModalOpen(false);
                window.location.reload();
            } catch (error) {
                alert(
                    "❌ Gagal: Tidak dapat mendaftarkan kru baru ke database.",
                );
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 text-left relative">
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            Manajemen Aset & Kru
                        </h2>
                        <p className="text-slate-400 text-xs font-bold italic mt-1.5">
                            Kelola daftar armada bus dan tim kru lapangan.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-end">
                        <div className="bg-white border border-slate-200/60 p-1 rounded-full flex text-[10px] font-black uppercase tracking-widest">
                            <button
                                onClick={() => setActiveTab("ARMADA")}
                                type="button"
                                className={`px-5 py-2 rounded-full ${activeTab === "ARMADA" ? "bg-[#5346F1] text-white shadow-md" : "text-slate-400"}`}
                            >
                                Armada
                            </button>
                            <button
                                onClick={() => setActiveTab("KRU")}
                                type="button"
                                className={`px-5 py-2 rounded-full ${activeTab === "KRU" ? "bg-[#5346F1] text-white shadow-md" : "text-slate-400"}`}
                            >
                                Kru
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setBusForm({
                                    nama_armada: "",
                                    nopol: "",
                                    tipe_armada: "Big Bus", // Sesuaikan nilai awal di sini
                                    kapasitas: 50,
                                    fasilitas: "AC, TV",
                                    status: "READY",
                                });
                                setIsModalOpen(true);
                            }}
                            type="button"
                            className="bg-slate-950 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest px-4 py-3 rounded-xl shadow-md"
                        >
                            <Plus size={14} />{" "}
                            <span>
                                Tambah{" "}
                                {activeTab === "ARMADA" ? "Armada" : "Kru"}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    {activeTab === "ARMADA" ? (
                        <ArmadaGrid armadaList={armada} />
                    ) : (
                        <CrewGrid crewList={crew} />
                    )}
                </div>

                {/* MODAL OVERLAY POPUP BERSIH */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <form
                            onSubmit={handleSave}
                            className="bg-white w-full max-w-[460px] rounded-[2.5rem] shadow-2xl p-8 space-y-5 text-left border border-slate-100"
                        >
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                                <div className="w-1 h-6 bg-[#5346F1] rounded-full"></div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                                    Tambah{" "}
                                    {activeTab === "ARMADA" ? "Armada" : "Kru"}{" "}
                                    Baru
                                </h3>
                            </div>

                            {/* MEMANGGIL KOMPONEN SECARA TERPISAH DAN DINAMIS */}
                            {activeTab === "ARMADA" ? (
                                <ModalArmada
                                    busForm={busForm}
                                    setBusForm={setBusForm}
                                    onClose={() => setIsModalOpen(false)}
                                    onSubmit={function (
                                        e: React.FormEvent,
                                    ): void {
                                        throw new Error(
                                            "Function not implemented.",
                                        );
                                    }}
                                />
                            ) : (
                                <ModalCrew
                                    crewForm={crewForm}
                                    setCrewForm={setCrewForm}
                                />
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-[10px] font-black uppercase tracking-widest">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    type="button"
                                    className="w-full py-3.5 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl text-center"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave} // KUNCI UTAMA: Pasang klik di button luar ini
                                    className="bg-[#5346F1] hover:bg-[#4338CA] text-white font-black text-xs px-6 py-3 rounded-xl shadow-md"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default MasterData;
