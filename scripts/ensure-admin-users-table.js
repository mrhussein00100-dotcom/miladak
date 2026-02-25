const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

// إنشاء جدول المستخدمين إذا لم يكن موجوداً
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    role TEXT DEFAULT 'editor',
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('✅ تم التأكد من وجود جدول admin_users');

// التحقق من وجود مستخدم admin
const adminUser = db
  .prepare('SELECT * FROM admin_users WHERE username = ?')
  .get('admin');

if (!adminUser) {
  // إنشاء مستخدم admin افتراضي
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync('admin123', salt, 100000, 64, 'sha512')
    .toString('hex');

  db.prepare(
    `
    INSERT INTO admin_users (username, password_hash, password_salt, role, active)
    VALUES (?, ?, ?, ?, ?)
  `
  ).run('admin', hash, salt, 'admin', 1);

  console.log('✅ تم إنشاء مستخدم admin افتراضي');
  console.log('   اسم المستخدم: admin');
  console.log('   كلمة المرور: admin123');
  console.log('   ⚠️ يرجى تغيير كلمة المرور فوراً!');
} else {
  console.log('✅ مستخدم admin موجود بالفعل');
}

// عرض جميع المستخدمين
const users = db
  .prepare('SELECT id, username, role, active FROM admin_users')
  .all();
console.log('\n📋 المستخدمون الحاليون:');
users.forEach((u) => {
  console.log(`   - ${u.username} (${u.role}) - ${u.active ? 'نشط' : 'معطل'}`);
});

db.close();
