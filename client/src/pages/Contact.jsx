// B2BContact.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function B2BContact() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/b2b/inquiry
    setSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="font-display text-4xl md:text-5xl mb-12">{t('b2b.contact')}</h1>
      {sent ? (
        <p className="font-display text-2xl text-silk-600">Thank you! We'll be in touch shortly.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {['Brand Name', 'Email', 'Phone', 'Estimated Order Quantity'].map(label => (
            <div key={label}>
              <label className="block text-xs font-accent uppercase tracking-widest text-obsidian/60 mb-2">{label}</label>
              <input required className="w-full bg-white border border-obsidian/15 p-3 text-sm font-body focus:outline-none focus:border-silk-500" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-accent uppercase tracking-widest text-obsidian/60 mb-2">Message</label>
            <textarea required rows={5} className="w-full bg-white border border-obsidian/15 p-3 text-sm font-body focus:outline-none focus:border-silk-500 resize-none" />
          </div>
          <button type="submit" className="btn-primary">{t('b2b.contact')}</button>
        </form>
      )}
    </div>
  );
}

export default B2BContact;
