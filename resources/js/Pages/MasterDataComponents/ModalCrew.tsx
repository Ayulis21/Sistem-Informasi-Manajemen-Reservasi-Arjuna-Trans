import React from "react";

interface ModalCrewProps {
    crewForm: {
        name: string;
        role: string;
        phone: string;
        accountStatus?: string;
        taskStatus?: string;
        trips?: number;
        totalKm?: number;
    };
    setCrewForm: (data: any) => void;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const ModalCrew: React.FC<ModalCrewProps> = ({ crewForm, setCrewForm }) => {
    return (
        <div className="space-y-3 text-[9px] font-black uppercase tracking-widest text-[#94A3B8] animate-in fade-in duration-200">
            <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    NAMA LENGKAP KRU
                </label>
                <input
                    type="text"
                    placeholder="Contoh: Pak Slamet Hariyadi"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-slate-200"
                    value={crewForm?.name || ""}
                    onChange={(e) =>
                        setCrewForm({ ...crewForm, name: e.target.value })
                    }
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                        PERAN TUGAS
                    </label>
                    <div className="relative">
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-slate-200 appearance-none"
                            value={crewForm?.role || "Driver"}
                            onChange={(e) =>
                                setCrewForm({
                                    ...crewForm,
                                    role: e.target.value,
                                })
                            }
                        >
                            <option value="Driver">SOPIR UTAMA (DRIVER)</option>
                            <option value="Helper">KONDEKTUR (HELPER)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                        NOMOR TELEPON (WHATSAPP)
                    </label>
                    <input
                        type="text"
                        placeholder="Contoh: 081234567xxx"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-slate-200"
                        value={crewForm?.phone || ""}
                        onChange={(e) =>
                            setCrewForm({ ...crewForm, phone: e.target.value })
                        }
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="pl-1">Status Akun</label>
                    <select
                        value={crewForm.accountStatus}
                        onChange={(e) =>
                            setCrewForm({
                                ...crewForm,
                                accountStatus: e.target.value,
                            })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
                    >
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak Aktif">Nonaktif (Off)</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="pl-1">Status Tugas</label>
                    <select
                        value={crewForm.taskStatus}
                        onChange={(e) =>
                            setCrewForm({
                                ...crewForm,
                                taskStatus: e.target.value,
                            })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
                    >
                        <option value="Ready">Ready</option>
                        <option value="Bertugas">Bertugas</option>
                        <option value="Cuti">Cuti (Izin/Libur)</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                        TOTAL PERJALANAN (TRIPS)
                    </label>
                    <input
                        type="number"
                        disabled
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-100 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed outline-none"
                        value={crewForm?.trips ?? 0}
                        onChange={(e) =>
                            setCrewForm({
                                ...crewForm,
                                trips: parseInt(e.target.value) || 0,
                            })
                        }
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                        TOTAL JARAK (KM)
                    </label>
                    <input
                        type="number"
                        disabled
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-100 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed outline-none"
                        value={crewForm?.totalKm ?? 0}
                        onChange={(e) =>
                            setCrewForm({
                                ...crewForm,
                                totalKm: parseInt(e.target.value) || 0,
                            })
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default ModalCrew;
