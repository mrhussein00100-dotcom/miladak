import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'عن ميلادك',
  description: 'تعرف على موقع ميلادك - أفضل حاسبة عمر عربية مع مجموعة أدوات حسابية مجانية.',
  keywords: ['عن ميلادك', 'حاسبة العمر', 'أدوات حسابية'],
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          عن ميلادك
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          أفضل حاسبة عمر عربية مع مجموعة شاملة من الأدوات الحسابية المجانية
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>🎯 رؤيتنا</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              نسعى في ميلادك لتقديم أفضل تجربة حسابية للمستخدم العربي. نؤمن بأن الأدوات الحسابية
              يجب أن تكون سهلة الاستخدام ودقيقة ومتاحة للجميع مجاناً.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>✨ ما يميزنا</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <span>واجهة عربية بالكامل مع دعم RTL</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <span>حسابات دقيقة ومعتمدة على معادلات علمية</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <span>تصميم عصري وسهل الاستخدام</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <span>دعم التاريخ الهجري والميلادي</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <span>أكثر من 17 أداة حسابية مجانية</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <span>متوافق مع جميع الأجهزة</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>🛠️ أدواتنا</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">أدوات العمر</h4>
                <ul className="space-y-1 text-sm">
                  <li>• حاسبة العمر الدقيقة</li>
                  <li>• العمر بالثواني</li>
                  <li>• العد التنازلي لعيد الميلاد</li>
                  <li>• إحصاءات الحياة</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">أدوات الصحة</h4>
                <ul className="space-y-1 text-sm">
                  <li>• حاسبة BMI</li>
                  <li>• حاسبة السعرات الحرارية</li>
                  <li>• حاسبة نمو الطفل</li>
                  <li>• حاسبة الحمل</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">أدوات التواريخ</h4>
                <ul className="space-y-1 text-sm">
                  <li>• الأيام بين تاريخين</li>
                  <li>• يوم الأسبوع</li>
                  <li>• تحويل التاريخ الهجري</li>
                  <li>• حاسبة الأعياد</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">أدوات أخرى</h4>
                <ul className="space-y-1 text-sm">
                  <li>• حاسبة الأجيال</li>
                  <li>• حاسبة المناطق الزمنية</li>
                  <li>• مخطط الاحتفالات</li>
                  <li>• والمزيد...</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>📧 تواصل معنا</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              نرحب بملاحظاتكم واقتراحاتكم لتحسين الموقع. يمكنكم التواصل معنا عبر:
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-muted-foreground">
                📧 البريد الإلكتروني: contact@miladak.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
