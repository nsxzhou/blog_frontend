import { request } from '@umijs/max';
import type { RSSQuery } from './type';

// 获取RSS订阅数据
export function GetRSSFeed(params?: RSSQuery) {
  return request<string>('/api/rss', {
    method: 'GET',
    params,
    responseType: 'text', // RSS返回XML文本格式
  });
}

// 获取RSS订阅链接
export function getRSSUrl(params?: RSSQuery): string {
  const baseUrl = window.location.origin;
  const searchParams = new URLSearchParams();

  if (params?.limit) {
    searchParams.append('limit', params.limit.toString());
  }
  if (params?.category_id) {
    searchParams.append('category_id', params.category_id.toString());
  }
  if (params?.tag_id) {
    searchParams.append('tag_id', params.tag_id.toString());
  }

  const queryString = searchParams.toString();
  return `${baseUrl}/api/rss${queryString ? `?${queryString}` : ''}`;
}

// 统一导出RSS相关的API和类型
export * from './type';
