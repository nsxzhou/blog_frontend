import { UserInfo } from '../user/type';

export interface SimpleArticle {
  id: number;
  title: string;
  cover_image: string;
  published_at: string;
}

// 文章信息接口
export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  category_id: number;
  category_name: string;
  author_id: number;
  author_name: string;
  author_avatar: string;
  cover_image: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  favorite_count: number;
  word_count: number;
  status: string;
  access_type: string;
  is_top: number;
  is_original: number;
  source_url: string;
  source_name: string;
  tags: {
    id: number;
    name: string;
  }[];
  created_at: string;
  updated_at: string;
  published_at: string;
  is_liked: boolean;
  is_favorited: boolean;
  next_article: SimpleArticle | null;
  prev_article: SimpleArticle | null;
  related_articles: string[];
}

// 创建文章请求参数
export interface CreateArticleReq {
  title: string;
  content: string;
  summary: string;
  cover_image?: string;
  status: 'draft' | 'published' | 'archived';
  access_type: 'public' | 'private' | 'password';
  password?: string;
  is_original: number;
  is_top: number;
  source_name?: string;
  source_url?: string;
  category_id: number;
  tag_ids: number[];
}

// 创建文章响应数据
export interface CreateArticleRes {
  article_id: number;
}

// 更新文章请求参数
export interface UpdateArticleReq {
  title?: string;
  content?: string;
  summary?: string;
  cover_image?: string;
  status?: 'draft' | 'published' | 'archived';
  access_type?: 'public' | 'private' | 'password';
  password?: string;
  is_original?: number;
  is_top?: number;
  source_name?: string;
  source_url?: string;
  category_id?: number;
  tag_ids?: number[];
}

// 更新文章响应数据
export interface UpdateArticleRes {
  article_id: number;
}

// 文章列表查询参数
export interface ArticleListQuery {
  page?: number;
  page_size?: number;
  keyword?: string;
  order_by?: string;
  order?: 'asc' | 'desc';
  is_top?: number;
  is_original?: number;
  start_date?: string;
  end_date?: string;
  status?: 'draft' | 'published' | 'archived';
  category_id?: number;
  tag_id?: number;
  author_id?: number;
  access_type?: 'public' | 'private' | 'password';
}

// 文章列表项
export interface ArticleListItem {
  id: number;
  title: string;
  summary: string;
  category_id: number;
  category_name: string;
  author_id: number;
  author_name: string;
  cover_image: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  favorite_count: number;
  word_count: number;
  status: string;
  access_type: string;
  is_top: number;
  is_original: number;
  tags: {
    id: number;
    name: string;
  }[];
  created_at: string;
  updated_at: string;
  published_at: string;
}

// 文章列表响应数据
export interface ArticleListRes {
  items: ArticleListItem[];
  total: number;
}

// 文章交互操作请求参数
export interface ArticleActionReq {
  action: 'like' | 'unlike' | 'favorite' | 'unfavorite';
}

// 文章统计项
export interface ArticleStatItem {
  id: number;
  title: string;
  count: number;
}

// 文章统计响应数据
export interface ArticleStatsRes {
  total_articles: number;
  published_articles: number;
  draft_articles: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_favorites: number;
  total_word_count: number;
  top_viewed_articles: ArticleStatItem[];
  top_liked_articles: ArticleStatItem[];
}

// 更新文章状态请求参数
export interface UpdateArticleStatusReq {
  status: 'draft' | 'published' | 'archived';
}

// 更新文章状态响应数据
export interface UpdateArticleStatusRes {
  article_id: number;
  status: 'draft' | 'published' | 'archived';
}

// 更新文章访问权限请求参数
export interface UpdateArticleAccessReq {
  access_type: 'public' | 'private' | 'password';
  password?: string;
}

// 更新文章访问权限响应数据
export interface UpdateArticleAccessRes {
  access_type: 'public' | 'private' | 'password';
  article_id: number;
}

// 搜索文章查询参数
export interface SearchArticleQuery {
  page?: number;
  page_size?: number;
  keyword?: string;
  author_id?: number;
  tag_id?: number;
  category_id?: number;
}

// 搜索文章响应数据
export interface SearchArticleRes {
  items: ArticleListItem[];
  total: number;
}

// 根据标签获取文章响应数据
export interface ArticlesByTagRes {
  items: ArticleListItem[];
  total: number;
}

// 根据分类获取文章响应数据
export interface ArticlesByCategoryRes {
  items: ArticleListItem[];
  total: number;
}

// 获取点赞用户响应数据
export interface ArticleLikeUsersRes {
  list: UserInfo[];
  total: number;
}
