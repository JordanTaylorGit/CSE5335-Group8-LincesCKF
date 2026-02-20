import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@context/AuthContext';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-ivory">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="font-accent text-xl tracking-[0.2em] text-obsidian">
            LINCES<span className="text-silk-500">'</span>CKF
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-obsidian mt-4">
            {t('auth.register_title')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { key: 'name', label: t('auth.name'), type: 'text', placeholder: 'Your Name' },
            { key: 'email', label: t('auth.email'), type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: t('auth.password'), type: 'password', placeholder: '••••••••' },
            { key: 'confirm', label: t('auth.confirm_password'), type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.key}>
              <label className="block font-body text-xs uppercase tracking-widest text-obsidian/60 mb-2">{f.label}</label>
              <input
                type={f.type} name={f.key} required
                value={form[f.key]} onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full bg-white border border-obsidian/15 p-3 text-sm font-body focus:outline-none focus:border-silk-500"
              />
            </div>
          ))}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? '...' : t('auth.sign_up')}
          </button>
        </form>

        <p className="text-center text-sm text-obsidian/50 mt-6 font-body">
          {t('auth.have_account')}{' '}
          <Link to="/login" className="text-silk-600 hover:underline">{t('auth.sign_in')}</Link>
        </p>
      </div>
    </div>
  );
}
