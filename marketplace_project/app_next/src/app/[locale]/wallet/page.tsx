import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import WalletClient from '@/components/WalletClient';

export default async function WalletPage({ params }: { params: Promise<{ locale: string }> }) {
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
    where: { id: decoded.userId }
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="py-20 px-container-margin-mobile md:px-container-margin-desktop min-h-screen cyber-grid relative">
      <div className="absolute inset-0 aurora-glow pointer-events-none opacity-40"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <WalletClient initialUser={{ username: user.username, email: user.email, balance: user.balance }} locale={locale} />
      </div>
    </div>
  );
}
