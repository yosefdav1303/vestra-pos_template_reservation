import React from 'react';
import {
  VESTRA_THEMES, VESTRA_ACCENTS, VESTRA_CAFES,
  VESTRA_TIME_SLOTS, cafe.spaceTypes, VESTRA_REQUEST_TAGS,
  cafe.menu, VESTRA_DP, VESTRA_PAYMENT_METHODS, VESTRA_BANK_ACCOUNTS,
  VESTRA_MONTHS_ID, VESTRA_DAYS_ID, VESTRA_DAYS_FULL_ID,
  vestraFmtDate, vestraFmtDateShort, vestraFmtRp, vestraComputeBill, Icon,
} from './data.jsx';
// screens.jsx — all 7 screens for VESTRA reservation flow
// Theme + accent come in via props (t = theme tokens, a = accent tokens)

// ──────────────────────────────────────────────────────────────
// Shared atoms
// ──────────────────────────────────────────────────────────────
function Stack({ children, gap = 12, style = {}, ...rest }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }} {...rest}>{children}</div>;
}
function Row({ children, gap = 8, align = 'center', justify = 'flex-start', style = {}, ...rest }) {
  return <div style={{ display: 'flex', alignItems: align, justifyContent: justify, gap, ...style }} {...rest}>{children}</div>;
}

function TopBar({ t, onBack, title, action, transparent = false, accent }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 20,
      padding: '52px 18px 12px 18px',
      background: transparent ? 'transparent' : t.bg,
      borderBottom: transparent ? 'none' : `1px solid ${t.line}`
    }}>
      <Row justify="space-between">
        <button onClick={onBack} aria-label="Back" style={{
          width: 38, height: 38, borderRadius: 19, border: 'none',
          background: transparent ? 'rgba(0,0,0,0.32)' : t.chip,
          color: transparent ? '#fff' : t.ink,
          display: 'grid', placeItems: 'center', cursor: 'pointer',
          backdropFilter: transparent ? 'blur(10px)' : 'none'
        }}>
          <Icon.back />
        </button>
        {title && <div style={{
          fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 600, color: transparent ? '#fff' : t.ink, letterSpacing: '-0.01em'
        }}>{title}</div>}
        {action || <div style={{ width: 38 }} />}
      </Row>
    </div>);

}

function PrimaryButton({ children, onClick, disabled, accent, t, sub }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? t.chip : accent.hex,
      color: disabled ? t.ink3 : accent.on,
      padding: '18px 20px', borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: 'Geist, sans-serif', fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em',
      transition: 'transform 120ms ease, opacity 120ms ease',
      opacity: disabled ? 0.7 : 1
    }}>
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <span>{children}</span>
        {sub && <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 400, fontFamily: 'Geist, sans-serif', letterSpacing: '0.04em' }}>{sub}</span>}
      </span>
      <span style={{ display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.18)' }}>
        <Icon.arrow />
      </span>
    </button>);

}

function BottomDock({ t, children }) {
  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 30,
      marginTop: 'auto',
      padding: '14px 18px 38px 18px',
      background: `linear-gradient(to top, ${t.bg} 70%, ${t.bg}EE 90%, ${t.bg}00)`
    }}>{children}</div>);

}

function StepDots({ count, idx, t, accent }) {
  return (
    <Row gap={6}>
      {Array.from({ length: count }).map((_, i) =>
      <div key={i} style={{
        height: 3, borderRadius: 2,
        width: i === idx ? 22 : 14,
        background: i <= idx ? accent.hex : t.chip,
        transition: 'all 200ms ease'
      }} />
      )}
    </Row>);

}

function Display({ children, size = 28, italic = true, style = {} }) {
  return <h2 style={{
    margin: 0, fontFamily: 'Geist, sans-serif',
    fontStyle: 'normal',
    fontWeight: 700, fontSize: size, lineHeight: 1.1, letterSpacing: '-0.025em',
    ...style
  }}>{children}</h2>;
}

function Eyebrow({ children, color, style = {} }) {
  return <div style={{
    fontFamily: 'Geist, sans-serif',
    fontSize: 11, letterSpacing: '0',
    textTransform: 'none', fontWeight: 500, lineHeight: 1.3,
    color, ...style,
  }}>{children}</div>;
}

// ──────────────────────────────────────────────────────────────
// CEK BOOKING (lookup by phone)
// ──────────────────────────────────────────────────────────────

// Hardcoded sample lookup — in real app this hits an API.
const VESTRA_SAMPLE_BOOKINGS = [
  {
    code: 'VST-9KL2-487',
    date: 'Jumat, 22 Mei 2026',
    dateShort: '22 Mei 2026',
    weekday: 'Jumat',
    time: '19:00',
    pax: 2,
    tableType: 'Outdoor',
    dpTotal: 50000,
    status: 'Terkonfirmasi',
  },
  {
    code: 'VST-4MX7-218',
    date: 'Sabtu, 30 Mei 2026',
    dateShort: '30 Mei 2026',
    weekday: 'Sabtu',
    time: '11:30',
    pax: 4,
    tableType: 'Indoor',
    dpTotal: 75000,
    status: 'Menunggu verifikasi',
  },
];

function CheckBookingScreen({ t, accent, onBack }) {
  const [phone, setPhone] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const phoneDigits = phone.replace(/\D/g, '');
  const ok = phoneDigits.length >= 6;
  const results = submitted ? VESTRA_SAMPLE_BOOKINGS : [];

  function submit() {
    if (!ok) return;
    setSubmitted(true);
  }

  return (
    <div style={{ background: t.bg, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} onBack={onBack} title="Cek booking"/>

      <div style={{ padding: '8px 22px 200px 22px' }}>
        <Eyebrow color={t.ink3} style={{ marginTop: 18 }}>Cari reservasi</Eyebrow>
        <Display size={30} style={{ marginTop: 6 }}>Masukin nomor HP <span style={{ color: accent.hex }}>kamu.</span></Display>
        <p style={{ margin: '8px 0 0 0', fontSize: 13, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.55 }}>
          Kami cari semua reservasi yang pernah pakai nomor ini. Aman, gak share data.
        </p>

        {/* Phone input */}
        <div style={{ marginTop: 22 }}>
          <Stack gap={8}>
            <Eyebrow color={t.ink3}>Nomor HP</Eyebrow>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: t.card, border: `1px solid ${t.line}`, borderRadius: 8,
              padding: '14px 16px',
            }}>
              <Icon.phone style={{ color: t.ink2, width: 18, height: 18 }}/>
              <input
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setSubmitted(false); }}
                placeholder="+62 812-3456-7890"
                type="tel"
                inputMode="tel"
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: 'Geist, sans-serif', fontSize: 15, color: t.ink, letterSpacing: '-0.01em',
                }}/>
            </div>
            <span style={{ fontSize: 11, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>
              Sama dengan nomor saat reservasi (min. 6 angka).
            </span>
          </Stack>
        </div>

        <button onClick={submit} disabled={!ok} style={{
          width: '100%', marginTop: 18, padding: '14px 16px', borderRadius: 8,
          border: 'none', cursor: ok ? 'pointer' : 'not-allowed',
          background: ok ? accent.hex : t.chip,
          color: ok ? accent.on : t.ink3,
          fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          opacity: ok ? 1 : 0.7,
        }}>
          <Icon.search style={{ width: 18, height: 18 }}/>
          Cari reservasi
        </button>

        {/* Results */}
        {submitted && (
          <div style={{ marginTop: 28 }}>
            <Row justify="space-between" align="baseline" style={{ marginBottom: 12 }}>
              <Display size={20} italic={false} style={{ fontFamily: 'Geist, sans-serif', fontWeight: 600 }}>
                {results.length} reservasi ditemukan
              </Display>
              <Eyebrow color={t.ink3}>untuk +{phoneDigits.slice(0, 4)}…</Eyebrow>
            </Row>

            <Stack gap={12}>
              {results.map((b) => (
                <div key={b.code} style={{
                  background: t.card, borderRadius: 10, border: `1px solid ${t.line}`,
                  padding: '16px 18px',
                }}>
                  <Row justify="space-between" align="baseline">
                    <Eyebrow color={t.ink3}>{b.code}</Eyebrow>
                    <span style={{
                      fontSize: 10, padding: '3px 8px', borderRadius: 6,
                      background: b.status === 'Terkonfirmasi' ? `${accent.hex}1F` : t.chip,
                      color: b.status === 'Terkonfirmasi' ? accent.hex : t.ink2,
                      fontFamily: 'Geist, sans-serif', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase',
                    }}>{b.status}</span>
                  </Row>

                  <Row justify="space-between" align="flex-end" style={{ marginTop: 10 }}>
                    <Stack gap={3}>
                      <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>
                        Kopi Vestra
                      </span>
                      <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 12, color: t.ink2 }}>
                        {b.dateShort} · {b.pax} orang · {b.tableType}
                      </span>
                    </Stack>
                    <span style={{
                      fontFamily: 'Geist, sans-serif',
                      fontSize: 26, color: accent.hex, letterSpacing: '-0.02em', lineHeight: 1,
                    }}>{b.time}</span>
                  </Row>

                  <div style={{ height: 1, background: t.line, margin: '14px 0 12px 0' }}/>

                  <Row justify="space-between" align="center">
                    <Stack gap={2}>
                      <Eyebrow color={t.ink3}>DP sudah dibayar</Eyebrow>
                      <span style={{ fontFamily: 'Geist, sans-serif', fontWeight: 700, fontSize: 14, color: t.ink, letterSpacing: '-0.01em' }}>
                        {vestraFmtRp(b.dpTotal)}
                      </span>
                    </Stack>
                    <button style={{
                      padding: '9px 14px', borderRadius: 10, cursor: 'pointer',
                      border: `1px solid ${t.line}`, background: 'transparent',
                      color: t.ink, fontFamily: 'Geist, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      Lihat e-ticket
                      <Icon.arrow style={{ width: 14, height: 14 }}/>
                    </button>
                  </Row>
                </div>
              ))}
            </Stack>

            {/* Need help */}
            <div style={{
              marginTop: 16, padding: '12px 14px', background: t.bg2, borderRadius: 12,
              border: `1px dashed ${t.line}`,
            }}>
              <p style={{ margin: 0, fontSize: 11, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.5 }}>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 14, color: t.ink, marginRight: 4 }}>
                  Belum nemu?
                </span>
                Cek nomor yang dipakai saat reservasi, atau hubungi kami via WhatsApp.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 1. BROWSE
// ──────────────────────────────────────────────────────────────
function BrowseScreen({ t, accent, onOpenCafe, onOpenTweaks }) {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('Semua');
  const filters = ['Semua', 'Brunch', 'Specialty', 'Late night', 'Outdoor'];

  const featured = VESTRA_CAFES[0];
  const rest = VESTRA_CAFES.slice(1);

  return (
    <div style={{ background: t.bg, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '56px 20px 0 20px' }}>
        <Row justify="space-between" align="center">
          <Stack gap={2}>
            <Eyebrow color={t.ink3}>Halo, Aldi</Eyebrow>
            <Display size={26}>Mau ngopi di mana <span style={{ color: accent.hex }}>hari ini?</span></Display>
          </Stack>
          <button onClick={onOpenTweaks} aria-label="Theme" style={{
            width: 42, height: 42, borderRadius: 21, border: `1px solid ${t.line}`,
            background: t.card, color: t.ink, display: 'grid', placeItems: 'center', cursor: 'pointer'
          }}>
            <Icon.sliders />
          </button>
        </Row>

        {/* Search */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10,
          background: t.card, border: `1px solid ${t.line}`, borderRadius: 10, padding: '14px 16px'
        }}>
          <Icon.search style={{ color: t.ink2 }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kedai, area, atau biji kopi…"
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'Geist, sans-serif', fontSize: 14, color: t.ink, letterSpacing: '-0.01em' }} />
          <div style={{ width: 1, height: 18, background: t.line }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.ink2 }}>
            <Icon.pin /><span style={{ fontSize: 12, fontWeight: 500 }}>Jakarta</span>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, overflowX: 'auto', paddingBottom: 4,
          marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20,
          scrollbarWidth: 'none'
        }}>
          {filters.map((f) =>
          <button key={f} onClick={() => setFilter(f)} style={{
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            padding: '10px 16px', borderRadius: 999,
            background: filter === f ? t.ink : t.card,
            color: filter === f ? t.bg : t.ink2,
            border: filter === f ? 'none' : `1px solid ${t.line}`,
            fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em'
          }}>{f}</button>
          )}
        </div>
      </div>

      {/* Featured */}
      <div style={{ padding: '22px 20px 0 20px' }}>
        <Row justify="space-between" align="baseline" style={{ marginBottom: 12 }}>
          <Eyebrow color={t.ink3}>Featured · Editor's pick</Eyebrow>
          <Eyebrow color={t.ink3}>01 / 05</Eyebrow>
        </Row>
        <button onClick={() => onOpenCafe(featured.id)} style={{
          width: '100%', textAlign: 'left', border: 'none', padding: 0, background: 'transparent', cursor: 'pointer'
        }}>
          <div style={{
            position: 'relative', borderRadius: 24, overflow: 'hidden', aspectRatio: '4 / 5',
            background: `url("${featured.hero}") center/cover, ${t.bg2}`
          }}>
            <div style={{ position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 45%, transparent 80%)' }} />
            <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.92)', color: '#1F1612',
                fontFamily: 'Geist, sans-serif', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>
                <Icon.flame style={{ color: accent.hex }} />Trending
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center',
                background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(10px)', color: '#fff'
              }}><Icon.bookmark /></div>
            </div>
            <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, color: '#fff' }}>
              <Row gap={6} style={{ marginBottom: 8 }}>
                <Icon.star style={{ color: '#F2C94C' }} />
                <span style={{ fontSize: 12, fontFamily: 'Geist, sans-serif', letterSpacing: '0.04em' }}>
                  {featured.rating} · {featured.reviews} ulasan
                </span>
              </Row>
              <Display size={32} style={{ color: '#fff', marginBottom: 6 }}>{featured.name}</Display>
              <Row gap={10} style={{ opacity: 0.92, fontSize: 12 }}>
                <Row gap={4}><Icon.pin />{featured.area}</Row>
                <span style={{ opacity: 0.5 }}>·</span>
                <span>{featured.distance}</span>
                <span style={{ opacity: 0.5 }}>·</span>
                <span>{featured.price}</span>
              </Row>
            </div>
          </div>
        </button>
      </div>

      {/* List */}
      <div style={{ padding: '26px 20px 140px 20px' }}>
        <Row justify="space-between" align="baseline" style={{ marginBottom: 14 }}>
          <Display size={22} italic={false} style={{ fontFamily: 'Geist, sans-serif', fontWeight: 600 }}>
            Sekitar kamu
          </Display>
          <Eyebrow color={t.ink3}>{rest.length} kedai</Eyebrow>
        </Row>
        <Stack gap={14}>
          {rest.map((c) =>
          <button key={c.id} onClick={() => onOpenCafe(c.id)} style={{
            border: `1px solid ${t.line}`, background: t.card, padding: 10, borderRadius: 10,
            display: 'flex', gap: 14, alignItems: 'stretch', cursor: 'pointer', textAlign: 'left'
          }}>
              <div style={{
              width: 96, minWidth: 96, height: 96, borderRadius: 12,
              background: `url("${c.hero}") center/cover, ${t.bg2}`
            }} />
              <Stack gap={4} style={{ flex: 1, padding: '4px 4px 4px 0' }}>
                <Row justify="space-between">
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>
                    {c.name}
                  </span>
                  <Row gap={3}>
                    <Icon.star style={{ color: accent.hex, width: 12, height: 12 }} />
                    <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, color: t.ink2, fontWeight: 500 }}>{c.rating}</span>
                  </Row>
                </Row>
                <span style={{ fontSize: 12, color: t.ink2, fontFamily: 'Geist, sans-serif' }}>{c.tagline}</span>
                <Row gap={6} style={{ marginTop: 'auto', fontSize: 11, color: t.ink3, fontFamily: 'Geist, sans-serif', letterSpacing: '0.04em' }}>
                  <Icon.pin style={{ width: 12, height: 12 }} />{c.area}
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>{c.distance}</span>
                </Row>
                <Row gap={6} style={{ marginTop: 2 }}>
                  {c.tags.slice(0, 2).map((tag) =>
                <span key={tag} style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 6, background: t.chip,
                  color: t.ink2, fontFamily: 'Geist, sans-serif', fontWeight: 500
                }}>{tag}</span>
                )}
                </Row>
              </Stack>
            </button>
          )}
        </Stack>
      </div>
    </div>);

}

// ──────────────────────────────────────────────────────────────
// 2. DETAIL
// ──────────────────────────────────────────────────────────────
function DetailScreen({ t, accent, cafe, onBack, onReserve, onOpenTweaks, onCheckBooking }) {
  return (
    <div style={{ background: t.bg, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{
        position: 'relative', height: 380,
        background: `url("${cafe.hero}") center/cover, ${t.bg2}`
      }}>
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0) 35%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45))' }} />
        {/* Custom header — brand mark left, actions right (this is the home/single-venue screen) */}
        <div style={{ position: 'sticky', top: 0, zIndex: 20, padding: '52px 18px 12px 18px' }}>
          <Row justify="space-between">
            <Row gap={10}>
              <div style={{
                width: 38, height: 38, borderRadius: 19,
                background: 'rgba(255,255,255,0.95)', color: '#1F1612',
                display: 'grid', placeItems: 'center',
                fontFamily: 'Geist, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em'
              }}>{cafe.brand}</div>
              <div style={{ display: 'flex', flexDirection: 'column', color: '#fff' }}>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 12, lineHeight: 1.2, opacity: 0.85 }}>halo, selamat datang di</span>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>{cafe.name}</span>
              </div>
            </Row>
            <Row gap={8}>
              <button onClick={onCheckBooking} aria-label="Cek booking saya" style={{
                width: 38, height: 38, borderRadius: 19, border: 'none',
                background: 'rgba(0,0,0,0.32)', color: '#fff', backdropFilter: 'blur(10px)',
                display: 'grid', placeItems: 'center', cursor: 'pointer'
              }}><Icon.clock /></button>
            </Row>
          </Row>
        </div>
        {/* Page indicators */}
        <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
          {[0, 1, 2, 3].map((i) =>
          <div key={i} style={{
            width: i === 0 ? 18 : 5, height: 5, borderRadius: 3,
            background: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)'
          }} />
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{
        position: 'relative', marginTop: -28, borderRadius: '28px 28px 0 0',
        background: t.bg, padding: '22px 22px 200px 22px'
      }}>
        <Row justify="space-between" align="center">
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'Geist, sans-serif', fontSize: 11, fontWeight: 600, color: t.ink2,
            background: t.bg2, border: `1px solid ${t.line}`, borderRadius: 999, padding: '4px 10px',
          }}>{cafe.type}</span>
          <Row gap={4}>
            <Icon.star style={{ color: accent.hex, width: 13, height: 13 }} />
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 600, color: t.ink }}>{cafe.rating}</span>
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 12, color: t.ink3 }}>({cafe.reviews})</span>
          </Row>
        </Row>
        <Display size={32} style={{ marginTop: 10 }}>{cafe.name}</Display>
        <Row gap={5} style={{ marginTop: 8, color: t.ink2 }}>
          <Icon.pin style={{ width: 14, height: 14 }} />
          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13 }}>{cafe.location}</span>
          <span style={{ color: t.ink3 }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Geist, sans-serif', fontSize: 13 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: '#22C55E' }} />Buka sekarang
          </span>
        </Row>

        {/* Meta strip */}
        <div style={{
          marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0,
          background: t.card, border: `1px solid ${t.line}`, borderRadius: 10, overflow: 'hidden'
        }}>
          {[
          { icon: <Icon.clock />, label: 'Jam buka', value: cafe.hours },
          { icon: <Icon.receipt style={{ width: 16, height: 16 }} />, label: cafe.priceLabel, value: cafe.priceValue },
          { icon: <Icon.star style={{ width: 16, height: 16 }} />, label: 'Rating', value: `${cafe.rating} / 5` }].
          map((m, i) =>
          <div key={i} style={{
            padding: '14px 12px', borderLeft: i > 0 ? `1px solid ${t.line}` : 'none',
            display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start'
          }}>
              <div style={{ color: t.ink3 }}>{m.icon}</div>
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, color: t.ink3, fontWeight: 500 }}>{m.label}</span>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.ink, fontFamily: 'Geist, sans-serif', letterSpacing: '-0.01em' }}>{m.value}</div>
            </div>
          )}
        </div>

        {/* Highlights — generic trust facts, works for any venue type */}
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          {cafe.highlights.map((h, i) => (
            <div key={i} style={{
              flex: 1, background: t.bg2, borderRadius: 10, padding: '12px 12px',
              display: 'flex', flexDirection: 'column', gap: 3,
            }}>
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, color: t.ink3, fontWeight: 500 }}>{h.k}</span>
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 700, color: t.ink, letterSpacing: '-0.01em' }}>{h.v}</span>
            </div>
          ))}
        </div>

        {/* Cek booking shortcut */}
        <button onClick={onCheckBooking} style={{
          marginTop: 12, width: '100%', cursor: 'pointer',
          background: t.card, border: `1px solid ${t.line}`, borderRadius: 10,
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        }}>
          <Row gap={12} align="center">
            <div style={{
              width: 36, height: 36, borderRadius: 18, display: 'grid', placeItems: 'center',
              background: `${accent.hex}14`, color: accent.hex,
            }}><Icon.clock /></div>
            <Stack gap={2} style={{ alignItems: 'flex-start' }}>
              <span style={{
                fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em',
              }}>Sudah pernah reservasi?</span>
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 12, color: t.ink3 }}>
                Cek status booking pakai nomor HP
              </span>
            </Stack>
          </Row>
          <span style={{ color: accent.hex, display: 'grid', placeItems: 'center' }}>
            <Icon.arrow style={{ width: 16, height: 16 }}/>
          </span>
        </button>

        {/* How it works — generic, venue-neutral */}
        <div style={{ marginTop: 22 }}>
          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>
            Cara reservasi
          </span>
          <Stack gap={0} style={{ marginTop: 12 }}>
            {[
              ['Pilih waktu', 'Tentukan tanggal & jam kedatangan'],
              [cafe.spaceTitle, `Tentukan jumlah ${cafe.guestNoun} & preferensi`],
              ['Bayar DP', 'Amankan slot, sisanya bayar di tempat'],
            ].map((s, i, arr) => (
              <Row key={i} gap={14} align="flex-start" style={{ position: 'relative' }}>
                <Stack gap={0} style={{ alignItems: 'center', alignSelf: 'stretch' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 14, flexShrink: 0,
                    display: 'grid', placeItems: 'center',
                    background: accent.hex, color: accent.on,
                    fontFamily: 'Geist, sans-serif', fontSize: 12, fontWeight: 700,
                  }}>{i + 1}</div>
                  {i < arr.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 18, background: t.line }} />}
                </Stack>
                <Stack gap={2} style={{ paddingBottom: i < arr.length - 1 ? 16 : 0, flex: 1 }}>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>{s[0]}</span>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 12, color: t.ink2, lineHeight: 1.45 }}>{s[1]}</span>
                </Stack>
              </Row>
            ))}
          </Stack>
        </div>
      </div>

      {/* Dock */}
      <BottomDock t={t}>
        <PrimaryButton t={t} accent={accent} onClick={onReserve} sub={cafe.bookSub}>
          {cafe.bookCta}
        </PrimaryButton>
      </BottomDock>
    </div>);

}

// ──────────────────────────────────────────────────────────────
// 3. DATE & TIME
// ──────────────────────────────────────────────────────────────
function DateTimeScreen({ t, accent, booking, setBooking, onBack, onNext, cafe }) {
  const today = new Date();today.setHours(0, 0, 0, 0);
  const [monthOffset, setMonthOffset] = React.useState(0);
  const view = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthLabel = `${VESTRA_MONTHS_ID[view.getMonth()]} ${view.getFullYear()}`;
  const firstDay = view.getDay(); // 0 = Min
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));

  function isSameDay(a, b) {return a && b && a.toDateString() === b.toDateString();}

  return (
    <div style={{ background: t.bg, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} onBack={onBack} title={cafe.name} />
      <div style={{ padding: '8px 22px 200px 22px' }}>
        <StepDots count={7} idx={0} t={t} accent={accent} />
        <Eyebrow color={t.ink3} style={{ marginTop: 18 }}>Langkah 1 dari 7</Eyebrow>
        <Display size={30} style={{ marginTop: 6 }}>Kapan kamu mau <span style={{ color: accent.hex }}>datang?</span></Display>

        {/* Month switcher */}
        <Row justify="space-between" style={{ marginTop: 26 }}>
          <Stack gap={2}>
            <Eyebrow color={t.ink3}>Bulan</Eyebrow>
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 22, color: t.ink, letterSpacing: '-0.01em' }}>{monthLabel}</span>
          </Stack>
          <Row gap={6}>
            <button onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))} disabled={monthOffset === 0} style={{
              width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.line}`, background: t.card, color: t.ink,
              display: 'grid', placeItems: 'center', cursor: monthOffset === 0 ? 'not-allowed' : 'pointer',
              opacity: monthOffset === 0 ? 0.4 : 1
            }}><Icon.back style={{ width: 18, height: 18 }} /></button>
            <button onClick={() => setMonthOffset(monthOffset + 1)} style={{
              width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.line}`, background: t.card, color: t.ink,
              display: 'grid', placeItems: 'center', cursor: 'pointer'
            }}><Icon.arrow style={{ width: 18, height: 18 }} /></button>
          </Row>
        </Row>

        {/* Calendar grid */}
        <div style={{ marginTop: 14, background: t.card, border: `1px solid ${t.line}`, borderRadius: 12, padding: '14px 12px 18px 12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
            {VESTRA_DAYS_ID.map((d) =>
            <div key={d} style={{
              textAlign: 'center', fontFamily: 'Geist, sans-serif', fontSize: 10, color: t.ink3,
              letterSpacing: '0.06em', padding: '8px 0'
            }}>{d}</div>
            )}
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const past = d < today;
              const selected = isSameDay(d, booking.date);
              return (
                <button key={i} disabled={past} onClick={() => setBooking({ ...booking, date: d })} style={{
                  border: 'none', cursor: past ? 'not-allowed' : 'pointer', padding: 0,
                  aspectRatio: '1', borderRadius: 8,
                  background: selected ? accent.hex : 'transparent',
                  color: selected ? accent.on : past ? t.ink3 : t.ink,
                  fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: selected ? 600 : 500,
                  opacity: past ? 0.35 : 1, letterSpacing: '-0.01em',
                  position: 'relative'
                }}>
                  {d.getDate()}
                  {isSameDay(d, today) && !selected &&
                  <span style={{
                    position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
                    width: 4, height: 4, borderRadius: 2, background: accent.hex
                  }} />
                  }
                </button>);

            })}
          </div>
        </div>

        {/* Time slots */}
        {booking.date &&
        <div style={{ marginTop: 24 }}>
            <Row justify="space-between" align="baseline" style={{ marginBottom: 12 }}>
              <Eyebrow color={t.ink3}>Pilih waktu</Eyebrow>
              <Eyebrow color={t.ink3}>WIB · 30 min slots</Eyebrow>
            </Row>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {VESTRA_TIME_SLOTS.map((slot) => {
              const selected = booking.time === slot;
              const busy = ['12:00', '13:00', '18:30'].includes(slot);
              return (
                <button key={slot} disabled={busy} onClick={() => setBooking({ ...booking, time: slot })} style={{
                  padding: '12px 0', borderRadius: 12, cursor: busy ? 'not-allowed' : 'pointer',
                  border: selected ? `1.5px solid ${accent.hex}` : `1px solid ${t.line}`,
                  background: selected ? `${accent.hex}14` : t.card,
                  color: busy ? t.ink3 : selected ? accent.hex : t.ink,
                  fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500, letterSpacing: '0.02em',
                  opacity: busy ? 0.45 : 1,
                  textDecoration: busy ? 'line-through' : 'none'
                }}>{slot}</button>);

            })}
            </div>

            {cafe.durations &&
            <div style={{ marginTop: 22 }}>
              <Row justify="space-between" align="baseline" style={{ marginBottom: 12 }}>
                <Eyebrow color={t.ink3}>Durasi sewa</Eyebrow>
                <Eyebrow color={t.ink3}>{vestraFmtRp(cafe.baseRate)} / {cafe.durationNoun}</Eyebrow>
              </Row>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {cafe.durations.map((dur) => {
                  const on = (booking.duration || cafe.durations[0].id) === dur.id;
                  return (
                    <button key={dur.id} onClick={() => setBooking({ ...booking, duration: dur.id })} style={{
                      padding: '12px 0', borderRadius: 12, cursor: 'pointer',
                      border: on ? `1.5px solid ${accent.hex}` : `1px solid ${t.line}`,
                      background: on ? `${accent.hex}14` : t.card,
                      color: on ? accent.hex : t.ink,
                      fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em'
                    }}>{dur.label}</button>);
                })}
              </div>
            </div>
            }
          </div>
        }
      </div>

      <BottomDock t={t}>
        <PrimaryButton t={t} accent={accent}
        disabled={!booking.date || !booking.time}
        onClick={onNext}
        sub={booking.date && booking.time ? `${vestraFmtDateShort(booking.date)} · ${booking.time}` : 'Pilih tanggal & waktu'}>
          Lanjut</PrimaryButton>
      </BottomDock>
    </div>);

}

// ──────────────────────────────────────────────────────────────
// 4. PARTY (pax + table type)
// ──────────────────────────────────────────────────────────────
function PartyScreen({ t, accent, booking, setBooking, onBack, onNext, cafe }) {
  return (
    <div style={{ background: t.bg, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} onBack={onBack} title={cafe.name} />
      <div style={{ padding: '8px 22px 200px 22px' }}>
        <StepDots count={7} idx={1} t={t} accent={accent} />
        <Eyebrow color={t.ink3} style={{ marginTop: 18 }}>Langkah 2 dari 7</Eyebrow>
        <Display size={30} style={{ marginTop: 6 }}>{cafe.spaceLabel}</Display>

        {/* Pax stepper */}
        {cafe.showPax &&
        <div style={{
          marginTop: 22, background: t.card, border: `1px solid ${t.line}`, borderRadius: 12,
          padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <Stack gap={4}>
            <Eyebrow color={t.ink3}>{`Jumlah ${cafe.guestNoun}`}</Eyebrow>
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 500, color: t.ink2 }}>{cafe.paxHint}</span>
          </Stack>
          <Row gap={14}>
            <button onClick={() => setBooking({ ...booking, pax: Math.max(1, booking.pax - 1) })} style={{
              width: 40, height: 40, borderRadius: 12, border: `1px solid ${t.line}`, background: 'transparent',
              color: t.ink, cursor: 'pointer', display: 'grid', placeItems: 'center'
            }}><Icon.minus /></button>
            <div style={{
              fontFamily: 'Geist, sans-serif', fontSize: 36, color: t.ink, minWidth: 38, textAlign: 'center', letterSpacing: '-0.02em'
            }}>{booking.pax}</div>
            <button onClick={() => setBooking({ ...booking, pax: Math.min(20, booking.pax + 1) })} style={{
              width: 40, height: 40, borderRadius: 12, border: `1px solid ${accent.hex}`, background: accent.hex,
              color: accent.on, cursor: 'pointer', display: 'grid', placeItems: 'center'
            }}><Icon.plus /></button>
          </Row>
        </div>
        }

        {/* Table type */}
        <div style={{ marginTop: 24 }}>
          <Eyebrow color={t.ink3} style={{ marginBottom: 12 }}>{cafe.spaceTitle}</Eyebrow>
          <Stack gap={10}>
            {cafe.spaceTypes.map((tp) => {
              const selected = booking.tableType === tp.id;
              return (
                <button key={tp.id} onClick={() => setBooking({ ...booking, tableType: tp.id })} style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                  border: selected ? `1.5px solid ${accent.hex}` : `1px solid ${t.line}`,
                  background: selected ? `${accent.hex}10` : t.card,
                  borderRadius: 10, padding: '16px 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14
                }}>
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Row gap={8}>
                      <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 16, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>{tp.label}</span>
                      <span style={{
                        fontFamily: 'Geist, sans-serif', fontSize: 10, padding: '2px 7px', borderRadius: 6,
                        background: t.chip, color: t.ink2, letterSpacing: '0.04em'
                      }}>{tp.cap}</span>
                    </Row>
                    <span style={{ fontSize: 12, color: t.ink2, fontFamily: 'Geist, sans-serif' }}>{tp.desc}</span>
                  </Stack>
                  <div style={{
                    width: 22, height: 22, borderRadius: 11, display: 'grid', placeItems: 'center',
                    border: selected ? 'none' : `1.5px solid ${t.line}`,
                    background: selected ? accent.hex : 'transparent',
                    color: accent.on
                  }}>{selected && <Icon.check style={{ width: 14, height: 14 }} />}</div>
                </button>);

            })}
          </Stack>
        </div>
      </div>

      <BottomDock t={t}>
        <PrimaryButton t={t} accent={accent} disabled={!booking.tableType} onClick={onNext}
        sub={`${booking.pax} ${cafe.guestNoun} · ${cafe.spaceTypes.find((x) => x.id === booking.tableType)?.label || 'pilih'}`}>
          Lanjut
        </PrimaryButton>
      </BottomDock>
    </div>);

}

// ──────────────────────────────────────────────────────────────
// 5. MENU (pre-order)
// ──────────────────────────────────────────────────────────────
function MenuScreen({ t, accent, booking, setBooking, onBack, onNext, cafe }) {
  const [openCat, setOpenCat] = React.useState(0);

  function setQty(id, qty) {
    const next = { ...booking.menu };
    if (qty <= 0) delete next[id];else next[id] = qty;
    setBooking({ ...booking, menu: next });
  }
  function inc(id) {setQty(id, (booking.menu[id] || 0) + 1);}
  function dec(id) {setQty(id, (booking.menu[id] || 0) - 1);}

  const totalItems = Object.values(booking.menu).reduce((s, q) => s + q, 0);
  const subtotal = cafe.menu.flatMap((c) => c.items).
  reduce((s, it) => s + (booking.menu[it.id] || 0) * it.price, 0);

  return (
    <div style={{ background: t.bg, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} onBack={onBack} title={cafe.name} />
      <div style={{ padding: '8px 22px 200px 22px' }}>
        <StepDots count={7} idx={2} t={t} accent={accent} />
        <Eyebrow color={t.ink3} style={{ marginTop: 18 }}>Langkah 3 dari 7 · Opsional</Eyebrow>
        <Display size={30} style={{ marginTop: 6 }}>{cafe.menuTitle}</Display>
        <p style={{ margin: '8px 0 0 0', fontSize: 13, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.55 }}>
          {cafe.menuLead}
        </p>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 6, marginTop: 22, marginLeft: -22, marginRight: -22, paddingLeft: 22, paddingRight: 22, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {cafe.menu.map((cat, i) =>
          <button key={cat.category} onClick={() => setOpenCat(i)} style={{
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            padding: '10px 16px', borderRadius: 999,
            background: openCat === i ? t.ink : t.card,
            color: openCat === i ? t.bg : t.ink2,
            border: openCat === i ? 'none' : `1px solid ${t.line}`,
            fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em'
          }}>{cat.category}</button>
          )}
        </div>

        {/* Items list */}
        <div style={{ marginTop: 18 }}>
          <Eyebrow color={t.ink3} style={{ marginBottom: 6 }}>{cafe.menu[openCat].note}</Eyebrow>
          <Stack gap={10} style={{ marginTop: 10 }}>
            {cafe.menu[openCat].items.map((item) => {
              const qty = booking.menu[item.id] || 0;
              const active = qty > 0;
              return (
                <div key={item.id} style={{
                  border: active ? `1.5px solid ${accent.hex}` : `1px solid ${t.line}`,
                  background: active ? `${accent.hex}0D` : t.card,
                  borderRadius: 10, padding: '14px 16px',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14
                }}>
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Row gap={8} align="baseline">
                      <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>
                        {item.name}
                      </span>
                      {item.badge &&
                      <span style={{
                        fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600,
                        color: accent.hex, lineHeight: 1
                      }}>· {item.badge}</span>
                      }
                    </Row>
                    <span style={{ fontSize: 12, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.45 }}>{item.desc}</span>
                    <span style={{ marginTop: 2, fontSize: 13, fontWeight: 600, color: accent.hex, fontFamily: 'Geist, sans-serif', letterSpacing: '-0.01em' }}>
                      {vestraFmtRp(item.price)}
                    </span>
                  </Stack>
                  {qty === 0 ?
                  <button onClick={() => inc(item.id)} style={{
                    width: 34, height: 34, borderRadius: 17, border: `1px solid ${t.line}`,
                    background: t.bg, color: t.ink, cursor: 'pointer', display: 'grid', placeItems: 'center'
                  }}><Icon.plus /></button> :

                  <Row gap={8}>
                      <button onClick={() => dec(item.id)} style={{
                      width: 30, height: 30, borderRadius: 15, border: `1px solid ${t.line}`,
                      background: 'transparent', color: t.ink, cursor: 'pointer', display: 'grid', placeItems: 'center'
                    }}><Icon.minus /></button>
                      <span style={{
                      fontFamily: 'Geist, sans-serif', fontSize: 20, color: t.ink, minWidth: 18, textAlign: 'center'
                    }}>{qty}</span>
                      <button onClick={() => inc(item.id)} style={{
                      width: 30, height: 30, borderRadius: 15, border: 'none',
                      background: accent.hex, color: accent.on, cursor: 'pointer', display: 'grid', placeItems: 'center'
                    }}><Icon.plus /></button>
                    </Row>
                  }
                </div>);

            })}
          </Stack>
        </div>

        {/* Skip hint */}
        {totalItems === 0 &&
        <div style={{
          marginTop: 20, padding: '12px 14px', background: t.bg2, borderRadius: 12,
          border: `1px dashed ${t.line}`
        }}>
            <p style={{ margin: 0, fontSize: 12, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.5 }}>
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 16, color: t.ink, marginRight: 4 }}>Skip aja?</span>
              {cafe.bookingFee > 0
                ? `Tetap bisa lanjut tanpa pre-order — cukup biaya reservasi ${vestraFmtRp(cafe.bookingFee)} buat jaminan slot.`
                : 'Tetap bisa lanjut tanpa pre-order, langsung ke pembayaran booking.'}
            </p>
          </div>
        }
      </div>

      <BottomDock t={t}>
        <PrimaryButton t={t} accent={accent} onClick={onNext}
        sub={totalItems > 0 ? `${totalItems} item · ${vestraFmtRp(subtotal)}` : 'Tanpa pre-order'}>
          {totalItems > 0 ? 'Lanjut' : 'Skip & lanjut'}
        </PrimaryButton>
      </BottomDock>
    </div>);

}

// ──────────────────────────────────────────────────────────────
// 6. GUEST FORM
// ──────────────────────────────────────────────────────────────
function GuestScreen({ t, accent, booking, setBooking, onBack, onNext, cafe }) {
  const nameOk = booking.name.trim().length >= 2;
  const phoneDigits = (booking.phone || '').replace(/\D/g, '');
  const phoneOk = phoneDigits.length >= 6;
  const ok = nameOk && phoneOk;
  const hint = ok ? `Untuk ${booking.name.split(' ')[0]}` :
  !nameOk ? 'Isi nama dulu ya' :
  'No HP min. 6 angka';

  function field(label, key, placeholder, sub, opts = {}) {
    return (
      <Stack gap={6}>
        <Row justify="space-between" align="baseline">
          <Eyebrow color={t.ink3}>{label}</Eyebrow>
          {sub && <span style={{ fontSize: 10, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>{sub}</span>}
        </Row>
        <input value={booking[key]} onChange={(e) => setBooking({ ...booking, [key]: e.target.value })}
        placeholder={placeholder} type={opts.type || 'text'} inputMode={opts.inputMode}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '15px 16px', borderRadius: 8, border: `1px solid ${t.line}`,
          background: t.card, color: t.ink, fontFamily: 'Geist, sans-serif', fontSize: 15, outline: 'none',
          letterSpacing: '-0.01em'
        }} />
      </Stack>);

  }

  return (
    <div style={{ background: t.bg, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} onBack={onBack} title={cafe.name} />
      <div style={{ padding: '8px 22px 200px 22px' }}>
        <StepDots count={7} idx={3} t={t} accent={accent} />
        <Eyebrow color={t.ink3} style={{ marginTop: 18 }}>Langkah 4 dari 7</Eyebrow>
        <Display size={30} style={{ marginTop: 6 }}>Data tamu <span style={{ color: accent.hex }}>utama.</span></Display>
        <p style={{ margin: '8px 0 0 0', fontSize: 13, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.55 }}>
          Restoran akan menghubungi nomor ini untuk konfirmasi 1 jam sebelum reservasi.
        </p>

        <Stack gap={16} style={{ marginTop: 22 }}>
          {field('Nama lengkap', 'name', 'Mis. Aldi Pratama')}
          {field('Nomor HP', 'phone', '+62 812-3456-7890', 'WA aktif', { type: 'tel', inputMode: 'tel' })}
          {field('Email (opsional)', 'email', 'kamu@email.com', null, { type: 'email', inputMode: 'email' })}
        </Stack>

        {/* Summary preview */}
        <div style={{
          marginTop: 26, padding: '16px 18px', borderRadius: 10, background: t.bg2,
          border: `1px dashed ${t.line}`
        }}>
          <Eyebrow color={t.ink3} style={{ marginBottom: 10 }}>Ringkasan sementara</Eyebrow>
          <Stack gap={8}>
            {[
            { k: 'Kedai', v: cafe.name },
            { k: 'Tanggal', v: vestraFmtDate(booking.date) },
            { k: 'Waktu', v: booking.time },
            { k: cafe.showPax ? (cafe.guestNoun.charAt(0).toUpperCase() + cafe.guestNoun.slice(1)) : 'Pilihan', v: `${cafe.showPax ? booking.pax + ' ' + cafe.guestNoun + ' · ' : ''}${cafe.spaceTypes.find((x) => x.id === booking.tableType)?.label || '—'}` }].
            map((r) =>
            <Row key={r.k} justify="space-between">
                <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif', letterSpacing: '0.04em' }}>{r.k}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: t.ink, fontFamily: 'Geist, sans-serif', letterSpacing: '-0.01em' }}>{r.v}</span>
              </Row>
            )}
          </Stack>
        </div>
      </div>

      <BottomDock t={t}>
        <PrimaryButton t={t} accent={accent} disabled={!ok} onClick={onNext}
        sub={hint}>
          Lanjut
        </PrimaryButton>
      </BottomDock>
    </div>);

}

// ──────────────────────────────────────────────────────────────
// 6. SPECIAL REQUEST
// ──────────────────────────────────────────────────────────────
function RequestScreen({ t, accent, booking, setBooking, onBack, onSubmit, cafe }) {
  function toggleTag(tag) {
    const has = booking.tags.includes(tag);
    setBooking({ ...booking, tags: has ? booking.tags.filter((x) => x !== tag) : [...booking.tags, tag] });
  }
  return (
    <div style={{ background: t.bg, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} onBack={onBack} title={cafe.name} />
      <div style={{ padding: '8px 22px 200px 22px' }}>
        <StepDots count={7} idx={4} t={t} accent={accent} />
        <Eyebrow color={t.ink3} style={{ marginTop: 18 }}>Langkah 5 dari 7</Eyebrow>
        <Display size={30} style={{ marginTop: 6 }}>Ada permintaan <span style={{ color: accent.hex }}>khusus?</span></Display>
        <p style={{ margin: '8px 0 0 0', fontSize: 13, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.55 }}>
          Pilih tag yang relevan, atau tulis catatan untuk staff. Bukan jaminan, tapi kami usahakan.
        </p>

        {/* Tag grid */}
        <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(cafe.requestTags || []).map((tag) => {
            const sel = booking.tags.includes(tag);
            return (
              <button key={tag} onClick={() => toggleTag(tag)} style={{
                cursor: 'pointer', padding: '10px 14px', borderRadius: 999,
                border: sel ? `1.5px solid ${accent.hex}` : `1px solid ${t.line}`,
                background: sel ? `${accent.hex}14` : t.card,
                color: sel ? accent.hex : t.ink, fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500,
                letterSpacing: '-0.01em',
                display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
                {sel && <Icon.check style={{ width: 14, height: 14 }} />}
                {tag}
              </button>);

          })}
        </div>

        {/* Note */}
        <div style={{ marginTop: 24 }}>
          <Eyebrow color={t.ink3} style={{ marginBottom: 8 }}>Catatan (opsional)</Eyebrow>
          <textarea value={booking.note} onChange={(e) => setBooking({ ...booking, note: e.target.value })}
          rows={4} placeholder="Mis. ada permintaan khusus buat tim kami…"
          style={{
            width: '100%', boxSizing: 'border-box', resize: 'none',
            padding: '14px 16px', borderRadius: 8, border: `1px solid ${t.line}`,
            background: t.card, color: t.ink, fontFamily: 'Geist, sans-serif', fontSize: 14, outline: 'none',
            lineHeight: 1.55, letterSpacing: '-0.01em'
          }} />
          <Row justify="flex-end" style={{ marginTop: 6 }}>
            <span style={{ fontSize: 10, color: t.ink3, fontFamily: 'Geist, sans-serif', letterSpacing: '0.04em' }}>
              {booking.note.length} / 200
            </span>
          </Row>
        </div>

        {/* Policy */}
        <div style={{
          marginTop: 18, padding: '14px 16px', background: t.bg2, borderRadius: 8,
          border: `1px solid ${t.line}`
        }}>
          <Eyebrow color={t.ink3} style={{ marginBottom: 6 }}>Kebijakan</Eyebrow>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: t.ink2, fontFamily: 'Geist, sans-serif' }}>
            Slot kamu ditahan 15 menit setelah jam booking. Pembatalan gratis sampai 2 jam sebelumnya.
          </p>
        </div>
      </div>

      <BottomDock t={t}>
        <PrimaryButton t={t} accent={accent} onClick={onSubmit} sub="Tanpa biaya tambahan">
          Konfirmasi reservasi
        </PrimaryButton>
      </BottomDock>
    </div>);

}

// ──────────────────────────────────────────────────────────────
// 8. PAYMENT (DP / Down payment)
// ──────────────────────────────────────────────────────────────
function PaymentScreen({ t, accent, booking, setBooking, onBack, onSubmit, cafe }) {
  const orderedItems = cafe.menu.flatMap((c) => c.items).filter((it) => booking.menu[it.id]);
  const bill = vestraComputeBill(cafe, booking);
  const isFull = bill.payMode === 'full';
  const spaceSel = cafe.spaceTypes.find((x) => x.id === booking.tableType);
  const spaceLabel = spaceSel?.label || '';
  const totalItems = orderedItems.reduce((s, it) => s + booking.menu[it.id], 0);

  // Rows describing exactly WHAT, WHEN, HOW LONG, HOW MANY — shown before payment.
  const recapRows = [
    { icon: <Icon.cal />, label: 'Tanggal', value: vestraFmtDate(booking.date) },
    { icon: <Icon.clock />, label: 'Jam datang', value: `${booking.time} WIB` },
  ];
  if (bill.dur) recapRows.push({ icon: <Icon.clock />, label: 'Durasi', value: bill.dur.label });
  const countStr = cafe.showPax ? `${booking.pax} ${cafe.guestNoun}` : '';
  recapRows.push({
    icon: <Icon.users />,
    label: cafe.showPax ? (cafe.guestNoun.charAt(0).toUpperCase() + cafe.guestNoun.slice(1)) : cafe.spaceTitle.replace('Pilih ', '').replace(/^./, (c) => c.toUpperCase()),
    value: [countStr, spaceLabel].filter(Boolean).join(' · ') || '—',
  });

  return (
    <div style={{ background: t.bg, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} onBack={onBack} title={cafe.name} />
      <div style={{ padding: '8px 22px 200px 22px' }}>
        <StepDots count={7} idx={5} t={t} accent={accent} />
        <Eyebrow color={t.ink3} style={{ marginTop: 18 }}>Langkah 6 dari 7</Eyebrow>
        <Display size={30} style={{ marginTop: 6 }}>Cek dulu, <span style={{ color: accent.hex }}>baru bayar.</span></Display>
        <p style={{ margin: '8px 0 0 0', fontSize: 13, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.55 }}>
          Pastikan semua detail di bawah sudah benar sebelum lanjut ke pembayaran.
        </p>

        {/* Reservation recap — WHAT / WHEN / HOW LONG / HOW MANY */}
        <div style={{
          marginTop: 18, background: t.card, borderRadius: 10,
          border: `1px solid ${t.line}`, overflow: 'hidden'
        }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${t.line}`, background: t.bg2 }}>
            <Row justify="space-between" align="center">
              <Stack gap={2}>
                <Eyebrow color={t.ink3}>Reservasi di</Eyebrow>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>{cafe.name}</span>
              </Stack>
              <span style={{
                fontFamily: 'Geist, sans-serif', fontSize: 11, fontWeight: 600, color: accent.hex,
                background: `${accent.hex}14`, padding: '5px 10px', borderRadius: 999, letterSpacing: '-0.01em'
              }}>{cafe.type}</span>
            </Row>
          </div>
          <Stack gap={0} style={{ padding: '6px 18px 10px' }}>
            {recapRows.map((r, i) => (
              <Row key={i} justify="space-between" align="center" style={{
                padding: '11px 0', borderBottom: i < recapRows.length - 1 ? `1px solid ${t.line}` : 'none'
              }}>
                <Row gap={9} align="center">
                  <span style={{ color: t.ink3, display: 'flex' }}>{r.icon}</span>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, color: t.ink2 }}>{r.label}</span>
                </Row>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em', textAlign: 'right' }}>{r.value}</span>
              </Row>
            ))}
          </Stack>

          {/* Pre-order recap inside the same card */}
          {orderedItems.length > 0 &&
          <div style={{ borderTop: `1px solid ${t.line}`, padding: '12px 18px 14px', background: t.bg2 }}>
            <Row justify="space-between" align="center" style={{ marginBottom: 10 }}>
              <Eyebrow color={t.ink3}>Pesananmu</Eyebrow>
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, color: t.ink3 }}>{totalItems} item</span>
            </Row>
            <Stack gap={9}>
              {orderedItems.map((it) => {
                const q = booking.menu[it.id];
                return (
                  <Row key={it.id} justify="space-between" align="center" gap={10}>
                    <Row gap={9} align="center" style={{ flex: 1 }}>
                      <span style={{
                        minWidth: 22, height: 22, padding: '0 6px', borderRadius: 6, background: accent.hex, color: accent.on,
                        fontFamily: 'Geist, sans-serif', fontSize: 12, fontWeight: 600,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                      }}>{q}×</span>
                      <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500, color: t.ink, letterSpacing: '-0.01em' }}>{it.name}</span>
                    </Row>
                    <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500, color: t.ink2 }}>{vestraFmtRp(it.price * q)}</span>
                  </Row>);
              })}
            </Stack>
          </div>
          }
          <button onClick={onBack} style={{
            width: '100%', border: 'none', borderTop: `1px solid ${t.line}`, background: t.card, cursor: 'pointer',
            padding: '12px 0', color: accent.hex, fontFamily: 'Geist, sans-serif', fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, letterSpacing: '-0.01em'
          }}>
            <Icon.back style={{ width: 15, height: 15 }} /> Ubah detail reservasi
          </button>
        </div>

        {/* Payment mode toggle */}
        {cafe.allowFull &&
        <div style={{ marginTop: 18, display: 'flex', gap: 6, padding: 4, background: t.bg2, borderRadius: 10 }}>
          {[['dp', 'DP 50%'], ['full', 'Bayar penuh']].map(([mode, label]) => {
            const on = bill.payMode === mode;
            return (
              <button key={mode} onClick={() => setBooking({ ...booking, payMode: mode })} style={{
                flex: 1, padding: '10px 0', borderRadius: 7, cursor: 'pointer', border: 'none',
                background: on ? t.card : 'transparent',
                color: on ? t.ink : t.ink3,
                boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em'
              }}>{label}</button>);
          })}
        </div>
        }

        {/* Bill summary card */}
        <div style={{
          marginTop: 22, background: t.card, borderRadius: 10,
          border: `1px solid ${t.line}`, padding: '18px 18px'
        }}>
          <Eyebrow color={t.ink3} style={{ marginBottom: 12 }}>Ringkasan tagihan</Eyebrow>

          {/* Pre-order items */}
          {orderedItems.length > 0 ?
          <Stack gap={8} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px dashed ${t.line}` }}>
              {orderedItems.map((it) => {
              const q = booking.menu[it.id];
              return (
                <Row key={it.id} justify="space-between" align="baseline" gap={10}>
                    <Stack gap={2} style={{ flex: 1 }}>
                      <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500, color: t.ink, letterSpacing: '-0.01em' }}>
                        {it.name}
                      </span>
                      <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, color: t.ink3 }}>
                        {q} × {vestraFmtRp(it.price)}
                      </span>
                    </Stack>
                    <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500, color: t.ink }}>
                      {vestraFmtRp(it.price * q)}
                    </span>
                  </Row>);

            })}
            </Stack> :
          null}

          <Stack gap={8}>
            {bill.base > 0 &&
            <Row justify="space-between">
              <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>{cafe.baseLabel} · {bill.dur ? bill.dur.label : ''}{cafe.billPerUnit ? ` × ${booking.pax}` : ''}</span>
              <span style={{ fontSize: 13, color: t.ink, fontFamily: 'Geist, sans-serif', fontWeight: 500 }}>{vestraFmtRp(bill.base)}</span>
            </Row>
            }
            {orderedItems.length > 0 &&
            <Row justify="space-between">
              <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>Subtotal pre-order</span>
              <span style={{ fontSize: 13, color: t.ink, fontFamily: 'Geist, sans-serif', fontWeight: 500 }}>{vestraFmtRp(bill.services)}</span>
            </Row>
            }
            {bill.fee > 0 &&
            <Row justify="space-between">
              <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>Biaya reservasi</span>
              <span style={{ fontSize: 13, color: t.ink, fontFamily: 'Geist, sans-serif', fontWeight: 500 }}>{vestraFmtRp(bill.fee)}</span>
            </Row>
            }
            <Row justify="space-between">
              <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>Total tagihan</span>
              <span style={{ fontSize: 13, color: t.ink, fontFamily: 'Geist, sans-serif', fontWeight: 500 }}>{vestraFmtRp(bill.grand)}</span>
            </Row>
            <div style={{ height: 1, background: t.line, margin: '4px 0' }} />
            <Row justify="space-between" align="baseline">
              <Stack gap={2}>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 18, fontWeight: 600, color: t.ink, lineHeight: 1, letterSpacing: '-0.01em' }}>Bayar sekarang</span>
                <span style={{ fontSize: 11, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>
                  {bill.remaining > 0 ? `Sisa ${vestraFmtRp(bill.remaining)} dibayar di tempat` : 'Lunas — tanpa sisa di tempat'}
                </span>
              </Stack>
              <span style={{
                fontFamily: 'Geist, sans-serif', fontWeight: 700, fontSize: 26, color: accent.hex, letterSpacing: '-0.02em', whiteSpace: 'nowrap'
              }}>{vestraFmtRp(bill.payNow)}</span>
            </Row>
          </Stack>
        </div>

        {/* Payment methods */}
        <Eyebrow color={t.ink3} style={{ marginTop: 24, marginBottom: 10 }}>Metode pembayaran</Eyebrow>
        <Stack gap={8}>
          {VESTRA_PAYMENT_METHODS.map((m) => {
            const sel = booking.paymentMethod === m.id;
            return (
              <button key={m.id} onClick={() => setBooking({ ...booking, paymentMethod: m.id })} style={{
                width: '100%', textAlign: 'left', cursor: 'pointer',
                border: sel ? `1.5px solid ${accent.hex}` : `1px solid ${t.line}`,
                background: sel ? `${accent.hex}10` : t.card,
                borderRadius: 8, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center',
                  background: sel ? accent.hex : t.bg2, color: sel ? accent.on : t.ink,
                  fontFamily: 'Geist, sans-serif', fontSize: 16, letterSpacing: '-0.02em'
                }}>{m.name[0]}</div>
                <Stack gap={2} style={{ flex: 1 }}>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>{m.name}</span>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, color: t.ink3 }}>{m.sub}</span>
                </Stack>
                <div style={{
                  width: 20, height: 20, borderRadius: 10, display: 'grid', placeItems: 'center',
                  border: sel ? 'none' : `1.5px solid ${t.line}`,
                  background: sel ? accent.hex : 'transparent',
                  color: accent.on
                }}>{sel && <Icon.check style={{ width: 13, height: 13 }} />}</div>
              </button>);

          })}
        </Stack>

        {/* Trust strip */}
        <Row gap={8} style={{ marginTop: 18, padding: '12px 14px', background: t.bg2, borderRadius: 12, border: `1px solid ${t.line}` }}>
          <Icon.shield style={{ color: accent.hex, width: 18, height: 18 }} />
          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 12, color: t.ink2, lineHeight: 1.45 }}>
            Transaksi diamankan via gateway tersertifikasi. Refund otomatis kalau cancel tepat waktu.
          </span>
        </Row>
      </div>

      <BottomDock t={t}>
        <PrimaryButton t={t} accent={accent}
        disabled={!booking.paymentMethod}
        onClick={onSubmit}
        sub={booking.paymentMethod ? `Via ${VESTRA_PAYMENT_METHODS.find((m) => m.id === booking.paymentMethod)?.name}` : 'Pilih metode pembayaran'}>
          Bayar {vestraFmtRp(bill.payNow)}
        </PrimaryButton>
      </BottomDock>
    </div>);

}

// ──────────────────────────────────────────────────────────────
// 9. UPLOAD BUKTI PEMBAYARAN
// ──────────────────────────────────────────────────────────────

// Deterministic QR-like placeholder. 25x25 grid with 3 finder patterns.
function QRPlaceholder({ size = 200, color = '#1F1612', bg = '#FFFFFF' }) {
  const N = 25;
  const cell = size / N;
  function isFinder(r, c) {
    // 3 corner finders: top-left, top-right, bottom-left (7x7 each)
    const inTL = r < 7 && c < 7;
    const inTR = r < 7 && c >= N - 7;
    const inBL = r >= N - 7 && c < 7;
    if (!(inTL || inTR || inBL)) return null;
    // Local coords within the 7x7
    let lr = r,lc = c;
    if (inTR) lc = c - (N - 7);
    if (inBL) lr = r - (N - 7);
    const onOuter = lr === 0 || lr === 6 || lc === 0 || lc === 6;
    const onInner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
    return onOuter || onInner;
  }
  // PRNG for the rest of the data area
  function dataBit(r, c) {
    // Skip finder areas + separator margins
    if (r < 8 && (c < 8 || c >= N - 8)) return false;
    if (r >= N - 8 && c < 8) return false;
    // Timing patterns
    if (r === 6 || c === 6) return (r + c) % 2 === 0;
    const x = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
    return x - Math.floor(x) > 0.5;
  }
  const rows = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const f = isFinder(r, c);
      const filled = f !== null ? f : dataBit(r, c);
      if (filled) rows.push(<rect key={`${r},${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={color} />);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: bg, borderRadius: 8 }}>
      {rows}
    </svg>);

}

function UploadProofScreen({ t, accent, booking, setBooking, onBack, onSubmit, cafe }) {
  const fileRef = React.useRef(null);
  const [copied, setCopied] = React.useState(null);

  const bill = vestraComputeBill(cafe, booking);
  const dpTotal = bill.payNow;

  const method = booking.paymentMethod;

  function onPickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBooking({ ...booking, proofFile: { name: file.name, size: file.size, dataUrl: reader.result } });
    };
    reader.readAsDataURL(file);
  }
  function clearFile() {
    setBooking({ ...booking, proofFile: null });
    if (fileRef.current) fileRef.current.value = '';
  }
  function copyRek(rek, bank) {
    navigator.clipboard?.writeText(rek.replace(/[-\s]/g, ''));
    setCopied(bank);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div style={{ background: t.bg, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} onBack={onBack} title={cafe.name} />
      <div style={{ padding: '8px 22px 200px 22px' }}>
        <StepDots count={7} idx={6} t={t} accent={accent} />
        <Eyebrow color={t.ink3} style={{ marginTop: 18 }}>Langkah 7 dari 7</Eyebrow>
        <Display size={30} style={{ marginTop: 6 }}>Bayar & upload <span style={{ color: accent.hex }}>buktinya.</span></Display>
        <p style={{ margin: '8px 0 0 0', fontSize: 13, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.55 }}>
          Tim Vestra akan verifikasi bukti bayar dalam ±5 menit. Kalau gak yakin, hubungi kami via WhatsApp.
        </p>

        {/* Amount banner */}
        <div style={{
          marginTop: 18, padding: '16px 18px', borderRadius: 10,
          background: accent.hex, color: accent.on,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <Stack gap={2}>
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 18, opacity: 0.9, lineHeight: 1 }}>jumlah yang harus dibayar</span>
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, opacity: 0.85, letterSpacing: '0.02em' }}>Bayar persis biar mudah dicek</span>
          </Stack>
          <span style={{ fontFamily: 'Geist, sans-serif', fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            {vestraFmtRp(dpTotal)}
          </span>
        </div>

        {/* Method-specific instructions */}
        {method === 'qris' &&
        <div style={{ marginTop: 20, background: t.card, borderRadius: 10, border: `1px solid ${t.line}`, padding: '18px 18px' }}>
            <Row justify="space-between" align="baseline">
              <Eyebrow color={t.ink3}>Scan QRIS</Eyebrow>
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, color: t.ink3 }}>Berlaku 15 menit</span>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <div style={{
              padding: 14, background: '#FFFFFF', borderRadius: 10,
              border: `1px solid ${t.line}`,
              boxShadow: '0 4px 16px rgba(31,22,18,0.06)'
            }}>
                <Stack gap={10} style={{ alignItems: 'center' }}>
                  <Row gap={8} justify="center" style={{ alignItems: 'center' }}>
                    <span style={{
                    fontFamily: 'Geist, sans-serif', fontSize: 18, color: '#D32F2F', letterSpacing: '-0.02em'
                  }}>QRIS</span>
                    <span style={{ fontSize: 9, padding: '2px 5px', borderRadius: 3, background: '#D32F2F', color: '#fff', fontWeight: 600, fontFamily: 'Geist, sans-serif', letterSpacing: '0.04em' }}>NMID</span>
                  </Row>
                  <QRPlaceholder size={180} color="#1F1612" bg="#FFFFFF" />
                  <Stack gap={2} style={{ alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 12, fontWeight: 600, color: '#1F1612' }}>KOPI VESTRA</span>
                    <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 10, color: '#666' }}>NMID: ID2026081234567</span>
                  </Stack>
                </Stack>
              </div>
            </div>
            <p style={{ margin: '14px 0 0 0', fontSize: 12, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.5, textAlign: 'center' }}>
              Buka m-banking / GoPay / OVO / DANA, scan kode di atas, masukkan nominal persis.
            </p>
          </div>
        }

        {method === 'transfer' &&
        <Stack gap={10} style={{ marginTop: 20 }}>
            <Eyebrow color={t.ink3}>Transfer ke salah satu rekening</Eyebrow>
            {VESTRA_BANK_ACCOUNTS.map((acc) =>
          <div key={acc.bank} style={{
            background: t.card, borderRadius: 8, border: `1px solid ${t.line}`,
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12
          }}>
                <div style={{
              width: 46, height: 32, borderRadius: 6, display: 'grid', placeItems: 'center',
              background: acc.color, color: '#fff',
              fontFamily: 'Geist, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em'
            }}>{acc.bank}</div>
                <Stack gap={3} style={{ flex: 1 }}>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600, color: t.ink, letterSpacing: '0.02em' }}>
                    {acc.rekening}
                  </span>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 10, color: t.ink3 }}>{acc.holder}</span>
                </Stack>
                <button onClick={() => copyRek(acc.rekening, acc.bank)} style={{
              padding: '7px 11px', borderRadius: 8, cursor: 'pointer',
              border: copied === acc.bank ? `1px solid ${accent.hex}` : `1px solid ${t.line}`,
              background: copied === acc.bank ? `${accent.hex}14` : 'transparent',
              color: copied === acc.bank ? accent.hex : t.ink2,
              fontFamily: 'Geist, sans-serif', fontSize: 11, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 5
            }}>
                  {copied === acc.bank ? <><Icon.check style={{ width: 12, height: 12 }} />Tersalin</> : <><Icon.copy />Salin</>}
                </button>
              </div>
          )}
            <div style={{ padding: '10px 12px', background: t.bg2, borderRadius: 10, border: `1px dashed ${t.line}` }}>
              <p style={{ margin: 0, fontSize: 11, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.5 }}>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, color: t.ink, marginRight: 3 }}>Tip:</span>
                transfer nominal persis biar tim Vestra mudah verifikasi.
              </p>
            </div>
          </Stack>
        }

        {/* Upload bukti */}
        <div style={{ marginTop: 24 }}>
          <Row justify="space-between" align="baseline" style={{ marginBottom: 10 }}>
            <Eyebrow color={t.ink3}>Upload bukti pembayaran</Eyebrow>
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 10, color: t.ink3 }}>JPG / PNG · max 5 MB</span>
          </Row>

          {!booking.proofFile ?
          <label htmlFor="vestra-proof-input" style={{
            display: 'block', cursor: 'pointer',
            border: `1.5px dashed ${t.line}`, borderRadius: 10, background: t.card,
            padding: '26px 18px', textAlign: 'center'
          }}>
              <div style={{
              width: 48, height: 48, borderRadius: 24, margin: '0 auto', display: 'grid', placeItems: 'center',
              background: `${accent.hex}14`, color: accent.hex, marginBottom: 10
            }}><Icon.upload /></div>
              <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>
                Tap untuk pilih foto
              </div>
              <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 17, color: t.ink3, marginTop: 4, lineHeight: 1 }}>
                screenshot atau foto struk transfer juga oke
              </div>
              <input id="vestra-proof-input" ref={fileRef} type="file" accept="image/*"
            onChange={onPickFile} style={{ display: 'none' }} />
            </label> :

          <div style={{
            border: `1px solid ${t.line}`, borderRadius: 10, background: t.card,
            padding: 10, display: 'flex', gap: 12, alignItems: 'center'
          }}>
              <div style={{
              width: 72, height: 72, borderRadius: 10, overflow: 'hidden',
              background: `url("${booking.proofFile.dataUrl}") center/cover, ${t.bg2}`,
              flexShrink: 0
            }} />
              <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
                <Row gap={6} align="center">
                  <Icon.check style={{ color: accent.hex, width: 14, height: 14 }} />
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 600, color: t.ink }}>Bukti terupload</span>
                </Row>
                <span style={{
                fontFamily: 'Geist, sans-serif', fontSize: 11, color: t.ink3,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>{booking.proofFile.name}</span>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 10, color: t.ink3 }}>
                  {(booking.proofFile.size / 1024).toFixed(0)} KB · menunggu verifikasi
                </span>
              </Stack>
              <button onClick={clearFile} aria-label="Ganti" style={{
              padding: '7px 11px', borderRadius: 8, cursor: 'pointer',
              border: `1px solid ${t.line}`, background: 'transparent', color: t.ink2,
              fontFamily: 'Geist, sans-serif', fontSize: 11, fontWeight: 500
            }}>Ganti</button>
            </div>
          }
        </div>

        {/* Status info */}
        <Row gap={8} style={{ marginTop: 14, padding: '12px 14px', background: t.bg2, borderRadius: 12, border: `1px solid ${t.line}` }}>
          <Icon.shield style={{ color: accent.hex, width: 18, height: 18 }} />
          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, color: t.ink2, lineHeight: 1.45 }}>
            Bukti akan diverifikasi otomatis. Notifikasi reservasi akan dikirim via WhatsApp setelah confirmed.
          </span>
        </Row>
      </div>

      <BottomDock t={t}>
        <PrimaryButton t={t} accent={accent}
        disabled={!booking.proofFile}
        onClick={onSubmit}
        sub={booking.proofFile ? 'Bukti siap diverifikasi' : 'Upload bukti dulu ya'}>
          Konfirmasi reservasi
        </PrimaryButton>
      </BottomDock>
    </div>);

}

// ──────────────────────────────────────────────────────────────
// 10. CONFIRMATION
// ──────────────────────────────────────────────────────────────
function ConfirmScreen({ t, accent, booking, cafe, onDone }) {
  const code = React.useMemo(() => {
    return 'VST-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.floor(100 + Math.random() * 899);
  }, []);

  // Pre-order summary
  const orderedItems = cafe.menu.flatMap((c) => c.items).filter((it) => booking.menu[it.id]);
  const bill = vestraComputeBill(cafe, booking);
  const dpTotal = bill.payNow;
  const remaining = bill.remaining;
  const methodName = VESTRA_PAYMENT_METHODS.find((m) => m.id === booking.paymentMethod)?.name || '—';

  // ── Push this reservation to the admin inbox (localStorage bridge) ──
  React.useEffect(() => {
    try {
      const proofUrl = booking.proofFile?.dataUrl || null;
      const rec = {
        code,
        venueId: cafe.id, venueName: cafe.name, venueType: cafe.type, brand: cafe.brand,
        date: booking.date ? booking.date.toISOString() : null,
        time: booking.time,
        pax: booking.pax, showPax: cafe.showPax, guestNoun: cafe.guestNoun,
        space: cafe.spaceTypes.find((x) => x.id === booking.tableType)?.label || '',
        duration: bill.dur ? bill.dur.label : '',
        items: orderedItems.map((it) => ({ name: it.name, qty: booking.menu[it.id], price: it.price })),
        name: booking.name, phone: booking.phone, email: booking.email,
        tags: booking.tags, note: booking.note,
        paymentMethod: methodName, payMode: bill.payMode,
        grand: bill.grand, payNow: bill.payNow, remaining: bill.remaining, fee: bill.fee,
        proofName: booking.proofFile?.name || null,
        // guard localStorage quota — skip very large uploaded images
        proofUrl: proofUrl && proofUrl.length < 600000 ? proofUrl : null,
        createdAt: Date.now(),
        status: 'baru',
      };
      const key = 'vestra_reservations';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      if (!list.some((r) => r.code === code)) {
        list.unshift(rec);
        localStorage.setItem(key, JSON.stringify(list.slice(0, 40)));
      }
    } catch (e) { /* ignore */ }
  }, []);

  function savePDF() {
    const ticket = document.querySelector('.vestra-ticket');
    if (!ticket) { window.print(); return; }
    // Clone the ticket into a flow container so only ONE clean page prints
    // (no hidden app height bleeding into a 2nd page).
    const holder = document.createElement('div');
    holder.id = 'vestra-print-holder';
    holder.appendChild(ticket.cloneNode(true));
    document.body.appendChild(holder);
    document.body.classList.add('vestra-printing');
    setTimeout(() => {
      window.print();
      setTimeout(() => { holder.remove(); document.body.classList.remove('vestra-printing'); }, 400);
    }, 60);
  }

  return (
    <div style={{ background: t.bg, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} onBack={onDone} title="Reservasi terkonfirmasi" action={
      <button onClick={onDone} aria-label="Close" style={{
        width: 38, height: 38, borderRadius: 19, border: 'none', background: t.chip, color: t.ink,
        display: 'grid', placeItems: 'center', cursor: 'pointer'
      }}><Icon.close /></button>
      } />

      <div style={{ padding: '4px 22px 200px 22px' }}>
        {/* Success seal */}
        <div style={{ display: 'grid', placeItems: 'center', padding: '18px 0 8px 0' }} data-no-print>
          <div style={{
            width: 88, height: 88, borderRadius: 44, display: 'grid', placeItems: 'center',
            background: `${accent.hex}18`, color: accent.hex,
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute', inset: -8, borderRadius: 48,
              border: `1px dashed ${accent.hex}55`,
              animation: 'spin 16s linear infinite'
            }} />
            <Icon.check style={{ width: 42, height: 42 }} />
          </div>
        </div>

        <Display size={32} style={{ textAlign: 'center', marginTop: 8 }}>
          Sampai jumpa,<br /><span style={{ color: accent.hex }}>{booking.name.split(' ')[0] || 'tamu'}.</span>
        </Display>
        <p style={{ textAlign: 'center', margin: '10px 0 0 0', fontSize: 14, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.5 }}>
          Meja kamu sudah aman di {cafe.name}. Detail e-receipt dikirim via WhatsApp.
        </p>

        {/* Ticket card */}
        <div className="vestra-ticket print-ticket" style={{
          marginTop: 24, background: t.card, borderRadius: 12,
          border: `1px solid ${t.line}`, overflow: 'hidden',
          position: 'relative',
          color: t.ink
        }}>
          {/* Perforation */}
          <div className="vestra-perf" style={{ position: 'absolute', left: -8, top: '30%', width: 16, height: 16, borderRadius: 8, background: t.bg }} />
          <div className="vestra-perf" style={{ position: 'absolute', right: -8, top: '30%', width: 16, height: 16, borderRadius: 8, background: t.bg }} />

          <div style={{ padding: '18px 20px 16px 20px' }}>
            <Row justify="space-between" align="center">
              <Stack gap={3}>
                <Eyebrow color={t.ink3}>Kode reservasi</Eyebrow>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 16, fontWeight: 500, color: t.ink, letterSpacing: '0.04em' }}>{code}</span>
              </Stack>
              <div style={{
                width: 54, height: 54, borderRadius: 10, display: 'grid', placeItems: 'center',
                background: t.ink, color: t.bg,
                fontFamily: 'Geist, sans-serif', fontSize: 28, letterSpacing: '-0.02em'
              }}>{cafe.brand}</div>
            </Row>
          </div>

          <div style={{ position: 'relative', height: 1, margin: '0 14px' }}>
            <div style={{ borderTop: `1px dashed ${t.line}`, position: 'absolute', left: 0, right: 0, top: 0 }} />
          </div>

          <div style={{ padding: '18px 20px' }}>
            <Stack gap={12}>
              <Row justify="space-between" align="flex-start">
                <Stack gap={4}>
                  <Eyebrow color={t.ink3}>Kedai</Eyebrow>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>{cafe.name}</span>
                  <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>{cafe.area}</span>
                </Stack>
                <Stack gap={4} style={{ textAlign: 'right' }}>
                  <Eyebrow color={t.ink3}>{cafe.guestNoun.charAt(0).toUpperCase() + cafe.guestNoun.slice(1)}</Eyebrow>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>{booking.pax} {cafe.guestNoun}</span>
                  <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>
                    {cafe.spaceTypes.find((x) => x.id === booking.tableType)?.label}
                  </span>
                </Stack>
              </Row>

              <div style={{ height: 1, background: t.line }} />

              <Row justify="space-between" align="flex-start">
                <Stack gap={4}>
                  <Eyebrow color={t.ink3}>Tanggal</Eyebrow>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>
                    {booking.date && `${booking.date.getDate()} ${VESTRA_MONTHS_ID[booking.date.getMonth()].slice(0, 3)} ${booking.date.getFullYear()}`}
                  </span>
                  <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>
                    {booking.date && VESTRA_DAYS_FULL_ID[booking.date.getDay()]}
                  </span>
                </Stack>
                <Stack gap={4} style={{ textAlign: 'right' }}>
                  <Eyebrow color={t.ink3}>Waktu</Eyebrow>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 24, color: accent.hex, letterSpacing: '-0.02em' }}>{booking.time}</span>
                  <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>WIB · {bill.dur ? bill.dur.label : 'sesuai slot'}</span>
                </Stack>
              </Row>

              {/* Pre-order items */}
              {orderedItems.length > 0 &&
              <>
                  <div style={{ height: 1, background: t.line }} />
                  <Stack gap={8}>
                    <Eyebrow color={t.ink3}>Pre-order ({orderedItems.length} item)</Eyebrow>
                    {orderedItems.map((it) => {
                    const q = booking.menu[it.id];
                    return (
                      <Row key={it.id} justify="space-between" align="baseline" gap={10}>
                          <Stack gap={1} style={{ flex: 1 }}>
                            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500, color: t.ink, letterSpacing: '-0.01em' }}>{it.name}</span>
                            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, color: t.ink3 }}>{q} × {vestraFmtRp(it.price)}</span>
                          </Stack>
                          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500, color: t.ink }}>{vestraFmtRp(it.price * q)}</span>
                        </Row>);

                  })}
                  </Stack>
                </>
              }

              {/* Payment breakdown */}
              <div style={{ height: 1, background: t.line }} />
              <Stack gap={6}>
                <Eyebrow color={t.ink3}>Pembayaran</Eyebrow>
                {bill.base > 0 &&
                <Row justify="space-between">
                    <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>{cafe.baseLabel} · {bill.dur ? bill.dur.label : ''}</span>
                    <span style={{ fontSize: 12, color: t.ink2, fontFamily: 'Geist, sans-serif' }}>{vestraFmtRp(bill.base)}</span>
                  </Row>
                }
                {orderedItems.length > 0 &&
                <Row justify="space-between">
                    <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>Subtotal pre-order</span>
                    <span style={{ fontSize: 12, color: t.ink2, fontFamily: 'Geist, sans-serif' }}>{vestraFmtRp(bill.services)}</span>
                  </Row>
                }
                {bill.fee > 0 &&
                <Row justify="space-between">
                    <span style={{ fontSize: 12, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>Biaya reservasi</span>
                    <span style={{ fontSize: 12, color: t.ink2, fontFamily: 'Geist, sans-serif' }}>{vestraFmtRp(bill.fee)}</span>
                  </Row>
                }
                <Row justify="space-between" align="center" style={{ marginTop: 4 }}>
                  <Stack gap={1}>
                    <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 18, fontWeight: 600, color: t.ink, lineHeight: 1, letterSpacing: '-0.01em' }}>{remaining > 0 ? 'Sudah dibayar (DP)' : 'Lunas dibayar'}</span>
                    <span style={{ fontSize: 10, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>via {methodName}</span>
                  </Stack>
                  <span style={{ fontFamily: 'Geist, sans-serif', fontWeight: 700, fontSize: 22, color: accent.hex, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                    {vestraFmtRp(dpTotal)}
                  </span>
                </Row>
                {remaining > 0 &&
                <Row justify="space-between">
                    <span style={{ fontSize: 11, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>Sisa bayar di tempat</span>
                    <span style={{ fontSize: 11, color: t.ink3, fontFamily: 'Geist, sans-serif' }}>{vestraFmtRp(remaining)}</span>
                  </Row>
                }
              </Stack>

              {/* Bukti pembayaran */}
              {booking.proofFile &&
              <>
                  <div style={{ height: 1, background: t.line }} />
                  <Row justify="space-between" align="center" gap={10}>
                    <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
                      <Eyebrow color={t.ink3}>Bukti bayar</Eyebrow>
                      <Row gap={6} align="center">
                        <Icon.check style={{ color: accent.hex, width: 13, height: 13 }} />
                        <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 12, fontWeight: 600, color: t.ink }}>Terverifikasi</span>
                      </Row>
                      <span style={{
                      fontFamily: 'Geist, sans-serif', fontSize: 10, color: t.ink3,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>{booking.proofFile.name}</span>
                    </Stack>
                    <div style={{
                    width: 54, height: 54, borderRadius: 8, overflow: 'hidden',
                    background: `url("${booking.proofFile.dataUrl}") center/cover, ${t.bg2}`,
                    border: `1px solid ${t.line}`
                  }} />
                  </Row>
                </>
              }

              {booking.tags.length > 0 &&
              <>
                  <div style={{ height: 1, background: t.line }} />
                  <Stack gap={6}>
                    <Eyebrow color={t.ink3}>Catatan</Eyebrow>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {booking.tags.map((tag) =>
                    <span key={tag} style={{
                      fontSize: 11, padding: '4px 9px', borderRadius: 6, background: t.chip,
                      color: t.ink2, fontFamily: 'Geist, sans-serif', fontWeight: 500
                    }}>{tag}</span>
                    )}
                    </div>
                    {booking.note &&
                  <p style={{ margin: '4px 0 0 0', fontSize: 12, color: t.ink2, fontFamily: 'Geist, sans-serif', lineHeight: 1.5 }}>
                        "{booking.note}"
                      </p>
                  }
                  </Stack>
                </>
              }
            </Stack>
          </div>

          {/* Barcode footer */}
          <div style={{ padding: '14px 20px 18px 20px', borderTop: `1px dashed ${t.line}`, background: t.bg2 }}>
            <Row justify="space-between" align="center">
              <Stack gap={2}>
                <Eyebrow color={t.ink3}>Issued</Eyebrow>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, color: t.ink2, letterSpacing: '0.04em' }}>
                  17.05.2026 · vestra.id
                </span>
              </Stack>
              <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 24 }}>
                {[3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 2, 3, 1].map((w, i) =>
                <div key={i} style={{ width: w, height: '100%', background: t.ink }} />
                )}
              </div>
            </Row>
          </div>
        </div>

        {/* Actions */}
        <div data-no-print style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button onClick={savePDF} style={{
            padding: '14px 12px', borderRadius: 8, border: `1px solid ${t.line}`,
            background: t.card, color: t.ink, fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '-0.01em'
          }}><Icon.download /> Simpan PDF</button>
          <a href={`https://wa.me/${VESTRA_WA}?text=${encodeURIComponent('Halo ' + cafe.name + ', saya mau tanya soal reservasi saya. Kode: ' + code)}`}
             target="_blank" rel="noopener noreferrer"
             onClick={(e) => { e.preventDefault(); window.open(`https://wa.me/${VESTRA_WA}?text=${encodeURIComponent('Halo ' + cafe.name + ', saya mau tanya soal reservasi saya. Kode: ' + code)}`, '_blank', 'noopener'); }}
             style={{
            padding: '14px 12px', borderRadius: 8, border: 'none',
            background: accent.hex, color: accent.on, fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '-0.01em',
            textDecoration: 'none',
          }}>
            <Icon.chat /> Hubungi
          </a>
        </div>
      </div>

      <BottomDock t={t}>
        <PrimaryButton t={t} accent={accent} onClick={onDone} sub="Kembali ke beranda">
          Selesai
        </PrimaryButton>
      </BottomDock>

      <style>{`@keyframes spin { from {transform: rotate(0)} to {transform: rotate(360deg)} }`}</style>
    </div>);

}

// Lift onto window
Object.assign(window, {
  BrowseScreen, DetailScreen, DateTimeScreen, PartyScreen,
  MenuScreen, GuestScreen, RequestScreen, PaymentScreen, UploadProofScreen, ConfirmScreen
});
export {
  DetailScreen, DateTimeScreen, PartyScreen,
  MenuScreen, GuestScreen, RequestScreen,
  PaymentScreen, UploadProofScreen, ConfirmScreen,
  CheckBookingScreen,
};
