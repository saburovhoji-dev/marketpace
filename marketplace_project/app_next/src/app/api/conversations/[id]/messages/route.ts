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
    where: { id: Number(id), OR: [{ buyerId: userId }, { sellerId: userId }] }
  });

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: Number(id) },
    include: {
      sender: { select: { id: true, username: true } }
    },
    orderBy: { createdAt: 'asc' }
  });

  return NextResponse.json({ messages });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    where: { id: Number(id), OR: [{ buyerId: userId }, { sellerId: userId }] }
  });

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const { content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: Number(id),
      senderId: userId,
      content: content.trim()
    },
    include: {
      sender: { select: { id: true, username: true } }
    }
  });

  await prisma.conversation.update({
    where: { id: Number(id) },
    data: { updatedAt: new Date() }
  });

  return NextResponse.json({ message });
}
