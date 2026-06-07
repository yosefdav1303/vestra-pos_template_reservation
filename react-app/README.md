# VESTRA Reservations — React Build

Versi React/Vite dari **VESTRA** — platform reservasi universal untuk 4 jenis bisnis
(Resto & Café · Barbershop · Sport venue · Rental). Berisi **dua aplikasi**:
app pelanggan + dashboard admin, terhubung lewat localStorage.

## Stack
- **React 18** + **Vite** (multi-page build) — bundler & dev server
- **ES Modules** — semua komponen pakai proper `import`/`export`
- **Inline styles** — no CSS framework, styling lewat `style={{ ... }}` (gaya shadcn/zinc)
- **Google Fonts**: Geist (headings + body), Geist Mono (numeric codes)

## Quick start

```bash
cd react-app
npm install
npm run dev
```

- App pelanggan → `http://localhost:5173/`
- Dashboard admin → `http://localhost:5173/admin.html`

(atau klik tombol **"Dashboard admin →"** di app, dan **"Lihat app pelanggan"** di admin)

## Build production

```bash
npm run build      # output ke ./dist (index.html + admin.html)
npm run preview    # preview hasil build
```

## Struktur file

```
react-app/
├── index.html              # entry — app pelanggan
├── admin.html              # entry — dashboard admin
├── package.json
├── vite.config.js          # multi-page input (app + admin)
└── src/
    ├── main.jsx            # mount app pelanggan
    ├── admin-main.jsx      # mount dashboard admin
    ├── App.jsx             # root app pelanggan + routing + theme
    ├── Admin.jsx           # dashboard admin (5 halaman)
    ├── index.css           # global styles app + print CSS
    ├── admin.css           # global styles admin (zinc tokens)
    ├── data.jsx            # tokens, 4 venue, menu, bank, icons, helpers
    ├── IOSFrame.jsx        # IOSDevice bezel
    └── screens.jsx         # 9 screen reservasi
```

## App pelanggan — flow reservasi (9 langkah)

1. **Detail** — Halaman venue (hero, info, menu/layanan populer)
2. **Date & Time** — Kalender + slot waktu (+ durasi untuk Sport/Rental)
3. **Party** — Jumlah tamu/lapangan + tipe meja/lapangan/barber/kendaraan
4. **Menu** — Pre-order menu / layanan / add-on (opsional)
5. **Guest** — Form nama, no HP, email
6. **Request** — Tag permintaan khusus + catatan
7. **Payment** — Recap detail + DP 50% / Bayar penuh + metode (QRIS / Transfer)
8. **Upload Proof** — QRIS / no rekening + upload bukti bayar
9. **Confirm** — E-ticket + Simpan PDF / Kalender / Hubungi WA

## Dashboard admin (5 halaman)

- **Reservasi** — stats, filter per bisnis & status, tabel, drawer detail, aksi verifikasi/selesai/batal
- **Kalender** — grid bulanan, reservasi sebagai chip berwarna per tanggal
- **Pelanggan** — daftar pelanggan unik (count, total belanja, kontak)
- **Menu & Tarif** — tarif & menu per bisnis
- **Pengaturan** — info outlet, rekening, notifikasi

> Reservasi baru dari app pelanggan **otomatis muncul** di admin (polling `localStorage`).

## Theme tweaks (app pelanggan)

Klik tombol ⚙ di pojok kanan bawah:
- Mode warna + accent (zinc default, plus 11 pilihan)

## Catatan

- Foto venue pakai Unsplash CDN (cek `src/data.jsx → VESTRA_VENUES`)
- Save as PDF pakai `window.print()` + print CSS
- Upload bukti pakai `FileReader` → base64 data URL (in-memory)
- Konten dalam **Bahasa Indonesia**

## Lisensi
Internal prototype.
