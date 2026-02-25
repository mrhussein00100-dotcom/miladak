const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

const updates = [
    { 
        ids: [60, 61, 62, 63], 
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
        alt: 'ساعة زمنية وحساب العمر'
    },
    { 
        ids: [64, 65, 66], 
        image: 'https://images.unsplash.com/photo-1533552031-6e35575798c6?auto=format&fit=crop&w=800&q=80',
        alt: 'سماء ليلية وهلال - التقويم الهجري'
    },
    { 
        ids: [67, 70, 72], 
        image: 'https://images.unsplash.com/photo-1506784300875-b438ea4960f3?auto=format&fit=crop&w=800&q=80',
        alt: 'تقويم ورقي - حساب التاريخ'
    },
    { 
        ids: [68], 
        image: 'https://images.unsplash.com/photo-1464349153912-bc7329e86de7?auto=format&fit=crop&w=800&q=80',
        alt: 'كعكة عيد ميلاد واحتفال'
    },
    { 
        ids: [73, 74], 
        image: 'https://images.unsplash.com/photo-1501139083538-0139583c61df?auto=format&fit=crop&w=800&q=80',
        alt: 'ساعة رملية - حساب الوقت'
    },
    { 
        ids: [88], 
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
        alt: 'طعام صحي وخضروات - سعرات حرارية'
    }
];

console.log('🚀 Starting Image Updates...');

const updateStmt = db.prepare('UPDATE articles SET content = ? WHERE id = ?');
const getStmt = db.prepare('SELECT content FROM articles WHERE id = ?');

let totalUpdated = 0;

db.transaction(() => {
    for (const group of updates) {
        for (const id of group.ids) {
            const article = getStmt.get(id);
            if (!article) {
                console.log(`⚠️ Article ${id} not found.`);
                continue;
            }

            let content = article.content || '';
            
            // Check if already has image (double check)
            if (content.includes('<img') || content.includes('src=')) {
                console.log(`ℹ️ Article ${id} already has an image. Skipping.`);
                continue;
            }

            // Insert image at the beginning
            const imgTag = `
<figure class="w-full my-6">
  <img src="${group.image}" alt="${group.alt}" class="w-full h-auto rounded-lg shadow-md object-cover max-h-[400px]" loading="lazy" />
  <figcaption class="text-center text-gray-500 mt-2 text-sm">${group.alt}</figcaption>
</figure>
`;
            
            // Try to insert after the first paragraph if possible, or at top
            // Simple approach: Prepend to content
            const newContent = imgTag + content;

            updateStmt.run(newContent, id);
            console.log(`✅ Updated Article ${id} with image.`);
            totalUpdated++;
        }
    }
})();

console.log(`\n🎉 Finished! Updated ${totalUpdated} articles.`);
