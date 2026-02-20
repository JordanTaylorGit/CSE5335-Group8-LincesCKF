import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="font-display text-4xl md:text-5xl mb-12">{t('checkout.title')}</h1>
      {/* TODO: Implement multi-step checkout flow:
          Step 1: Shipping Information
          Step 2: Payment (Stripe integration)
          Step 3: Order Review & Confirmation
      */}
      <div className="p-8 border border-silk-100 text-center text-obsidian/40">
        <p className="font-display text-2xl">Checkout coming soon.</p>
        <p className="font-body text-sm mt-3">Integrate Stripe or your payment processor here.</p>
      </div>
    </div>
  );
}
