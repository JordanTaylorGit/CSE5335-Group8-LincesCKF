import { useState } from 'react';
import { fetchWithAuth } from '../services/api';

export default function AccountBrandAddItem() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [images, setImages] = useState('');
  const [stock, setStock] = useState('0');
  const [sizes, setSizes] = useState('');
  const [colors, setColors] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  function parseList(text) {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');

    if (!name.trim() || !price) return setMsg('Name and price are required');

    const body = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim() || 'other',
      material: material.trim(),
      images: parseList(images),
      stockQuantity: Number(stock) || 0,
      sizes: parseList(sizes),
      colors: parseList(colors),
    };

    try {
      setBusy(true);
      await fetchWithAuth('/products', {
        method: 'POST',
        body: JSON.stringify(body)
      });

      setMsg('Product created successfully');
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setMaterial('');
      setImages('');
      setStock('0');
      setSizes('');
      setColors('');
    } catch (err) {
      setMsg(err.message || 'Failed to create product');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-xl mb-4 text-navy">Add New Item</h2>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm text-navy mb-1">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
        </div>

        <div>
          <label className="block text-sm text-navy mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-navy mb-1">Price (USD)</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
          </div>
          <div>
            <label className="block text-sm text-navy mb-1">Stock Qty</label>
            <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-navy mb-1">Category</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
          </div>
          <div>
            <label className="block text-sm text-navy mb-1">Material</label>
            <input value={material} onChange={e => setMaterial(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-navy mb-1">Images (comma-separated URLs)</label>
          <input value={images} onChange={e => setImages(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-navy mb-1">Sizes (comma-separated)</label>
            <input value={sizes} onChange={e => setSizes(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
          </div>
          <div>
            <label className="block text-sm text-navy mb-1">Colors (comma-separated)</label>
            <input value={colors} onChange={e => setColors(e.target.value)} className="w-full px-4 py-2 rounded-md bg-zinc-100" />
          </div>
        </div>

        {msg && <p className="text-sm text-navy/70">{msg}</p>}

        <div>
          <button type="submit" disabled={busy} className="px-6 py-2 bg-navy text-white rounded-md">{busy ? 'Saving...' : 'Create Item'}</button>
        </div>
      </form>
    </div>
  );
}
