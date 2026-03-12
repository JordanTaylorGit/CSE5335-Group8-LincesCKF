import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProcessSteps from '../components/home/ProcessSteps';

/*
 * B2BServices.jsx — Teammate 4 - Jordan Taylor
 */

const SERVICES = [
  {
    icon: <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M17 4L4 11V23L17 30L30 23V11L17 4Z" stroke="currentColor" strokeWidth="1.1"/><path d="M17 4v26M4 11l13 7 13-7" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
    titleKey: 'services.offer1.title', descKey: 'services.offer1.desc', stat: '50+',   statLabel: 'Min. Units',
  },
  {
    icon: <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect x="4" y="8" width="26" height="20" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M4 15h26M12 8V6M22 8V6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M10 22h6M10 26h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
    titleKey: 'services.offer2.title', descKey: 'services.offer2.desc', stat: '2–3',   statLabel: 'Weeks',
  },
  {
    icon: <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="13" stroke="currentColor" strokeWidth="1.1"/><path d="M17 10v7l5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    titleKey: 'services.offer3.title', descKey: 'services.offer3.desc', stat: '3–6',   statLabel: 'Weeks',
  },
  {
    icon: <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M8 28V16l9-8 9 8v12" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M13 28v-8h8v8" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
    titleKey: 'services.offer4.title', descKey: 'services.offer4.desc', stat: '100%', statLabel: 'Private',
  },
];

// B2B Feature Cards
const B2B_FEATURES = [
  {
    icon: <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M17 4L4 11V23L17 30L30 23V11L17 4Z" stroke="currentColor" strokeWidth="1.1"/><path d="M17 4v26M4 11l13 7 13-7" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
    titleKey: 'b2b.feature1.title', descKey: 'b2b.feature1.desc',
  },
  {
    icon: <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="13" stroke="currentColor" strokeWidth="1.1"/><path d="M8 13l4 4 7-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    titleKey: 'b2b.feature2.title', descKey: 'b2b.feature2.desc',
  },
  {
    icon: <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect x="4" y="8" width="26" height="20" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M8 15h26M12 8V6M22 8V6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M10 22h6M10 26h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
    titleKey: 'b2b.feature3.title', descKey: 'b2b.feature3.desc',
  },
  {
    icon: <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M4 18l6-6 3 3 9-9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
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
      color: dark ? '#B8D4E8' : '#eb9605',
      marginBottom: 12,
    }}>
      {text}
    </p>
  );
}

// ─── Page hero ────────────────────────────────────────────────────────────────
function PageHero() {
  const { t } = useTranslation();
  const vars  = { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } } };
  const line  = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <section
      className="relative flex items-end px-6 pb-20 overflow-hidden"
      style={{ minHeight: '52vh', background: '#0B2545' }}
    >
      {/* Sky-blue radial glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(184,212,232,0.1) 0%, transparent 70%)',
      }} />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto w-full"
        variants={vars}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={line}>
          <Eyebrow text={t('services.eyebrow')} dark />
        </motion.div>
        <motion.h1
          variants={line}
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(2.6rem, 6vw, 5.5rem)',
            fontWeight: 300,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginBottom: 18,
          }}
        >
          {t('services.pageTitle')}{' '}
          <em style={{ color: '#ffae42', fontStyle: 'italic' }}>{t('services.pageTitleAccent')}</em>
        </motion.h1>
        <motion.p
          variants={line}
          style={{
            fontFamily: 'Jost, sans-serif',
            fontSize: '1rem',
            fontWeight: 300,
            color: 'rgba(232,244,253,0.6)',
            maxWidth: 500,
            lineHeight: 1.8,
          }}
        >
          {t('services.pageDesc')}
        </motion.p>
      </motion.div>
    </section>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, index }) {
  const { t }  = useTranslation();
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      style={{
        flex: '1 1 240px',
        padding: '32px 28px',
        background: '#ffffff',
        border: '1px solid #B8D4E8',
        position: 'relative',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#0B2545'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(11,37,69,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#B8D4E8'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Stat badge */}
      <div style={{
        position: 'absolute', top: 18, right: 20,
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: '1.3rem',
        fontWeight: 600,
        color: 'rgba(200,16,46,0.15)',
        lineHeight: 1,
        textAlign: 'right',
      }}>
        {service.stat}
        <span style={{
          display: 'block',
          fontFamily: 'Cinzel, serif',
          fontSize: '0.48rem',
          letterSpacing: '0.15em',
          color: 'rgba(200,16,46,0.2)',
          textTransform: 'uppercase',
          fontWeight: 400,
        }}>
          {service.statLabel}
        </span>
      </div>

      <div style={{ color: '#0B2545', marginBottom: 20 }}>{service.icon}</div>

      <h3 style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: '1.3rem',
        fontWeight: 500,
        color: '#0B2545',
        marginBottom: 10,
      }}>
        {t(service.titleKey)}
      </h3>
      <p style={{
        fontFamily: 'Jost, sans-serif',
        fontSize: '0.86rem',
        fontWeight: 300,
        lineHeight: 1.75,
        color: 'rgba(11,37,69,0.55)',
      }}>
        {t(service.descKey)}
      </p>
    </motion.div>
  );
}

// ─── B2B Feature card ─────────────────────────────────────────────────────────
function B2BFeatureCard({ feature, index }) {
  const { t }  = useTranslation();
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      style={{
        flex: '1 1 240px',
        padding: '32px 28px',
        background: '#ffffff',
        border: '1px solid #B8D4E8',
        position: 'relative',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#0B2545'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(11,37,69,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#B8D4E8'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ color: '#0B2545', marginBottom: 20 }}>{feature.icon}</div>

      <h3 style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: '1.3rem',
        fontWeight: 500,
        color: '#0B2545',
        marginBottom: 10,
      }}>
        {t(feature.titleKey)}
      </h3>
      <p style={{
        fontFamily: 'Jost, sans-serif',
        fontSize: '0.86rem',
        fontWeight: 300,
        lineHeight: 1.75,
        color: 'rgba(11,37,69,0.55)',
      }}>
        {t(feature.descKey)}
      </p>
    </motion.div>
  );
}

// ─── Main ServicesPage ────────────────────────────────────────────────────────
export default function ServicesPage() {
  const { t }      = useTranslation();
  const offerRef   = useRef(null);
  const offerView  = useInView(offerRef, { once: true });
  const whyRef     = useRef(null);
  const whyView    = useInView(whyRef, { once: true });

  return (
    <main style={{ background: '#ffffff' }}>
      {/* ── 1. Page Hero (navy) ── */}
      <PageHero />

      {/* ── 2. What We Offer (white) ── */}
      <section className="py-24 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            ref={offerRef}
            className="mb-14"
            initial={{ opacity: 0, y: 24 }}
            animate={offerView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65 }}
          >
            <Eyebrow text={t('services.what.eyebrow')} />
            <h2 style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(1.9rem, 3.5vw, 3rem)',
              fontWeight: 300,
              color: '#0B2545',
              letterSpacing: '-0.02em',
            }}>
              {t('services.what.heading')}
            </h2>
          </motion.div>

          <div className="flex flex-wrap gap-5">
            {SERVICES.map((s, i) => <ServiceCard key={i} service={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── 3. Process Steps (navy) ── */}
      <ProcessSteps />

      {/* ── 4. B2B Features (white) ── */}
      <section className="py-24 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 24 }}
            animate={whyView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65 }}
          >
            <Eyebrow text={t('b2b.eyebrow')} />
            <h2 style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(1.9rem, 3.5vw, 3rem)',
              fontWeight: 300,
              color: '#0B2545',
              letterSpacing: '-0.02em',
            }}>
              {t('b2b.heading')}
            </h2>
            <p style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '1rem',
              fontWeight: 300,
              color: 'rgba(11,37,69,0.55)',
              maxWidth: 500,
              lineHeight: 1.8,
              marginTop: 10,
            }}>
              {t('b2b.desc')}
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-5">
            {B2B_FEATURES.map((f, i) => <B2BFeatureCard key={i} feature={f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── 5. CTA Section (navy) ── */}
      <section
        className="relative py-24 px-6 overflow-hidden"
        style={{ background: '#0B2545' }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(184,212,232,0.1) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(255,174,66,0.1) 0%, transparent 50%)',
        }} />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
          >
            <Eyebrow text={t('b2b.cta.eyebrow')} dark />
            <h2 style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
              fontWeight: 300,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              {t('b2b.cta.heading')}
            </h2>
            <p style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 300,
              color: 'rgba(232,244,253,0.8)',
              maxWidth: 600,
              lineHeight: 1.8,
              margin: '0 auto 32px',
            }}>
              {t('b2b.cta.desc')}
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                background: '#ffae42',
                color: '#0B2545',
                fontFamily: 'Cinzel, serif',
                fontSize: '1rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontWeight: 600,
                borderRadius: '4px',
                boxShadow: '0 8px 30px rgba(11,37,69,0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ffb85a'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(11,37,69,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ffae42'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(11,37,69,0.3)'; }}
            >
              {t('b2b.cta.button')}
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
