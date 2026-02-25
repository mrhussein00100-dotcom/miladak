// Migration Script: إضافة حقول SEO إلى جدول articles
import Database from 'better-sqlite3';
import path from 'path';

const dbPath =
  process.env.DATABASE_URL || path.join(process.cwd(), 'database.sqlite');

export function addSEOFields() {
  const db = new Database(dbPath);

  try {
    console.log('🔄 بدء Migration: إضافة حقول SEO...');

    // التحقق من وجود العمود أولاً
    const tableInfo: any = db.prepare('PRAGMA table_info(articles)').all();
    const columnNames = tableInfo.map((col: any) => col.name);

    // إضافة الأعمدة إذا لم تكن موجودة
    if (!columnNames.includes('meta_description')) {
      db.prepare('ALTER TABLE articles ADD COLUMN meta_description TEXT').run();
      console.log('✅ تمت إضافة عمود meta_description');
    } else {
      console.log('⏭️  عمود meta_description موجود بالفعل');
    }

    if (!columnNames.includes('meta_keywords')) {
      db.prepare('ALTER TABLE articles ADD COLUMN meta_keywords TEXT').run();
      console.log('✅ تمت إضافة عمود meta_keywords');
    } else {
      console.log('⏭️  عمود meta_keywords موجود بالفعل');
    }

    if (!columnNames.includes('focus_keyword')) {
      db.prepare('ALTER TABLE articles ADD COLUMN focus_keyword TEXT').run();
      console.log('✅ تمت إضافة عمود focus_keyword');
    } else {
      console.log('⏭️  عمود focus_keyword موجود بالفعل');
    }

    if (!columnNames.includes('og_image')) {
      db.prepare('ALTER TABLE articles ADD COLUMN og_image TEXT').run();
      console.log('✅ تمت إضافة عمود og_image');
    } else {
      console.log('⏭️  عمود og_image موجود بالفعل');
    }

    console.log('✅ Migration مكتمل!');
  } catch (error) {
    console.error('❌ خطأ في Migration:', error);
    throw error;
  } finally {
    db.close();
  }
}

// تشغيل المباشر إذا تم استدعاء الملف
if (require.main === module) {
  addSEOFields();
}
