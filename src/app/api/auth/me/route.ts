import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, verifyRefreshToken, attachAuthCookies, signAccessToken, signRefreshToken, REFRESH_COOKIE } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Try with current access token first
    const existingUser = await getUserFromRequest(req);
    if (existingUser) {
      return NextResponse.json({ user: { id: existingUser.id, email: existingUser.email, name: existingUser.name, role: existingUser.role } });
    }

    // Attempt silent refresh using refresh token cookie
    const refreshCookie = req.cookies.get(REFRESH_COOKIE);
    const token = refreshCookie?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const decoded = verifyRefreshToken(token);
    if (!decoded) return NextResponse.json({ user: null }, { status: 200 });

    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) return NextResponse.json({ user: null }, { status: 200 });

    // Issue fresh tokens and return user
    const shape = { id: user.id, email: user.email, role: user.role } as const;
    const accessToken = signAccessToken(shape);
    const refreshToken = signRefreshToken(shape);

    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    attachAuthCookies(res, { accessToken, refreshToken });
    return res;
  } catch (e) {
    console.error('ME endpoint error', e);
    // Degrade to logged-out for resilience
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

