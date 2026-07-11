import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import PlottingLeft from "./PlottingComponents/PlottingLeft"; // Memanggil pecahan kiri bawaan asli Anda
import PlottingRight from "./PlottingComponents/PlottingRight"; // Memanggil pecahan kanan bawaan asli Anda

interface PlottingProps {
    orders: any[];
    armada: any[];
    crew: any[];
    urlIdPesanan?: string | null;
}

const Plotting: React.FC<PlottingProps> = ({
    orders = [],
    armada = [],
    crew = [],
    urlIdPesanan = null,
}) => {
    // 🎯 KUNCI REKONSILIASI STATE ID: AWALAN WAJIB NULL AGAR LAYAR DEPAN KANAN KOSONG BERSIH
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
        urlIdPesanan || null,
    );

    // Mengendus data objek pesanan aktif dari database berdasarkan ID secara dinamis
    const selectedOrder = orders.find(
        (o: any) =>
            String(o.id_pesanan || o.id).trim() ===
            String(selectedOrderId).trim(),
    );

    const handleAddAssignment = (
        orderId: string,
        assetType: "Internal" | "Rekanan",
        slotIndex: number,
    ) => {
        console.log(
            `Plotting trigger: ${orderId}, ${assetType}, Slot ${slotIndex}`,
        );
    };

    // 🚀 SUNTIKAN FUNGSI PENYELAMAT ANTI-BLANK SECARA LEGAL:
    const handleUpdateAssignment = (
        orderId: string,
        assignmentId: any,
        data: any,
    ) => {
        console.log(
            "Update assignment dinamis dipicu:",
            orderId,
            assignmentId,
            data,
        );
    };

    const handleRemoveAssignment = (orderId: string, asId: string) => {
        console.log(`Remove assignment trigger: ${orderId}, ${asId}`);
    };

    return (
        <AdminLayout>
            {/* 🚀 ARSITEKTUR LAYOUT GRID ASLI ANDA DIKUNCI MATI 100% TIDAK DIUBAH SEUJUNG KUKU PUN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 1. RENDER PECAHAN KIRI (COSPAN 4) */}
                <div className="lg:col-span-4">
                    <PlottingLeft
                        orders={orders}
                        selectedOrderId={selectedOrderId}
                        setSelectedOrderId={setSelectedOrderId}
                    />
                </div>

                {/* 2. RENDER PECAHAN KANAN (COSPAN 8) */}
                <div className="lg:col-span-8">
                    <PlottingRight
                        selectedOrder={selectedOrder}
                        onAddAssignment={handleAddAssignment}
                        onRemoveAssignment={handleRemoveAssignment}
                        handleUpdateAssignment={handleUpdateAssignment}
                        armada={armada}
                        crew={crew}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default Plotting;
