import React, { useState, useEffect } from "react";
import { MapPin, Bus, Users, Trash2, UserCheck } from "lucide-react";

interface PlottingRightProps {
    selectedOrder: any;
}

const PlottingRight: React.FC<PlottingRightProps> = ({ selectedOrder }) => {
    // 1. KONDISI AWAL: Jika belum ada pelanggan yang diklik di sebelah kiri
    if (!selectedOrder) {
        return (
            <div className="h-full min-h-[400px] bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 space-y-4">
                <UserCheck size={64} className="opacity-20" />
                <p className="font-bold italic text-sm">
                    Pilih pesanan di sebelah kiri untuk mulai plotting.
                </p>
            </div>
        );
    }

    const totalBusesNeeded =
        selectedOrder.fleetRequirements?.reduce(
            (sum: number, r: any) => sum + r.count,
            0,
        ) || 0;
    const slotRows = Array.from(
        { length: totalBusesNeeded },
        (_, index) => index + 1,
    );

    // State pemantau status per slot nomor (Standby / Internal / Rekanan)
    const [slotModes, setSlotModes] = useState<{
        [key: number]: "Standby" | "Internal" | "Rekanan";
    }>({});

    // Reset slot menjadi kosong setiap kali admin mengganti pelanggan di sebelah kiri
    useEffect(() => {
        setSlotModes({});
    }, [selectedOrder.id]);

    const setTypeForSlot = (slotNum: number, mode: "Internal" | "Rekanan") => {
        setSlotModes((prev) => ({ ...prev, [slotNum]: mode }));
    };

    const resetSlotToStandby = (slotNum: number) => {
        setSlotModes((prev) => ({ ...prev, [slotNum]: "Standby" }));
    };

    return (
        <div className="space-y-6 text-left">
            {/* Boks Konten Utama Putih Atas */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                {/*  HEADER BERSIH: Tombol Pojok Atas Sudah Dihapus Total */}
                <div className="pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                            {selectedOrder.customerName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pt-1">
                            <span className="flex items-center">
                                <MapPin
                                    size={13}
                                    className="mr-1 text-slate-300"
                                />{" "}
                                {selectedOrder.destination}
                            </span>
                            <span className="text-indigo-600">
                                {selectedOrder.departureTime} -{" "}
                                {selectedOrder.returnTime}
                            </span>
                        </div>
                        <span className="inline-block text-[8px] font-black text-[#5346F1] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md tracking-wider uppercase mt-1">
                            MUST PLOT: {totalBusesNeeded} BUS
                        </span>
                    </div>
                </div>

                {/* Progress Bar Kebutuhan */}
                <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-[#5346F1] h-full transition-all duration-500"
                            style={{
                                width: `${(Object.values(slotModes).filter((m) => m !== "Standby").length / totalBusesNeeded) * 100}%`,
                            }}
                        ></div>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Kebutuhan:{" "}
                        {
                            Object.values(slotModes).filter(
                                (m) => m !== "Standby",
                            ).length
                        }{" "}
                        dari {totalBusesNeeded} unit terpenuhi
                    </p>
                </div>

                {/* Area Render Slot Utama */}
                <div className="space-y-4 pt-2">
                    {slotRows.map((num) => {
                        const currentMode = slotModes[num] || "Standby";

                        return (
                            <div
                                key={num}
                                className="bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl p-5 flex gap-4 items-start relative"
                            >
                                <span className="text-sm font-black text-indigo-600 bg-slate-50 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-100 shrink-0">
                                    {num}
                                </span>

                                <div className="flex-1 space-y-4">
                                    {/* KONDISI 1: JIKA SLOT MASIH KOSONG MERAH (STANDBY) */}
                                    {currentMode === "Standby" && (
                                        <>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-black text-red-500 uppercase tracking-wider flex items-center gap-1">
                                                    BUTUH: BUS
                                                </p>
                                                <p className="text-[9px] font-medium text-slate-400 italic">
                                                    Slot belum terisi
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-[9px] font-black uppercase tracking-wider">
                                                <button
                                                    onClick={() =>
                                                        setTypeForSlot(
                                                            num,
                                                            "Internal",
                                                        )
                                                    }
                                                    type="button"
                                                    className="bg-slate-50 border border-slate-100 py-3 rounded-xl text-slate-600 text-center hover:bg-indigo-50 hover:text-[#5346F1] transition-all"
                                                >
                                                    Plot Armada Int
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setTypeForSlot(
                                                            num,
                                                            "Rekanan",
                                                        )
                                                    }
                                                    type="button"
                                                    className="bg-slate-50 border border-slate-100 py-3 rounded-xl text-slate-600 text-center hover:bg-indigo-50 hover:text-orange-600 transition-all"
                                                >
                                                    Plot Rekanan
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* KONDISI 2: BARU MUNCUL SELECTION JIKA KLIK INTERNAL */}
                                    {currentMode === "Internal" && (
                                        <div className="space-y-4 animate-in fade-in duration-300">
                                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                                <span className="text-[8px] font-black px-2 py-0.5 bg-indigo-600 text-white rounded uppercase tracking-wider">
                                                    TIPE: INTERNAL
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        resetSlotToStandby(num)
                                                    }
                                                    type="button"
                                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] font-bold text-slate-500">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                                        Pilih Bus
                                                    </label>
                                                    <select className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-700 cursor-pointer">
                                                        <option>
                                                            -- Pilih Armada --
                                                        </option>
                                                        <option>
                                                            Bus High Deck 1
                                                        </option>
                                                        <option>
                                                            Bus Jetbus 3+
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                                        Sopir (Driver)
                                                    </label>
                                                    <select className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-700 cursor-pointer">
                                                        <option>
                                                            -- Pilih Sopir --
                                                        </option>
                                                        <option>
                                                            Pak Slamet
                                                        </option>
                                                        <option>
                                                            Pak Bambang
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                                        Kondektur
                                                    </label>
                                                    <select className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-700 cursor-pointer">
                                                        <option>
                                                            -- Tanpa Helper --
                                                        </option>
                                                        <option>
                                                            Mas Agus
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* KONDISI 3: BARU MUNCUL FORM INPUT JIKA KLIK REKANAN */}
                                    {currentMode === "Rekanan" && (
                                        <div className="space-y-4 animate-in fade-in duration-300">
                                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                                <span className="text-[8px] font-black px-2 py-0.5 bg-orange-500 text-white rounded uppercase tracking-wider">
                                                    TIPE: REKANAN
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        resetSlotToStandby(num)
                                                    }
                                                    type="button"
                                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
                                                <div className="space-y-1">
                                                    <label className="pl-1">
                                                        PO Mitra
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Nama PO"
                                                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="pl-1">
                                                        Plat Nomor
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="PLAT"
                                                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="pl-1">
                                                        Jumlah Seat
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Seat"
                                                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-left">
                                                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 pl-1">
                                                    Biaya Modal Mitra (Rp)
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue="0"
                                                    className="w-full p-2.5 bg-red-50 text-red-500 border border-red-100 rounded-xl outline-none font-black text-xs"
                                                />
                                                <span className="text-[8px] text-red-400 font-bold italic pl-1 block mt-0.5">
                                                    * Potensi Laba Bersih Slot:
                                                    Rp 8,000,000
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>{" "}
            {/* Akhir Boks Putih Atas */}
            {/* Panel Footer Hitam Gendut */}
            <div className="bg-slate-950 rounded-[2.5rem] p-6 flex items-center justify-between text-white shadow-xl shadow-slate-950/20">
                <div className="space-y-0.5">
                    <h4 className="text-base font-black tracking-tight leading-none italic">
                        Simpan Plotting
                    </h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        Data plotting akan tersimpan secara otomatis di sistem.
                    </p>
                </div>
                <button
                    onClick={() => alert("Plotting armada berhasil disimpan!")}
                    type="button"
                    className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 shadow-md"
                >
                    Selesai & Tutup
                </button>
            </div>
        </div>
    );
};

export default PlottingRight;
