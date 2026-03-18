import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const CustomOrders = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    quantity: "",
    timeline: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const orderTypes = [
    {
      id: "custom-garment",
      title: t("customOrders.types.customGarment.title"),
      description: t("customOrders.types.customGarment.description"),
      icon: "🧵",
    },
    {
      id: "bulk-order",
      title: t("customOrders.types.bulkOrder.title"),
      description: t("customOrders.types.bulkOrder.description"),
      icon: "📦",
    },
    {
      id: "b2b-manufacturing",
      title: t("customOrders.types.b2bManufacturing.title"),
      description: t("customOrders.types.b2bManufacturing.description"),
      icon: "🏭",
    },
  ];

  const timelines = [
    { value: "1-2 weeks", label: t("customOrders.timelines.1-2weeks") },
    { value: "1-2 months", label: t("customOrders.timelines.1-2months") },
    { value: "3-6 months", label: t("customOrders.timelines.3-6months") },
    { value: "6+ months", label: t("customOrders.timelines.6plusmonths") },
  ];

  const handleOrderTypeSelect = (type) => {
    setOrderType(type);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitted(true);
      setStep(3);
    } catch (error) {
      console.error("Error submitting form:", error);
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
          {t("customOrders.step1.title")}
        </h1>
        <p className="text-lg text-navy/70 max-w-2xl mx-auto">
          {t("customOrders.step1.subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {orderTypes.map((type, index) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOrderTypeSelect(type.id)}
            className="text-left p-6 border-2 border-navy/20 rounded-lg hover:border-navy/50 transition-all duration-300"
          >
            <div className="text-4xl mb-4">{type.icon}</div>
            <h3 className="font-semibold text-navy text-lg mb-2">
              {type.title}
            </h3>
            <p className="text-navy/70 text-sm leading-relaxed">
              {type.description}
            </p>
          </motion.button>
        ))}
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
          className="text-navy hover:text-silk-500 transition-colors"
        >
          ← {t("customOrders.back")}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-serif font-medium text-navy">
            {t("customOrders.step2.title")}
          </h1>
          <p className="text-navy/70">{t("customOrders.step2.subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">
              {t("customOrders.form.name")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">
              {t("customOrders.form.email")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">
              {t("customOrders.form.phone")}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-500 focus:border-transparent transition-all"
            />
          </div>
          {orderType === "b2b-manufacturing" && (
            <div>
              <label className="block text-sm font-medium text-navy/70 mb-2">
                {t("customOrders.form.company")}
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-500 focus:border-transparent transition-all"
              />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">
              {t("customOrders.form.quantity")}
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">
              {t("customOrders.form.timeline")}
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-500 focus:border-transparent transition-all"
            >
              <option value="">{t("customOrders.form.selectTimeline")}</option>
              {timelines.map((timeline) => (
                <option key={timeline.value} value={timeline.value}>
                  {timeline.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy/70 mb-2">
            {t("customOrders.form.message")}
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            placeholder={t("customOrders.form.messagePlaceholder")}
            className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:ring-2 focus:ring-silk-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-6 py-3 text-navy hover:text-silk-500 transition-colors"
          >
            ← {t("customOrders.back")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-navy text-white hover:bg-silk-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? t("customOrders.submitting")
              : t("customOrders.submit")}
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
          {t("customOrders.success.title")}
        </h1>
        <p className="text-navy/70 text-lg mb-6">
          {t("customOrders.success.message")}
        </p>
        <div className="space-y-3 text-left max-w-md mx-auto">
          <div className="flex justify-between py-2 border-b border-navy/10">
            <span className="text-navy/70">
              {t("customOrders.success.email")}
            </span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-navy/10">
            <span className="text-navy/70">
              {t("customOrders.success.orderType")}
            </span>
            <span className="font-medium capitalize">
              {orderType.replace("-", " ")}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-navy/10">
            <span className="text-navy/70">
              {t("customOrders.success.timeline")}
            </span>
            <span className="font-medium">{formData.timeline}</span>
          </div>
        </div>
        <div className="mt-8 space-x-4">
          <button
            onClick={() => {
              setStep(1);
              setOrderType("");
              setFormData({
                name: "",
                email: "",
                phone: "",
                company: "",
                quantity: "",
                timeline: "",
                message: "",
              });
              setIsSubmitted(false);
            }}
            className="px-6 py-3 bg-navy text-white hover:bg-silk-500 transition-colors"
          >
            {t("customOrders.success.newRequest")}
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
          >
            {t("customOrders.success.continueShopping")}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            <div
              className={`flex items-center space-x-3 ${step >= 1 ? "text-navy" : "text-navy/40"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? "bg-navy text-white" : "bg-navy/20 text-navy"
                }`}
              >
                1
              </div>
              <span>{t("customOrders.progress.step1")}</span>
            </div>
            <div className="w-16 h-1 bg-navy/20"></div>
            <div
              className={`flex items-center space-x-3 ${step >= 2 ? "text-navy" : "text-navy/40"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? "bg-navy text-white" : "bg-navy/20 text-navy"
                }`}
              >
                2
              </div>
              <span>{t("customOrders.progress.step2")}</span>
            </div>
            <div className="w-16 h-1 bg-navy/20"></div>
            <div
              className={`flex items-center space-x-3 ${step >= 3 ? "text-navy" : "text-navy/40"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3 ? "bg-navy text-white" : "bg-navy/20 text-navy"
                }`}
              >
                3
              </div>
              <span>{t("customOrders.progress.step3")}</span>
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
