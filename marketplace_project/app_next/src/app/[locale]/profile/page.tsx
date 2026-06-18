import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function ProfilePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('Profile');
  const { locale } = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect(`/${locale}/login`);
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123');
  } catch (e) {
    redirect(`/${locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: {
      products: true,
      orders: {
        include: {
          product: true
        }
      }
    }
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="py-20 px-container-margin-mobile md:px-container-margin-desktop space-y-12">
      <div className="glass-card p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-32 h-32 rounded-full border-2 border-primary/20 p-1">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPbpQuTh59C0cCW8NTLHgsnzjIwfyC8o7GTFIdBdtSLuDF-0Yyiz4VvEn_BPYIKRheWPTICcuTMoR0-e_m-WnoOYm3i29YkGYXZisinlcTUh2HF3RwT6EkCpFr8InyYnNjo0-Gpru0T9Q666mnXUQGaeANetPwqDakYUfr5v7uHbTKS7qF-I7oWD6_Vk3A6_bB6Hs8dRVaRcHOUWEz0Ez34ppH6VxTiWIyiD-UsI7rgmPOxbfeta8aduLPnhIWJ814EubnVi-ZQCuw" 
            alt="Avatar" 
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="space-y-4 text-center md:text-left flex-grow">
          <div>
            <h2 className="text-3xl font-headline-lg">{user.username}</h2>
            <p className="text-on-surface-variant font-label-mono">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <span className="block text-[10px] uppercase text-on-surface-variant font-label-mono">{t('balance')}</span>
              <span className="text-primary font-headline-lg text-xl">${user.balance}</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-tertiary/10 border border-tertiary/20">
              <span className="block text-[10px] uppercase text-on-surface-variant font-label-mono">Role</span>
              <span className="text-tertiary font-headline-lg text-xl capitalize">{user.role}</span>
            </div>
          </div>
        </div>
        <LogoutButton label={t('logout')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Products */}
        <div className="space-y-6">
          <h3 className="text-2xl font-headline-lg">My Items</h3>
          <div className="space-y-4">
            {user.products.length === 0 ? (
              <p className="text-on-surface-variant italic">No items listed yet.</p>
            ) : (
              user.products.map(product => (
                <div key={product.id} className="glass-card p-4 rounded-xl flex gap-4">
                   <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container">
                     <img src={product.imageUrl || ''} alt="" className="w-full h-full object-cover"/>
                   </div>
                   <div className="flex-grow">
                     <h4 className="font-bold">{locale === 'ru' ? product.title_ru : locale === 'uz' ? product.title_uz : product.title_en}</h4>
                     <p className="text-primary font-bold">${product.price}</p>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Orders */}
        <div className="space-y-6">
          <h3 className="text-2xl font-headline-lg">Order History</h3>
          <div className="space-y-4">
            {user.orders.length === 0 ? (
              <p className="text-on-surface-variant italic">No orders yet.</p>
            ) : (
              user.orders.map(order => (
                <div key={order.id} className="glass-card p-4 rounded-xl flex gap-4 border-l-4 border-primary">
                   <div className="flex-grow">
                     <h4 className="font-bold">{locale === 'ru' ? order.product.title_ru : locale === 'uz' ? order.product.title_uz : order.product.title_en}</h4>
                     <p className="text-on-surface-variant text-sm">Status: <span className="text-green-500">{order.status}</span></p>
                   </div>
                   <div className="text-right">
                     <p className="text-on-surface-variant text-[10px] font-label-mono">{new Date(order.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
