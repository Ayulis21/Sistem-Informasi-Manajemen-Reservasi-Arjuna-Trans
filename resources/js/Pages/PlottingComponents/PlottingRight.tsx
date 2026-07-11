import React, { useState, useEffect } from "react";
import { MapPin, Bus, Users, Trash2, UserCheck } from "lucide-react";

interface PlottingRightProps {
    selectedOrder: any;
    onAddAssignment: (
        orderId: string,
        assetType: "Internal" | "Rekanan",
        slotIndex: number,
    ) => void;
    handleUpdateAssignment: (
        orderId: string,
        assignmentId: any,
        data: any,
    ) => void;
    onRemoveAssignment: (orderId: string, asId: string) => void;
    armada: any[];
    crew: any[];
}

const PlottingRight: React.FC<PlottingRightProps> = ({
    selectedOrder,
    onAddAssignment,
    onRemoveAssignment,
    armada,
    crew,
    handleUpdateAssignment,
}) => {
    if (!selectedOrder || (!selectedOrder.id_pesanan && !selectedOrder.id)) {
        return (
            <div className="h-full min-h-[400px] bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 space-y-4 text-center p-6">
                <svg
                    xmlns="http://w3.org"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user-check opacity-20 text-indigo-600"
                >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="m16 11 2 2 4-4" />
                </svg>
                <p className="font-bold italic text-sm text-slate-400">
                    Pilih pesanan di sebelah kiri untuk mulai plotting.
                </p>
            </div>
        );
    }

    const namaPelanggan: string =
        selectedOrder.nama_pemesan ||
        selectedOrder.customerName ||
        "Tanpa Nama";
    const tujuanWisata: string =
        selectedOrder?.tujuan_main || selectedOrder?.destination || "-";
    const tipeUnitBus: string = selectedOrder?.tipe_unit_diminta || "Bus";

    // Menghitung total kebutuhan unit bus secara akurat dari database riil Anda
    const totalBusesNeeded = Number(
        selectedOrder?.jumlah_unit_diminta ||
            selectedOrder?.fleetRequirements?.reduce(
                (sum: number, r: any) => sum + r.count,
                0,
            ) ||
            0,
    );

    const slotRows = Array.from(
        { length: totalBusesNeeded },
        (_, index) => index + 1,
    );

    const [slotModes, setSlotModes] = useState<{
        [key: number]: "Standby" | "Internal" | "Rekanan";
    }>({});

    useEffect(() => {
        setSlotModes({});
    }, [selectedOrder.id_pesanan || selectedOrder.id]);

    const setTypeForSlot = (slotNum: number, mode: "Internal" | "Rekanan") => {
        setSlotModes((prev) => ({ ...prev, [slotNum]: mode }));
    };

    const resetSlotToStandby = (slotNum: number) => {
        setSlotModes((prev) => ({ ...prev, [slotNum]: "Standby" }));
    };
    const [isOpenModalInternal, setIsOpenModalInternal] =
        useState<boolean>(false);
    const [slotAktifDiPlot, setSlotAktifDiPlot] = useState<number | null>(null);
    const [formPlotLokal, setFormPlotLokal] = useState({
        armadaId: "",
        driver1Id: "",
        driver2Id: "",
        coDriverId: "",
    });
    return (
        <div className="space-y-6 text-left">
            {/* <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6"> */}
            <div className="bg-white p-5 pb-3 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between gap-1.5">
                <div className="space-y-0.5">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                        {namaPelanggan}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-black uppercase tracking-widest text-slate-400 pt-0.5 leading-none">
                        <span className="flex items-center">
                            📍 {tujuanWisata}
                        </span>
                        <span className="text-indigo-600">
                            📅{" "}
                            {selectedOrder?.tgl_berangkat ||
                                selectedOrder?.departureTime}{" "}
                            -{" "}
                            {selectedOrder?.tgl_kembali ||
                                selectedOrder?.returnTime}
                        </span>
                    </div>

                    <div className="pt-1 leading-none">
                        <span className="inline-block text-[8px] font-black text-[#5346F1] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md tracking-wider uppercase leading-none">
                            MUST PLOT: {totalBusesNeeded} Armada
                        </span>
                    </div>
                    <div className="pt-3 space-y-1.5 w-full">
                        {/* Garis progress bar ungu bawaan asli layout laptop Anda */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-[#5346F1] h-full rounded-full transition-all duration-300"
                                style={{ width: "100%" }}
                            ></div>
                        </div>
                        {/* Teks abu-asli operasional Anda */}
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">
                            KEBUTUHAN: {totalBusesNeeded} DARI{" "}
                            {totalBusesNeeded} UNIT TERPENUHI
                        </p>
                    </div>
                </div>
            </div>
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
                                                type="button"
                                                onClick={() =>
                                                    setTypeForSlot(
                                                        num,
                                                        "Internal",
                                                    )
                                                }
                                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                                            >
                                                PLOT ARMADA INT
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setTypeForSlot(
                                                        num,
                                                        "Rekanan",
                                                    )
                                                }
                                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                                            >
                                                Plot Rekanan
                                            </button>
                                        </div>
                                    </>
                                )}
                                {/* ========================================================================= */}
                                {/* 🎯 KUNCI PARIPURNA: KEPALA SLOT INTERNAL ULTRA-RAPAT SESUAI CONTOH (0 ERR)  */}
                                {/* ========================================================================= */}
                                {currentMode === "Internal" && (
                                    <div className="w-full mt-2 animate-in fade-in duration-200 text-left col-span-2 space-y-4">
                                        {/* Baris Kepala Sejajar Sehat dengan Tombol Sampah */}
                                        <div className="flex items-center justify-between">
                                            {/* 🚀 FIX MUTLAK: Tumpukan mini ultra-rapat di sebelah kanan nomor slot */}
                                            <div className="flex flex-col gap-0 text-left items-start leading-none">
                                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-0.5 leading-none block">
                                                    TIPE: {tipeUnitBus}
                                                </span>
                                                <span className="inline-block text-[8px] font-black text-white bg-[#5346F1] px-1.5 py-0.5 rounded uppercase tracking-widest leading-none">
                                                    INTERNAL
                                                </span>
                                            </div>

                                            {/* Tombol Sampah Abu-Abu Bawaan Asli Laptop Anda */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    resetSlotToStandby(num)
                                                }
                                                className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 cursor-pointer flex items-center justify-center"
                                                title="Hapus Slot"
                                            >
                                                <svg
                                                    xmlns="http://w3.org"
                                                    width="13"
                                                    height="13"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-trash-2"
                                                >
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    <line
                                                        x1="10"
                                                        x2="10"
                                                        y1="11"
                                                        y2="17"
                                                    />
                                                    <line
                                                        x1="14"
                                                        x2="14"
                                                        y1="11"
                                                        y2="17"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Baris 3 Dropdown Mewah Bawaan Asli Laptop Anda */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* A. SELEKTOR PILIH BUS MEWAH ASLI ANDA */}
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center">
                                                    <Bus
                                                        size={12}
                                                        className="mr-1"
                                                    />{" "}
                                                    Pilih Bus
                                                </label>
                                                <select
                                                    id={`select-armada-${num}`}
                                                    className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                                    onChange={(e) => {
                                                        if (
                                                            e.target.value &&
                                                            onAddAssignment
                                                        ) {
                                                            onAddAssignment(
                                                                selectedOrder.id_pesanan ||
                                                                    selectedOrder.id,
                                                                "Internal",
                                                                num,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <option value="">
                                                        -- Pilih Armada --
                                                    </option>
                                                    {armada?.map((b: any) => (
                                                        <option
                                                            key={
                                                                b.id ||
                                                                b.id_armada
                                                            }
                                                            value={
                                                                b.id ||
                                                                b.id_armada
                                                            }
                                                        >
                                                            {b.name ||
                                                                b.nama_bus}{" "}
                                                            (
                                                            {b.plateNumber ||
                                                                b.no_plat}
                                                            )
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* B. SELEKTOR SOPIR / DRIVER */}
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center">
                                                    <Users
                                                        size={12}
                                                        className="mr-1"
                                                    />{" "}
                                                    Sopir (Driver)
                                                </label>
                                                <select
                                                    id={`select-crew-${num}`}
                                                    className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                                >
                                                    <option value="">
                                                        -- Pilih Sopir --
                                                    </option>
                                                    {crew
                                                        ?.filter((c: any) =>
                                                            String(
                                                                c.role ||
                                                                    c.jabatan ||
                                                                    "",
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    "sopir",
                                                                ),
                                                        )
                                                        ?.map((c: any) => (
                                                            <option
                                                                key={
                                                                    c.id ||
                                                                    c.id_karyawan
                                                                }
                                                                value={
                                                                    c.id ||
                                                                    c.id_karyawan
                                                                }
                                                            >
                                                                {c.name ||
                                                                    c.nama}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>

                                            {/* C. SELEKTOR KONDEKTUR / HELPER */}
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center">
                                                    <UserCheck
                                                        size={12}
                                                        className="mr-1 text-emerald-500"
                                                    />{" "}
                                                    Kondektur / Helper
                                                </label>
                                                <select
                                                    id={`select-helper-${num}`}
                                                    className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                                >
                                                    <option value="">
                                                        -- Tanpa Helper --
                                                    </option>
                                                    {crew
                                                        ?.filter((c: any) =>
                                                            String(
                                                                c.role ||
                                                                    c.jabatan ||
                                                                    "",
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    "kernet",
                                                                ),
                                                        )
                                                        ?.map((c: any) => (
                                                            <option
                                                                key={
                                                                    c.id ||
                                                                    c.id_karyawan
                                                                }
                                                                value={
                                                                    c.id ||
                                                                    c.id_karyawan
                                                                }
                                                            >
                                                                {c.name ||
                                                                    c.nama}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* ========================================================================= */}
                                {/* 🎯 KUNCI PARIPURNA: KEPALA SLOT REKANAN ULTRA-RAPAT SESUAI CONTOH (0 ERR)   */}
                                {/* ========================================================================= */}
                                {currentMode === "Rekanan" && (
                                    <div className="w-full mt-2 animate-in fade-in duration-200 text-left col-span-2 space-y-4">
                                        {/* Baris Kepala Sejajar Sehat dengan Tombol Sampah */}
                                        <div className="flex items-center justify-between">
                                            {/* 🚀 FIX MUTLAK: Tumpukan mini ultra-rapat di sebelah kanan nomor slot */}
                                            <div className="flex flex-col gap-0 text-left items-start leading-none">
                                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-0.5 leading-none block">
                                                    TIPE: {tipeUnitBus}
                                                </span>
                                                <span className="inline-block text-[8px] font-black text-white bg-orange-500 px-1.5 py-0.5 rounded uppercase tracking-widest leading-none">
                                                    REKANAN
                                                </span>
                                            </div>

                                            {/* Tombol Sampah Abu-Abu Bawaan Asli Laptop Anda */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    resetSlotToStandby(num)
                                                }
                                                className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 cursor-pointer flex items-center justify-center"
                                                title="Hapus Slot"
                                            >
                                                <svg
                                                    xmlns="http://w3.org"
                                                    width="13"
                                                    height="13"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-trash-2"
                                                >
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    <line
                                                        x1="10"
                                                        x2="10"
                                                        y1="11"
                                                        y2="17"
                                                    />
                                                    <line
                                                        x1="14"
                                                        x2="14"
                                                        y1="11"
                                                        y2="17"
                                                    />
                                                </svg>
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
                                                * Potensi Laba Bersih Slot: Rp
                                                8,000,000
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* </div>{" "} */}
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
