'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function BuyButton({ productId, label }: { productId: number, label: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { locale } = useParams();

  const handleBuy = async () => {
    if (!confirm('Are you sure you want to buy this item?')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/products/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Purchase successful! You can find your item in your profile.');
        router.push(`/${locale}/profile`);
        router.refresh();
      } else {
        alert(data.error || 'Purchase failed');
        if (res.status === 401) {
          router.push(`/${locale}/login`);
        }
      }
    } catch (err) {
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleBuy}
      disabled={loading}
      className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-4 py-2 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50"
    >
      {loading ? 'Processing...' : label}
    </button>
  );
}
