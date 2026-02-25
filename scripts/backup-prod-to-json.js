
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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

// Prod DB Connection
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log('🚀 Starting Backup from Production...');

  // 1. Create Backup Directory
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDirName = `backup_${timestamp}`;
  const backupDir = path.join(__dirname, '../BU', backupDirName);

  if (!fs.existsSync(path.join(__dirname, '../BU'))) {
      fs.mkdirSync(path.join(__dirname, '../BU'), { recursive: true });
  }
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`📂 Created backup directory: ${backupDir}`);

  // 2. Get all tables
  const { rows: tables } = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_name != '_prisma_migrations'
  `);

  console.log(`Found ${tables.length} tables to backup.`);
  
  const metadata = {
      date: now.toISOString(),
      tables: {}
  };

  // 3. Dump each table to JSON
  for (const table of tables) {
      const tableName = table.table_name;
      console.log(`   📥 Backing up table: ${tableName}...`);
      
      try {
          const { rows } = await pool.query(`SELECT * FROM "${tableName}"`);
          const filePath = path.join(backupDir, `${tableName}.json`);
          
          fs.writeFileSync(filePath, JSON.stringify(rows, null, 2));
          console.log(`      ✅ Saved ${rows.length} rows.`);
          
          metadata.tables[tableName] = rows.length;
      } catch (err) {
          console.error(`      ❌ Error backing up ${tableName}:`, err.message);
          metadata.tables[tableName] = { error: err.message };
      }
  }

  // 4. Save Metadata/README
  const readmeContent = `# Production Backup - ${timestamp}

## Overview
- **Date**: ${now.toLocaleString()}
- **Total Tables**: ${tables.length}

## Table Statistics
| Table Name | Row Count |
|------------|-----------|
${Object.entries(metadata.tables).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

## Notes
This backup was generated automatically via script.
`;

  fs.writeFileSync(path.join(backupDir, 'README.md'), readmeContent);
  
  console.log('\n🎉 Backup completed successfully!');
  console.log(`📍 Location: ${backupDir}`);
  
  await pool.end();
}

main().catch(console.error);
