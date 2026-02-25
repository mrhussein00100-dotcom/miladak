
const { Pool } = require('pg');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Read .env.prod.local manually
const envPath = path.join(__dirname, '../.env.prod.local');
let DATABASE_URL = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/DATABASE_URL="?([^"\n]+)"?/);
  if (match) {
    DATABASE_URL = match[1];
  }
}

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL not found in .env.prod.local');
  process.exit(1);
}

// Local DB
const dbPath = path.join(__dirname, '../database.sqlite');
const localDb = new Database(dbPath);

// Prod DB
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Map Postgres types to SQLite types
function mapType(pgType) {
  if (pgType.includes('int')) return 'INTEGER';
  if (pgType.includes('char') || pgType.includes('text') || pgType.includes('uuid')) return 'TEXT';
  if (pgType.includes('bool')) return 'INTEGER'; // SQLite uses 0/1 for boolean
  if (pgType.includes('date') || pgType.includes('time')) return 'TEXT'; // SQLite uses TEXT for dates
  if (pgType.includes('json')) return 'TEXT';
  if (pgType.includes('float') || pgType.includes('double') || pgType.includes('numeric')) return 'REAL';
  return 'TEXT'; // Default fallback
}

async function syncTable(tableName) {
  console.log(`\n🔄 Pulling table: ${tableName}...`);
  
  try {
    // Get columns from Postgres
    const { rows: columns } = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);
    
    if (columns.length === 0) {
      console.log(`   ⚠️ Table ${tableName} not found or empty schema in Postgres.`);
      return;
    }

    // Prepare SQLite Create Statement
    const colDefs = columns.map(col => {
      let def = `"${col.column_name}" ${mapType(col.data_type)}`;
      if (col.column_name === 'id') def += ' PRIMARY KEY';
      return def;
    }).join(', ');

    // Drop and Create in SQLite
    localDb.prepare(`DROP TABLE IF EXISTS "${tableName}"`).run();
    localDb.prepare(`CREATE TABLE "${tableName}" (${colDefs})`).run();
    
    // Fetch data from Postgres
    const { rows } = await pool.query(`SELECT * FROM "${tableName}"`);
    console.log(`   📥 Fetched ${rows.length} rows from Postgres.`);

    if (rows.length > 0) {
      const insertCols = columns.map(c => `"${c.column_name}"`).join(', ');
      const placeholders = columns.map(() => '?').join(', ');
      const insertStmt = localDb.prepare(`INSERT INTO "${tableName}" (${insertCols}) VALUES (${placeholders})`);

      const transaction = localDb.transaction((rows) => {
        for (const row of rows) {
          const values = columns.map(col => {
            let val = row[col.column_name];
            // Convert objects/arrays to JSON string for SQLite
            if (typeof val === 'object' && val !== null && !(val instanceof Date)) {
               val = JSON.stringify(val);
            }
            // Convert Dates to ISO string
            if (val instanceof Date) {
               val = val.toISOString();
            }
            // Convert boolean to 0/1
            if (typeof val === 'boolean') {
               val = val ? 1 : 0;
            }
            return val;
          });
          insertStmt.run(...values);
        }
      });

      transaction(rows);
      console.log(`   ✅ Inserted ${rows.length} rows into local SQLite.`);
    } else {
        console.log(`   ℹ️ Table is empty in Postgres.`);
    }

  } catch (error) {
    console.error(`   ❌ Error pulling ${tableName}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting FULL PULL from Production to Local...');
  
  // Get all tables from public schema
  const { rows: tables } = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_name != '_prisma_migrations'
  `);

  console.log(`Found ${tables.length} tables in Production:`, tables.map(t => t.table_name).join(', '));

  for (const table of tables) {
    await syncTable(table.table_name);
  }

  console.log('\n✅ Full Pull completed!');
  await pool.end();
}

main().catch(console.error);
