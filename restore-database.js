// Restore Database to Vercel Postgres from backup
// Run: node restore-database.js

require('dotenv').config({ path: '.env.prod.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Clean the connection string
const connectionString = (
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  ''
)
  .replace(/\\r\\n/g, '')
  .replace(/\r\n/g, '')
  .trim();

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
});

async function restoreDatabase() {
  console.log('Starting database restore to Vercel Postgres...\n');

  // Load backup
  const backupFile = path.join(__dirname, 'database-backup.json');
  if (!fs.existsSync(backupFile)) {
    console.error('Backup file not found:', backupFile);
    process.exit(1);
  }

  const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
  console.log('Backup timestamp:', backup.timestamp);
  console.log('');

  const client = await pool.connect();

  try {
    let totalRestored = 0;

    for (const [tableName, tableData] of Object.entries(backup.tables)) {
      if (!tableData.data || tableData.data.length === 0) {
        console.log(`  -- ${tableName}: skipped (empty)`);
        continue;
      }

      try {
        // Clear existing data
        await client.query(`DELETE FROM "${tableName}"`);

        // Insert backup data
        for (const row of tableData.data) {
          const columns = Object.keys(row);
          const values = Object.values(row);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

          await client.query(
            `INSERT INTO "${tableName}" (${columns
              .map((c) => `"${c}"`)
              .join(', ')}) VALUES (${placeholders})`,
            values
          );
        }

        totalRestored += tableData.data.length;
        console.log(
          `  OK ${tableName}: ${tableData.data.length} rows restored`
        );
      } catch (error) {
        console.log(`  !! ${tableName}: error - ${error.message}`);
      }
    }

    console.log(`\nTotal rows restored: ${totalRestored}`);
  } finally {
    client.release();
    await pool.end();
  }
}

// Confirm before restore
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  '⚠️  WARNING: This will REPLACE all data in the production database!'
);
console.log('');
rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
  rl.close();
  if (answer.toLowerCase() === 'yes') {
    restoreDatabase()
      .then(() => {
        console.log('\n=== Restore completed successfully! ===');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\nError:', error.message);
        process.exit(1);
      });
  } else {
    console.log('Restore cancelled.');
    process.exit(0);
  }
});
