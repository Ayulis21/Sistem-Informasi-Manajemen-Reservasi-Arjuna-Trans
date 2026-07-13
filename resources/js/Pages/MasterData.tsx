import React, { useEffect, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ArmadaGrid from "./MasterDataComponents/ArmadaGrid";
import CrewGrid from "./MasterDataComponents/CrewGrid";
import ModalArmada from "./MasterDataComponents/ModalArmada";
import ModalCrew from "./MasterDataComponents/ModalCrew";
import { Plus } from "lucide-react";
import axios from "axios";
import { router } from "@inertiajs/react";

const MasterData: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"ARMADA" | "KRU">("ARMADA");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [armada, setArmada] = useState([]);
    const [crew, setCrew] = useState([]);
    const [armadaForm, setArmadaForm] = useState({
        nama_armada: "",
        nopol: "",
        tipe_armada: "",
        kapasitas: 50,
        fasilitas: "",
        status_ketersediaan: "Ready",
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
    const fetchCrewData = () => {
        axios
            .get("/api/admin/kru")
            .then((response) => {
                // Menyiram langsung data teranyar database ke kartu grid kru Anda
                setCrew(response.data);
            })
            .catch((error) => {
                console.error("Gagal menarik data kru:", error);
            });
    };
    const fetchArmadaData = async () => {
        try {
            const response = await axios.get("/api/admin/armada");
            // Pastikan Anda melakukan set data ke state yang digunakan untuk merender tabel armada
            // Jika nama statenya 'armadaFromBackend', maka:
            // setArmadaData(response.data);

            // Agar simpel, Anda bisa menggunakan window.location.reload()
            // jika tidak ingin ribet mencari nama state tabelnya:
            window.location.reload();
        } catch (error) {
            console.error("Gagal menarik data armada:", error);
        }
    };
    React.useEffect(() => {
        if (activeTab === "KRU") {
            axios
                .get("/api/admin/kru")
                .then((response) => {
                    setCrew(response.data);
                })
                .catch((error) => {
                    console.error(
                        "Gagal menarik data kru dari database:",
                        error,
                    );
                });
        }
    }, [activeTab]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (activeTab === "ARMADA") {
            const nama =
                armadaForm?.nama_armada || (armadaForm as any)?.name || "";
            const pelat = armadaForm?.nopol || (armadaForm as any)?.plate || "";
            const kursi =
                armadaForm?.kapasitas || (armadaForm as any)?.seats || 0;
            const tipe =
                armadaForm?.tipe_armada ||
                (armadaForm as any)?.type ||
                "Big Bus";
            const fasilitas =
                armadaForm?.fasilitas || (armadaForm as any)?.facilities || "-";
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
                const payload = {
                    nama_armada: nama,
                    tipe_armada: tipe,
                    nopol: pelat,
                    kapasitas: Number(kursi),
                    fasilitas: fasilitas,
                    status_ketersediaan:
                        armadaForm.status_ketersediaan || "Tersedia",
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
                setArmadaForm({
                    nama_armada: "",
                    nopol: "",
                    tipe_armada: "Big Bus",
                    kapasitas: 50,
                    fasilitas: "AC, TV",
                    status_ketersediaan: "Tersedia",
                    // status: "READY",
                } as any);
                setIsModalOpen(false);
                fetchArmadaData();
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
            const namaKru = crewForm.name || "";
            const noTelp = crewForm.phone || "";
            const peranKru = crewForm.role || "Driver";

            // 1. Ambil nilai status dari form
            const statusKetersediaan = crewForm.taskStatus || "Ready";
            const statusAkun = crewForm.accountStatus || "Aktif"; // 🎯 Variabel ini sudah Anda buat

            if (!namaKru.trim()) {
                alert(
                    "❌ Gagal Simpan: Kolom 'NAMA LENGKAP KRU' tidak boleh kosong!",
                );
                return;
            }

            try {
                let response;
                // 2. 🎯 BUNGKUS PAYLOAD (Pastikan 'status' ada di sini!)
                const payloadKru = {
                    nama_kru: namaKru,
                    no_telp: noTelp,
                    peran: peranKru,
                    status_ketersediaan: statusKetersediaan,
                    status: statusAkun, // 🚀 KUNCI: Sekarang status ikut terkirim ke Laravel
                };

                if (isEditMode) {
                    response = await axios.put(
                        `/api/admin/kru/update/${selectedId}`,
                        payloadKru, // Kirim objek lengkap
                    );
                } else {
                    response = await axios.post(
                        "/api/admin/kru/store",
                        payloadKru, // Kirim objek lengkap
                    );
                }

                alert("✨ Sukses: " + response.data.message);

                // 3. Reset Form
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
                fetchCrewData();
            } catch (error: any) {
                // Tampilkan pesan error detail dari Laravel jika ada
                const pesanError =
                    error.response?.data?.message || "Gagal menyimpan data.";
                alert("❌ Gagal: " + pesanError);
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 text-left relative">
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
                                    setArmadaForm({
                                        nama_armada: "",
                                        nopol: "",
                                        tipe_armada: "Big Bus",
                                        kapasitas: 50,
                                        fasilitas: "AC, TV",
                                        status_ketersediaan: "Ready",
                                        status: "READY",
                                    });
                                } else {
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
                    {activeTab === "ARMADA" ? (
                        <ArmadaGrid
                            armadaList={armada}
                            onEditTrigger={(item: any) => {
                                setSelectedId(item.id_armada || item.id);
                                setIsEditMode(true);
                                setArmadaForm({
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
                                    status_ketersediaan:
                                        item.status_ketersediaan || "Ready",
                                    status: "READY",
                                });
                                setIsModalOpen(true);
                            }}
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
                                        fetchCrewData();
                                    } catch (error) {
                                        alert("❌ Gagal menghapus data kru.");
                                    }
                                }
                            }}
                        />
                    )}
                </div>
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
                            {activeTab === "ARMADA" ? (
                                <ModalArmada
                                    armadaForm={armadaForm}
                                    setArmadaForm={setArmadaForm}
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
                                    onClose={() => setIsModalOpen(false)}
                                    onSubmit={handleSave}
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
function fetchArmadaData() {
    throw new Error("Function not implemented.");
}
