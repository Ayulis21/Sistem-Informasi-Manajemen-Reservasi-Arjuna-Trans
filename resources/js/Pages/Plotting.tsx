import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import PlottingLeft from "./PlottingComponents/PlottingLeft"; // Memanggil pecahan kiri
import PlottingRight from "./PlottingComponents/PlottingRight"; // Memanggil pecahan kanan

const staticState = {
    orders: [
        {
            id: "ORD1",
            customerName: "Keluarga Pak Jaka (Family Gathering)",
            destination: "KOTA BATU Malang",
            departureTime: "7/5/2026",
            returnTime: "7/6/2026",
            status: "Scheduled",
            fleetRequirements: [{ type: "Bus", count: 1 }],
            assignments: [{ id: "as-1", assetType: "Internal" }],
        },
        {
            id: "ORD2",
            customerName: "PT Maju Jaya Sentosa (Outing Kantor)",
            destination: "BANDUNG (LEMBANG & DUSUN BAMBU)",
            departureTime: "7/5/2026",
            returnTime: "7/6/2026",
            status: "Approved",
            fleetRequirements: [{ type: "Bus", count: 2 }],
            assignments: [],
        },
        {
            id: "ORD3",
            customerName: "Rombongan SMK Pariwisata Harapan",
            destination: "PANGANDARAN (PANTAI BARAT)",
            departureTime: "10/7/2026",
            returnTime: "12/7/2026",
            status: "Approved",
            fleetRequirements: [{ type: "Bus", count: 1 }],
            assignments: [{ id: "as-2", assetType: "Internal" }],
        },
    ],
};

const Plotting: React.FC = () => {
    const [orders, setOrders] = useState(staticState.orders);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
        "ORD2",
    );

    const selectedOrder = orders.find((o) => o.id === selectedOrderId);

    const handleAddAssignment = (
        orderId: string,
        assetType: "Internal" | "Rekanan",
    ) => {
        setOrders((prevOrders) =>
            prevOrders.map((o) => {
                if (o.id === orderId) {
                    const newAssignment = {
                        id: `as-${Date.now()}`,
                        assetType,
                        armadaId: "",
                        crewId: "",
                    };
                    return {
                        ...o,
                        assignments: [...o.assignments, newAssignment],
                    };
                }
                return o;
            }),
        );
    };

    const handleRemoveAssignment = (orderId: string, asId: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((o) => {
                if (o.id === orderId) {
                    return {
                        ...o,
                        assignments: o.assignments.filter(
                            (as) => as.id !== asId,
                        ),
                    };
                }
                return o;
            }),
        );
    };

    return (
        <AdminLayout>
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
                    <PlottingRight selectedOrder={selectedOrder} />
                </div>
            </div>
        </AdminLayout>
    );
};

export default Plotting;
