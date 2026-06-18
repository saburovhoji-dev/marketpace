import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/routing';

export default async function CategoriesPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('Categories');
  const { locale } = await params;

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <div className="py-20 px-container-margin-mobile md:px-container-margin-desktop space-y-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-headline-lg bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
          {t('popular')}
        </h2>
        <p className="text-on-surface-variant font-body-md max-w-2xl">
          Browse items by their technical domain and asset type.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/market?category=${category.slug}`} className="glass-card p-8 rounded-2xl group hover:bg-white/5 transition-all relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <span className="material-symbols-outlined text-[160px] text-primary" data-icon="category">category</span>
            </div>
            <div className="relative z-10 space-y-6">
              <span className="material-symbols-outlined text-primary p-4 bg-primary/10 rounded-xl" data-icon="category">category</span>
              <div>
                <h3 className="text-2xl font-headline-lg">
                  {locale === 'ru' ? category.name_ru : locale === 'uz' ? category.name_uz : category.name_en}
                </h3>
                <p className="text-on-surface-variant font-label-mono mt-2">{category._count.products} products available</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                Explore Category <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
