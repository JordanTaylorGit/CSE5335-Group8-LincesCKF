import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchWithAuth } from '../services/api';

export default function AccountBrandAddItem() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [images, setImages] = useState('');
  const [sizes, setSizes] = useState('');
  const [colors, setColors] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  function parseList(text) {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }

  function parseSizeStockList(text) {
    const parts = parseList(text);

    return parts.map((part) => {
      const [rawName, rawStock] = part.split(':');
      const name = rawName?.trim();
      const stockQuantity = Number(rawStock);

      if (!name || rawStock === undefined || !Number.isInteger(stockQuantity) || stockQuantity < 0) {
        throw new Error(t('account.add_item_size_format_error'));
      }

      return { name, stockQuantity };
    });
  }

  function getCalculatedStock() {
    try {
      return parseSizeStockList(sizes).reduce((total, size) => total + size.stockQuantity, 0);
    } catch {
      return 0;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');

    if (!name.trim() || !price) return setMsg(t('account.add_item_required_error'));

    let parsedSizes;
    try {
      parsedSizes = parseSizeStockList(sizes);
    } catch (err) {
      return setMsg(err.message);
    }

    if (parsedSizes.length === 0) {
      return setMsg(t('account.add_item_size_required_error'));
    }

    const totalStock = parsedSizes.reduce((total, size) => total + size.stockQuantity, 0);

    const body = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim() || 'other',
      material: material.trim(),
      images: parseList(images),
      stockQuantity: totalStock,
      sizes: parsedSizes,
      colors: parseList(colors),
    };

    try {
      setBusy(true);
      await fetchWithAuth('/products', {
        method: 'POST',
        body: JSON.stringify(body)
      });

      setMsg(t('account.add_item_success'));
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setMaterial('');
      setImages('');
      setSizes('');
      setColors('');
    } catch (err) {
      setMsg(err.message || t('account.add_item_create_error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-xl mb-4 text-navy">{t('account.add_item_heading')}</h2>
      <p className="text-sm text-navy/60 mb-6">
        {t('account.add_item_help')}
      </p>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm text-navy mb-1">{t('account.item_name')}</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
        </div>

        <div>
          <label className="block text-sm text-navy mb-1">{t('account.description')}</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-navy mb-1">{t('account.price_usd')}</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
          </div>
          <div>
            <label className="block text-sm text-navy mb-1">{t('account.total_stock')}</label>
            <input type="number" value={getCalculatedStock()} readOnly className="w-full px-4 py-2 rounded-md bg-zinc-100 text-navy/70" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-navy mb-1">{t('account.category')}</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
          </div>
          <div>
            <label className="block text-sm text-navy mb-1">{t('account.material')}</label>
            <input value={material} onChange={e => setMaterial(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-navy mb-1">{t('account.images_csv')}</label>
          <input value={images} onChange={e => setImages(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-navy mb-1">{t('account.sizes_stock')}</label>
            <input value={sizes} onChange={e => setSizes(e.target.value)} placeholder={t('account.sizes_stock_placeholder')} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
          </div>
          <div>
            <label className="block text-sm text-navy mb-1">{t('account.colors_csv')}</label>
            <input value={colors} onChange={e => setColors(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
          </div>
        </div>

        {msg && <p className="text-sm text-navy/70">{msg}</p>}

        <div>
          <button type="submit" disabled={busy} className="px-6 py-2 bg-navy text-white rounded-md">{busy ? t('account.saving') : t('account.create_item')}</button>
        </div>
      </form>
    </div>
  );
}
