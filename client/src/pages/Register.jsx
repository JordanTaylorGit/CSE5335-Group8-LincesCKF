import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './auth.css';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState('CUSTOMER');
  const [form, setForm] = useState({
    firstName: '', lastName: '', companyName: '', phone: '',
    email: '', password: '', confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isValidPhone = (v) => /^\d{10}$/.test(v.replace(/\D/g, ''));
  const isBrand = accountType === 'BRAND';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isBrand && !form.firstName.trim()) return setError(t('auth.error_first_name_required'));
    if (!isBrand && !form.lastName.trim()) return setError(t('auth.error_last_name_required'));
    if (isBrand && !form.companyName.trim()) return setError(t('auth.error_company_name_required'));
    if (!isValidEmail(form.email)) return setError(t('auth.error_invalid_email'));
    if (!isValidPhone(form.phone)) return setError(t('auth.error_invalid_phone'));
    if (form.password.length < 6) return setError(t('auth.error_password_length'));
    if (form.password !== form.confirm) return setError(t('auth.error_passwords_match'));
    setLoading(true);
    const res = await register({
      email: form.email, password: form.password, accountType,
      firstName: form.firstName, lastName: form.lastName,
      companyName: form.companyName, phone: form.phone,
    });
    setLoading(false);
    if (res.success) navigate('/account', { replace: true });
    else setError(res.message || t('auth.error_register_failed'));
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--register">

        <div className="auth-header">
          <h2 className="auth-title">{t('auth.tab_register')}</h2>
        </div>

        <div role="tablist" aria-label={`${t('auth.tab_login')} / ${t('auth.tab_register')}`} className="auth-tabs">
          <Link to="/login" role="tab" aria-selected="false" className="auth-tab auth-tab--inactive">
            {t('auth.tab_login')}
          </Link>
          <div role="tab" aria-selected="true" aria-controls="register-panel" className="auth-tab auth-tab--active">
            {t('auth.tab_register')}
          </div>
        </div>

        <form id="register-panel" onSubmit={handleSubmit} noValidate aria-label={t('auth.tab_register')} className="auth-form auth-form--register">

          <div role="group" aria-labelledby="reg-account-type-label">
            <p id="reg-account-type-label" className="auth-label">{t('auth.account_type')}</p>
            <div className="auth-toggle-row">
              {[['CUSTOMER', t('auth.customer')], ['BRAND', t('auth.fashion_brand')]].map(([type, label]) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={accountType === type}
                  onClick={() => setAccountType(type)}
                  className={`auth-toggle-btn ${accountType === type ? 'auth-toggle-btn--active' : 'auth-toggle-btn--inactive'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p aria-live="polite" className="auth-account-desc">
              {isBrand ? t('auth.brand_desc') : t('auth.customer_desc')}
            </p>
          </div>

          {!isBrand && (
            <div className="auth-name-row">
              <div>
                <label htmlFor="reg-first-name" className="auth-label">{t('auth.first_name')}</label>
                <input id="reg-first-name" name="firstName" type="text" value={form.firstName} onChange={handleChange} placeholder="Jane" autoComplete="given-name" className="auth-input" />
              </div>
              <div>
                <label htmlFor="reg-last-name" className="auth-label">{t('auth.last_name')}</label>
                <input id="reg-last-name" name="lastName" type="text" value={form.lastName} onChange={handleChange} placeholder="Doe" autoComplete="family-name" className="auth-input" />
              </div>
            </div>
          )}

          {isBrand && (
            <div>
              <label htmlFor="reg-company-name" className="auth-label">{t('auth.company_name')}</label>
              <input id="reg-company-name" name="companyName" type="text" value={form.companyName} onChange={handleChange} placeholder="Acme Fashion Studio" autoComplete="organization" className="auth-input" />
            </div>
          )}

          <div>
            <label htmlFor="reg-email" className="auth-label">{t('auth.email')}</label>
            <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required autoComplete="email" aria-required="true" aria-invalid={!!error || undefined} aria-describedby={error ? 'reg-error' : undefined} className="auth-input" />
          </div>

          <div>
            <label htmlFor="reg-phone" className="auth-label">{t('auth.phone')}</label>
            <input id="reg-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="5550000000" autoComplete="tel" className="auth-input" />
          </div>

          <div>
            <label htmlFor="reg-password" className="auth-label">{t('auth.password')}</label>
            <input id="reg-password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required autoComplete="new-password" aria-required="true" aria-invalid={!!error || undefined} aria-describedby={error ? 'reg-error' : undefined} className="auth-input" />
          </div>

          <div>
            <label htmlFor="reg-confirm" className="auth-label">{t('auth.confirm_password')}</label>
            <input id="reg-confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="••••••••" required autoComplete="new-password" aria-required="true" aria-invalid={!!error || undefined} aria-describedby={error ? 'reg-error' : undefined} className="auth-input" />
          </div>

          {error && (
            <p id="reg-error" role="alert" aria-live="assertive" className="auth-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={`auth-submit${loading ? ' auth-submit--loading' : ''}`}
          >
            {loading ? t('auth.creating_account') : t('auth.create_account_btn')}
          </button>
        </form>

        <p className="auth-footer-text">
          {t('auth.have_account')}{' '}
          <Link to="/login" className="auth-footer-link">{t('auth.sign_in_link')}</Link>
        </p>
      </div>
    </div>
  );
}
