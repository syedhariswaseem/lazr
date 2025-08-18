import { NextRequest, NextResponse } from 'next/server';
import { sign as jwtSign, verify as jwtVerify, type JwtPayload, type SignOptions, type Secret } from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { prisma } from '@/lib/db';

// Environment helpers
function getEnv(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

const ACCESS_TOKEN_SECRET = () => getEnv('JWT_ACCESS_SECRET');
const REFRESH_TOKEN_SECRET = () => getEnv('JWT_REFRESH_SECRET');
const ACCESS_TOKEN_EXPIRES_IN = () => process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = () => process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export type JWTPayload = {
  sub: string; // userId
  email: string;
  role: Role;
  tokenVersion: number;
};

type TokenUser = {
  id: string;
  email: string;
  role: Role;
  tokenVersion?: number;
};

export function signAccessToken(user: TokenUser) {
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion ?? 0,
  };
  return jwtSign(payload, ACCESS_TOKEN_SECRET() as Secret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN() } as SignOptions);
}

export function signRefreshToken(user: TokenUser) {
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion ?? 0,
  };
  return jwtSign(payload, REFRESH_TOKEN_SECRET() as Secret, { expiresIn: REFRESH_TOKEN_EXPIRES_IN() } as SignOptions);
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwtVerify(token, ACCESS_TOKEN_SECRET() as Secret) as JwtPayload | string;
    if (typeof decoded === 'string') return null;
    return decoded as JWTPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const decoded = jwtVerify(token, REFRESH_TOKEN_SECRET() as Secret) as JwtPayload | string;
    if (typeof decoded === 'string') return null;
    return decoded as JWTPayload;
  } catch {
    return null;
  }
}

// Cookie helpers
const isProd = process.env.NODE_ENV === 'production';
export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';

export function attachAuthCookies(
  res: NextResponse,
  tokens: { accessToken: string; refreshToken: string }
) {
  res.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // 15 minutes
  });
  res.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set(ACCESS_COOKIE, '', { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, '', { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}

export async function getUserFromRequest(req: NextRequest) {
  const cookie = req.cookies.get(ACCESS_COOKIE);
  if (!cookie?.value) return null;
  const decoded = verifyAccessToken(cookie.value);
  if (!decoded) return null;
  const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
  if (!user) return null;
  const userTokenVersion = (user as unknown as { tokenVersion?: number }).tokenVersion ?? 0;
  if (userTokenVersion !== decoded.tokenVersion) return null;
  return user;
}

export async function rotateTokensForUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  const tokenVersion = (user as unknown as { tokenVersion?: number }).tokenVersion ?? 0;
  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role, tokenVersion });
  const refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role, tokenVersion });
  return { accessToken, refreshToken, user };
}

