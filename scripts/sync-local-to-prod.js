
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
if (!fs.existsSync(dbPath)) {
  console.error('❌ Error: Local database.sqlite not found');
  process.exit(1);
}
const localDb = new Database(dbPath);

// Prod DB
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function syncTable(tableName, uniqueKey = 'id') {
  console.log(`\n🔄 Syncing table: ${tableName}...`);
  
  try {
    // Get local data
    const localRows = localDb.prepare(`SELECT * FROM ${tableName}`).all();
    console.log(`   📍 Local: ${localRows.length} rows`);

    if (localRows.length === 0) {
      console.log(`   ⚠️ Local table empty, skipping sync for safety.`);
      return;
    }

    // Get table schema from Postgres to know columns
    const { rows: columns } = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1
    `, [tableName]);
    
    const validColumns = columns.map(c => c.column_name);
    
    // Begin transaction on Postgres
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Simple strategy: Upsert (Insert or Update)
      // Since we want local to be the source of truth, we can iterate local rows and upsert.
      // But we also need to handle deletions? 
      // If a row exists in Prod but not in Local, should we delete it?
      // "Modify locally then upload" implies mirroring. So yes, maybe delete.
      // But let's stick to Upsert first to be safe, or just Update existing and Insert new.
      
      let updatedCount = 0;
      let insertedCount = 0;

      for (const row of localRows) {
        // Filter row keys to only those existing in Postgres
        const rowData = {};
        for (const col of validColumns) {
          if (row[col] !== undefined) {
            rowData[col] = row[col];
          }
        }

        // Construct Query
        const keys = Object.keys(rowData);
        const values = Object.values(rowData);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const updateSet = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

        // Check if exists
        const checkRes = await client.query(`SELECT 1 FROM ${tableName} WHERE ${uniqueKey} = $1`, [rowData[uniqueKey]]);
        
        if (checkRes.rowCount > 0) {
          // Update
          await client.query(`
            UPDATE ${tableName} 
            SET ${updateSet} 
            WHERE ${uniqueKey} = $${keys.length + 1}
          `, [...values, rowData[uniqueKey]]);
          updatedCount++;
        } else {
          // Insert
          await client.query(`
            INSERT INTO ${tableName} (${keys.join(', ')}) 
            VALUES (${placeholders})
          `, values);
          insertedCount++;
        }
      }

      await client.query('COMMIT');
      console.log(`   ✅ Synced: ${updatedCount} updated, ${insertedCount} inserted.`);
      
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error(`   ❌ Error syncing ${tableName}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting sync from Local to Production...');
  
  // List of tables to sync
  // Order matters due to foreign keys
  const tables = [
    'categories',
    'articles',
    'tools',
    'historical_events',
    'celebrities',
    'birthstones_flowers',
    'colors_numbers',
    'sona_settings',
    'daily_events',
    'daily_birthdays',
    'birthstones',
    'birth_flowers'
  ];

  console.log('Tables to sync:', tables);

  for (const table of tables) {
    await syncTable(table);
  }

  console.log('\n✅ Sync completed!');
  await pool.end();
}

main().catch(console.error);
