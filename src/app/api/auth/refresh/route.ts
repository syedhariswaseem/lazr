import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyRefreshToken, signAccessToken, signRefreshToken, attachAuthCookies } from '@/lib/auth';

const REFRESH_COOKIE = 'refresh_token';

export async function POST(req: NextRequest) {
  try {
    const refreshCookie = req.cookies.get(REFRESH_COOKIE);
    const token = refreshCookie?.value;
    if (!token) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Issue new tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const res = NextResponse.json({ ok: true });
    attachAuthCookies(res, { accessToken, refreshToken });
    return res;
  } catch (err) {
    console.error('Refresh error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

