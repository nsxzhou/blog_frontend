// 图片信息接口
export interface ImageInfo {
  id: number;
  url: string;
  path: string;
  filename: string;
  size: number;
  width: number;
  height: number;
  mime_type: string;
  user_id: number;
  user_name: string;
  user_avatar: string;
  usage_type: string;
  article_id: number;
  is_external: number;
  storage_type: string;
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
  url: string;
  path: string;
  filename: string;
  size: number;
  width: number;
  height: number;
  mime_type: string;
  usage_type: string;
  storage_type: string;
}

// 更新图片信息请求参数
export interface UpdateImageReq {
  usage_type?: string;
  article_id?: number;
}

// 批量删除图片请求参数
export interface BatchDeleteImageReq {
  image_ids: number[];
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

// 获取图片列表响应数据
export interface GetImageListRes {
  list: ImageInfo[];
  total: number;
}

// 存储配置信息
export interface StorageConfig {
  local_enabled: boolean;
  cos_enabled: boolean;
  default_storage: string;
  max_file_size: number;
  allowed_types: string[];
  local_upload_path: string;
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
  local_images: number;
  cos_images: number;
  avatar_images: number;
  cover_images: number;
  content_images: number;
  daily_stats: [
    {
      date: string;
      count: number;
      size: number;
      local: number;
      cos: number;
    },
  ];
}
