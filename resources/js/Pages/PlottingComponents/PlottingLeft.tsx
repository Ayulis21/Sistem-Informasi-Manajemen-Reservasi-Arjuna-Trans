import React from "react";
import { Calendar, ChevronRight } from "lucide-react";

interface PlottingLeftProps {
    orders: any[];
    selectedOrderId: string | null;
    setSelectedOrderId: (id: string) => void;
}

const PlottingLeft: React.FC<PlottingLeftProps> = ({
    orders,
    selectedOrderId,
    setSelectedOrderId,
}) => {
    return (
        <div
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
            id="plotting-orders-list-card"
        >
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center mb-4">
                <Calendar size={18} className="mr-2 text-indigo-600" />
                Antrean Plotting
            </h3>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {orders.length === 0 ? (
                    <div className="text-center py-10 opacity-40 italic text-xs">
                        Belum ada pesanan disetujui.
                    </div>
                ) : (
                    orders.map((o) => {
                        const totalReq =
                            o.fleetRequirements?.reduce(
                                (s: number, r: any) => s + r.count,
                                0,
                            ) || 0;
                        const isFilled = o.assignments?.length >= totalReq;
                        return (
                            <button
                                key={o.id}
                                onClick={() => setSelectedOrderId(o.id)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                    selectedOrderId === o.id
                                        ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100/30 -translate-y-1"
                                        : "bg-white border-slate-100 hover:border-indigo-300"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div
                                        className={`text-[8px] font-black uppercase tracking-widest ${selectedOrderId === o.id ? "text-indigo-200" : "text-slate-400"}`}
                                    >
                                        {o.id}
                                    </div>
                                    {o.status === "Scheduled" && (
                                        <div className="bg-emerald-400 text-[6px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-widest">
                                            PLOTTED
                                        </div>
                                    )}
                                </div>
                                <p
                                    className={`font-black tracking-tight ${selectedOrderId === o.id ? "text-white" : "text-slate-800"}`}
                                >
                                    {o.customerName}
                                </p>
                                <div className="flex justify-between items-center mt-3">
                                    <div
                                        className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${isFilled ? "bg-emerald-400 text-white" : "bg-red-400 text-white"}`}
                                    >
                                        {o.assignments?.length || 0} /{" "}
                                        {totalReq} Unit
                                    </div>
                                    <ChevronRight
                                        size={14}
                                        className={
                                            selectedOrderId === o.id
                                                ? "text-white"
                                                : "text-slate-200"
                                        }
                                    />
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PlottingLeft;
