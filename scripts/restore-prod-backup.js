
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const backupPath = process.argv[2] || path.join(__dirname, '../backups/backup-2026-02-21T16-13-37/backup.json');

console.log(`Using database: ${dbPath}`);
console.log(`Using backup: ${backupPath}`);

if (!fs.existsSync(backupPath)) {
  console.error('Backup file not found:', backupPath);
  process.exit(1);
}

// Delete existing DB to start fresh
if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log('Deleted existing database.');
  } catch (err) {
    console.error('Error deleting database:', err);
  }
}

const db = new Database(dbPath);

const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
console.log(`Backup source: ${backup.source}`);
console.log(`Backup timestamp: ${backup.timestamp}`);

// Helper to infer SQLite type
const inferType = (key, value) => {
  if (key === 'id') return 'INTEGER PRIMARY KEY'; 
  if (typeof value === 'number') return 'INTEGER';
  return 'TEXT';
};

// Map tables from backup structure
const tablesToRestore = {
  articles: Array.isArray(backup.tables.articles) ? backup.tables.articles : (backup.tables.articles?.data?.items || []),
  categories: Array.isArray(backup.tables.categories) ? backup.tables.categories : (backup.tables.categories?.data || []),
  tools: Array.isArray(backup.tables.tools) ? backup.tables.tools : (backup.tables.tools?.data || [])
};

for (const [tableName, rows] of Object.entries(tablesToRestore)) {
  if (!rows || rows.length === 0) {
    console.log(`Skipping empty table: ${tableName}`);
    continue;
  }

  console.log(`Restoring ${tableName} (${rows.length} rows)...`);

  // Infer schema from first row
  const firstRow = rows[0];
  const columns = Object.keys(firstRow);
  
  const columnDefs = columns.map(col => {
    let type = 'TEXT';
    if (col === 'id') type = 'INTEGER PRIMARY KEY';
    else if (typeof firstRow[col] === 'number') type = 'INTEGER';
    else if (typeof firstRow[col] === 'boolean') type = 'INTEGER'; // SQLite uses 0/1
    return `"${col}" ${type}`;
  });

  const createSql = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columnDefs.join(', ')});`;
  db.exec(createSql);

  // Prepare insert statement
  const placeholders = columns.map(() => '?').join(', ');
  const insertSql = `INSERT OR REPLACE INTO "${tableName}" ("${columns.join('", "')}") VALUES (${placeholders})`;
  const stmt = db.prepare(insertSql);

  const transaction = db.transaction((dataRows) => {
    for (const row of dataRows) {
      const values = columns.map(col => {
        let val = row[col];
        if (typeof val === 'object' && val !== null) {
          return JSON.stringify(val);
        }
        if (typeof val === 'boolean') {
          return val ? 1 : 0;
        }
        return val;
      });
      try {
        stmt.run(values);
      } catch (err) {
        console.error(`Error inserting row into ${tableName}:`, err.message);
      }
    }
  });

  transaction(rows);
}

console.log('Database restore completed!');
