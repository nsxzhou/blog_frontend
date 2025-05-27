// 图片信息接口
export interface ImageInfo {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  size: number;
  mime_type: string;
  usage_type: string; // cover, avatar, content 等
  article_id?: number;
  storage_type: string; // cos, local 等
  is_external: number; // 0: 本地, 1: 外部
  created_at: string;
  updated_at: string;
}

// 上传图片请求参数
export interface UploadImageReq {
  image: File;
  usage_type: string;
  article_id?: number;
  storage_type: string;
}

// 上传图片响应数据
export interface UploadImageRes {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  size: number;
  mime_type: string;
  usage_type: string;
  article_id?: number;
  storage_type: string;
  is_external: number;
  created_at: string;
  updated_at: string;
}

// 更新图片信息请求参数
export interface UpdateImageReq {
  usage_type?: string;
  article_id?: number;
}

// 更新图片信息响应数据
export interface UpdateImageRes {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  size: number;
  mime_type: string;
  usage_type: string;
  article_id?: number;
  storage_type: string;
  is_external: number;
  created_at: string;
  updated_at: string;
}

// 删除图片响应数据
export interface DeleteImageRes {
  success: boolean;
  message?: string;
}

// 批量删除图片请求参数
export interface BatchDeleteImageReq {
  image_ids: number[];
}

// 批量删除图片响应数据
export interface BatchDeleteImageRes {
  success: boolean;
  deleted_count: number;
  message?: string;
}

// 获取图片详情响应数据
export interface GetImageDetailRes {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  size: number;
  mime_type: string;
  usage_type: string;
  article_id?: number;
  storage_type: string;
  is_external: number;
  created_at: string;
  updated_at: string;
}

// 获取图片列表请求参数
export interface GetImageListReq {
  page?: number;
  page_size?: number;
  article_id?: number;
  is_external?: number;
  start_date?: string;
  end_date?: string;
  usage_type?: string;
}

// 分页信息接口
export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// 获取图片列表响应数据
export interface GetImageListRes {
  images: ImageInfo[];
  pagination: PaginationInfo;
}

// 存储配置信息
export interface StorageConfig {
  storage_type: string;
  max_file_size: number;
  allowed_extensions: string[];
  upload_path: string;
}

// 获取存储配置响应数据
export interface GetStorageConfigRes {
  configs: StorageConfig[];
}

// 根据类型获取图片请求参数
export interface GetImagesByTypeReq {
  type: string;
  page?: number;
  page_size?: number;
  article_id?: number;
  is_external?: number;
  start_date?: string;
  end_date?: string;
  usage_type?: string;
}

// 根据文章ID获取图片请求参数
export interface GetImagesByArticleReq {
  article_id: number;
  page?: number;
  page_size?: number;
  is_external?: number;
  start_date?: string;
  end_date?: string;
  usage_type?: string;
}

// 图片统计数据
export interface ImageStatistics {
  total_images: number;
  total_size: number;
  by_usage_type: Record<string, number>;
  by_storage_type: Record<string, number>;
  by_month: Array<{
    month: string;
    count: number;
    size: number;
  }>;
}

// 获取图片统计响应数据
export interface GetImageStatisticsRes {
  statistics: ImageStatistics;
}
