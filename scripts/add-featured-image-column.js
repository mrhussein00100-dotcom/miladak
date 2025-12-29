const Database = require('better-sqlite3');

const db = new Database('database.sqlite');

try {
  // Add featured_image column
  db.prepare(`ALTER TABLE articles ADD COLUMN featured_image TEXT`).run();
  console.log('✓ Added featured_image column');

  // Copy image to featured_image for all articles
  db.prepare(
    `UPDATE articles SET featured_image = image WHERE image IS NOT NULL`
  ).run();
  console.log('✓ Copied image values to featured_image');

  console.log('\n✅ Migration completed successfully!');
} catch (error) {
  if (error.message.includes('duplicate column name')) {
    console.log('Column already exists, updating values...');
    db.prepare(
      `UPDATE articles SET featured_image = image WHERE image IS NOT NULL AND featured_image IS NULL`
    ).run();
    console.log('✓ Updated featured_image values');
  } else {
    console.error('Error:', error.message);
  }
}

db.close();
