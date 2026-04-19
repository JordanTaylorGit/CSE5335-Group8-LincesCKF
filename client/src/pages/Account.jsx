/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
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
import AccountBrandAddItem from './AccountBrandAddItem';

/* ── Profile ─────────────────────────────────────────────────── */
function AccountProfile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const primaryAddress = Array.isArray(user?.addresses) ? user.addresses[0] : null;
  const addressParts = primaryAddress
    ? [
        primaryAddress.line1,
        primaryAddress.line2,
        primaryAddress.city,
        primaryAddress.state,
        primaryAddress.postalCode,
        primaryAddress.country,
      ].filter(Boolean)
    : [];

  return (
    <div>
      <p className="font-display text-2xl mb-4">{t('account.greeting', { name: user?.name })}</p>
      <p className="text-obsidian/60">{user?.email}</p>
      {addressParts.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-navy mb-1">{t('account.address_details')}</p>
          <p className="text-sm text-obsidian/60">{addressParts.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

function BrandInquiriesSection() {
  const { t } = useTranslation();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError('');

    fetchWithAuth('/contact/brand-inquiries')
      .then((data) => {
        if (mounted) {
          setInquiries(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        console.error(err);
        if (mounted) {
          setError(err.message || t('account.brand_inquiries_error'));
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [t]);

  const getSubjectLabel = (subject) => {
    const key = {
      'product-inquiry': 'contact.form.options.product',
      'custom-order': 'contact.form.options.custom',
      'b2b-partnership': 'contact.form.options.b2b',
      support: 'contact.form.options.support',
      other: 'contact.form.options.other',
    }[String(subject || '').trim()];

    return key ? t(key) : subject || t('account.not_available');
  };

  const getStatusLabel = (status) => {
    const key = {
      OPEN: 'account.inquiry_status_open',
      IN_PROGRESS: 'account.inquiry_status_in_progress',
      RESOLVED: 'account.inquiry_status_resolved',
    }[String(status || '').trim()];

    return key ? t(key) : status || t('account.not_available');
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-xl text-navy">{t('account.brand_inquiries')}</h2>
      </div>

      {loading ? (
        <p>{t('account.loading_brand_inquiries')}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : inquiries.length === 0 ? (
        <p className="text-navy/60">{t('account.no_brand_inquiries')}</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="rounded-md border border-zinc-200 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-navy">{inquiry.name || t('account.not_available')}</p>
                  <p className="text-sm text-navy/60">{inquiry.email || t('account.not_available')}</p>
                </div>
                {inquiry.createdAt && (
                  <p className="text-xs text-navy/50">
                    {t('account.received_on')}: {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <p className="mt-3 text-sm text-navy/70">
                {t('account.inquiry_subject')}: {getSubjectLabel(inquiry.subject)}
              </p>
              <p className="mt-1 text-sm text-navy/70">
                {t('account.status')}: {getStatusLabel(inquiry.status)}
              </p>
              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-navy/60">{t('account.inquiry_message')}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-navy">{inquiry.message || t('account.not_available')}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function BrandCustomOrderRequestsSection() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError('');

    fetchWithAuth('/custom-orders/brand-requests')
      .then((data) => {
        if (mounted) {
          setRequests(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        console.error(err);
        if (mounted) {
          setError(err.message || t('account.custom_order_requests_error'));
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [t]);

  const getOrderTypeLabel = (orderType) => {
    const key = {
      'custom-garment': 'customOrders.types.customGarment.title',
      'bulk-order': 'customOrders.types.bulkOrder.title',
      'b2b-manufacturing': 'customOrders.types.b2bManufacturing.title',
    }[String(orderType || '').trim()];

    return key ? t(key) : orderType || t('account.not_available');
  };

  const getStatusLabel = (status) => {
    const key = {
      NEW: 'account.custom_order_status_new',
      IN_REVIEW: 'account.custom_order_status_in_review',
      QUOTED: 'account.custom_order_status_quoted',
      APPROVED: 'account.custom_order_status_approved',
      IN_PRODUCTION: 'account.custom_order_status_in_production',
      COMPLETED: 'account.custom_order_status_completed',
      CANCELLED: 'account.custom_order_status_cancelled',
    }[String(status || '').trim()];

    return key ? t(key) : status || t('account.not_available');
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-xl text-navy">{t('account.custom_order_requests')}</h2>
        <p className="mt-1 text-sm text-navy/60">{t('account.custom_order_requests_desc')}</p>
      </div>

      {loading ? (
        <p>{t('account.loading_custom_order_requests')}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-navy/60">{t('account.no_custom_order_requests')}</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <article key={request.id} className="rounded-md border border-zinc-200 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-navy">{request.contactInfo?.name || t('account.not_available')}</p>
                  <p className="text-sm text-navy/60">{request.contactInfo?.email || t('account.not_available')}</p>
                </div>
                {request.createdAt && (
                  <p className="text-xs text-navy/50">
                    {t('account.received_on')}: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="mt-3 space-y-1 text-sm text-navy/70">
                <p>{t('account.request_number', { id: request.requestNumber || request.id })}</p>
                <p>{t('account.type')}: {getOrderTypeLabel(request.orderType)}</p>
                <p>{t('account.quantity')}: {request.requirements?.quantity || t('account.not_specified')}</p>
                <p>{t('account.timeline')}: {request.requirements?.timeline || t('account.not_specified')}</p>
                <p>{t('account.status')}: {getStatusLabel(request.status)}</p>
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-navy/60">{t('account.project_details')}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-navy">
                  {request.requirements?.message || t('account.not_specified')}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Settings ────────────────────────────────────────────────── */
function AccountSettings() {
  const { user, updateProfile, updatePassword } = useAuth();
  const { t } = useTranslation();
  const isBrand = user?.accountType === 'BRAND';
  const primaryAddress = Array.isArray(user?.addresses) ? user.addresses[0] || {} : {};

  const [firstName,   setFirstName]   = useState(user?.firstName   || '');
  const [lastName,    setLastName]    = useState(user?.lastName    || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [phone,       setPhone]       = useState(user?.phone       || '');
  const [email,       setEmail]       = useState(user?.email       || '');
  const [line1,       setLine1]       = useState(primaryAddress.line1      || '');
  const [line2,       setLine2]       = useState(primaryAddress.line2      || '');
  const [city,        setCity]        = useState(primaryAddress.city       || '');
  const [state,       setState]       = useState(primaryAddress.state      || '');
  const [postalCode,  setPostalCode]  = useState(primaryAddress.postalCode || '');
  const [country,     setCountry]     = useState(primaryAddress.country    || '');
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
    if (!email.trim()) return setProfileMsg(t('account.field_required', { field: t('account.email') }));
    const address = {
      line1: line1.trim(),
      line2: line2.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
    };
    const addresses = Object.values(address).some(Boolean) ? [address] : [];

    setProfileBusy(true);
    const res = await updateProfile({ firstName, lastName, companyName, phone, email, addresses });
    setProfileBusy(false);
    setProfileMsg(res.success ? t('account.profile_saved') : res.message);
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwMsg('');
    if (!currentPw) return setPwMsg(t('account.field_required', { field: t('account.current_password') }));
    if (newPw.length < 6) return setPwMsg(t('auth.error_password_length'));
    if (newPw !== confirmPw) return setPwMsg(t('auth.error_passwords_match'));
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
            <div className="account-settings__name-row flex gap-3">
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

          <div className="pt-4 border-t border-zinc-100">
            <h3 className="font-display text-lg mb-4 text-navy">{t('account.address_details')}</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="s-address-line1" className={labelCls}>{t('account.address_line1')}</label>
                <input id="s-address-line1" type="text" value={line1} onChange={e => setLine1(e.target.value)} className={inputCls} autoComplete="address-line1" />
              </div>
              <div>
                <label htmlFor="s-address-line2" className={labelCls}>{t('account.address_line2')}</label>
                <input id="s-address-line2" type="text" value={line2} onChange={e => setLine2(e.target.value)} className={inputCls} autoComplete="address-line2" />
              </div>
              <div className="account-settings__address-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="s-city" className={labelCls}>{t('account.city')}</label>
                  <input id="s-city" type="text" value={city} onChange={e => setCity(e.target.value)} className={inputCls} autoComplete="address-level2" />
                </div>
                <div>
                  <label htmlFor="s-state" className={labelCls}>{t('account.state')}</label>
                  <input id="s-state" type="text" value={state} onChange={e => setState(e.target.value)} className={inputCls} autoComplete="address-level1" />
                </div>
              </div>
              <div className="account-settings__address-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="s-postal" className={labelCls}>{t('account.postal_code')}</label>
                  <input id="s-postal" type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} className={inputCls} autoComplete="postal-code" />
                </div>
                <div>
                  <label htmlFor="s-country" className={labelCls}>{t('account.country')}</label>
                  <input id="s-country" type="text" value={country} onChange={e => setCountry(e.target.value)} className={inputCls} autoComplete="country-name" />
                </div>
              </div>
            </div>
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
  const isBrand = user?.accountType === 'BRAND';
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
      <div className="space-y-12">
        {isBrand && <BrandInquiriesSection />}

        <section>
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
        </section>
      </div>
    </div>
  );
}

/* ── Orders ──────────────────────────────────────────────────── */
function AccountOrders() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveringKey, setDeliveringKey] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const isBrand = user?.accountType === 'BRAND';
  const currentUserId = Number(user?.id);

  const getStatusLabel = (status) => {
    const key = {
      Processing: 'account.status_processing',
      Delivered: 'account.status_delivered',
      'Partially Delivered': 'account.status_partially_delivered',
      NEW: 'account.custom_order_status_new',
      IN_REVIEW: 'account.custom_order_status_in_review',
      QUOTED: 'account.custom_order_status_quoted',
      APPROVED: 'account.custom_order_status_approved',
      IN_PRODUCTION: 'account.custom_order_status_in_production',
      COMPLETED: 'account.custom_order_status_completed',
      CANCELLED: 'account.custom_order_status_cancelled',
    }[String(status || '').trim()];

    return key ? t(key) : status || t('account.not_available');
  };

  const getCustomOrderTypeLabel = (orderType) => {
    const key = {
      'custom-garment': 'customOrders.types.customGarment.title',
      'bulk-order': 'customOrders.types.bulkOrder.title',
      'b2b-manufacturing': 'customOrders.types.b2bManufacturing.title',
    }[String(orderType || '').trim()];

    return key ? t(key) : String(orderType || '').replaceAll('-', ' ') || t('account.not_available');
  };

  useEffect(() => {
    let mounted = true;

    function mergeOrdersById(rows, orderKind) {
      const merged = new Map();

      rows.forEach((order) => {
        const existing = merged.get(order.id);
        if (existing) {
          merged.set(order.id, {
            ...existing,
            ...order,
            orderKind,
            sortDate: existing.sortDate || order.createdAt,
            isPlacedOrder: existing.isPlacedOrder || order.isPlacedOrder,
            isBrandOrder: existing.isBrandOrder || order.isBrandOrder,
          });
          return;
        }

        merged.set(order.id, {
          ...order,
          orderKind,
          sortDate: order.createdAt,
          isPlacedOrder: Boolean(order.isPlacedOrder),
          isBrandOrder: Boolean(order.isBrandOrder),
        });
      });

      return [...merged.values()];
    }

    const request = isBrand
      ? Promise.all([
          fetchWithAuth('/orders/my-orders'),
          fetchWithAuth('/custom-orders/my-requests'),
          fetchWithAuth('/orders/brand/my-orders'),
          fetchWithAuth('/custom-orders/brand-requests'),
        ])
      : Promise.all([
          fetchWithAuth('/orders/my-orders'),
          fetchWithAuth('/custom-orders/my-requests'),
        ]);

    request
      .then((responses) => {
        let combinedOrders = [];

        if (isBrand) {
          const [
            ownRegularOrders = [],
            ownCustomOrders = [],
            brandRegularOrders = [],
            brandCustomOrders = [],
          ] = responses;

          const regularOrders = mergeOrdersById([
            ...ownRegularOrders.map((order) => ({ ...order, isPlacedOrder: true })),
            ...brandRegularOrders.map((order) => ({ ...order, isBrandOrder: true })),
          ], 'regular');

          const customOrders = mergeOrdersById([
            ...ownCustomOrders.map((order) => ({ ...order, isPlacedOrder: true })),
            ...brandCustomOrders.map((order) => ({ ...order, isBrandOrder: true })),
          ], 'custom');

          combinedOrders = [...regularOrders, ...customOrders];
        } else {
          const [regularOrders = [], customOrders = []] = responses;
          combinedOrders = [
            ...regularOrders.map(order => ({
              ...order,
              orderKind: 'regular',
              sortDate: order.createdAt,
            })),
            ...customOrders.map(order => ({
              ...order,
              orderKind: 'custom',
              sortDate: order.createdAt,
            })),
          ];
        }

        combinedOrders.sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));

        if (mounted) {
          setOrders(combinedOrders);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [isBrand]);

  async function handleDeliver(orderId, itemIndex) {
    const key = `${orderId}-${itemIndex}`;
    setDeliveringKey(key);
    setActionMessage('');

    try {
      const data = await fetchWithAuth(`/orders/${orderId}/items/${itemIndex}/deliver`, {
        method: 'PUT',
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) => (
          order.orderKind === 'regular' && order.id === orderId
            ? {
                ...order,
                ...data.order,
                orderKind: 'regular',
                sortDate: order.sortDate || data.order.createdAt,
              }
            : order
        ))
      );
    } catch (error) {
      setActionMessage(error.message || t('account.deliver_error'));
    } finally {
      setDeliveringKey('');
    }
  }

  async function handleCustomOrderDeliver(customOrderId) {
    const key = `custom-${customOrderId}`;
    setDeliveringKey(key);
    setActionMessage('');

    try {
      const data = await fetchWithAuth(`/custom-orders/${customOrderId}/deliver`, {
        method: 'PUT',
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) => (
          order.orderKind === 'custom' && order.id === customOrderId
            ? {
                ...order,
                ...data.order,
                orderKind: 'custom',
                sortDate: order.sortDate || data.order.createdAt,
              }
            : order
        ))
      );
    } catch (error) {
      setActionMessage(error.message || t('account.deliver_error'));
    } finally {
      setDeliveringKey('');
    }
  }

  if (loading) return <p>{t('account.loading_orders')}</p>;

  return (
    <div>
      <h2 className="font-display text-xl mb-6 text-navy">{t('account.orders')}</h2>
      {actionMessage && (
        <p role="alert" className="mb-4 text-sm text-red-500">{actionMessage}</p>
      )}
      {orders.length === 0 ? (
        <p className="text-navy/60">{t('account.no_orders')}</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={`${order.orderKind}-${order.id}`} className="p-4 border border-zinc-200 rounded-md">
              <p className="font-semibold text-navy">
                {order.orderKind === 'custom' ? t('account.custom_order') : t('account.order_number', { id: order.id })}
              </p>

              {order.orderKind === 'custom' ? (
                <>
                  <p className="text-sm text-navy/70">{t('account.request_number', { id: order.requestNumber || order.id })}</p>
                  <p className="text-sm text-navy/70">{t('account.type')}: {getCustomOrderTypeLabel(order.orderType)}</p>
                  <p className="text-sm text-navy/70">{t('account.timeline')}: {order.requirements?.timeline || t('account.not_specified')}</p>
                  <p className="text-sm text-navy/70">{t('account.quantity')}: {order.requirements?.quantity || t('account.not_specified')}</p>
                  {isBrand && order.contactInfo?.name && (
                    <p className="text-sm text-navy/70">{t('account.customer')}: {order.contactInfo.name}</p>
                  )}
                  {isBrand && order.contactInfo?.email && (
                    <p className="text-sm text-navy/70">{t('account.email')}: {order.contactInfo.email}</p>
                  )}
                  {isBrand && order.contactInfo?.phone && (
                    <p className="text-sm text-navy/70">{t('account.phone')}: {order.contactInfo.phone}</p>
                  )}
                  {order.brandName && (
                    <p className="text-sm text-navy/70">{t('product.brand')}: {order.brandName}</p>
                  )}
                  <div className="mt-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-navy/60">{t('account.project_details')}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-navy">
                      {order.requirements?.message || t('account.not_specified')}
                    </p>
                  </div>
                  {isBrand && Number(order.brandUserId) === currentUserId && String(order.status || '').trim().toUpperCase() !== 'COMPLETED' && String(order.status || '').trim().toUpperCase() !== 'CANCELLED' && (
                    <button
                      type="button"
                      onClick={() => handleCustomOrderDeliver(order.id)}
                      disabled={deliveringKey === `custom-${order.id}`}
                      className="mt-3 rounded-md bg-navy px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deliveringKey === `custom-${order.id}`
                        ? t('account.delivering')
                        : t('account.deliver_product')}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-navy/70">{t('account.total')}: ${Number(order.totalAmount).toFixed(2)}</p>
                  {isBrand && order.shippingAddress?.fullName && (
                    <p className="text-sm text-navy/70">{t('account.customer')}: {order.shippingAddress.fullName}</p>
                  )}
                  <div className="mt-3 space-y-2">
                    {(order.items || []).map((item, index) => (
                      <div key={`${order.id}-${item.productId || item.id || index}`} className="rounded-md bg-zinc-50 p-3">
                        <p className="text-sm font-medium text-navy">
                          {item.name || item.nameEn || t('account.item_number', { number: index + 1 })}
                        </p>
                        {item.brandName && (
                          <p className="mt-1 text-xs text-navy/70">
                            {t('product.brand')}: {item.brandName}
                          </p>
                        )}
                        <div className="account-orders__item-grid mt-2 grid grid-cols-1 sm:grid-cols-5 gap-1 text-xs text-navy/60">
                          <span>{t('account.size')}: {item.selectedSize || t('account.not_available')}</span>
                          <span>
                            {t('account.color')}: {(
                              i18n.language === 'es'
                                ? item.selectedColorEs || item.selectedColor
                                : item.selectedColor
                            ) || t('account.not_available')}
                          </span>
                          <span>{t('account.qty')}: {item.quantity || 1}</span>
                          <span>
                            {t('account.line_total')}: ${(
                              Number(item.price || 0) * Number(item.quantity || 1)
                            ).toFixed(2)}
                          </span>
                          <span>{t('account.delivery_status')}: {getStatusLabel(item.deliveryStatus)}</span>
                        </div>
                        {isBrand && Number(item.brandId) === currentUserId && item.deliveryStatus !== 'Delivered' && (
                          <button
                            type="button"
                            onClick={() => handleDeliver(order.id, item.itemIndex)}
                            disabled={deliveringKey === `${order.id}-${item.itemIndex}`}
                            className="mt-3 rounded-md bg-navy px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deliveringKey === `${order.id}-${item.itemIndex}`
                              ? t('account.delivering')
                              : t('account.deliver_product')}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <p className="text-sm text-navy/70">{t('account.status')}: {getStatusLabel(order.status)}</p>
              <p className="text-sm text-navy/70 mt-2">{t('account.date')}: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page shell ──────────────────────────────────────────────── */
const baseTabs = [
  { path: '',               label: 'profile'       },
  { path: 'orders',        label: 'orders'        },
  { path: 'settings',      label: 'settings'      },
  { path: 'notifications', label: 'notifications' },
];

export default function Account() {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="account-page max-w-5xl mx-auto px-6 py-20">
      <h1 className="font-display text-4xl md:text-5xl text-navy mb-12">{t('account.title')}</h1>

      <div className="account-page__layout flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="account-page__sidebar w-full md:w-48 space-y-2">
          {baseTabs.map(tab => {
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
                {t(`account.${tab.label}`)}
              </Link>
            );
          })}

          {/* If user is a brand show product creation link */}
          {user?.accountType === 'BRAND' && (
            <Link to="/account/brand/add-item" className={`block font-body text-sm tracking-wider py-2 border-b border-transparent ${location.pathname.startsWith('/account/brand') ? 'text-silk-amber border-silk-amber' : 'text-navy/60 hover:text-navy'}`}>
              {t('account.add_item')}
            </Link>
          )}

          {/* brand tab link (only visible to brand users; rendered later in BrandAreaWrapper) */}
          <button
            onClick={logout}
            className="block w-full text-left font-body text-sm text-navy/40 hover:text-red-400 py-2 mt-4 transition-colors"
          >
            {t('nav.logout')}
          </button>
        </aside>

        {/* Content */}
        <div className="account-page__content flex-1">
          <Routes>
            <Route path="/"              element={<AccountProfile      />} />
            <Route path="orders"         element={<AccountOrders       />} />
            <Route path="settings"       element={<AccountSettings     />} />
            <Route path="notifications"  element={<AccountNotifications />} />
            <Route path="brand/*"        element={<BrandAreaWrapper />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function BrandAreaWrapper() {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user || user.accountType !== 'BRAND') {
    return (
      <div className="account-page__brand-only p-6 border rounded-md">
        <p className="text-navy/70">{t('account.brand_only')}</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AccountBrandAddItem />} />
      <Route path="add-item" element={<AccountBrandAddItem />} />
    </Routes>
  );
}
