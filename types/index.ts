// Tool Types
export interface Tool {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category_id: number;
  category_name?: string;
  href: string;
  featured: boolean;
  active: boolean;
  sort_order?: number;
}

// Theme Types
export type ThemeMode = 'system' | 'light' | 'dark' | 'miladak';

export interface ToolCategory {
  id: number;
  name: string;
  slug: string;
  title?: string;
  icon?: string;
  sort_order?: number;
}

export interface ToolWithCategory extends Tool {
  category_slug: string;
  category_icon: string;
  category_title: string;
}

export interface GroupedTools {
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    title: string;
  };
  tools: Tool[];
}

// Article Types
export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category_id?: number;
  category_name?: string;
  category_color?: string;
  image?: string;
  featured_image?: string;
  author?: string;
  read_time: number;
  views: number;
  tags?: string;
  published?: number;
  featured?: boolean;
  meta_description?: string;
  meta_keywords?: string;
  focus_keyword?: string;
  og_image?: string;
  ai_provider?: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  article_count?: number;
  sort_order?: number;
}

// Other Types
export interface Celebrity {
  id: number;
  name: string;
  profession: string;
  birth_date: string;
  birth_year: number;
  description?: string;
}

export interface HistoricalEvent {
  id: number;
  title: string;
  description: string;
  event_date: string;
  category: string;
}
