// react-app/src/data.jsx — ESM module (no window.X)
import React from 'react';

// ──────────────────────────────────────────────────────────────
// Themes
// ──────────────────────────────────────────────────────────────
const VESTRA_THEMES = {
  cream: {
    name: 'Light',
    bg: '#FFFFFF',
    bg2: '#F4F4F5',
    card: '#FFFFFF',
    ink: '#09090B',
    ink2: '#52525B',
    ink3: '#A1A1AA',
    line: '#E4E4E7',
    chip: '#F4F4F5',
    dark: false,
  },
};

const VESTRA_ACCENTS = {
  zinc:       { name: 'Zinc',       hex: '#18181B', on: '#FAFAFA' },
  terracotta: { name: 'Terracotta', hex: '#B85C38', on: '#FFFFFF' },
  sage:       { name: 'Sage',       hex: '#5D7355', on: '#FFFFFF' },
  cobalt:     { name: 'Cobalt',     hex: '#2C4A7C', on: '#FFFFFF' },
  mustard:    { name: 'Mustard',    hex: '#C49B3D', on: '#1F1612' },
  plum:       { name: 'Plum',       hex: '#5C3B6E', on: '#FFFFFF' },
  forest:     { name: 'Forest',     hex: '#2D5A3D', on: '#FFFFFF' },
  rose:       { name: 'Rose',       hex: '#C9637A', on: '#FFFFFF' },
  sky:        { name: 'Sky',        hex: '#4A7EA8', on: '#FFFFFF' },
  coral:      { name: 'Coral',      hex: '#E27D60', on: '#FFFFFF' },
  olive:      { name: 'Olive',      hex: '#7A8450', on: '#FFFFFF' },
  blue:       { name: 'Blue',       hex: '#2563EB', on: '#FFFFFF' },
};

// ──────────────────────────────────────────────────────────────
// Venues — generic reservation presets (works for ANY business type:
// café, restoran, barbershop, sewa lapangan). Each carries its own
// hero, meta, "space" options, and bookable items/services so the
// whole flow adapts without code changes.
// ──────────────────────────────────────────────────────────────
const VESTRA_VENUES = [
  {
    id: 'fnb',
    type: 'Resto & Café',
    name: 'Vestra Kitchen & Coffee',
    brand: 'V',
    rating: 4.8,
    reviews: 1280,
    location: 'Senopati, Jakarta',
    hours: '07:00 – 23:00',
    priceLabel: 'Mulai',
    priceValue: 'Rp 25rb',
    hero: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80&auto=format&fit=crop',
    bookCta: 'Reservasi meja',
    bookSub: 'Gratis · tanpa biaya tambahan',
    guestNoun: 'tamu',
    bookingFee: 25000,
    allowFull: false,
    paxHint: 'Termasuk anak-anak',
    showPax: true,
    defaultPax: 2,
    spaceTitle: 'Pilih meja',
    spaceLabel: 'Berapa orang & meja seperti apa?',
    spaceTypes: [
      { id: 'indoor', label: 'Indoor', desc: 'AC, suasana tenang', cap: '1–6 orang' },
      { id: 'outdoor', label: 'Outdoor', desc: 'Teras, smoking area', cap: '1–4 orang' },
      { id: 'bar', label: 'Bar seat', desc: 'Depan espresso bar', cap: '1–2 orang' },
      { id: 'private', label: 'Private room', desc: 'Min. booking Rp 500k', cap: '4–10 orang' },
    ],
    highlights: [
      { k: 'Konfirmasi', v: 'Instan' },
      { k: 'Batal gratis', v: '2 jam' },
      { k: 'Slot', v: '30 mnt' },
    ],
    requestTags: ['Ulang tahun', 'Dekat jendela', 'Stop kontak', 'Anniversary', 'High chair (anak)', 'Meeting (butuh tenang)'],
    menuTitle: 'Pesan duluan, biar gak nunggu.',
    menuLead: 'Skip aja kalau mau pesan di tempat. Pre-order kena DP 50%, sisanya bayar pas datang.',
    menu: [
      { category: 'Kopi', note: 'Roasted in-house tiap Senin', items: [
        { id: 'v60', name: 'V60 Gayo Wine', desc: 'Notes: red wine, dark cocoa', price: 48000, badge: 'Signature' },
        { id: 'eks', name: 'Es Kopi Susu Vestra', desc: 'Gula aren homemade', price: 38000, badge: 'Best seller' },
        { id: 'capp', name: 'Cappuccino', desc: 'House blend espresso', price: 42000 },
        { id: 'matcha', name: 'Iced Matcha Latte', desc: 'Ceremonial grade, oat milk', price: 48000 },
      ]},
      { category: 'Brunch', note: 'Available all-day sampai jam 4', items: [
        { id: 'avo', name: 'Sourdough Avo Smash', desc: 'Alpukat, feta, poached egg', price: 78000, badge: 'Favorit' },
        { id: 'ngor', name: 'Nasi Goreng Kampung', desc: 'Ayam suwir, telur ceplok', price: 65000 },
      ]},
      { category: 'Main course', note: 'Lunch & dinner', items: [
        { id: 'iga', name: 'Iga Bakar Vestra', desc: 'Slow-cooked 6 jam, sambal matah', price: 145000, badge: 'Signature' },
        { id: 'gurame', name: 'Gurame Sambal Ijo', desc: 'Ikan segar, sambal hijau', price: 120000 },
        { id: 'pasta', name: 'Truffle Carbonara', desc: 'Fettuccine, jamur, parmesan', price: 95000 },
      ]},
    ],
  },
  {
    id: 'barber',
    type: 'Barbershop',
    name: 'Gent & Blade',
    brand: 'G',
    rating: 4.9,
    reviews: 388,
    location: 'Cipete, Jakarta',
    hours: '10:00 – 21:00',
    priceLabel: 'Mulai',
    priceValue: 'Rp 65rb',
    hero: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80&auto=format&fit=crop',
    bookCta: 'Booking kursi',
    bookSub: 'Pilih barber favoritmu',
    guestNoun: 'orang',
    bookingFee: 0,
    allowFull: true,
    paxHint: 'Yang akan dilayani',
    showPax: false,
    defaultPax: 1,
    spaceTitle: 'Pilih barber',
    spaceLabel: 'Mau ditangani siapa?',
    spaceTypes: [
      { id: 'rio', label: 'Rio', desc: 'Senior · fade specialist', cap: '★ 4.9' },
      { id: 'deni', label: 'Deni', desc: 'Classic cut & shave', cap: '★ 4.8' },
      { id: 'aldo', label: 'Aldo', desc: 'Modern & coloring', cap: '★ 4.7' },
      { id: 'any', label: 'Siapa saja', desc: 'Barber tersedia tercepat', cap: 'Tercepat' },
    ],
    highlights: [
      { k: 'Konfirmasi', v: 'Instan' },
      { k: 'Per sesi', v: '45 mnt' },
      { k: 'Walk-in', v: 'Optional' },
    ],
    requestTags: ['Lagi buru-buru', 'Bawa anak', 'Konsultasi gaya dulu', 'Kulit sensitif', 'Request barber tertentu'],
    menuTitle: 'Pilih layanan.',
    menuLead: 'Tambah layanan biar slot pas. Pembayaran DP 50% di muka, sisanya di tempat.',
    menu: [
      { category: 'Cukur', note: 'Termasuk cuci & styling', items: [
        { id: 'haircut', name: 'Haircut + Wash', desc: 'Potong, keramas, styling', price: 65000, badge: 'Populer' },
        { id: 'fade', name: 'Skin Fade', desc: 'Detail fade + lining', price: 85000, badge: 'Signature' },
        { id: 'kids', name: 'Kids Haircut', desc: 'Anak < 12 thn', price: 50000 },
      ]},
      { category: 'Grooming', note: '', items: [
        { id: 'beard', name: 'Beard Trim + Shave', desc: 'Hot towel, royal shave', price: 55000 },
        { id: 'color', name: 'Hair Coloring', desc: 'Single tone, premium', price: 150000 },
      ]},
    ],
  },
  {
    id: 'lapangan',
    type: 'Sport venue',
    name: 'Arena Mini Soccer GBK',
    brand: 'A',
    rating: 4.7,
    reviews: 521,
    location: 'Senayan, Jakarta',
    hours: '06:00 – 24:00',
    priceLabel: 'Mulai',
    priceValue: 'Rp 250rb/jam',
    hero: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=80&auto=format&fit=crop',
    bookCta: 'Sewa lapangan',
    bookSub: 'Cek slot kosong real-time',
    guestNoun: 'lapangan',
    bookingFee: 0,
    allowFull: true,
    baseRate: 250000,
    baseLabel: 'Sewa lapangan',
    durationNoun: 'jam',
    billPerUnit: true,
    paxHint: 'Berapa lapangan dibooking',
    durations: [ { id: '1j', label: '1 jam', units: 1 }, { id: '2j', label: '2 jam', units: 2 }, { id: '3j', label: '3 jam', units: 3 } ],
    showPax: true,
    defaultPax: 1,
    spaceTitle: 'Pilih lapangan',
    spaceLabel: 'Berapa lapangan & tipe apa?',
    spaceTypes: [
      { id: 'a', label: 'Lapangan A', desc: 'Rumput sintetis FIFA', cap: '5v5' },
      { id: 'b', label: 'Lapangan B', desc: 'Indoor, ber-AC', cap: '5v5' },
      { id: 'c', label: 'Lapangan C', desc: 'Outdoor, floodlight', cap: '7v7' },
      { id: 'futsal', label: 'Court Futsal', desc: 'Vinyl flooring', cap: '4v4' },
    ],
    highlights: [
      { k: 'Konfirmasi', v: 'Instan' },
      { k: 'Per slot', v: '60 mnt' },
      { k: 'Batal gratis', v: '3 jam' },
    ],
    requestTags: ['Turnamen', 'Latihan rutin', 'Butuh wasit', 'Acara kantor', 'Sewa loker'],
    menuTitle: 'Tambah sewa & add-on.',
    menuLead: 'Sewa peralatan biar gak ribet. Bayar DP 50% buat kunci slot, sisanya di lokasi.',
    menu: [
      { category: 'Add-on', note: 'Sewa per sesi', items: [
        { id: 'bola', name: 'Sewa Bola', desc: 'Molten match ball', price: 30000, badge: 'Populer' },
        { id: 'rompi', name: 'Set Rompi (10)', desc: '2 warna, 10 pcs', price: 50000 },
        { id: 'wasit', name: 'Wasit', desc: 'Wasit bersertifikat', price: 150000, badge: 'Pro' },
      ]},
      { category: 'Refreshment', note: '', items: [
        { id: 'air', name: 'Air Mineral (1 dus)', desc: '600ml × 12', price: 40000 },
        { id: 'isotonik', name: 'Isotonik (6)', desc: 'Pocari/Mizone', price: 60000 },
      ]},
    ],
  },
  {
    id: 'rental',
    type: 'Rental',
    name: 'Vestra Auto Rental',
    brand: 'R',
    rating: 4.8,
    reviews: 742,
    location: 'Cilandak, Jakarta',
    hours: '06:00 – 22:00',
    priceLabel: 'Mulai',
    priceValue: 'Rp 350rb/hari',
    hero: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80&auto=format&fit=crop',
    bookCta: 'Sewa sekarang',
    bookSub: 'Lepas kunci atau pakai sopir',
    guestNoun: 'unit',
    bookingFee: 0,
    allowFull: true,
    baseRate: 350000,
    baseLabel: 'Sewa unit',
    durationNoun: 'hari',
    billPerUnit: true,
    paxHint: 'Jumlah unit disewa',
    durations: [ { id: '12h', label: '12 jam', units: 0.6 }, { id: '1d', label: '1 hari', units: 1 }, { id: '2d', label: '2 hari', units: 2 }, { id: '3d', label: '3 hari', units: 3 }, { id: '7d', label: '7 hari', units: 6.5 } ],
    showPax: false,
    defaultPax: 1,
    spaceTitle: 'Pilih kendaraan',
    spaceLabel: 'Berapa unit & tipe kendaraan apa?',
    spaceTypes: [
      { id: 'citycar', label: 'City car', desc: 'Brio / Agya, irit BBM', cap: '4 kursi' },
      { id: 'suv', label: 'SUV', desc: 'Rush / Terios', cap: '7 kursi' },
      { id: 'mpv', label: 'MPV Premium', desc: 'Innova Reborn', cap: '7 kursi' },
      { id: 'motor', label: 'Motor', desc: 'NMAX / PCX', cap: '2 orang' },
    ],
    highlights: [
      { k: 'Konfirmasi', v: 'Instan' },
      { k: 'Min sewa', v: '12 jam' },
      { k: 'Antar unit', v: 'Gratis' },
    ],
    requestTags: ['Pakai sopir', 'Lepas kunci', 'Antar-jemput', 'Baby seat', 'Luar kota', 'Sewa mingguan'],
    menuTitle: 'Tambah layanan & add-on.',
    menuLead: 'Lengkapi sewa biar nyaman. Bayar DP 50% buat kunci unit, sisanya saat ambil.',
    menu: [
      { category: 'Layanan', note: 'Per hari', items: [
        { id: 'sopir', name: 'Sopir Profesional', desc: 'Termasuk uang makan', price: 200000, badge: 'Populer' },
        { id: 'bbm', name: 'Full Tank BBM', desc: 'Tangki penuh, tinggal jalan', price: 300000 },
        { id: 'antar', name: 'Antar-Jemput Unit', desc: 'Area Jakarta', price: 100000 },
      ]},
      { category: 'Add-on', note: '', items: [
        { id: 'babyseat', name: 'Baby Seat', desc: 'Aman untuk balita', price: 50000 },
        { id: 'gps', name: 'GPS + Dashcam', desc: 'Navigasi & rekam jalan', price: 40000 },
        { id: 'asuransi', name: 'Asuransi All-Risk', desc: 'Tenang di perjalanan', price: 75000, badge: 'Disarankan' },
      ]},
    ],
  },
];

const VESTRA_CAFES = [
  {
    id: 'kopi-vestra',
    name: 'Kopi Vestra',
    tagline: 'Specialty coffee · Slow brunch',
    area: 'Senopati, Jakarta',
    distance: '1.2 km',
    rating: 4.8,
    reviews: 612,
    price: 'Rp 75–150rb',
    cuisine: 'Coffee · Brunch',
    open: '07:00 – 22:00',
    hero: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80&auto=format&fit=crop',
    ],
    tags: ['Outdoor', 'Wifi cepat', 'Cocok meeting', 'Brunch favorit'],
    about: 'Kedai kopi specialty di balik dinding bata Senopati. Roasting in-house tiap Senin, single-origin Gayo & Toraja jadi andalan. Brunch all-day sampai jam 4 sore.',
    popularItems: [
      { name: 'V60 Single Origin', desc: 'Gayo Wine · Notes: red wine, dark cocoa', price: 'Rp 48k' },
      { name: 'Es Kopi Susu Vestra', desc: 'House signature — gula aren homemade', price: 'Rp 38k' },
      { name: 'Sourdough Avo Smash', desc: 'Alpukat, feta, chili oil, telur poached', price: 'Rp 78k' },
    ],
  },
  {
    id: 'rumah-baharu',
    name: 'Rumah Kopi Baharu',
    tagline: 'Roastery & espresso bar',
    area: 'Menteng, Jakarta',
    distance: '2.8 km',
    rating: 4.7,
    reviews: 421,
    price: 'Rp 50–120rb',
    cuisine: 'Coffee · Pastries',
    open: '08:00 – 21:00',
    hero: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&q=80&auto=format&fit=crop',
    gallery: [],
    tags: ['Roastery', 'Quiet'],
  },
  {
    id: 'sudut-kopi',
    name: 'Sudut Kopi',
    tagline: 'Neighbourhood café',
    area: 'Kemang, Jakarta',
    distance: '3.4 km',
    rating: 4.6,
    reviews: 289,
    price: 'Rp 40–90rb',
    cuisine: 'Coffee · Light meals',
    open: '07:30 – 22:00',
    hero: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=1200&q=80&auto=format&fit=crop',
    gallery: [],
    tags: ['Outdoor', 'Anjing OK'],
  },
  {
    id: 'tanggal-tua',
    name: 'Tanggal Tua Coffee',
    tagline: 'Affordable specialty',
    area: 'Tebet, Jakarta',
    distance: '4.1 km',
    rating: 4.5,
    reviews: 1208,
    price: 'Rp 25–60rb',
    cuisine: 'Coffee · Snacks',
    open: '08:00 – 23:00',
    hero: 'https://images.unsplash.com/photo-1521302200778-33500795e128?w=1200&q=80&auto=format&fit=crop',
    gallery: [],
    tags: ['Budget', 'Late night'],
  },
  {
    id: 'abode',
    name: 'Abode Coffee & Bakery',
    tagline: 'Sourdough bakery + café',
    area: 'Senopati, Jakarta',
    distance: '1.4 km',
    rating: 4.9,
    reviews: 833,
    price: 'Rp 60–180rb',
    cuisine: 'Bakery · Brunch',
    open: '07:00 – 20:00',
    hero: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=80&auto=format&fit=crop',
    gallery: [],
    tags: ['Bakery', 'Brunch favorit'],
  },
];

// ──────────────────────────────────────────────────────────────
// Booking constants
// ──────────────────────────────────────────────────────────────
const VESTRA_TIME_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30',
  '17:00','17:30','18:00','18:30','19:00','19:30','20:00',
];

const VESTRA_TABLE_TYPES = [
  { id: 'indoor', label: 'Indoor', desc: 'AC, suasana tenang', cap: '1–6 orang' },
  { id: 'outdoor', label: 'Outdoor', desc: 'Teras, smoking area', cap: '1–4 orang' },
  { id: 'bar', label: 'Bar seat', desc: 'Depan espresso bar', cap: '1–2 orang' },
  { id: 'private', label: 'Private room', desc: 'Min. booking Rp 500k', cap: '4–10 orang' },
];

const VESTRA_REQUEST_TAGS = [
  'Ulang tahun',
  'Date night',
  'Stop kontak',
  'Dekat jendela',
  'High chair (anak)',
  'Anniversary',
  'Meeting (butuh tenang)',
];

// ──────────────────────────────────────────────────────────────
// Menu (for pre-order)
// ──────────────────────────────────────────────────────────────
const VESTRA_MENU = [
  {
    category: 'Kopi',
    note: 'Roasted in-house tiap Senin',
    items: [
      { id:'v60', name:'V60 Gayo Wine', desc:'Notes: red wine, dark cocoa', price:48000, badge:'Signature' },
      { id:'aero', name:'Aeropress Toraja', desc:'Honey, brown sugar, citrus', price:45000 },
      { id:'eks', name:'Es Kopi Susu Vestra', desc:'Gula aren homemade', price:38000, badge:'Best seller' },
      { id:'capp', name:'Cappuccino', desc:'House blend espresso', price:42000 },
      { id:'cort', name:'Cortado', desc:'Espresso + steamed milk 1:1', price:40000 },
      { id:'matcha', name:'Iced Matcha Latte', desc:'Ceremonial grade, oat milk', price:48000 },
    ],
  },
  {
    category: 'Brunch',
    note: 'Available all-day sampai jam 4',
    items: [
      { id:'avo', name:'Sourdough Avo Smash', desc:'Alpukat, feta, chili oil, poached egg', price:78000, badge:'Favorit' },
      { id:'ngor', name:'Nasi Goreng Kampung', desc:'Ayam suwir, telur ceplok, kerupuk', price:65000 },
      { id:'pancake', name:'Buttermilk Pancake Stack', desc:'Pisang, madu, maple syrup', price:68000 },
      { id:'eggs', name:'Eggs Benedict', desc:'Smoked beef, hollandaise, muffin', price:82000 },
    ],
  },
  {
    category: 'Pastry',
    note: 'Baked fresh setiap pagi',
    items: [
      { id:'croi', name:'Croissant Almond', desc:'Butter croissant, kacang almond', price:35000 },
      { id:'paoc', name:'Pain au Chocolat', desc:'Cokelat Belgian 70%', price:32000 },
      { id:'bb', name:'Banana Bread', desc:'Walnut, brown butter glaze', price:28000 },
    ],
  },
];

// ──────────────────────────────────────────────────────────────
// Reservation deposit (DP) rules
// ──────────────────────────────────────────────────────────────
const VESTRA_DP = {
  tableFee: 25000,   // flat per reservasi — refund jadi credit di bill
  menuPercent: 0.5,  // 50% dari subtotal pre-order, sisanya bayar di tempat
};

const VESTRA_PAYMENT_METHODS = [
  { id:'qris',     name:'QRIS',           sub:'Scan dari banking / e-wallet app', icon:'QR' },
  { id:'transfer', name:'Transfer Bank',  sub:'BCA · Mandiri · BNI',              icon:'BANK' },
];

// Bank accounts displayed when user picks Transfer Bank
const VESTRA_BANK_ACCOUNTS = [
  { bank:'BCA',     rekening:'7728-540-918', holder:'PT Kopi Vestra Indonesia', color:'#0060AF' },
  { bank:'Mandiri', rekening:'145-00-1234567-8', holder:'PT Kopi Vestra Indonesia', color:'#003D79' },
  { bank:'BNI',     rekening:'0345-987-612', holder:'PT Kopi Vestra Indonesia', color:'#F26522' },
];

function vestraFmtRp(n) {
  if (n == null) return '—';
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

// WhatsApp number Kopi Vestra (format: kode negara tanpa + / 0 di depan).
// GANTI dengan nomor WA asli restoran kamu di sini ↓
const VESTRA_WA = '628123456789';


// ──────────────────────────────────────────────────────────────
// Bill calculator — handles base (duration × rate, optionally × unit),
// add-on services, a fixed booking fee, and DP vs full payment.
// ──────────────────────────────────────────────────────────────
function vestraComputeBill(cafe, booking) {
  const services = (cafe.menu || []).flatMap((c) => c.items)
    .reduce((s, it) => s + (booking.menu[it.id] || 0) * it.price, 0);
  let base = 0;
  let dur = null;
  if (cafe.baseRate && cafe.durations) {
    dur = cafe.durations.find((x) => x.id === booking.duration) || cafe.durations[0];
    base = Math.round(cafe.baseRate * dur.units * (cafe.billPerUnit ? Math.max(1, booking.pax) : 1));
  }
  const fee = (services > 0) ? 0 : (cafe.bookingFee || 0);
  const variable = base + services;
  const grand = fee + variable;
  const payMode = (cafe.allowFull && booking.payMode === 'full') ? 'full' : 'dp';
  const payNow = payMode === 'full' ? grand : fee + Math.round(variable * 0.5);
  const remaining = grand - payNow;
  return { services, base, fee, dur, grand, payNow, remaining, payMode };
}

// ──────────────────────────────────────────────────────────────
// Calendar helpers
// ──────────────────────────────────────────────────────────────
const VESTRA_MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const VESTRA_DAYS_ID = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const VESTRA_DAYS_FULL_ID = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

function vestraFmtDate(d) {
  if (!d) return '—';
  return `${VESTRA_DAYS_FULL_ID[d.getDay()]}, ${d.getDate()} ${VESTRA_MONTHS_ID[d.getMonth()]}`;
}
function vestraFmtDateShort(d) {
  if (!d) return '—';
  return `${d.getDate()} ${VESTRA_MONTHS_ID[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
}

// ──────────────────────────────────────────────────────────────
// Icons — small stroke icons, no emoji
// ──────────────────────────────────────────────────────────────
const Icon = {
  search: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  back:   (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m14 6-6 6 6 6"/></svg>,
  close:  (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="m6 6 12 12M18 6 6 18"/></svg>,
  pin:    (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-7.5 8-13a8 8 0 0 0-16 0c0 5.5 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></svg>,
  star:   (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/></svg>,
  clock:  (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  users:  (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.6"/><path d="M21 19c0-2.4-2-4-4-4"/></svg>,
  cal:    (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
  bookmark:(p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 4h12v17l-6-4-6 4z"/></svg>,
  share:  (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v13M7 8l5-5 5 5M5 21h14"/></svg>,
  check:  (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m5 12 5 5 9-11"/></svg>,
  arrow:  (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  plus:   (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  minus:  (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M5 12h14"/></svg>,
  sliders:(p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>,
  phone:  (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>,
  receipt:(p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>,
  flame:  (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s-3 1-3 5a7 7 0 0 0 14 0c0-6-7-11-7-11z"/></svg>,
  download:(p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 4v12m0 0-4-4m4 4 4-4M4 20h16"/></svg>,
  cart:    (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 4h2l3 13h11l2-9H7"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>,
  shield:  (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>,
  coffee:  (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 9h13v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M17 11h2a2 2 0 0 1 0 4h-2M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2"/></svg>,
  copy:    (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>,
  upload:  (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 16V4m0 0-4 4m4-4 4 4M4 20h16"/></svg>,
  image:   (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.7"/><path d="m21 17-5-5-8 8"/></svg>,
  chat:    (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/></svg>,
};


export {
  VESTRA_THEMES, VESTRA_ACCENTS, VESTRA_CAFES, VESTRA_VENUES,
  VESTRA_TIME_SLOTS, VESTRA_TABLE_TYPES, VESTRA_REQUEST_TAGS,
  VESTRA_MENU, VESTRA_DP, VESTRA_PAYMENT_METHODS, VESTRA_BANK_ACCOUNTS,
  VESTRA_MONTHS_ID, VESTRA_DAYS_ID, VESTRA_DAYS_FULL_ID,
  vestraFmtDate, vestraFmtDateShort, vestraFmtRp, vestraComputeBill, VESTRA_WA, Icon,
};
