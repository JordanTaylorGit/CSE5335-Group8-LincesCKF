/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Factory, Package, Scissors } from 'lucide-react';
import { fetchWithAuth } from '../services/api';

const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  phone: '',
  brandId: '',
  quantity: '',
  timeline: '',
  message: ''
};

const BRAND_TARGET_ORDER_TYPES = new Set(['custom-garment', 'bulk-order', 'b2b-manufacturing']);

const CustomOrders = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const orderTypes = [
    {
      id: 'custom-garment',
      title: t('customOrders.types.customGarment.title'),
      description: t('customOrders.types.customGarment.description'),
      Icon: Scissors
    },
    {
      id: 'bulk-order',
      title: t('customOrders.types.bulkOrder.title'),
      description: t('customOrders.types.bulkOrder.description'),
      Icon: Package
    },
    {
      id: 'b2b-manufacturing',
      title: t('customOrders.types.b2bManufacturing.title'),
      description: t('customOrders.types.b2bManufacturing.description'),
      Icon: Factory
    }
  ];

  const timelines = [
    { value: '1-2 weeks', label: t('customOrders.timelines.1-2weeks') },
    { value: '1-2 months', label: t('customOrders.timelines.1-2months') },
    { value: '3-6 months', label: t('customOrders.timelines.3-6months') },
    { value: '6+ months', label: t('customOrders.timelines.6plusmonths') }
  ];

  const selectedOrderTypeLabel =
    orderTypes.find((type) => type.id === orderType)?.title ||
    orderType.replaceAll('-', ' ');

  const selectedTimelineLabel =
    timelines.find((timeline) => timeline.value === formData.timeline)?.label ||
    formData.timeline;

  const selectedBrandLabel =
    brands.find((brand) => String(brand.id) === String(formData.brandId))?.name || '';

  const shouldShowBrandField = BRAND_TARGET_ORDER_TYPES.has(orderType);

  useEffect(() => {
    let mounted = true;

    fetchWithAuth('/brands')
      .then((data) => {
        if (mounted) {
          setBrands(Array.isArray(data) ? data : []);
        }
      })
      .catch((error) => {
        console.error('Error loading brands:', error);
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

  const handleOrderTypeSelect = (type) => {
    setFormError('');
    setOrderType(type);
    setFormData((prev) => ({
      ...prev,
      brandId: BRAND_TARGET_ORDER_TYPES.has(type) ? prev.brandId : '',
    }));
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (formError) setFormError('');
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setFormError(t('customOrders.form.phoneValidation'));
      return;
    }

    setIsSubmitting(true);

    try {
      await fetchWithAuth('/custom-orders', {
        method: 'POST',
        body: JSON.stringify({
          orderType,
          brandId: formData.brandId || null,
          contactInfo: {
            name: formData.name,
            email: formData.email,
            phone: phoneDigits
          },
          requirements: {
            quantity: formData.quantity,
            timeline: formData.timeline,
            message: formData.message
          }
        })
      });
      
      setIsSubmitted(true);
      setStep(3);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('customOrders.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-4xl font-serif font-medium text-navy mb-4">
          {t('customOrders.step1.title')}
        </h1>
        <p className="text-lg text-navy/70 max-w-2xl mx-auto">
          {t('customOrders.step1.subtitle')}
        </p>
      </div>

      <div className="custom-orders-page__type-grid grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {orderTypes.map((type) => {
          const Icon = type.Icon;

          return (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOrderTypeSelect(type.id)}
              className="text-left p-6 border-2 border-navy/20 rounded-lg hover:border-navy/50 transition-all duration-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
                <Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-navy text-lg mb-2">
                {type.title}
              </h3>
              <p className="text-navy/70 text-sm leading-relaxed">
                {type.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setStep(1)}
          className="text-navy hover:text-silk-amber transition-colors"
        >
          ← {t('customOrders.back')}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-serif font-medium text-navy">
            {t('customOrders.step2.title')}
          </h1>
          <p className="text-navy/70">{t('customOrders.step2.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="custom-orders-page__form-grid grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">
              {t('customOrders.form.name')}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-amber focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">
              {t('customOrders.form.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-amber focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="custom-orders-page__form-grid grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">
              {t('customOrders.form.phone')}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              inputMode="numeric"
              pattern="[0-9]{10}"
              placeholder="1234567890"
              aria-invalid={Boolean(formError)}
              aria-describedby={formError ? 'custom-order-phone-error' : undefined}
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-amber focus:border-transparent transition-all"
            />
            {formError && (
              <p id="custom-order-phone-error" role="alert" className="mt-2 text-sm text-red-600">
                {formError}
              </p>
            )}
          </div>
          {shouldShowBrandField && (
            <div>
              <label className="block text-sm font-medium text-navy/70 mb-2">
                {t('customOrders.form.brand')}
              </label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-amber focus:border-transparent transition-all"
              >
                <option value="">
                  {brandsLoading ? t('customOrders.form.loadingBrands') : t('customOrders.form.selectBrand')}
                </option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="custom-orders-page__form-grid grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">
              {t('customOrders.form.quantity')}
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-amber focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">
              {t('customOrders.form.timeline')}
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-amber focus:border-transparent transition-all"
            >
              <option value="">{t('customOrders.form.selectTimeline')}</option>
              {timelines.map(timeline => (
                <option key={timeline.value} value={timeline.value}>
                  {timeline.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy/70 mb-2">
            {t('customOrders.form.message')}
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            placeholder={t('customOrders.form.messagePlaceholder')}
            className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-amber focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="custom-orders-page__form-actions flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-6 py-3 text-navy hover:text-silk-amber transition-colors"
          >
            ← {t('customOrders.back')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-navy text-white hover:bg-silk-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-navy-hover:text-white"
          >
            {isSubmitting ? t('customOrders.submitting') : t('customOrders.submit')}
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="bg-green-50 border border-green-200 rounded-lg p-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-serif font-medium text-navy mb-4">
          {t('customOrders.success.title')}
        </h1>
        <p className="text-navy/70 text-lg mb-6">
          {t('customOrders.success.message')}
        </p>
        <div className="space-y-3 text-left max-w-md mx-auto">
          <div className="flex justify-between py-2 border-b border-navy/10">
            <span className="text-navy/70">{t('customOrders.success.email')}</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-navy/10">
            <span className="text-navy/70">{t('customOrders.success.orderType')}</span>
            <span className="font-medium">{selectedOrderTypeLabel}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-navy/10">
            <span className="text-navy/70">{t('customOrders.success.timeline')}</span>
            <span className="font-medium">{selectedTimelineLabel}</span>
          </div>
          {selectedBrandLabel && (
            <div className="flex justify-between py-2 border-b border-navy/10">
              <span className="text-navy/70">{t('customOrders.success.brand')}</span>
              <span className="font-medium">{selectedBrandLabel}</span>
            </div>
          )}
        </div>
        <div className="custom-orders-page__success-actions mt-8 space-x-4">
          <button
            onClick={() => {
              setStep(1);
              setOrderType('');
              setFormData(INITIAL_FORM_DATA);
              setIsSubmitted(false);
            }}
            className="px-6 py-3 bg-navy text-white hover:bg-silk-gold transition-colors"
          >
            {t('customOrders.success.newRequest')}
          </button>
          <button
            onClick={() => window.location.href = '/catalog'}
            className="px-6 py-3 border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
          >
            {t('customOrders.success.continueShopping')}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="custom-orders-page min-h-screen bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Progress Indicator */}
        <div className="custom-orders-page__progress flex justify-center mb-12">
          <div className="custom-orders-page__progress-track flex items-center space-x-2 sm:space-x-8 w-full max-w-2xl px-2 sm:px-0">
            <div className={`flex items-center space-x-2 sm:space-x-3 ${step >= 1 ? 'text-navy' : 'text-navy/40'}`}>
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-navy text-white' : 'bg-navy/20 text-navy'
              }`}>
                1
              </div>
              <span className="hidden sm:inline">{t('customOrders.progress.step1')}</span>
            </div>
            <div className="flex-1 sm:w-16 h-1 bg-navy/20"></div>
            <div className={`flex items-center space-x-2 sm:space-x-3 ${step >= 2 ? 'text-navy' : 'text-navy/40'}`}>
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-navy text-white' : 'bg-navy/20 text-navy'
              }`}>
                2
              </div>
              <span className="hidden sm:inline">{t('customOrders.progress.step2')}</span>
            </div>
            <div className="flex-1 sm:w-16 h-1 bg-navy/20"></div>
            <div className={`flex items-center space-x-2 sm:space-x-3 ${step >= 3 ? 'text-navy' : 'text-navy/40'}`}>
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-navy text-white' : 'bg-navy/20 text-navy'
              }`}>
                3
              </div>
              <span className="hidden sm:inline">{t('customOrders.progress.step3')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default CustomOrders;
