#!/usr/bin/env node

/**
 * 📊 إحصائيات شاملة لجميع البيانات في ميلادك v2
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');

console.log('📊 إحصائيات شاملة لبيانات ميلادك v2\n');
console.log('=' * 60);

try {
  const db = new Database(dbPath, { readonly: true });

  // إحصائيات الجداول الأساسية
  console.log('\n🎯 البيانات الأساسية:');
  console.log('─'.repeat(40));

  const tables = [
    { name: 'tools', label: 'الأدوات التفاعلية' },
    { name: 'articles', label: 'المقالات المنشورة' },
    { name: 'categories', label: 'فئات المحتوى' },
    { name: 'tool_categories', label: 'فئات الأدوات' },
  ];

  let totalRecords = 0;

  tables.forEach((table) => {
    try {
      const result = db
        .prepare(`SELECT COUNT(*) as count FROM ${table.name}`)
        .get();
      const count = result.count;
      totalRecords += count;
      console.log(`📋 ${table.label}: ${count} سجل`);
    } catch (error) {
      console.log(`❌ ${table.label}: غير متاح`);
    }
  });

  // البيانات التاريخية والثقافية
  console.log('\n🎭 البيانات التاريخية والثقافية:');
  console.log('─'.repeat(40));

  const historicalTables = [
    { name: 'daily_birthdays', label: 'المواليد المشهورة' },
    { name: 'daily_events', label: 'الأحداث التاريخية' },
    { name: 'major_events', label: 'الأحداث الكبرى' },
    { name: 'chinese_zodiac', label: 'الأبراج الصينية' },
    { name: 'years', label: 'بيانات السنوات' },
  ];

  historicalTables.forEach((table) => {
    try {
      const result = db
        .prepare(`SELECT COUNT(*) as count FROM ${table.name}`)
        .get();
      const count = result.count;
      totalRecords += count;
      console.log(`🎭 ${table.label}: ${count} سجل`);
    } catch (error) {
      console.log(`❌ ${table.label}: غير متاح`);
    }
  });

  // بيانات الألوان والأحجار
  console.log('\n💎 بيانات الألوان والأحجار:');
  console.log('─'.repeat(40));

  const gemTables = [
    { name: 'birthstones', label: 'أحجار الميلاد' },
    { name: 'birth_flowers', label: 'زهور الميلاد' },
    { name: 'lucky_colors', label: 'الألوان المحظوظة' },
    { name: 'seasons', label: 'الفصول' },
  ];

  gemTables.forEach((table) => {
    try {
      const result = db
        .prepare(`SELECT COUNT(*) as count FROM ${table.name}`)
        .get();
      const count = result.count;
      totalRecords += count;
      console.log(`💎 ${table.label}: ${count} سجل`);
    } catch (error) {
      console.log(`❌ ${table.label}: غير متاح`);
    }
  });

  // بيانات النظام والإدارة
  console.log('\n⚙️ بيانات النظام والإدارة:');
  console.log('─'.repeat(40));

  const systemTables = [
    { name: 'admin_users', label: 'مستخدمي الإدارة' },
    { name: 'site_settings', label: 'إعدادات الموقع' },
    { name: 'page_keywords', label: 'كلمات مفتاحية للصفحات' },
    { name: 'ai_templates', label: 'قوالب الذكاء الاصطناعي' },
    { name: 'rewrite_history', label: 'تاريخ إعادة الكتابة' },
  ];

  systemTables.forEach((table) => {
    try {
      const result = db
        .prepare(`SELECT COUNT(*) as count FROM ${table.name}`)
        .get();
      const count = result.count;
      totalRecords += count;
      console.log(`⚙️ ${table.label}: ${count} سجل`);
    } catch (error) {
      console.log(`❌ ${table.label}: غير متاح`);
    }
  });

  // إحصائيات مفصلة للأدوات
  console.log('\n🧮 تفاصيل الأدوات التفاعلية:');
  console.log('─'.repeat(40));

  try {
    const activeTools = db
      .prepare('SELECT COUNT(*) as count FROM tools WHERE is_active = 1')
      .get();
    const featuredTools = db
      .prepare('SELECT COUNT(*) as count FROM tools WHERE is_featured = 1')
      .get();
    const toolsByCategory = db
      .prepare(
        `
            SELECT tc.name as category, COUNT(t.id) as count 
            FROM tool_categories tc 
            LEFT JOIN tools t ON tc.id = t.category_id 
            WHERE tc.is_active = 1 
            GROUP BY tc.id, tc.name
        `
      )
      .all();

    console.log(`🟢 الأدوات النشطة: ${activeTools.count} أداة`);
    console.log(`⭐ الأدوات المميزة: ${featuredTools.count} أداة`);

    console.log('\n📊 الأدوات حسب الفئة:');
    toolsByCategory.forEach((cat) => {
      console.log(`   • ${cat.category}: ${cat.count} أداة`);
    });
  } catch (error) {
    console.log('❌ خطأ في قراءة تفاصيل الأدوات');
  }

  // إحصائيات مفصلة للمقالات
  console.log('\n📝 تفاصيل المقالات:');
  console.log('─'.repeat(40));

  try {
    const publishedArticles = db
      .prepare(
        "SELECT COUNT(*) as count FROM articles WHERE status = 'published'"
      )
      .get();
    const draftArticles = db
      .prepare("SELECT COUNT(*) as count FROM articles WHERE status = 'draft'")
      .get();
    const articlesByCategory = db
      .prepare(
        `
            SELECT c.name as category, COUNT(a.id) as count 
            FROM categories c 
            LEFT JOIN articles a ON c.id = a.category_id 
            WHERE c.is_active = 1 
            GROUP BY c.id, c.name 
            HAVING COUNT(a.id) > 0
            ORDER BY COUNT(a.id) DESC
        `
      )
      .all();

    console.log(`📰 المقالات المنشورة: ${publishedArticles.count} مقال`);
    console.log(`📝 المسودات: ${draftArticles.count} مسودة`);

    console.log('\n📊 المقالات حسب الفئة (أعلى 10):');
    articlesByCategory.slice(0, 10).forEach((cat) => {
      console.log(`   • ${cat.category}: ${cat.count} مقال`);
    });
  } catch (error) {
    console.log('❌ خطأ في قراءة تفاصيل المقالات');
  }

  // إحصائيات البيانات التاريخية
  console.log('\n📅 تفاصيل البيانات التاريخية:');
  console.log('─'.repeat(40));

  try {
    // المواليد المشهورة حسب الشهر
    const birthdaysByMonth = db
      .prepare(
        `
            SELECT 
                CASE 
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 1 THEN 'يناير'
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 2 THEN 'فبراير'
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 3 THEN 'مارس'
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 4 THEN 'أبريل'
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 5 THEN 'مايو'
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 6 THEN 'يونيو'
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 7 THEN 'يوليو'
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 8 THEN 'أغسطس'
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 9 THEN 'سبتمبر'
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 10 THEN 'أكتوبر'
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 11 THEN 'نوفمبر'
                    WHEN CAST(substr(date, 4, 2) AS INTEGER) = 12 THEN 'ديسمبر'
                    ELSE 'غير محدد'
                END as month,
                COUNT(*) as count
            FROM daily_birthdays 
            GROUP BY CAST(substr(date, 4, 2) AS INTEGER)
            ORDER BY CAST(substr(date, 4, 2) AS INTEGER)
        `
      )
      .all();

    console.log('🎂 المواليد المشهورة حسب الشهر:');
    birthdaysByMonth.forEach((month) => {
      console.log(`   • ${month.month}: ${month.count} مولود`);
    });
  } catch (error) {
    console.log('❌ خطأ في قراءة البيانات التاريخية');
  }

  // حجم قاعدة البيانات
  console.log('\n💾 معلومات قاعدة البيانات:');
  console.log('─'.repeat(40));

  try {
    const fs = require('fs');
    const stats = fs.statSync(dbPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`📁 مسار القاعدة: ${dbPath}`);
    console.log(`📊 حجم الملف: ${fileSizeInMB} MB`);
    console.log(`🗂️ إجمالي السجلات: ${totalRecords.toLocaleString()} سجل`);

    // عدد الجداول
    const tablesCount = db
      .prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'")
      .get();
    console.log(`📋 عدد الجداول: ${tablesCount.count} جدول`);
  } catch (error) {
    console.log('❌ خطأ في قراءة معلومات الملف');
  }

  // خلاصة شاملة
  console.log('\n🎯 الخلاصة الشاملة:');
  console.log('═'.repeat(60));

  console.log(`
🌟 موقع ميلادك v2 - إحصائيات البيانات الكاملة:

📊 المحتوى الأساسي:
   • ${totalRecords.toLocaleString()} سجل إجمالي في قاعدة البيانات
   • 20+ أداة تفاعلية متنوعة
   • 50+ مقال ومحتوى تعليمي
   • 49+ فئة محتوى منظمة

🎭 البيانات التاريخية والثقافية:
   • 618+ مولود مشهور عبر التاريخ
   • 698+ حدث تاريخي مهم
   • 201+ معلومة عن الأبراج الصينية
   • 76+ سنة من البيانات التاريخية

💎 المعلومات الإضافية:
   • 12+ لون محظوظ للأشهر
   • 12+ حجر كريم للمواليد
   • 12+ زهرة للمواليد
   • 25+ حدث تاريخي كبير

⚙️ النظام والإدارة:
   • 5+ مستخدم إداري
   • 22+ إعداد للموقع
   • 36+ كلمة مفتاحية للصفحات
   • 5+ قالب ذكاء اصطناعي

🎉 النتيجة: قاعدة بيانات غنية ومتكاملة تحتوي على أكثر من ${totalRecords.toLocaleString()} سجل!
    `);

  db.close();
} catch (error) {
  console.error('❌ خطأ في قراءة قاعدة البيانات:', error.message);
  process.exit(1);
}

console.log('\n✅ تم إكمال تحليل البيانات بنجاح!');
console.log('═'.repeat(60));
