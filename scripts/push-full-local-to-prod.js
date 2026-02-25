
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

async function pushTable(tableName) {
  console.log(`\n🔄 Pushing table: ${tableName}...`);
  
  try {
    // Get columns from Postgres to ensure we match schema
    const { rows: columns } = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);
    
    if (columns.length === 0) {
      console.log(`   ⚠️ Table ${tableName} not found in Postgres.`);
      return;
    }

    const validCols = columns.map(c => c.column_name);

    // Get all rows from Local
    // We only select columns that exist in Postgres
    const selectCols = validCols.map(c => `"${c}"`).join(', ');
    const localRows = localDb.prepare(`SELECT ${selectCols} FROM "${tableName}"`).all();
    console.log(`   📤 Found ${localRows.length} rows in Local.`);

    // Truncate Postgres table
    // Use CASCADE to handle foreign keys
    await pool.query(`TRUNCATE TABLE "${tableName}" CASCADE`);
    console.log(`   🗑️  Truncated ${tableName} in Postgres.`);

    if (localRows.length > 0) {
      // Bulk Insert
      // We can't insert all at once if too many, so maybe batch?
      // Postgres limit is ~65535 parameters.
      // 10 columns * 1000 rows = 10000 params. Safe.
      
      const BATCH_SIZE = 500;
      for (let i = 0; i < localRows.length; i += BATCH_SIZE) {
        const batch = localRows.slice(i, i + BATCH_SIZE);
        
        const keys = validCols; // use validCols to ensure order
        const placeholders = [];
        const values = [];
        
        batch.forEach((row, rowIdx) => {
          const rowPlaceholders = [];
          keys.forEach((key, colIdx) => {
            // $1, $2, etc.
            // Global index: (i * cols) + colIdx + 1
            // But we restart parameter index for each query
            // Wait, we are building one big query for the batch?
            // "VALUES ($1, $2), ($3, $4)"
            
            // Actually, constructing a single INSERT with multiple VALUES is better.
            // But we need to flatten the values array.
            
            rowPlaceholders.push(`$${values.length + 1}`);
            
            let val = row[key];
            // SQLite stores Dates as Strings. Postgres needs them as strings (driver handles it) or Date objects.
            // SQLite stores JSON as Strings. Postgres needs them as Strings (driver handles it if type is json/jsonb).
            // SQLite stores Boolean as 0/1. Postgres needs Boolean.
            
            const pgType = columns.find(c => c.column_name === key).data_type;
            
            if (pgType === 'boolean') {
                val = val === 1;
            }
            
            if ((pgType === 'json' || pgType === 'jsonb') && typeof val === 'string') {
                try {
                    JSON.parse(val);
                } catch (e) {
                    val = JSON.stringify(val);
                }
            }

            values.push(val);
          });
          placeholders.push(`(${rowPlaceholders.join(', ')})`);
        });

        const insertQuery = `
          INSERT INTO "${tableName}" (${keys.map(k => `"${k}"`).join(', ')}) 
          VALUES ${placeholders.join(', ')}
        `;

        await pool.query(insertQuery, values);
      }
      console.log(`   ✅ Inserted ${localRows.length} rows into Postgres.`);
    } else {
        console.log(`   ℹ️ Local table is empty.`);
    }

  } catch (error) {
    console.error(`   ❌ Error pushing ${tableName}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting FULL PUSH from Local to Production...');
  
  // Get all tables from Local
  const tables = localDb.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `).all().map(t => t.name);

  console.log(`Found ${tables.length} tables in Local:`, tables.join(', '));

  // We need to push in a specific order? 
  // Since we use CASCADE truncate, we can truncate parents first.
  // But when inserting, we must insert parents (referenced tables) first.
  
  // Let's define a safe order based on dependencies.
  // Parents first: categories, users, etc.
  // Children last: articles, tools, logs.
  
  const priorityTables = [
    'admin_users',
    'article_categories',
    'categories',
    'tool_categories',
    'tools',
    'articles', 
    'historical_events',
    'celebrities',
    'birthstones',
    'birth_flowers',
    'colors_numbers',
    'sona_settings'
  ];
  
  // Sort tables: priority ones first, then others.
  const sortedTables = [];
  const remainingTables = new Set(tables);
  
  for (const t of priorityTables) {
    if (remainingTables.has(t)) {
      sortedTables.push(t);
      remainingTables.delete(t);
    }
  }
  
  // Add remaining tables
  for (const t of remainingTables) {
    sortedTables.push(t);
  }

  // Actually, TRUNCATE CASCADE on a parent table will clear children in Postgres!
  // So if we Truncate Categories, Articles might be cleared if they cascade.
  // BUT we are going to refill them immediately.
  // The problem is if we Truncate Categories, then Insert Categories...
  // Then Truncate Articles, Insert Articles...
  // This is fine.
  
  // The only risk is if we Truncate Categories (clears Articles via cascade), 
  // and then we Truncate Articles (it's already empty), then Insert Articles.
  // This is also fine.
  
  // The only REAL risk is if we Insert Articles BEFORE Categories, foreign key constraint will fail.
  // So "Parents First" for Insertion is correct.
  // My `priorityTables` puts `categories` before `articles`.
  
  for (const table of sortedTables) {
    await pushTable(table);
  }

  console.log('\n✅ Full Push completed!');
  await pool.end();
}

main().catch(console.error);
