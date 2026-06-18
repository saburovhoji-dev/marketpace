'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export default function Login() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        router.push('/profile');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="glass-card p-8 rounded-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-headline-lg text-center">{t('login')}</h2>
        
        {error && <div className="text-error text-center text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-label-mono text-on-surface-variant">{t('email')}</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-label-mono text-on-surface-variant">{t('password')}</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg hover:shadow-[0_0_15px_rgba(194,193,255,0.4)] transition-all active:scale-95 mt-4"
          >
            {t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
