import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123') as any;
    return NextResponse.json({ user: { id: decoded.userId, username: decoded.username, email: decoded.email } });
  } catch {
    return NextResponse.json({ user: null });
  }
}
