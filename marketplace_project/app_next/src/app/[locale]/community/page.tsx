import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import CommunityClient from '@/components/CommunityClient';

export default async function CommunityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123') as any;
    } catch (e) {
      // Ignored
    }
  }

  return (
    <div className="py-20 px-container-margin-mobile md:px-container-margin-desktop min-h-screen cyber-grid relative">
      <div className="absolute inset-0 aurora-glow pointer-events-none opacity-40"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <CommunityClient currentUser={user} locale={locale} />
      </div>
    </div>
  );
}
