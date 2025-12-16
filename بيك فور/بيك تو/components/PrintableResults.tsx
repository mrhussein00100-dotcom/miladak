'use client';

import { useRef } from 'react';
import { Printer, Download } from 'lucide-react';
import { AgeData, LifeStats } from '@/types';
import { formatArabicNumber } from '@/lib/formatArabic';

interface Props {
  ageData: AgeData;
  lifeStats?: LifeStats | null;
}

export default function PrintableResults({ ageData, lifeStats }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #667eea;
        }
        
        .header h1 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        
        .header .date {
          color: #666;
          font-size: 14px;
        }
        
        .section {
          margin-bottom: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 16px;
          border-right: 4px solid #667eea;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #333;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }
        
        .grid-2 {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .stat-box {
          background: white;
          padding: 15px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 800;
          color: #667eea;
        }
        
        .stat-label {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        
        .info-box {
          background: white;
          padding: 15px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .info-icon {
          font-size: 24px;
        }
        
        .info-content {
          flex: 1;
        }
        
        .info-label {
          font-size: 12px;
          color: #666;
        }
        
        .info-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        
        .birthday-box {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 25px;
          border-radius: 16px;
          text-align: center;
        }
        
        .birthday-days {
          font-size: 48px;
          font-weight: 800;
        }
        
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px dashed #ddd;
          color: #999;
          font-size: 12px;
        }
        
        .footer a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .container {
            box-shadow: none;
            padding: 20px;
          }
        }
      </style>
    `;

    const content = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>نتائج حساب العمر - ميلادك</title>
        ${styles}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎂 نتائج حساب عمرك 🎂</h1>
            <p class="date">تاريخ الطباعة: ${new Date().toLocaleDateString(
              'ar-SA'
            )}</p>
          </div>
          
          <div class="section">
            <div class="section-title">⏰ عمرك بالتفصيل</div>
            <div class="grid">
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  ageData.years
                )}</div>
                <div class="stat-label">سنة</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  ageData.months
                )}</div>
                <div class="stat-label">شهر</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  ageData.days
                )}</div>
                <div class="stat-label">يوم</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  ageData.weeks || 0
                )}</div>
                <div class="stat-label">أسبوع</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">✨ إجمالي عمرك</div>
            <div class="grid">
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  ageData.totalDays
                )}</div>
                <div class="stat-label">يوم</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  ageData.totalHours
                )}</div>
                <div class="stat-label">ساعة</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  ageData.totalMinutes
                )}</div>
                <div class="stat-label">دقيقة</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  ageData.totalSeconds
                )}</div>
                <div class="stat-label">ثانية</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">⭐ معلومات الميلاد</div>
            <div class="grid grid-2">
              <div class="info-box">
                <span class="info-icon">📆</span>
                <div class="info-content">
                  <div class="info-label">يوم الميلاد</div>
                  <div class="info-value">${ageData.dayOfWeek}</div>
                </div>
              </div>
              <div class="info-box">
                <span class="info-icon">🌙</span>
                <div class="info-content">
                  <div class="info-label">التاريخ الهجري</div>
                  <div class="info-value">${ageData.hijri.date}</div>
                </div>
              </div>
              <div class="info-box">
                <span class="info-icon">⭐</span>
                <div class="info-content">
                  <div class="info-label">البرج الغربي</div>
                  <div class="info-value">${ageData.zodiacSign}</div>
                </div>
              </div>
              <div class="info-box">
                <span class="info-icon">🐉</span>
                <div class="info-content">
                  <div class="info-label">البرج الصيني</div>
                  <div class="info-value">${ageData.chineseZodiac || '-'}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">🎁 عيد الميلاد القادم</div>
            <div class="birthday-box">
              <div class="birthday-days">${formatArabicNumber(
                ageData.nextBirthday.daysUntil
              )}</div>
              <div>يوم متبقي 🎂</div>
              <div style="margin-top: 10px; opacity: 0.9;">ستصبح ${formatArabicNumber(
                ageData.nextBirthday.age
              )} سنة 🎉</div>
            </div>
          </div>
          
          ${
            lifeStats
              ? `
          <div class="section">
            <div class="section-title">❤️ إحصاءات حياتك</div>
            <div class="grid">
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  lifeStats.heartbeats
                )}</div>
                <div class="stat-label">❤️ نبضة قلب</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  lifeStats.breaths
                )}</div>
                <div class="stat-label">💨 نفس</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  lifeStats.sleepDays
                )}</div>
                <div class="stat-label">😴 يوم نوم</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${formatArabicNumber(
                  lifeStats.meals
                )}</div>
                <div class="stat-label">🍽️ وجبة</div>
              </div>
            </div>
          </div>
          `
              : ''
          }
          
          <div class="footer">
            <p>تم إنشاء هذا التقرير من موقع <a href="https://miladak.com">ميلادك</a></p>
            <p>احسب عمرك الآن على miladak.com 🎂</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();

    // انتظر تحميل الخطوط ثم اطبع
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="flex gap-3 justify-center">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
      >
        <Printer className="w-5 h-5" />
        <span>طباعة النتائج</span>
      </button>
    </div>
  );
}
