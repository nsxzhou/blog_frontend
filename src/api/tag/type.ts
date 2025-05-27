// 标签信息接口
export interface TagInfo {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// 创建标签请求参数
export interface CreateTagReq {
  name: string;
}

// 创建标签响应数据
export interface CreateTagRes {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// 更新标签请求参数
export interface UpdateTagReq {
  name: string;
}

// 更新标签响应数据
export interface UpdateTagRes {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// 删除标签响应数据
export interface DeleteTagRes {
  success: boolean;
  message?: string;
}

// 获取标签详情响应数据
export interface GetTagDetailRes {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// 获取标签列表请求参数
export interface GetTagListReq {
  page?: number;
  page_size?: number;
  keyword?: string;
  order_by?: string;
  order?: 'asc' | 'desc';
}

// 分页信息接口
export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// 获取标签列表响应数据
export interface GetTagListRes {
  tags: TagInfo[];
  pagination: PaginationInfo;
}
