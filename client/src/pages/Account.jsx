/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

// Account Page — authenticated user dashboard
import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@context/AuthContext';

/* ── Profile ─────────────────────────────────────────────────── */
function AccountProfile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  return (
    <div>
      <p className="font-display text-2xl mb-4">{t('account.greeting', { name: user?.name })}</p>
      <p className="text-obsidian/60">{user?.email}</p>
    </div>
  );
}

/* ── Settings ────────────────────────────────────────────────── */
function AccountSettings() {
  const { user, updateProfile, updatePassword } = useAuth();
  const { t } = useTranslation();
  const isBrand = user?.accountType === 'BRAND';

  const [firstName,   setFirstName]   = useState(user?.firstName   || '');
  const [lastName,    setLastName]    = useState(user?.lastName    || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [phone,       setPhone]       = useState(user?.phone       || '');
  const [email,       setEmail]       = useState(user?.email       || '');
  const [profileMsg,  setProfileMsg]  = useState('');
  const [profileBusy, setProfileBusy] = useState(false);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg,     setPwMsg]     = useState('');
  const [pwBusy,    setPwBusy]    = useState(false);

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileMsg('');
    if (!email.trim()) return setProfileMsg(t('account.email') + ' is required.');
    setProfileBusy(true);
    const res = await updateProfile({ firstName, lastName, companyName, phone, email });
    setProfileBusy(false);
    setProfileMsg(res.success ? t('account.profile_saved') : res.message);
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwMsg('');
    if (!currentPw) return setPwMsg(t('account.current_password') + ' is required.');
    if (newPw.length < 6) return setPwMsg('New password must be at least 6 characters.');
    if (newPw !== confirmPw) return setPwMsg('Passwords do not match.');
    setPwBusy(true);
    const res = await updatePassword({ currentPassword: currentPw, newPassword: newPw });
    setPwBusy(false);
    if (res.success) {
      setPwMsg(t('account.password_changed'));
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } else {
      setPwMsg(res.message);
    }
  }

  const inputCls = 'w-full bg-zinc-100 rounded-md px-4 py-2.5 text-sm text-obsidian outline-none font-body';
  const labelCls = 'block text-sm font-medium text-obsidian mb-1';

  return (
    <div className="space-y-12">

      {/* Profile Details */}
      <section>
        <h2 className="font-display text-xl mb-6 text-obsidian">{t('account.profile_details')}</h2>
        <form onSubmit={handleProfileSave} className="space-y-4 max-w-md" noValidate>
          {isBrand ? (
            <div>
              <label htmlFor="s-company" className={labelCls}>{t('account.company_name')}</label>
              <input id="s-company" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputCls} autoComplete="organization" />
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="s-first" className={labelCls}>{t('account.first_name')}</label>
                <input id="s-first" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} autoComplete="given-name" />
              </div>
              <div className="flex-1">
                <label htmlFor="s-last" className={labelCls}>{t('account.last_name')}</label>
                <input id="s-last" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className={inputCls} autoComplete="family-name" />
              </div>
            </div>
          )}
          <div>
            <label htmlFor="s-email" className={labelCls}>{t('account.email')}</label>
            <input id="s-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="s-phone" className={labelCls}>{t('account.phone')}</label>
            <input id="s-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} autoComplete="tel" />
          </div>
          {profileMsg && (
            <p role="alert" className={`text-sm ${profileMsg === t('account.profile_saved') ? 'text-green-600' : 'text-red-500'}`}>{profileMsg}</p>
          )}
          <button type="submit" disabled={profileBusy} className="px-6 py-2.5 bg-obsidian text-white text-sm rounded-md font-body disabled:opacity-50 cursor-pointer">
            {profileBusy ? t('account.saving') : t('account.save_changes')}
          </button>
        </form>
      </section>

      {/* Change Password */}
      <section>
        <h2 className="font-display text-xl mb-6 text-obsidian">{t('account.change_password')}</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md" noValidate>
          <div>
            <label htmlFor="s-current-pw" className={labelCls}>{t('account.current_password')}</label>
            <input id="s-current-pw" type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className={inputCls} autoComplete="current-password" />
          </div>
          <div>
            <label htmlFor="s-new-pw" className={labelCls}>{t('account.new_password')}</label>
            <input id="s-new-pw" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className={inputCls} autoComplete="new-password" />
          </div>
          <div>
            <label htmlFor="s-confirm-pw" className={labelCls}>{t('account.confirm_new_password')}</label>
            <input id="s-confirm-pw" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className={inputCls} autoComplete="new-password" />
          </div>
          {pwMsg && (
            <p role="alert" className={`text-sm ${pwMsg === t('account.password_changed') ? 'text-green-600' : 'text-red-500'}`}>{pwMsg}</p>
          )}
          <button type="submit" disabled={pwBusy} className="px-6 py-2.5 bg-obsidian text-white text-sm rounded-md font-body disabled:opacity-50 cursor-pointer">
            {pwBusy ? t('account.updating') : t('account.update_password')}
          </button>
        </form>
      </section>
    </div>
  );
}

/* ── Notifications ───────────────────────────────────────────── */
function AccountNotifications() {
  const { user, updateNotifications } = useAuth();
  const { t } = useTranslation();
  const [prefs, setPrefs] = useState(user?.notifications || { email: true, sms: false });
  const [msg,   setMsg]   = useState('');
  const [busy,  setBusy]  = useState(false);

  async function handleSave() {
    setBusy(true);
    setMsg('');
    const res = await updateNotifications(prefs);
    setBusy(false);
    setMsg(res.success ? t('account.prefs_saved') : res.message);
  }

  function toggle(key) {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    setMsg('');
  }

  const channels = [
    { key: 'email', label: t('account.email_notif_label'), desc: t('account.email_notif_desc') },
    { key: 'sms',   label: t('account.sms_notif_label'),   desc: t('account.sms_notif_desc')   },
  ];

  return (
    <div>
      <h2 className="font-display text-xl mb-6 text-obsidian">{t('account.notification_prefs')}</h2>
      <div className="max-w-md space-y-1">
        {channels.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-4 border-b border-zinc-100">
            <div>
              <p className="text-sm font-medium text-obsidian">{label}</p>
              <p className="text-xs text-obsidian/50 mt-0.5">{desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[key]}
              aria-label={label}
              onClick={() => toggle(key)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${prefs[key] ? 'bg-obsidian' : 'bg-zinc-300'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${prefs[key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}

        {msg && (
          <p role="alert" className={`text-sm pt-2 ${msg === t('account.prefs_saved') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>
        )}
        <div className="pt-4">
          <button onClick={handleSave} disabled={busy} className="px-6 py-2.5 bg-obsidian text-white text-sm rounded-md font-body disabled:opacity-50 cursor-pointer">
            {busy ? t('account.saving') : t('account.save_prefs')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page shell ──────────────────────────────────────────────── */
const tabs = [
  { path: '',               label: 'profile'       },
  { path: 'settings',      label: 'settings'      },
  { path: 'notifications', label: 'notifications' },
];

export default function Account() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="font-display text-4xl md:text-5xl text-obsidian mb-12">{t('account.title')}</h1>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-48 space-y-2">
          {tabs.map(tab => {
            const href = `/account${tab.path ? `/${tab.path}` : ''}`;
            const active = location.pathname === href;
            return (
              <Link
                key={tab.path}
                to={href}
                className={`block font-body text-sm tracking-wider py-2 border-b border-transparent ${
                  active ? 'text-silk-600 border-silk-400' : 'text-obsidian/60 hover:text-obsidian'
                }`}
              >
                {t(`account.${tab.label}`)}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="block w-full text-left font-body text-sm text-obsidian/40 hover:text-red-400 py-2 mt-4 transition-colors"
          >
            {t('nav.logout')}
          </button>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/"              element={<AccountProfile      />} />
            <Route path="settings"       element={<AccountSettings     />} />
            <Route path="notifications"  element={<AccountNotifications />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
