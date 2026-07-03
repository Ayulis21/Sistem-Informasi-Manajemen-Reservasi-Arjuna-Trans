import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ArmadaGrid from "./MasterDataComponents/ArmadaGrid";
import CrewGrid from "./MasterDataComponents/CrewGrid";
import ModalArmada from "./MasterDataComponents/ModalArmada"; // Panggil modal armada terpisah
import ModalCrew from "./MasterDataComponents/ModalCrew"; // Panggil modal kru terpisah
import { Plus } from "lucide-react";

const MasterData: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"ARMADA" | "KRU">("ARMADA");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [armada, setArmada] = useState([
        {
            name: "Jetbus 5 Plus Super High Deck",
            plate: "B 7001 TGC",
            facilities: ["AC", "TV", "KARAOKE"],
            seats: 50,
            type: "BUS",
            status: "READY",
        },
        {
            name: "Hiace Premio Luxury",
            plate: "B 1234 ABC",
            facilities: ["AC", "TV"],
            seats: 14,
            type: "MOBIL",
            status: "PERJALANAN",
        },
    ]);

    const [crew, setCrew] = useState([
        {
            name: "Pak Slamet Hariyadi",
            role: "SOPIR UTAMA (DRIVER)",
            totalKm: 24500,
            status: "READY",
        },
    ]);

    const [busForm, setBusForm] = useState({
        name: "",
        plate: "",
        type: "Big Bus",
        seats: 50,
        facilities: "AC, TV",
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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === "ARMADA") {
            const newUnit = {
                name: busForm.name || "Armada Baru",
                plate: busForm.plate || "B 9999 XX",
                type: busForm.type,
                seats: Number(busForm.seats),
                facilities: busForm.facilities.split(","),
                status: busForm.status,
            };
            setArmada([newUnit, ...armada]);
            setBusForm({
                name: "",
                plate: "",
                type: "Big Bus",
                seats: 50,
                facilities: "AC, TV",
                status: "READY",
            });
        } else {
            const newCrew = {
                name: crewForm.name || "Kru Baru",
                role:
                    crewForm.role === "Driver"
                        ? "SOPIR UTAMA (DRIVER)"
                        : "KONDEKTUR (HELPER)",
                totalKm: Number(crewForm.totalKm),
                status: crewForm.taskStatus.toUpperCase(),
            };
            setCrew([newCrew, ...crew]);
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
        setIsModalOpen(false);
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
                            onClick={() => setIsModalOpen(true)}
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
                                    type="submit"
                                    className="w-full py-3.5 bg-[#5346F1] text-white rounded-xl text-center"
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
