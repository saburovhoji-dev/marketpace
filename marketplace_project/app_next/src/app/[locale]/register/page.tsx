'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { locale } = useParams();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/${locale}/profile`);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 cyber-grid relative">
      <div className="absolute inset-0 aurora-glow pointer-events-none opacity-50"></div>
      
      <div className="glass-card p-10 rounded-3xl w-full max-w-md space-y-8 relative z-10 border border-white/10 shadow-[0_0_50px_rgba(194,193,255,0.1)]">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-headline-lg bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">
            {t('register')}
          </h2>
          <p className="text-on-surface-variant font-label-mono text-sm uppercase tracking-widest">Join the Future</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-sm flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-[20px]" data-icon="error">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[12px] ml-1">Username</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors" data-icon="person">person</span>
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[12px] ml-1">{t('email')}</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors" data-icon="mail">mail</span>
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[12px] ml-1">{t('password')}</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors" data-icon="lock">lock</span>
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-container py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(194,193,255,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : t('submit')}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-on-surface-variant text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-bold">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
