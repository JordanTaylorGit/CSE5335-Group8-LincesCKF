import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './auth.css';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';

  const [accountType, setAccountType] = useState('CUSTOMER');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(form.email)) return setError(t('auth.error_invalid_email'));
    if (form.password.length < 6) return setError(t('auth.error_password_length'));
    setLoading(true);
    const res = await login({ email: form.email, password: form.password });
    setLoading(false);
    if (res.success) navigate(from, { replace: true });
    else setError(res.message || t('auth.error_login_failed'));
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--login">

        <div className="auth-header">
          <h2 className="auth-title">{t('auth.tab_login')}</h2>
        </div>

        <div role="tablist" aria-label={`${t('auth.tab_login')} / ${t('auth.tab_register')}`} className="auth-tabs">
          <div role="tab" aria-selected="true" aria-controls="login-panel" className="auth-tab auth-tab--active">
            {t('auth.tab_login')}
          </div>
          <Link to="/register" role="tab" aria-selected="false" className="auth-tab auth-tab--inactive">
            {t('auth.tab_register')}
          </Link>
        </div>

        <form id="login-panel" onSubmit={handleSubmit} noValidate aria-label={t('auth.tab_login')} className="auth-form">

          <div role="group" aria-labelledby="login-account-type-label">
            <p id="login-account-type-label" className="auth-label">{t('auth.account_type')}</p>
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
          </div>

          <div>
            <label htmlFor="login-email" className="auth-label">{t('auth.email')}</label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!error || undefined}
              aria-describedby={error ? 'login-error' : undefined}
              className="auth-input"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="auth-label">{t('auth.password')}</label>
            <input
              id="login-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              aria-required="true"
              aria-invalid={!!error || undefined}
              aria-describedby={error ? 'login-error' : undefined}
              className="auth-input"
            />
          </div>

          {error && (
            <p id="login-error" role="alert" aria-live="assertive" className="auth-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={`auth-submit${loading ? ' auth-submit--loading' : ''}`}
          >
            {loading ? t('auth.signing_in') : t('auth.login_btn')}
          </button>

          <p className="auth-forgot-wrap">
            <button type="button" aria-label={t('auth.forgot_password')} className="auth-forgot-btn">
              {t('auth.forgot_password')}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
