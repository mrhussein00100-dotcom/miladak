import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شروط الاستخدام',
  description: 'شروط وأحكام استخدام موقع ميلادك - حاسبة العمر العربية.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
          شروط الاستخدام
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </p>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">مقدمة</h2>
            <p>
              مرحباً بك في موقع ميلادك. باستخدامك لهذا الموقع، فإنك توافق على الالتزام
              بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">استخدام الموقع</h2>
            <p>
              موقع ميلادك مخصص لتقديم خدمات حساب العمر والأدوات الحسابية المجانية.
              يمكنك استخدام الموقع للأغراض الشخصية والتعليمية.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>يُسمح بالاستخدام الشخصي والتعليمي</li>
              <li>لا يُسمح بالاستخدام التجاري دون إذن</li>
              <li>لا يُسمح بنسخ أو توزيع المحتوى دون إذن</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">دقة المعلومات</h2>
            <p>
              نسعى لتقديم حسابات دقيقة، لكننا لا نضمن دقة جميع النتائج بنسبة 100%.
              النتائج المقدمة هي للأغراض الإعلامية فقط.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">المسؤولية</h2>
            <p>لا نتحمل أي مسؤولية عن:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>أي أضرار ناتجة عن استخدام الموقع</li>
              <li>انقطاع الخدمة أو الأخطاء التقنية</li>
              <li>فقدان البيانات أو المعلومات</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">الملكية الفكرية</h2>
            <p>
              جميع المحتويات والتصاميم والأكواد في هذا الموقع محمية بحقوق الطبع والنشر.
              لا يُسمح بنسخها أو استخدامها دون إذن مكتوب.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">التعديلات</h2>
            <p>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات
              عن طريق نشر الشروط المحدثة على هذه الصفحة.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">اتصل بنا</h2>
            <p>
              إذا كان لديك أي أسئلة حول شروط الاستخدام، يرجى التواصل معنا على:
              contact@miladak.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
