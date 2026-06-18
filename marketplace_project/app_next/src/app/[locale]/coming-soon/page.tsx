import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function ComingSoonPage({ params }: { params: { locale: string } }) {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 px-container-margin-mobile">
      <div className="relative">
        <div className="absolute inset-0 blur-3xl bg-primary/20 animate-pulse"></div>
        <span className="material-symbols-outlined text-[120px] text-primary relative z-10" data-icon="construction">construction</span>
      </div>
      <div className="space-y-4 relative z-10">
        <h2 className="text-5xl font-headline-lg bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">
          Coming Soon
        </h2>
        <p className="text-on-surface-variant font-body-md max-w-md mx-auto">
          We are building the future of digital asset exchange. This feature will be available in the next major update.
        </p>
      </div>
      <Link href="/" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(194,193,255,0.4)] transition-all">
        Back to Home
      </Link>
    </div>
  );
}
