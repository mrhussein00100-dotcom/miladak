#!/usr/bin/env node

/**
 * إصلاح استخدامات query و execute بدون await
 */

const fs = require('fs');
const path = require('path');

function fixAsyncQueries() {
  console.log('🔧 إصلاح استخدامات query و execute بدون await...\n');

  const apiDir = path.join(__dirname, '..', 'app', 'api');

  function processFile(filePath) {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.js')) return;

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // إصلاح query بدون await
      const queryRegex = /(\s+)([a-zA-Z_][a-zA-Z0-9_]*\s*=\s*)query</g;
      if (queryRegex.test(content)) {
        content = content.replace(queryRegex, '$1$2await query');
        modified = true;
      }

      // إصلاح execute بدون await
      const executeRegex = /(\s+)([a-zA-Z_][a-zA-Z0-9_]*\s*=\s*)execute</g;
      if (executeRegex.test(content)) {
        content = content.replace(executeRegex, '$1$2await execute');
        modified = true;
      }

      // إصلاح execute بدون متغير
      const executeStandaloneRegex = /(\s+)execute\(/g;
      if (executeStandaloneRegex.test(content)) {
        content = content.replace(executeStandaloneRegex, '$1await execute(');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ تم إصلاح: ${path.relative(process.cwd(), filePath)}`);
      }
    } catch (error) {
      console.error(`❌ خطأ في معالجة ${filePath}:`, error.message);
    }
  }

  function processDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else {
        processFile(fullPath);
      }
    }
  }

  processDirectory(apiDir);
  console.log('\n🎉 اكتمل إصلاح الملفات!');
}

fixAsyncQueries();
