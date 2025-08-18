import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { attachAuthCookies, signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, password: hashed },
    });

    const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role });

    const res = NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role }, { status: 201 });
    attachAuthCookies(res, { accessToken, refreshToken });
    return res;
  } catch (err) {
    console.error('Register error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

