const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// Get all tables
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table'")
  .all();
console.log('Tables:', tables);

// Check article_categories structure
try {
  const catInfo = db.pragma('table_info(article_categories)');
  console.log('\narticle_categories structure:', catInfo);
} catch (e) {
  console.log('article_categories not found');
}

// Check categories structure
try {
  const catInfo2 = db.pragma('table_info(categories)');
  console.log('\ncategories structure:', catInfo2);
} catch (e) {
  console.log('categories not found');
}

db.close();
