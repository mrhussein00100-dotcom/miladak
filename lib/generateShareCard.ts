import { AgeData } from "@/types";
import { formatNumber } from "./ageCalculations";

export function generateShareCardCanvas(ageData: AgeData): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Modern gradient background with multiple colors
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(0.5, '#764ba2');
      gradient.addColorStop(1, '#f093fb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add decorative circles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(100, 100, 150, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(1100, 500, 200, 0, Math.PI * 2);
      ctx.fill();

      // Set font - using better looking fonts
      ctx.textAlign = 'right';
      ctx.direction = 'rtl';

      // Header badge with better styling
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(1030, 40, 220, 60, 30);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Segoe UI, Tahoma, sans-serif';
      ctx.fillText('⭐ ميلادك', 1130, 78);

      // Main title with better font
      ctx.font = 'bold 52px Segoe UI, Tahoma, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('عمرك الآن', 1130, 170);

      // Age info with better styling
      ctx.font = 'bold 64px Segoe UI, Tahoma, sans-serif';
      const ageText = `${formatNumber(ageData.years)} سنة • ${formatNumber(ageData.months)} شهر • ${formatNumber(ageData.days)} يوم`;
      ctx.fillStyle = '#fef3c7';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 5;
      ctx.fillText(ageText, 1130, 260);
      ctx.shadowBlur = 0;

      // Info boxes
      const boxes = [
        { emoji: '📅', label: 'يوم ميلادك', value: ageData.dayOfWeek, x: 950 },
        { emoji: '🎂', label: 'المتبقي للعيد', value: `${formatNumber(ageData.nextBirthday.daysUntil)} يوماً`, x: 600 },
        { emoji: '⭐', label: 'برجك', value: ageData.zodiacSign, x: 250 },
      ];

      boxes.forEach((box, index) => {
        // Box background with gradient
        const boxGradient = ctx.createLinearGradient(box.x - 280, 320, box.x, 440);
        boxGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        boxGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        ctx.fillStyle = boxGradient;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(box.x - 280, 320, 280, 120, 20);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Emoji with larger size
        ctx.font = '44px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'right';
        ctx.fillText(box.emoji, box.x - 15, 375);

        // Label with better font
        ctx.font = '20px Segoe UI, Tahoma, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(box.label, box.x - 75, 370);

        // Value with better font
        ctx.font = 'bold 24px Segoe UI, Tahoma, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(box.value, box.x - 75, 408);
      });

      // Total days section with background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(30, 490, 280, 120, 20);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = '22px Segoe UI, Tahoma, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('إجمالي الأيام', 50, 530);
      
      ctx.font = 'bold 72px Segoe UI, Tahoma, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 5;
      ctx.fillText(formatNumber(ageData.totalDays), 50, 590);
      ctx.shadowBlur = 0;

      // Convert to image
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
  });
}
