// 筛选参数类型
export interface FilterParams {
  keyword: string;
  status: '' | 'draft' | 'published';
  category_id?: number;
  tag_id?: number;
  access_type: '' | 'public' | 'private' | 'password';
  is_top?: 0 | 1 | 2;
  is_original?: 0 | 1 | 2;
  start_date: string;
  end_date: string;
  author_id?: number;
}

// 排序参数类型
export interface SortParams {
  order_by:
    | 'created_at'
    | 'updated_at'
    | 'published_at'
    | 'view_count'
    | 'like_count'
    | 'title';
  order: 'asc' | 'desc';
}

// 统计卡片数据类型
export interface StatsCardData {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    type: 'up' | 'down';
  };
}

// 批量操作类型
export type BatchAction = 'delete' | 'publish' | 'draft';

// 文章状态标签颜色类型
export interface StatusConfig {
  color: string;
  bgColor: string;
  text: string;
}

// 访问类型配置
export interface AccessConfig {
  color: string;
  bgColor: string;
  text: string;
  icon: React.ReactNode;
}
