import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let userId: number;
  try {
    userId = (jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123') as any).userId;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { id } = await params;
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: Number(id),
      OR: [{ buyerId: userId }, { sellerId: userId }]
    },
    include: {
      buyer: { select: { id: true, username: true } },
      seller: { select: { id: true, username: true } },
      product: true
    }
  });

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}
