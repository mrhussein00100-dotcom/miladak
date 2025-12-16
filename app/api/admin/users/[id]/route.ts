import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db/database';
import { createHmac, pbkdf2Sync, randomBytes } from 'crypto';

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

// GET - الحصول على مستخدم واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = verifySession(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const users = query<{
      id: number;
      username: string;
      role: string;
      active: number;
      created_at: string;
      updated_at: string;
    }>(
      'SELECT id, username, role, active, created_at, updated_at FROM admin_users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: users[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}

// PUT - تحديث مستخدم
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = verifySession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { username, password, role, active } = body;

    // التحقق من وجود المستخدم
    const existing = query<{ id: number }>(
      'SELECT id FROM admin_users WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // بناء استعلام التحديث
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (username !== undefined) {
      // التحقق من عدم تكرار اسم المستخدم
      const duplicate = query<{ id: number }>(
        'SELECT id FROM admin_users WHERE username = ? AND id != ?',
        [username, id]
      );
      if (duplicate.length > 0) {
        return NextResponse.json(
          { success: false, error: 'اسم المستخدم موجود مسبقاً' },
          { status: 409 }
        );
      }
      updates.push('username = ?');
      values.push(username);
    }

    if (password !== undefined && password.trim() !== '') {
      const { hash, salt } = hashPassword(password);
      updates.push('password_hash = ?');
      values.push(hash);
      updates.push('password_salt = ?');
      values.push(salt);
    }

    if (role !== undefined) {
      const validRoles = [
        'admin',
        'content_manager',
        'editor',
        'writer',
        'support',
      ];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { success: false, error: 'دور غير صالح' },
          { status: 400 }
        );
      }
      updates.push('role = ?');
      values.push(role);
    }

    if (active !== undefined) {
      updates.push('active = ?');
      values.push(active ? 1 : 0);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'لا توجد بيانات للتحديث' },
        { status: 400 }
      );
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    execute(
      `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true, message: 'تم التحديث بنجاح' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ غير متوقع';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE - حذف مستخدم
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = verifySession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    // التحقق من وجود المستخدم
    const existing = query<{ id: number; username: string }>(
      'SELECT id, username FROM admin_users WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // منع حذف المستخدم الحالي
    if (existing[0].username === session.username) {
      return NextResponse.json(
        { success: false, error: 'لا يمكنك حذف حسابك الخاص' },
        { status: 400 }
      );
    }

    execute('DELETE FROM admin_users WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ غير متوقع';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
