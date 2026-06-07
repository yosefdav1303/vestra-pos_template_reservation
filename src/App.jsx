import React, { useState } from 'react';
import { IOSDevice } from './IOSFrame.jsx';
import { VESTRA_THEMES, VESTRA_ACCENTS, VESTRA_VENUES } from './data.jsx';
import {
  DetailScreen, DateTimeScreen, PartyScreen,
  MenuScreen, GuestScreen, RequestScreen,
  PaymentScreen, UploadProofScreen, ConfirmScreen,
  CheckBookingScreen,
} from './screens.jsx';

// ──────────────────────────────────────────────────────────────
// Inline tweaks (theme + accent) — replaces the HTML-prototype
// tweaks-panel for a clean React-only build.
// ──────────────────────────────────────────────────────────────
function TweaksFab({ accent, setAccent }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(o => !o)} aria-label="Tweaks" style={{
        position: 'fixed', right: 18, bottom: 18, zIndex: 100,
        width: 48, height: 48, borderRadius: 24, cursor: 'pointer',
        background: '#1F1612', color: '#F4EDE2', border: '1px solid rgba(255,255,255,0.15)',
        display: 'grid', placeItems: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        fontFamily: 'Geist, sans-serif', fontSize: 18, fontWeight: 600,
      }}>{open ? '×' : '⚙'}</button>
      {open && (
        <div style={{
          position: 'fixed', right: 18, bottom: 78, zIndex: 100,
          background: '#1F1612', color: '#F4EDE2',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10,
          padding: 16, width: 260, fontFamily: 'Geist, sans-serif',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(250,250,250,0.55)', textTransform: 'uppercase', marginBottom: 10 }}>Accent color</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {Object.entries(VESTRA_ACCENTS).map(([key, a]) => (
              <button key={key} onClick={() => setAccent(key)} aria-label={a.name} title={a.name} style={{
                width: 32, height: 32, borderRadius: 10, cursor: 'pointer',
                background: a.hex, border: accent === key ? '2px solid #F4EDE2' : '1px solid rgba(255,255,255,0.2)',
                padding: 0,
              }}/>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [accentName, setAccentName] = useState('zinc');
  const t = VESTRA_THEMES.cream;
  const a = VESTRA_ACCENTS[accentName];

  // Navigation — start on the venue detail page
  const [screen, setScreen] = useState('detail');
  // Switchable venue preset — same flow for café, restoran, barber, sewa lapangan
  const [venueId, setVenueId] = useState(VESTRA_VENUES[0].id);
  const cafe = VESTRA_VENUES.find(v => v.id === venueId) || VESTRA_VENUES[0];

  // Booking state
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const [booking, setBooking] = useState({
    date: tomorrow,
    time: '19:00',
    pax: 2,
    tableType: 'indoor',
    duration: '',
    payMode: 'dp',
    menu: {},
    paymentMethod: 'qris',
    proofFile: null,
    name: '',
    phone: '',
    email: '',
    tags: [],
    note: '',
  });

  const go = (s) => setScreen(s);
  const pickVenue = (id) => {
    const v = VESTRA_VENUES.find(x => x.id === id) || VESTRA_VENUES[0];
    setVenueId(id);
    setScreen('detail');
    setBooking(b => ({
      ...b, tableType: '', duration: '', payMode: 'dp', menu: {}, paymentMethod: 'qris', proofFile: null,
      pax: v.defaultPax || 1,
      name: '', phone: '', email: '', tags: [], note: '',
    }));
  };
  const startReservation = () => setScreen('datetime');
  const backToStart = () => {
    setScreen('detail');
    setBooking(b => ({ ...b, name: '', phone: '', email: '', tags: [], note: '', menu: {}, duration: '', payMode: 'dp', paymentMethod: 'qris', proofFile: null, pax: cafe.defaultPax || 1 }));
  };

  let content = null;
  if (screen === 'detail') {
    content = <DetailScreen t={t} accent={a} cafe={cafe} onBack={backToStart} onReserve={startReservation} onOpenTweaks={() => {}} onCheckBooking={() => go('check')} />;
  } else if (screen === 'datetime') {
    content = <DateTimeScreen t={t} accent={a} cafe={cafe} booking={booking} setBooking={setBooking}
      onBack={() => go('detail')} onNext={() => go('party')} />;
  } else if (screen === 'party') {
    content = <PartyScreen t={t} accent={a} cafe={cafe} booking={booking} setBooking={setBooking}
      onBack={() => go('datetime')} onNext={() => go('menu')} />;
  } else if (screen === 'menu') {
    content = <MenuScreen t={t} accent={a} cafe={cafe} booking={booking} setBooking={setBooking}
      onBack={() => go('party')} onNext={() => go('guest')} />;
  } else if (screen === 'guest') {
    content = <GuestScreen t={t} accent={a} cafe={cafe} booking={booking} setBooking={setBooking}
      onBack={() => go('menu')} onNext={() => go('request')} />;
  } else if (screen === 'request') {
    content = <RequestScreen t={t} accent={a} cafe={cafe} booking={booking} setBooking={setBooking}
      onBack={() => go('guest')} onSubmit={() => go('payment')} />;
  } else if (screen === 'payment') {
    content = <PaymentScreen t={t} accent={a} cafe={cafe} booking={booking} setBooking={setBooking}
      onBack={() => go('request')} onSubmit={() => go('upload')} />;
  } else if (screen === 'upload') {
    content = <UploadProofScreen t={t} accent={a} cafe={cafe} booking={booking} setBooking={setBooking}
      onBack={() => go('payment')} onSubmit={() => go('confirm')} />;
  } else if (screen === 'confirm') {
    content = <ConfirmScreen t={t} accent={a} cafe={cafe} booking={booking} onDone={backToStart} />;
  } else if (screen === 'check') {
    content = <CheckBookingScreen t={t} accent={a} onBack={() => go('detail')} />;
  }

  const screenLabel = {
    detail: '01 Detail', datetime: '02 Date & Time',
    party: '03 Party', menu: '04 Menu',
    guest: '05 Guest', request: '06 Request',
    payment: '07 Payment', upload: '08 Upload',
    confirm: '09 Confirm',
  }[screen];

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <div style={{
          fontFamily: 'Geist, sans-serif', fontSize: 10, letterSpacing: '0.32em',
          color: 'rgba(250,250,250,0.55)', textTransform: 'uppercase',
        }}>VESTRA · Reservations · iOS · Universal booking</div>
        <a href="admin.html" style={{
          position: 'absolute', top: 0, right: 0,
          display: 'inline-flex', alignItems: 'center', gap: 7, textDecoration: 'none',
          padding: '8px 13px', borderRadius: 9, background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(250,250,250,0.8)',
          fontFamily: 'Geist, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
        }}>Dashboard admin →</a>
        <div style={{
          fontFamily: 'Geist, sans-serif', fontSize: 28, fontWeight: 700,
          color: 'rgba(250,250,250,0.95)', letterSpacing: '-0.025em', textAlign: 'center',
        }}>Satu alur reservasi, <span style={{ color: a.hex }}>untuk bisnis apa saja.</span></div>

        <div style={{ display: 'flex', gap: 6, marginTop: 4, padding: 4, borderRadius: 12,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
          {VESTRA_VENUES.map(v => {
            const on = v.id === venueId;
            return (
              <button key={v.id} onClick={() => pickVenue(v.id)} style={{
                border: 'none', cursor: 'pointer', padding: '8px 14px', borderRadius: 9,
                background: on ? '#FAFAFA' : 'transparent',
                color: on ? '#09090B' : 'rgba(250,250,250,0.7)',
                fontFamily: 'Geist, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
                transition: 'all 150ms ease',
              }}>{v.type}</button>
            );
          })}
        </div>
      </div>

      <div data-screen-label={screenLabel} style={{ position: 'relative' }}>
        {[{ top: -14, left: -14, b: 'tl' }, { top: -14, right: -14, b: 'tr' }, { bottom: -14, left: -14, b: 'bl' }, { bottom: -14, right: -14, b: 'br' }].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', width: 18, height: 18, pointerEvents: 'none',
            top: c.top, left: c.left, right: c.right, bottom: c.bottom,
            borderTop: c.b.includes('t') ? '1px solid rgba(250,250,250,0.25)' : 'none',
            borderBottom: c.b.includes('b') ? '1px solid rgba(250,250,250,0.25)' : 'none',
            borderLeft: c.b.includes('l') ? '1px solid rgba(250,250,250,0.25)' : 'none',
            borderRight: c.b.includes('r') ? '1px solid rgba(250,250,250,0.25)' : 'none',
          }}/>
        ))}

        <IOSDevice width={392} height={840} dark={t.dark} scrollKey={screen}>
          {content}
        </IOSDevice>

        <div style={{
          position: 'absolute', top: 0, right: -92, width: 80,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 10, color: 'rgba(250,250,250,0.55)', letterSpacing: '0.18em' }}>FLOW</div>
          {[
            ['detail', '01', 'Restoran'],
            ['datetime', '02', 'Tanggal'],
            ['party', '03', 'Tamu'],
            ['menu', '04', 'Menu'],
            ['guest', '05', 'Data'],
            ['request', '06', 'Catatan'],
            ['payment', '07', 'Bayar'],
            ['upload', '08', 'Bukti'],
            ['confirm', '09', 'Selesai'],
          ].map(([s, n, l]) => {
            const active = s === screen;
            return (
              <button key={s} onClick={() => setScreen(s)} style={{
                background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer',
                color: active ? a.hex : 'rgba(250,250,250,0.55)',
                fontFamily: 'Geist, sans-serif', fontSize: 11, letterSpacing: '0.04em',
                padding: 0, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  width: active ? 16 : 8, height: 1, background: active ? a.hex : 'rgba(250,250,250,0.35)',
                  transition: 'all 200ms ease',
                }}/>
                <span>{n}</span>
                <span style={{ opacity: active ? 1 : 0.7, fontFamily: 'Geist, sans-serif', fontWeight: 500, letterSpacing: '-0.01em', fontSize: 12 }}>{l}</span>
              </button>
            );
          })}
        </div>

        <div style={{
          position: 'absolute', top: 0, left: -130, width: 110,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 10, color: 'rgba(250,250,250,0.55)', letterSpacing: '0.18em' }}>EST. 2026</div>
          <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 40, fontWeight: 700, color: 'rgba(250,250,250,0.9)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>
            Book<br/>it.<br/>Done.
          </div>
          <div style={{ width: 32, height: 1, background: 'rgba(250,250,250,0.35)', margin: '8px 0' }}/>
          <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 9, color: 'rgba(250,250,250,0.45)', letterSpacing: '0.14em', lineHeight: 1.6 }}>
            CAFÉ · RESTO<br/>BARBER · ARENA<br/>JKT · BDG · SBY
          </div>
        </div>
      </div>

      <div style={{
        fontFamily: 'Geist, sans-serif', fontSize: 10, letterSpacing: '0.22em',
        color: 'rgba(250,250,250,0.45)', textTransform: 'uppercase', marginTop: 8,
      }}>{screenLabel} · {t.name} · {a.name}</div>

      <TweaksFab accent={accentName} setAccent={setAccentName}/>
    </div>
  );
}
