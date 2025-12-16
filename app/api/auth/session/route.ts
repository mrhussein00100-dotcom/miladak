import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    return payload as { sub: string; role: string; exp: number };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const session = verifySession(request);
  if (!session) return NextResponse.json({ authenticated: false });
  return NextResponse.json({
    authenticated: true,
    username: session.sub,
    role: session.role,
  });
}
