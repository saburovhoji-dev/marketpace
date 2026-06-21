import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getUserId(): Promise<number | null> {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return null;
    return (jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123') as any).userId;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    }),
    prisma.notification.count({
      where: { userId, read: false }
    })
  ]);

  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { notificationId } = await req.json();
  if (!notificationId) return NextResponse.json({ error: 'notificationId required' }, { status: 400 });

  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true }
  });

  return NextResponse.json({ success: true });
}

export async function PUT() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true }
  });

  return NextResponse.json({ success: true });
}
