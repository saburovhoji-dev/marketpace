import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getUserId(): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123') as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

  return NextResponse.json({ conversations });
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sellerId, productId } = await req.json();
  if (!sellerId) return NextResponse.json({ error: 'sellerId is required' }, { status: 400 });

  const buyerId = Math.min(userId, sellerId);
  const orderedSellerId = Math.max(userId, sellerId);

  let conversation = await prisma.conversation.findFirst({
    where: { buyerId, sellerId: orderedSellerId, productId: productId || null }
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { buyerId, sellerId: orderedSellerId, productId: productId || null }
    });
  }

  return NextResponse.json({ conversation });
}
