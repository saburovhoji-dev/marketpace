import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123');
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { seller: true }
      });

      if (!product) throw new Error('Product not found');

      const buyer = await tx.user.findUnique({
        where: { id: userId }
      });

      if (!buyer) throw new Error('Buyer not found');
      if (buyer.balance < product.price) throw new Error('Insufficient balance');

      // Deduct balance from buyer
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: product.price } }
      });

      // Add balance to seller
      await tx.user.update({
        where: { id: product.sellerId },
        data: { balance: { increment: product.price } }
      });

      // Create order
      const order = await tx.order.create({
        data: {
          buyerId: userId,
          productId: product.id,
          status: 'completed'
        }
      });

      // Increment sales count
      await tx.product.update({
        where: { id: product.id },
        data: { salesCount: { increment: 1 } }
      });

      // Create notifications
      await tx.notification.createMany({
        data: [
          {
            userId: userId,
            type: 'purchase_bought',
            title: 'Покупка совершена',
            body: `Вы купили "${product.title_ru || product.title_en}" за $${product.price}`,
            link: `/profile`,
            createdAt: new Date()
          },
          {
            userId: product.sellerId,
            type: 'purchase_sold',
            title: 'Товар продан',
            body: `Ваш товар "${product.title_ru || product.title_en}" куплен за $${product.price}`,
            link: `/profile`,
            createdAt: new Date()
          }
        ]
      });

      return order;
    });

    return NextResponse.json({ message: 'Purchase successful', order: result });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 400 });
  }
}
