# Push VESTRA Reservations ke GitHub

Folder ini (`react-app/`) adalah **Vite + React 18** app yang siap jalan.

## Cara push (pakai repo kamu yang sudah ada)

Download folder `react-app/`, lalu di terminal:

```bash
cd react-app

# (kalau belum ada git)
git init
git add .
git commit -m "feat: VESTRA universal reservation app (React + Vite)"
git branch -M main

# pilih SALAH SATU repo kamu:
git remote add origin https://github.com/yosefdav1303/vite-react.git
# atau:  git remote add origin https://github.com/yosefdav1303/vestra-pos.git

git push -u origin main --force
```

> `--force` dipakai kalau repo sudah ada isinya dan kamu mau timpa. Hapus `--force` kalau repo masih kosong.

## Jalanin lokal dulu (opsional)

```bash
cd react-app
npm install
npm run dev      # buka http://localhost:5173
```

## Build production

```bash
npm run build    # output ke react-app/dist
```

## Isi project
- React 18 + Vite, semua komponen ESM (`import`/`export`)
- **Dua aplikasi dalam satu build (multi-page Vite):**
  - `index.html` → **App pelanggan** (reservasi)
  - `admin.html` → **Dashboard admin** (terima & kelola reservasi)
- 4 venue type: Resto & Café · Barbershop · Sport venue · Rental
- Full flow 9 langkah + DP/Bayar penuh + durasi + upload bukti + Simpan PDF
- Admin: Reservasi · Kalender · Pelanggan · Menu & Tarif · Pengaturan
- App ↔ Admin nyambung lewat `localStorage` (`vestra_reservations`)

## Akses kedua halaman
- Dev: app di `http://localhost:5173/`, admin di `http://localhost:5173/admin.html`
- Atau klik tombol **"Dashboard admin →"** di app, dan **"Lihat app pelanggan"** di sidebar admin
- Build: kedua HTML ada di `dist/` (`index.html` + `admin.html`)
