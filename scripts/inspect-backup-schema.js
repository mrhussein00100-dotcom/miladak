
const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, '../database-backup.json');
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

if (backup.tables) {
  for (const [tableName, tableData] of Object.entries(backup.tables)) {
    if (tableData.data && tableData.data.length > 0) {
      const keys = Object.keys(tableData.data[0]);
      console.log(`Table: ${tableName}`);
      console.log(`Columns: ${keys.join(', ')}`);
      console.log('---');
    }
  }
}
