// Backup Database from Vercel Postgres
// Run: node backup-database.js

require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function backupDatabase() {
  console.log('Starting database backup from Vercel Postgres...\n');

  const backupData = {
    timestamp: new Date().toISOString(),
    source: 'Vercel Postgres Production',
    tables: {},
  };

  const tables = [
    'articles',
    'categories',
    'tools',
    'page_keywords',
    'historical_events',
    'celebrities',
    'birthstones_flowers',
    'colors_numbers',
    'admin_users',
    'auto_publish_settings',
    'auto_publish_logs',
    'rewrite_history',
    'sona_settings',
    'sona_templates',
    'sona_analytics',
  ];

  let totalRows = 0;

  for (const table of tables) {
    try {
      const result = await sql.query(`SELECT * FROM ${table}`);
      backupData.tables[table] = {
        count: result.rows.length,
        data: result.rows,
      };
      totalRows += result.rows.length;
      console.log(`  OK ${table}: ${result.rows.length} rows`);
    } catch (error) {
      console.log(`  -- ${table}: not found or empty`);
      backupData.tables[table] = { count: 0, data: [], error: error.message };
    }
  }

  // Save JSON backup
  const backupFile = path.join(__dirname, 'database-backup.json');
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`\nJSON backup saved: ${backupFile}`);

  // Create SQL backup
  await createSqlBackup(backupData);

  console.log(`\nTotal rows backed up: ${totalRows}`);
  return backupData;
}

async function createSqlBackup(backupData) {
  let sqlContent = `-- Miladak Database Backup\n-- Generated: ${backupData.timestamp}\n\n`;

  for (const [tableName, tableData] of Object.entries(backupData.tables)) {
    if (tableData.data && tableData.data.length > 0) {
      sqlContent += `-- Table: ${tableName}\n`;
      sqlContent += `-- Rows: ${tableData.count}\n\n`;

      for (const row of tableData.data) {
        const columns = Object.keys(row).join(', ');
        const values = Object.values(row)
          .map((v) => {
            if (v === null) return 'NULL';
            if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
            if (typeof v === 'object')
              return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
            return v;
          })
          .join(', ');

        sqlContent += `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`;
      }
      sqlContent += '\n';
    }
  }

  const sqlFile = path.join(__dirname, 'database-backup.sql');
  fs.writeFileSync(sqlFile, sqlContent, 'utf8');
  console.log(`SQL backup saved: ${sqlFile}`);
}

backupDatabase()
  .then(() => {
    console.log('\nBackup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nError:', error.message);
    process.exit(1);
  });
