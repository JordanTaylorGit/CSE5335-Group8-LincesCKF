/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { useTranslation } from 'react-i18next';
import { CalendarClock, CheckCircle2, ClipboardList, Shirt } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    Icon: CalendarClock,
    titleKey:    'process.step1.title',
    subtitleKey: 'process.step1.subtitle',
    descKey:     'process.step1.desc',
  },
  {
    number: '02',
    Icon: ClipboardList,
    titleKey:    'process.step2.title',
    subtitleKey: 'process.step2.subtitle',
    descKey:     'process.step2.desc',
  },
  {
    number: '03',
    Icon: Shirt,
    titleKey:    'process.step3.title',
    subtitleKey: 'process.step3.subtitle',
    descKey:     'process.step3.desc',
  },
  {
    number: '04',
    Icon: CheckCircle2,
    titleKey:    'process.step4.title',
    subtitleKey: 'process.step4.subtitle',
    descKey:     'process.step4.desc',
  },
];

function StepCard({ step, index }) {
  const { t } = useTranslation();
  const Icon = step.Icon;

  return (
    <div
      className="process-steps__card relative flex flex-col items-center text-center px-4"
      style={{ flex: '1 1 220px' }}
    >
      {/* Connector line (desktop only, not on last) */}
      {index < STEPS.length - 1 && (
        <div
          className="process-steps__connector hidden lg:block absolute top-9 z-0"
          style={{
            left: 'calc(50% + 36px)',
            right: 'calc(-50% + 36px)',
            height: 1,
            background: 'linear-gradient(90deg, #B8D4E8 0%, rgba(184,212,232,0.15) 100%)',
          }}
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
        <Icon size={32} strokeWidth={1.4} aria-hidden="true" />
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
    </div>
  );
}

export default function ProcessSteps() {
  const { t }   = useTranslation();

  return (
    <section
      className="process-steps py-24 px-6"
      style={{ background: '#0B2545' }}
      aria-labelledby="process-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-20"
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
        </div>

        {/* Steps */}
        <div className="process-steps__grid flex flex-col lg:flex-row gap-10 lg:gap-6 relative">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
