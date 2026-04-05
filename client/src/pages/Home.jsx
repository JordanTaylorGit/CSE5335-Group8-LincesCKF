/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/home/HeroSection';
import ProductCard from '../components/shared/ProductCard';
import { getFeaturedProducts } from '../data/products';

// ─── Call to get featured products ───────────────────────────────────────────────────
const FEATURED_PRODUCTS = getFeaturedProducts();

// ─── B2B feature cards ────────────────────────────────────────────────────────
const B2B_FEATURES = [
  {
    icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3L3 8.5V17.5L13 23L23 17.5V8.5L13 3Z" stroke="currentColor" strokeWidth="1.2"/><path d="M13 3v20M3 8.5l10 5 10-5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
    titleKey: 'b2b.feature1.title', descKey: 'b2b.feature1.desc',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="10" stroke="currentColor" strokeWidth="1.2"/><path d="M8 13l4 4 7-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    titleKey: 'b2b.feature2.title', descKey: 'b2b.feature2.desc',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="3" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M8 9h10M8 13h7M8 17h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    titleKey: 'b2b.feature3.title', descKey: 'b2b.feature3.desc',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 18l6-6 3 3 9-9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    titleKey: 'b2b.feature4.title', descKey: 'b2b.feature4.desc',
  },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────
function Eyebrow({ text, dark = false }) {
  return (
    <p style={{
      fontFamily: 'Cinzel, serif',
      fontSize: '0.6rem',
      letterSpacing: '0.32em',
      textTransform: 'uppercase',
      color: dark ? '#B8D4E8' : '#0B2545',
      marginBottom: 12,
    }}>
      {text}
    </p>
  );
}

function SectionHeading({ children, light = false }) {
  return (
    <h2 style={{
      fontFamily: 'Cormorant Garamond, Georgia, serif',
      fontSize: 'clamp(1.9rem, 3.5vw, 3rem)',
      fontWeight: 300,
      letterSpacing: '-0.02em',
      color: light ? '#ffffff' : '#0B2545',
      marginBottom: 14,
    }}>
      {children}
    </h2>
  );
}

// ─── B2B feature card ─────────────────────────────────────────────────────────
function B2BFeatureCard({ feature, index }) {
  const { t }  = useTranslation();

  return (
    <div
      style={{
        flex: '1 1 220px',
        padding: '28px 24px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(184,212,232,0.2)',
        transition: 'border-color 0.25s ease, background 0.25s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#B8D4E8'; e.currentTarget.style.background = 'rgba(184,212,232,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(184,212,232,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
    >
      <div style={{ color: '#B8D4E8', marginBottom: 18 }}>{feature.icon}</div>
      <h3 style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: '1.2rem',
        fontWeight: 500,
        color: '#ffffff',
        marginBottom: 10,
      }}>
        {t(feature.titleKey)}
      </h3>
      <p style={{
        fontFamily: 'Jost, sans-serif',
        fontSize: '0.86rem',
        fontWeight: 300,
        lineHeight: 1.75,
        color: 'rgba(232,244,253,0.6)',
      }}>
        {t(feature.descKey)}
      </p>
    </div>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────
export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main>
      {/* ══ 1. Hero section ════════════════════════════════════════════════ */}
      <HeroSection />

      {/* ══ 2. Featured products section ══════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
            <div>
              <Eyebrow text={t('featured.eyebrow')} />
              <SectionHeading>{t('featured.heading')}</SectionHeading>
              <p style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.92rem',
                fontWeight: 300,
                color: 'rgba(11,37,69,0.55)',
                maxWidth: 360,
                lineHeight: 1.8,
              }}>
                {t('featured.desc')}
              </p>
            </div>
            <Link to="/catalog" style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#0B2545',
              textDecoration: 'none',
              borderBottom: '1px solid #B8D4E8',
              paddingBottom: 3,
              whiteSpace: 'nowrap',
            }}>
              {t('featured.viewAll')}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ══ 3. B2B section ════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#0B2545' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Eyebrow text={t('b2b.eyebrow')} dark />
            <SectionHeading light>{t('b2b.heading')}</SectionHeading>
            <p style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.95rem',
              fontWeight: 300,
              color: 'rgba(232,244,253,0.55)',
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.8,
            }}>
              {t('b2b.desc')}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 mb-14">
            {B2B_FEATURES.map((f, i) => <B2BFeatureCard key={i} feature={f} index={i} />)}
          </div>

          <div className="text-center">
            <Link
              to="/b2b"
              className="inline-flex items-center gap-3"
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.66rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#E8F4FD',
                textDecoration: 'none',
                padding: '13px 32px',
                border: '1.5px solid #B8D4E8',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,212,232,0.15)'; e.currentTarget.style.borderColor = '#E8F4FD'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#B8D4E8'; }}
            >
              {t('hero.ctaB2B')}
              <svg width="13" height="8" viewBox="0 0 13 8" fill="none">
                <path d="M0 4h11M7.5 1L11 4l-3.5 3" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 4. Quote/Cta section ═══════════════════════════════ */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: '#ffffff', borderTop: '1px solid #B8D4E8', borderBottom: '1px solid #B8D4E8' }}
      >
        <div className="max-w-2xl mx-auto">
          <Eyebrow text={t('cta.eyebrow')} />
          <h2 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: 300,
            color: '#0B2545',
            letterSpacing: '-0.02em',
            marginBottom: 14,
          }}>
            {t('cta.heading')}
          </h2>
          <p style={{
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 300,
            color: 'rgba(11,37,69,0.6)',
            marginBottom: 30,
            lineHeight: 1.75,
          }}>
            {t('cta.desc')}
          </p>
          <Link
            to="/custom-orders"
            className="inline-flex items-center gap-3"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#ffffff',
              background: '#16141a',
              padding: '14px 36px',
              textDecoration: 'none',
              transition: 'background 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0B2545'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#16141a'; }}
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </main>
  );
}
