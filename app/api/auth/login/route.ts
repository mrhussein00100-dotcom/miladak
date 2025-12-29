import { NextRequest, NextResponse } from 'next/server';
import { createHmac, randomBytes, pbkdf2Sync } from 'crypto';
import { query, execute } from '@/lib/db/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'admin_session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'miladak_secret_2025';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'Admin@2025!';

function toBoolean(value: unknown): boolean {
  return (
    value === true ||
    value === 1 ||
    value === '1' ||
    value === 'true' ||
    value === 't'
  );
}

function signToken(payload: Record<string, unknown>) {
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', AUTH_SECRET)
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${sig}`;
}

function hashPassword(password: string, salt?: string) {
  const s = salt || randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, s, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: s };
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'اسم المستخدم وكلمة المرور مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من وجود مستخدمين
    const countResult = await query<{ c: number }>(
      'SELECT COUNT(*) as c FROM admin_users'
    );
    const count = Number((countResult[0] as any)?.c ?? 0);

    // إنشاء المستخدم الافتراضي إذا لم يكن هناك مستخدمين
    if (count === 0) {
      const { hash, salt } = hashPassword(ADMIN_PASS);
      await execute(
        `INSERT INTO admin_users (username, password_hash, password_salt, role, active) VALUES (?, ?, ?, ?, ?)`,
        [ADMIN_USER, hash, salt, 'admin', true]
      );
    }

    // البحث عن المستخدم
    const users = await query<{
      id: number;
      username: string;
      password_hash: string;
      password_salt: string;
      role: string;
      active: unknown;
    }>('SELECT * FROM admin_users WHERE username = ?', [username]);

    const user = users[0];

    if (!user || !toBoolean(user.active)) {
      return NextResponse.json(
        { success: false, error: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      );
    }

    // التحقق من كلمة المرور
    const { hash } = hashPassword(password, user.password_salt);
    if (hash !== user.password_hash) {
      return NextResponse.json(
        { success: false, error: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      );
    }

    // إنشاء التوكن
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 ساعة
    const token = signToken({ sub: user.username, role: user.role, exp });

    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ غير متوقع';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
