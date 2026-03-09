import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/*
 * ProcessSteps.jsx — Teammate 4 - Jordan Taylor
 */

const STEPS = [
  {
    number: '01',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.2" />
        <path d="M16 10v6l4 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    titleKey:    'process.step1.title',
    subtitleKey: 'process.step1.subtitle',
    descKey:     'process.step1.desc',
  },
  {
    number: '02',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="22" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 12h16M8 17h10M8 22h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M10 6V4M22 6V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    titleKey:    'process.step2.title',
    subtitleKey: 'process.step2.subtitle',
    descKey:     'process.step2.desc',
  },
  {
    number: '03',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    titleKey:    'process.step3.title',
    subtitleKey: 'process.step3.subtitle',
    descKey:     'process.step3.desc',
  },
  {
    number: '04',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 16l7 7L26 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    titleKey:    'process.step4.title',
    subtitleKey: 'process.step4.subtitle',
    descKey:     'process.step4.desc',
  },
];

function StepCard({ step, index }) {
  const { t } = useTranslation();
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.13 }}
      className="relative flex flex-col items-center text-center px-4"
      style={{ flex: '1 1 220px' }}
    >
      {/* Connector line (desktop only, not on last) */}
      {index < STEPS.length - 1 && (
        <motion.div
          className="hidden lg:block absolute top-9 z-0"
          style={{
            left: 'calc(50% + 36px)',
            right: 'calc(-50% + 36px)',
            height: 1,
            background: 'linear-gradient(90deg, #B8D4E8 0%, rgba(184,212,232,0.15) 100%)',
          }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: index * 0.13 + 0.35 }}
        />
      )}

      {/* Icon circle */}
      <div
        className="relative z-10 flex items-center justify-center mb-5"
        style={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          border: '1.5px solid #B8D4E8',
          background: 'rgba(184,212,232,0.1)',
          color: '#B8D4E8',
        }}
      >
        {step.icon}
        {/* Number badge */}
        <span style={{
          position: 'absolute',
          top: -9,
          right: -9,
          fontFamily: 'Cinzel, serif',
          fontSize: '0.55rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#0B2545',
          background: '#B8D4E8',
          borderRadius: 2,
          padding: '2px 5px',
        }}>
          {step.number}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: '1.3rem',
        fontWeight: 500,
        color: '#ffffff',
        marginBottom: 4,
        letterSpacing: '-0.01em',
      }}>
        {t(step.titleKey)}
      </h3>

      {/* Subtitle */}
      <p style={{
        fontFamily: 'Cinzel, serif',
        fontSize: '0.58rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#B8D4E8',
        marginBottom: 12,
      }}>
        {t(step.subtitleKey)}
      </p>

      <div style={{ width: 28, height: 1, background: '#B8D4E8', opacity: 0.4, marginBottom: 12 }} />

      {/* Description */}
      <p style={{
        fontFamily: 'Jost, sans-serif',
        fontSize: '0.87rem',
        fontWeight: 300,
        lineHeight: 1.75,
        color: 'rgba(232,244,253,0.65)',
      }}>
        {t(step.descKey)}
      </p>
    </motion.div>
  );
}

export default function ProcessSteps() {
  const { t }   = useTranslation();
  const headRef = useRef(null);
  const inView  = useInView(headRef, { once: true });

  return (
    <section
      className="py-24 px-6"
      style={{ background: '#0B2545' }}
      aria-labelledby="process-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headRef}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.62rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#B8D4E8',
            marginBottom: 14,
          }}>
            {t('process.eyebrow')}
          </p>
          <h2
            id="process-heading"
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 300,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: 14,
            }}
          >
            {t('process.heading')}
          </h2>
          <p style={{
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 300,
            color: 'rgba(232,244,253,0.6)',
            maxWidth: 460,
            margin: '0 auto',
            lineHeight: 1.8,
          }}>
            {t('process.subheading')}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-6 relative">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
