import React from "react";

interface ModalCrewProps {
    crewForm: any;
    setCrewForm: (data: any) => void;
}

const ModalCrew: React.FC<ModalCrewProps> = ({ crewForm, setCrewForm }) => {
    return (
        <div className="space-y-3 text-[9px] font-black uppercase tracking-widest text-[#94A3B8] animate-in fade-in duration-200">
            <div className="space-y-1">
                <label className="pl-1">Nama Lengkap</label>
                <input
                    type="text"
                    placeholder="Masukkan nama lengkap kru"
                    value={crewForm.name}
                    onChange={(e) =>
                        setCrewForm({ ...crewForm, name: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="pl-1">Peran</label>
                    <select
                        value={crewForm.role}
                        onChange={(e) =>
                            setCrewForm({ ...crewForm, role: e.target.value })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
                    >
                        <option value="Driver">Driver</option>
                        <option value="Helper">Helper</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="pl-1">No Telepon</label>
                    <input
                        type="text"
                        placeholder="08xxxx"
                        value={crewForm.phone}
                        onChange={(e) =>
                            setCrewForm({ ...crewForm, phone: e.target.value })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none"
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
                        <option>Aktif</option>
                        <option>Nonaktif</option>
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
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="pl-1">Total Perjalanan (Trips)</label>
                    <input
                        type="number"
                        value={crewForm.trips}
                        onChange={(e) =>
                            setCrewForm({
                                ...crewForm,
                                trips: Number(e.target.value),
                            })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="pl-1">Total Jarak (KM)</label>
                    <input
                        type="number"
                        value={crewForm.totalKm}
                        onChange={(e) =>
                            setCrewForm({
                                ...crewForm,
                                totalKm: Number(e.target.value),
                            })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default ModalCrew;
