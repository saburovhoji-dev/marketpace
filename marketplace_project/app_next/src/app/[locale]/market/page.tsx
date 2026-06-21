import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import BuyButton from '@/components/BuyButton';
import ContactSellerButton from '@/components/ContactSellerButton';

export default async function MarketPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ category?: string, search?: string, type?: string }>
}) {
  const t = await getTranslations('Market');
  const { locale } = await params;
  const { category: categorySlug, search: searchQuery, type: typeFilter } = await searchParams;
  
  const products = await prisma.product.findMany({
    where: {
      AND: [
        categorySlug ? {
          category: {
            slug: categorySlug
          }
        } : {},
        searchQuery ? {
          OR: [
            { title_ru: { contains: searchQuery } },
            { title_uz: { contains: searchQuery } },
            { title_en: { contains: searchQuery } }
          ]
        } : {},
        typeFilter ? {
          type: typeFilter
        } : {}
      ]
    },
    include: {
      category: true,
      seller: true
    }
  });

  return (
    <div className="py-20 px-container-margin-mobile md:px-container-margin-desktop space-y-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-headline-lg bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
          {t('title')}
        </h2>
        <p className="text-on-surface-variant font-body-md max-w-2xl">
          {t('description')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-white/10 pb-6">
        <Link 
          href={{
            pathname: '/market',
            query: {
              ...(categorySlug ? { category: categorySlug } : {}),
              ...(searchQuery ? { search: searchQuery } : {})
            }
          }}
          className={`px-6 py-2.5 rounded-full font-label-mono text-xs uppercase tracking-wider transition-all duration-300 ${!typeFilter ? 'bg-primary text-background font-bold shadow-[0_0_20px_rgba(194,193,255,0.4)]' : 'text-on-surface-variant hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          {locale === 'ru' ? 'Все' : locale === 'uz' ? 'Barchasi' : 'All'}
        </Link>
        <Link 
          href={{
            pathname: '/market',
            query: {
              type: 'product',
              ...(categorySlug ? { category: categorySlug } : {}),
              ...(searchQuery ? { search: searchQuery } : {})
            }
          }}
          className={`px-6 py-2.5 rounded-full font-label-mono text-xs uppercase tracking-wider transition-all duration-300 ${typeFilter === 'product' ? 'bg-primary text-background font-bold shadow-[0_0_20px_rgba(194,193,255,0.4)]' : 'text-on-surface-variant hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          {locale === 'ru' ? 'Товары' : locale === 'uz' ? 'Mahsulotlar' : 'Products'}
        </Link>
        <Link 
          href={{
            pathname: '/market',
            query: {
              type: 'service',
              ...(categorySlug ? { category: categorySlug } : {}),
              ...(searchQuery ? { search: searchQuery } : {})
            }
          }}
          className={`px-6 py-2.5 rounded-full font-label-mono text-xs uppercase tracking-wider transition-all duration-300 ${typeFilter === 'service' ? 'bg-primary text-background font-bold shadow-[0_0_20px_rgba(194,193,255,0.4)]' : 'text-on-surface-variant hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          {locale === 'ru' ? 'Услуги' : locale === 'uz' ? 'Xizmatlar' : 'Services'}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="glass-card p-4 rounded-xl space-y-4 group hover:bg-white/5 transition-all">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-surface-container relative">
              <img 
                src={product.imageUrl || '/placeholder.png'} 
                alt={product.title_en}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-2 right-2 px-2 py-1 rounded bg-background/80 backdrop-blur-md text-primary text-[10px] font-label-mono">
                {product.category.name_en}
              </div>
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-background/80 backdrop-blur-md text-[10px] font-label-mono flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${product.type === 'service' ? 'bg-tertiary shadow-[0_0_6px_rgba(180,180,255,0.6)]' : 'bg-primary shadow-[0_0_6px_rgba(194,193,255,0.6)]'}`}></span>
                <span className="text-white">
                  {product.type === 'service' 
                    ? (locale === 'ru' ? 'Услуга' : locale === 'uz' ? 'Xizmat' : 'Service')
                    : (locale === 'ru' ? 'Товар' : locale === 'uz' ? 'Mahsulot' : 'Product')
                  }
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-headline-lg-mobile text-lg line-clamp-1">
                {locale === 'ru' ? product.title_ru : locale === 'uz' ? product.title_uz : product.title_en}
              </h3>
              <p className="text-on-surface-variant text-sm line-clamp-2">
                {locale === 'ru' ? product.desc_ru : locale === 'uz' ? product.desc_uz : product.desc_en}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-on-surface-variant text-[10px] font-label-mono uppercase">{t('price')}</span>
                <span className="text-primary font-headline-lg text-xl">${product.price}</span>
              </div>
              <BuyButton productId={product.id} label={t('buy')} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <ContactSellerButton sellerId={product.sellerId} productId={product.id} label={locale === 'ru' ? 'Написать' : locale === 'uz' ? 'Yozish' : 'Write'} />
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-label-mono">
              <span className="material-symbols-outlined text-[14px]" data-icon="person">person</span>
              <span>{product.seller.username}</span>
              <span className="ml-auto flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-tertiary" data-icon="star">star</span>
                4.9
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
