// 阅读历史记录信息接口
export interface ReadingHistoryItem {
  id: number;
  article_id: number;
  article_title: string;
  article_summary: string;
  article_cover: string;
  category_id: number;
  category_name: string;
  author_id: number;
  author_name: string;
  read_at: string;
  created_at: string;
}

// 获取阅读历史列表请求参数
export interface GetReadingHistoryReq {
  page: number;
  page_size: number;
  order_by?: string;
  order: string;
  end_date?: string;
  start_date?: string;
  usage_type?: string;
  keyword?: string;
  tag_id?: number;
  category_id?: number;
}

// 获取阅读历史列表响应数据
export interface GetReadingHistoryRes {
  total: number;
  list: ReadingHistoryItem[];
}

// 记录阅读历史请求参数
export interface CreateReadingHistoryReq {
  article_id: number;
}

// 删除阅读历史记录（批量）请求参数
export interface BatchDeleteReadingHistoryReq {
  ids: number[];
}
