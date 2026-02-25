const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// Check tools table structure
const toolsInfo = db.prepare('PRAGMA table_info(tools)').all();
console.log('Tools table columns:', toolsInfo);

// Check tool_categories table structure
const catInfo = db.prepare('PRAGMA table_info(tool_categories)').all();
console.log('Tool categories columns:', catInfo);

// Sample tools with all columns
const sample = db.prepare('SELECT * FROM tools LIMIT 3').all();
console.log('Sample tools:', sample);

// Sample categories
const categories = db.prepare('SELECT * FROM tool_categories LIMIT 3').all();
console.log('Sample categories:', categories);

db.close();
