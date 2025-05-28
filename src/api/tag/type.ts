// 标签信息接口
export interface TagInfo {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  article_count: number;
}

// 创建标签请求参数
export interface CreateTagReq {
  name: string;
}

// 创建标签响应数据
export interface CreateTagRes {
  tag: TagInfo;
}

// 更新标签请求参数
export interface UpdateTagReq {
  name: string;
}

// 更新标签响应数据
export interface UpdateTagRes {
  tag: TagInfo;
}

// 获取标签详情响应数据
export interface GetTagDetailRes {
  tag: TagInfo;
}

// 获取标签列表请求参数
export interface GetTagListReq {
  page?: number;
  page_size?: number;
  keyword?: string;
  order_by?: string;
  order?: 'asc' | 'desc';
}

// 获取标签列表响应数据
export interface GetTagListRes {
  list: TagInfo[];
  total: number;
}
