import Database from 'better-sqlite3';
import path from 'path';

const dbPath =
  process.env.DATABASE_URL || path.join(process.cwd(), 'database.sqlite');

export interface Article {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id?: number | null;
  image?: string;
  author?: string;
  read_time?: number;
  views?: number;
  published?: boolean;
  featured?: boolean;
  meta_description?: string;
  meta_keywords?: string;
  focus_keyword?: string;
  og_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  image?: string;
  created_at?: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  replied?: boolean;
  ip_address?: string;
  created_at?: string;
}

export interface Advertisement {
  id?: number;
  name: string;
  type: 'banner' | 'sidebar' | 'popup' | 'adsense';
  position: string;
  content: string;
  image?: string;
  link?: string;
  active?: boolean;
  start_date?: string;
  end_date?: string;
  impressions?: number;
  clicks?: number;
  created_at?: string;
}

// ==================== ARTICLES ====================

export const articlesDB = {
  // Get all articles
  getAll: (filters?: {
    published?: boolean;
    category_id?: number;
    featured?: boolean;
  }) => {
    const db = new Database(dbPath);
    try {
      let query =
        'SELECT a.*, c.name as category_name, c.color as category_color FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE 1=1';
      const params: any[] = [];

      if (filters?.published !== undefined) {
        query += ' AND a.published = ?';
        params.push(filters.published ? 1 : 0);
      }

      if (filters?.category_id) {
        query += ' AND a.category_id = ?';
        params.push(filters.category_id);
      }

      if (filters?.featured !== undefined) {
        query += ' AND a.featured = ?';
        params.push(filters.featured ? 1 : 0);
      }

      query += ' ORDER BY a.created_at DESC';

      const stmt = db.prepare(query);
      return stmt.all(...params);
    } finally {
      db.close();
    }
  },

  // Get article by ID
  getById: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(
        'SELECT a.*, c.name as category_name FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.id = ?'
      );
      return stmt.get(id);
    } finally {
      db.close();
    }
  },

  // Get article by slug
  getBySlug: (slug: string) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(
        'SELECT a.*, c.name as category_name FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.slug = ?'
      );
      return stmt.get(slug);
    } finally {
      db.close();
    }
  },

  // Create article
  create: (article: Article) => {
    const db = new Database(dbPath);
    try {
      console.log('💾 Inserting article into database:', {
        title: article.title,
        slug: article.slug,
        hasExcerpt: !!article.excerpt,
        hasContent: !!article.content,
      });

      const stmt = db.prepare(`
        INSERT INTO articles (title, slug, excerpt, content, category_id, image, author, read_time, published, featured, meta_description, meta_keywords, focus_keyword, og_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        article.title,
        article.slug,
        article.excerpt,
        article.content,
        article.category_id || null,
        article.image || null,
        article.author || 'فريق ميلادك',
        article.read_time || 5,
        article.published ? 1 : 0,
        article.featured ? 1 : 0,
        article.meta_description || null,
        article.meta_keywords || null,
        article.focus_keyword || null,
        article.og_image || null
      );

      console.log('✅ Article inserted with ID:', result.lastInsertRowid);
      return result.lastInsertRowid;
    } catch (error) {
      console.error('❌ Error inserting article:', error);
      throw error;
    } finally {
      db.close();
    }
  },

  // Update article
  update: (id: number, article: Partial<Article>) => {
    const db = new Database(dbPath);
    try {
      const fields = Object.keys(article)
        .filter((k) => k !== 'id')
        .map((k) => `${k} = ?`)
        .join(', ');
      const values = Object.keys(article)
        .filter((k) => k !== 'id')
        .map((k) => {
          const value = (article as any)[k];
          // تحويل Boolean إلى 0 أو 1 لـ SQLite
          if (typeof value === 'boolean') {
            return value ? 1 : 0;
          }
          // تحويل undefined إلى null
          if (value === undefined) {
            return null;
          }
          return value;
        });

      const stmt = db.prepare(
        `UPDATE articles SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      );
      return stmt.run(...values, id);
    } finally {
      db.close();
    }
  },

  // Delete article
  delete: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare('DELETE FROM articles WHERE id = ?');
      return stmt.run(id);
    } finally {
      db.close();
    }
  },

  // Increment views
  incrementViews: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(
        'UPDATE articles SET views = views + 1 WHERE id = ?'
      );
      return stmt.run(id);
    } finally {
      db.close();
    }
  },
};

// ==================== CATEGORIES ====================

export const categoriesDB = {
  // Get all categories
  getAll: () => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare('SELECT * FROM categories ORDER BY name');
      return stmt.all();
    } finally {
      db.close();
    }
  },

  // Get all categories with aggregated stats (published articles only by default)
  getAllWithStats: (opts?: { publishedOnly?: boolean }) => {
    const db = new Database(dbPath);
    try {
      const publishedOnly = opts?.publishedOnly !== false;
      const stmt = db.prepare(`
        SELECT 
          c.*, 
          COUNT(a.id) AS article_count,
          COALESCE(SUM(a.views), 0) AS total_views
        FROM categories c
        LEFT JOIN articles a 
          ON a.category_id = c.id
          ${publishedOnly ? 'AND a.published = 1' : ''}
        GROUP BY c.id
        ORDER BY c.name
      `);
      return stmt.all();
    } finally {
      db.close();
    }
  },

  // Get category by ID
  getById: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
      return stmt.get(id);
    } finally {
      db.close();
    }
  },

  // Create category
  create: (category: Category) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(`
        INSERT INTO categories (name, slug, description, color, image)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        category.name,
        category.slug,
        category.description || null,
        category.color || '#3B82F6',
        category.image || null
      );
      return result.lastInsertRowid;
    } finally {
      db.close();
    }
  },

  // Update category
  update: (id: number, category: Partial<Category>) => {
    const db = new Database(dbPath);
    try {
      const fields = Object.keys(category)
        .filter((k) => k !== 'id')
        .map((k) => `${k} = ?`)
        .join(', ');
      const values = Object.keys(category)
        .filter((k) => k !== 'id')
        .map((k) => (category as any)[k]);

      const stmt = db.prepare(`UPDATE categories SET ${fields} WHERE id = ?`);
      return stmt.run(...values, id);
    } finally {
      db.close();
    }
  },

  // Delete category
  delete: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
      return stmt.run(id);
    } finally {
      db.close();
    }
  },
};

// ==================== CONTACT MESSAGES ====================

export const contactDB = {
  // Get all messages
  getAll: (filters?: { read?: boolean }) => {
    const db = new Database(dbPath);
    try {
      let query = 'SELECT * FROM contact_messages WHERE 1=1';
      const params: any[] = [];

      if (filters?.read !== undefined) {
        query += ' AND read = ?';
        params.push(filters.read ? 1 : 0);
      }

      query += ' ORDER BY created_at DESC';

      const stmt = db.prepare(query);
      return stmt.all(...params);
    } finally {
      db.close();
    }
  },

  // Get message by ID
  getById: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare('SELECT * FROM contact_messages WHERE id = ?');
      return stmt.get(id);
    } finally {
      db.close();
    }
  },

  // Create message
  create: (message: ContactMessage) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(`
        INSERT INTO contact_messages (name, email, subject, message, ip_address)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        message.name,
        message.email,
        message.subject,
        message.message,
        message.ip_address || null
      );
      return result.lastInsertRowid;
    } finally {
      db.close();
    }
  },

  // Mark as read
  markAsRead: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(
        'UPDATE contact_messages SET read = 1 WHERE id = ?'
      );
      return stmt.run(id);
    } finally {
      db.close();
    }
  },

  // Mark as replied
  markAsReplied: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(
        'UPDATE contact_messages SET replied = 1 WHERE id = ?'
      );
      return stmt.run(id);
    } finally {
      db.close();
    }
  },

  // Delete message
  delete: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare('DELETE FROM contact_messages WHERE id = ?');
      return stmt.run(id);
    } finally {
      db.close();
    }
  },

  // Get unread count
  getUnreadCount: () => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(
        'SELECT COUNT(*) as count FROM contact_messages WHERE read = 0'
      );
      const result = stmt.get() as { count: number };
      return result.count;
    } finally {
      db.close();
    }
  },
};

// ==================== ADVERTISEMENTS ====================

export const adsDB = {
  // Get all ads
  getAll: (filters?: { active?: boolean; position?: string }) => {
    const db = new Database(dbPath);
    try {
      let query = 'SELECT * FROM advertisements WHERE 1=1';
      const params: any[] = [];

      if (filters?.active !== undefined) {
        query += ' AND active = ?';
        params.push(filters.active ? 1 : 0);
      }

      if (filters?.position) {
        query += ' AND position = ?';
        params.push(filters.position);
      }

      query += ' ORDER BY created_at DESC';

      const stmt = db.prepare(query);
      return stmt.all(...params);
    } finally {
      db.close();
    }
  },

  // Get active ads by position
  getByPosition: (position: string) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(`
        SELECT * FROM advertisements 
        WHERE active = 1 AND position = ?
        AND (start_date IS NULL OR start_date <= datetime('now'))
        AND (end_date IS NULL OR end_date >= datetime('now'))
        ORDER BY created_at DESC
      `);
      return stmt.all(position);
    } finally {
      db.close();
    }
  },

  // Get ad by ID
  getById: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare('SELECT * FROM advertisements WHERE id = ?');
      return stmt.get(id);
    } finally {
      db.close();
    }
  },

  // Create ad
  create: (ad: Advertisement) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(`
        INSERT INTO advertisements (name, type, position, content, image, link, active, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        ad.name,
        ad.type,
        ad.position,
        ad.content,
        ad.image || null,
        ad.link || null,
        ad.active ? 1 : 0,
        ad.start_date || null,
        ad.end_date || null
      );
      return result.lastInsertRowid;
    } finally {
      db.close();
    }
  },

  // Update ad
  update: (id: number, ad: Partial<Advertisement>) => {
    const db = new Database(dbPath);
    try {
      const fields = Object.keys(ad)
        .filter((k) => k !== 'id')
        .map((k) => `${k} = ?`)
        .join(', ');
      const values = Object.keys(ad)
        .filter((k) => k !== 'id')
        .map((k) => (ad as any)[k]);

      const stmt = db.prepare(
        `UPDATE advertisements SET ${fields} WHERE id = ?`
      );
      return stmt.run(...values, id);
    } finally {
      db.close();
    }
  },

  // Delete ad
  delete: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare('DELETE FROM advertisements WHERE id = ?');
      return stmt.run(id);
    } finally {
      db.close();
    }
  },

  // Increment impressions
  incrementImpressions: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(
        'UPDATE advertisements SET impressions = impressions + 1 WHERE id = ?'
      );
      return stmt.run(id);
    } finally {
      db.close();
    }
  },

  // Increment clicks
  incrementClicks: (id: number) => {
    const db = new Database(dbPath);
    try {
      const stmt = db.prepare(
        'UPDATE advertisements SET clicks = clicks + 1 WHERE id = ?'
      );
      return stmt.run(id);
    } finally {
      db.close();
    }
  },
};
