import { Armada, Crew, Order } from './types';

export const MOCK_ARMADA: Armada[] = [
  { id: 'arm1', name: 'Jetbus 5 Plus Super High Deck', type: 'Bus', plateNumber: 'B 7001 TGC', capacity: 50, facilities: ['AC', 'TV', 'Karaoke', 'USB Charger'], status: 'Ready' },
  { id: 'arm2', name: 'Jetbus 3 HDD Executive', type: 'Bus', plateNumber: 'B 7821 UUI', capacity: 45, facilities: ['AC', 'TV', 'Toilet', 'Coolbox'], status: 'Ready' },
  { id: 'arm3', name: 'Hiace Premio Luxury', type: 'Mobil', plateNumber: 'B 1234 ABC', capacity: 14, facilities: ['AC', 'TV', 'Captain Seat'], status: 'Perjalanan' },
  { id: 'arm4', name: 'Elf Long NLR Coaster', type: 'Elf', plateNumber: 'B 5678 DEF', capacity: 19, facilities: ['AC', 'Reclining Seat'], status: 'Ready' },
  { id: 'arm5', name: 'Avante H8 Double Glass', type: 'Bus', plateNumber: 'B 9012 GHI', capacity: 50, facilities: ['AC', 'TV', 'Legrest', 'Dispenser'], status: 'Service' },
  { id: 'arm6', name: 'Legacy SR3 Prime Ultimate', type: 'Bus', plateNumber: 'B 8899 KLO', capacity: 50, facilities: ['AC', 'TV', 'Karaoke', 'Toilet'], status: 'Ready' },
  { id: 'arm7', name: 'Toyota Hiace Commuter', type: 'Mobil', plateNumber: 'B 1122 XYZ', capacity: 14, facilities: ['AC', 'Audio System'], status: 'Ready' },
  { id: 'arm8', name: 'Mercedes-Benz OF 917 Medium Bus', type: 'Bus', plateNumber: 'B 5544 MNO', capacity: 31, facilities: ['AC', 'TV', 'Microphone'], status: 'Ready' }
];

export const MOCK_CREW: Crew[] = [
  { id: 'cr1', name: 'Rahmat Hidayat', phone: '081234567890', role: 'Driver', totalTrips: 45, totalKm: 13500, status: 'Ready', accountStatus: 'Aktif' },
  { id: 'cr2', name: 'Bambang Sudjatmiko', phone: '081222333444', role: 'Driver', totalTrips: 12, totalKm: 3600, status: 'Ready', accountStatus: 'Aktif' },
  { id: 'cr3', name: 'Ujang Koswara', phone: '081333444555', role: 'Driver', totalTrips: 8, totalKm: 2400, status: 'Ready', accountStatus: 'Aktif' },
  { id: 'cr4', name: 'Siti Rohimah', phone: '081444555666', role: 'Helper', totalTrips: 30, totalKm: 9000, status: 'Ready', accountStatus: 'Aktif' },
  { id: 'cr5', name: 'Dedi Mulyadi', phone: '081555666777', role: 'Driver', totalTrips: 5, totalKm: 1500, status: 'Ready', accountStatus: 'Aktif' },
  { id: 'cr6', name: 'Agus Setiawan', phone: '081666777888', role: 'Driver', totalTrips: 18, totalKm: 5400, status: 'Ready', accountStatus: 'Aktif' },
  { id: 'cr7', name: 'Heri Kiswanto', phone: '081777888999', role: 'Driver', totalTrips: 22, totalKm: 6600, status: 'Ready', accountStatus: 'Aktif' },
  { id: 'cr8', name: 'Fitri Handayani', phone: '081888999000', role: 'Helper', totalTrips: 15, totalKm: 4500, status: 'Ready', accountStatus: 'Aktif' }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord1',
    customerName: 'Keluarga Pak Jaka (Family Gathering)',
    whatsapp: '081234567890',
    customerAddress: 'Jl. Melati No. 5, Jakarta Barat',
    departureTime: '2026-07-02T06:00',
    returnTime: '2026-07-04T20:00',
    dueDate: '2026-06-29',
    pickupAddress: 'Depan Masjid Al-Ikhlas Meruya',
    destination: 'Yogyakarta (Borobudur & Malioboro)',
    route: 'Tol Trans Jawa',
    distanceKm: 550,
    fleetRequirements: [{ type: 'Bus', count: 1 }],
    status: 'Approved',
    totalPrice: 9500000,
    downPayment: 2500000,
    remainingBalance: 7000000,
    paymentHistory: [
      { id: 'pay1', amount: 2500000, date: '2026-06-15', type: 'DP', note: 'DP Booking Awal' }
    ],
    assignments: [
      { id: 'as1', orderId: 'ord1', armadaId: 'arm1', crewId: 'cr1', assetType: 'Internal' }
    ]
  },
  {
    id: 'ord2',
    customerName: 'PT Maju Jaya Sentosa (Outing Kantor)',
    whatsapp: '081298765432',
    customerAddress: 'Kuningan Tower Lt. 15, Jakarta Selatan',
    departureTime: '2026-07-05T07:00',
    returnTime: '2026-07-06T18:00',
    dueDate: '2026-07-02',
    pickupAddress: 'Lobby Utama Kuningan Tower',
    destination: 'Bandung (Lembang & Dusun Bambu)',
    route: 'Tol Cipularang',
    distanceKm: 150,
    fleetRequirements: [{ type: 'Bus', count: 2 }],
    status: 'Pending',
    totalPrice: 12000000,
    downPayment: 0,
    remainingBalance: 12000000,
    paymentHistory: [],
    assignments: []
  },
  {
    id: 'ord3',
    customerName: 'Rombongan SMK Pariwisata Harapan',
    whatsapp: '081333444555',
    customerAddress: 'Jl. Pendidikan No. 10, Bogor',
    departureTime: '2026-07-10T05:00',
    returnTime: '2026-07-12T22:00',
    dueDate: '2026-07-07',
    pickupAddress: 'Gerbang Utama Sekolah SMK Harapan',
    destination: 'Pangandaran (Pantai Barat & Green Canyon)',
    route: 'Jalur Selatan via Nagreg',
    distanceKm: 350,
    fleetRequirements: [{ type: 'Bus', count: 1 }],
    status: 'Approved',
    totalPrice: 8500000,
    downPayment: 1500000,
    remainingBalance: 7000000,
    paymentHistory: [
      { id: 'pay2', amount: 1500000, date: '2026-06-20', type: 'DP', note: 'Transfer DP Bank Mandiri' }
    ],
    assignments: [
      { id: 'as2', orderId: 'ord3', armadaId: 'arm2', crewId: 'cr2', assetType: 'Internal' }
    ]
  },
  {
    id: 'ord4',
    customerName: 'Gathering Karang Taruna RW 04',
    whatsapp: '085712345678',
    customerAddress: 'Balai RW 04, Kebayoran Lama, Jakarta',
    departureTime: '2026-06-28T06:00',
    returnTime: '2026-06-30T19:00',
    dueDate: '2026-06-25',
    pickupAddress: 'Depan Lapangan Futsal RW 04',
    destination: 'Pantai Anyer (Cottage & Watersport)',
    route: 'Tol Jakarta-Merak',
    distanceKm: 180,
    fleetRequirements: [
      { type: 'Bus', count: 1 },
      { type: 'Elf', count: 1 }
    ],
    status: 'Scheduled',
    totalPrice: 11500000,
    downPayment: 5000000,
    remainingBalance: 6500000,
    paymentHistory: [
      { id: 'pay3', amount: 5000000, date: '2026-06-22', type: 'DP', note: 'DP Tunai di Kantor' }
    ],
    assignments: [
      { id: 'as3_1', orderId: 'ord4', armadaId: 'arm6', crewId: 'cr6', assetType: 'Internal' },
      { id: 'as3_2', orderId: 'ord4', armadaId: 'arm4', crewId: 'cr3', assetType: 'Internal' }
    ]
  },
  {
    id: 'ord5',
    customerName: 'Study Tour SD Merdeka Baru',
    whatsapp: '081122334455',
    customerAddress: 'Jl. Kemerdekaan No. 45, Tangerang',
    departureTime: '2026-06-20T07:00',
    returnTime: '2026-06-22T17:00',
    dueDate: '2026-06-17',
    pickupAddress: 'Halaman Parkir SD Merdeka Baru',
    destination: 'Taman Mini Indonesia Indah (TMII) & Ancol',
    route: 'Tol JORR',
    distanceKm: 80,
    fleetRequirements: [{ type: 'Bus', count: 1 }],
    status: 'Completed',
    totalPrice: 7500000,
    downPayment: 7500000,
    remainingBalance: 0,
    paymentHistory: [
      { id: 'pay4_1', amount: 3000000, date: '2026-06-10', type: 'DP', note: 'DP Awal' },
      { id: 'pay4_2', amount: 4500000, date: '2026-06-17', type: 'Pelunasan', note: 'Pelunasan H-3' }
    ],
    assignments: [
      { id: 'as4', orderId: 'ord5', armadaId: 'arm1', crewId: 'cr1', assetType: 'Internal' }
    ]
  },
  {
    id: 'ord6',
    customerName: 'PT Nusantara Jaya (Tour Dewata Bali)',
    whatsapp: '081288889999',
    customerAddress: 'Kawasan Industri Jababeka, Cikarang',
    departureTime: '2026-06-24T05:00',
    returnTime: '2026-06-29T23:00',
    dueDate: '2026-06-21',
    pickupAddress: 'Gedung Serbaguna PT Nusantara Jaya',
    destination: 'Pulau Bali (Kuta, Bedugul, Uluwatu)',
    route: 'Tol Trans Jawa & Penyeberangan Ketapang',
    distanceKm: 1200,
    fleetRequirements: [
      { type: 'Bus', count: 1 },
      { type: 'Mobil', count: 1 }
    ],
    status: 'On Trip',
    totalPrice: 28000000,
    downPayment: 20000000,
    remainingBalance: 8000000,
    paymentHistory: [
      { id: 'pay5', amount: 20000000, date: '2026-06-15', type: 'DP', note: 'Pembayaran DP 70%' }
    ],
    assignments: [
      { 
        id: 'as5_1', 
        orderId: 'ord6', 
        armadaId: null, 
        crewId: null, 
        assetType: 'Rekanan', 
        poLuar: 'PO Rosalia Indah', 
        platLuar: 'AD 7012 AA', 
        seatsLuar: 50, 
        costToPartner: 14000000 
      },
      { id: 'as5_2', orderId: 'ord6', armadaId: 'arm3', crewId: 'cr5', assetType: 'Internal' }
    ]
  },
  {
    id: 'ord7',
    customerName: 'Rombongan Arisan Ibu-ibu Komplek Anggrek',
    whatsapp: '089911223344',
    customerAddress: 'Perumahan Anggrek Blok C, Depok',
    departureTime: '2026-07-01T06:30',
    returnTime: '2026-07-02T19:00',
    dueDate: '2026-06-28',
    pickupAddress: 'Gerbang Cluster Perumahan Anggrek',
    destination: 'Ciwidey Bandung (Kawah Putih & Kebun Teh)',
    route: 'Tol Purbaleunyi',
    distanceKm: 170,
    fleetRequirements: [{ type: 'Elf', count: 1 }],
    status: 'Approved',
    totalPrice: 3800000,
    downPayment: 1000000,
    remainingBalance: 2800000,
    paymentHistory: [
      { id: 'pay6', amount: 1000000, date: '2026-06-24', type: 'DP', note: 'DP via Transfer ATM', proofStatus: 'Pending Review', proofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500' }
    ],
    assignments: []
  },
  {
    id: 'ord8',
    customerName: 'Jamaah Majelis Taklim Al-Ikhsan (Ziarah Wali)',
    whatsapp: '087788990011',
    customerAddress: 'Kranji, Bekasi Barat',
    departureTime: '2026-06-15T08:00',
    returnTime: '2026-06-18T21:00',
    dueDate: '2026-06-12',
    pickupAddress: 'Halaman Masjid Al-Ikhsan Kranji',
    destination: 'Surabaya & Madura (Ziarah Wali Songo)',
    route: 'Tol Trans Jawa',
    distanceKm: 800,
    fleetRequirements: [{ type: 'Bus', count: 2 }],
    status: 'Cancelled',
    totalPrice: 19000000,
    downPayment: 0,
    remainingBalance: 19000000,
    paymentHistory: [],
    assignments: [],
    notes: 'Dibatalkan oleh panitia karena bentrok dengan jadwal ujian sekolah anak-anak.'
  },
  {
    id: 'ord9',
    customerName: 'Rombongan Pernikahan Rian & Siska',
    whatsapp: '085211223344',
    customerAddress: 'Jl. Garuda No. 88, Kalideres, Jakarta',
    departureTime: '2026-06-26T06:00',
    returnTime: '2026-06-27T22:00',
    dueDate: '2026-06-23',
    pickupAddress: 'Depan Kantor Kecamatan Kalideres',
    destination: 'Kota Solo (Gedung Graha Saba Buana)',
    route: 'Tol Trans Jawa',
    distanceKm: 500,
    fleetRequirements: [{ type: 'Bus', count: 1 }],
    status: 'Scheduled',
    totalPrice: 9000000,
    downPayment: 7000000,
    remainingBalance: 2000000,
    paymentHistory: [
      { id: 'pay8', amount: 7000000, date: '2026-06-22', type: 'DP', note: 'Cicilan DP Besar' }
    ],
    assignments: [
      { 
        id: 'as8', 
        orderId: 'ord9', 
        armadaId: null, 
        crewId: null, 
        assetType: 'Rekanan', 
        poLuar: 'PO Haryanto', 
        platLuar: 'K 1902 BG', 
        seatsLuar: 50, 
        costToPartner: 7200000 
      }
    ]
  },
  {
    id: 'ord10',
    customerName: 'Gathering Komunitas Kopi Seduh',
    whatsapp: '083812345678',
    customerAddress: 'Kopi Seduh Cafe, Depok',
    departureTime: '2026-07-15T08:00',
    returnTime: '2026-07-16T17:00',
    dueDate: '2026-07-12',
    pickupAddress: 'Parkiran Kopi Seduh Cafe',
    destination: 'Lembang Bandung (Farmhouse & Orchid Forest)',
    route: 'Tol Cipularang',
    distanceKm: 160,
    fleetRequirements: [{ type: 'Mobil', count: 2 }],
    status: 'Pending',
    totalPrice: 5000000,
    downPayment: 0,
    remainingBalance: 5000000,
    paymentHistory: [],
    assignments: []
  }
];
