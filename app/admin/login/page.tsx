'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, User, Loader } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'فشل تسجيل الدخول');
        return;
      }
      const next = searchParams?.get('next') ?? '/admin';
      router.replace(next);
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">تسجيل دخول الأدمن</h1>
            <p className="text-gray-400 text-sm">
              أدخل بيانات الدخول للوصول إلى لوحة التحكم
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/30 text-red-200 border border-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              اسم المستخدم
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus-within:border-purple-500">
              <User className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-100"
                placeholder="اسم المستخدم"
                autoComplete="username"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              كلمة المرور
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus-within:border-purple-500">
              <Lock className="w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-100"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                جاري الدخول...
              </>
            ) : (
              <>تسجيل الدخول</>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
          >
            العودة للموقع الرئيسي
          </a>
        </div>
      </div>
    </div>
  );
}
