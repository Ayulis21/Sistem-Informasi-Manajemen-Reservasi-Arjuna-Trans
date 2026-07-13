import React, { useState, useEffect, useMemo } from "react";
import { MapPin, Bus, Users, Trash2, UserCheck } from "lucide-react";
import axios from "axios";

interface PlottingRightProps {
    selectedOrder: any;
    onAddAssignment: (
        orderId: string,
        assetType: "Internal" | "Rekanan",
        slotIndex: number,
    ) => void;
    onRemoveAssignment: (orderId: string, asId: string) => void;
    orders: any[];
    armada: any[];
    crew: any[];
    handleUpdateAssignment: (
        orderId: string,
        assignmentId: any,
        data: any,
    ) => void;
}

const PlottingRight: React.FC<PlottingRightProps> = ({
    selectedOrder,
    onAddAssignment,
    onRemoveAssignment,
    orders,
    armada,
    crew,
    handleUpdateAssignment,
}) => {
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

    const namaPelanggan: string =
        selectedOrder?.nama_pemesan ||
        selectedOrder?.customerName ||
        "Tidak Ada Pesanan Terpilih";
    const tujuanWisata: string =
        selectedOrder?.tujuan_main || selectedOrder?.destination || "-";
    const tipeUnitBus: string = selectedOrder?.tipe_unit_diminta || "Bus";

    // 1. Ambil data mentah
    const fleetReq = selectedOrder?.fleetRequirements || [];

    // 2. Bungkus semua perhitungan dalam useMemo (HANYA SATU BLOK INI)
    const { totalBusesNeeded, rowTypes, slotRows } = useMemo(() => {
        const types: string[] = [];
        let total = 0;

        if (Array.isArray(fleetReq) && fleetReq.length > 0) {
            fleetReq.forEach((req: any) => {
                const jumlah = Number(req.qty || 0);
                total += jumlah;
                for (let i = 0; i < jumlah; i++) {
                    types.push(req.tipe_armada || "ARMADA");
                }
            });
        }

        const finalTotal = total > 0 ? total : 1;
        const finalTypes = types.length > 0 ? types : ["ARMADA"];
        const rows = Array.from({ length: finalTotal }, (_, i) => i + 1);

        return {
            totalBusesNeeded: finalTotal,
            rowTypes: finalTypes,
            slotRows: rows,
        };
    }, [selectedOrder?.id_pesanan]);

    // 1. Deklarasi State (WAJIB ADA agar error 'Cannot find name' hilang)
    const [slotModes, setSlotModes] = useState<{
        [key: number]: "Standby" | "Internal" | "Rekanan";
    }>({});

    const [formValues, setFormValues] = useState<{
        [key: number]: {
            platLuar: null;
            poLuar: null;
            armadaId: string;
            driverId: string;
            driver2Id: string;
            helperId: string;
        };
    }>({});

    const handleSelectChange = (
        slotNum: number,
        field: string,
        value: string,
    ) => {
        setFormValues((prev) => ({
            ...prev,
            [slotNum]: { ...prev[slotNum], [field]: value },
        }));
    };

    useEffect(() => {
        if (
            selectedOrder?.assignments &&
            selectedOrder.assignments.length > 0
        ) {
            const initialModes: any = {};
            const initialValues: any = {};

            selectedOrder.assignments.forEach((as: any, index: number) => {
                const num = index + 1; // Slot 1, 2, 3...

                // 1. Tentukan mode (Internal / Rekanan)
                initialModes[num] =
                    as.jenis_aset === "internal" ? "Internal" : "Rekanan";

                // 2. Masukkan ID Bus, Sopir, dan Helper ke form
                initialValues[num] = {
                    armadaId: String(as.id_armada || ""),
                    driverId: String(as.id_driver || ""),
                    helperId: String(as.id_helper || ""),
                    poLuar: as.nama_po_mitra || "",
                    platLuar: as.plat_mitra || "",
                };
            });

            setSlotModes(initialModes);
            setFormValues(initialValues);
        } else {
            // Jika pesanan baru/belum di-plot, kosongkan form
            setSlotModes({});
            setFormValues({});
        }
    }, [selectedOrder?.id_pesanan, selectedOrder?.assignments]);

    // 3. Fungsi Helper untuk mengubah mode per slot (Internal / Rekanan)
    const setTypeForSlot = (slotNum: number, mode: "Internal" | "Rekanan") => {
        setSlotModes((prev: any) => ({ ...prev, [slotNum]: mode }));
    };

    const resetSlotToStandby = (slotNum: number) => {
        setSlotModes((prev: any) => ({ ...prev, [slotNum]: "Standby" }));
    };
    const [isOpenModalInternal, setIsOpenModalInternal] =
        useState<boolean>(false);
    const [slotAktifDiPlot, setSlotAktifDiPlot] = useState<number | null>(null);
    const [formPlotLokal, setFormPlotLokal] = useState({
        armadaId: "",
        driverId: "",
        coDriverId: "",
    });
    // 🎯 KUNCI: isFilled bernilai TRUE hanya jika tugas sudah sama dengan kebutuhan

    // Hitung berapa banyak slot yang sudah diisi (BUKAN Standby)
    const filledSlotsCount = Object.values(slotModes).filter(
        (mode) => mode !== "Standby",
    ).length;

    // Hitung persentase untuk lebar garis biru (misal: 1/2 = 50%)
    const progressPercentage =
        totalBusesNeeded > 0 ? (filledSlotsCount / totalBusesNeeded) * 100 : 0;

    const handleSavePlotting = async () => {
        try {
            // 1. Kumpulkan data dari formValues dan slotModes
            const assignments = slotRows
                .map((num) => ({
                    slot: num,
                    mode: slotModes[num] || "Standby",
                    armadaId: formValues[num]?.armadaId || null,
                    driverId: formValues[num]?.driverId || null,
                    helperId: formValues[num]?.helperId || null,
                    // Jika rekanan (opsional)
                    poLuar: formValues[num]?.poLuar || null,
                    platLuar: formValues[num]?.platLuar || null,
                }))
                .filter((a) => a.mode !== "Standby"); // Hanya kirim yang sudah di-plot

            if (assignments.length === 0) {
                alert("❌ Gagal: Belum ada armada yang di-plot!");
                return;
            }

            // 2. Kirim ke Backend Laravel
            const response = await axios.post("/api/admin/plotting/save", {
                id_pesanan: selectedOrder.id_pesanan,
                assignments: assignments,
            });

            alert("✨ SUKSES: Data plotting berhasil disimpan!");
            window.location.reload(); // 🎯 Refresh halaman agar angka di kiri berubah
        } catch (error) {
            console.error(error);
            alert("❌ Gagal menyimpan data ke database.");
        }
    };

    const isAssetBusy = (
        assetId: string,
        type: "id_armada" | "id_driver" | "id_helper",
    ) => {
        if (!assetId || !selectedOrder || !Array.isArray(orders)) return false;

        // 🎯 UPDATE: Jeda Istirahat Minimal 8 Jam (Standar Keselamatan)
        // 8 jam * 60 menit * 60 detik * 1000 milidetik
        const JEDA_MS = 8 * 60 * 60 * 1000;

        // Kita berikan toleransi 8 jam sebelum berangkat dan 8 jam setelah pulang
        const startCurrent =
            new Date(selectedOrder.tgl_berangkat).getTime() - JEDA_MS;
        const endCurrent =
            new Date(selectedOrder.tgl_selesai).getTime() + JEDA_MS;

        return orders.some((order) => {
            if (order.id_pesanan === selectedOrder.id_pesanan) return false;
            if (order.status_pesanan === "Batal") return false;

            const startOther = new Date(order.tgl_berangkat).getTime();
            const endOther = new Date(order.tgl_selesai).getTime();

            // Jika jadwal pesanan lain masuk ke dalam zona "Jadwal Tugas + Jeda 8 Jam"
            const isOverlapping =
                startCurrent <= endOther && endCurrent >= startOther;

            if (isOverlapping) {
                // Cek apakah kru/armada tersebut sedang bertugas di pesanan tersebut
                return order.assignments?.some(
                    (as: any) =>
                        String(as.id_armada) === String(assetId) ||
                        String(as.id_driver) === String(assetId) ||
                        String(as.id_helper) === String(assetId),
                );
            }
            return false;
        });
    };

    const sortedCrew = useMemo(() => {
        return [...crew].sort((a, b) => {
            // --- 1. Saring yang READY & AKTIF dulu agar selalu di atas (Opsional jika sudah difilter di map) ---

            // --- 2. KRITERIA UTAMA: Jarak Tempuh (KM) Terendah ---
            if (Number(a.total_km) !== Number(b.total_km)) {
                return Number(a.total_km) - Number(b.total_km);
            }

            // --- 3. KRITERIA KEDUA (TIE-BREAKER): Tanggal Terakhir Jalan ---
            // Jika KM sama, yang terakhir jalannya paling lama (atau belum pernah jalan) diletakkan di atas.
            const dateA = a.last_trip_date
                ? new Date(a.last_trip_date).getTime()
                : 0;
            const dateB = b.last_trip_date
                ? new Date(b.last_trip_date).getTime()
                : 0;

            return dateA - dateB; // Tanggal yang lebih lama (angka lebih kecil) akan naik ke atas
        });
    }, [crew]);

    return (
        <div className="space-y-4 text-left">
            {/* --- HEADER SECTION COMPACT --- */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                            {namaPelanggan}
                        </h2>

                        <div className="flex items-center gap-x-3 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                            <span className="flex items-center gap-1">
                                <MapPin size={12} className="text-slate-300" />
                                {tujuanWisata}
                            </span>
                            <span className="text-slate-200">|</span>
                            <span className="text-indigo-600 font-black">
                                {selectedOrder?.tgl_berangkat?.substring(0, 10)}{" "}
                                - {selectedOrder?.tgl_selesai?.substring(0, 10)}
                            </span>
                        </div>

                        <div className="pt-1">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black bg-indigo-50 text-[#5346F1] uppercase tracking-widest border border-indigo-100">
                                MUST PLOT: {totalBusesNeeded} UNIT
                            </span>
                        </div>
                    </div>
                </div>

                {/* PROGRESS BAR COMPACT */}
                <div className="space-y-2 pt-2 border-t border-slate-50">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-[#5346F1] h-full transition-all duration-700 ease-in-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        PROGRESS: {filledSlotsCount} / {totalBusesNeeded} UNIT
                    </p>
                </div>
            </div>

            {/* 2. DAFTAR SLOT PLOTTING DINAMIS */}
            <div className="space-y-4">
                {slotRows.map((num, idx) => {
                    // Tipe target untuk baris ini (misal: "Big Bus" atau "Elf")
                    const targetType = rowTypes[idx] || "ARMADA";

                    // State mode lokal (Standby, Internal, atau Rekanan)
                    const currentMode = slotModes[num] || "Standby";

                    return (
                        <div
                            key={`slot-${selectedOrder.id_pesanan}-${num}`}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">
                                        {num}
                                    </div>

                                    {currentMode === "Standby" ? (
                                        <div className="flex flex-col">
                                            {/* 🎯 DINAMIS: BUTUH: ELF / BUTUH: BIG BUS */}
                                            <span className="text-[12px] font-black text-red-500 uppercase">
                                                BUTUH: {targetType}
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest italic leading-none">
                                                Slot Belum Terisi
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">
                                                Tipe: {targetType}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest w-fit text-white ${
                                                    currentMode === "Internal"
                                                        ? "bg-indigo-600"
                                                        : "bg-amber-500"
                                                }`}
                                            >
                                                {currentMode}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {currentMode !== "Standby" && (
                                    <button
                                        onClick={() => resetSlotToStandby(num)}
                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            {currentMode === "Standby" ? (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() =>
                                            setTypeForSlot(num, "Internal")
                                        }
                                        className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-xl text-[10px] font-black uppercase border border-dashed border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
                                    >
                                        Plot Armada Int
                                    </button>
                                    <button
                                        onClick={() =>
                                            setTypeForSlot(num, "Rekanan")
                                        }
                                        className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-xl text-[10px] font-black uppercase border border-dashed border-slate-200 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer"
                                    >
                                        Plot Rekanan
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {currentMode === "Internal" ? (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center">
                                                    <Bus
                                                        size={12}
                                                        className="mr-1"
                                                    />{" "}
                                                    Pilih Armada
                                                </label>
                                                <select
                                                    value={
                                                        formValues[num]
                                                            ?.armadaId || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleSelectChange(
                                                            num,
                                                            "armadaId",
                                                            e.target.value,
                                                        )
                                                    }
                                                    /* 🎯 Desain tetap 100% milik Anda */
                                                    className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                                                >
                                                    <option value="">
                                                        -- Pilih Armada --
                                                    </option>
                                                    {armada
                                                        .filter(
                                                            (b) =>
                                                                b.tipe_armada ===
                                                                targetType,
                                                        )
                                                        .map((b) => {
                                                            // 1. 🎯 BENTROK LOKAL (Slot 1 vs Slot 2 di pesanan yang sama)
                                                            const isBusTaken =
                                                                Object.entries(
                                                                    formValues,
                                                                ).some(
                                                                    ([
                                                                        slotIdx,
                                                                        val,
                                                                    ]) =>
                                                                        val.armadaId ===
                                                                            String(
                                                                                b.id_armada,
                                                                            ) &&
                                                                        Number(
                                                                            slotIdx,
                                                                        ) !==
                                                                            num,
                                                                );

                                                            // 2. 🎯 BENTROK GLOBAL (Cek pesanan lain di tanggal yang sama)
                                                            // Fungsi isAssetBusy harus sudah ada di atas return
                                                            const isGlobalBusy =
                                                                isAssetBusy(
                                                                    String(
                                                                        b.id_armada,
                                                                    ),
                                                                    "id_armada",
                                                                );

                                                            return (
                                                                <option
                                                                    key={
                                                                        b.id_armada
                                                                    }
                                                                    value={
                                                                        b.id_armada
                                                                    }
                                                                    /* 🎯 Gabungkan kedua validasi */
                                                                    disabled={
                                                                        isBusTaken ||
                                                                        isGlobalBusy
                                                                    }
                                                                >
                                                                    {
                                                                        b.nama_armada
                                                                    }{" "}
                                                                    ({b.nopol})
                                                                    {isBusTaken
                                                                        ? " (DIPILIH DI SLOT LAIN)"
                                                                        : isGlobalBusy
                                                                          ? " (JADWAL BENTROK)"
                                                                          : " - TERSEDIA"}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center">
                                                        <Users
                                                            size={12}
                                                            className="mr-1"
                                                        />{" "}
                                                        Sopir
                                                    </label>
                                                </div>

                                                <div className="space-y-1.5">
                                                    {/* DROPDOWN SOPIR 1 */}
                                                    <select
                                                        value={
                                                            formValues[num]
                                                                ?.driverId || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleSelectChange(
                                                                num,
                                                                "driverId",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                                                    >
                                                        <option value="">
                                                            -- Pilih Sopir --
                                                        </option>
                                                        {sortedCrew
                                                            ?.filter(
                                                                (c: any) =>
                                                                    c.peran ===
                                                                        "Driver" &&
                                                                    c.status ===
                                                                        "Aktif" &&
                                                                    c.status_ketersediaan ===
                                                                        "Ready",
                                                            )
                                                            .map(
                                                                (
                                                                    c: any,
                                                                    idx: number,
                                                                ) => {
                                                                    const isGlobal =
                                                                        isAssetBusy(
                                                                            String(
                                                                                c.id_kru,
                                                                            ),
                                                                            "id_driver",
                                                                        );
                                                                    const isLocal =
                                                                        Object.entries(
                                                                            formValues,
                                                                        ).some(
                                                                            ([
                                                                                sIdx,
                                                                                val,
                                                                            ]) =>
                                                                                (val.driverId ===
                                                                                    String(
                                                                                        c.id_kru,
                                                                                    ) ||
                                                                                    val.driver2Id ===
                                                                                        String(
                                                                                            c.id_kru,
                                                                                        )) &&
                                                                                Number(
                                                                                    sIdx,
                                                                                ) !==
                                                                                    num,
                                                                        );

                                                                    const isRecommended =
                                                                        idx <
                                                                            3 &&
                                                                        !isGlobal &&
                                                                        !isLocal;

                                                                    const isNotAvailable =
                                                                        c.status_ketersediaan ===
                                                                            "Bertugas" ||
                                                                        c.status_ketersediaan ===
                                                                            "Cuti";

                                                                    return (
                                                                        <option
                                                                            key={
                                                                                c.id_kru
                                                                            }
                                                                            value={
                                                                                c.id_kru
                                                                            }
                                                                            disabled={
                                                                                isGlobal ||
                                                                                isLocal ||
                                                                                c.status_ketersediaan ===
                                                                                    "Bertugas"
                                                                            }
                                                                        >
                                                                            {isRecommended
                                                                                ? ""
                                                                                : ""}
                                                                            {
                                                                                c.nama_kru
                                                                            }{" "}
                                                                            |{" "}
                                                                            {Number(
                                                                                c.total_km ||
                                                                                    0,
                                                                            ).toLocaleString()}{" "}
                                                                            KM
                                                                            {isGlobal
                                                                                ? " (BENTROK)"
                                                                                : isLocal
                                                                                  ? " (DIPILIH)"
                                                                                  : ""}
                                                                        </option>
                                                                    );
                                                                },
                                                            )}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1">
                                                    <UserCheck
                                                        size={10}
                                                        className="text-emerald-500"
                                                    />{" "}
                                                    Helper
                                                </label>
                                                <select
                                                    value={
                                                        formValues[num]
                                                            ?.helperId || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleSelectChange(
                                                            num,
                                                            "helperId",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                                                >
                                                    <option value="">
                                                        -- Tanpa Helper --
                                                    </option>
                                                    {sortedCrew
                                                        /* 1. Saring: Hanya Helper, yang berstatus Aktif, dan sedang Ready */
                                                        ?.filter(
                                                            (c: any) =>
                                                                c.peran ===
                                                                    "Helper" &&
                                                                c.status ===
                                                                    "Aktif" &&
                                                                c.status_ketersediaan ===
                                                                    "Ready",
                                                        )
                                                        .map(
                                                            (
                                                                c: any,
                                                                idx: number,
                                                            ) => {
                                                                // 2. Cek Bentrok Global (Jadwal di pesanan lain + Jeda 8 jam)
                                                                const isGlobal =
                                                                    isAssetBusy(
                                                                        String(
                                                                            c.id_kru,
                                                                        ),
                                                                        "id_helper",
                                                                    );

                                                                // 3. Cek Bentrok Lokal (Sudah dipilih di slot/bus lain pada pesanan ini)
                                                                const isLocal =
                                                                    Object.entries(
                                                                        formValues,
                                                                    ).some(
                                                                        ([
                                                                            sIdx,
                                                                            val,
                                                                        ]) =>
                                                                            (val.driverId ===
                                                                                String(
                                                                                    c.id_kru,
                                                                                ) ||
                                                                                val.helperId ===
                                                                                    String(
                                                                                        c.id_kru,
                                                                                    )) &&
                                                                            Number(
                                                                                sIdx,
                                                                            ) !==
                                                                                num,
                                                                    );

                                                                // 4. Anti-Merangkap: Cek apakah orang ini sudah dipilih jadi Sopir di bus yang sama
                                                                const isAlreadyDriver1 =
                                                                    formValues[
                                                                        num
                                                                    ]
                                                                        ?.driverId ===
                                                                    String(
                                                                        c.id_kru,
                                                                    );

                                                                // 5. 🎯 LOGIKA REKOMENDASI HELPER (KM Terendah & Tersedia)
                                                                const isRecommended =
                                                                    idx < 3 &&
                                                                    !isGlobal &&
                                                                    !isLocal &&
                                                                    !isAlreadyDriver1;

                                                                return (
                                                                    <option
                                                                        key={
                                                                            c.id_kru
                                                                        }
                                                                        value={
                                                                            c.id_kru
                                                                        }
                                                                        disabled={
                                                                            isGlobal ||
                                                                            isLocal ||
                                                                            isAlreadyDriver1
                                                                        }
                                                                    >
                                                                        {/* 🎯 TAMPILAN BERSIH: ⭐ Nama | KM (Tanpa tulisan status) */}
                                                                        {isRecommended
                                                                            ? " "
                                                                            : ""}
                                                                        {
                                                                            c.nama_kru
                                                                        }{" "}
                                                                        |{" "}
                                                                        {Number(
                                                                            c.total_km ||
                                                                                0,
                                                                        ).toLocaleString()}{" "}
                                                                        KM
                                                                        {isGlobal
                                                                            ? " (BENTROK)"
                                                                            : isLocal ||
                                                                                isAlreadyDriver1
                                                                              ? " (DIPILIH)"
                                                                              : ""}
                                                                    </option>
                                                                );
                                                            },
                                                        )}
                                                </select>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-1 md:col-span-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-slate-400">
                                                        PO Mitra
                                                    </label>
                                                    <input
                                                        className="w-full bg-amber-50/30 border border-amber-100 px-4 py-3 rounded-xl text-sm font-bold outline-none"
                                                        placeholder="Nama PO"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-slate-400">
                                                        Plat Nomor
                                                    </label>
                                                    <input
                                                        className="w-full bg-amber-50/30 border border-amber-100 px-4 py-3 rounded-xl text-sm font-bold uppercase outline-none"
                                                        placeholder="Plat"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-slate-400">
                                                        Jumlah Seat
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-amber-50/30 border border-amber-100 px-4 py-3 rounded-xl text-sm font-bold outline-none"
                                                        placeholder="Seat"
                                                    />
                                                </div>
                                                <div className="space-y-1 col-span-1 md:col-span-3">
                                                    <label className="text-[10px] font-black uppercase text-slate-400">
                                                        Biaya Modal Mitra (Rp)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-xl text-sm font-black outline-none"
                                                        placeholder="0"
                                                    />
                                                    <p className="text-[8px] text-red-400 font-bold italic mt-1 leading-none">
                                                        * Potensi Laba Bersih
                                                        Slot: Rp{" "}
                                                        {(
                                                            Number(
                                                                selectedOrder.harga_sewa ||
                                                                    0,
                                                            ) / totalBusesNeeded
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 3. FOOTER ACTION */}
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
                    onClick={handleSavePlotting} // 🎯 Panggil fungsi axios di atas
                    className="bg-white text-slate-900 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer"
                >
                    Selesai & Simpan Plotting
                </button>
            </div>
        </div>
    );
};

export default PlottingRight;
