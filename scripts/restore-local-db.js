
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const backupPath = path.join(__dirname, '../database-backup.json');

console.log(`Using database: ${dbPath}`);
console.log(`Using backup: ${backupPath}`);

// Delete existing DB to start fresh
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Deleted existing database.');
}

const db = new Database(dbPath);

// Load backup
if (!fs.existsSync(backupPath)) {
  console.error('Backup file not found!');
  process.exit(1);
}

const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
console.log(`Backup timestamp: ${backup.timestamp}`);

if (!backup.tables) {
  console.error('No tables found in backup!');
  process.exit(1);
}

// Helper to infer SQLite type
const inferType = (key, value) => {
  if (key === 'id') return 'INTEGER PRIMARY KEY'; // Assume id is always PK
  if (typeof value === 'number') return 'INTEGER'; // Or REAL, but usually INTEGER fits
  return 'TEXT';
};

// Restore tables
for (const [tableName, tableData] of Object.entries(backup.tables)) {
  const rows = tableData.data;
  if (!rows || rows.length === 0) {
    console.log(`Skipping empty table: ${tableName}`);
    continue;
  }

  console.log(`Restoring ${tableName} (${rows.length} rows)...`);

  // Infer schema from first row
  const firstRow = rows[0];
  const columns = Object.keys(firstRow);
  
  const columnDefs = columns.map(col => {
    return `"${col}" ${inferType(col, firstRow[col])}`;
  });

  const createSql = `CREATE TABLE "${tableName}" (${columnDefs.join(', ')});`;
  // console.log(createSql);
  db.exec(createSql);

  // Insert data
  const placeholders = columns.map(() => '?').join(', ');
  const insertSql = `INSERT INTO "${tableName}" ("${columns.join('", "')}") VALUES (${placeholders})`;
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
      stmt.run(values);
    }
  });

  transaction(rows);
}

console.log('Database restore completed!');
