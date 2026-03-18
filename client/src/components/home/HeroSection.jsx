/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '50vh' }}
      aria-label={t('hero.ariaLabel')}
    >
      {/* ── Silk-red background ── */}
      <div className="absolute inset-0 z-0" >
        {/* Base silk red. TODO change to img */}
              {/* <div className="absolute inset-0" style={{ background: "#C8102E" }} /> */}

        {/* Hero background image */}
        <img
          src="https://images.unsplash.com/photo-1758551015352-fa735f167422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwc2lsayUyMGZhYnJpYyUyMGZsb3dpbmclMjBsdXh1cnl8ZW58MXx8fHwxNzY5OTg5MTkwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Premium silk fabric"
          className="absolute inset-0 w-full h-full object-cover"
        />
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
      </div>

      {/* ── Content ── */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: '50vh' }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 mb-8">
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
          </div>

          {/* Headline */}
          <div className="overflow-hidden mb-3">
            <h1
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
            </h1>
          </div>

          {/* Tagline */}
          <div className="overflow-hidden mb-6">
            <p
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(0.65rem, 1.4vw, 0.9rem)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              {t('hero.tagline')}
            </p>
          </div>

          {/* Description */}
          <div className="overflow-hidden mb-12">
            <p
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
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
          </div>
        </div>
      </div>
    </section>
  );
}
