import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@context/AuthContext';
import { fetchWithAuth } from '../services/api';

export default function AccountBrand() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchWithAuth('/products/brand/my-products')
      .then(data => { if (mounted) setProducts(data); })
      .catch(err => { console.error(err); if (mounted) setError(err.message || t('account.load_products_error')); })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [t]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-navy">{t('account.add_item')}</h2>
        <Link to="add-item" className="px-4 py-2 bg-navy text-white rounded-md text-sm">{t('account.add_item')}</Link>
      </div>

      <p className="text-sm text-navy/70 mb-4">{t('account.signed_in_as')}: <strong>{user?.companyName || user?.name}</strong></p>

      {loading ? (
        <p>{t('account.loading_products')}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <div className="p-6 border border-dashed border-zinc-200 rounded-md">
          <p className="text-navy/70">{t('account.no_products')}</p>
          <Link to="add-item" className="inline-block mt-4 px-4 py-2 bg-silk-amber text-navy rounded-md">{t('account.create_first_product')}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className="p-4 border rounded-md">
              <div className="flex gap-4">
                <img src={p.image || '/images/placeholder.png'} alt={p.name} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <h3 className="font-semibold text-navy">{p.name}</h3>
                  <p className="text-sm text-navy/70">${Number(p.price).toFixed(2)}</p>
                  <p className="text-xs text-navy/50 mt-2">{p.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
