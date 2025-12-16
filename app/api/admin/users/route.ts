import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db/database';
import { createHmac, randomBytes, pbkdf2Sync } from 'crypto';

const SESSION_COOKIE = 'admin_session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'miladak_secret_2025';

function verifySession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const [payloadB64, sigB64] = token.split('.');
    const expectedSig = createHmac('sha256', AUTH_SECRET)
      .update(payloadB64)
      .digest('base64url');
    if (sigB64 !== expectedSig) return null;
    const payload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf8')
    );
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000))
      return null;
    return payload;
  } catch {
    return null;
  }
}

function hashPassword(password: string, salt?: string) {
  const s = salt || randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, s, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: s };
}

export async function GET(request: NextRequest) {
  const session = verifySession(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const users = query<{
      id: number;
      username: string;
      role: string;
      active: number;
      created_at: string;
      updated_at: string;
    }>(
      'SELECT id, username, role, active, created_at, updated_at FROM admin_users ORDER BY created_at DESC'
    );

    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = verifySession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { username, password, role } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'اسم المستخدم وكلمة المرور مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود المستخدم
    const existing = query<{ id: number }>(
      'SELECT id FROM admin_users WHERE username = ?',
      [username]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'اسم المستخدم موجود مسبقاً' },
        { status: 409 }
      );
    }

    const { hash, salt } = hashPassword(password);
    const result = execute(
      `INSERT INTO admin_users (username, password_hash, password_salt, role, active) VALUES (?, ?, ?, ?, ?)`,
      [username, hash, salt, role || 'editor', 1]
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ غير متوقع';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
