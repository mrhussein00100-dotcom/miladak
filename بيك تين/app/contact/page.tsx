import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'اتصل بنا',
  description: 'تواصل مع فريق ميلادك لأي استفسارات أو اقتراحات.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          اتصل بنا
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          نحن هنا لمساعدتك! تواصل معنا لأي استفسارات أو اقتراحات
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>📧 البريد الإلكتروني</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              للاستفسارات العامة والدعم التقني
            </p>
            <a 
              href="mailto:contact@miladak.com"
              className="text-primary hover:underline font-semibold"
            >
              contact@miladak.com
            </a>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>💡 الاقتراحات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              لديك فكرة لأداة جديدة أو تحسين؟
            </p>
            <a 
              href="mailto:suggestions@miladak.com"
              className="text-primary hover:underline font-semibold"
            >
              suggestions@miladak.com
            </a>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>🐛 الإبلاغ عن مشاكل</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              وجدت خطأ أو مشكلة في الموقع؟
            </p>
            <a 
              href="mailto:bugs@miladak.com"
              className="text-primary hover:underline font-semibold"
            >
              bugs@miladak.com
            </a>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>⏰ أوقات الرد</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              نسعى للرد على جميع الرسائل خلال 24-48 ساعة.
              شكراً لصبرك!
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="max-w-2xl mx-auto mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">الأسئلة الشائعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">هل الموقع مجاني؟</h3>
              <p className="text-muted-foreground">نعم، جميع أدوات ميلادك مجانية تماماً.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">هل تحتفظون ببياناتي؟</h3>
              <p className="text-muted-foreground">لا، جميع الحسابات تتم محلياً في متصفحك ولا نحتفظ بأي بيانات شخصية.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">كيف يمكنني اقتراح أداة جديدة؟</h3>
              <p className="text-muted-foreground">راسلنا على suggestions@miladak.com مع وصف الأداة المقترحة.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
