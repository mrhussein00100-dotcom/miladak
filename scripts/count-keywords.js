const fs = require('fs');
const path = require('path');

// Read all keyword files
const keywordFiles = [
  'lib/keywords/toolsKeywords.ts',
  'lib/keywords/ageKeywords.ts',
  'lib/keywords/bmiKeywords.ts',
  'lib/keywords/calorieKeywords.ts',
  'lib/keywords/birthdayCountdownKeywords.ts',
  'lib/keywords/datesKeywords.ts',
  'lib/keywords/pregnancyKeywords.ts',
];

let totalKeywords = 0;
const keywordsByFile = {};

console.log('📊 إحصائيات الكلمات المفتاحية في ملفات lib/keywords:\n');

keywordFiles.forEach((filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');

      // Count keywords in arrays (look for strings in quotes)
      const matches = content.match(/'[^']+'/g) || [];
      const keywords = matches.filter((match) => {
        const keyword = match.slice(1, -1); // Remove quotes
        return (
          keyword.length > 2 &&
          !keyword.includes('export') &&
          !keyword.includes('const')
        );
      });

      const fileName = path.basename(filePath, '.ts');
      keywordsByFile[fileName] = keywords.length;
      totalKeywords += keywords.length;

      console.log(`📁 ${fileName}: ${keywords.length} كلمة`);
    }
  } catch (error) {
    console.log(`❌ خطأ في قراءة ${filePath}: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`🎯 إجمالي الكلمات المفتاحية: ${totalKeywords} كلمة`);
console.log('='.repeat(50));

// Show breakdown
console.log('\n📋 التفصيل:');
Object.entries(keywordsByFile).forEach(([file, count]) => {
  const percentage = ((count / totalKeywords) * 100).toFixed(1);
  console.log(`   ${file}: ${count} كلمة (${percentage}%)`);
});
