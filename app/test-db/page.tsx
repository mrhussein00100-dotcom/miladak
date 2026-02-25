
import { query } from '@/lib/db/database';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'فحص قاعدة البيانات',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TestDBPage() {
  let status = 'Checking...';
  let details = '';
  let dbType = process.env.POSTGRES_URL ? 'PostgreSQL' : 'SQLite (Fallback)';
  
  try {
    // محاولة استعلام بسيط
    const result = await query('SELECT 1 as val');
    status = 'Connected ✅';
    details = JSON.stringify(result, null, 2);
  } catch (e: any) {
    status = 'Failed ❌';
    details = e.message;
  }

  return (
    <div className="container mx-auto p-8 font-sans" dir="ltr">
      <h1 className="text-3xl font-bold mb-6">Database Diagnostic</h1>
      
      <div className="grid gap-6">
        <div className="p-6 bg-gray-100 rounded-xl border border-gray-200">
          <h2 className="font-bold mb-2">Connection Status</h2>
          <div className={`text-xl font-mono ${status.includes('Connected') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </div>
        </div>

        <div className="p-6 bg-gray-100 rounded-xl border border-gray-200">
          <h2 className="font-bold mb-2">Configuration</h2>
          <ul className="list-disc list-inside space-y-1 text-sm font-mono">
            <li>NODE_ENV: {process.env.NODE_ENV}</li>
            <li>VERCEL: {process.env.VERCEL ? 'Yes' : 'No'}</li>
            <li>DB Type: {dbType}</li>
            <li>POSTGRES_URL Present: {process.env.POSTGRES_URL ? 'Yes' : 'No'}</li>
            <li>DATABASE_URL Present: {process.env.DATABASE_URL ? 'Yes' : 'No'}</li>
          </ul>
        </div>

        <div className="p-6 bg-gray-100 rounded-xl border border-gray-200">
          <h2 className="font-bold mb-2">Query Result / Error</h2>
          <pre className="bg-black text-white p-4 rounded-lg overflow-auto text-xs">
            {details}
          </pre>
        </div>
      </div>
    </div>
  );
}
