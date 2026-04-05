/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-[#10B981] mx-auto mb-6" />
          <h1 className="text-3xl font-serif font-medium text-navy mb-4">
            {t('contact.success.title')}
          </h1>
          <p className="text-navy/70 mb-8 max-w-2xl mx-auto">
            {t('contact.success.message')}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-8 py-3 bg-navy text-white hover:bg-silk-gold transition-colors"
          >
            {t('contact.success.sendAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-medium text-navy mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-navy/70 max-w-2xl mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-navy/20 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  {t('contact.email.title')}
                </h3>
                <p className="text-navy/60 text-sm">info@lincesckf.com</p>
                <p className="text-navy/60 text-sm">sales@lincesckf.com</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-navy/20 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  {t('contact.phone.title')}
                </h3>
                <p className="text-navy/60 text-sm">+1 (555) 123-4567</p>
                <p className="text-navy/60 text-sm">{t('contact.phone.hours')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-navy/20 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  {t('contact.address.title')}
                </h3>
                <p className="text-navy/60 text-sm">
                  123 Silk Street<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-navy/20 p-6 md:p-8">
            <h2 className="text-2xl font-serif font-medium text-navy mb-6">
              {t('contact.form.title')}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-navy/70 mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-navy/20 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-navy/70 mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-navy/20 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-navy/70 mb-2">
                  {t('contact.form.subject')}
                </label>
                <select
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-navy/20 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all"
                >
                  <option value="">{t('contact.form.selectSubject')}</option>
                  <option value="product-inquiry">{t('contact.form.options.product')}</option>
                  <option value="custom-order">{t('contact.form.options.custom')}</option>
                  <option value="b2b-partnership">{t('contact.form.options.b2b')}</option>
                  <option value="support">{t('contact.form.options.support')}</option>
                  <option value="other">{t('contact.form.options.other')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-navy/70 mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-navy/20 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-3 bg-navy text-white hover:bg-silk-gold transition-colors"
              >
                {t('contact.form.submit')}
              </button>
            </div>
          </form>
        </div>

      {/* Map Placeholder */}
      <div className="lg:col-span-3 mt-4">
        <div
          style={{
            width: '100%',
            height: 320,
            background: '#E8F4FD',
            border: '1px solid #B8D4E8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ color: '#B8D4E8' }}>
            <path d="M20 4C13.373 4 8 9.373 8 16c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="20" cy="16" r="4" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <p style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#0B2545',
          }}>
            Map of Location
          </p>
          <p style={{
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.85rem',
            color: 'rgba(11,37,69,0.5)',
          }}>
            123 Silk Street, Fashion District, NY 10001
          </p>
          <p style={{
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.75rem',
            color: 'rgba(11,37,69,0.35)',
            fontStyle: 'italic',
          }}>
            Demonstration map purpose for phase 2
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}