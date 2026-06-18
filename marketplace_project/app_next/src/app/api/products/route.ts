import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        seller: { select: { username: true } },
        category: true
      }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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

    const sellerId = decoded.userId;
    const body = await req.json();
    const {
      categoryId,
      price,
      title_ru,
      title_uz,
      title_en,
      desc_ru,
      desc_uz,
      desc_en,
      imageUrl,
      type
    } = body;

    if (!categoryId || !price || !title_ru || !title_uz || !title_en || !desc_ru || !desc_uz || !desc_en) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        sellerId,
        categoryId: Number(categoryId),
        price: parseFloat(price),
        title_ru,
        title_uz,
        title_en,
        desc_ru,
        desc_uz,
        desc_en,
        imageUrl: imageUrl || null,
        type: type || 'product'
      }
    });

    return NextResponse.json({ message: 'Product created successfully', product });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

