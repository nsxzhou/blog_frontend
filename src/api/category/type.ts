// 分类信息接口
export interface CategoryInfo {
  id: number;
  name: string;
  description: string;
  icon: string;
  article_count: number;
  is_visible: 0 | 1 ; // 0: 不可见, 1: 可见
  created_at: string;
  updated_at: string;
}

// 创建分类请求参数
export interface CreateCategoryReq {
  name: string;
  description: string;
  icon: string;
  is_visible: 0 | 1 ;
}

// 创建分类响应数据
export interface CreateCategoryRes {
  category: CategoryInfo;
}

// 更新分类请求参数
export interface UpdateCategoryReq {
  name?: string;
  description?: string;
  icon?: string;
  is_visible?: 0 | 1 ;
}

// 更新分类响应数据
export interface UpdateCategoryRes {
  category: CategoryInfo;
}

// 获取分类详情响应数据
export interface GetCategoryDetailRes {
  category: CategoryInfo;
}

// 获取分类列表请求参数
export interface GetCategoryListReq {
  page?: number;
  page_size?: number;
  keyword?: string;
  order_by?: string;
  order?: 'asc' | 'desc';
  is_visible?: 0 | 1 | 2; // 可见性筛选
}

// 获取分类列表响应数据
export interface GetCategoryListRes {
  list: CategoryInfo[];
  total: number;
}

export interface GetHotCategoryRes {
  list: {
    id: number;
    name: string;
    icon: string;
    article_count: number;
  }[];
}
