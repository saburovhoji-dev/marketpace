import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';

export default async function ChatListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect(`/${locale}/login`);

  let userId: number;
  try {
    userId = (jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123') as any).userId;
  } catch {
    redirect(`/${locale}/login`);
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }]
    },
    include: {
      buyer: { select: { id: true, username: true } },
      seller: { select: { id: true, username: true } },
      product: true,
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: { content: true, createdAt: true, senderId: true }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="py-20 px-container-margin-mobile md:px-container-margin-desktop max-w-3xl mx-auto space-y-6 pb-28 md:pb-12">
      <div className="space-y-1">
        <h2 className="text-3xl md:text-4xl font-headline-lg bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
          {locale === 'ru' ? 'Сообщения' : locale === 'uz' ? 'Xabarlar' : 'Messages'}
        </h2>
        <p className="text-on-surface-variant text-sm md:text-base">
          {locale === 'ru' ? 'Ваши диалоги с продавцами и покупателями' : locale === 'uz' ? 'Sotuvchilar va xaridorlar bilan dialoglaringiz' : 'Your conversations with sellers and buyers'}
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="glass-card p-10 md:p-12 rounded-2xl text-center space-y-5">
          <span className="material-symbols-outlined text-5xl md:text-6xl text-on-surface-variant" data-icon="chat">chat</span>
          <div className="space-y-2">
            <p className="text-on-surface-variant text-base md:text-lg font-medium">
              {locale === 'ru' ? 'Нет сообщений' : locale === 'uz' ? 'Xabarlar yo\'q' : 'No messages yet'}
            </p>
            <p className="text-on-surface-variant/60 text-sm">
              {locale === 'ru' ? 'Нажмите «Написать» на товаре, чтобы начать диалог' : locale === 'uz' ? 'Dialogni boshlash uchun mahsulotdagi «Yozish» tugmasini bosing' : 'Click «Write» on a product to start a conversation'}
            </p>
          </div>
          <Link href="/market" className="inline-block bg-gradient-to-r from-primary to-secondary text-background px-6 py-3 rounded-xl font-label-mono text-sm font-bold hover:shadow-[0_0_15px_rgba(194,193,255,0.3)] transition-all active:scale-95">
            {locale === 'ru' ? 'Перейти в маркет' : locale === 'uz' ? 'Marketga o\'tish' : 'Go to Market'}
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const otherUser = conv.buyerId === userId ? conv.seller : conv.buyer;
            const lastMsg = conv.messages[0];
            const productTitle = conv.product
              ? (locale === 'ru' ? conv.product.title_ru : locale === 'uz' ? conv.product.title_uz : conv.product.title_en)
              : null;
            const timeStr = lastMsg
              ? (() => {
                  const d = new Date(lastMsg.createdAt);
                  const now = new Date();
                  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
                  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  if (diffDays === 1) return locale === 'ru' ? 'Вчера' : locale === 'uz' ? 'Kecha' : 'Yesterday';
                  return d.toLocaleDateString();
                })()
              : null;

            return (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className="bg-white/[0.03] border border-white/10 p-4 md:p-5 rounded-xl flex items-center gap-3 md:gap-4 hover:bg-white/5 transition-all group active:scale-[0.99]"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-bold text-base md:text-lg shrink-0 shadow-[0_0_12px_rgba(194,193,255,0.2)]">
                  {otherUser.username[0].toUpperCase()}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="font-bold text-sm md:text-base text-white truncate">{otherUser.username}</h3>
                    {timeStr && (
                      <span className="text-on-surface-variant text-[10px] md:text-[11px] font-label-mono shrink-0 whitespace-nowrap">
                        {timeStr}
                      </span>
                    )}
                  </div>
                  {productTitle && (
                    <p className="text-primary text-[11px] md:text-xs font-label-mono truncate mt-0.5">{productTitle}</p>
                  )}
                  {lastMsg ? (
                    <p className="text-on-surface-variant text-sm truncate mt-0.5 flex items-center gap-1">
                      {lastMsg.senderId === userId && (
                        <span className="text-[10px] shrink-0 opacity-60">→</span>
                      )}
                      <span className="truncate">{lastMsg.content}</span>
                    </p>
                  ) : (
                    <p className="text-on-surface-variant/50 text-sm italic truncate mt-0.5">
                      {locale === 'ru' ? 'Нет сообщений' : locale === 'uz' ? 'Xabarlar yo\'q' : 'No messages'}
                    </p>
                  )}
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors text-xl md:text-2xl shrink-0" data-icon="chevron_right">chevron_right</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
