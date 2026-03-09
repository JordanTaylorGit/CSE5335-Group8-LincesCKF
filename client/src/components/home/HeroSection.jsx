import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/*
 * HeroSection.jsx — Teammate 4 - Jordan Taylor
 */

export default function HeroSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.16, delayChildren: 0.25 } },
  };
  const lineVariants = {
    hidden:  { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
  };
  const badgeVariants = {
    hidden:  { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
      aria-label={t('hero.ariaLabel')}
    >
      {/* ── Silk-red background ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        {/* Base silk red. TODO change to img */}
        <div className="absolute inset-0" style={{ background: '#C8102E' }} />

        {/* Silk sheen — lighter diagonal highlight */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(125deg, rgba(255,255,255,0.14) 0%, transparent 45%, rgba(0,0,0,0.2) 100%)',
          }}
        />

        {/* Subtle woven-fabric texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              135deg,
              transparent,
              transparent 3px,
              rgba(255,255,255,0.07) 3px,
              rgba(255,255,255,0.07) 4px
            )`,
          }}
        />
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: '100vh', opacity }}
      >
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={badgeVariants} className="inline-flex items-center gap-3 mb-8">
            <span style={{ display: 'block', height: 1, width: 36, background: 'rgba(255,255,255,0.5)' }} />
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.62rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.85)',
            }}>
              {t('hero.badge')}
            </span>
            <span style={{ display: 'block', height: 1, width: 36, background: 'rgba(255,255,255,0.5)' }} />
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-3">
            <motion.h1
              variants={lineVariants}
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 'clamp(3.2rem, 8vw, 7.5rem)',
                fontWeight: 300,
                lineHeight: 1.0,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              {t('hero.headline1')}
              <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.75)' }}>CKF</span>
            </motion.h1>
          </div>

          {/* Tagline */}
          <div className="overflow-hidden mb-6">
            <motion.p
              variants={lineVariants}
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(0.65rem, 1.4vw, 0.9rem)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              {t('hero.tagline')}
            </motion.p>
          </div>

          {/* Description */}
          <div className="overflow-hidden mb-12">
            <motion.p
              variants={lineVariants}
              className="max-w-xl mx-auto"
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
                fontWeight: 300,
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.78)',
              }}
            >
              {t('hero.description')}
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            variants={lineVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Primary — white filled */}
            <Link
              to="/catalog"
              className="inline-flex items-center gap-3 px-10 py-4"
              style={{
                background: '#ffffff',
                fontFamily: 'Cinzel, serif',
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#C8102E',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.25s ease, color 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0B2545'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#C8102E'; }}
            >
              <span>{t('hero.ctaShop')}</span>
              <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                <path d="M0 4.5H12M8.5 1L12 4.5L8.5 8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>

            {/* Secondary — outlined white */}
            <Link
              to="/b2b"
              className="inline-flex items-center gap-3 px-10 py-4"
              style={{
                border: '1.5px solid rgba(255,255,255,0.65)',
                fontFamily: 'Cinzel, serif',
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.92)',
                fontWeight: 400,
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.65)'; }}
            >
              {t('hero.ctaB2B')}
            </Link>
          </motion.div>
        </motion.div>


      </motion.div>
    </section>
  );
}
