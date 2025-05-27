// 分类信息接口
export interface CategoryInfo {
  id: number;
  name: string;
  description: string;
  icon: string;
  is_visible: number; // 0: 不可见, 1: 可见
  created_at: string;
  updated_at: string;
}

// 创建分类请求参数
export interface CreateCategoryReq {
  name: string;
  description: string;
  icon: string;
  is_visible: number;
}

// 创建分类响应数据
export interface CreateCategoryRes {
  id: number;
  name: string;
  description: string;
  icon: string;
  is_visible: number;
  created_at: string;
  updated_at: string;
}

// 更新分类请求参数
export interface UpdateCategoryReq {
  name?: string;
  description?: string;
  icon?: string;
  is_visible?: number;
}

// 更新分类响应数据
export interface UpdateCategoryRes {
  id: number;
  name: string;
  description: string;
  icon: string;
  is_visible: number;
  created_at: string;
  updated_at: string;
}

// 删除分类响应数据
export interface DeleteCategoryRes {
  success: boolean;
  message?: string;
}

// 获取分类详情响应数据
export interface GetCategoryDetailRes {
  id: number;
  name: string;
  description: string;
  icon: string;
  is_visible: number;
  created_at: string;
  updated_at: string;
}

// 获取分类列表请求参数
export interface GetCategoryListReq {
  page?: number;
  page_size?: number;
  keyword?: string;
  order_by?: string;
  order?: 'asc' | 'desc';
  is_visible?: number; // 可见性筛选
}

// 分页信息接口
export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// 获取分类列表响应数据
export interface GetCategoryListRes {
  categories: CategoryInfo[];
  pagination: PaginationInfo;
}

// 热门分类响应数据
export interface GetHotCategoriesRes {
  categories: CategoryInfo[];
}
