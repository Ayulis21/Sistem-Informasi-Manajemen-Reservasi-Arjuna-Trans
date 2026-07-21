import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import PlottingLeft from "./PlottingComponents/PlottingLeft";
import PlottingRight from "./PlottingComponents/PlottingRight";

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
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
        urlIdPesanan || null,
    );

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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4">
                    <PlottingLeft
                        orders={orders}
                        selectedOrderId={selectedOrderId}
                        setSelectedOrderId={setSelectedOrderId}
                    />
                </div>

                <div className="lg:col-span-8">
                    <PlottingRight
                        key={selectedOrderId}
                        selectedOrder={selectedOrder}
                        onAddAssignment={handleAddAssignment}
                        onRemoveAssignment={handleRemoveAssignment}
                        handleUpdateAssignment={handleUpdateAssignment}
                        armada={armada}
                        crew={crew}
                        orders={orders}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default Plotting;
