import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@components/shared/ProductCard';
import { getFeaturedProducts } from '@utils/products';

const featured = getFeaturedProducts();

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian">
        {/* Background texture */}
        <div className="absolute inset-0 silk-gradient opacity-10" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23bf7a45' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-up">
          <p className="font-accent text-silk-400 text-xs tracking-[0.4em] uppercase mb-6">
            Linces'CKF
          </p>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-ivory font-light leading-none mb-8">
            {t('home.hero_tagline')}
          </h1>
          <p className="font-body text-ivory/60 text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto mb-12">
            {t('home.hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog" className="btn-primary">
              {t('home.cta_shop')}
            </Link>
            <Link
              to="/b2b"
              className="btn-outline border-ivory/30 text-ivory hover:bg-ivory hover:text-obsidian"
            >
              {t('home.cta_b2b')}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-silk-400 animate-pulse" />
        </div>
      </section>

      {/* ── Featured Collection ───────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-accent text-silk-500 text-xs tracking-[0.4em] uppercase mb-3">Collection</p>
          <h2 className="font-display text-4xl md:text-5xl text-obsidian">
            {t('home.featured_title')}
          </h2>
          <div className="divider-silk w-24 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link to="/catalog" className="btn-outline inline-flex items-center gap-2">
            View Full Collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Services Divider ──────────────────────────── */}
      <section className="py-24 bg-obsidian-soft text-ivory">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-0">
          {/* DTC */}
          <div className="p-12 lg:p-16 border-b md:border-b-0 md:border-r border-silk-800">
            <p className="font-accent text-silk-400 text-xs tracking-widest uppercase mb-4">01</p>
            <h3 className="font-display text-3xl md:text-4xl mb-4">{t('home.dtc_title')}</h3>
            <p className="font-body text-ivory/50 leading-relaxed mb-8">{t('home.dtc_desc')}</p>
            <Link to="/catalog" className="font-body text-sm text-silk-400 hover:text-silk-300 tracking-wider flex items-center gap-2">
              Shop Now <ArrowRight size={14} />
            </Link>
          </div>

          {/* B2B */}
          <div className="p-12 lg:p-16">
            <p className="font-accent text-silk-400 text-xs tracking-widest uppercase mb-4">02</p>
            <h3 className="font-display text-3xl md:text-4xl mb-4">{t('home.b2b_title')}</h3>
            <p className="font-body text-ivory/50 leading-relaxed mb-8">{t('home.b2b_desc')}</p>
            <Link to="/b2b" className="font-body text-sm text-silk-400 hover:text-silk-300 tracking-wider flex items-center gap-2">
              Learn More <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
