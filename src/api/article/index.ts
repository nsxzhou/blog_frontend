import type { baseResponse } from '@/api';
import { request } from '@umijs/max';
import type {
  Article,
  ArticleActionReq,
  ArticleLikeUsersRes,
  ArticleListQuery,
  ArticleListRes,
  ArticlesByCategoryRes,
  ArticlesByTagRes,
  ArticleStatsRes,
  CreateArticleReq,
  CreateArticleRes,
  SearchArticleQuery,
  UnifiedArticleQuery,
  UpdateArticleAccessReq,
  UpdateArticleAccessRes,
  UpdateArticleReq,
  UpdateArticleRes,
  UpdateArticleStatusReq,
  UpdateArticleStatusRes,
} from './type';

// 创建文章
export function CreateArticle(data: CreateArticleReq) {
  return request<baseResponse<CreateArticleRes>>('/api/articles', {
    method: 'POST',
    data,
  });
}

// 获取文章详情
export function GetArticleDetail(id: number) {
  return request<baseResponse<Article>>(`/api/articles/${id}`, {
    method: 'GET',
  });
}

// 更新文章
export function UpdateArticle(id: number, data: UpdateArticleReq) {
  return request<baseResponse<UpdateArticleRes>>(`/api/articles/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除文章
export function DeleteArticle(id: number) {
  return request<baseResponse<string>>(`/api/articles/${id}`, {
    method: 'DELETE',
  });
}

// 获取用户文章列表
export function GetMyArticles(params?: ArticleListQuery) {
  return request<baseResponse<ArticleListRes>>('/api/articles/my', {
    method: 'GET',
    params,
  });
}

// 文章交互操作（点赞、收藏等）
export function ArticleAction(id: number, data: ArticleActionReq) {
  return request<baseResponse<string>>(`/api/articles/${id}/action`, {
    method: 'POST',
    data,
  });
}

// 获取用户文章收藏列表
export function GetFavoriteArticles() {
  return request<baseResponse<ArticleListRes>>('/api/articles/favorites', {
    method: 'GET',
  });
}

// 获取用户文章统计数据
export function GetArticleStats() {
  return request<baseResponse<ArticleStatsRes>>('/api/articles/stats', {
    method: 'GET',
  });
}

// 更新文章状态
export function UpdateArticleStatus(id: number, data: UpdateArticleStatusReq) {
  return request<baseResponse<UpdateArticleStatusRes>>(
    `/api/articles/${id}/status`,
    {
      method: 'PUT',
      data,
    },
  );
}

// 更新文章访问权限
export function UpdateArticleAccess(id: number, data: UpdateArticleAccessReq) {
  return request<baseResponse<UpdateArticleAccessRes>>(
    `/api/articles/${id}/access`,
    {
      method: 'PUT',
      data,
    },
  );
}

// 统一文章获取接口 - 替换搜索文章、热门文章、最新文章
export function GetArticles(params?: UnifiedArticleQuery) {
  return request<baseResponse<ArticleListRes>>('/api/articles', {
    method: 'GET',
    params,
  });
}

// 获取热门文章 - 使用统一接口
export function GetHotArticles(params?: { page?: number; page_size?: number }) {
  return GetArticles({
    ...params,
    sort_by: 'view_count',
    order: 'desc',
    status: 'published',
    access_type: 'public',
  });
}

// 获取最新文章 - 使用统一接口
export function GetLatestArticles(params?: {
  page?: number;
  page_size?: number;
}) {
  return GetArticles({
    ...params,
    sort_by: 'published_at',
    order: 'desc',
    status: 'published',
    access_type: 'public',
  });
}

// 搜索文章 - 使用统一接口（保持向后兼容）
export function SearchArticles(params?: SearchArticleQuery) {
  return GetArticles(params);
}

// 根据标签获取文章
export function GetArticlesByTag(id: number) {
  return request<baseResponse<ArticlesByTagRes>>(`/api/articles/tag/${id}`, {
    method: 'GET',
  });
}

// 根据分类获取文章
export function GetArticlesByCategory(id: number) {
  return request<baseResponse<ArticlesByCategoryRes>>(
    `/api/articles/category/${id}`,
    {
      method: 'GET',
    },
  );
}

// 获取文章点赞用户列表
export function GetArticleLikeUsers(id: number) {
  return request<baseResponse<ArticleLikeUsersRes>>(
    `/api/articles/${id}/like-users`,
    {
      method: 'GET',
    },
  );
}

// 统一导出文章相关的API和类型
export * from './type';
