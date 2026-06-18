import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default async function Header() {
  const t = await getTranslations('Navigation');
  const tAuth = await getTranslations('Auth');
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123') as any;
    } catch (e) {
      // Invalid token
    }
  }

  return (
    <header className="sticky top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-[0_-1px_0_rgba(255,255,255,0.1)_inset]">
      <div className="flex justify-between items-center h-16 px-container-margin-mobile md:px-container-margin-desktop">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" data-icon="hub">hub</span>
          <Link href="/">
            <h1 className="font-display-lg text-[24px] md:text-display-lg bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">DigitalHubUz</h1>
          </Link>
        </div>
        <div className="hidden md:flex gap-stack-gap-sm items-center">
          <nav className="flex gap-6 text-on-surface-variant font-label-mono text-sm uppercase tracking-wider">
            <Link className="hover:text-primary transition-all duration-300" href="/">{t('home')}</Link>
            <Link className="hover:text-primary transition-all duration-300" href="/categories">{t('categories')}</Link>
            <Link className="hover:text-primary transition-all duration-300" href="/market">{t('market')}</Link>
            {user && (
              <>
                <Link className="hover:text-primary transition-all duration-300" href="/sell">{t('sell')}</Link>
                <Link className="hover:text-primary transition-all duration-300" href="/wallet">{t('wallet')}</Link>
                <Link className="hover:text-primary transition-all duration-300" href="/profile">{t('profile')}</Link>
              </>
            )}
            <Link className="hover:text-primary transition-all duration-300" href="/community">{t('community')}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-3 mr-4 border-r border-white/10 pr-4">
            <Link href="/" locale="uz" className="text-[10px] font-label-mono text-on-surface-variant hover:text-primary">UZ</Link>
            <Link href="/" locale="ru" className="text-[10px] font-label-mono text-on-surface-variant hover:text-primary">RU</Link>
            <Link href="/" locale="en" className="text-[10px] font-label-mono text-on-surface-variant hover:text-primary">EN</Link>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant hover:bg-white/5 p-2 rounded-full transition-all duration-300 cursor-pointer" data-icon="notifications">notifications</span>
              <Link href="/profile" className="flex items-center gap-3 glass-card py-1.5 pl-1.5 pr-4 rounded-full border border-primary/20 hover:border-primary/50 transition-all group">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
                  <img className="w-full h-full object-cover" alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPbpQuTh59C0cCW8NTLHgsnzjIwfyC8o7GTFIdBdtSLuDF-0Yyiz4VvEn_BPYIKRheWPTICcuTMoR0-e_m-WnoOYm3i29YkGYXZisinlcTUh2HF3RwT6EkCpFr8InyYnNjo0-Gpru0T9Q666mnXUQGaeANetPwqDakYUfr5v7uHbTKS7qF-I7oWD6_Vk3A6_bB6Hs8dRVaRcHOUWEz0Ez34ppH6VxTiWIyiD-UsI7rgmPOxbfeta8aduLPnhIWJ814EubnVi-ZQCuw"/>
                </div>
                <span className="font-label-mono text-xs text-primary font-bold group-hover:text-white transition-colors">{user.username}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-on-surface-variant px-4 py-2 rounded-lg font-label-mono text-xs hover:text-white transition-colors">
                {tAuth('login')}
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-primary to-secondary text-on-primary-container px-5 py-2 rounded-lg font-label-mono text-xs font-bold hover:shadow-[0_0_15px_rgba(194,193,255,0.3)] transition-all">
                {tAuth('register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
