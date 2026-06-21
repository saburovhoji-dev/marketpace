import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';

export default async function Footer() {
  const t = await getTranslations('Navigation');
  
  return (
    <footer className="bg-surface-container-lowest w-full py-stack-gap-lg border-t border-outline-variant px-container-margin-desktop mt-auto pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-gap-sm mb-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" data-icon="hub">hub</span>
          <h2 className="font-display-lg text-[24px] text-primary">DigitalHubUz</h2>
        </div>
        <div className="flex flex-wrap gap-6 font-body-md text-on-surface-variant">
          <a className="hover:text-tertiary transition-colors" href="#">Privacy</a>
          <a className="hover:text-tertiary transition-colors" href="#">Terms</a>
          <a className="hover:text-tertiary transition-colors" href="#">Support</a>
          <a className="hover:text-tertiary transition-colors" href="#">API</a>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 text-on-surface-variant font-label-mono text-[12px]">
        <p>© 2024 DigitalHubUz. Frontier Technology Uzbekistan.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span className="material-symbols-outlined" data-icon="terminal">terminal</span>
          <span>Built for the Digital Future</span>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe bg-surface-container-lowest/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_24px_rgba(194,193,255,0.1)] rounded-t-lg">
        <Link className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(194,193,255,0.8)] active:scale-90 transition-transform" href="/">
          <span className="material-symbols-outlined" data-icon="home">home</span>
          <span className="font-label-mono text-label-mono mt-1">{t('home')}</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary/80 transition-colors active:scale-90 transition-transform" href="/categories">
          <span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
          <span className="font-label-mono text-label-mono mt-1">{t('categories')}</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary/80 transition-colors active:scale-90 transition-transform" href="/market">
          <span className="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
          <span className="font-label-mono text-label-mono mt-1">{t('market')}</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary/80 transition-colors active:scale-90 transition-transform" href="/chat">
          <span className="material-symbols-outlined" data-icon="chat">chat</span>
          <span className="font-label-mono text-label-mono mt-1">{t('chat')}</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary/80 transition-colors active:scale-90 transition-transform" href="/wallet">
          <span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
          <span className="font-label-mono text-label-mono mt-1">{t('wallet')}</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary/80 transition-colors active:scale-90 transition-transform" href="/profile">
          <span className="material-symbols-outlined" data-icon="person">person</span>
          <span className="font-label-mono text-label-mono mt-1">{t('profile')}</span>
        </Link>
      </nav>
    </footer>
  );
}
