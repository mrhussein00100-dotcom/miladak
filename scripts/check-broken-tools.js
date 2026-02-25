const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// البحث عن الأدوات المعطلة
const tools = db
  .prepare(
    `
  SELECT id, name, title, href 
  FROM tools 
  WHERE title LIKE '%أعياد%' 
     OR title LIKE '%أجيال%' 
     OR title LIKE '%زمنية%' 
     OR name LIKE '%event%' 
     OR name LIKE '%generation%' 
     OR name LIKE '%timezone%'
`
  )
  .all();

console.log('الأدوات المطلوبة:');
console.log(JSON.stringify(tools, null, 2));

// عرض جميع الأدوات
console.log('\n\nجميع الأدوات:');
const allTools = db
  .prepare('SELECT id, name, title, href FROM tools ORDER BY id')
  .all();
console.log(JSON.stringify(allTools, null, 2));

db.close();
