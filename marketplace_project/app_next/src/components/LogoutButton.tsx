'use client';

import { useRouter, useParams } from 'next/navigation';

export default function LogoutButton({ label }: { label: string }) {
  const router = useRouter();
  const { locale } = useParams();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push(`/${locale}/login`);
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-error/10 text-error hover:bg-error hover:text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
    >
      {label}
    </button>
  );
}
