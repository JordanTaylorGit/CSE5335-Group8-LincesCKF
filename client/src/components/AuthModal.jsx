/* Student 1 - Taylor, Jordan - ID# - 1002080693
 * Student 2 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 3 - Tran, Andy - ID# - 1002116149
 * Student 4 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './auth.css';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function AuthModal({ isOpen, onClose }) {
  const { user, login, register, logout } = useAuth();
  const { t } = useTranslation();

  const [mode, setMode]               = useState('login');
  const [accountType, setAccountType] = useState('CUSTOMER');
  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone]             = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [error, setError]             = useState('');
  const [busy, setBusy]               = useState(false);

  const dialogRef      = useRef(null);
  const previousFocus  = useRef(null);

  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setMode('login'); setAccountType('CUSTOMER');
      setFirstName(''); setLastName(''); setCompanyName(''); setPhone('');
      setEmail(''); setPassword(''); setConfirmPw('');
      setError(''); setBusy(false);
    }
  }, [isOpen]);

  // Focus management + focus trap + Escape key
  useEffect(() => {
    if (!isOpen) return;

    previousFocus.current = document.activeElement;
    const firstFocusable = dialogRef.current?.querySelectorAll(FOCUSABLE)?.[0];
    firstFocusable?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') { onClose?.(); return; }
      if (e.key === 'Tab') {
        const focusable = Array.from(dialogRef.current?.querySelectorAll(FOCUSABLE) || []);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLogin = mode === 'login';
  const isBrand = accountType === 'BRAND';
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isValidPhone = (v) => /^\d{10}$/.test(v.replace(/\D/g, ''));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isLogin && accountType === 'CUSTOMER' && !firstName.trim()) return setError(t('auth.error_first_name_required'));
    if (!isLogin && accountType === 'CUSTOMER' && !lastName.trim())  return setError(t('auth.error_last_name_required'));
    if (!isLogin && accountType === 'BRAND'    && !companyName.trim()) return setError(t('auth.error_company_name_required'));
    if (!isValidEmail(email))                    return setError(t('auth.error_invalid_email'));
    if (!isLogin && !isValidPhone(phone))        return setError(t('auth.error_invalid_phone'));
    if (password.length < 6)                     return setError(t('auth.error_password_length'));
    if (!isLogin && password !== confirmPw)      return setError(t('auth.error_passwords_match'));

    setBusy(true);
    const res = isLogin
      ? await login({ email, password })
      : await register({ email, password, accountType, firstName, lastName, companyName, phone });
    setBusy(false);

    if (res.success) {
      if (isLogin) {
        const name = res.user?.firstName || res.user?.companyName || res.user?.email;
        alert(`${t('auth.welcome_back')}, ${name}!`);
      }
      onClose?.();
    } else setError(res.message || t('auth.error_login_failed'));
  }

  return (
    <div className="auth-overlay">
      <div onClick={() => onClose?.()} className="auth-backdrop" aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        className="auth-dialog"
      >
        <div className="auth-dialog-header">
          <h2 id="auth-dialog-title" className="auth-dialog-title">
            {user ? t('auth.my_account_title') : (isLogin ? t('auth.tab_login') : t('auth.tab_register'))}
          </h2>
          <button onClick={() => onClose?.()} aria-label={t('auth.close_dialog')} className="auth-close-btn">✕</button>
        </div>

        <div className="auth-divider" />

        {user ? (
          <div className="auth-user-info">
            <p className="auth-user-welcome">{t('auth.welcome_back')}</p>
            <p className="auth-user-name">{user.name || user.email}</p>
            <p className="auth-user-email">{user.email}</p>
            <span className="auth-account-badge">
              {user.accountType === 'CUSTOMER' ? t('auth.customer_badge') : t('auth.brand_badge')}
            </span>
            <div className="auth-user-actions">
              <button onClick={() => { logout(); onClose?.(); }} className="auth-btn-signout">{t('auth.sign_out')}</button>
              <button onClick={() => onClose?.()} className="auth-btn-close">{t('auth.close')}</button>
            </div>
          </div>
        ) : (
          <>
            <div className="auth-tabs-row" role="tablist" aria-label={t('auth.account_type')}>
              <button
                type="button"
                role="tab"
                aria-selected={isLogin}
                className={`auth-tab-btn ${isLogin ? 'auth-tab-btn--active' : 'auth-tab-btn--inactive'}`}
                onClick={() => { setMode('login'); setError(''); }}
              >{t('auth.tab_login')}</button>
              <button
                type="button"
                role="tab"
                aria-selected={!isLogin}
                className={`auth-tab-btn ${!isLogin ? 'auth-tab-btn--active' : 'auth-tab-btn--inactive'}`}
                onClick={() => { setMode('register'); setError(''); }}
              >{t('auth.tab_register')}</button>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              <div className="auth-field">
                <label className="auth-label">{t('auth.account_type')}</label>
                <div className="auth-tabs-row" role="group" aria-label={t('auth.account_type')}>
                  <button type="button" className={`auth-tab-btn ${accountType === 'CUSTOMER' ? 'auth-tab-btn--active' : 'auth-tab-btn--inactive'}`} onClick={() => setAccountType('CUSTOMER')} aria-pressed={accountType === 'CUSTOMER'}>{t('auth.customer')}</button>
                  <button type="button" className={`auth-tab-btn ${accountType === 'BRAND' ? 'auth-tab-btn--active' : 'auth-tab-btn--inactive'}`} onClick={() => setAccountType('BRAND')} aria-pressed={accountType === 'BRAND'}>{t('auth.fashion_brand')}</button>
                </div>
              </div>

              {!isLogin && !isBrand && (
                <div className="auth-name-row">
                  <div>
                    <label htmlFor="auth-first-name" className="auth-label">{t('auth.first_name')}</label>
                    <input id="auth-first-name" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" className="auth-input" autoComplete="given-name" />
                  </div>
                  <div>
                    <label htmlFor="auth-last-name" className="auth-label">{t('auth.last_name')}</label>
                    <input id="auth-last-name" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" className="auth-input" autoComplete="family-name" />
                  </div>
                </div>
              )}

              {!isLogin && isBrand && (
                <div className="auth-field">
                  <label htmlFor="auth-company-name" className="auth-label">{t('auth.company_name')}</label>
                  <input id="auth-company-name" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Fashion Studio" className="auth-input" autoComplete="organization" />
                </div>
              )}

              {!isLogin && (
                <div className="auth-field">
                  <label htmlFor="auth-phone" className="auth-label">{t('auth.phone')}</label>
                  <input id="auth-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="1234567890" className="auth-input" autoComplete="tel" />
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="auth-email" className="auth-label">{t('auth.email')}</label>
                <input id="auth-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" className="auth-input" />
              </div>

              <div className={isLogin ? 'auth-field--sm' : 'auth-field'}>
                <label htmlFor="auth-password" className="auth-label">{t('auth.password')}</label>
                <input id="auth-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete={isLogin ? 'current-password' : 'new-password'} className="auth-input" />
              </div>

              {!isLogin && (
                <div className="auth-field--sm">
                  <label htmlFor="auth-confirm-password" className="auth-label">{t('auth.confirm_password')}</label>
                  <input id="auth-confirm-password" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" required autoComplete="new-password" className="auth-input" />
                </div>
              )}

              {error && <p className="auth-error" role="alert">{error}</p>}

              <button type="submit" disabled={busy} className="auth-submit-btn" aria-busy={busy}>
                {busy ? t('auth.please_wait') : (isLogin ? t('auth.tab_login') : t('auth.tab_register'))}
              </button>

              <div className="auth-footer-row">
                {!isLogin && (
                  <button type="button" onClick={() => { setMode('login'); setError(''); }} className="auth-switch-btn">
                    {t('auth.have_account')} {t('auth.tab_login')}
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
