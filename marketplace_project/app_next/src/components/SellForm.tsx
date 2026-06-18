'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  slug: string;
  name_ru: string;
  name_uz: string;
  name_en: string;
}

export default function SellForm({ categories, locale }: { categories: Category[]; locale: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    categoryId: categories[0]?.id || '',
    price: '',
    title_ru: '',
    title_uz: '',
    title_en: '',
    desc_ru: '',
    desc_uz: '',
    desc_en: '',
    imageUrl: '',
    type: 'product'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.categoryId || !formData.price || !formData.title_ru || !formData.title_uz || !formData.title_en || !formData.desc_ru || !formData.desc_uz || !formData.desc_en) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Product listed successfully!');
        router.push(`/${locale}/market`);
        router.refresh();
      } else {
        setError(data.error || 'Failed to list product');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(194,193,255,0.05)] space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-headline-lg bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">
          List Product for Sale
        </h2>
        <p className="text-on-surface-variant font-body-md">
          List your bots, scripts, graphics or digital accounts on DigitalHubUz.
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]" data-icon="error">error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[12px] ml-1">Listing Type (Тип объявления)</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md text-white [&>option]:bg-neutral-900"
            >
              <option value="product">Digital Product (Цифровой товар)</option>
              <option value="service">Service (Услуга)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[12px] ml-1">Category (Категория)</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md text-white [&>option]:bg-neutral-900"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {locale === 'ru' ? category.name_ru : locale === 'uz' ? category.name_uz : category.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[12px] ml-1">Price (Цена USD)</label>
            <input
              type="number"
              step="0.01"
              min="0.5"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md text-white"
              placeholder="e.g. 19.99"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
        </div>

        {/* Multilingual Titles */}
        <div className="space-y-4 border-y border-white/5 py-6">
          <h3 className="font-label-mono text-sm text-primary uppercase tracking-wider">Product Title</h3>
          
          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[11px] ml-1">Title (Russian) *</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md text-white"
              placeholder="Название на русском"
              value={formData.title_ru}
              onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[11px] ml-1">Title (Uzbek) *</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md text-white"
              placeholder="Nomi o'zbek tilida"
              value={formData.title_uz}
              onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[11px] ml-1">Title (English) *</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md text-white"
              placeholder="Title in English"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
            />
          </div>
        </div>

        {/* Multilingual Descriptions */}
        <div className="space-y-4 pb-6 border-b border-white/5">
          <h3 className="font-label-mono text-sm text-primary uppercase tracking-wider">Product Description</h3>
          
          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[11px] ml-1">Description (Russian) *</label>
            <textarea
              required
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md text-white resize-none"
              placeholder="Описание товара на русском..."
              value={formData.desc_ru}
              onChange={(e) => setFormData({ ...formData, desc_ru: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[11px] ml-1">Description (Uzbek) *</label>
            <textarea
              required
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md text-white resize-none"
              placeholder="Tavsif o'zbek tilida..."
              value={formData.desc_uz}
              onChange={(e) => setFormData({ ...formData, desc_uz: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[11px] ml-1">Description (English) *</label>
            <textarea
              required
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md text-white resize-none"
              placeholder="Product description in English..."
              value={formData.desc_en}
              onChange={(e) => setFormData({ ...formData, desc_en: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-on-surface-variant font-label-mono text-[12px] ml-1">Image URL (Optional)</label>
          <input
            type="url"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md text-white"
            placeholder="e.g. https://images.unsplash.com/..."
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-container py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(194,193,255,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center"
        >
          {loading ? 'Listing Product...' : 'Submit Listing'}
        </button>
      </form>
    </div>
  );
}
