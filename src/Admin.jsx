// Admin.jsx — VESTRA admin dashboard (ESM). Receives reservations from the
// customer app via the `vestra_reservations` localStorage bridge + seed data.
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  VESTRA_MONTHS_ID, VESTRA_DAYS_ID, VESTRA_VENUES, VESTRA_BANK_ACCOUNTS,
  vestraFmtRp, Icon,
} from './data.jsx';

const MONTHS = VESTRA_MONTHS_ID;
const DAYS = VESTRA_DAYS_ID;

// ── helpers ───────────────────────────────────────────────────
function isoDay(offset) {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + offset);
  return d.toISOString();
}
function parseD(iso) { return iso ? new Date(iso) : null; }
function fmtDay(iso) {
  const d = parseD(iso); if (!d) return '—';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.setHours(0, 0, 0, 0) - today.getTime()) / 86400000);
  const dd = parseD(iso);
  const base = `${dd.getDate()} ${MONTHS[dd.getMonth()].slice(0, 3)}`;
  if (diff === 0) return `Hari ini · ${base}`;
  if (diff === 1) return `Besok · ${base}`;
  if (diff === -1) return `Kemarin · ${base}`;
  return `${DAYS[dd.getDay()]}, ${base}`;
}
function isToday(iso) {
  const d = parseD(iso); if (!d) return false;
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}
function ago(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'baru saja';
  if (s < 3600) return `${Math.floor(s / 60)} mnt lalu`;
  if (s < 86400) return `${Math.floor(s / 3600)} jam lalu`;
  return `${Math.floor(s / 86400)} hari lalu`;
}
function rp(n) { return vestraFmtRp(n); }

function PROOF(amount, date) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='320'>
      <rect width='240' height='320' fill='#F4F4F5'/>
      <rect x='24' y='26' width='192' height='36' rx='7' fill='#fff'/>
      <circle cx='42' cy='44' r='9' fill='#22C55E'/>
      <rect x='60' y='39' width='90' height='10' rx='3' fill='#d4d4d8'/>
      <rect x='24' y='86' width='130' height='12' rx='4' fill='#d4d4d8'/>
      <rect x='24' y='110' width='170' height='12' rx='4' fill='#e4e4e7'/>
      <rect x='24' y='158' width='192' height='1' fill='#d4d4d8'/>
      <text x='24' y='208' font-family='monospace' font-size='27' fill='#09090B'>${amount}</text>
      <text x='24' y='240' font-family='monospace' font-size='12' fill='#71717A'>BERHASIL · ${date || 'hari ini'}</text>
      <rect x='24' y='262' width='192' height='34' rx='7' fill='#fff'/>
      <rect x='36' y='275' width='120' height='8' rx='3' fill='#e4e4e7'/>
    </svg>`);
}

// ── seed reservations (as if already received) ────────────────
function seed() {
  return [
    {
      code: 'VST-7K2D-481', venueId: 'fnb', venueName: 'Vestra Kitchen & Coffee', venueType: 'Resto & Café', brand: 'V',
      date: isoDay(0), time: '19:00', pax: 2, showPax: true, guestNoun: 'tamu', space: 'Indoor', duration: '',
      items: [{ name: 'V60 Gayo Wine', qty: 1, price: 48000 }, { name: 'Sourdough Avo Smash', qty: 1, price: 78000 }],
      name: 'Aldi Pratama', phone: '+62 812-3456-7890', email: 'aldi.p@email.com',
      tags: ['Dekat jendela', 'Anniversary'], note: 'Tolong siapkan kursi dekat jendela ya, ada perayaan kecil.',
      paymentMethod: 'QRIS', payMode: 'dp', grand: 126000, payNow: 63000, remaining: 63000, fee: 0,
      proofName: 'bukti-qris.jpg', proofUrl: PROOF('Rp 63.000'), createdAt: Date.now() - 1000 * 60 * 7, status: 'baru',
    },
    {
      code: 'VST-3M9X-204', venueId: 'lapangan', venueName: 'Arena Mini Soccer GBK', venueType: 'Sport venue', brand: 'A',
      date: isoDay(0), time: '20:00', pax: 2, showPax: true, guestNoun: 'lapangan', space: 'Lapangan A', duration: '2 jam',
      items: [{ name: 'Sewa Bola', qty: 1, price: 30000 }, { name: 'Set Rompi (10)', qty: 1, price: 50000 }],
      name: 'Bagas Setiawan', phone: '+62 813-8821-0094', email: 'bagas@email.com',
      tags: [], note: 'Main rutin tiap Sabtu, bola sama rompi tolong disiapin.',
      paymentMethod: 'Transfer Bank', payMode: 'full', grand: 1080000, payNow: 1080000, remaining: 0, fee: 0,
      proofName: 'transfer-bca.jpg', proofUrl: PROOF('Rp 1.080.000'), createdAt: Date.now() - 1000 * 60 * 22, status: 'baru',
    },
    {
      code: 'VST-Q4F1-877', venueId: 'barber', venueName: 'Gent & Blade', venueType: 'Barbershop', brand: 'G',
      date: isoDay(0), time: '15:30', pax: 1, showPax: false, guestNoun: 'orang', space: 'Rio', duration: '',
      items: [{ name: 'Skin Fade', qty: 1, price: 85000 }, { name: 'Beard Trim + Shave', qty: 1, price: 55000 }],
      name: 'Reza Maulana', phone: '+62 821-1145-7732', email: '',
      tags: [], note: '', paymentMethod: 'QRIS', payMode: 'dp', grand: 140000, payNow: 70000, remaining: 70000, fee: 0,
      proofName: 'qris-gopay.jpg', proofUrl: PROOF('Rp 70.000'), createdAt: Date.now() - 1000 * 60 * 60 * 2, status: 'terkonfirmasi',
    },
    {
      code: 'VST-8H2P-145', venueId: 'rental', venueName: 'Vestra Auto Rental', venueType: 'Rental', brand: 'R',
      date: isoDay(1), time: '09:00', pax: 1, showPax: false, guestNoun: 'unit', space: 'City car', duration: '2 hari',
      items: [{ name: 'Sopir Profesional', qty: 1, price: 200000 }],
      name: 'Sinta Dewi', phone: '+62 856-9921-3380', email: 'sinta.dewi@email.com',
      tags: [], note: 'Untuk perjalanan ke Bandung, butuh sopir.',
      paymentMethod: 'Transfer Bank', payMode: 'dp', grand: 900000, payNow: 450000, remaining: 450000, fee: 0,
      proofName: 'transfer-mandiri.jpg', proofUrl: PROOF('Rp 450.000'), createdAt: Date.now() - 1000 * 60 * 60 * 5, status: 'terkonfirmasi',
    },
    {
      code: 'VST-2C7L-639', venueId: 'fnb', venueName: 'Vestra Kitchen & Coffee', venueType: 'Resto & Café', brand: 'V',
      date: isoDay(1), time: '12:30', pax: 4, showPax: true, guestNoun: 'tamu', space: 'Private room', duration: '',
      items: [{ name: 'Iga Bakar Vestra', qty: 2, price: 145000 }, { name: 'Truffle Carbonara', qty: 1, price: 95000 }, { name: 'Es Kopi Susu Vestra', qty: 4, price: 38000 }],
      name: 'Putri Anggraini', phone: '+62 811-2030-4050', email: 'putri.a@email.com',
      tags: ['Meeting (butuh tenang)'], note: 'Meeting kantor, butuh ruang yang tenang.',
      paymentMethod: 'QRIS', payMode: 'dp', grand: 537000, payNow: 268500, remaining: 268500, fee: 0,
      proofName: 'qris-ovo.jpg', proofUrl: PROOF('Rp 268.500'), createdAt: Date.now() - 1000 * 60 * 60 * 26, status: 'terkonfirmasi',
    },
    {
      code: 'VST-5W8N-012', venueId: 'fnb', venueName: 'Vestra Kitchen & Coffee', venueType: 'Resto & Café', brand: 'V',
      date: isoDay(-1), time: '18:00', pax: 3, showPax: true, guestNoun: 'tamu', space: 'Outdoor', duration: '',
      items: [], name: 'Dimas Prakoso', phone: '+62 838-7766-1122', email: '',
      tags: ['Stop kontak'], note: '', paymentMethod: 'QRIS', payMode: 'dp', grand: 25000, payNow: 25000, remaining: 0, fee: 25000,
      proofName: 'qris.jpg', proofUrl: PROOF('Rp 25.000', 'kemarin'), createdAt: Date.now() - 1000 * 60 * 60 * 28, status: 'selesai',
    },
    {
      code: 'VST-9T3R-558', venueId: 'barber', venueName: 'Gent & Blade', venueType: 'Barbershop', brand: 'G',
      date: isoDay(-1), time: '11:00', pax: 1, showPax: false, guestNoun: 'orang', space: 'Aldo', duration: '',
      items: [{ name: 'Hair Coloring', qty: 1, price: 150000 }],
      name: 'Fajar Nugroho', phone: '+62 877-1234-9988', email: '',
      tags: [], note: '', paymentMethod: 'Transfer Bank', payMode: 'full', grand: 150000, payNow: 150000, remaining: 0, fee: 0,
      proofName: 'transfer.jpg', proofUrl: PROOF('Rp 150.000', 'kemarin'), createdAt: Date.now() - 1000 * 60 * 60 * 30, status: 'selesai',
    },
    {
      code: 'VST-1B6V-790', venueId: 'lapangan', venueName: 'Arena Mini Soccer GBK', venueType: 'Sport venue', brand: 'A',
      date: isoDay(2), time: '17:00', pax: 1, showPax: true, guestNoun: 'lapangan', space: 'Lapangan B', duration: '1 jam',
      items: [], name: 'Yoga Pradana', phone: '+62 812-0099-3321', email: '',
      tags: [], note: 'Test slot, kayaknya bentrok jadwal.', paymentMethod: 'QRIS', payMode: 'dp', grand: 250000, payNow: 125000, remaining: 125000, fee: 0,
      proofName: null, proofUrl: null, createdAt: Date.now() - 1000 * 60 * 60 * 50, status: 'batal',
    },
    {
      code: 'VST-6P1K-330', venueId: 'rental', venueName: 'Vestra Auto Rental', venueType: 'Rental', brand: 'R',
      date: isoDay(0), time: '08:00', pax: 2, showPax: false, guestNoun: 'unit', space: 'MPV (Innova)', duration: '3 hari',
      items: [{ name: 'Full Tank BBM', qty: 1, price: 300000 }, { name: 'GPS + Dashcam', qty: 2, price: 40000 }],
      name: 'Hendra Wijaya', phone: '+62 815-7788-2210', email: 'hendra.w@email.com',
      tags: [], note: 'Mudik keluarga, 2 unit Innova. Tolong tangki penuh ya.',
      paymentMethod: 'Transfer Bank', payMode: 'dp', grand: 2480000, payNow: 1240000, remaining: 1240000, fee: 0,
      proofName: 'transfer-bni.jpg', proofUrl: PROOF('Rp 1.240.000'), createdAt: Date.now() - 1000 * 60 * 14, status: 'baru',
    },
    {
      code: 'VST-4D8S-617', venueId: 'rental', venueName: 'Vestra Auto Rental', venueType: 'Rental', brand: 'R',
      date: isoDay(-1), time: '10:30', pax: 1, showPax: false, guestNoun: 'unit', space: 'City car (Brio)', duration: '1 hari',
      items: [], name: 'Maya Kusuma', phone: '+62 819-3344-5566', email: '',
      tags: [], note: '', paymentMethod: 'QRIS', payMode: 'full', grand: 350000, payNow: 350000, remaining: 0, fee: 0,
      proofName: 'qris.jpg', proofUrl: PROOF('Rp 350.000', 'kemarin'), createdAt: Date.now() - 1000 * 60 * 60 * 32, status: 'selesai',
    },
    {
      code: 'VST-0J5T-298', venueId: 'barber', venueName: 'Gent & Blade', venueType: 'Barbershop', brand: 'G',
      date: isoDay(0), time: '17:00', pax: 1, showPax: false, guestNoun: 'orang', space: 'Deni', duration: '',
      items: [{ name: 'Haircut + Wash', qty: 1, price: 65000 }],
      name: 'Arif Budiman', phone: '+62 822-6677-8899', email: '',
      tags: [], note: 'Pertama kali ke sini, rekomendasi teman.',
      paymentMethod: 'QRIS', payMode: 'dp', grand: 65000, payNow: 32500, remaining: 32500, fee: 0,
      proofName: 'qris-dana.jpg', proofUrl: PROOF('Rp 32.500'), createdAt: Date.now() - 1000 * 60 * 38, status: 'baru',
    },
    {
      code: 'VST-7N3W-451', venueId: 'lapangan', venueName: 'Arena Mini Soccer GBK', venueType: 'Sport venue', brand: 'A',
      date: isoDay(1), time: '19:00', pax: 1, showPax: true, guestNoun: 'lapangan', space: 'Lapangan A', duration: '2 jam',
      items: [{ name: 'Wasit', qty: 1, price: 150000 }, { name: 'Air Mineral (1 dus)', qty: 2, price: 40000 }],
      name: 'Komunitas Futsal Senayan', phone: '+62 813-1212-3434', email: 'futsalsenayan@email.com',
      tags: [], note: 'Turnamen mini antar RT, butuh wasit.',
      paymentMethod: 'Transfer Bank', payMode: 'dp', grand: 730000, payNow: 365000, remaining: 365000, fee: 0,
      proofName: 'transfer-bca.jpg', proofUrl: PROOF('Rp 365.000'), createdAt: Date.now() - 1000 * 60 * 60 * 3, status: 'terkonfirmasi',
    },
  ];
}

// ── per-venue-type detail helpers ─────────────────────────────
function typeFacts(r) {
  switch (r.venueType) {
    case 'Sport venue':
      return [['Lapangan', r.space || '—'], ['Durasi main', r.duration || '—'], ['Jumlah', `${r.pax} lapangan`]];
    case 'Rental':
      return [['Kendaraan', r.space || '—'], ['Lama sewa', r.duration || '—'], ['Jumlah', `${r.pax} unit`]];
    case 'Barbershop':
      return [['Barber', r.space || 'Siapa saja'], ['Sesi', r.duration || '± 45 mnt'], ['Layanan', `${r.items.length} item`]];
    default: // Resto & Café
      return [['Meja', r.space || '—'], ['Tamu', `${r.pax} orang`], ['Pre-order', r.items.length ? `${r.items.reduce((s, i) => s + i.qty, 0)} item` : 'Tidak ada']];
  }
}
function orderLabel(type) {
  return ({ 'Sport venue': 'Sewa peralatan', 'Rental': 'Layanan & add-on', 'Barbershop': 'Layanan dipesan' })[type] || 'Pre-order menu';
}

// ── status config ─────────────────────────────────────────────
const STATUS = {
  baru: { label: 'Perlu ditinjau', bg: 'var(--amber-bg)', fg: 'var(--amber)', dot: '#D97706' },
  terkonfirmasi: { label: 'Terkonfirmasi', bg: 'var(--green-bg)', fg: 'var(--green)', dot: '#16A34A' },
  selesai: { label: 'Selesai', bg: 'var(--zinc-bg)', fg: '#52525B', dot: '#A1A1AA' },
  batal: { label: 'Dibatalkan', bg: 'var(--red-bg)', fg: 'var(--red)', dot: '#DC2626' },
};

function StatusBadge({ s }) {
  const c = STATUS[s] || STATUS.baru;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999,
      background: c.bg, color: c.fg, fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: c.dot }} />
      {c.label}
    </span>
  );
}

function TypeBadge({ t }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 6,
      background: 'var(--line2)', color: 'var(--ink2)', fontSize: 11, fontWeight: 600, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
    }}>{t}</span>
  );
}

function Avatar({ name, brand }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div style={{
      width: 38, height: 38, minWidth: 38, borderRadius: 19, background: 'var(--accent)', color: '#fff',
      display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, letterSpacing: '0.01em',
    }}>{initials}</div>
  );
}

// ── sidebar ───────────────────────────────────────────────────
function Sidebar({ counts, page, setPage }) {
  const items = [
    { id: 'reservasi', icon: Icon.receipt, label: 'Reservasi', badge: counts.baru },
    { id: 'kalender', icon: Icon.cal, label: 'Kalender' },
    { id: 'pelanggan', icon: Icon.users, label: 'Pelanggan' },
    { id: 'menu', icon: Icon.receipt, label: 'Menu & Tarif' },
    { id: 'pengaturan', icon: Icon.sliders, label: 'Pengaturan' },
  ];
  return (
    <div style={{
      width: 244, minWidth: 244, borderRight: '1px solid var(--line)', background: '#fff',
      display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0,
    }}>
      <div style={{ padding: '22px 20px 18px', display: 'flex', alignItems: 'center', gap: 11, borderBottom: '1px solid var(--line)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>V</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>VESTRA</span>
          <span style={{ fontSize: 11, color: 'var(--ink3)', fontWeight: 500 }}>Admin Console</span>
        </div>
      </div>
      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 12px 6px' }}>Menu</div>
        {items.map((it) => {
          const active = it.id === page;
          return (
          <button key={it.id} onClick={() => setPage(it.id)} style={{
            display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: active ? 'var(--zinc-bg)' : 'transparent', color: active ? 'var(--ink)' : 'var(--ink2)',
            fontSize: 13.5, fontWeight: active ? 600 : 500, letterSpacing: '-0.01em', textAlign: 'left', width: '100%',
          }}>
            <it.icon style={{ width: 18, height: 18, opacity: active ? 1 : 0.7 }} />
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.badge > 0 && (
              <span style={{ background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600, minWidth: 20, height: 20, borderRadius: 10, display: 'grid', placeItems: 'center', padding: '0 6px' }}>{it.badge}</span>
            )}
          </button>
        ); })}
      </div>
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <a href="index.html" style={{
          display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 9,
          border: '1px solid var(--line)', background: '#fff', color: 'var(--ink2)', textDecoration: 'none',
          fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.01em',
        }}>
          <Icon.phone style={{ width: 16, height: 16, opacity: 0.7 }} />
          <span style={{ flex: 1 }}>Lihat app pelanggan</span>
          <Icon.arrow style={{ width: 15, height: 15, opacity: 0.6 }} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 34, height: 34, borderRadius: 17, background: '#E4E4E7', color: 'var(--ink2)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600 }}>SR</div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.01em' }}>Sari Ramadhani</span>
            <span style={{ fontSize: 11, color: 'var(--ink3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Manajer Outlet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── stat card ─────────────────────────────────────────────────
function Stat({ label, value, sub, accent }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 18px', flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500, letterSpacing: '-0.01em' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 7, color: accent || 'var(--ink)', whiteSpace: 'nowrap' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--ink3)', marginTop: 3, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

// ── reservation row ───────────────────────────────────────────
function Row({ r, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      display: 'grid', gridTemplateColumns: '2.4fr 1.5fr 1.6fr 1fr 1.3fr 1.2fr', alignItems: 'center', gap: 14,
      padding: '14px 20px', border: 'none', borderBottom: '1px solid var(--line)', cursor: 'pointer', width: '100%', textAlign: 'left',
      background: active ? 'var(--zinc-bg)' : (r._new ? '#FFFBEB' : '#fff'),
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <Avatar name={r.name} brand={r.brand} />
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
            {r._new && <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fff', background: '#D97706', padding: '2px 6px', borderRadius: 5, letterSpacing: '0.04em', animation: 'vpulse 1.6s ease-in-out infinite' }}>BARU</span>}
          </div>
          <span style={{ fontSize: 11.5, color: 'var(--ink3)', fontFamily: 'Geist Mono, monospace', marginTop: 2 }}>{r.code}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <TypeBadge t={r.venueType} />
        <span style={{ fontSize: 11.5, color: 'var(--ink3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.space || '—'}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>{fmtDay(r.date)}</span>
        <span style={{ fontSize: 11.5, color: 'var(--ink3)', marginTop: 2 }}>{r.time} WIB{r.duration ? ` · ${r.duration}` : ''}</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>
        {r.showPax ? `${r.pax} ${r.guestNoun}` : '—'}
        {r.items.length > 0 && <div style={{ fontSize: 11.5, color: 'var(--ink3)', marginTop: 2 }}>{r.items.reduce((s, i) => s + i.qty, 0)} item</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>{rp(r.payNow)}</span>
        <span style={{ fontSize: 11.5, color: 'var(--ink3)', marginTop: 2 }}>{r.payMode === 'full' ? 'Lunas' : 'DP'} · {r.paymentMethod}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><StatusBadge s={r.status} /></div>
    </button>
  );
}

// ── detail drawer ─────────────────────────────────────────────
function Drawer({ r, onClose, onAction }) {
  const [zoom, setZoom] = useState(false);
  useEffect(() => { setZoom(false); }, [r && r.code]);
  if (!r) return null;
  const c = STATUS[r.status];

  function Line({ k, v, mono }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--line2)' }}>
        <span style={{ fontSize: 12.5, color: 'var(--ink3)', fontWeight: 500 }}>{k}</span>
        <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600, letterSpacing: '-0.01em', textAlign: 'right', fontFamily: mono ? 'Geist Mono, monospace' : 'inherit' }}>{v}</span>
      </div>
    );
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(9,9,11,0.4)', zIndex: 40, animation: 'vfade 160ms ease' }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 456, maxWidth: '92vw', background: 'var(--bg)', zIndex: 50,
        boxShadow: '-12px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', animation: 'vslide 220ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        {/* header */}
        <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--line)', background: '#fff', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <Avatar name={r.name} brand={r.brand} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>{r.name}</span>
              <span style={{ fontSize: 12, color: 'var(--ink3)', fontFamily: 'Geist Mono, monospace', marginTop: 2 }}>{r.code} · {ago(r.createdAt)}</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{ width: 34, height: 34, borderRadius: 17, border: '1px solid var(--line)', background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--ink2)' }}><Icon.close style={{ width: 18, height: 18 }} /></button>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <StatusBadge s={r.status} />
            <a href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`} target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--ink2)',
              textDecoration: 'none', border: '1px solid var(--line)', background: '#fff', padding: '7px 12px', borderRadius: 8,
            }}><Icon.phone style={{ width: 15, height: 15 }} /> Hubungi tamu</a>
          </div>

          {/* venue card */}
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 9, background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 19, fontWeight: 700 }}>{r.brand}</div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>{r.venueName}</span>
              <span style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 1 }}>{r.venueType}</span>
            </div>
          </div>

          {/* type-specific key facts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, background: 'var(--accent)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
            {typeFacts(r).map(([k, v], i) => (
              <div key={i} style={{ padding: '13px 14px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, letterSpacing: '-0.01em', marginTop: 5 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* detail lines */}
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '4px 16px 8px', marginBottom: 14 }}>
            <Line k="Tanggal" v={fmtDay(r.date)} />
            <Line k="Jam datang" v={`${r.time} WIB`} />
            {r.duration && <Line k="Durasi" v={r.duration} />}
            <Line k={r.showPax ? r.guestNoun.charAt(0).toUpperCase() + r.guestNoun.slice(1) : 'Pilihan'} v={[r.showPax ? `${r.pax} ${r.guestNoun}` : '', r.space].filter(Boolean).join(' · ') || '—'} />
            {r.email && <Line k="Email" v={r.email} />}
            <Line k="No. HP" v={r.phone} mono />
          </div>

          {/* order */}
          {r.items.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink3)', letterSpacing: '0.02em', marginBottom: 10 }}>{orderLabel(r.venueType)} ({r.items.reduce((s, i) => s + i.qty, 0)} item)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {r.items.map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ minWidth: 24, height: 22, padding: '0 6px', borderRadius: 6, background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{it.qty}×</span>
                      <span style={{ fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em' }}>{it.name}</span>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>{rp(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* note + tags */}
          {(r.note || r.tags.length > 0) && (
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
              {r.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: r.note ? 10 : 0 }}>
                  {r.tags.map((tg) => <span key={tg} style={{ fontSize: 11.5, padding: '4px 9px', borderRadius: 6, background: 'var(--line2)', color: 'var(--ink2)', fontWeight: 500 }}>{tg}</span>)}
                </div>
              )}
              {r.note && <p style={{ margin: 0, fontSize: 13, color: 'var(--ink2)', lineHeight: 1.55, fontStyle: 'italic' }}>"{r.note}"</p>}
            </div>
          )}

          {/* payment + proof */}
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink3)', letterSpacing: '0.02em', marginBottom: 10 }}>Pembayaran</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {r.proofUrl ? (
                <button onClick={() => setZoom(true)} style={{ padding: 0, border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', cursor: 'zoom-in', background: 'none', flexShrink: 0 }}>
                  <div style={{ width: 92, height: 118, background: `url("${r.proofUrl}") center/cover` }} />
                </button>
              ) : (
                <div style={{ width: 92, height: 118, borderRadius: 10, border: '1px dashed var(--line)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 11, color: 'var(--ink3)', textAlign: 'center', padding: 8 }}>Tanpa bukti</div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span style={{ fontSize: 12.5, color: 'var(--ink3)' }}>Total tagihan</span><span style={{ fontSize: 13, fontWeight: 600 }}>{rp(r.grand)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span style={{ fontSize: 12.5, color: 'var(--ink3)' }}>{r.payMode === 'full' ? 'Dibayar (lunas)' : 'DP masuk'}</span><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>{rp(r.payNow)}</span></div>
                {r.remaining > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span style={{ fontSize: 12.5, color: 'var(--ink3)' }}>Sisa di tempat</span><span style={{ fontSize: 13, fontWeight: 600 }}>{rp(r.remaining)}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span style={{ fontSize: 12.5, color: 'var(--ink3)' }}>Metode</span><span style={{ fontSize: 13, fontWeight: 600 }}>{r.paymentMethod}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* action footer */}
        <div style={{ padding: '14px 22px', borderTop: '1px solid var(--line)', background: '#fff', display: 'flex', gap: 10 }}>
          {r.status === 'baru' && (
            <>
              <button onClick={() => onAction(r.code, 'batal')} style={btnGhost}>Tolak</button>
              <button onClick={() => onAction(r.code, 'terkonfirmasi')} style={btnPrimary}><Icon.check style={{ width: 17, height: 17 }} /> Verifikasi & terima</button>
            </>
          )}
          {r.status === 'terkonfirmasi' && (
            <>
              <button onClick={() => onAction(r.code, 'batal')} style={btnGhost}>Batalkan</button>
              <button onClick={() => onAction(r.code, 'selesai')} style={btnPrimary}><Icon.check style={{ width: 17, height: 17 }} /> Tandai selesai</button>
            </>
          )}
          {(r.status === 'selesai' || r.status === 'batal') && (
            <div style={{ flex: 1, textAlign: 'center', fontSize: 13, color: 'var(--ink3)', fontWeight: 500, padding: '10px 0' }}>
              Reservasi {r.status === 'selesai' ? 'sudah selesai' : 'dibatalkan'} — tidak ada aksi lanjutan.
            </div>
          )}
        </div>
      </div>

      {/* proof zoom */}
      {zoom && r.proofUrl && (
        <div onClick={() => setZoom(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(9,9,11,0.82)', zIndex: 60, display: 'grid', placeItems: 'center', cursor: 'zoom-out', animation: 'vfade 160ms ease' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <img src={r.proofUrl} alt="Bukti pembayaran" style={{ maxHeight: '74vh', maxWidth: '88vw', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12.5, fontFamily: 'Geist Mono, monospace' }}>{r.proofName} · klik untuk tutup</span>
          </div>
        </div>
      )}
    </>
  );
}

const btnPrimary = { flex: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em', cursor: 'pointer' };
const btnGhost = { flex: 1, padding: '12px 16px', borderRadius: 9, border: '1px solid var(--line)', background: '#fff', color: 'var(--ink2)', fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em', cursor: 'pointer' };

// ── shared page header ────────────────────────────────────────
function PageHead({ title, sub, right }) {
  return (
    <div style={{ padding: '20px 28px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 23, fontWeight: 700, letterSpacing: '-0.03em' }}>{title}</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13.5, color: 'var(--ink2)' }}>{sub}</p>
      </div>
      {right}
    </div>
  );
}

// ── KALENDER ──────────────────────────────────────────────────
function KalenderView({ records, onOpen }) {
  const [offset, setOffset] = useState(0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const view = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const monthLabel = `${VESTRA_MONTHS_ID[view.getMonth()]} ${view.getFullYear()}`;
  const firstDow = view.getDay();
  const daysIn = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));

  const byDay = useMemo(() => {
    const m = {};
    records.forEach((r) => {
      if (r.status === 'batal' || !r.date) return;
      const d = new Date(r.date); const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      (m[key] = m[key] || []).push(r);
    });
    return m;
  }, [records]);

  function keyOf(d) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
  const brandColor = { 'V': '#2563EB', 'G': '#7C3AED', 'A': '#16A34A', 'R': '#EA580C' };

  return (
    <>
      <PageHead title="Kalender reservasi" sub="Lihat semua reservasi terjadwal per tanggal."
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setOffset(offset - 1)} style={navBtn}><Icon.back style={{ width: 18, height: 18 }} /></button>
            <span style={{ fontSize: 14, fontWeight: 600, minWidth: 130, textAlign: 'center' }}>{monthLabel}</span>
            <button onClick={() => setOffset(offset + 1)} style={navBtn}><Icon.arrow style={{ width: 18, height: 18 }} /></button>
            <button onClick={() => setOffset(0)} style={{ ...navBtn, width: 'auto', padding: '0 14px', fontSize: 13, fontWeight: 600 }}>Hari ini</button>
          </div>
        } />
      <div style={{ padding: '20px 28px 40px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid var(--line)' }}>
            {VESTRA_DAYS_ID.map((d) => (
              <div key={d} style={{ padding: '11px 0', textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: 'var(--ink3)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
            {cells.map((d, i) => {
              const list = d ? (byDay[keyOf(d)] || []) : [];
              const isTd = d && d.getTime() === today.getTime();
              return (
                <div key={i} style={{ minHeight: 116, borderRight: (i % 7 !== 6) ? '1px solid var(--line2)' : 'none', borderBottom: '1px solid var(--line2)', padding: 8, background: d ? '#fff' : 'var(--bg)' }}>
                  {d && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 12.5, fontWeight: isTd ? 700 : 500, color: isTd ? '#fff' : 'var(--ink2)', background: isTd ? 'var(--accent)' : 'transparent', width: 22, height: 22, borderRadius: 11, display: 'grid', placeItems: 'center' }}>{d.getDate()}</span>
                        {list.length > 0 && <span style={{ fontSize: 10.5, color: 'var(--ink3)', fontWeight: 600 }}>{list.length}</span>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {list.slice(0, 3).map((r) => (
                          <button key={r.code} onClick={() => onOpen(r.code)} title={`${r.time} · ${r.name}`} style={{
                            display: 'flex', alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer', textAlign: 'left',
                            background: 'var(--line2)', borderRadius: 5, padding: '3px 6px', width: '100%',
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: 3, background: brandColor[r.brand] || '#999', flexShrink: 0 }} />
                            <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink2)', flexShrink: 0 }}>{r.time}</span>
                            <span style={{ fontSize: 10.5, color: 'var(--ink3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name.split(' ')[0]}</span>
                          </button>
                        ))}
                        {list.length > 3 && <span style={{ fontSize: 10, color: 'var(--ink3)', paddingLeft: 6 }}>+{list.length - 3} lagi</span>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          {[['V', 'Resto & Café'], ['G', 'Barbershop'], ['A', 'Sport venue'], ['R', 'Rental']].map(([b, l]) => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--ink2)', fontWeight: 500 }}>
              <span style={{ width: 9, height: 9, borderRadius: 5, background: brandColor[b] }} />{l}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
const navBtn = { width: 36, height: 36, borderRadius: 9, border: '1px solid var(--line)', background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--ink2)' };

// ── PELANGGAN ─────────────────────────────────────────────────
function PelangganView({ records, onOpen }) {
  const [q, setQ] = useState('');
  const customers = useMemo(() => {
    const m = {};
    records.forEach((r) => {
      const k = r.phone;
      if (!m[k]) m[k] = { name: r.name, phone: r.phone, email: r.email, brand: r.brand, count: 0, spend: 0, last: 0, codes: [], types: new Set() };
      m[k].count += 1;
      if (r.status !== 'batal') m[k].spend += r.payNow;
      m[k].last = Math.max(m[k].last, r.createdAt);
      m[k].codes.push(r.code);
      m[k].types.add(r.venueType);
      if (r.email && !m[k].email) m[k].email = r.email;
    });
    return Object.values(m).sort((a, b) => b.last - a.last);
  }, [records]);
  const list = customers.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q));

  return (
    <>
      <PageHead title="Pelanggan" sub={`${customers.length} pelanggan terdaftar dari reservasi.`}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid var(--line)', borderRadius: 9, padding: '9px 13px', width: 248 }}>
            <Icon.search style={{ width: 17, height: 17, color: 'var(--ink3)' }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama atau no HP…" style={{ border: 'none', outline: 'none', background: 'none', fontSize: 13, width: '100%' }} />
          </div>
        } />
      <div style={{ padding: '20px 28px 40px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.6fr 1fr 1.2fr 1.4fr', gap: 14, padding: '12px 20px', borderBottom: '1px solid var(--line)', background: 'var(--bg)' }}>
            {['Pelanggan', 'Kontak', 'Reservasi', 'Total belanja', 'Terakhir'].map((h) => (
              <span key={h} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink3)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>{h}</span>
            ))}
          </div>
          {list.map((c) => (
            <button key={c.phone} onClick={() => onOpen(c.codes[0])} style={{
              display: 'grid', gridTemplateColumns: '2.2fr 1.6fr 1fr 1.2fr 1.4fr', gap: 14, alignItems: 'center',
              padding: '14px 20px', border: 'none', borderBottom: '1px solid var(--line)', cursor: 'pointer', width: '100%', textAlign: 'left', background: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <Avatar name={c.name} />
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--ink3)', marginTop: 2 }}>{[...c.types].join(' · ')}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: 12.5, fontFamily: 'Geist Mono, monospace', color: 'var(--ink2)' }}>{c.phone}</span>
                {c.email && <span style={{ fontSize: 11.5, color: 'var(--ink3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</span>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{c.count}×</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{rp(c.spend)}</span>
              <span style={{ fontSize: 12.5, color: 'var(--ink2)' }}>{ago(c.last)}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── MENU & TARIF ──────────────────────────────────────────────
function MenuTarifView() {
  const [vid, setVid] = useState(VESTRA_VENUES[0].id);
  const v = VESTRA_VENUES.find((x) => x.id === vid) || VESTRA_VENUES[0];
  return (
    <>
      <PageHead title="Menu & Tarif" sub="Daftar harga layanan, menu, dan tarif sewa per bisnis." />
      <div style={{ padding: '20px 28px 40px' }}>
        {/* venue switch */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {VESTRA_VENUES.map((x) => {
            const on = x.id === vid;
            return (
              <button key={x.id} onClick={() => setVid(x.id)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 13px 6px 7px', borderRadius: 999, cursor: 'pointer',
                border: '1px solid', borderColor: on ? 'var(--accent)' : 'var(--line)', background: on ? 'var(--accent)' : '#fff', color: on ? '#fff' : 'var(--ink2)', fontSize: 13, fontWeight: 600,
              }}>
                <span style={{ width: 22, height: 22, borderRadius: 11, background: on ? 'rgba(255,255,255,0.18)' : 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>{x.brand}</span>
                {x.type}
              </button>
            );
          })}
        </div>

        {/* base rate + booking fee */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
          {v.baseRate ? (
            <div style={{ background: 'var(--accent)', color: '#fff', borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{v.baseLabel}</div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6, whiteSpace: 'nowrap' }}>{rp(v.baseRate)} <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>/ {v.durationNoun}</span></div>
            </div>
          ) : null}
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500 }}>Biaya reservasi</div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6 }}>{v.bookingFee ? rp(v.bookingFee) : 'Gratis'}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink3)', marginTop: 3 }}>{v.bookingFee ? 'Hanya jika tanpa pre-order' : 'Tidak ada biaya reservasi'}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500 }}>Opsi pembayaran</div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 8 }}>{v.allowFull ? 'DP 50% / Bayar penuh' : 'DP 50% saja'}</div>
          </div>
        </div>

        {/* menu/services list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {v.menu.map((cat, ci) => (
            <div key={ci} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--line)', background: 'var(--bg)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>{cat.category}</span>
                {cat.note && <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{cat.note}</span>}
              </div>
              {cat.items.map((it, ii) => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '13px 20px', borderBottom: ii < cat.items.length - 1 ? '1px solid var(--line2)' : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{it.name}</span>
                      {it.badge && <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink2)', background: 'var(--line2)', padding: '2px 7px', borderRadius: 5 }}>{it.badge}</span>}
                    </div>
                    {it.desc && <span style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{it.desc}</span>}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, fontFamily: 'Geist Mono, monospace', whiteSpace: 'nowrap' }}>{rp(it.price)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── PENGATURAN ────────────────────────────────────────────────
function PengaturanView() {
  const [notif, setNotif] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [sound, setSound] = useState(true);

  function Toggle({ on, set, label, sub }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--line2)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{label}</span>
          <span style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{sub}</span>
        </div>
        <button onClick={() => set(!on)} style={{ width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', background: on ? 'var(--accent)' : '#D4D4D8', position: 'relative', transition: 'background 150ms', flexShrink: 0 }}>
          <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: 10, background: '#fff', transition: 'left 150ms', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
        </button>
      </div>
    );
  }

  return (
    <>
      <PageHead title="Pengaturan" sub="Kelola informasi outlet, rekening, dan notifikasi." />
      <div style={{ padding: '20px 28px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, maxWidth: 1000 }}>
        {/* outlet */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 14 }}>Informasi outlet</div>
          {[['Nama bisnis', 'Vestra Group'], ['Alamat', 'Senopati, Jakarta Selatan'], ['Jam operasional', '07:00 – 23:00 WIB'], ['Kontak', '+62 21 8899 1010']].map(([k, val]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11.5, color: 'var(--ink3)', fontWeight: 600, marginBottom: 5 }}>{k}</div>
              <input defaultValue={val} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)', fontSize: 13, color: 'var(--ink)', outline: 'none' }} />
            </div>
          ))}
        </div>

        {/* bank accounts */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 14 }}>Rekening pembayaran</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {VESTRA_BANK_ACCOUNTS.map((b) => (
              <div key={b.bank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 10 }}>
                <div style={{ width: 44, height: 30, borderRadius: 6, background: b.color, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{b.bank}</div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Geist Mono, monospace' }}>{b.rekening}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--ink3)' }}>{b.holder}</span>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 10 }}>
              <div style={{ width: 44, height: 30, borderRadius: 6, background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>QRIS</div>
              <span style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>QRIS aktif untuk semua outlet</span>
            </div>
          </div>
        </div>

        {/* notifications */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '4px 20px 14px', gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', margin: '16px 0 2px' }}>Notifikasi</div>
          <Toggle on={notif} set={setNotif} label="Notifikasi reservasi baru" sub="Tampilkan badge & highlight saat ada reservasi masuk" />
          <Toggle on={sound} set={setSound} label="Suara notifikasi" sub="Bunyi 'ding' setiap reservasi baru diterima" />
          <Toggle on={autoConfirm} set={setAutoConfirm} label="Konfirmasi otomatis" sub="Terima otomatis jika bukti pembayaran lunas" />
        </div>
      </div>
    </>
  );
}

// ── main app ──────────────────────────────────────────────────
function readLocal() {
  try { return JSON.parse(localStorage.getItem('vestra_reservations') || '[]'); } catch (e) { return []; }
}

function AdminApp() {
  const [records, setRecords] = useState(() => {
    const local = readLocal();
    const have = new Set(local.map((r) => r.code));
    return [...local, ...seed().filter((s) => !have.has(s.code))];
  });
  const [tab, setTab] = useState('semua');
  const [venueF, setVenueF] = useState('semua');
  const [query, setQuery] = useState('');
  const [openCode, setOpenCode] = useState(null);
  const [page, setPage] = useState('reservasi');
  const seenCodes = useRef(new Set(records.map((r) => r.code)));

  // poll localStorage for newly submitted reservations from the customer app
  useEffect(() => {
    const id = setInterval(() => {
      const incoming = readLocal().filter((r) => !seenCodes.current.has(r.code));
      if (incoming.length) {
        incoming.forEach((r) => seenCodes.current.add(r.code));
        setRecords((prev) => [...incoming.map((r) => ({ ...r, _new: true })), ...prev]);
      }
    }, 1500);
    return () => clearInterval(id);
  }, []);

  function doAction(code, status) {
    setRecords((prev) => prev.map((r) => r.code === code ? { ...r, status, _new: false } : r));
    setOpenCode(null);
  }

  const counts = useMemo(() => ({
    baru: records.filter((r) => r.status === 'baru').length,
    terkonfirmasi: records.filter((r) => r.status === 'terkonfirmasi').length,
    todayCount: records.filter((r) => isToday(r.date) && r.status !== 'batal').length,
    todayGuests: records.filter((r) => isToday(r.date) && r.status !== 'batal' && r.showPax).reduce((s, r) => s + r.pax, 0),
    revenue: records.filter((r) => r.status === 'terkonfirmasi' || r.status === 'selesai').reduce((s, r) => s + r.payNow, 0),
  }), [records]);

  const venues = useMemo(() => {
    const set = [];
    records.forEach((r) => { if (!set.find((x) => x.type === r.venueType)) set.push({ type: r.venueType }); });
    return set;
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (tab !== 'semua' && r.status !== tab) return false;
      if (venueF !== 'semua' && r.venueType !== venueF) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.code.toLowerCase().includes(q) && !r.phone.includes(q)) return false;
      }
      return true;
    });
  }, [records, tab, venueF, query]);

  const tabs = [
    { id: 'semua', label: 'Semua', n: records.length },
    { id: 'baru', label: 'Perlu ditinjau', n: counts.baru },
    { id: 'terkonfirmasi', label: 'Terkonfirmasi', n: counts.terkonfirmasi },
    { id: 'selesai', label: 'Selesai', n: records.filter((r) => r.status === 'selesai').length },
    { id: 'batal', label: 'Dibatalkan', n: records.filter((r) => r.status === 'batal').length },
  ];

  const open = records.find((r) => r.code === openCode) || null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar counts={counts} page={page} setPage={setPage} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {page === 'kalender' && <KalenderView records={records} onOpen={(c) => { setPage('reservasi'); setOpenCode(c); }} />}
        {page === 'pelanggan' && <PelangganView records={records} onOpen={(c) => { setPage('reservasi'); setOpenCode(c); }} />}
        {page === 'menu' && <MenuTarifView />}
        {page === 'pengaturan' && <PengaturanView />}
        {page === 'reservasi' && <>
        {/* topbar */}
        <div style={{ padding: '20px 28px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 23, fontWeight: 700, letterSpacing: '-0.03em' }}>Reservasi masuk</h1>
            <p style={{ margin: '5px 0 0', fontSize: 13.5, color: 'var(--ink2)' }}>Kelola & verifikasi reservasi dari aplikasi VESTRA.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid var(--line)', borderRadius: 9, padding: '9px 13px', width: 248 }}>
              <Icon.search style={{ width: 17, height: 17, color: 'var(--ink3)' }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama, kode, no HP…" style={{ border: 'none', outline: 'none', background: 'none', fontSize: 13, color: 'var(--ink)', width: '100%' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid var(--line)', borderRadius: 9, padding: '9px 13px', fontSize: 12.5, fontWeight: 600, color: 'var(--ink2)' }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: '#16A34A', animation: 'vpulse 1.8s ease-in-out infinite' }} />Live
            </div>
          </div>
        </div>

        {/* stats */}
        <div style={{ display: 'flex', gap: 14, padding: '18px 28px 0' }}>
          <Stat label="Reservasi hari ini" value={counts.todayCount} sub={`${counts.todayGuests} tamu diharapkan`} />
          <Stat label="Perlu ditinjau" value={counts.baru} sub="Menunggu verifikasi" accent={counts.baru > 0 ? '#B45309' : undefined} />
          <Stat label="Terkonfirmasi" value={counts.terkonfirmasi} sub="Siap dilayani" />
          <Stat label="DP & pembayaran masuk" value={rp(counts.revenue)} sub="Dari reservasi aktif" />
        </div>

        {/* filter bar */}
        <div style={{ padding: '20px 28px 0' }}>
          {/* business-type chips — admin covers all 4 reservation types */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {[{ type: 'semua', brand: '', label: 'Semua bisnis' }, { type: 'Resto & Café', brand: 'V' }, { type: 'Barbershop', brand: 'G' }, { type: 'Sport venue', brand: 'A' }, { type: 'Rental', brand: 'R' }].map((v) => {
              const on = venueF === v.type;
              const n = v.type === 'semua' ? records.length : records.filter((r) => r.venueType === v.type).length;
              return (
                <button key={v.type} onClick={() => setVenueF(v.type)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: v.brand ? '6px 13px 6px 7px' : '6px 13px', borderRadius: 999, cursor: 'pointer',
                  border: '1px solid', borderColor: on ? 'var(--accent)' : 'var(--line)',
                  background: on ? 'var(--accent)' : '#fff', color: on ? '#fff' : 'var(--ink2)',
                  fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
                }}>
                  {v.brand && <span style={{ width: 22, height: 22, borderRadius: 11, background: on ? 'rgba(255,255,255,0.18)' : 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>{v.brand}</span>}
                  {v.label || v.type}
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 999, background: on ? 'rgba(255,255,255,0.22)' : 'var(--line2)', color: on ? '#fff' : 'var(--ink3)' }}>{n}</span>
                </button>
              );
            })}
          </div>
          {/* status tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid var(--line)', paddingBottom: 14 }}>
            {tabs.map((tb) => (
              <button key={tb.id} onClick={() => setTab(tb.id)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: 8, cursor: 'pointer',
                border: '1px solid', borderColor: tab === tb.id ? 'var(--accent)' : 'var(--line)',
                background: tab === tb.id ? 'var(--accent)' : '#fff', color: tab === tb.id ? '#fff' : 'var(--ink2)',
                fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
              }}>
                {tb.label}
                <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 999, background: tab === tb.id ? 'rgba(255,255,255,0.22)' : 'var(--line2)', color: tab === tb.id ? '#fff' : 'var(--ink3)' }}>{tb.n}</span>
              </button>
            ))}
          </div>
        </div>

        {/* table */}
        <div style={{ padding: '0 28px 40px', flex: 1 }}>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', marginTop: 16 }}>
            {/* head */}
            <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1.5fr 1.6fr 1fr 1.3fr 1.2fr', gap: 14, padding: '12px 20px', borderBottom: '1px solid var(--line)', background: 'var(--bg)' }}>
              {['Tamu', 'Jenis & tempat', 'Jadwal', 'Jumlah', 'Pembayaran', 'Status'].map((h, i) => (
                <span key={h} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink3)', letterSpacing: '0.03em', textTransform: 'uppercase', textAlign: i === 5 ? 'right' : 'left' }}>{h}</span>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink3)', fontSize: 14 }}>Tidak ada reservasi pada filter ini.</div>
            ) : filtered.map((r) => (
              <Row key={r.code} r={r} active={openCode === r.code} onClick={() => setOpenCode(r.code)} />
            ))}
          </div>
        </div>
        </>}
      </div>

      <Drawer r={open} onClose={() => setOpenCode(null)} onAction={doAction} />
    </div>
  );
}

export default AdminApp;
