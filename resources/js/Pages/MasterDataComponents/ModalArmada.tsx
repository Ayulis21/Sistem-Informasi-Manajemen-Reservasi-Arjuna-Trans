import React from "react";

interface ModalArmadaProps {
    armadaForm: {
        status_ketersediaan: string;
        nama_armada: string;
        nopol: string;
        tipe_armada: string;
        kapasitas: number;
        fasilitas: string;
        status: string;
    };
    setArmadaForm: (data: any) => void;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const ModalArmada: React.FC<ModalArmadaProps> = ({
    armadaForm,
    setArmadaForm,
    onClose,
    onSubmit,
}) => {
    return (
        <div className="space-y-5 pt-2">
            <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    NAMA ARMADA
                </label>
                <input
                    type="text"
                    placeholder="Contoh: Jetbus 5 Plus"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-slate-200"
                    value={armadaForm?.nama_armada || ""}
                    onChange={(e) =>
                        setArmadaForm({
                            ...armadaForm,
                            nama_armada: e.target.value,
                        })
                    }
                />
            </div>
            <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    NOMOR POLISI (NOPOL)
                </label>
                <input
                    type="text"
                    placeholder="Contoh: S 1234 XN"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-slate-200"
                    value={armadaForm?.nopol || ""}
                    onChange={(e) =>
                        setArmadaForm({ ...armadaForm, nopol: e.target.value })
                    }
                />
            </div>
            <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    TIPE ARMADA
                </label>
                <div className="relative">
                    <select
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-slate-200 appearance-none"
                        value={armadaForm?.tipe_armada || "Big Bus"}
                        onChange={(e) =>
                            setArmadaForm({
                                ...armadaForm,
                                tipe_armada: e.target.value,
                            })
                        }
                    >
                        <option value="Big Bus">Big Bus</option>
                        <option value="Medium Bus">Medium Bus</option>
                        <option value="Elf">Elf / Hiace</option>
                        <option value="Mobil">Mobil Pribadi</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    KAPASITAS (SEAT)
                </label>
                <input
                    type="number"
                    placeholder="Contoh: 50"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-slate-200"
                    value={armadaForm?.kapasitas || ""}
                    onChange={(e) =>
                        setArmadaForm({
                            ...armadaForm,
                            kapasitas: e.target.value
                                ? parseInt(e.target.value)
                                : 0,
                        })
                    }
                />
            </div>
            <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    FASILITAS (GUNAKAN KOMA)
                </label>
                <textarea
                    placeholder="AC, TV, Karaoke"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-slate-200 resize-none h-[60px]"
                    value={armadaForm?.fasilitas || ""}
                    onChange={(e) =>
                        setArmadaForm({
                            ...armadaForm,
                            fasilitas: e.target.value,
                        })
                    }
                />
            </div>
            {/* Letakkan di dalam Modal Armada di MasterData.tsx */}
            <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    Status Ketersediaan
                </label>
                <div className="relative">
                    <select
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-slate-200 appearance-none"
                        value={armadaForm.status_ketersediaan || "Tersedia"}
                        onChange={(e) =>
                            setArmadaForm({
                                ...armadaForm,
                                status_ketersediaan: e.target.value,
                            } as any)
                        }
                    >
                        <option value="Tersedia">Ready (Siap Jalan)</option>{" "}
                        {/* 🎯 Value harus 'Tersedia' */}
                        <option value="Perbaikan">Perbaikan (Bengkel)</option>
                        <option value="Perjalanan">
                            Perjalanan (Sedang Tugas)
                        </option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ModalArmada;
