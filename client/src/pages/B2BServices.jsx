import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Scissors, Clock, Star, Package } from 'lucide-react';

const SERVICES = [
  {
    icon: Scissors,
    titleEs: 'Confección Premium',
    titleEn: 'Premium Confection',
    descEs: 'Costura de alta precisión para prendas de seda y materiales delicados.',
    descEn: 'High-precision sewing for silk and delicate fabric garments.',
  },
  {
    icon: Package,
    titleEs: 'Producción por Lotes',
    titleEn: 'Batch Production',
    descEs: 'Pedidos mínimos desde 50 unidades con tiempos de entrega competitivos.',
    descEn: 'Minimum orders from 50 units with competitive lead times.',
  },
  {
    icon: Star,
    titleEs: 'Control de Calidad',
    titleEn: 'Quality Control',
    descEs: 'Revisión minuciosa de cada prenda antes del envío.',
    descEn: 'Meticulous review of every garment before shipment.',
  },
  {
    icon: Clock,
    titleEs: 'Tiempos de Entrega',
    titleEn: 'Lead Times',
    descEs: '4–8 semanas según la complejidad y volumen del pedido.',
    descEn: '4–8 weeks depending on order complexity and volume.',
  },
];

export default function B2BServices() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="bg-obsidian text-ivory py-32 px-6 text-center">
        <p className="font-accent text-silk-400 text-xs tracking-[0.4em] uppercase mb-4">B2B</p>
        <h1 className="font-display text-5xl md:text-7xl mb-6">{t('b2b.title')}</h1>
        <p className="font-body text-ivory/50 text-lg max-w-xl mx-auto mb-10">{t('b2b.subtitle')}</p>
        <Link to="/b2b/contact" className="btn-primary">
          {t('b2b.contact')}
        </Link>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            const title = t('b2b.services') === 'Services' ? svc.titleEn : svc.titleEs;
            const desc = t('b2b.services') === 'Services' ? svc.descEn : svc.descEs;
            return (
              <div key={i} className="p-8 border border-silk-100 hover:border-silk-300 transition-colors">
                <Icon size={24} className="text-silk-500 mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-2xl mb-3">{title}</h3>
                <p className="font-body text-obsidian/60 leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
