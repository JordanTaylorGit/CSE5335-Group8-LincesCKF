// Account Page — stub for authenticated user dashboard
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@context/AuthContext';

function AccountOrders() {
  return <p className="font-display text-2xl text-obsidian/40">No orders yet.</p>;
}
function AccountProfile() {
  const { user } = useAuth();
  return <div>
    <p className="font-display text-2xl mb-4">Hello, {user?.name}</p>
    <p className="text-obsidian/60">{user?.email}</p>
  </div>;
}

const tabs = [
  { path: '', label: 'profile' },
  { path: 'orders', label: 'orders' },
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
          {tabs.map(tab => (
            <Link
              key={tab.path}
              to={`/account${tab.path ? `/${tab.path}` : ''}`}
              className={`block font-body text-sm tracking-wider py-2 border-b border-transparent ${
                location.pathname === `/account${tab.path ? `/${tab.path}` : ''}`
                  ? 'text-silk-600 border-silk-400'
                  : 'text-obsidian/60 hover:text-obsidian'
              }`}
            >
              {t(`account.${tab.label}`)}
            </Link>
          ))}
          <button onClick={logout} className="block w-full text-left font-body text-sm text-obsidian/40 hover:text-red-400 py-2 mt-4 transition-colors">
            {t('nav.logout')}
          </button>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<AccountProfile />} />
            <Route path="orders" element={<AccountOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
