export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

export interface Armada {
    id: string;
    name: string;
    type: string; // Bus, Elf, Mobil
    plateNumber: string;
    capacity: number;
    facilities: string[];
    status: "Ready" | "Perjalanan" | "Service";
}

export interface Crew {
    id: string;
    name: string;
    phone: string;
    role: "Driver" | "Helper";
    totalTrips: number;
    totalKm: number; // Jarak Tempuh (Km)
    status: "Ready" | "Bertugas";
    accountStatus: "Aktif" | "Tidak Aktif";
}

export interface Payment {
    id: string;
    amount: number;
    date: string;
    type: "DP" | "Cicilan" | "Pelunasan";
    note?: string;
    proofUrl?: string;
    proofStatus?: "Pending Review" | "Verified" | "Rejected";
}

export interface FleetRequirement {
    type: "Bus" | "Elf" | "Mobil";
    count: number;
}

export interface Order {
    id: string;
    customerName: string;
    whatsapp: string;
    customerAddress: string;
    departureTime: string; // Tanggal Pakai
    returnTime: string; // Tanggal Selesai
    dueDate?: string; // Batas Pelunasan (H-3)
    pickupAddress: string;
    pickupLink?: string; // Link Maps/Koordinat
    destination: string;
    route: string;
    distanceKm?: number; // Jarak Tempuh (Km)
    fleetRequirements: FleetRequirement[];
    status:
        | "Pending"
        | "Approved"
        | "Scheduled"
        | "On Trip"
        | "Completed"
        | "Cancelled";

    // Financial fields
    totalPrice: number; // Total Sewa
    downPayment: number; // Uang Muka (Initial)
    remainingBalance: number; // Sisa Piutang
    paymentHistory: Payment[]; // Riwayat Cicilan
    paymentProofUrl?: string; // Data URL or Image Link
    paymentProofStatus?: "Pending Review" | "Verified" | "Rejected";

    // Plotting Detail
    assignments: Assignment[];
    notes?: string;
}

export interface Assignment {
    id: string;
    orderId: string;
    armadaId: string | null; // Null if Rekanan
    crewId: string | null; // Driver (Sopir)
    helperId?: string | null; // Helper (Kondektur/Kru Pendamping)
    assetType: "Internal" | "Rekanan";
    poLuar?: string;
    platLuar?: string;
    costToPartner?: number; // Biaya sewa ke mitra
    seatsLuar?: number; // Jumlah seat armada rekanan
}

export interface AppState {
    armada: Armada[];
    crew: Crew[];
    orders: Order[];
}
