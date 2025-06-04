// 文章数据类型
export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  publishDate: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  category: string;
  featured?: boolean;
}

// 相关文章类型
export interface RelatedArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  views: number;
  readTime: number;
  category: string;
  tags: string[];
}

// 评论类型
export interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

// 页面状态类型
export interface ArticleDetailState {
  article: Article | null;
  relatedArticles: RelatedArticle[];
  comments: Comment[];
  loading: boolean;
  error: string | null;
}
