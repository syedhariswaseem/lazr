import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies, getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (user) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { tokenVersion: user.tokenVersion + 1 },
      });
    } catch (e) {
      console.error('Failed to bump tokenVersion on logout', e);
    }
  }
  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}

