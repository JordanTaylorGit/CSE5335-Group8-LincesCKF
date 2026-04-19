/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

// Account Page — authenticated user dashboard
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@context/AuthContext';
import { fetchWithAuth } from '../services/api';

/* ── Profile ─────────────────────────────────────────────────── */
function AccountProfile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  return (
    <div>
      <p className="font-display text-2xl mb-4">{t('account.greeting', { name: user?.firstName || user?.companyName || user?.email })}</p>
      <p className="text-obsidian/60">{user?.email}</p>
      <p className="text-obsidian/60 capitalize mt-2 font-medium">
        Account Type: {user?.accountType?.toLowerCase()}
      </p>
    </div>
  );
}

/* ── Settings ────────────────────────────────────────────────── */
function AccountSettings() {
  const { user, updateProfile, updatePassword } = useAuth();
  const { t } = useTranslation();
  const isBrand = user?.accountType?.toUpperCase() === 'BRAND';

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

  const inputCls = 'w-full bg-zinc-100 rounded-md px-4 py-2.5 text-sm text-navy outline-none font-body';
  const labelCls = 'block text-sm font-medium text-navy mb-1';

  return (
    <div className="space-y-12">

      {/* Profile Details */}
      <section>
        <h2 className="font-display text-xl mb-6 text-navy">{t('account.profile_details')}</h2>
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
          <button type="submit" disabled={profileBusy} className="px-6 py-2.5 bg-navy text-white text-sm rounded-md font-body disabled:opacity-50 cursor-pointer">
            {profileBusy ? t('account.saving') : t('account.save_changes')}
          </button>
        </form>
      </section>

      {/* Change Password */}
      <section>
        <h2 className="font-display text-xl mb-6 text-navy">{t('account.change_password')}</h2>
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
          <button type="submit" disabled={pwBusy} className="px-6 py-2.5 bg-navy text-white text-sm rounded-md font-body disabled:opacity-50 cursor-pointer">
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
      <h2 className="font-display text-xl mb-6 text-navy">{t('account.notification_prefs')}</h2>
      <div className="max-w-md space-y-1">
        {channels.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-4 border-b border-zinc-100">
            <div>
              <p className="text-sm font-medium text-navy">{label}</p>
              <p className="text-xs text-navy/50 mt-0.5">{desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[key]}
              aria-label={label}
              onClick={() => toggle(key)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${prefs[key] ? 'bg-navy' : 'bg-zinc-300'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${prefs[key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}

        {msg && (
          <p role="alert" className={`text-sm pt-2 ${msg === t('account.prefs_saved') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>
        )}
        <div className="pt-4">
          <button onClick={handleSave} disabled={busy} className="px-6 py-2.5 bg-navy text-white text-sm rounded-md font-body disabled:opacity-50 cursor-pointer">
            {busy ? t('account.saving') : t('account.save_prefs')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Brand Products ──────────────────────────────────────────── */
function BrandProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetchWithAuth('/products/brand/my-products')
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchWithAuth('/products', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          category,
          material: 'Custom',
          images: imageUrl ? [imageUrl] : [],
          stockQuantity: 10,
          sizes: ['S', 'M', 'L'],
          colors: ['Standard']
        })
      });
      setShowAddForm(false);
      setName(''); setDescription(''); setPrice(''); setCategory(''); setImageUrl('');
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to add product');
    }
    setIsSubmitting(false);
  };

  const inputCls = 'w-full bg-zinc-100 rounded-md px-4 py-2.5 text-sm text-navy outline-none font-body';
  const labelCls = 'block text-sm font-medium text-navy mb-1';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl text-navy">My Products</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-navy text-white text-sm rounded-md font-body"
        >
          {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddProduct} className="mb-8 p-6 border border-zinc-200 rounded-md space-y-4 max-w-md">
          <h3 className="font-semibold text-navy mb-4">Add New Product</h3>
          <div>
            <label className={labelCls}>Product Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className={inputCls} rows="3" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelCls}>Price ($)</label>
              <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className={inputCls} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Category</label>
              <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className={inputCls} placeholder="e.g. blouse" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Image URL</label>
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={inputCls} placeholder="https://..." />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-2.5 bg-silk-amber text-navy font-semibold rounded-md">
            {isSubmitting ? 'Adding...' : 'Save Product'}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-navy/60">You have not added any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map(p => {
            let img = '';
            try { img = JSON.parse(p.images)[0]; } catch(e) { img = p.images; }
            return (
              <div key={p.id} className="p-4 border border-zinc-200 rounded-md flex gap-4">
                {img && <img src={img} alt={p.name} className="w-20 h-20 object-cover rounded" />}
                <div>
                  <p className="font-semibold text-navy">{p.name}</p>
                  <p className="text-sm text-navy/70">${p.price.toFixed(2)}</p>
                  <p className="text-xs text-navy/50 capitalize mt-1">Category: {p.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Orders ──────────────────────────────────────────────────── */
function AccountOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchWithAuth('/orders/my-orders').catch(() => []),
      fetchWithAuth('/custom-orders/my-requests').catch(() => [])
    ]).then(([ordersData, customOrdersData]) => {
      setOrders(ordersData || []);
      setCustomOrders(customOrdersData || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-display text-xl mb-6 text-navy">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-navy/60">You have no standard orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={`std-${order.id}`} className="p-4 border border-zinc-200 rounded-md">
                <p className="font-semibold text-navy">Order #{order.id}</p>
                <p className="text-sm text-navy/70">Total: ${order.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-navy/70">Status: {order.status}</p>
                <p className="text-sm text-navy/70 mt-2">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-xl mb-6 text-navy">Custom / Brand Requests</h2>
        {customOrders.length === 0 ? (
          <p className="text-navy/60">You have no custom or brand requests yet.</p>
        ) : (
          <div className="space-y-4">
            {customOrders.map(order => (
              <div key={`cst-${order.id}`} className="p-4 border border-zinc-200 rounded-md bg-slate-50">
                <p className="font-semibold text-navy capitalize">Request: {order.orderType?.replace('-', ' ')}</p>
                <p className="text-sm text-navy/70">Status: <span className="font-medium">{order.status}</span></p>
                <p className="text-sm text-navy/70 mt-2">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                {order.requirements && (
                  <div className="mt-3 text-sm text-navy/60 bg-white p-3 rounded border border-slate-200">
                    <p className="font-medium text-navy/80 mb-1">Details:</p>
                    <p>Timeline: {JSON.parse(order.requirements)?.timeline || 'N/A'}</p>
                    <p>Quantity: {JSON.parse(order.requirements)?.quantity || 'N/A'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Page shell ──────────────────────────────────────────────── */
export default function Account() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  
  const tabs = [
    { path: '',               label: 'profile'       },
    { path: 'orders',        label: 'orders'        },
    ...(user?.accountType?.toUpperCase() === 'BRAND' ? [{ path: 'products', label: 'products', fallbackLabel: 'My Products' }] : []),
    { path: 'settings',      label: 'settings'      },
    { path: 'notifications', label: 'notifications' },
  ];

  const location = useLocation();

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="font-display text-4xl md:text-5xl text-navy mb-12">{t('account.title')}</h1>

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
                  active ? 'text-silk-amber border-silk-amber' : 'text-navy/60 hover:text-navy'
                }`}
              >
                {t(`account.${tab.label}`, tab.fallbackLabel)}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="block w-full text-left font-body text-sm text-navy/40 hover:text-red-400 py-2 mt-4 transition-colors"
          >
            {t('nav.logout')}
          </button>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/"              element={<AccountProfile      />} />
            <Route path="orders"         element={<AccountOrders       />} />
            {user?.accountType?.toUpperCase() === 'BRAND' && (
              <Route path="products"     element={<BrandProducts       />} />
            )}
            <Route path="settings"       element={<AccountSettings     />} />
            <Route path="notifications"  element={<AccountNotifications />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
