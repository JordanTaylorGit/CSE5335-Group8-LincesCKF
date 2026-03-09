/**
 * AuthModal.js — Login / Register modal
 * Student 1 | Authentication & User Management
 */
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NAV = '#1c2333';
const NAV_HV = '#252f45';
const GRAY_BG = '#f4f4f5';
const GRAY_TXT = '#6b7280';
const ERR = '#dc2626';

const tabBtn = (active) => ({
  flex: 1, padding: '0.6rem 1rem',
  fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', fontWeight: 500,
  border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s',
  background: active ? NAV : GRAY_BG,
  color: active ? '#fff' : GRAY_TXT,
});

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: GRAY_BG, border: 'none', borderRadius: '6px',
  padding: '0.75rem 1rem',
  fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', color: '#111827',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', fontWeight: 500,
  color: '#111827', marginBottom: '0.4rem',
};

export default function AuthModal({ isOpen, onClose }) {
  const { user, login, register, logout } = useAuth();

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

  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setMode('login'); setAccountType('CUSTOMER');
      setFirstName(''); setLastName(''); setCompanyName(''); setPhone('');
      setEmail(''); setPassword(''); setConfirmPw('');
      setError(''); setBusy(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLogin = mode === 'login';
  const isBrand = accountType === 'BRAND';
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) return setError('Please enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (!isLogin && password !== confirmPw) return setError('Passwords do not match.');

    setBusy(true);
    const res = isLogin
      ? await login({ email, password })
      : await register({ email, password, accountType, firstName, lastName, companyName, phone });
    setBusy(false);

    if (res.success) onClose?.();
    else setError(res.message || 'Something went wrong. Please try again.');
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={() => onClose?.()} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        style={{
          position: 'relative', width: '94%', maxWidth: '440px',
          background: '#fff', borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          padding: '1.75rem 1.75rem 2rem',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontFamily: 'Jost, sans-serif', fontSize: '1.15rem', fontWeight: 600, color: '#111827' }}>
            {user ? 'My Account' : (isLogin ? 'Login' : 'Register')}
          </h2>
          <button onClick={() => onClose?.()} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: GRAY_TXT, padding: '0.2rem', lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '1.25rem' }} />

        {/* Logged-in view */}
        {user ? (
          <div style={{ textAlign: 'center', padding: '0.25rem 0' }}>
            <p style={{ margin: '0 0 0.2rem', fontSize: '0.8rem', color: GRAY_TXT }}>Welcome back</p>
            <p style={{ margin: '0 0 0.2rem', fontSize: '1.2rem', fontWeight: 600, color: '#111827', fontFamily: 'Jost, sans-serif' }}>{user.name || user.email}</p>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: GRAY_TXT, fontFamily: 'Jost, sans-serif' }}>{user.email}</p>
            <span style={{ display: 'inline-block', fontSize: '0.72rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: GRAY_BG, color: GRAY_TXT, fontFamily: 'Jost, sans-serif', marginBottom: '1.25rem' }}>
              {user.accountType === 'CUSTOMER' ? 'Customer Account' : 'Fashion Brand Account'}
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => { logout(); onClose?.(); }} style={{ padding: '0.65rem 1.5rem', background: NAV, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'Jost, sans-serif', cursor: 'pointer' }}>Sign Out</button>
              <button onClick={() => onClose?.()} style={{ padding: '0.65rem 1.5rem', background: GRAY_BG, color: '#111827', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'Jost, sans-serif', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button type="button" style={tabBtn(isLogin)}  onClick={() => { setMode('login');    setError(''); }}>Login</button>
              <button type="button" style={tabBtn(!isLogin)} onClick={() => { setMode('register'); setError(''); }}>Register</button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Account Type */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Account Type</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" style={tabBtn(accountType === 'CUSTOMER')} onClick={() => setAccountType('CUSTOMER')}>Customer</button>
                  <button type="button" style={tabBtn(accountType === 'BRAND')}    onClick={() => setAccountType('BRAND')}>Fashion Brand</button>
                </div>
              </div>

              {/* Register — Customer */}
              {!isLogin && !isBrand && (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>First Name</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Last Name</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" style={inputStyle} />
                  </div>
                </div>
              )}

              {/* Register — Brand */}
              {!isLogin && isBrand && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Company / Brand Name</label>
                  <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Fashion Studio" style={inputStyle} />
                </div>
              )}

              {/* Register — Phone */}
              {!isLogin && (
                <div style={{ marginBottom: '1rem' }}>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="1234567890" style={inputStyle} />
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" style={inputStyle} />
              </div>

              {/* Password */}
              <div style={{ marginBottom: isLogin ? '0.5rem' : '1rem' }}>
                <label style={labelStyle}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete={isLogin ? 'current-password' : 'new-password'} style={inputStyle} />
              </div>

              {/* Confirm Password */}
              {!isLogin && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={labelStyle}>Confirm Password</label>
                  <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" required autoComplete="new-password" style={inputStyle} />
                </div>
              )}

              {error && <p style={{ margin: '0.5rem 0', fontSize: '0.8rem', color: ERR, fontFamily: 'Jost, sans-serif' }}>{error}</p>}

              <button
                type="submit"
                disabled={busy}
                style={{ width: '100%', padding: '0.8rem', marginTop: '0.75rem', background: busy ? '#374151' : NAV, color: '#fff', border: 'none', borderRadius: '6px', fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', fontWeight: 500, cursor: busy ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!busy) e.currentTarget.style.background = NAV_HV; }}
                onMouseLeave={e => { if (!busy) e.currentTarget.style.background = NAV; }}
              >
                {busy ? 'Please wait…' : (isLogin ? 'Login' : 'Register')}
              </button>

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                {isLogin ? (
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: GRAY_TXT, fontFamily: 'Jost, sans-serif' }}>
                    Forgot password?
                  </button>
                ) : (
                  <button type="button" onClick={() => { setMode('login'); setError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: GRAY_TXT, fontFamily: 'Jost, sans-serif', textDecoration: 'underline' }}>
                    Already have an account? Login
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
