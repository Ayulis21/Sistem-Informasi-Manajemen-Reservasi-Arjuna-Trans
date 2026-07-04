import React, { useEffect, useState } from "react";
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
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

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
    // KUNCI SAKRAL KRU: MENARIK DATA RIIL DARI DATABASE MYSQL SE CARA OTOMATIS
    // =========================================================================
    React.useEffect(() => {
        // Hanya menarik data dari database jika admin sedang berada di tab KRU
        if (activeTab === "KRU") {
            axios
                .get("/api/admin/kru")
                .then((response) => {
                    // Menyiram data dari database MySQL masuk ke dalam state crew Anda
                    setCrew(response.data);
                })
                .catch((error) => {
                    console.error(
                        "Gagal menarik data kru dari database:",
                        error,
                    );
                });
        }
    }, [activeTab]); // Otomatis terpicu segar setiap kali admin mengklik perpindahan tab menu

    // =========================================================================
    // REVISI VALIDASI DETAI L: INFORMATIF & TO THE POINT BERI TAHU SALAHNYA DI MANA
    // =========================================================================
    // =========================================================================
    // REVISI URUTAN VARIABEL: CAKUPAN LURUS BEBAS ERROR TYP EScRIPT (0 ERROR)
    // =========================================================================
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (activeTab === "ARMADA") {
            // KUNCI SAKRAL 1: Deklarasi saringan variabel diletakkan di bagian paling atas fungsi
            const nama = busForm?.nama_armada || (busForm as any)?.name || "";
            const pelat = busForm?.nopol || (busForm as any)?.plate || "";
            const kursi = busForm?.kapasitas || (busForm as any)?.seats || 0;
            const tipe =
                busForm?.tipe_armada || (busForm as any)?.type || "Big Bus";
            const fasilitas =
                busForm?.fasilitas || (busForm as any)?.facilities || "-";

            // Validasi pengecekan interaktif front-end Anda tetap terjaga
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
            if (!kursi || Number(kursi) === 0) {
                alert(
                    "⚠️ Peringatan Input: Kolom 'KAPASITAS (SEAT)' wajib diisi dengan ANGKA MURNI saja!",
                );
                return;
            }

            try {
                // KUNCI SAKRAL 2: Sekarang variabel payload di dalam blok try aman membaca data dari atas
                const payload = {
                    nama_armada: nama,
                    tipe_armada: tipe,
                    nopol: pelat,
                    kapasitas: Number(kursi),
                    fasilitas: fasilitas,
                };

                let response;
                if (isEditMode) {
                    response = await axios.put(
                        `/api/admin/armada/update/${selectedId}`,
                        payload,
                    );
                } else {
                    response = await axios.post(
                        "/api/admin/armada/store",
                        payload,
                    );
                }

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
                if (error.response && error.response.status === 422) {
                    const dbErrors = error.response.data.errors;
                    if (dbErrors.nopol) {
                        alert(
                            `🚫 Gagal Database: Nomor Polisi/Plat Nomor '${pelat}' sudah pernah terdaftar di sistem!`,
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
            // SINKRONISASI TRANSMISI DATA: LURUS LANGSUNG MASUK KE KRU CONTROLLER
            // =========================================================================
            const namaKru = crewForm.name || "";
            const noTelp = crewForm.phone || "";
            const peranKru = crewForm.role || "Driver"; // Mengambil nilai string murni 'Driver' atau 'Helper'

            if (!namaKru.trim()) {
                alert(
                    "❌ Gagal Simpan: Kolom 'NAMA LENGKAP KRU' tidak boleh kosong!",
                );
                return;
            }
            if (!noTelp.trim()) {
                alert("❌ Gagal Simpan: Kolom 'NOMOR TELEPON' wajib diisi!");
                return;
            }

            try {
                let response;

                // KUNCI ASINKRONIS EDIT KRU: Deteksi rute PUT update atau POST store
                if (isEditMode) {
                    response = await axios.put(
                        `/api/admin/kru/update/${selectedId}`,
                        {
                            nama_kru: namaKru,
                            no_telp: noTelp,
                            peran: peranKru,
                        },
                    );
                } else {
                    response = await axios.post("/api/admin/kru/store", {
                        nama_kru: namaKru,
                        no_telp: noTelp,
                        peran: peranKru,
                    });
                }

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
                                if (activeTab === "ARMADA") {
                                    setIsEditMode(false);
                                    setBusForm({
                                        nama_armada: "",
                                        nopol: "",
                                        tipe_armada: "Big Bus",
                                        kapasitas: 50,
                                        fasilitas: "AC, TV",
                                        status: "READY",
                                    });
                                } else {
                                    // KUNCI RESET KRU: Pastikan mode edit disetel false saat tambah baru
                                    setIsEditMode(false);
                                    setCrewForm({
                                        name: "",
                                        role: "Driver",
                                        phone: "",
                                        accountStatus: "Aktif",
                                        taskStatus: "Ready",
                                        trips: 0,
                                        totalKm: 0,
                                    });
                                }
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
                    {/* ========================================================================= */}
                    {/* REVISI PEMICU KLIK PENSIL: MENANGKAP DATA UNTUK DI LEMPAR KE MODAL POPUP    */}
                    {/* ========================================================================= */}
                    {activeTab === "ARMADA" ? (
                        <ArmadaGrid
                            armadaList={armada}
                            // Fungsi magis yang membuat tombol pensil fiks Anda langsung merespons membuka form
                            onEditTrigger={(item: any) => {
                                setSelectedId(item.id_armada || item.id);
                                setIsEditMode(true); // Mengunci status ke mode EDIT

                                setBusForm({
                                    nama_armada:
                                        item.nama_armada || item.name || "",
                                    nopol: item.nopol || item.plate || "",
                                    tipe_armada:
                                        item.tipe_armada ||
                                        item.type ||
                                        "Big Bus",
                                    kapasitas: Number(
                                        item.kapasitas || item.seats || 50,
                                    ),
                                    fasilitas:
                                        typeof item.fasilitas === "string"
                                            ? item.fasilitas
                                            : item.facilities
                                              ? Array.isArray(item.facilities)
                                                  ? item.facilities.join(", ")
                                                  : item.facilities
                                              : "AC, TV",
                                    status:
                                        item.status_ketersediaan ||
                                        item.status ||
                                        "READY",
                                });

                                setIsModalOpen(true); // Membuka jendela boks formulir visual Anda
                            }}
                            // Logika hapus data armada tetap diamankan di bawahnya
                            onDeleteTrigger={async (
                                id: number,
                                namaBus: string,
                            ) => {
                                if (
                                    confirm(
                                        `Apakah Anda yakin ingin menghapus unit "${namaBus}" secara permanen?`,
                                    )
                                ) {
                                    try {
                                        const response = await axios.delete(
                                            `/api/admin/armada/delete/${id}`,
                                        );
                                        alert(
                                            "✨ Sukses: " +
                                                response.data.message,
                                        );
                                        window.location.reload();
                                    } catch (error) {
                                        alert("❌ Gagal menghapus unit.");
                                    }
                                }
                            }}
                        />
                    ) : (
                        <CrewGrid
                            crewList={crew || []}
                            onEditTrigger={(item: any) => {
                                // SATU VARIABEL UNTUK SEMUA: Masukkan ID kru ke selectedId bawaan Anda
                                setSelectedId(item.id_kru || item.id);
                                setIsEditMode(true);

                                setCrewForm({
                                    name: item.nama_kru || item.name || "",
                                    role:
                                        item.peran === "DRIVER" ||
                                        item.peran === "Driver"
                                            ? "Driver"
                                            : "Helper",
                                    phone: item.no_telp || item.phone || "",
                                    accountStatus: item.status || "Aktif",
                                    taskStatus:
                                        item.status_ketersediaan || "Ready",
                                    trips: Number(item.trips || 0),
                                    totalKm: Number(
                                        item.totalKm || item.total_km || 0,
                                    ),
                                });

                                setIsModalOpen(true);
                            }}
                            onDeleteTrigger={async (
                                id: number,
                                namaKru: string,
                            ) => {
                                if (
                                    confirm(
                                        `Apakah Anda yakin ingin menghapus kru "${namaKru}" secara permanen?`,
                                    )
                                ) {
                                    try {
                                        const response = await axios.delete(
                                            `/api/admin/kru/delete/${id}`,
                                        );
                                        alert(
                                            "✨ Sukses: " +
                                                response.data.message,
                                        );
                                        window.location.reload();
                                    } catch (error) {
                                        alert("❌ Gagal menghapus data kru.");
                                    }
                                }
                            }}
                        />
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
                                    onClose={() => setIsModalOpen(false)} // Menyembuhkan error onClose
                                    onSubmit={handleSave} // Menyembuhkan error onSubmit
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
                                    onClick={handleSave}
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
