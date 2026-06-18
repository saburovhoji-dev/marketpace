import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/routing';

export default async function Home({ params }: { params: { locale: string } }) {
  const t = await getTranslations('Hero');
  const tCat = await getTranslations('Categories');
  const { locale } = await params;

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[751px] flex flex-col items-center justify-center pt-20 px-container-margin-mobile text-center cyber-grid overflow-hidden">
        <div className="absolute inset-0 aurora-glow pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-stack-gap-lg">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">{t('badge')}</span>
          </div>
          <h2 className="text-display-lg md:text-[80px] font-display-lg leading-[1.2] pb-stack-gap-sm bg-gradient-to-br from-white via-primary to-tertiary bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">
            {t('description')}
          </p>
          <div className="relative max-w-2xl mx-auto w-full group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-xl blur-lg opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
            <form action={`/${locale}/market`} method="GET" className="relative flex items-center glass-card rounded-xl p-2 h-16">
              <span className="material-symbols-outlined px-4 text-outline" data-icon="search">search</span>
              <input 
                name="search"
                className="bg-transparent border-none focus:ring-0 w-full text-white font-body-md placeholder:text-outline focus:outline-none" 
                placeholder={t('searchPlaceholder')} 
                type="text"
              />
              <button type="submit" className="bg-gradient-to-r from-primary to-secondary text-on-primary-container px-8 h-full rounded-lg font-headline-lg-mobile md:text-[16px] text-[14px] font-bold hover:shadow-[0_0_20px_rgba(194,193,255,0.4)] active:scale-95 transition-all">
                {t('startTrading')}
              </button>
            </form>
          </div>
          <div className="flex flex-wrap justify-center gap-stack-gap-lg pt-stack-gap-lg border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <img className="w-8 h-8 rounded-full border-2 border-background" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ9TxgqR-PYNFRq0k0n-XatcImO8z-SYPCC16rwzDBqwKpKr7Haug5bT2aGJljMDCEdREGNJpAUUYVSglmMwmoY4vbhtO2EvJW7RtRO7b-OcCrHQcoNOvcw4_d1l-Iv3CP18coctBHzkJUKWBwJpm312-KFRCzxI2T4nIJdsXIUKFbvPsexfntV73M5yIqUJ1MD0MCmd3vaeosk3zs399UD3d6bZrzFqQdVBJJ21-EBZw7ImOrEevpdDJmTvqFeYz-i_HJJS2YHlUD"/>
                <img className="w-8 h-8 rounded-full border-2 border-background" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ0RJJB3m0O7E_2e5Tcm2EVA8tYMjAU9G7eKE_X0PW7Z3iGXlgqCTf-V13gYUNjEZ1cXoScnodEYAIJShNuC2YqfdZltAk7xLNaXdolvNxiW9NwjXqYC-C4f9LvBmgpK6ekGOBfUSnniOUjA3tfhLy8Q9Q8EQsxXPMQ_BOoBMhlLKT8ZN6llNNaSFv20gMccF_3dfTgDghaXbI8_a25M383Gz4jJYBHNz2cs3pkP60CbzzWhXYo3c3oN1nbm5eV53xOo_bknmhXKew"/>
              </div>
              <span className="font-label-mono text-label-mono text-on-surface-variant">
                <b className="text-primary">1,240+</b> {t('onlineNow')}
              </span>
            </div>
            <div className="flex items-center gap-2 font-label-mono text-label-mono text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px]" data-icon="verified">verified</span>
              {t('safeDeals')}
            </div>
            <div className="flex items-center gap-2 font-label-mono text-label-mono text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px]" data-icon="bolt">bolt</span>
              {t('instantDelivery')}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-stack-gap-lg px-container-margin-mobile md:px-container-margin-desktop space-y-stack-gap-lg">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="font-label-mono text-primary uppercase tracking-widest">{tCat('explore')}</p>
            <h3 className="font-headline-lg-mobile md:text-headline-lg">{tCat('popular')}</h3>
          </div>
          <Link href="/market" className="text-primary font-label-mono flex items-center gap-1 hover:gap-2 transition-all">
            {tCat('viewAll')} <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-gutter">
          {categories.map((category) => (
            <Link key={category.id} href={`/market?category=${category.slug}`} className="glass-card p-6 rounded-lg group hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <span className="material-symbols-outlined text-primary p-3 bg-primary/10 w-fit rounded-lg mb-8" data-icon="category">category</span>
                <div>
                  <h4 className="font-headline-lg-mobile text-[16px]">
                    {locale === 'ru' ? category.name_ru : locale === 'uz' ? category.name_uz : category.name_en}
                  </h4>
                  <p className="font-label-mono text-on-surface-variant text-[10px]">{category._count.products} Items</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="bg-surface-container-lowest border-y border-white/5 py-4 overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-12 animate-marquee">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <p className="font-label-mono text-on-surface-variant"><span className="text-white">@dev_uz</span> bought <span className="text-primary">Telegram Premium Bot</span></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(194,193,255,0.6)]"></span>
            <p className="font-label-mono text-on-surface-variant">New seller: <span className="text-white">NeoDesign</span></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <p className="font-label-mono text-on-surface-variant"><span className="text-white">@shark_pro</span> sold <span className="text-tertiary">Landing Page</span></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <p className="font-label-mono text-on-surface-variant"><span className="text-white">@alex_it</span> bought <span className="text-primary">Admin Dashboard</span></p>
          </div>
        </div>
      </section>
    </>
  );
}
