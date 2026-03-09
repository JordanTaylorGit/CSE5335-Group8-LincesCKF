import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/home/HeroSection';

/*
 * Home.jsx — Teammate 4 - Jordan Taylor
 */

// ─── Mock featured products ───────────────────────────────────────────────────
const FEATURED_PRODUCTS = [
  { id: 1, nameKey: 'product.blouse.name', subtitleDefault: 'Classic Silk Blouse', price: '$285', categoryKey: 'product.category.dtc', badge: 'New' },
  { id: 2, nameKey: 'product.dress.name',  subtitleDefault: 'Silk Midi Dress',     price: '$520', categoryKey: 'product.category.dtc', badge: 'Best Seller' },
  { id: 3, nameKey: 'product.scarf.name',  subtitleDefault: 'Hand-painted Silk Scarf', price: '$145', categoryKey: 'product.category.dtc', badge: null },
];

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
      color: dark ? '#B8D4E8' : '#C8102E',
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

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }) {
  const { t }  = useTranslation();
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="group"
      style={{ flex: '1 1 280px' }}
    >
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
        {/* Image placeholder */}
        <div
          className="relative overflow-hidden mb-4"
          style={{
            height: 320,
            background: '#d5d5d5',
            border: '1px solid #B8D4E8',
          }}
        >
          {/* Silk fabric placeholder visual */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ opacity: 0.2, color: '#0B2545' }}>
              <path d="M26 6C14.954 6 6 14.954 6 26s8.954 20 20 20 20-8.954 20-20S37.046 6 26 6z" stroke="currentColor" strokeWidth="1"/>
              <path d="M10 26c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
            style={{ background: 'rgba(11,37,69,0.55)', transition: 'opacity 0.3s ease' }}
          >
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.5)',
              padding: '9px 18px',
            }}>
              {t('product.view')}
            </span>
          </div>

          {/* Badge */}
          {product.badge && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              fontFamily: 'Cinzel, serif',
              fontSize: '0.54rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#ffffff',
              background: '#C8102E',
              padding: '3px 8px',
            }}>
              {product.badge}
            </div>
          )}
        </div>

        {/* Info */}
        <p style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.56rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#C8102E',
          marginBottom: 5,
        }}>
          {t(product.categoryKey)}
        </p>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: '1.25rem',
          fontWeight: 500,
          color: '#0B2545',
          marginBottom: 2,
        }}>
          {t(product.nameKey)}
        </h3>
        <p style={{
          fontFamily: 'Jost, sans-serif',
          fontSize: '0.82rem',
          color: 'rgba(11,37,69,0.45)',
          marginBottom: 8,
        }}>
          {product.subtitleDefault}
        </p>
        <p style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#C8102E',
        }}>
          {product.price}
        </p>
      </Link>
    </motion.article>
  );
}

// ─── B2B feature card ─────────────────────────────────────────────────────────
function B2BFeatureCard({ feature, index }) {
  const { t }  = useTranslation();
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
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
    </motion.div>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────
export default function HomePage() {
  const { t } = useTranslation();

  const featuredRef  = useRef(null);
  const featuredView = useInView(featuredRef, { once: true });
  const b2bRef       = useRef(null);
  const b2bView      = useInView(b2bRef, { once: true });
  const ctaRef       = useRef(null);
  const ctaView      = useInView(ctaRef, { once: true });

  return (
    <main>
      {/* ══ 1. HERO (silk red) ════════════════════════════════════════════════ */}
      <HeroSection />

      {/* ══ 2. FEATURED PRODUCTS (white bg) ══════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            ref={featuredRef}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4"
            initial={{ opacity: 0, y: 28 }}
            animate={featuredView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65 }}
          >
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
          </motion.div>

          <div className="flex flex-wrap gap-8">
            {FEATURED_PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ══ 3. B2B OVERVIEW (navy bg) ════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#0B2545' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            ref={b2bRef}
            className="text-center mb-16"
            initial={{ opacity: 0, y: 28 }}
            animate={b2bView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65 }}
          >
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
          </motion.div>

          <div className="flex flex-wrap gap-5 mb-14">
            {B2B_FEATURES.map((f, i) => <B2BFeatureCard key={i} feature={f} index={i} />)}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={b2bView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
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
              {t('b2b.cta')}
              <svg width="13" height="8" viewBox="0 0 13 8" fill="none">
                <path d="M0 4h11M7.5 1L11 4l-3.5 3" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ 4. QUOTE CTA BANNER (sky-blue bg) ═══════════════════════════════ */}
      <section
        ref={ctaRef}
        className="py-20 px-6 text-center"
        style={{ background: '#ffffff', borderTop: '1px solid #B8D4E8', borderBottom: '1px solid #B8D4E8' }}
      >
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={ctaView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
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
            to="/services#quote"
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
        </motion.div>
      </section>
    </main>
  );
}
