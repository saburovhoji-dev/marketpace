import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import SellForm from '@/components/SellForm';

export default async function SellPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect(`/${locale}/login`);
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123');
  } catch (e) {
    redirect(`/${locale}/login`);
  }

  const categories = await prisma.category.findMany();

  return (
    <div className="py-20 px-container-margin-mobile md:px-container-margin-desktop min-h-screen cyber-grid relative">
      <div className="absolute inset-0 aurora-glow pointer-events-none opacity-40"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <SellForm categories={categories} locale={locale} />
      </div>
    </div>
  );
}
