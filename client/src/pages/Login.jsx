import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@context/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-ivory">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <p className="font-accent text-xl tracking-[0.2em] text-obsidian">
            LINCES<span className="text-silk-500">'</span>CKF
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-obsidian mt-4">
            {t('auth.login_title')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label={t('auth.email')}>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              className="input-field"
              placeholder="you@example.com"
            />
          </Field>
          <Field label={t('auth.password')}>
            <input
              type="password" name="password" required
              value={form.password} onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
            />
          </Field>

          {error && <p className="text-red-500 text-sm font-body">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? '...' : t('auth.sign_in')}
          </button>
        </form>

        <p className="text-center text-sm text-obsidian/50 mt-6 font-body">
          {t('auth.no_account')}{' '}
          <Link to="/register" className="text-silk-600 hover:underline">
            {t('auth.sign_up')}
          </Link>
        </p>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background: white;
          border: 1px solid rgba(13,13,13,0.15);
          padding: 0.75rem 1rem;
          font-family: var(--font-body);
          font-size: 0.875rem;
          transition: border-color 0.2s;
          outline: none;
        }
        .input-field:focus { border-color: var(--color-silk-gold); }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-body text-xs uppercase tracking-widest text-obsidian/60 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
