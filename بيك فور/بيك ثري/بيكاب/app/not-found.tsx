import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-8xl font-bold gradient-text">404</div>
        <h1 className="text-3xl font-bold">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground max-w-md">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button>العودة للرئيسية</Button>
          </Link>
          <Link href="/tools">
            <Button variant="outline">تصفح الأدوات</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
