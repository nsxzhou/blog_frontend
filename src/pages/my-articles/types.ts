export interface MyArticle {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  image?: string;
  date: string;
  lastModified: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  category: string;
  status: 'published' | 'draft';
  featured?: boolean;
}

export interface ArticleStats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  publishedCount: number;
  draftCount: number;
}

export type SortType = 'date' | 'views' | 'likes' | 'title';
export type FilterType = '' | 'published' | 'draft';
