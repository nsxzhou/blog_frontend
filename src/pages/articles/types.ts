// 筛选参数类型
export interface FilterParams {
  keyword: string;
  status: 'all' | 'draft' | 'published' | 'archived';
  category_id?: number;
  tag_id?: number;
  access_type: 'all' | 'public' | 'private' | 'password';
  is_top?: number;
  is_original?: number;
  start_date: string;
  end_date: string;
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
export type BatchAction = 'delete' | 'publish' | 'draft' | 'archive';

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
