import React from "react";

interface ModalArmadaProps {
    busForm: any;
    setBusForm: (data: any) => void;
    onClose: () => void;
}

const ModalArmada: React.FC<ModalArmadaProps> = ({
    busForm,
    setBusForm,
    onClose,
}) => {
    return (
        <div className="space-y-4 text-[9px] font-black uppercase tracking-widest text-[#94A3B8] animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="pl-1">Nama Bus</label>
                    <input
                        type="text"
                        placeholder="Nama Bus"
                        value={busForm.name}
                        onChange={(e) =>
                            setBusForm({ ...busForm, name: e.target.value })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                        required
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="pl-1">Plat Nomor</label>
                    <input
                        type="text"
                        placeholder="PLAT"
                        value={busForm.plate}
                        onChange={(e) =>
                            setBusForm({ ...busForm, plate: e.target.value })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="pl-1">Tipe</label>
                    <select
                        value={busForm.type}
                        onChange={(e) =>
                            setBusForm({ ...busForm, type: e.target.value })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
                    >
                        <option>Big Bus</option>
                        <option>Medium Bus</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="pl-1">Kapasitas (Seat)</label>
                    <input
                        type="number"
                        value={busForm.seats}
                        onChange={(e) =>
                            setBusForm({
                                ...busForm,
                                seats: Number(e.target.value),
                            })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="pl-1">Fasilitas (Gunakan Koma)</label>
                    <input
                        type="text"
                        value={busForm.facilities}
                        onChange={(e) =>
                            setBusForm({
                                ...busForm,
                                facilities: e.target.value,
                            })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="pl-1">Status</label>
                    <select
                        value={busForm.status}
                        onChange={(e) =>
                            setBusForm({ ...busForm, status: e.target.value })
                        }
                        className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
                    >
                        <option value="READY">Ready</option>
                        <option value="MAINTENANCE">Servis</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ModalArmada;
