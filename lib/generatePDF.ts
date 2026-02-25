import { AgeData } from "@/types";
import { formatNumber, calculateLifeStats, getExtraFunStats, getFunComparisons, getAchievements, getBirthDayInterestingFacts } from "./ageCalculations";

export async function generatePDF(ageData: AgeData): Promise<void> {
  try {
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;
    const lifeStats = calculateLifeStats(ageData);
    const extraStats = getExtraFunStats(ageData);
    const comparisons = getFunComparisons(ageData);
    const achievements = getAchievements(ageData);
    const birthFacts = getBirthDayInterestingFacts(ageData);

    // Create a temporary div with the PDF content
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 800px;
      padding: 40px;
      background: #ffffff;
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      direction: rtl;
      color: #000;
    `;
    
    tempDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 12px;">
        <h1 style="font-size: 36px; margin: 0; font-weight: bold;">⭐ تقرير العمر التفصيلي</h1>
        <p style="font-size: 16px; margin: 10px 0 0 0; opacity: 0.95;">ميلادك - حاسبة العمر</p>
      </div>

      <div style="background: #f3f4f6; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
        <h2 style="font-size: 28px; margin: 0 0 15px 0; color: #1f2937;">عمرك الحالي</h2>
        <div style="font-size: 32px; font-weight: bold; color: #667eea; margin-bottom: 12px;">
          ${formatNumber(ageData.years)} سنة • ${formatNumber(ageData.months)} شهر • ${formatNumber(ageData.days)} يوم
        </div>
        <div style="font-size: 18px; color: #6b7280;">
          إجمالي الأيام: ${formatNumber(ageData.totalDays)} يوم
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
        <div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 10px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">📅</div>
          <div style="font-size: 14px; color: #6b7280; margin-bottom: 6px;">يوم ميلادك</div>
          <div style="font-size: 18px; font-weight: bold;">${ageData.dayOfWeek}</div>
        </div>
        <div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 10px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">🎂</div>
          <div style="font-size: 14px; color: #6b7280; margin-bottom: 6px;">للعيد القادم</div>
          <div style="font-size: 18px; font-weight: bold;">${formatNumber(ageData.nextBirthday.daysUntil)} يوماً</div>
        </div>
        <div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 10px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">⭐</div>
          <div style="font-size: 14px; color: #6b7280; margin-bottom: 6px;">برجك</div>
          <div style="font-size: 18px; font-weight: bold;">${ageData.zodiacSign}</div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 24px; margin-bottom: 20px; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          📊 إحصاءات حياتك
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">❤️ نبضات القلب</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(lifeStats.heartbeats)}</div>
          </div>
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">💨 الأنفاس</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(lifeStats.breaths)}</div>
          </div>
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">😴 أيام النوم</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(lifeStats.sleepDays)} يوم</div>
          </div>
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">🍕 الطعام المستهلك</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(lifeStats.foodKg)} كجم</div>
          </div>
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">👣 الخطوات</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(lifeStats.stepsWalked)}</div>
          </div>
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">💧 الماء المستهلك</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(lifeStats.waterLiters)} لتر</div>
          </div>
        </div>
      </div>

      ${achievements.length > 0 ? `
      <div style="margin-bottom: 25px; page-break-before: always; padding-top: 20px;">
        <h3 style="font-size: 24px; margin-bottom: 20px; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          🏆 إنجازاتك وأوسمتك
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          ${achievements.map(ach => `
            <div style="padding: 15px; background: linear-gradient(135deg, ${ach.color}); border-radius: 8px; text-align: center; color: white;">
              <div style="font-size: 32px; margin-bottom: 8px;">${ach.icon}</div>
              <div style="font-size: 18px; font-weight: bold;">${ach.title}</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div style="margin-bottom: 25px; page-break-before: always; padding-top: 20px;">
        <h3 style="font-size: 24px; margin-bottom: 20px; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          ✨ إحصاءات إضافية ممتعة
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">👀 عدد مرات الغمز</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(extraStats.blinks)}</div>
          </div>
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">😄 عدد مرات الضحك</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(extraStats.laughs)}</div>
          </div>
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">🍽️ عدد الوجبات</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(extraStats.meals)}</div>
          </div>
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">🌐 ساعات الإنترنت</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(extraStats.internetHours)}</div>
          </div>
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">📸 الصور الملتقطة</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(extraStats.photosTaken)}</div>
          </div>
          <div style="padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; color: #6b7280;">😴 الأحلام</div>
            <div style="font-size: 20px; font-weight: bold;">${formatNumber(extraStats.dreams)}</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 25px; page-break-before: always; padding-top: 20px;">
        <h3 style="font-size: 24px; margin-bottom: 20px; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          🌟 حقائق مثيرة عن يوم ميلادك
        </h3>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <div style="margin-bottom: 12px;">
            <span style="font-weight: bold; color: #667eea;">🐉 البرج الصيني:</span> ${birthFacts.chineseZodiac}
          </div>
          <div style="margin-bottom: 12px;">
            <span style="font-weight: bold; color: #667eea;">🌸 الفصل:</span> ${birthFacts.season}
          </div>
          <div style="margin-bottom: 12px;">
            <span style="font-weight: bold; color: #667eea;">💎 حجر الميلاد:</span> ${birthFacts.birthstone}
          </div>
          <div style="margin-bottom: 12px;">
            <span style="font-weight: bold; color: #667eea;">🌺 زهرة الميلاد:</span> ${birthFacts.birthFlower}
          </div>
          <div style="margin-bottom: 12px;">
            <span style="font-weight: bold; color: #667eea;">🎨 اللون المحظوظ:</span> ${birthFacts.luckyColor}
          </div>
          <div>
            <span style="font-weight: bold; color: #667eea;">🔢 الرقم المحظوظ:</span> ${birthFacts.luckyNumber}
          </div>
        </div>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 13px; color: #9ca3af;">
        تم إنشاء هذا التقرير بواسطة ميلادك - حاسبة العمر | ${new Date().toLocaleDateString('ar-SA')}
      </div>
    `;

    document.body.appendChild(tempDiv);

    // Wait a moment for rendering
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture as image
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Remove temp div
    document.body.removeChild(tempDiv);

    // Create PDF with multiple pages
    const imgData = canvas.toDataURL('image/png');
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate how many pages we need
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add remaining pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save PDF
    pdf.save(`miladak-report-${Date.now()}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF', error);
    throw error;
  }
}
