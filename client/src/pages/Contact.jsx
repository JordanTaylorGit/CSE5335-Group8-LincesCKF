/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { fetchWithAuth } from '../services/api';

const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  subject: '',
  brandId: '',
  message: '',
};

export default function Contact() {
  const { t } = useTranslation();
  const mapAddress = '123 Silk Street, New York, NY 10001, United States';
  const encodedMapAddress = encodeURIComponent(mapAddress);
  const googleMapEmbedUrl = `https://www.google.com/maps?q=${encodedMapAddress}&output=embed`;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchWithAuth('/brands')
      .then((data) => {
        if (mounted) {
          setBrands(Array.isArray(data) ? data : []);
        }
      })
      .catch((error) => {
        console.error(error);
        if (mounted) {
          setBrands([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setBrandsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleFieldChange = (field) => (e) => {
    const nextValue = e.target.value;

    setFormData((current) => ({
      ...current,
      [field]: nextValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchWithAuth('/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setFormData(INITIAL_FORM_DATA);
      setSubmitted(true);
    } catch (err) {
      alert(err.message || t('contact.form.error'));
    }
  };

  if (submitted) {
    return (
      <div className="contact-page contact-page__success max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-[#10B981] mx-auto mb-6" />
          <h1 className="text-3xl font-serif font-medium text-navy mb-4">
            {t('contact.success.title')}
          </h1>
          <p className="text-navy/70 mb-8 max-w-2xl mx-auto">
            {t('contact.success.message')}
          </p>
          <button
            onClick={() => {
              setFormData(INITIAL_FORM_DATA);
              setSubmitted(false);
            }}
            className="px-8 py-3 bg-navy text-white hover:bg-silk-gold transition-colors"
          >
            {t('contact.success.sendAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-medium text-navy mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-navy/70 max-w-2xl mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="contact-page__layout grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="contact-page__info space-y-6">
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
        <div className="contact-page__form-column lg:col-span-2">
          <form onSubmit={handleSubmit} className="contact-page__form bg-white rounded-lg border border-navy/20 p-6 md:p-8">
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
                  onChange={handleFieldChange('name')}
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
                  onChange={handleFieldChange('email')}
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
                  onChange={handleFieldChange('subject')}
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
                <label htmlFor="brandId" className="block text-sm font-medium text-navy/70 mb-2">
                  {t('contact.form.brand')}
                </label>
                <select
                  id="brandId"
                  value={formData.brandId}
                  onChange={handleFieldChange('brandId')}
                  className="w-full px-4 py-3 bg-gray-50 border border-navy/20 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-all"
                >
                  <option value="">
                    {brandsLoading ? t('contact.form.loadingBrands') : t('contact.form.selectBrand')}
                  </option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-navy/60">{t('contact.form.brandHelp')}</p>
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
                  onChange={handleFieldChange('message')}
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
      <div className="contact-page__map lg:col-span-3 mt-4">
        <div className="overflow-hidden rounded-lg border border-sky-mid bg-sky-light">
          <div className="px-5 py-4">
            <div>
              <p className="font-accent text-xs uppercase tracking-[0.25em] text-navy">
                {t('contact.map.title')}
              </p>
              <p className="mt-1 text-sm text-navy/60">{mapAddress}</p>
            </div>
          </div>
          <iframe
            title={t('contact.map.iframeTitle')}
            src={googleMapEmbedUrl}
            className="h-[320px] w-full border-0 md:h-[420px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      </div>
    </div>
  );
}
